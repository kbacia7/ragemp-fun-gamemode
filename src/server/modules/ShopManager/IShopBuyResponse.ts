import { ShopResponses } from "server/core/API/ShopResponses"

export interface IShopBuyResponse {
    code: ShopResponses,
    tab_name: string
    cost: number,
    ragemp_item_id: number
}
