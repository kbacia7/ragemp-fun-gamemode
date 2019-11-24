import { Model } from "objection"
import { DMArena } from "./DMArena"
import { HeavyDMArena } from "./HeavyDMArena"

export class HeavyDMArenaWeapon extends Model {
  public static tableName = "heavy_dm_arenas_weapons"
  public readonly id!: number
  public weaponId: number
  public ammo: number
  public arenaId: number

  public static get relationMappings()  {
    return {
      arena: {
        join: {
          from: "heavy_dm_arenas_weapons.arenaId",
          to: "heavy_dm_arenas.id",
        },
        modelClass: HeavyDMArena,
        relation: Model.BelongsToOneRelation,
      },
    }

}
}
