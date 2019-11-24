import { Model } from "objection"
import { OneShootArena } from "./OneShootArena"

export class OneShootArenaWeapon extends Model {
  public static tableName = "one_shoot_arenas_weapons"
  public readonly id!: number
  public weaponId: number
  public ammo: number
  public arenaId: number

  public static get relationMappings()  {
    return {
      arena: {
        join: {
          from: "oneshoot_arenas_weapons.arenaId",
          to: "oneshoot_arenas.id",
        },
        modelClass: OneShootArena,
        relation: Model.BelongsToOneRelation,
      },
    }

}
}
