export const NS = 'output-dock'

export const zh = {
  'result.openOutput': '在 Outputs 中打开 {name}',
  'result.openLink': '在浏览器中打开 {name}',
  'dock.title': 'Outputs',
  'dock.tabs': '已打开的产出物',
  'dock.expand': '打开 Outputs',
  'dock.collapse': '收起 Outputs',
  'dock.closeTab': '关闭 {name}',
  'dock.refresh': '刷新预览',
  'dock.copyPath': '复制路径',
  'dock.download': '下载',
  'dock.close': '关闭当前标签',
  'dock.copied': '已复制',
  'preview.loading': '正在载入预览...',
  'preview.unavailable': '这个产出物暂时无法预览',
  'preview.empty': '文件为空',
  'preview.retry': '重试',
}

export type OutputDockKey = keyof typeof zh

export const en: Record<OutputDockKey, string> = {
  'result.openOutput': 'Open {name} in Outputs',
  'result.openLink': 'Open {name} in browser',
  'dock.title': 'Outputs',
  'dock.tabs': 'Open outputs',
  'dock.expand': 'Open Outputs',
  'dock.collapse': 'Collapse Outputs',
  'dock.closeTab': 'Close {name}',
  'dock.refresh': 'Refresh preview',
  'dock.copyPath': 'Copy path',
  'dock.download': 'Download',
  'dock.close': 'Close active tab',
  'dock.copied': 'Copied',
  'preview.loading': 'Loading preview...',
  'preview.unavailable': 'This output is temporarily unavailable',
  'preview.empty': 'This file is empty',
  'preview.retry': 'Retry',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'output-dock': OutputDockKey
  }
}
