import { Item } from "./Item"
import { LootboxItem } from "./LootboxItem"

export class Lootbox {
  public readonly id: number
  public readonly lootbox_items: LootboxItem[]
  public readonly max_chance: number
  public readonly item: Item
}
