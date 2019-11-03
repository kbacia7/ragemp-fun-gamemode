import { Model } from "objection"

export class Setting extends Model {
  public static tableName = "settings"
  public readonly id!: number
  public name: string
  public value: string
  public description: string
}
