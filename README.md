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
- Agent 更新同一路径的产物后，当前预览会自动刷新
- 支持 Agent 明确输出的 HTTP(S) 文件 URL，以及工作区内唯一匹配的不完整文件路径
- 顶部堆叠标签支持关闭和拖拽重排，狭窄侧栏仍保留可读文件名
- 底部“本会话产物”目录可重新打开已关闭的结果，超过七项时独立滚动
- Markdown 可直接在渲染内容上编辑，并在停止输入后静默保存
- 支持复制路径、复制内容、下载、打开所在目录、置顶与隐藏

## 预览范围

| 类别 | 当前支持 |
| --- | --- |
| 自动产物 | Markdown、MDX、PDF、SVG、PNG、JPEG、WebP、GIF、AVIF、BMP |
| 按需产物 | TXT、JSON、JSONL、CSV、TSV；仅在 Agent 回复中明确提到文件路径或名称时显示 |
| 不展示 | 源码、HTML/HTM、配置、日志、YAML、TOML、XML、INI、CONF 等项目内部文件 |

- JSON/JSONL：可折叠结构树、搜索、全部展开/收起、格式化原文及错误行提示
- CSV/TSV：正确处理引号与多行字段，支持筛选、数值/文本排序、分页和列宽调整
- TXT：行号、全文搜索、匹配计数、自动换行；大文件按 250 行分页，避免一次生成过多 DOM
- 图片/SVG：适应窗口、原始尺寸、缩放、拖拽平移、尺寸信息和透明背景棋盘格
- PDF：使用浏览器内置 PDF 阅读器，并提供刷新和外部打开

HTML 文件属于项目源码，而部署后的网页应由 Agent 在对话中提供可访问 URL。这样一个前后端
项目生成大量 `js`、`ts`、`css` 和配置文件时，Output Dock 仍然只呈现真正的交付物。

![Output Dock 中的预览](docs/images/test2.png)

## 使用方式

1. 让 DSH 生成报告、图表、图片、PDF 或数据文件。
2. Markdown、PDF、SVG 和图片等富预览产物出现时，右侧栏自动展开并打开最新产物。
3. TXT、JSON 和 CSV 等数据文件只在 Agent 明确提到时进入产物列表，且不会抢占当前富预览。
4. 使用标签在不同产物之间切换；关闭后可从底部目录重新打开。
5. 需要源码或项目文件时，使用“打开所在目录”回到 DSH 工作区。

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

侧栏在空闲时不轮询文件或端口。产物内容只在用户选中后读取，复杂预览按需初始化；JSON 搜索
只遍历数据一次，表格限制为最多 10,000 行，TXT 分页渲染。浏览器端包体积约为 `185 KB gzip`。

工作区内文件会校验路径；Agent 在工作区外生成的产物，则通过 DSH 同源授权后限时访问。
外部授权根目录最多保留 256 个，6 小时后过期。Markdown 和 SVG 在渲染前净化，二进制文件保持只读；
HTML/HTM 源文件不会嵌入到 Dock。

网络产物必须由同源 DSH 页面先授权，再通过无 Cookie、无认证头的受限代理读取；仅允许受支持
的文件扩展名，单个响应上限 16 MB，10 秒超时。只有带明确交付语义的裸 URL 或 Markdown 文件链接
会进入产物栏，普通参考链接不会被误判为产物。不完整路径仅在已注册工作区中有唯一匹配时解析，
遇到多个同名文件会拒绝猜测。

## 开发

```sh
npm test -- --run
npm run typecheck
npm run build
```

## 许可证

[MIT](LICENSE)
