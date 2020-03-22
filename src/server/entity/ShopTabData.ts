import { ShopTabFilterData } from "./ShopTabFilterData"

export class ShopTabData {
    public readonly filters: ShopTabFilterData[]
    public readonly money: number
    public readonly diamonds: number
    public readonly column_size: number
    public readonly name: string
    public readonly display_name: string
    public readonly subcategories: ShopTabData[]
}
