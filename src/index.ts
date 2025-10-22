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
  async generateAndCommit(autoCommit: boolean = false, checkIssues: boolean = false, files?: string[]): Promise<string> {
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
        checkIssues: `🔍 使用 ${this.config.model} 模型检查代码问题...`,
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
        checkIssues: `🔍 Checking code issues using ${this.config.model} model...`,
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
    // 显示指定文件信息
    if (files && files.length > 0) {
      console.log(`🔍 正在分析指定的文件: ${files.join(', ')}`);
    }
    const diff = GitUtils.getDetailedDiff(this.config.language, files);
    
    if (!diff.trim()) {
      throw new Error(msg.noChanges);
    }

    // 解析差异信息
    const parsedDiff = GitUtils.parseDiff(GitUtils.getDiff(this.config.language, files), this.config.language);
    console.log(`📄 ${parsedDiff.summary}`);

    // 生成提交信息
    let commitMessage: string;
    let shouldCommit = false;
    
    try {
      // 如果需要检查代码问题
      if (checkIssues) {
        console.log(msg.checkIssues || `🔍 使用 ${this.config.model} 模型检查代码问题...`);
        await this.checkCodeIssues(files);
        // 添加明显的分隔符，区分问题分析和提交信息
        console.log('\n==================================================');
        console.log('                    提交信息                      ');
        console.log('==================================================\n');
      }

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

      // 提交 - 当用户确认提交(shouldCommit=true)时，无论autoCommit参数如何都执行提交
      if (shouldCommit) {
        GitUtils.commit(commitMessage, this.config.language, files);
        // 注意：GitUtils.commit内部已经有成功消息输出，这里不再重复输出
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
   * 检查代码中的潜在问题
   */
  async checkCodeIssues(files?: string[]): Promise<string> {
    // 多语言消息对象
    const messages = {
      zh: {
        invalidConfig: '配置无效',
        notInGitRepo: '错误: 不在Git仓库中，请在Git仓库目录下运行',
        noChanges: '没有检测到未提交的更改',
        error: '❌ 检查代码问题失败:'
      },
      en: {
        invalidConfig: 'Invalid configuration',
        notInGitRepo: 'Error: Not in a Git repository, please run in a Git repository directory',
        noChanges: 'No uncommitted changes detected',
        error: '❌ Failed to check code issues:'
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
    // 注意：这里不再输出日志，因为在generateAndCommit中已经输出了
    const diff = GitUtils.getDetailedDiff(this.config.language, files);
    
    if (!diff.trim()) {
      throw new Error(msg.noChanges);
    }

    // 注意：不再解析和显示差异摘要，因为在generateAndCommit中已经显示了

    // 检查代码问题
      try {
        // 直接使用固定的日志消息，不再依赖msg对象
        console.log(`🔍 分析代码潜在问题...`);
        const issues = await this.model.checkCodeIssues(diff, this.config);
      
      console.log('\n🔍 代码问题分析结果:');
      console.log('-------------------');
      console.log(issues);
      console.log('-------------------\n');

      return issues;
    } catch (error) {
      console.error(msg.error, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): Config {
    return { ...this.config };
  }
}