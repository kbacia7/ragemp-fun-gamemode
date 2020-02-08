import { SniperArenaSpawnPoint } from "./SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "./SniperArenaWeapon"

export class SniperArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly active: boolean
  public readonly spawns: SniperArenaSpawnPoint[]
  public readonly weapons: SniperArenaWeapon[]
}
