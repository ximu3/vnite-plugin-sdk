/**
 * Plugin 相关类型定义
 * 严格按照主应用的类型定义，确保完全一致
 */

import type {
  EventType,
  EventData,
  EnhancedEventData,
  EventHistoryEntry,
  EventHistoryQuery
} from './event'
import type {
  configDocs,
  configLocalDocs,
  gameDoc,
  gameDocs,
  gameCollectionDoc,
  gameCollectionDocs,
  gameLocalDoc,
  gameLocalDocs
} from './models'
import type {
  GameList,
  GameMetadata,
  ScraperIdentifier,
  GameDescriptionList,
  GameTagsList,
  GameExtraInfoList,
  ScraperCapabilities,
  ScraperProvider
} from './scraper'
import type { Get, Paths } from 'type-fest'

// 插件分类枚举
export enum PluginCategory {
  GAME = 'game',
  THEME = 'theme',
  SCRAPER = 'scraper',
  UTILITY = 'utility',
  LANGUAGE = 'language',
  IMPORTER = 'importer',
  LAUNCHER = 'launcher',
  OTHER = 'other'
}

// 插件状态枚举
export enum PluginStatus {
  INSTALLED = 'installed',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  LOADING = 'loading',
  ERROR = 'error',
  UNINSTALLED = 'uninstalled'
}

// 基础插件配置项接口
interface BasePluginConfiguration {
  id: string
  title: string
  default: any
  description?: string
  /** 通用样式配置 */
  controlClassName?: string
}

// 字符串类型配置
interface StringPluginConfiguration extends BasePluginConfiguration {
  type: 'string'
  controlOptions: {
    controlType: 'input' | 'textarea'
    inputType?: 'text' | 'email' | 'password' | 'url'
    placeholder?: string
    rows?: number // textarea专用
  }
}

// 数字类型配置
interface NumberPluginConfiguration extends BasePluginConfiguration {
  type: 'number'
  controlOptions: {
    controlType: 'input' | 'slider'
    placeholder?: string
    // slider专用配置
    min?: number
    max?: number
    step?: number
    formatValue?: (value: number) => string
  }
}

// 布尔类型配置
interface BooleanPluginConfiguration extends BasePluginConfiguration {
  type: 'boolean'
  controlOptions: {
    controlType: 'switch'
  }
}

// 选择类型配置
interface SelectPluginConfiguration extends BasePluginConfiguration {
  type: 'select'
  options: Array<{ label: string; value: any }>
  controlOptions: {
    controlType: 'select'
    placeholder?: string
  }
}

// 数组类型配置
interface ArrayPluginConfiguration extends BasePluginConfiguration {
  type: 'array'
  controlOptions: {
    controlType: 'arrayeditor'
    arrayEditorPlaceholder?: string
    arrayEditorTooltipText?: string
    arrayEditorDialogTitle?: string
    arrayEditorDialogPlaceholder?: string
  }
}

// 日期类型配置
interface DatePluginConfiguration extends BasePluginConfiguration {
  type: 'date'
  controlOptions: {
    controlType: 'dateinput'
    placeholder?: string
  }
}

// 文件类型配置
interface FilePluginConfiguration extends BasePluginConfiguration {
  type: 'file'
  controlOptions: {
    controlType: 'fileinput'
    placeholder?: string
    dialogFilters?: Array<{ name: string; extensions: string[] }>
    buttonIcon?: string
    buttonTooltip?: string
  }
}

// 快捷键类型配置
interface HotkeyPluginConfiguration extends BasePluginConfiguration {
  type: 'hotkey'
  controlOptions: {
    controlType: 'hotkey'
    inputClassName?: string
  }
}

// 插件配置项联合类型
export type PluginConfiguration =
  | StringPluginConfiguration
  | NumberPluginConfiguration
  | BooleanPluginConfiguration
  | SelectPluginConfiguration
  | ArrayPluginConfiguration
  | DatePluginConfiguration
  | FilePluginConfiguration
  | HotkeyPluginConfiguration

// 插件清单类型 - 与主应用完全一致
export interface PluginManifest {
  /** 插件ID，必须唯一 */
  id: string
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件描述 */
  description: string
  /** 插件作者 */
  author: string
  /** 插件主页 */
  homepage?: string
  /** 插件许可证 */
  license?: string
  /** 最小支持的Vnite版本 */
  vniteVersion: string
  /** 插件主入口文件 */
  main: string
  /** 插件图标路径 */
  icon?: string
  /** 插件关键词 */
  keywords?: string[]
  /** 插件分类 */
  category?: PluginCategory
  /** 激活事件 */
  activationEvents?: string[]
  /** 依赖的其他插件 */
  dependencies?: Record<string, string>
  /** 开发依赖 */
  devDependencies?: Record<string, string>
  /** 插件配置项 */
  configuration?: PluginConfiguration[]
}

