import { IInternationalizationSettings } from "./IInternationalizationSettings"

export class InternationalizationSettings implements IInternationalizationSettings {
   public toLanguage: string
   constructor(toLanguage: string) {
      this.toLanguage = toLanguage
   }
}
