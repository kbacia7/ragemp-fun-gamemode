import { OneShootArenaSpawnPoint } from "./OneShootArenaSpawnPoint"
import { OneShootArenaWeapon } from "./OneShootArenaWeapon"

export class OneShootArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly active: number
  public readonly spawns: OneShootArenaSpawnPoint[]
  public readonly weapons: OneShootArenaWeapon[]

}
