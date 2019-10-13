import { IPromiseFactory } from "./IPromiseFactory"

export class PromiseFactory<T> implements IPromiseFactory<T> {
   public create(resolveFunction: (
      (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void),
   ) {
      return new Promise<T>(resolveFunction)
   }
}
