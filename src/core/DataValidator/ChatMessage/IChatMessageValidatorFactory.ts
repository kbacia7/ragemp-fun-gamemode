import { IDataValidator } from "../IDataValidator"

export interface IChatMessageValidatorFactory {
    create: () => IDataValidator
}
