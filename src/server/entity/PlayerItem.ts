import { Item } from "./Item"
import { Player } from "./Player"
import { Rank } from "./Rank"

export class PlayerItem {
  public readonly item: Item
  public readonly player: Player
  public readonly equipped: boolean
}