// 插件安装选项
export interface PluginInstallOptions {
  /** 是否自动启用 */
  autoEnable?: boolean
  /** 是否覆盖已存在的插件 */
  overwrite?: boolean
  /** 安装后的回调 */
  onProgress?: (progress: number, message: string) => void
}

// 插件搜索选项
export interface PluginSearchOptions {
  /** 搜索关键词 */
  keyword?: string
  /** 插件分类 */
  category?: PluginCategory
  /** 是否只显示已安装的 */
  installedOnly?: boolean
  /** 是否只显示已启用的 */
  enabledOnly?: boolean
}

// 插件信息
export interface PluginInfo {
  manifest: PluginManifest
  status: PluginStatus
  installPath: string
  installTime: Date
  lastUpdateTime?: Date
  error?: string
  instance?: any
}

// 插件注册表
export interface PluginRegistry {
  /** 注册表名称 */
  name: string
  /** 注册表URL */
  url: string
  /** 是否默认启用 */
  enabled: boolean
}

// 插件包
export interface PluginPackage {
  manifest: PluginManifest
  downloadUrl: string
  size: number
  checksum: string
  publishTime: Date
}

// ConfigDB 接口 - 与主应用 ConfigDBManager 一致
export interface IConfigDB {
  getAllConfigs(): Promise<configDocs>
  getAllConfigLocal(): Promise<configLocalDocs>
  getConfigValue<Path extends Paths<configDocs, { bracketNotation: true }>>(
    path: Path
  ): Promise<Get<configDocs, Path>>
  setConfigValue<Path extends Paths<configDocs, { bracketNotation: true }>>(
    path: Path,
    value: Get<configDocs, Path>
  ): Promise<void>
  getConfigLocalValue<Path extends Paths<configLocalDocs, { bracketNotation: true }>>(
    path: Path
  ): Promise<Get<configLocalDocs, Path>>
  setConfigLocalValue<Path extends Paths<configLocalDocs, { bracketNotation: true }>>(
    path: Path,
    value: Get<configLocalDocs, Path>
  ): Promise<void>
  setConfigBackgroundImage(image: Buffer | string): Promise<void>
  getConfigBackgroundImage<T extends 'buffer' | 'file' = 'buffer'>(
    format?: T
  ): Promise<T extends 'file' ? string | null : Buffer | null>
}

// GameDB 接口 - 与主应用 GameDBManager 一致
export interface IGameDB {
  getAllGames(): Promise<gameDocs>
  getAllCollections(): Promise<gameCollectionDocs>
  getAllGamesLocal(): Promise<gameLocalDocs>
  getGame(gameId: string): Promise<gameDoc>
  setGame(gameId: string, data: Partial<gameDoc>): Promise<void>
  getGameLocal(gameId: string): Promise<gameLocalDoc>
  setGameLocal(gameId: string, data: Partial<gameLocalDoc>): Promise<void>
  getCollection(collectionId: string): Promise<gameCollectionDoc>
  setCollection(collectionId: string, data: Partial<gameCollectionDoc>): Promise<void>
  getGameValue<Path extends Paths<gameDoc, { bracketNotation: true }>>(
    gameId: string,
    path: Path
  ): Promise<Get<gameDoc, Path>>
  setGameValue<Path extends Paths<gameDoc, { bracketNotation: true }>>(
    gameId: string,
    path: Path,
    value: Get<gameDoc, Path>
  ): Promise<void>
  getCollectionValue<Path extends Paths<gameCollectionDoc, { bracketNotation: true }>>(
    collectionId: string,
    path: Path
  ): Promise<Get<gameCollectionDoc, Path>>
  setCollectionValue<Path extends Paths<gameCollectionDoc, { bracketNotation: true }>>(
    collectionId: string,
    path: Path,
    value: Get<gameCollectionDoc, Path>
  ): Promise<void>
  getGameLocalValue<Path extends Paths<gameLocalDoc, { bracketNotation: true }>>(
    gameId: string,
    path: Path
  ): Promise<Get<gameLocalDoc, Path>>
  setGameLocalValue<Path extends Paths<gameLocalDoc, { bracketNotation: true }>>(
    gameId: string,
    path: Path,
    value: Get<gameLocalDoc, Path>
  ): Promise<void>
  checkGameExitsByPath(path: string): Promise<boolean>
  removeGame(gameId: string): Promise<void>
  removeCollection(collectionId: string): Promise<void>
  removeGameFromCollection(gameId: string, collectionId: string): Promise<void>
  addGameToCollection(gameId: string, collectionId: string): Promise<void>
  removeGameFromAllCollections(gameId: string): Promise<void>
  removeGameLocal(gameId: string): Promise<void>
  setGameImage(
    gameId: string,
    type: 'background' | 'cover' | 'icon' | 'logo',
    image: Buffer | string
  ): Promise<void>
  getGameImage<T extends 'buffer' | 'file' = 'buffer'>(
    gameId: string,
    type: 'background' | 'cover' | 'icon' | 'logo',
    format?: T
  ): Promise<T extends 'file' ? string | null : Buffer | null>
  setGameMemoryImage(gameId: string, memoryId: string, image: Buffer | string): Promise<void>
  getGameMemoryImage<T extends 'buffer' | 'file' = 'buffer'>(
    gameId: string,
    memoryId: string,
    format?: T
  ): Promise<T extends 'file' ? string | null : Buffer | null>
}

