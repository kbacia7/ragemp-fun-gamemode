import { Item } from "./Item"
import { Level } from "./Level"
import { PlayerItem } from "./PlayerItem"
import { Rank } from "./Rank"

export class Player {
  public readonly id: number
  public readonly player_items: PlayerItem[]
  public readonly login: string
  public readonly password: string
  public readonly email: string
  public readonly rank: Rank
  public readonly kills: number
  public readonly deaths: number
  public readonly ped: number
  public readonly money: number
  public readonly diamonds: number
  public readonly level: Level
  public readonly exp: number
}
