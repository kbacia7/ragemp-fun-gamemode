import { IEscapeCharacters } from "./IEscapeCharacters"

export class HTMLEscapeCharacters implements IEscapeCharacters {
    public escape(text: string) {
        text = text.replace(/\&/g, "&amp;")
        text = text.replace(/\"/g, "&quot;")
        text = text.replace(/\'/g, "&apos;")
        text = text.replace(/\</g, "&lt;")
        text = text.replace(/\>/g, "&gt;")
        text = text.replace(/\\/g, "&bsol;")
        text = text.replace(/\//g, "&sol;")

        return text
    }
}
