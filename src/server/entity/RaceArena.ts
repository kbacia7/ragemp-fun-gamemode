import { Model } from "objection"
import { RaceArenaCheckpoint } from "./RaceArenaCheckpoint"
import { RaceArenaSpawnPoint } from "./RaceArenaSpawnPoint"

export class RaceArena extends Model {
  public static tableName = "races_arenas"
  public readonly id!: number
  public name: string
  public author: string

  public static get relationMappings()  {
    return {
      checkpoints: {
        join: {
          from: "races_arenas.id",
          to: "races_arenas_checkpoints.arenaId",
        },
        modelClass: RaceArenaCheckpoint,
        relation: Model.HasManyRelation,
      },
      spawns: {
        join: {
          from: "races_arenas.id",
          to: "races_arenas_spawns.arenaId",
        },
        modelClass: RaceArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
    }

}
}
