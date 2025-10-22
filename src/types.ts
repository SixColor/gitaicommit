// 配置类型
export interface Config {
  apiKey: string;
  model: 'openai' | 'deepseek' | 'qwen';
  modelName: string;
  temperature: number;
  maxTokens: number;
  language: 'zh' | 'en';
}

// AI模型接口
export interface AIModel {
  generateCommitMessage(diff: string, config: Config): Promise<string>;
  checkCodeIssues(diff: string, config: Config): Promise<string>;
}

// Git差异信息
export interface GitDiff {
  files: GitDiffFile[];
  summary: string;
}

export interface GitDiffFile {
  path: string;
  changes: string;
  added: number;
  removed: number;
}