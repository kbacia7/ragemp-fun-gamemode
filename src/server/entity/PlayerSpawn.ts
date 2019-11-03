import { Model } from "objection"

export class PlayerSpawn extends Model {
  public static tableName = "players_spawns"
  public readonly id!: number
  public x: number
  public y: number
  public z: number
}
