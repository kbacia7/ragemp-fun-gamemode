import { Model } from "objection"

export class Player extends Model {
  public static tableName = "players"
  public readonly id!: number
  public name: string
  public rank: string
  public kills: number
  public deaths: number
}
