import {CoreException} from "exceptions/CoreException"

export class I18nFileNotFoundException extends CoreException {
   constructor() {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super()

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, I18nFileNotFoundException)
      }
    }
}
