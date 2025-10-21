import { Config, AIModel } from './types';
import { createModel } from './models';
import { GitUtils } from './git';
import { ConfigManager } from './config';
import * as readline from 'readline';
import { promisify } from 'util';

/**
 * GitAICommit 主类
 */
export class GitAICommit {
  private config: Config;
  private model: AIModel;

  constructor(config?: Config) {
    this.config = config || ConfigManager.readConfig();
    this.model = createModel(this.config.model);
  }

  /**
   * 生成并提交Git提交信息
   */
  async generateAndCommit(autoCommit: boolean = false): Promise<string> {
    // 创建交互式命令行接口
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // 将readline.question转换为Promise
    const question = async (query: string): Promise<string> => {
      return new Promise(resolve => {
        rl.question(query, resolve);
      });
    };
    // 多语言消息对象
    const messages = {
      zh: {
        invalidConfig: '配置无效',
        notInGitRepo: '错误: 不在Git仓库中，请在Git仓库目录下运行',
        getDiff: '🔍 获取Git差异信息...',
        noChanges: '没有检测到未提交的更改',
        generateMessage: `🤖 使用 ${this.config.model} 模型生成提交信息...`,
        generatedMessage: '\n📝 生成的提交信息:',
        error: '❌ 生成提交信息失败:',
        confirmCommit: '\n确认提交此信息吗？(y/n/r - 是/否/重新生成): ',
        commitSuccess: '✅ 提交成功!',
        commitCancelled: '❌ 提交已取消',
        regenerating: '🔄 重新生成提交信息...',
        invalidInput: '输入无效，请输入 y、n 或 r'
      },
      en: {
        invalidConfig: 'Invalid configuration',
        notInGitRepo: 'Error: Not in a Git repository, please run in a Git repository directory',
        getDiff: '🔍 Getting Git diff information...',
        noChanges: 'No uncommitted changes detected',
        generateMessage: `🤖 Generating commit message using ${this.config.model} model...`,
        generatedMessage: '\n📝 Generated commit message:',
        error: '❌ Failed to generate commit message:',
        confirmCommit: '\nConfirm commit with this message? (y/n/r - yes/no/regenerate): ',
        commitSuccess: '✅ Commit successful!',
        commitCancelled: '❌ Commit cancelled',
        regenerating: '🔄 Regenerating commit message...',
        invalidInput: 'Invalid input, please enter y, n or r'
      }
    };

    const msg = messages[this.config.language];

    // 验证配置
    if (!ConfigManager.validateConfig(this.config)) {
      throw new Error(msg.invalidConfig);
    }

    // 检查是否在Git仓库中
    if (!GitUtils.isInGitRepository()) {
      throw new Error(msg.notInGitRepo);
    }

    // 获取Git差异
    console.log(msg.getDiff);
    const diff = GitUtils.getDetailedDiff(this.config.language);
    
    if (!diff.trim()) {
      throw new Error(msg.noChanges);
    }

    // 解析差异信息
    const parsedDiff = GitUtils.parseDiff(GitUtils.getDiff(this.config.language), this.config.language);
    console.log(`📄 ${parsedDiff.summary}`);

    // 生成提交信息
    let commitMessage: string;
    let shouldCommit = false;
    
    try {
      // 循环直到用户确认或取消
      while (true) {
        console.log(msg.generateMessage);
        commitMessage = await this.model.generateCommitMessage(diff, this.config);
        
        console.log(msg.generatedMessage);
        console.log('-------------------');
        console.log(commitMessage);
        console.log('-------------------\n');

        // 询问用户确认
        const answer = await question(msg.confirmCommit);
        const choice = answer.trim().toLowerCase();
        
        if (choice === 'y' || choice === 'yes') {
          shouldCommit = true;
          break;
        } else if (choice === 'n' || choice === 'no') {
          console.log(msg.commitCancelled);
          shouldCommit = false;
          break;
        } else if (choice === 'r' || choice === 'regenerate') {
          console.log(msg.regenerating);
          continue;
        } else {
          console.log(msg.invalidInput);
        }
      }

      // 提交
      if (autoCommit && shouldCommit) {
        GitUtils.commit(commitMessage, this.config.language);
        console.log(msg.commitSuccess);
      }

      return commitMessage;
    } catch (error) {
      console.error(msg.error, error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      // 关闭readline接口
      rl.close();
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<Config>): void {
    ConfigManager.saveConfig(newConfig);
    this.config = { ...this.config, ...newConfig };
    this.model = createModel(this.config.model);
  }

  /**
   * 获取当前配置
   */
  getConfig(): Config {
    return { ...this.config };
  }
}