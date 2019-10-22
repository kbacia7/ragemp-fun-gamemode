import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Module } from "../Module"

export interface IPlayerProfileModuleFactory {
    create: () => Module
}
