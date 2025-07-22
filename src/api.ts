/**
 * Vnite Plugin API 类型定义
 *
 * 定义插件与主应用交互的 API 接口
 * 主应用会创建实际的 API 实例并传递给插件的 activate 函数
 */

import type {
  IPluginAPI,
  IPluginDB,
  IConfigDB,
  IGameDB,
  IEventBus,
  IIpcManager,
  IScraperManager
} from './types'

// 重新导出接口类型供插件使用
export type { IPluginAPI, IPluginDB, IConfigDB, IGameDB, IEventBus, IIpcManager, IScraperManager }
