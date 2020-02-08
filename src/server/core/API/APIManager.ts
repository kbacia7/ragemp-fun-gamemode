import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import $ from "jquery"
import { IAPIManager } from "./IAPIManager"
import { IAPISetting } from "./IAPISetting"
export class APIManager<T> implements IAPIManager<T> {
    private _apiSetting: IAPISetting = null
    private _promiseFactory: IPromiseFactory<T> = null
    constructor(promiseFactory: IPromiseFactory<T>, apiSetting: IAPISetting) {
        this._promiseFactory = promiseFactory
        this._apiSetting = apiSetting
    }
    public query(path: string) {
        return this._promiseFactory.create((resolve) => {
            $.ajax({
                url: `${this._apiSetting.host}/${path}`,
            }).done((results) => {
                resolve(results)
            })
        })

    }
}
