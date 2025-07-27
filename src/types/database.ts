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
import type { Get, Paths } from 'type-fest'

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

export interface IPluginDB {
  getValue(key: string, defaultValue?: any): Promise<any>
  setValue(key: string, value: any): Promise<void>
}
