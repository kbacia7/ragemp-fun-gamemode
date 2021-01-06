import { describe, it } from "mocha"
import { assert, } from "chai"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { APIManager } from "server/core/API/APIManager"
import { IAPISetting } from "server/core/API/IAPISetting"
import { Item } from "src/server/entity/Item"
import { APIRequests } from "server/core/API/APIRequests"
import { IncomingMessage } from "http"
import { Lootbox } from "src/server/entity/Lootbox"

describe("APIManager", () => {
    describe("#query()", () => {
        it("should return item from lootbox", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Item[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Item>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(`${APIRequests.LOOTBOX_OPEN}/1/1/`).then((item: Item[]) => {
                assert.notEqual(item.length, 0)
            })
        })

        it("should return lootbox object", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Lootbox[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Lootbox>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(`${APIRequests.LOOTBOX_LIST_ITEMS}/1/   1/`).then((item: Lootbox[]) => {
                assert.notEqual(item.length, 0)
            })
        })
    })
})
