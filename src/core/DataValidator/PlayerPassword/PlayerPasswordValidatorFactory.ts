import { PlayerPasswordValidator } from "./PlayerPasswordValidator"

export class PlayerPasswordValidatorFactory {
    public create() {
        return new PlayerPasswordValidator()
    }
}
