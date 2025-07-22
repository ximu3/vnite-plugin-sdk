/**
 * 插件开发 SDK 类型定义
 * 严格按照主应用的类型定义，确保完全兼容
 */

// 导出模型类型
export * from './models'

// 导出事件类型
export * from './event'

// 导出 IPC 类型
export * from './ipc'

// 导出 Scraper 类型
export * from './scraper'

// 导出系统类型
export * from './system'

// 导出 Importer 类型
export * from './importer'

// 导出 Updater 类型
export * from './updater'

// 导出插件类型
export * from './plugin'

// 重新导出常用类型的别名
export type {
  gameDoc,
  gameDocs,
  gameCollectionDoc,
  gameLocalDoc,
  BatchGameInfo
} from './models/game'

export type { configDocs, configLocalDocs } from './models/config'

export type {
  AppEvents,
  EventType,
  EventData,
  EnhancedEventData,
  EventHistoryEntry,
  EventHistoryQuery,
  EventMetadata
} from './event'

export type { IpcMainEvents, IpcRendererEvents } from './ipc'
