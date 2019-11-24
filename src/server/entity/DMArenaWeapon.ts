import { Model } from "objection"
import { DMArena } from "./DMArena"

export class DMArenaWeapon extends Model {
  public static tableName = "dm_arenas_weapons"
  public readonly id!: number
  public weaponId: number
  public ammo: number
  public arenaId: number

  public static get relationMappings()  {
    return {
      arena: {
        join: {
          from: "dm_arenas_weapons.arenaId",
          to: "dm_arenas.id",
        },
        modelClass: DMArena,
        relation: Model.BelongsToOneRelation,
      },
    }

}
}
