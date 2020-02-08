import { DMArenaSpawnPoint } from "./DMArenaSpawnPoint"
import { DMArenaWeapon } from "./DMArenaWeapon"

export class DMArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly active: boolean
  public readonly spawns: DMArenaSpawnPoint[]
  public readonly weapons: DMArenaWeapon[]
}
