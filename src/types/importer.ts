/**
 * Importer 相关类型定义
 * 从主应用 src/main/features/importer/services/steam/types.ts 复制而来
 */

export interface GetOwnedGamesResponse {
  response: {
    game_count: number
    games: Array<{
      appid: number
      name: string
      playtime_2weeks?: number
      playtime_forever: number
    }>
  }
}

export interface SteamFormattedGameInfo {
  appId: number
  name: string
  totalPlayingTime: number
  selected?: boolean
}

// Type Definitions for Progress Messages
export interface ProgressMessage {
  current: number
  total: number
  status: 'started' | 'processing' | 'completed' | 'error'
  message: string
  game?: {
    name: string
    status: 'success' | 'error'
    error?: string
  }
}
