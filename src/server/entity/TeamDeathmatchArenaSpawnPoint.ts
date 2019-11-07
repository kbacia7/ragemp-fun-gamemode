import { Model } from "objection"
import { RaceArena } from "./RaceArena"
import { TeamDeathmatchArena } from "./TeamDeathmatchArena"

export class TeamDeathmatchArenaSpawnPoint extends Model {
  public static tableName = "tdm_arenas_spawns"

  public static relationMappings = {
    arena: {
      join: {
        from: "tdm_arenas_spawns.arenaId",
        to: "tdm_arenas.id",
      },
      modelClass: TeamDeathmatchArena,
      relation: Model.BelongsToOneRelation,
    },

}
  public readonly id!: number
  public arenaId: number
  public x: number
  public y: number
  public z: number
  public team: number

}
