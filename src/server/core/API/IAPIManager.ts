import { IncomingMessage } from "http";

export interface IAPIManager<T> {
    query: (path: string) => Promise<T[]>,
    send: (path: string, data: any) => Promise<IncomingMessage>
}
