# 🎞️ AI Video Director: 你的 AI 影视分镜架构师

**AI Video Director** 是一款为硬核 AI 视频创作者量身定制的本地化生产力工具。它旨在打破从剧本到分镜的脑力瓶颈，建立一套标准化的电影工业流创作流程。

---

### ✨ 核心痛点解决

* **智能分镜拆解**：接入大模型 API，将数千字的长剧本自动切分为符合即梦 (Jimeng) 生成逻辑的 10-15s 分镜脚本。
* **苹果极简美学**：采用 **Apple Aesthetic** 视觉设计，背景纯白，布局灵动，让创作过程回归审美本质。
* **即梦 (Jimeng) 语义优化**：深度适配中文提示词逻辑，自动注入专业运镜（推、拉、摇、移）与电影级光影指令。
* **本地私有化资产**：基于浏览器本地 IndexedDB 存储，你的剧本、提示词、分镜视频永远保存在你自己的设备上，零隐私泄露风险。

---

### 🛠️ 为什么不提供在线网址？

为了保证你的**创作隐私**与**数据安全**。这是一个纯净的本地工具，我们建议每位创作者在自己的本地环境部署使用。不经过任何中转服务器，你的 API Key 和剧本资产仅对你可见。

---

### 🚀 如何在本地开启创作？

请确保你的电脑已安装 [Node.js](https://nodejs.org/)。

1.  **克隆仓库**：
    ```bash
    git clone [https://github.com/yaohaoliang141-max/ai-character-passport.git](https://github.com/yaohaoliang141-max/ai-character-passport.git)
    ```

2.  **安装依赖**：
    ```bash
    cd ai-character-passport
    npm install
    ```

3.  **启动应用**：
    ```bash
    npm run dev
    ```

4.  **配置与使用**：
    * 打开浏览器访问 `http://localhost:3000`。
    * 在设置面板中填入你的大模型 API Key（支持 DeepSeek / 智谱等兼容 OpenAI 格式的接口）。
    * 开始导演你的 AI 电影。

---

### 📦 开发者部署说明

本项基于 **Next.js 14** 构建，UI 框架使用 **Tailwind CSS**，状态管理采用 **Zustand**，本地持久化存储使用 **IndexedDB**。

* **生产环境构建**：`npm run build`
* **代码规范**：`npm run lint`
* **贡献代码**：欢迎提交 Pull Request，一起优化即梦提示词的生成逻辑。


---

*本项目由 **yao** 出品，致力于探索 AI 与视觉艺术的极致边界。*
