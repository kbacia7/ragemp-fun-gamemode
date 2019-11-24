import { Model } from "objection"
import { HideAndSeekArenaSpawnPoint } from "./HideAndSeekArenaSpawnPoint"

export class HideAndSeekArena extends Model {
  public static tableName = "hideandseek_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public lookingX: number
  public lookingY: number
  public lookingZ: number

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "hideandseek_arenas.id",
          to: "hideandseek_arenas_spawns.arenaId",
        },
        modelClass: HideAndSeekArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
    }

}
}
