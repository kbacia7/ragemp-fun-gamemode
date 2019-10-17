import { IDataValidator } from "../IDataValidator"
import { PlayerEmailValidator } from "./PlayerEmailValidator"

export interface IPlayerEmailValidatorFactory {
    create: () => IDataValidator
}
