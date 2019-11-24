import { Model } from "objection"
import { DMArena } from "./DMArena"

export class DMArenaSpawnPoint extends Model {
  public static tableName = "dm_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "dm_arenas_spawns.arenaId",
        to: "dm_arenas.id",
      },
      modelClass: DMArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
}
