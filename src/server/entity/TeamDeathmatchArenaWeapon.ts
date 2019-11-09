import { Model } from "objection"
import { TeamDeathmatchArena } from "./TeamDeathmatchArena"

export class TeamDeathmatchArenaWeapon extends Model {
  public static tableName = "tdm_arenas_weapons"
  public readonly id!: number
  public weaponId: number
  public ammo: number
  public arenaId: number

  public static get relationMappings()  {
    return {
      arena: {
        join: {
          from: "tdm_arenas_weapons.arenaId",
          to: "tdm_arenas.id",
        },
        modelClass: TeamDeathmatchArena,
        relation: Model.BelongsToOneRelation,
      },
    }

}
}
