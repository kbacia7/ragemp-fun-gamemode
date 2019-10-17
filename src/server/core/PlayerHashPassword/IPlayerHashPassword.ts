export interface IPlayerHashPassword {
    hash: (password: string, login: string) => string
    compare: (passwordFromDb: string, plainPassword: string) => boolean
}
