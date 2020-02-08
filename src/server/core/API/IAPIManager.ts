export interface IAPIManager<T> {
    query: (path: string) => Promise<T[]>
}
