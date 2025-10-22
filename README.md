# GitAICommits

<p align="center">
  <strong>AI-Powered Git Commit Message Generator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/gitaicommits" alt="npm version">
  <img src="https://img.shields.io/npm/l/gitaicommits" alt="license">
  <img src="https://img.shields.io/npm/dt/gitaicommits" alt="downloads">
</p>

<!-- Language Selector -->
<p align="center">
  <strong>语言 / Language:</strong>
  <a href="#zh" style="margin: 0 10px; color: #4CAF50;">中文</a>
  <a href="#en" style="margin: 0 10px; color: #2196F3;">English</a>
</p>

## <a name="zh"></a>📖 简介 [中文]

GitAICommit 是一个智能的Git提交信息生成工具，利用AI模型自动分析代码变更内容，生成符合规范的提交信息。支持多种AI模型，包括OpenAI、DeepSeek和阿里云通义千问。同时提供代码问题自动识别功能，帮助开发者发现潜在的代码问题。

## ✨ 特性 [中文]

- 支持多种AI模型：OpenAI GPT、DeepSeek、阿里云通义千问
- 自动分析Git变更内容
- 生成符合规范的提交信息
- 支持命令行配置和使用
- 支持中英文输出
- 可选择自动执行git commit
- **代码问题自动识别**：分析代码变更中的潜在问题
- **提交时集成问题检查**：可选择在生成提交信息时同时分析代码问题

## 🚀 安装 [中文]

```bash
# 全局安装
npm install -g gitaicommits

# 或在项目中安装
npm install --save-dev gitaicommits
```

## ⚙️ 配置 [中文]

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

### 支持的配置项 [中文]

| 配置项 | 说明 | 默认值 | 可选值 |
|--------|------|--------|--------|
| apiKey | API密钥 | - | - |
| model | AI模型 | openai | openai, deepseek, qwen |
| modelName | 模型名称 | gpt-3.5-turbo | 根据所选模型而定 |
| temperature | 温度值 | 0.7 | 0.0-1.0 |
| maxTokens | 最大token数 | 200 | - |
| language | 语言 | zh | zh, en |

## 📝 使用方法 [中文]

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

### 3. 代码问题检查

```bash
# 检查代码问题
gitaicommits check

# 或使用简写
gitaicommits i
```

### 4. 生成提交信息并检查代码问题

```bash
# 生成提交信息并检查代码问题
gitaicommits generate --check-issues

# 或使用简写
gitaicommits g -i

# 生成并提交，同时检查代码问题
gitaicommits commit --check-issues

# 或使用简写
gitaicommits c -i
```

### 5. 示例

```bash
# 配置OpenAI模型
gitaicommits config --api-key sk-123456 --model openai --model-name gpt-4

#配置deepseek模型
gitaicommits config --api-key sk-123456 --model deepseek --model-name deepseek-chat

# 查看配置
gitaicommits config --show

# 生成并提交信息
gitaicommits commit

# 生成提交信息并检查代码问题
gitaicommits generate --check-issues

# 仅检查代码问题
gitaicommits check
```

## 🛠️ 模型支持 [中文]

### OpenAI

- 支持模型：gpt-3.5-turbo, gpt-4 等
- API端点：https://api.openai.com/v1/chat/completions

### DeepSeek

- 支持模型：deepseek-chat 等
- API端点：https://api.deepseek.com/chat/completions

### 阿里云通义千问

- 支持模型：qwen-turbo 等
- API端点：https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation

## 🔒 安全说明 [中文]

- API密钥会保存在用户主目录下的 `.gitaicommit/config.json` 文件中
- 请确保不要将包含API密钥的配置文件提交到代码仓库

## 🤝 贡献 [中文]

欢迎提交Issue和Pull Request！

## 📋 开发计划 (TODO) [中文]

### 近期计划
- [x] **代码问题自动识别**：分析提交的代码变更，自动识别潜在的bug、安全漏洞和性能问题 ✅
- [x] **提交时集成问题检查**：在生成提交信息时可选择同时分析代码问题 ✅
- [ ] **改进代码问题识别算法**：提高代码问题检测的准确性和覆盖面
- [ ] **支持更多编程语言**：扩展对各种编程语言的问题识别支持
- [ ] **提供问题修复建议**：不仅识别问题，还提供相应的修复建议

### 未来功能
- [ ] 集成单元测试覆盖率分析
- [ ] 支持团队协作和代码审查功能
- [ ] 添加用户自定义规则支持
- [ ] 提供代码质量趋势分析报告

## 📄 许可证 [中文]

