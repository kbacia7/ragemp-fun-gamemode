import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import http from "http"
import { IAPIManager } from "./IAPIManager"
import { IAPISetting } from "./IAPISetting"
export class APIManager<T> implements IAPIManager<T> {
    private _apiSetting: IAPISetting = null
    private _promiseFactory: IPromiseFactory<T[]> = null
    constructor(promiseFactory: IPromiseFactory<T[]>, apiSetting: IAPISetting) {
        this._promiseFactory = promiseFactory
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
}
