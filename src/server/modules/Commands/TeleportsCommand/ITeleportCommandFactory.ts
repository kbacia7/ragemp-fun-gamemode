import { ICommand } from "../ICommand"
import { TeleportCommand } from "./TeleportCommand"

export interface ITeleportCommandFactory {
    create: (alias: string, x: number, y: number, z: number, heading: number) => TeleportCommand
}
