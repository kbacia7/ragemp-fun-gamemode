import { Currency } from "./Currency"

export interface IShopManagerBuyData {
    player_id: number,
    buy_in: string,
    currency: Currency
    item_id: number
}
