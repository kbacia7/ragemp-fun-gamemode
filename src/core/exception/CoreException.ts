export class CoreException extends Error {
   constructor() {
      super()
      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, CoreException)
       }
   }
}
