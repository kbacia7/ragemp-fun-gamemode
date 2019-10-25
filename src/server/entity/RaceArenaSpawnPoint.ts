import { Model } from "objection"
import { RaceArena } from "./RaceArena"

export class RaceArenaSpawnPoint extends Model {
  public static tableName = "races_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "races_arenas_spawns.arenaId",
        to: "races_arenas.id",
      },
      modelClass: RaceArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
  public rotation: number
  public vehicleModel: number

}
