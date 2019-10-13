import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"

export class Module {
    protected _name: string = ""
    protected _currentWindow: BrowserMp = null
    protected _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            if (!this._currentWindow) {
                this._currentWindow = mp.browsers.new(`package://ui/${this._name}/index.html`)
                resolve(true)
            }
            resolve(false)
        })
        }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            if (this._currentWindow !== null) {
                this._currentWindow.destroy()
                this._currentWindow = null
                resolve(true)
            }
            resolve(false)
        })

    }
}
