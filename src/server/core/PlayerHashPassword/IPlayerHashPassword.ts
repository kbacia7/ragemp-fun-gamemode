export interface IPlayerHashPassword {
    hash: (password: string) => string
    compare: (passwordFromDb: string, plainPassword: string) => boolean
}