[MIT](https://opensource.org/licenses/MIT)

---

## <a name="en"></a>📖 Introduction [English]

GitAICommit is an intelligent Git commit message generator that automatically analyzes code changes and generates standardized commit messages using AI models. It supports multiple AI models, including OpenAI, DeepSeek, and Alibaba Tongyi Qianwen. Additionally, it provides automatic code issue identification to help developers discover potential problems in their code.

## ✨ Features [English]

- Support for multiple AI models: OpenAI GPT, DeepSeek, Alibaba Tongyi Qianwen
- Automatic analysis of Git change contents
- Generation of standardized commit messages
- Command-line configuration and usage
- Support for Chinese and English output
- Optional automatic git commit execution
- **Automatic code issue identification**: Analyze potential issues in code changes
- **Integrated issue checking during commit**: Option to analyze code issues while generating commit messages

## 🚀 Installation [English]

```bash
# Global installation
npm install -g gitaicommits

# Or install in project
npm install --save-dev gitaicommits
```

## ⚙️ Configuration [English]

Before first use, you need to configure the API key and model settings:

```bash
# Set API key (example for OpenAI)
gitaicommits config --api-key sk-your-api-key

# Set model type
gitaicommits config --model openai

# Set model name
gitaicommits config --model-name gpt-3.5-turbo

# Set language (Chinese/English)
gitaicommits config --language en

# View current configuration
gitaicommits config --show
```

### Supported Configuration Options [English]

| Configuration | Description | Default | Options |
|---------------|-------------|---------|--------|
| apiKey | API key | - | - |
| model | AI model | openai | openai, deepseek, qwen |
| modelName | Model name | gpt-3.5-turbo | Depends on selected model |
| temperature | Temperature value | 0.7 | 0.0-1.0 |
| maxTokens | Maximum token count | 200 | - |
| language | Language | zh | zh, en |

## 📝 Usage [English]

### 1. Generate commit message (without auto commit)

Run in a Git repository with uncommitted changes:

```bash
# Simple way
gitaicommits

# Or use command
gitaicommits generate
```

The tool will automatically analyze changes and generate a commit message, displaying it in the terminal for manual copying.

### 2. Generate and automatically commit

```bash
# Use commit command
gitaicommits commit

# Or use generate command with parameter
gitaicommits generate --commit
```

### 3. Check code issues

```bash
# Check code issues
gitaicommits check

# Or use shorthand
gitaicommits i
```

### 4. Generate commit message and check code issues

```bash
# Generate commit message and check code issues
gitaicommits generate --check-issues

# Or use shorthand
gitaicommits g -i

# Generate, commit, and check code issues
gitaicommits commit --check-issues

# Or use shorthand
gitaicommits c -i
```

### 5. Examples

```bash
# Configure OpenAI model
gitaicommits config --api-key sk-123456 --model openai --model-name gpt-4

# View configuration
gitaicommits config --show

# Generate and commit message
gitaicommits commit

# Generate commit message and check code issues
gitaicommits generate --check-issues

# Only check code issues
gitaicommits check
```

## 🛠️ Model Support [English]

### OpenAI

- Supported models: gpt-3.5-turbo, gpt-4, etc.
- API endpoint: https://api.openai.com/v1/chat/completions

### DeepSeek

- Supported models: deepseek-coder, etc.
- API endpoint: https://api.deepseek.com/chat/completions

### Alibaba Tongyi Qianwen

- Supported models: qwen-turbo, etc.
- API endpoint: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation

## 🔒 Security Notes [English]

- API keys are stored in `.gitaicommit/config.json` in the user's home directory
- Please ensure not to commit configuration files containing API keys to code repositories

## 🤝 Contributions [English]

Pull requests and issues are welcome!

## 📋 Development Plan (TODO) [English]

### Near-term Plans
- [x] **Automatic code issue identification**: Analyze code changes to identify potential bugs, security vulnerabilities, and performance issues ✅
- [x] **Integrated issue checking during commit**: Option to analyze code issues while generating commit messages ✅
- [ ] **Improve code issue identification algorithms**: Increase accuracy and coverage of code problem detection
- [ ] **Support more programming languages**: Expand issue identification support for various programming languages
- [ ] **Provide issue fixing suggestions**: Not only identify issues but also provide corresponding fixing suggestions

### Future Features
- [ ] Integration with unit test coverage analysis
- [ ] Support for team collaboration and code review features
- [ ] Add support for user-defined rules
- [ ] Provide code quality trend analysis reports

## 📄 License [English]

[MIT](https://opensource.org/licenses/MIT)