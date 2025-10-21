import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Config } from './types';

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Config = {
  apiKey: '',
  model: 'openai',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 200,
  language: 'zh'
};

/**
 * 配置文件路径
 */
const CONFIG_FILE_PATH = path.join(os.homedir(), '.gitaicommit', 'config.json');

/**
 * 配置管理类
 */
export class ConfigManager {
  /**
   * 读取配置
   */
  static readConfig(): Config {
    try {
      if (fs.existsSync(CONFIG_FILE_PATH)) {
        const configContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
        const userConfig = JSON.parse(configContent);
        return { ...DEFAULT_CONFIG, ...userConfig };
      }
      return DEFAULT_CONFIG;
    } catch (error) {
      console.error('读取配置文件失败:', error instanceof Error ? error.message : String(error));
      return DEFAULT_CONFIG;
    }
  }

  /**
   * 保存配置
   */
  static saveConfig(config: Partial<Config>): void {
    // 获取当前配置以确定语言
    const currentConfig = this.readConfig();
    
    try {
      // 确保配置目录存在
      const configDir = path.dirname(CONFIG_FILE_PATH);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // 合并现有配置和新配置
      const newConfig = { ...currentConfig, ...config };

      // 保存配置
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2));
      const messages = {
        zh: '✅ 配置已保存到:',
        en: '✅ Configuration saved to:'
      };
      console.log(`${messages[newConfig.language]} ${CONFIG_FILE_PATH}`);
    } catch (error) {
      console.error('保存配置文件失败:', error instanceof Error ? error.message : String(error));
      throw new Error(currentConfig.language === 'zh' ? '无法保存配置' : 'Failed to save configuration');
    }
  }

  /**
   * 显示当前配置
   */
  static showConfig(): void {
    const config = this.readConfig();
    const messages = {
      zh: {
        title: '当前配置:',
        model: '模型:',
        modelName: '模型名称:',
        apiKey: 'API密钥:',
        apiKeyNotSet: '未设置',
        temperature: '温度值:',
        maxTokens: '最大 tokens:',
        language: '语言:',
        languageZh: '中文',
        languageEn: '英文'
      },
      en: {
        title: 'Current Configuration:',
        model: 'Model:',
        modelName: 'Model Name:',
        apiKey: 'API Key:',
        apiKeyNotSet: 'not set',
        temperature: 'Temperature:',
        maxTokens: 'Max Tokens:',
        language: 'Language:',
        languageZh: 'Chinese',
        languageEn: 'English'
      }
    };

    const msg = messages[config.language];

    console.log('\n' + msg.title);
    console.log('-------------------');
    console.log(`${msg.model} ${config.model}`);
    console.log(`${msg.modelName} ${config.modelName}`);
    console.log(`${msg.apiKey} ${config.apiKey ? '******' : msg.apiKeyNotSet}`);
    console.log(`${msg.temperature} ${config.temperature}`);
    console.log(`${msg.maxTokens} ${config.maxTokens}`);
    console.log(`${msg.language} ${config.language === 'zh' ? msg.languageZh : msg.languageEn}`);
    console.log('-------------------\n');
  }

  /**
   * 验证配置是否有效
   */
  static validateConfig(config: Config): boolean {
    const messages = {
      zh: {
        apiKeyError: '❌ 错误: API密钥未设置',
        apiKeyHelp: '请使用 `gitaicommit config --api-key <your-api-key>` 设置API密钥',
        modelError: `❌ 错误: 无效的模型类型: ${config.model}`,
        modelHelp: `有效的模型类型: `
      },
      en: {
        apiKeyError: '❌ Error: API key not set',
        apiKeyHelp: 'Please use `gitaicommit config --api-key <your-api-key>` to set API key',
        modelError: `❌ Error: Invalid model type: ${config.model}`,
        modelHelp: 'Valid model types: '
      }
    };

    const msg = messages[config.language];

    if (!config.apiKey) {
      console.error(msg.apiKeyError);
      console.error(msg.apiKeyHelp);
      return false;
    }

    const validModels = ['openai', 'deepseek', 'qwen'];
    if (!validModels.includes(config.model)) {
      console.error(msg.modelError);
      console.error(`${msg.modelHelp}${validModels.join(', ')}`);
      return false;
    }

    return true;
  }
}