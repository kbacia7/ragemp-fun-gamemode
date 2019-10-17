import bcrypt from "bcryptjs"
import { IPlayerHashPassword } from "./IPlayerHashPassword"
export class PlayerHashPassword implements IPlayerHashPassword {
    public hash(password: string)  {
        return bcrypt.hashSync(password, 15)
    }

    public compare(passwordFromDb: string, plainPassword: string) {
        return bcrypt.compareSync(plainPassword, passwordFromDb)
    }
}
