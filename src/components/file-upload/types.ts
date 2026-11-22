export interface UploadItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  /** 0–100 */
  progress: number
  error?: string
  result?: unknown
}

export type UploadFn = (
  file: File,
  context: { onProgress: (percent: number) => void; signal: AbortSignal },
) => Promise<unknown>

export type RejectReason = 'type' | 'size' | 'count'
