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

describe("APIManager", () => {
    describe("#query()", () => {
        it("should return active DMArena with spawns and weapons", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<DMArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<DMArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.ARENA_DM).then((arena: DMArena[]) => {
                assert.equal(arena[0].active, 1)
                assert.notEqual(arena[0].spawns.length, 0)
                assert.notEqual(arena[0].weapons.length, 0)
            })
        })

        it("should return active HeavyDMArena with spawns and weapons", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<HeavyDMArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<HeavyDMArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.ARENA_HEAVYDM).then((arena: HeavyDMArena[]) => {
                assert.equal(arena[0].active, 1)
                assert.notEqual(arena[0].spawns.length, 0)
                assert.notEqual(arena[0].weapons.length, 0)
            })
        })

        it("should return active SniperArena with spawns and weapons", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<SniperArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<SniperArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.ARENA_SNIPER).then((arena: SniperArena[]) => {
                assert.equal(arena[0].active, 1)
                assert.notEqual(arena[0].spawns.length, 0)
                assert.notEqual(arena[0].weapons.length, 0)
            })
        })

        it("should return active OneShootArena with spawns and weapons", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<OneShootArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<OneShootArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.ARENA_ONESHOOT).then((arena: OneShootArena[]) => {
                assert.equal(arena[0].active, 1)
                assert.notEqual(arena[0].spawns.length, 0)
                assert.notEqual(arena[0].weapons.length, 0)
            })
        })
    })
})
