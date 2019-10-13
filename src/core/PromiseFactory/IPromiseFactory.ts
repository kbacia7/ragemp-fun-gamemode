
export interface IPromiseFactory<T> {
   create: (resolveFunction: (resolve) => void) => Promise<T>
}
