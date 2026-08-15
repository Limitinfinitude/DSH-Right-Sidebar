/** `output-dock` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'output-dock'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'dock.title': 'Outputs',
  'dock.empty': '还没有可预览的产出物。',
  'dock.allHidden': '所有产出物都已隐藏。',
  'dock.expand': '打开产出物侧边栏',
  'dock.collapse': '关闭产出物侧边栏',
  'dock.chooseFile': '选择产出物',
  'dock.preview': '预览 {name}',
  'dock.copyPath': '复制路径',
  'dock.copyContent': '复制内容',
  'dock.pin': '置顶',
  'dock.unpin': '取消置顶',
  'dock.hide': '隐藏',
  'dock.unhide': '取消隐藏',
  'dock.clearHidden': '恢复已隐藏的条目',
  'dock.download': '下载',
  'dock.turn': '第 {turn} 轮',
  'dock.copied': '已复制',
  'dock.hiddenCount': '{count} 个已隐藏',
  'preview.loading': '正在载入预览…',
  'preview.error': '无法读取这个产出物',
  'preview.empty': '文件为空',
  'qc.ok': '检查通过',
  'qc.brokenLink': '{count} 个相对链接指向不存在的文件',
  'qc.unbalancedFence': '代码围栏不成对',
  'qc.svgParse': 'SVG 解析失败',
  'qc.svgNoViewBox': 'SVG 缺少 viewBox',
  'qc.svgSanitized': 'SVG 含被移除的危险元素',
  'qc.imageFailed': '图片无法加载',
  'qc.htmlParse': 'HTML 存在 {count} 处解析问题',
  'qc.fileRead': '文件读取失败',
  'qc.loading': '检查中…',
}

/** English dictionary (same key set). */
export const en: Record<OutputDockKey, string> = {
  'dock.title': 'Outputs',
  'dock.empty': 'No previewable outputs yet.',
  'dock.allHidden': 'All outputs are hidden.',
  'dock.expand': 'Open outputs sidebar',
  'dock.collapse': 'Close outputs sidebar',
  'dock.chooseFile': 'Choose an output',
  'dock.preview': 'Preview {name}',
  'dock.copyPath': 'Copy path',
  'dock.copyContent': 'Copy content',
  'dock.pin': 'Pin',
  'dock.unpin': 'Unpin',
  'dock.hide': 'Hide',
  'dock.unhide': 'Unhide',
  'dock.clearHidden': 'Restore hidden entries',
  'dock.download': 'Download',
  'dock.turn': 'Turn {turn}',
  'dock.copied': 'Copied',
  'dock.hiddenCount': '{count} hidden',
  'preview.loading': 'Loading preview…',
  'preview.error': 'This output could not be read',
  'preview.empty': 'This file is empty',
  'qc.ok': 'Checks passed',
  'qc.brokenLink': '{count} relative links point to missing files',
  'qc.unbalancedFence': 'Unbalanced code fences',
  'qc.svgParse': 'SVG failed to parse',
  'qc.svgNoViewBox': 'SVG is missing a viewBox',
  'qc.svgSanitized': 'SVG contained dangerous elements that were stripped',
  'qc.imageFailed': 'Image failed to load',
  'qc.htmlParse': 'HTML has {count} parse issues',
  'qc.fileRead': 'File read failed',
  'qc.loading': 'Checking…',
}

/** Union of this namespace's dictionary keys. */
export type OutputDockKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'output-dock': OutputDockKey
  }
}
