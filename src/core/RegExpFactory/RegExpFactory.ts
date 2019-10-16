export class RegExpFactory {
    public create(regex: string) {
        return new RegExp(regex)
    }
}
