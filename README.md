# AI Character Passport - AI 剧本分镜架构师

这是一个基于 Next.js 和 React 构建的 **AI 视频剧本分镜架构师** 系统（AI Video Director）。它能够帮助导演和编剧快速将视频剧本拆解为标准的镜头脚本，支持提取视频帧、角色人设配置、一键翻译 Prompt、以及多镜头智能排版，可轻松指导 AI 视频生成工具（如即梦、Luma, Kling, Runway, CogVideo 等）生成视频。

---

## 🚀 快速开始（傻瓜式安装教程）

即使你没有任何编程基础，按照以下步骤也能在 5 分钟内成功运行项目：

### 第一步：安装 Node.js 运行环境
本系统依赖 Node.js 来运行。
1. 点击链接下载并安装：[Node.js 官方下载地址 (推荐下载 LTS 长期支持版)](https://nodejs.org/)
2. 下载后一路点击“下一步 (Next)”完成安装。
3. **验证安装是否成功**：
   打开你的终端（Windows 按 `Win + R` 键，输入 `cmd` 回车；Mac 打开 Terminal），输入以下命令并回车：
   ```bash
   node -v
   npm -v
   ```
   如果输出了版本号（如 `v20.x.x` 或 `v22.x.x`），说明安装成功。

### 第二步：下载本项目代码
* **方式 A（使用 Git 克隆，推荐）**：
  在终端中运行以下命令：
  ```bash
  git clone https://github.com/yaohaoliang141-max/ai-character-passport.git
  cd ai-character-passport
  ```
* **方式 B（直接下载压缩包）**：
  1. 点击网页右上角的 **Code** 绿色按钮，选择 **Download ZIP**。
  2. 下载后，解压到你电脑的任意文件夹（如桌面）。
  3. 打开终端，使用 `cd` 命令进入该解压目录（或者直接在解压目录空白处右键选择“在终端中打开”）。

### 第三步：安装项目依赖
在项目根目录（包含 `package.json` 文件的目录下）打开的终端中，运行：
```bash
npm install
```
*提示：安装可能需要 1~2 分钟，请耐心等待完成。*

### 第四步：启动本地开发服务器
运行以下命令启动项目：
```bash
npm run dev
```
启动成功后，终端会显示：
`▲ Next.js 15.x.x`
`- Local: http://localhost:3000`

现在打开浏览器，访问 [http://localhost:3000](http://localhost:3000) 即可开始使用！

---

## ⚙️ 配置 AI API Key (免修改代码 / 免配置 .env)

为了保障数据安全且免去配置复杂的环境变量，本系统**无需配置任何 `.env` 文件**。你只需在网页端直接配置即可：

1. 打开浏览器进入系统界面。
2. 点击右上角的 **“⚙️ 设置”** 按钮。
3. 在弹出的设置弹窗中，配置以下参数：
   - **API 接口地址 (Base URL)**：支持任何兼容 OpenAI 接口标准的 API 服务商。
     - *默认：`https://api.openai.com/v1`*
     - *如使用 DeepSeek，可填入：`https://api.deepseek.com/v1`*
     - *如使用 百度千帆/阿里Dashscope/Moonshot 等，可填入相应的兼容 API 地址。*
   - **API Key**：你的大模型 API 密钥。
   - **模型名称 (Model Name)**：你想使用的模型。
     - *默认：`gpt-4o`*
     - *如使用 DeepSeek-V3，可填写 `deepseek-chat`。*
4. 配置完成后点击**保存**。配置信息将安全地保存在你本地浏览器的 `localStorage` 中，绝不上传到第三方服务器。

---

## 🎨 核心功能

1. **AI 视频剧本分镜生成**：直接输入视频描述或短剧剧本，一键拆解为详细的镜头列表（包含镜头类型、动作、画面描述）。
2. **角色人设护照 (Character Passport)**：
   - 统一管理剧本中的角色外观设定、面部特征、服饰、道具等。
   - 在生成镜头 Prompt 时，自动将角色的详细设定融合进 Prompt，保证视频生成时角色脸部和穿着的一致性。
3. **视频帧本地提取**：支持上传参考视频，直接在前端页面提取特定帧作为分镜参考图。
4. **Prompt 自动翻译与优化**：深度适配即梦 (Jimeng) 等中文提示词与主流英文 Prompt 逻辑，自动注入专业运镜（推、拉、摇、移）与电影级光影指令，并翻译为高质量英文 Prompt。
5. **分镜大盘与导出**：以直观的时间轴/看板展示所有分镜，支持一键复制 Prompt。

---

## 📂 项目结构

```
src/
├── app/
│   ├── page.tsx               # 核心主页面（集成输入面板、时间轴与设置）
│   ├── layout.tsx             # 全局页面布局
│   └── api/
│       └── generate-shots/    # 后端 API 路由，负责与 OpenAI 兼容接口通信
├── components/
│   ├── CharacterCard.tsx      # 角色卡片组件
│   ├── CharacterForm.tsx      # 角色编辑与创建表单
│   ├── InputPanel.tsx         # 剧本输入与分镜生成控制面板
│   ├── PromptPreview.tsx      # 提示词预览与一键复制
│   ├── SettingsModal.tsx      # API 参数配置弹窗
│   └── StoryboardTimeline.tsx # 分镜时间轴看板
├── store/
│   ├── useCharacterStore.ts   # 角色状态管理 (使用 IndexedDB 实现持久化存储)
│   ├── useSettingsStore.ts    # API 设置状态管理 (使用 LocalStorage 持久化存储)
│   └── useStoryboardStore.ts  # 分镜列表状态管理
└── utils/
    ├── promptTranslator.ts    # 英文提示词优化与翻译器
    └── videoExtractor.ts      # 视频帧本地提取工具函数
```

---

## ❓ 常见问题 (FAQ)

#### 1. 运行 `npm install` 报错或速度很慢怎么办？
如果国内网络连接 npm 较慢，可以使用淘宝镜像源进行安装。运行以下命令：
```bash
npm install --registry=https://registry.npmmirror.com
```

#### 2. 点击“生成分镜”没有反应或报错？
- 请检查右上角 **“设置”** 中配置的 **API 接口地址**、**API Key** 和 **模型名称** 是否正确且有余额。
- 打开浏览器的开发者工具（按 F12），切换到 `Network` (网络) 或 `Console` (控制台) 标签页，查看请求返回值以确认具体错误（如 401 鉴权失败，404 模型不存在等）。

#### 3. 数据刷新后会丢失吗？
- 所有的 **角色设定** 和 **分镜数据** 均保存在本地浏览器数据库 (IndexedDB) 中，刷新网页不会丢失。
- 所有的 **API 设置** 保存在浏览器的 LocalStorage 中，同样不会丢失。

---

*本项目由 **yao** 出品，致力于探索 AI 与视觉艺术的极致边界。*
