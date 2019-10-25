import { Model } from "objection"

export class RaceArena extends Model {
  public static tableName = "races_arenas"
  public readonly id!: number
  public name: string
  public author: string
}
