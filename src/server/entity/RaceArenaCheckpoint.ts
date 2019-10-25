import { Model } from "objection"
import { RaceArena } from "./RaceArena"

export class RaceArenaCheckpoint extends Model {
  public static tableName = "races_arenas_checkpoints"

  public static relationMappings = {
    arena: {
      join: {
        from: "races_arenas_checkpoints.arenaId",
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
}
