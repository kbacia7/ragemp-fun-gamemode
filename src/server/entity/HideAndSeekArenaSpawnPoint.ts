import { Model } from "objection"
import { HideAndSeekArena } from "./HideAndSeekArena"

export class HideAndSeekArenaSpawnPoint extends Model {
  public static tableName = "hideandseek_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "hideandseek_arenas_spawns.arenaId",
        to: "hideandseek_arenas.id",
      },
      modelClass: HideAndSeekArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
}
