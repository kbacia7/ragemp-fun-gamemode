import { HideAndSeekArenaSpawnPoint } from "./HideAndSeekArenaSpawnPoint"

export class HideAndSeekArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly looking_X: number
  public readonly looking_Y: number
  public readonly looking_Z: number
  public readonly spawns: HideAndSeekArenaSpawnPoint[]
}
