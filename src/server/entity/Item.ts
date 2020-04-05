import { ItemSection } from "./ItemSection"

export class Item {
  public readonly id: number
  public readonly section: ItemSection
  public readonly title_display_name: string
  public readonly sub_section: string
  public readonly filename: string
  public readonly description: string
  public readonly days_to_expire: number | null
  public readonly ragemp_item_id: number
}
