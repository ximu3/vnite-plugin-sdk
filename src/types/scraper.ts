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

export interface ScraperProvider {
  id: string
  name: string

  searchGames?(gameName: string): Promise<GameList>
  checkGameExists?(identifier: ScraperIdentifier): Promise<boolean>
  getGameMetadata?(identifier: ScraperIdentifier): Promise<GameMetadata>
  getGameBackgrounds?(identifier: ScraperIdentifier): Promise<string[]>
  getGameCovers?(identifier: ScraperIdentifier): Promise<string[]>
  getGameLogos?(identifier: ScraperIdentifier): Promise<string[]>
  getGameIcons?(identifier: ScraperIdentifier): Promise<string[]>
}

export type GameList = {
  id: string
  name: string
  releaseDate: string
  developers: string[]
}[]

export type GameMetadata = {
  name: string
  originalName: string | null
  releaseDate: string
  description: string
  developers: string[]
  relatedSites: {
    label: string
    url: string
  }[]
  tags: string[]
  publishers?: string[]
  genres?: string[]
  platforms?: string[]
  extra?: {
    key: string
    value: string[]
  }[]
}

export type ScraperIdentifier = {
  type: 'id' | 'name'
  value: string
}

export type GameDescriptionList = {
  dataSource: string
  description: string
}[]

export type GameTagsList = {
  dataSource: string
  tags: string[]
}[]

export type GameExtraInfoList = {
  dataSource: string
  extra: {
    key: string
    value: string[]
  }[]
}[]

export type ScraperCapabilities =
  | 'searchGames'
  | 'checkGameExists'
  | 'getGameMetadata'
  | 'getGameBackgrounds'
  | 'getGameCovers'
  | 'getGameLogos'
  | 'getGameIcons'

// Define the type for game metadata fields which can be updated
export type GameMetadataField =
  // Basic information
  | 'name'
  | 'originalName'
  | 'releaseDate'
  | 'description'

  // Development and release information
  | 'developers'
  | 'publishers'

  // Categorization
  | 'genres'
  | 'platforms'
  | 'tags'

  // Other information
  | 'relatedSites'
  | 'extra'

  // Image resources
  | 'cover'
  | 'background'
  | 'logo'
  | 'icon'

export const AllGameMetadataUpdateFields: (GameMetadataField | GameMetadataUpdateMode)[] = [
  '#all',
  '#missing',
  'name',
  'originalName',
  'releaseDate',
  'description',
  'developers',
  'publishers',
  'genres',
  'platforms',
  'tags',
  'relatedSites',
  'extra',
  'cover',
  'background',
  'logo',
  'icon'
]

// Special update modes
export type GameMetadataUpdateMode = '#all' | '#missing'

// Define the complete update options type
export interface GameMetadataUpdateOptions {
  /**
   * Overwrite existing metadata fields
   * @default true
   */
  overwriteExisting?: boolean

  /**
   * Update image resources (when requesting to update image fields)
   * @default true
   */
  updateImages?: boolean

  /**
   * Merge strategy - Applied to array-type fields
   * - 'replace': Completely replace existing data
   * - 'append': Append new data to existing data
   * - 'merge': Merge new and old data and remove duplicates
   * @default 'merge'
   */
  mergeStrategy?: 'replace' | 'append' | 'merge'

  /**
   * Priority of data sources when updating metadata
   * @default []
   */
  sourcesPriority?: string[]
}

/**
 * Single game metadata update result
 */
export interface BatchUpdateResult {
  gameId: string
  success: boolean
  error?: string
  dataSourceId: string | null
  gameName: string | null
}

/**
 * Batch update results summary
 */
export interface BatchUpdateResults {
  totalGames: number
  successfulUpdates: number
  failedUpdates: number
  results: BatchUpdateResult[]
}

export interface BatchUpdateGameMetadataProgress {
  gameId: string
  gameName: string | null
  dataSource: string
  dataSourceId: string | null
  fields: (GameMetadataField | GameMetadataUpdateMode)[]
  options: GameMetadataUpdateOptions
  status: 'success' | 'error'
  error?: string
  current: number
  total: number
}
