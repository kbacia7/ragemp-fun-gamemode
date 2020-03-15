import { IDataValidator } from "../IDataValidator"

export interface IHTMLValidatorFactory {
    create: () => IDataValidator
}
