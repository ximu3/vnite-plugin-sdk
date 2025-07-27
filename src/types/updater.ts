export interface UpdateCheckResult {
  readonly updateInfo: UpdateInfo
  readonly downloadPromise?: Promise<Array<string>> | null
  readonly cancellationToken?: CancellationToken
  readonly versionInfo: VersionInfo
}

export interface UpdateInfo {
  readonly version: string
  readonly files: Array<UpdateFileInfo>
  readonly releaseName?: string | null
  readonly releaseNotes?: string | Array<ReleaseNoteInfo> | null
  readonly releaseDate: string
  readonly stagingPercentage?: number
  readonly isPrerelease?: boolean
}

export interface UpdateFileInfo {
  readonly url: string
  readonly sha512: string
  readonly size: number
  readonly blockMapSize?: number
}

export interface ReleaseNoteInfo {
  readonly version: string
  readonly note: string | null
}

export interface VersionInfo {
  readonly version: string
}

export interface CancellationToken {
  readonly cancelled: boolean
  cancel(): void
  onCancelled(callback: () => void): void
}

export interface ProgressInfo {
  total: number
  delta: number
  transferred: number
  percent: number
  bytesPerSecond: number
}
