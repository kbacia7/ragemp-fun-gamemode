export class RegExpFactory {
    public create(regex: string, flags: string = "") {
        return new RegExp(regex, flags)
    }
}
