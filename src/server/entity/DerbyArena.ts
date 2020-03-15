import { DerbyArenaSpawnPoint } from "./DerbyArenaSpawnPoint"

export class DerbyArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly vehicle_model: number
  public readonly height_limit: number
  public readonly spawns: DerbyArenaSpawnPoint[]
}
