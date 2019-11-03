import {CoreException} from "exceptions/CoreException"

export class AutomaticEventPreparePlayerNotImplemented extends CoreException {
   constructor() {
      super()
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AutomaticEventPreparePlayerNotImplemented)
      }
    }
}
