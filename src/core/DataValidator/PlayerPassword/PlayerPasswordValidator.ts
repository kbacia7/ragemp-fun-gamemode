import { IDataValidator } from "../IDataValidator"

export class PlayerPasswordValidator implements IDataValidator {
    public validate(text: string) {
        return text.length > 5 && text.length <= 32
    }

}
