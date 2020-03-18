import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "popper.js"
import "bootstrap"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import "./style.less"
import { NotificationType } from "core/Notification/NotificationType"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { vsprintf } from "sprintf-js"
import { ChatModuleEvent } from "client/modules/Chat/ChatModuleEvent"
import PerfectScrollbar from "perfect-scrollbar"
import "jquery-ui/ui/core"
import "jquery-ui/ui/widgets/sortable"
import "jquery-ui/ui/widgets/resizable"
import { ChatSpecialTabs } from "core/Chat/ChatSpecialTabs"

const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
const perfectScrollbarForTabs = {}
const specialTabs = [
    ChatSpecialTabs.GLOBAL, ChatSpecialTabs.LOCAL, ChatSpecialTabs.NOTIFICATIONS,
]
$(document).ready(() => {
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
        element.innerText =   i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $("#chat-input").keyup((e) => {
        const input = $("#chat-input").val()
        if (typeof input === "string") {
            if (e.keyCode === 13) {
                if (input.length > 0) {
                    const activeTab = getActiveTab()
                    if (activeTab && activeTab.length > 0) {
                        mp.trigger(ChatModuleEvent.TRY_SEND_MESSAGE, input, activeTab)
                    }
                }
                $("#chat-input").val("")
                $("#chat-input").blur()
                $("#chat-input-container").addClass("d-none")
              }
        }
    })

    $(document).on("click", ".nav-link, .nav-item, .chat-tab-name" , (ev) => {
        const tab = getActiveTab()
        let clickedTab = ev.target.getAttribute("data-chat-id")
        if (!clickedTab || clickedTab.length <= 0) {
            clickedTab = $(ev.target).find(".nav-link").attr("data-chat-id")
            if (!clickedTab || clickedTab.length <= 0) {
                clickedTab = $(ev.target).closest(".nav-link").attr("data-chat-id")
            }
        }
        if (clickedTab && clickedTab.length > 0 && tab !== clickedTab) {
            $(".dropdown-menu").dropdown("hide")
            _global.setTabActive(clickedTab)
            $("#chat-input").focus()
        }
    })

    $(document).on("contextmenu", ".nav-link, .nav-item, .chat-tab-name", (ev) => {
        let dropdown = $(ev.target).next(".dropdown-menu")
        if (!dropdown || dropdown.length <= 0) {
            dropdown = $(ev.target).find(".dropdown-menu")
            if (!dropdown || dropdown.length <= 0) {
                dropdown = $(ev.target).closest(".nav-link").next(".dropdown-menu")
            }
        }
        if (dropdown) {
            $(".dropdown-menu").dropdown("hide")
            dropdown.dropdown("show")
        }
    })

    $(document).on("click", () => {
        $(".dropdown-menu").dropdown("hide")
    })

    $("#chat-input-container").css("width", $("#chat").width())
    specialTabs.forEach((tabName: string) => {
        _global.setTabActive(tabName)
    })
    _global.setTabActive(specialTabs[0])
    $("#chat-tabs").sortable({
        items: "li.nav-item:not(.disallow-sort):not(.dropdown-item)",
    })

    $("[data-tab-add-id]").on("click", (ev) => {
        _global.setTabActive($(ev.target).attr("data-tab-add-id"))
    })

    $("#chat-hide").on("click", () => {
        hideChat()
    })

    $("#chat-show").on("click", () => {
        showChat()
    })

    $("#chat").resizable({
        maxHeight: 330,
        maxWidth: 1200,
        minHeight: 250,
        minWidth: 290,
        start: () => {
            $("#chat-input-container").addClass("d-none")
        },
        stop: () => {
            $("#chat-input-container").removeClass("d-none")
            $("#chat-input-container").css("width", $("#chat").width())
        },
    })
})

const closeTab = (name: string) => {
    const chatTabName = `chat-tab-${name}`
    const tabButton = $(`#${chatTabName}`).closest(".nav-item")
    tabButton.remove()

    const chatContent = $(`[data-chat-tab='${chatTabName}']`)
    chatContent.remove()
    if (!$(".chat-active-tab") || $(".chat-active-tab").length <= 0) {
        const tab = $("[data-chat-id]").first()
        if (tab) {
            _global.setTabActive(tab.attr("data-chat-id"))
        } else {
            $("#chat-input-container").addClass("d-none")
            mp.trigger(ChatModuleEvent.FAILED_SHOW_INPUT)
        }
    }
}

const _global: any = (window || global) as any

_global.toggleInput = () => {
    if ($("[data-chat-id]") && $("[data-chat-id]").length > 0 && !$("#chat").hasClass("d-none")) {
        if ($("#chat-input-container").hasClass("d-none")) {
            $("#chat-input-container").removeClass("d-none")
            $("#chat-input").focus()
        }
    } else {
        mp.trigger(ChatModuleEvent.FAILED_SHOW_INPUT)
    }
}

