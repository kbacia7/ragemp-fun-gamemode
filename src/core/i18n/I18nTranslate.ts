import { FileSystemRequest } from "core/FileRequest/FileSystemRequest"
import { I18nCantLoadTranslationsException } from "exceptions/i18n/I18nCantLoadTranslationsException"
import { I18nFileNotFoundException } from "exceptions/i18n/I18nFileNotFoundException"
import { I18nLabelNotFoundException } from "exceptions/i18n/I18nLabelNotFoundException"
import { I18nSettingsNotLoadedException } from "exceptions/i18n/I18nSettingsNotLoadedException"
import { I18nTranslationsNotLoadedException } from "exceptions/i18n/I18nTranslationsNotLoadedException"
import path from "path"
import { IFileRequest } from "../FileRequest/IFileRequest"
import { IInternationalizationLanguageGroup } from "./IInternationalizationLanguageGroup"
import { IInternationalizationSettings } from "./IInternationalizationSettings"

export class I18nTranslate {
   private i18nObject: IInternationalizationLanguageGroup = {}
   private i18nSettings: IInternationalizationSettings
   private fileRequest: IFileRequest

   constructor(i18nSettings: IInternationalizationSettings, fileRequest: IFileRequest) {
      this.i18nSettings = i18nSettings
      this.fileRequest = fileRequest
   }

   public translate(label: string) {
      const toLanguage: string = this.i18nSettings.toLanguage
      if (!this.i18nObject || Object.keys(this.i18nObject).length === 0) {
         throw new I18nTranslationsNotLoadedException()
      }
      if (!this.i18nObject[toLanguage][label]) {
         return label
      }
      return this.i18nObject[toLanguage][label]

   }

   public loadTranslations(directoryPath: string) {
      const fr: IFileRequest = this.fileRequest
      const language: string = this.i18nSettings.toLanguage
      let obj = null
      try {
         obj = JSON.parse(fr.loadFileSync(path.join(directoryPath, "/", language + ".json")))
      } catch (e) {
         throw new I18nFileNotFoundException()
      }
      this.i18nObject[language] = obj

   }
}
