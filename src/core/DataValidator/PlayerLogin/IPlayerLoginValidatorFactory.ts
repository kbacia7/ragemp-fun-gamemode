import { IDataValidator } from "../IDataValidator"

export interface IPlayerLoginValidatorFactory {
    create: () => IDataValidator
}
