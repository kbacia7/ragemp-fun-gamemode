import { Model } from "objection"
import { DMArena } from "./DMArena"
import { HeavyDMArena } from "./HeavyDMArena"
import { SniperArenaEntity } from "./SniperArenaEntity"

export class SniperArenaWeapon extends Model {
  public static tableName = "sniper_arenas_weapons"
  public readonly id!: number
  public weaponId: number
  public ammo: number
  public arenaId: number

  public static get relationMappings()  {
    return {
      arena: {
        join: {
          from: "sniper_arenas_weapons.arenaId",
          to: "sniper_arenas.id",
        },
        modelClass: SniperArenaEntity,
        relation: Model.BelongsToOneRelation,
      },
    }

}
}
