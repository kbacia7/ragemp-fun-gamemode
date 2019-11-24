import { Model } from "objection"
import { DMArenaSpawnPoint } from "./DMArenaSpawnPoint"
import { DMArenaWeapon } from "./DMArenaWeapon"
import { TeamDeathmatchArenaSpawnPoint } from "./TeamDeathmatchArenaSpawnPoint"
import { TeamDeathmatchArenaWeapon } from "./TeamDeathmatchArenaWeapon"

export class DMArena extends Model {
  public static tableName = "dm_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public active: boolean

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "dm_arenas.id",
          to: "dm_arenas_spawns.arenaId",
        },
        modelClass: DMArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
      weapons: {
        join: {
          from: "dm_arenas.id",
          to: "dm_arenas_weapons.arenaId",
        },
        modelClass: DMArenaWeapon,
        relation: Model.HasManyRelation,
      },
    }

}
}
