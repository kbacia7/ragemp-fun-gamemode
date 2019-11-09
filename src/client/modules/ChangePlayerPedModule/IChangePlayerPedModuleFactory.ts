import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Module } from "../Module"

export interface IChangePlayerPedModuleFactory {
    create: () => Module
}
