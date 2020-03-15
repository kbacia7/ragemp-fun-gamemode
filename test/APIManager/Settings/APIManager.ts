import { describe, it } from "mocha"
import { assert, } from "chai"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { APIManager } from "server/core/API/APIManager"
import { IAPISetting } from "server/core/API/IAPISetting"
import { DMArena } from "src/server/entity/DMArena"
import { APIRequests } from "server/core/API/APIRequests"
import { HeavyDMArena } from "src/server/entity/HeavyDMArena"
import { SniperArena } from "src/server/entity/SniperArena"
import { OneShootArena } from "src/server/entity/OneShootArena"
import { IncomingMessage } from "http"
import { Setting } from "src/server/entity/Setting"

describe("APIManager", () => {
    describe("#query()", () => {
        it("should return settings with given test name", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Setting[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Setting>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.SETTINGS_FOR_TESTS).then((settings: Setting[]) => {
                assert.equal(settings.length, 1)
            })
        })
    })
})
