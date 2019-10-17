import { IDataValidator } from "../IDataValidator"

export interface IPlayerPasswordValidatorFactory {
    create: () => IDataValidator
}
