import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IBuyAction } from "./IBuyAction"

export class SkinOnceChangeBuyAction implements IBuyAction {
    public buy(buyer: PlayerMp, value: number) {
        buyer.call(ChangePlayerPedModuleEvents.CHANGE_PED, [value])
    }
}
