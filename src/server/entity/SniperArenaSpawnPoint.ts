import { Model } from "objection"
import { DMArena } from "./DMArena"
import { HeavyDMArena } from "./HeavyDMArena"
import { SniperArenaEntity } from "./SniperArenaEntity"

export class SniperArenaSpawnPoint extends Model {
  public static tableName = "sniper_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "sniper_arenas_spawns.arenaId",
        to: "sniper_arenas.id",
      },
      modelClass: SniperArenaEntity,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
}
