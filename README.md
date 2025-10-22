# GitAICommits

<p align="center">
  <strong>使用AI自动生成Git提交信息的命令行工具</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/gitaicommits" alt="npm version">
  <img src="https://img.shields.io/npm/l/gitaicommits" alt="license">
  <img src="https://img.shields.io/npm/dt/gitaicommits" alt="downloads">
</p>

## 📖 简介

GitAICommit 是一个智能的Git提交信息生成工具，利用AI模型自动分析代码变更内容，生成符合规范的提交信息。支持多种AI模型，包括OpenAI、DeepSeek和阿里云通义千问。

## ✨ 特性

- 支持多种AI模型：OpenAI GPT、DeepSeek、阿里云通义千问
- 自动分析Git变更内容
- 生成符合规范的提交信息
- 支持命令行配置和使用
- 支持中英文输出
- 可选择自动执行git commit

## 🚀 安装

```bash
# 全局安装
npm install -g gitaicommits

# 或在项目中安装
npm install --save-dev gitaicommits
```

## ⚙️ 配置

首次使用前，需要配置API密钥和模型设置：

```bash
# 设置API密钥（以OpenAI为例）
gitaicommits config --api-key sk-your-api-key

# 设置模型类型
gitaicommits config --model openai

# 设置模型名称
gitaicommits config --model-name gpt-3.5-turbo

# 设置语言（中文/英文）
gitaicommits config --language zh

# 查看当前配置
gitaicommits config --show
```

### 支持的配置项

| 配置项 | 说明 | 默认值 | 可选值 |
|--------|------|--------|--------|
| apiKey | API密钥 | - | - |
| model | AI模型 | openai | openai, deepseek, qwen |
| modelName | 模型名称 | gpt-3.5-turbo | 根据所选模型而定 |
| temperature | 温度值 | 0.7 | 0.0-1.0 |
| maxTokens | 最大token数 | 200 | - |
| language | 语言 | zh | zh, en |

## 📝 使用方法

### 1. 生成提交信息（不自动提交）

在有未提交更改的Git仓库中运行：

```bash
# 简单方式
gitaicommits

# 或使用命令
gitaicommits generate
```

工具会自动分析更改并生成提交信息，显示在终端中，然后需要手动复制使用。

### 2. 生成并自动提交

```bash
# 使用commit命令
gitaicommits commit

# 或使用generate命令加参数
gitaicommits generate --commit
```

### 3. 示例

```bash
# 配置OpenAI模型
gitaicommits config --api-key sk-123456 --model openai --model-name gpt-4

# 查看配置
gitaicommits config --show

# 生成并提交信息
gitaicommits commit
```

## 🛠️ 模型支持

### OpenAI

- 支持模型：gpt-3.5-turbo, gpt-4 等
- API端点：https://api.openai.com/v1/chat/completions

### DeepSeek

- 支持模型：deepseek-coder 等
- API端点：https://api.deepseek.com/chat/completions

### 阿里云通义千问

- 支持模型：qwen-turbo 等
- API端点：https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation

## 🔒 安全说明

- API密钥会保存在用户主目录下的 `.gitaicommit/config.json` 文件中
- 请确保不要将包含API密钥的配置文件提交到代码仓库

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📋 开发计划 (TODO)

### 近期计划
- [ ] **代码问题自动识别**：分析提交的代码变更，自动识别潜在的bug、安全漏洞和性能问题
- [ ] **改进代码问题识别算法**：提高代码问题检测的准确性和覆盖面
- [ ] **支持更多编程语言**：扩展对各种编程语言的问题识别支持
- [ ] **提供问题修复建议**：不仅识别问题，还提供相应的修复建议

### 未来功能
- [ ] 集成单元测试覆盖率分析
- [ ] 支持团队协作和代码审查功能
- [ ] 添加用户自定义规则支持
- [ ] 提供代码质量趋势分析报告

## 📄 许可证

[MIT](https://opensource.org/licenses/MIT)