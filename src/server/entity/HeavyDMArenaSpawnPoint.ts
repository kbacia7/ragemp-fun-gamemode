import { Model } from "objection"
import { DMArena } from "./DMArena"
import { HeavyDMArena } from "./HeavyDMArena"

export class HeavyDMArenaSpawnPoint extends Model {
  public static tableName = "heavy_dm_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "heavy_dm_arenas_spawns.arenaId",
        to: "heavy_dm_arenas.id",
      },
      modelClass: HeavyDMArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
}
