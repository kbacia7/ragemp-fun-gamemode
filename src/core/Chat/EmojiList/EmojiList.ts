import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import emojiEssential from "emoji-essential"
import twemoji from "twemoji"
import { IEmojiList } from "./IEmojiList"

export class EmojiList implements IEmojiList {
    private _regexpFactory: IRegExpFactory = null
    constructor(regexpFactory: IRegExpFactory) {
        this._regexpFactory = regexpFactory
    }

    public replaceEmoji(text: string) {
        const name2emoji = {}
        const regexToRemoveEmojis = this._regexpFactory.create([
            "([\\u2700-\\u27BF]|[\\uE000-\\uF8FF]|\\uD83C[\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]",
            "|[\\u2011-\\u26FF]|\\uD83E[\\uDD10-\\uDDFF])",
        ].join(), "g")
        Object.keys(emojiEssential).forEach((group) => {
            Object.keys(emojiEssential[group]).forEach((sub) => {
                Object.keys(
                    emojiEssential[group][sub],
                ).forEach((emoji) => {
                    let key = emojiEssential[group][sub][emoji].replace(
                        regexToRemoveEmojis, "",
                    ).trimStart().replace(/[ :]+/g, "_")
                    key = `:${key}:`
                    name2emoji[key] = emoji
                    name2emoji[emoji] = key
                })
            })
        })
        const matches = text.match(/:[A-Z_a-z]+:/gm)
        if (matches && matches.length > 0) {
            matches.forEach((toReplace: string) => {
                if (name2emoji[toReplace]) {
                    text = text.replace(toReplace, name2emoji[toReplace])
                }
            })
        }
        const newText = twemoji.parse(text, {
            size: 72,
        })
        if (newText.length !== text.length) {
            text = newText
            text = text.replace(/\"/g, "'")
            text = text.replace("draggable", "style='width:16px;height:16px' draggable")
        }
        text = text.replace(regexToRemoveEmojis, "").trim()
        return text
    }
}
