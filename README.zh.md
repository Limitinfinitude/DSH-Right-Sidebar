# Output Dock

[English](README.md) | 中文

为 DeepSeek Harness 打造的专注型结果工作区。完成的文档和视觉产物在 DSH 原生
右栏中打开；部署后的网页使用普通浏览器标签打开。

![Output Dock 总览](docs/images/show1.png)

## 核心行为

- Agent 只显式发布已经完成、值得查看的结果。
- 结果显示在已完成回复旁，只有用户点击后才会打开。
- 本地文档和视觉产物在 Outputs 中使用会话级横向标签。
- 部署后的网页在普通浏览器标签中打开，不嵌入开发服务器。
- 不收集源码、配置文件和项目中的附带文件。
- 已开标签、当前标签和收起状态跟随当前 DSH 会话切换。

结果产生时 Output Dock 不会打断对话；后台会话也不能打开右栏或抢占焦点。

## 预览

Outputs 支持预览 Markdown、MDX、SVG、图片、HTML、PDF、文本、CSV 和 TSV。
相对资源始终以发布文件为基准解析；SVG 会在安全净化和尺寸归一化后渲染。

![Output Dock 预览](docs/images/show2.png)

## 安装

```sh
git clone https://github.com/Limitinfinitude/DSH-Output-Dock.git
cd DSH-Output-Dock
npm install
npm run build
dsh plugin --profile web add .
```

安装后刷新 DSH Web。

## 使用

1. 让 DSH 制作完成的文档、视觉产物或已部署应用。
2. 点击完成回复旁的结果按钮。
3. 本地结果会进入 Outputs；部署链接会打开浏览器标签。
4. 使用横向标签切换结果，并可刷新、下载或关闭当前结果。
5. 使用完毕后收起 Outputs；回到该会话时会恢复它自己的标签。

## 支持的结果

| 类别 | 格式 |
|---|---|
| 文档 | Markdown、MDX、PDF、HTML、HTM、TXT、CSV、TSV |
| 视觉内容 | SVG、PNG、JPEG、WebP、GIF、AVIF、BMP |
| 已部署应用 | 绝对 HTTP 或 HTTPS 地址 |

## DSH 集成要求

Output Dock 需要 DSH Web 提供：

- 会话级 `details.overlay` 插槽；
- 具名详情栏 API（`openDetails`、`closeDetails` 和当前 surface 状态）；
- `conversation.chat.turnTail` owner 对会话 `views` store 的只读访问；
- Native 与 Code Mode 的持久化工具生命周期事件。

Node 侧注册 `output_dock_publish` 和限定在工作区内的只读文件路由；客户端把成功
发布折叠为持久的会话级视图，在回复旁渲染入口，并且只打开用户选择的结果。

## 开发

```sh
npm test -- --run
npm run typecheck
npm run build
```

本地文件读取范围限定在 DSH 启动工作区和已注册工作区内；HTML 在禁用脚本的
沙箱中预览。

## 许可证

[MIT](LICENSE)
