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
import { RaceArena } from "src/server/entity/RaceArena"
import { TeamDeathmatchArena } from "src/server/entity/TeamDeathmatchArena"
import { DerbyArena } from "src/server/entity/DerbyArena"
import { HideAndSeekArena } from "src/server/entity/HideAndSeekArena"
import { IncomingMessage } from "http"

describe("APIManager", () => {
    describe("#query()", () => {
        it("should return random RaceArena with spawns and checkpoints", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<RaceArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<RaceArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.EVENT_RACE).then((arena: RaceArena[]) => {
                assert.exists(arena[0].id)
                assert.notEqual(arena[0].spawns.length, 0)
                assert.notEqual(arena[0].checkpoints.length, 0)
            })
        })
        it("should return random TDMArena with spawns and weapons", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<TeamDeathmatchArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<TeamDeathmatchArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.EVENT_TDM).then((arena: TeamDeathmatchArena[]) => {
                assert.exists(arena[0].id)
                assert.notEqual(Object.keys(arena[0].spawns).length, 0)
                assert.notEqual(arena[0].weapons.length, 0)
            })
        })
        it("should return random DerbyArena with spawns", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<DerbyArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<DerbyArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.EVENT_DERBY).then((arena: DerbyArena[]) => {
                assert.exists(arena[0].id)
                assert.notEqual(arena[0].spawns.length, 0)
            })
        })
        it("should return random HideAndSeek with spawns", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<HideAndSeekArena[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<HideAndSeekArena>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.EVENT_HIDEANDSEEK).then((arena: HideAndSeekArena[]) => {
                assert.exists(arena[0].id)
                assert.notEqual(arena[0].spawns.length, 0)
            })
        })
    })
})
