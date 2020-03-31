import { ShopTabData } from "server/entity/ShopTabData"

export interface IShopManager {
    initialize: (firstTab: string) => Promise<[ShopTabData, ShopTabData[]]>
}
