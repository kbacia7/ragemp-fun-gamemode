import { Module } from "../Module"

export interface ICommandListenerModuleFactory {
    create: () => Module
}
