import axios from 'axios';
import { AIModel, Config } from '../types';

// OpenAI模型实现
export class OpenAIModel implements AIModel {
  async generateCommitMessage(diff: string, config: Config): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.modelName || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: config.language === 'zh' 
              ? '你是一个专业的代码提交信息生成助手。请基于以下Git差异内容，生成一个简洁、清晰的提交信息。提交信息应该遵循格式：<类型>: <简短描述>\n\n<详细描述>，其中类型可以是feat、fix、docs、style、refactor、perf、test、chore等。' 
              : 'You are a professional commit message generator. Please generate a concise and clear commit message based on the following Git diff. The commit message should follow the format: <type>: <short description>\n\n<detailed description>, where type can be feat, fix, docs, style, refactor, perf, test, chore, etc.'
          },
          {
            role: 'user',
            content: `Git diff:\n${diff}`
          }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 200
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  }
}

// DeepSeek模型实现
export class DeepSeekModel implements AIModel {
  async generateCommitMessage(diff: string, config: Config): Promise<string> {
    // 使用最新的DeepSeek API端点和模型配置
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: config.modelName || 'deepseek-coder',
        messages: [
          {
            role: 'system',
            content: config.language === 'zh' 
              ? '你是一个专业的代码提交信息生成助手。请基于以下Git差异内容，生成一个简洁、清晰的提交信息。提交信息应该遵循格式：<类型>: <简短描述>\n\n<详细描述>，其中类型可以是feat、fix、docs、style、refactor、perf、test、chore等。' 
              : 'You are a professional commit message generator. Please generate a concise and clear commit message based on the following Git diff. The commit message should follow the format: <type>: <short description>\n\n<detailed description>, where type can be feat, fix, docs, style, refactor, perf, test, chore, etc.'
          },
          {
            role: 'user',
            content: `Git diff:\n${diff}`
          }
        ],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 200
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  }
}

// Qwen模型实现
export class QwenModel implements AIModel {
  async generateCommitMessage(diff: string, config: Config): Promise<string> {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: config.modelName || 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'system',
              content: config.language === 'zh' 
                ? '你是一个专业的代码提交信息生成助手。请基于以下Git差异内容，生成一个简洁、清晰的提交信息。提交信息应该遵循格式：<类型>: <简短描述>\n\n<详细描述>，其中类型可以是feat、fix、docs、style、refactor、perf、test、chore等。' 
                : 'You are a professional commit message generator. Please generate a concise and clear commit message based on the following Git diff. The commit message should follow the format: <type>: <short description>\n\n<detailed description>, where type can be feat, fix, docs, style, refactor, perf, test, chore, etc.'
            },
            {
              role: 'user',
              content: `Git diff:\n${diff}`
            }
          ]
        },
        parameters: {
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 200
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      }
    );

    return response.data.output.text.trim();
  }
}

// 模型工厂
export function createModel(modelType: string): AIModel {
  switch (modelType.toLowerCase()) {
    case 'openai':
      return new OpenAIModel();
    case 'deepseek':
      return new DeepSeekModel();
    case 'qwen':
      return new QwenModel();
    default:
      throw new Error(`Unsupported model type: ${modelType}`);
  }
}