import { describe, it } from "mocha"
import { assert, } from "chai"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { APIManager } from "server/core/API/APIManager"
import { IAPISetting } from "server/core/API/IAPISetting"
import { Item } from "src/server/entity/Item"
import { APIRequests } from "server/core/API/APIRequests"
import { IncomingMessage } from "http"
import { Lootbox } from "src/server/entity/Lootbox"
import { Level } from "src/server/entity/Level"

describe("APIManager", () => {
    describe("#query()", () => {
        it("should return all levels", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Level[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Level>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(`${APIRequests.LEVELS}`).then((levels: Level[]) => {
                assert.notEqual(levels.length, 0)
            })
        })
    })
})
