import { Model } from "objection"
import { DMArenaSpawnPoint } from "./DMArenaSpawnPoint"
import { DMArenaWeapon } from "./DMArenaWeapon"
import { HeavyDMArenaSpawnPoint } from "./HeavyDMArenaSpawnPoint"
import { HeavyDMArenaWeapon } from "./HeavyDMArenaWeapon"

export class HeavyDMArena extends Model {
  public static tableName = "heavy_dm_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public active: boolean

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "heavy_dm_arenas.id",
          to: "heavy_dm_arenas_spawns.arenaId",
        },
        modelClass: HeavyDMArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
      weapons: {
        join: {
          from: "heavy_dm_arenas.id",
          to: "heavy_dm_arenas_weapons.arenaId",
        },
        modelClass: HeavyDMArenaWeapon,
        relation: Model.HasManyRelation,
      },
    }

}
}
