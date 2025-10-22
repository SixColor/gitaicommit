import { execSync } from 'child_process';
import { GitDiff, GitDiffFile } from './types';

/**
 * Git工具类，用于获取和解析Git差异信息
 */
export class GitUtils {
  /**
   * 获取当前未提交的更改差异
   */
  static getDiff(language: 'zh' | 'en' = 'zh', files?: string[]): string {
    const messages = {
      zh: {
        errorLog: '获取Git差异信息失败:',
        errorMessage: '无法获取Git差异信息，请确保在Git仓库中运行'
      },
      en: {
        errorLog: 'Failed to get Git diff information:',
        errorMessage: 'Unable to get Git diff information, please make sure you are in a Git repository'
      }
    };

    const msg = messages[language];
    
    try {
      // 构建命令，支持指定文件
      const baseCmd = 'git diff --name-status';
      const cachedCmd = 'git diff --cached --name-status HEAD';
      let cmd = cachedCmd;
      
      if (files && files.length > 0) {
        cmd += ' -- ' + files.map(f => `"${f}"`).join(' ');
      }
      
      // 获取已暂存的更改
      let diff = execSync(cmd, { encoding: 'utf-8' });
      
      if (!diff.trim()) {
        // 如果没有已暂存的更改，尝试获取未暂存的更改
        cmd = baseCmd;
        if (files && files.length > 0) {
          cmd += ' -- ' + files.map(f => `"${f}"`).join(' ');
        }
        diff = execSync(cmd, { encoding: 'utf-8' });
      }
      
      return diff;
    } catch (error) {
      console.error(msg.errorLog, error instanceof Error ? error.message : String(error));
      throw new Error(msg.errorMessage);
    }
  }

  /**
   * 获取详细的文件差异内容
   */
  static getDetailedDiff(language: 'zh' | 'en' = 'zh', files?: string[]): string {
    const messages = {
      zh: {
        errorLog: '获取详细Git差异失败:',
        errorMessage: '无法获取Git差异详细信息'
      },
      en: {
        errorLog: 'Failed to get detailed Git diff:',
        errorMessage: 'Unable to get detailed Git diff information'
      }
    };

    const msg = messages[language];
    
    try {
      // 构建命令，支持指定文件
      const cachedCmd = 'git diff --cached';
      const unstagedCmd = 'git diff';
      
      let cmd = cachedCmd;
      if (files && files.length > 0) {
        cmd += ' -- ' + files.map(f => `"${f}"`).join(' ');
      }
      
      // 尝试获取已暂存的更改
      const stagedDiff = execSync(cmd, { encoding: 'utf-8' });
      
      if (stagedDiff.trim()) {
        return stagedDiff;
      }
      
      // 如果没有已暂存的更改，获取未暂存的更改
      cmd = unstagedCmd;
      if (files && files.length > 0) {
        cmd += ' -- ' + files.map(f => `"${f}"`).join(' ');
      }
      
      return execSync(cmd, { encoding: 'utf-8' });
    } catch (error) {
      console.error(msg.errorLog, error instanceof Error ? error.message : String(error));
      throw new Error(msg.errorMessage);
    }
  }

  /**
   * 解析Git差异信息
   */
  static parseDiff(diff: string, language: 'zh' | 'en' = 'zh'): GitDiff {
    const lines = diff.trim().split('\n');
    const files: GitDiffFile[] = [];
    let added = 0;
    let removed = 0;

    for (const line of lines) {
      if (line.trim()) {
        const [status, path] = line.split(/\s+/);
        if (status && path) {
          files.push({
            path,
            changes: status,
            added: status === 'A' || status === 'M' ? 1 : 0,
            removed: status === 'D' ? 1 : 0
          });
          
          if (status === 'A' || status === 'M') added++;
          if (status === 'D') removed++;
        }
      }
    }

    const messages = {
      zh: {
        summary: `${added} 个文件已更改，${removed} 个文件已删除`
      },
      en: {
        summary: `${added} files changed, ${removed} files deleted`
      }
    };

    return {
      files,
      summary: messages[language].summary
    };
  }

  /**
   * 执行Git提交
   */
  static commit(message: string, language: 'zh' | 'en' = 'zh', files?: string[]): void {
    const messages = {
      zh: {
        success: '✅ 提交成功！',
        errorLog: 'Git提交失败:',
        errorMessage: 'Git提交失败',
        stagingFiles: '🔄 正在暂存修改的文件...'
      },
      en: {
        success: '✅ Commit successful!',
        errorLog: 'Git commit failed:',
        errorMessage: 'Git commit failed',
        stagingFiles: '🔄 Staging modified files...'
      }
    };

    const msg = messages[language];
    
    try {
      // 使用临时文件处理多行提交信息
      const { writeFileSync, unlinkSync, tmpdir } = require('fs');
      const path = require('path');
      const tempFilePath = path.join(tmpdir(), `commit_msg_${Date.now()}.txt`);
      
      try {
        // 暂存文件
        console.log(msg.stagingFiles);
        if (files && files.length > 0) {
          // 只暂存指定的文件
          const addCmd = `git add ${files.map(f => `"${f}"`).join(' ')}`;
          execSync(addCmd, { encoding: 'utf-8' });
        } else {
          // 暂存所有修改的跟踪文件
          execSync('git add -u', { encoding: 'utf-8' });
        }
        
        // 写入提交信息到临时文件
        writeFileSync(tempFilePath, message, { encoding: 'utf-8' });
        
        // 使用-F选项从文件读取提交信息
        execSync(`git commit -F "${tempFilePath}"`, { encoding: 'utf-8' });
        console.log(msg.success);
      } finally {
        // 确保删除临时文件
        try {
          unlinkSync(tempFilePath);
        } catch (e) {
          // 忽略删除临时文件的错误
        }
      }
    } catch (error) {
      console.error(msg.errorLog, error instanceof Error ? error.message : String(error));
      throw new Error(msg.errorMessage);
    }
  }

  /**
   * 检查是否在Git仓库中
   */
  static isInGitRepository(): boolean {
    try {
      execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取当前分支名称
   */
  static getCurrentBranch(): string {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return 'unknown';
    }
  }
}