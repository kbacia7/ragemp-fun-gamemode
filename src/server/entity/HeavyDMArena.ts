import { HeavyDMArenaSpawnPoint } from "./HeavyDMArenaSpawnPoint"
import { HeavyDMArenaWeapon } from "./HeavyDMArenaWeapon"

export class HeavyDMArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly active: boolean
  public readonly spawns: HeavyDMArenaSpawnPoint[]
  public readonly weapons: HeavyDMArenaWeapon[]
}
