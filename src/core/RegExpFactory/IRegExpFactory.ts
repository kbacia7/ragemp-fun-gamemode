export interface IRegExpFactory {
    create: (regex: string, flags: string) => RegExp
}
