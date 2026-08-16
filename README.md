# DSH Right Sidebar

中文 | [English](README.en.md)

DSH Right Sidebar 为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
提供原生的右侧产物工作区。它让 Agent 在一个会话中生成的报告、图表、图片、数据和文档
留在对话旁边，而不是散落在工作区和工具记录中。

![Output Dock 总览](docs/images/test1.png)

## 设计目标

Output Dock 不是文件管理器，也不展示项目里的每一个文件。它只保留用户可以直接阅读、检查、
下载或使用的结果；源码、配置、依赖和 HTML 源文件继续由 DSH 工作区负责。

- 常驻右侧入口，可自动展开，也可手动收起和恢复
- 产物与会话绑定；切换会话时同步切换标签、排序和关闭状态
- 顶部堆叠标签支持关闭和拖拽重排，狭窄侧栏仍保留可读文件名
- 底部“本会话产物”目录可重新打开已关闭的结果，超过七项时独立滚动
- Markdown 可直接在渲染内容上编辑，并在停止输入后静默保存
- 支持复制路径、复制内容、下载、打开所在目录、置顶与隐藏

## 预览范围

| 类别 | 当前支持 |
| --- | --- |
| 文档 | Markdown、MDX、PDF |
| 图形与图片 | SVG、PNG、JPEG、WebP、GIF、AVIF、BMP |
| 默认产物 | Markdown、MDX、PDF、SVG 和常见图片 |
| 明确发布的数据 | TXT、JSON、JSONL、CSV、TSV；仅在 Agent 最终回复点名时显示 |
| 工作区文件 | 源码、配置、日志、HTML/HTM、YAML、TOML、XML、INI、CONF 不进入产物侧栏 |

HTML 文件属于项目源码，而部署后的网页应由 Agent 在对话中提供可访问 URL。这样一个前后端
项目生成大量 `js`、`ts`、`css` 和配置文件时，Output Dock 仍然只呈现真正的交付物。

![Output Dock 中的预览](docs/images/test2.png)

## 使用方式

1. 让 DSH 生成报告、图表、图片、PDF 或数据文件。
2. 可预览结果出现时，右侧栏自动展开并打开最新产物。
3. 使用标签在不同产物之间切换；关闭后可从底部目录重新打开。
4. 需要源码或项目文件时，使用“打开所在目录”回到 DSH 工作区。

## 安装

DSH Right Sidebar 需要 DSH Web 提供会话级 `details.overlay` 插槽和具名详情栏 API。

```sh
git clone https://github.com/Limitinfinitude/DSH-Right-Sidebar.git
cd DSH-Right-Sidebar
npm install
npm run build
dsh plugin --profile web add .
```

安装后刷新 DSH Web 会话。

## 性能与安全

侧栏在空闲时不轮询文件或端口。产物内容只在用户选中后读取，复杂预览按需初始化；Markdown
编辑不再加载通用 HTML 转换库，浏览器端包体积约为 `164 KB gzip`。

本地文件访问受工作区路径校验约束。Markdown 和 SVG 在渲染前净化，二进制文件保持只读；
HTML/HTM 源文件不会嵌入到 Dock。

## 开发

```sh
npm test -- --run
npm run typecheck
npm run build
```

## 许可证

[MIT](LICENSE)
