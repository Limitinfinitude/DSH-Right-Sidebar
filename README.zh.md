# Output Dock

[English](README.md) | 中文

为 DeepSeek Harness 打造的原生输出侧边栏。生成的文件会留在对话旁，形成一个
可缩放、跟随会话切换的预览工作区。

![Output Dock 总览](docs/images/show1.png)

## 概览

Output Dock 直接从成功的文件修改记录中收集产物。文档、视觉内容、页面和 PDF
会自动在 DSH 右栏打开；源码与配置文件会保留在标签中，但不会抢走当前预览。

面板跟随 DSH 的主题和语言，需要查看工具详情时会交还右栏，也可以手动收起并从
右侧边缘恢复。

## 主要能力

- 右侧入口常驻，可随时展开或收起
- 使用可关闭、可拖拽的浏览器式标签，并按会话保存顺序
- 关闭的标签仅在同一文件再次生成时恢复
- HTML、Markdown、文本、图片和 SVG 自动适配窄侧栏
- 支持复制路径、复制内容、下载以及打开所在目录
- 在后台完成 Markdown、SVG、HTML 和图片检查，不增加界面噪声
- 切换或重新打开会话时恢复对应产物

## 可视化输出

Markdown、SVG、HTML、PDF 和图片都可以在侧边栏内预览。相对资源会以产物文件
自身为基准解析，固定宽度页面和长文本也会约束在当前侧栏宽度内。

![Output Dock 中的 SVG 预览](docs/images/show2.png)

## 安装

Output Dock 当前要求 DSH Web 提供会话级 `details.overlay` 插槽和具名详情栏 API。

```sh
git clone https://github.com/Limitinfinitude/DSH-Output-Dock.git
cd DSH-Output-Dock
npm install
npm run build
dsh plugin --profile web add .
```

安装后刷新 DSH Web 会话。

## 使用

1. 让 DSH 创建文档、图表、图片、页面或源码文件。
2. 可预览结果会自动打开，源码文件则安静地加入标签。
3. 切换、关闭或拖拽标签，整理当前会话的产物。
4. 使用底部控件复制、定位目录、下载、置顶或隐藏条目。

## 支持格式

| 类别 | 格式 |
|---|---|
| 文档 | Markdown、MDX、PDF |
| 视觉内容 | SVG、PNG、JPEG、WebP、GIF、AVIF、BMP |
| Web | HTML、HTM |
| 文本与代码 | 常见源码、配置、数据和纯文本扩展名 |

## 工作原理

Node 侧提供限定在工作区内的只读文件路由；客户端从修改工具记录中派生产物路径，
聚合成会话级视图，并把查看器注册到 DSH 原生详情栏。所有预览内容都会在渲染前
经过净化，质量检查完全由确定性规则完成，不调用模型。

## 开发

```sh
npm test -- --run
npm run typecheck
npm run build
```

## 当前限制

- 文件读取范围限定在启动工作区和 DSH 已注册工作区内。
- HTML 使用禁用脚本的沙箱预览。
- 查看偏好保存在当前浏览器；会话输出历史从日志重新构建。
- 当前版本尚未嵌入已部署的开发服务器，只预览项目生成的文件。

## 许可证

[MIT](LICENSE)
