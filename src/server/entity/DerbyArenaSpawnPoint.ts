import { Model } from "objection"
import { DerbyArena } from "./DerbyArena"

export class DerbyArenaSpawnPoint extends Model {
  public static tableName = "derby_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "derby_arenas_spawns.arenaId",
        to: "derby_arenas.id",
      },
      modelClass: DerbyArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
  public rotation: number
}
