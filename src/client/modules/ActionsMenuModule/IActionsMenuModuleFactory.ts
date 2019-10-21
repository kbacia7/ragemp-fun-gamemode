import { Module } from "../Module"

export interface IActionsMenuModuleFactory {
    create: () => Module
}
