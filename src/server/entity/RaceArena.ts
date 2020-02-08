import { RaceArenaCheckpoint } from "./RaceArenaCheckpoint"
import { RaceArenaSpawnPoint } from "./RaceArenaSpawnPoint"

export class RaceArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly checkpoints: RaceArenaCheckpoint[]
  public readonly spawns: RaceArenaSpawnPoint[]
}
