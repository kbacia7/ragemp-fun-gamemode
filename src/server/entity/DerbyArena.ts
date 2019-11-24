import { Model } from "objection"
import { DerbyArenaSpawnPoint } from "./DerbyArenaSpawnPoint"

export class DerbyArena extends Model {
  public static tableName = "derby_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public vehicleModel: number
  public heightLimit: number

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "derby_arenas.id",
          to: "derby_arenas_spawns.arenaId",
        },
        modelClass: DerbyArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
    }

}
}
