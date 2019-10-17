import { IPlayerHashPassword } from "./IPlayerHashPassword"

export interface IPlayerHashPasswordFactory {
    create: () => IPlayerHashPassword
}
