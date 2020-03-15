import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import http, { IncomingMessage } from "http"
import { IAPIManager } from "./IAPIManager"
import { IAPISetting } from "./IAPISetting"
import querystring from "querystring"

export class APIManager<T> implements IAPIManager<T> {
    private _apiSetting: IAPISetting = null
    private _promiseFactory: IPromiseFactory<T[]> = null
    private _promiseFactoryForPosts: IPromiseFactory<IncomingMessage> = null
    constructor(
        promiseFactory: IPromiseFactory<T[]>, 
        promiseFactoryForPosts: IPromiseFactory<IncomingMessage>,
        apiSetting: IAPISetting
    ) {
        this._promiseFactory = promiseFactory
        this._promiseFactoryForPosts = promiseFactoryForPosts
        this._apiSetting = apiSetting
    }
    public query(path: string) {
        return this._promiseFactory.create((resolve) => {
            const options = {
                hostname: this._apiSetting.host,
                port: this._apiSetting.port,
                path: path,
                method: 'GET'
            }
            const r = http.request(options, (res) => {
                res.on('data', (d: Buffer) => {
                    const objByType: T = JSON.parse(d.toString())
                    resolve(objByType)
                })
            })
            r.on('error', (d) => {
                console.log(d)
            })
            r.end()
        })
    }
    public send(path: string, data: any) {
        return this._promiseFactoryForPosts.create((resolve) => {
            const dataString = querystring.stringify(data)
            const options = {
                hostname: this._apiSetting.host,
                port: this._apiSetting.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(dataString)
                }
            }
            const r = http.request(options, (res: IncomingMessage) => {
                resolve(res)
            })
            r.on('error', (d) => {
                console.log(d)
            })
            r.write(dataString)    
            r.end()
        })
    }
}
