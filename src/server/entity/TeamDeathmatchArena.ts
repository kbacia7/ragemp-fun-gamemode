import { TeamDeathmatchArenaSpawnPoint } from "./TeamDeathmatchArenaSpawnPoint"
import { TeamDeathmatchArenaWeapon } from "./TeamDeathmatchArenaWeapon"

export class TeamDeathmatchArena {
  public readonly id!: number
  public readonly name: string
  public readonly author: string
  public readonly spawns: TeamDeathmatchArenaSpawnPoint[]
  public readonly weapons: TeamDeathmatchArenaWeapon[]

}
