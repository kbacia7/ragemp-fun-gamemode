import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "bootstrap"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import "./style.less"
import { NotificationType } from "core/Notification/NotificationType"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import {
    PlayerRegisterAndLoginModuleEvent,
} from "client/modules/PlayerRegisterAndLoginModule/PlayerRegisterAndLoginModuleEvent"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { stringify } from "querystring"
import { PlayerEmailValidator } from "core/DataValidator/PlayerEmail/PlayerEmailValidator"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import { PlayerLoginValidator } from "core/DataValidator/PlayerLogin/PlayerLoginValidator"
import { PlayerPasswordValidator } from "core/DataValidator/PlayerPassword/PlayerPasswordValidator"

const regExpFactory = new RegExpFactory()
const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
const emailValidator = new PlayerEmailValidator(regExpFactory)
const loginValidator = new PlayerLoginValidator(regExpFactory)
const passwordValidator = new PlayerPasswordValidator()
$(document).ready(() => {
    i18nTranslator.loadTranslations("translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText =   i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $("[data-i18n-translate-placeholder]").toArray().forEach((element: HTMLElement) => {
        element.setAttribute(
            "placeholder",
            i18nTranslator.translate(element.getAttribute("data-i18n-translate-placeholder")),
        )
      })
    $("#register-or-login-modal").modal({backdrop: "static", keyboard: false})

    $("#registerButton").on("click", () => {
        $(".is-invalid").removeClass("is-invalid")
        $("#alertRegisterModalWhenRepeatPasswordNotEqualPassword").addClass("d-none")
        $("#alertRegisterModalWhenEmailIsInvalid").addClass("d-none")
        $("#alertRegisterModalWhenLoginIsInvalid").addClass("d-none")
        $("#alertRegisterModalWhenLoginIsTaken").addClass("d-none")
        $("#alertRegisterModalWhenEmailIsTaken").addClass("d-none")
        $("#alertRegisterModalWhenPasswordIsInvalid").addClass("d-none")
        $("#alertRegisterModalUnknownError").addClass("d-none")
        $("#alertRegisterModalWhenAnyFieldIsEmpty").addClass("d-none")

        const email: string = $("#inputRegisterModalEmail").val().toString().trim()
        const password: string = $("#inputRegisterModalPassword").val().toString().trim()
        const login: string = $("#inputRegisterModalLogin").val().toString().trim()
        const repeatedPassword: string = $("#inputRegisterModalPasswordRepeat").val().toString().trim()
        if (login.length === 0 || password.length === 0 || email.length === 0) {
            $("#alertRegisterModalWhenAnyFieldIsEmpty").removeClass("d-none")
        } else {
            if (passwordValidator.validate(password)) {
                if (password === repeatedPassword) {
                    if (emailValidator.validate(email)) {
                        if (loginValidator.validate(login)) {
                            const hashedPassword: string = password
                            mp.trigger(
                                PlayerRegisterAndLoginModuleEvent.TRY_CREATE_ACCOUNT,
                                login, email, hashedPassword,
                            )
                        } else {
                            $("#alertRegisterModalWhenLoginIsInvalid").removeClass("d-none")
                            $("#inputRegisterModalLogin").addClass("is-invalid")
                        }
                    } else {
                        $("#alertRegisterModalWhenEmailIsInvalid").removeClass("d-none")
                        $("#inputRegisterModalEmail").addClass("is-invalid")
                    }
                } else {
                    $("#alertRegisterModalWhenRepeatPasswordNotEqualPassword").removeClass("d-none")
                    $("#inputRegisterModalPassword").addClass("is-invalid")
                    $("#inputRegisterModalPasswordRepeat").addClass("is-invalid")
                }
            } else {
                $("#alertRegisterModalWhenPasswordIsInvalid").removeClass("d-none")
                $("#inputRegisterModalPassword").addClass("is-invalid")
            }
        }
    })

    $("#loginButton").on("click", () => {
        $(".is-invalid").removeClass("is-invalid")
        $("#alertLoginModalWhenLoginIsInvalid").addClass("d-none")
        $("#alertLoginModalWhenDataIsInvalid").addClass("d-none")
        $("#alertLoginModalWhenAnyFieldIsEmpty").addClass("d-none")
        $("#alertLoginModalWhenPasswordIsInvalid").addClass("d-none")
        const password: string = $("#inputLoginModalPassword").val().toString().trim()
        const login: string = $("#inputLoginModalLogin").val().toString().trim()
        if (login.length === 0 || password.length === 0) {
            $("#alertLoginModalWhenAnyFieldIsEmpty").removeClass("d-none")
        } else {
            if (loginValidator.validate(login)) {
                if (passwordValidator.validate(password)) {
                    mp.trigger(PlayerRegisterAndLoginModuleEvent.TRY_LOGIN, login, password)
                } else {
                    $("#inputLoginModalPassword").addClass("is-invalid")
                    $("#alertLoginModalWhenPasswordIsInvalid").removeClass("d-none")
                }
            } else {
                $("#alertLoginModalWhenLoginIsInvalid").removeClass("d-none")
                $("#inputLoginModalLogin").addClass("is-invalid")
            }
        }
    })

    $("#playAsGuestButton").on("click", () => {
        $(".is-invalid").removeClass("is-invalid")
        $("#alertLoginModalWhenLoginIsEmptyAndPlayAsGuest").addClass("d-none")
        $("#alertLoginModalWhenLoginIsInvalid").addClass("d-none")
        $("#alertLoginModalWhenLoginIsTakenAndPlayAsGuest").addClass("d-none")
        const login: string = $("#inputLoginModalLogin").val().toString().trim()
        if (login.length <= 0) {
            $("#inputLoginModalLogin").addClass("is-invalid")
            $("#alertLoginModalWhenLoginIsEmptyAndPlayAsGuest").removeClass("d-none")
        } else {
            if (loginValidator.validate(login)) {
                mp.trigger(PlayerRegisterAndLoginModuleEvent.TRY_PLAY_AS_GUEST, login)
            } else {
                $("#alertLoginModalWhenLoginIsInvalid").addClass("d-none")
                $("#inputLoginModalLogin").addClass("is-invalid")
            }
        }
    })
})

const _global: any = (window || global) as any
_global.emailIsTaken = () => {
    $("#alertRegisterModalWhenEmailIsTaken").removeClass("d-none")
    $("#inputRegisterModalEmail").addClass("is-invalid")
}

_global.loginIsTaken = () => {
    $("#alertRegisterModalWhenLoginIsTaken").removeClass("d-none")
    $("#inputRegisterModalLogin").addClass("is-invalid")
}

_global.displayUnknownError = () => {
    $("#alertRegisterModalUnknownError").removeClass("d-none")
}

_global.loginIncorrectData = () => {
    $("#alertLoginModalWhenDataIsInvalid").removeClass("d-none")
    $("#inputLoginModalLogin").addClass("is-invalid")
    $("#inputLoginModalPassword").addClass("is-invalid")
}

_global.loginIsTakenForGuest = () => {
    $("#alertLoginModalWhenLoginIsTakenAndPlayAsGuest").removeClass("d-none")
    $("#inputLoginModalLogin").addClass("is-invalid")
}

_global.removeModal = () => {
    $("#register-or-login-modal").modal("hide")
}
