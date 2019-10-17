import { Model } from "objection"

export class Player extends Model {
  public static tableName = "players"
  public readonly id!: number
  public login: string
  public password: string
  public email: string
  public rank: string
  public kills: number
  public deaths: number
}