// PluginDB 接口 - 插件专用数据库
export interface IPluginDB {
  getValue(key: string, defaultValue?: any): Promise<any>
  setValue(key: string, value: any): Promise<void>
}

// EventBus 接口 - 与主应用 EventBus 一致
export interface IEventBus {
  emit<T extends EventType>(
    eventType: T,
    data: EventData<T>,
    options: {
      source: string
      correlationId?: string
    }
  ): boolean
  on<T extends EventType>(
    eventType: T,
    handler: (data: EnhancedEventData<T>) => void | Promise<void>
  ): () => void
  once<T extends EventType>(
    eventType: T,
    handler: (data: EnhancedEventData<T>) => void | Promise<void>
  ): () => void
  off<T extends EventType>(
    eventType: T,
    handler: (data: EnhancedEventData<T>) => void | Promise<void>
  ): void
  waitFor<T extends EventType>(
    eventType: T,
    timeout?: number,
    condition?: (data: EnhancedEventData<T>) => boolean
  ): Promise<EnhancedEventData<T>>
  emitBatch<T extends EventType>(
    events: Array<{
      eventType: T
      data: EventData<T>
      options?: {
        source: string
        correlationId?: string
      }
    }>
  ): void
  queryHistory(options?: EventHistoryQuery): EventHistoryEntry[]
  getTotalEvents(): number
  getEventsByType(): Record<string, number>
  getRecentEvents(limit?: number): EventHistoryEntry[]
  clearHistory(): void
  exportHistory(): EventHistoryEntry[]
  getHistoryStats(): {
    totalEvents: number
    uniqueEventTypes: number
    oldestEvent?: EventHistoryEntry
    newestEvent?: EventHistoryEntry
    averageEventsPerMinute: number
  }
}

// IPC 接口 - 与主应用 IPCManager 一致
export interface IIpcManager {
  send<E extends keyof import('./ipc').IpcRendererEvents>(
    channel: Extract<E, string>,
    ...args: import('./ipc').IpcRendererEvents[E]
  ): void
}

// Scraper 接口 - 与主应用 ScraperManager 一致
export interface IScraperManager {
  registerProvider(provider: ScraperProvider): void
  unregisterProvider(providerId: string): void
  searchGames(providerId: string, gameName: string): Promise<GameList>
  checkGameExists(providerId: string, identifier: ScraperIdentifier): Promise<boolean>
  getGameMetadata(providerId: string, identifier: ScraperIdentifier): Promise<GameMetadata>
  getGameBackgrounds(providerId: string, identifier: ScraperIdentifier): Promise<string[]>
  getGameCovers(providerId: string, identifier: ScraperIdentifier): Promise<string[]>
  getGameIcons(providerId: string, identifier: ScraperIdentifier): Promise<string[]>
  getGameLogos(providerId: string, identifier: ScraperIdentifier): Promise<string[]>
  getGameDescriptionList(identifier: ScraperIdentifier): Promise<GameDescriptionList>
  getGameTagsList(identifier: ScraperIdentifier): Promise<GameTagsList>
  getGameExtraInfoList(identifier: ScraperIdentifier): Promise<GameExtraInfoList>
  getProviderInfosWithCapabilities(capabilities: ScraperCapabilities[]): Array<{
    id: string
    name: string
    capabilities: ScraperCapabilities[]
  }>
  getProvider(providerId: string): ScraperProvider | undefined
  getAllProviders(): ScraperProvider[]
  getProviderIds(): string[]
  hasProvider(providerId: string): boolean
}

// 插件 API 主接口 - 与主应用完全一致
export interface IPluginAPI {
  /** 插件ID */
  readonly pluginId: string
  /** 配置数据库 */
  readonly ConfigDB: IConfigDB
  /** 游戏数据库 */
  readonly GameDB: IGameDB
  /** 插件专用数据库 */
  readonly PluginDB: IPluginDB
  /** 事件总线 */
  readonly eventBus: IEventBus
  /** IPC通信 */
  readonly ipc: IIpcManager
  /** 刮削器管理器 */
  readonly scraper: IScraperManager
}

// 插件接口
export interface IPlugin {
  /** 激活插件 */
  activate(api: IPluginAPI): Promise<void> | void
  /** 停用插件 */
  deactivate?(api: IPluginAPI): Promise<void> | void
}