_global.setTabActive = (name: string) => {
    if (name && name.length > 0) {
        let chatContent: JQuery<HTMLElement> = $(`[data-chat-tab$='tab-${name}']`)
        if (!chatContent || chatContent.length <= 0) {
            chatContent = createChatContentForTab(name)
        }
        $("[data-chat-tab]").addClass("d-none")
        $("[data-chat-id]").removeClass("chat-active-tab")
        const tabButton = $(`#chat-tab-${name}`)
        tabButton.addClass("chat-active-tab")
        const badge = $(`[data-chat-id='${name}']`).find(".chat-tab-name").next(".badge").text("")
        chatContent.removeClass("d-none")
    }
}

const createChatContentForTab = (name: string) => {
    const tabButton = $(`#chat-tab-${name}`)
    if (!tabButton || tabButton.length <= 0) {
        const newTab = $("#chat-tab-sample").clone()
        newTab.removeAttr("id")
        const linkEl = newTab.find(".nav-link")
        linkEl.attr("id", `chat-tab-${name}`)
        linkEl.attr("data-chat-id", name)
        if (specialTabs.includes(name as ChatSpecialTabs)) {
            linkEl.find(".chat-tab-name").text(i18nTranslator.translate(`${name.toUpperCase()}_TAB`))
        }
        newTab.find("[data-tab-action]").each((index, el) => {
            $(el).on("click", () => {
                const clickedTab = name
                const action = $(el).attr("data-tab-action")
                newTab.find(".dropdown-menu").dropdown("hide")
                switch (action) {
                    case "close":
                        closeTab(clickedTab)
                        break
                    case "mute":
                        closeTab(clickedTab)
                        break
                }
            })
        })
        newTab.insertBefore("#add-tab-button")
    }
    const newChatContent = $(`[data-chat-tab="chat-tab-sample"]`).clone()
    newChatContent.attr("data-chat-tab", `chat-tab-${name}`)
    newChatContent.insertAfter("#chat-bottom-line")
    perfectScrollbarForTabs[name] = new PerfectScrollbar(newChatContent.find(".chat-scrollable-content")[0])
    return newChatContent
}

const getActiveTab = () => {
    return $(".chat-active-tab").attr("data-chat-id")
}

const hideChat = () => {
    $("#chat").addClass("d-none")
    $("#chat-summary").removeClass("d-none")
    $("#chat-input-container").addClass("d-none")
    mp.trigger(ChatModuleEvent.FAILED_SHOW_INPUT)
    sumChatsForSummary()
}

const showChat = () => {
    $("#chat-summary").addClass("d-none")
    $("#chat").removeClass("d-none")
    const tab = getActiveTab()
    if (tab && tab.length > 0) {
        _global.setTabActive(tab)
    }
}
_global.addMesageToTab = (
    tabName: string, author: string, color: string,
    message: string, dateTime: string, id: string, serverMessage: boolean,
    args: string,
) => {
    const chatContent = $(`[data-chat-tab$='tab-${tabName}']`)
    if (chatContent) {
        const chatScrollableContent = chatContent.find(".chat-scrollable-content")
        const newMessage = chatContent.find(".message-example").clone()
        newMessage.addClass("message")
        newMessage.removeClass("message-example")
        newMessage.attr("id", id)

        if (!serverMessage) {
            newMessage.find(".author").text(author)
            newMessage.find(".author").css("color", color)
        } else {
            newMessage.find(".author").remove()
            newMessage.find(".message").css("color", color)
            newMessage.find(".message").css("font-weight", "bold")
            message = i18nTranslator.translate(message)
            message = `[${dateTime}] ${message}`
            let arrayOfArgs: string[] = []
            if (args.length > 2) {
                arrayOfArgs = JSON.parse(args)
            }
            if (arrayOfArgs.length > 0)  {
                message = vsprintf(message, arrayOfArgs)
            }
        }
        newMessage.find(".message").html(decodeEntities(message))

        chatScrollableContent.append(newMessage)
        if (getActiveTab() === tabName && !$("#chat").hasClass("d-none")) {
            if (perfectScrollbarForTabs[tabName]) {
                perfectScrollbarForTabs[tabName].update()
            }
            chatScrollableContent.scrollTop(chatScrollableContent[0].scrollHeight)
        } else {
            const badge = $(`[data-chat-id='${tabName}']`).find(".chat-tab-name").next(".badge")
            const actualText = badge.text()
            if (!actualText || actualText.length <= 0) {
                badge.text("1")
            } else {
                badge.text(parseInt(actualText, 10) + 1)
            }
        }
        sumChatsForSummary()

    }
}

const sumChatsForSummary = () => {
    let c: number = 0
    $(".chat-counter:not(#chat-summary-counter)").each((index, el) => {
        if ($(el).text().length > 0) {
            c += parseInt($(el).text(), 10)
        }
    })
    if (c <= 0) {
        $("#chat-summary-counter").text("")
    } else {
        $("#chat-summary-counter").text(c)
    }
}

const decodeEntities = (encodedString: string) => {
    const textArea = document.createElement("textarea")
    textArea.innerHTML = encodedString
    return textArea.value
  }
