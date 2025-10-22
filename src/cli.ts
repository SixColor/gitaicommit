#!/usr/bin/env node
import { program } from 'commander';
import { GitAICommit } from './index';
import { ConfigManager } from './config';
import { Config } from './types';

// 定义版本
const packageJson = require('../package.json');

// 创建命令行程序
program
  .name('gitaicommit')
  .version(packageJson.version)
  .description('使用AI自动生成Git提交信息');

// 配置命令
program
  .command('config')
  .description('配置GitAICommit')
  .option('-a, --api-key <key>', '设置API密钥')
  .option('-m, --model <model>', '设置模型 (openai, deepseek, qwen)')
  .option('-n, --model-name <name>', '设置模型名称')
  .option('-t, --temperature <temp>', '设置温度值', parseFloat)
  .option('-k, --max-tokens <tokens>', '设置最大tokens数', parseInt)
  .option('-l, --language <lang>', '设置语言 (zh, en)')
  .option('--show', '显示当前配置')
  .action((options) => {
    if (options.show) {
      ConfigManager.showConfig();
      return;
    }

    const configUpdates: Partial<Config> = {};
    
    if (options.apiKey) configUpdates.apiKey = options.apiKey;
    if (options.model) configUpdates.model = options.model as Config['model'];
    if (options.modelName) configUpdates.modelName = options.modelName;
    if (options.temperature !== undefined) configUpdates.temperature = options.temperature;
    if (options.maxTokens !== undefined) configUpdates.maxTokens = options.maxTokens;
    if (options.language) configUpdates.language = options.language as Config['language'];

    if (Object.keys(configUpdates).length > 0) {
      // 如果设置了新的语言，使用新语言；否则使用当前语言
      const targetLanguage = options.language || ConfigManager.readConfig().language;
      ConfigManager.saveConfig(configUpdates);
      console.log(targetLanguage === 'zh' ? '✅ 配置已更新' : '✅ Configuration updated');
    } else {
      const currentLanguage = ConfigManager.readConfig().language;
      console.log(currentLanguage === 'zh' ? '请指定要设置的配置项，使用 --help 查看可用选项' : 'Please specify configuration items to set, use --help to see available options');
    }
  });

// 生成提交信息命令
program
  .command('generate')
  .alias('g')
  .description('生成提交信息')
  .option('-c, --commit', '自动执行git commit')
  .option('-i, --check-issues', '同时检查并显示代码潜在问题')
  .argument('[files...]', '指定要分析的文件路径')
  .action(async (files, options) => {
    try {
      const gitAICommit = new GitAICommit();
      await gitAICommit.generateAndCommit(options.commit, options.checkIssues, files);
    } catch (error) {
      const currentLanguage = ConfigManager.readConfig().language;
      const errorMsg = currentLanguage === 'zh' ? '❌ 操作失败:' : '❌ Operation failed:';
      console.error(errorMsg, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// 快速提交命令
program
  .command('commit')
  .alias('c')
  .description('生成并提交信息')
  .option('-i, --check-issues', '同时检查并显示代码潜在问题')
  .argument('[files...]', '指定要分析的文件路径')
  .action(async (files, options) => {
    try {
      const gitAICommit = new GitAICommit();
      await gitAICommit.generateAndCommit(true, options.checkIssues, files);
    } catch (error) {
      const currentLanguage = ConfigManager.readConfig().language;
      const errorMsg = currentLanguage === 'zh' ? '❌ 操作失败:' : '❌ Operation failed:';
      console.error(errorMsg, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// 代码问题检查命令
program
  .command('check')
  .alias('i')
  .description('使用AI检查本次提交代码的潜在问题')
  .argument('[files...]', '指定要分析的文件路径')
  .action(async (files) => {
    try {
      const gitAICommit = new GitAICommit();
      await gitAICommit.checkCodeIssues(files);
    } catch (error) {
      const currentLanguage = ConfigManager.readConfig().language;
      const errorMsg = currentLanguage === 'zh' ? '❌ 操作失败:' : '❌ Operation failed:';
      console.error(errorMsg, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// 默认命令 (不指定命令时的行为)
program
  .argument('[files...]', '指定要分析的文件路径')
  .action(async (files) => {
    try {
      const gitAICommit = new GitAICommit();
      await gitAICommit.generateAndCommit(false, false, files);
    } catch (error) {
      const currentLanguage = ConfigManager.readConfig().language;
      const errorMsg = currentLanguage === 'zh' ? '❌ 操作失败:' : '❌ Operation failed:';
      console.error(errorMsg, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse(process.argv);