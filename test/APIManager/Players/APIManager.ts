import { describe, it } from "mocha"
import { assert, } from "chai"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { APIManager } from "server/core/API/APIManager"
import { IAPISetting } from "server/core/API/IAPISetting"
import { APIRequests } from "server/core/API/APIRequests"
import { PlayerSpawn } from "src/server/entity/PlayerSpawn"
import { Player } from "src/server/entity/Player"
import { IncomingMessage } from "http"
import { PlayerSaveResponses } from "server/core/API/PlayerSaveResponses"
import * as luxon from "luxon"
import random from "random" 
import { PlayerPlayAsGuestResponses } from "server/core/API/PlayerPlayAsGuestResponses"
describe("APIManager", () => {
    describe("#query()", () => {
        it("should return all spawns", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<PlayerSpawn[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<PlayerSpawn>(promiseFactory, promiseFactoryForPosts, apiSetting)
            return apiManager.query(APIRequests.PLAYER_SPAWN).then((spawns: PlayerSpawn[]) => {
                assert.exists(spawns[0].x)
                assert.exists(spawns[0].y)
                assert.exists(spawns[0].z)
                assert.notEqual(spawns.length, 0)
            })
        })
    })

    describe("#send()", () => {
        it("should create new player and return code 200", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: "ooo",
                password: "bbb",
                email: "ooo"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 200)
            })
        })

        it("shouldn't create new player (missing password) and return code 422", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: "ooo",
                email: "ooo"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 422)
            })
        })

        it("shouldn't create new player (missing login) and return code 422", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                email: "ooo",
                password: "ooo"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 422)
            })
        })


        it("shouldn't create new player (missing email) and return code 422", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: "aaa",
                password: "ooo"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 422)
            })
        })

        it("shouldn't create new player (login taken) and return code 200", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: "aaa",
                password: "ooo",
                email: "email"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                    assert.equal(res.statusCode, 200)
                    let response = ""
                    res.on('data', (chunk) => {
                        response += chunk
                    })
                    res.on("end", () => {
                        assert.equal(parseInt(response), PlayerSaveResponses.LOGIN_TAKEN)
                    })
                })
            })
        })

        it("shouldn't create new player (email taken) and return code 200", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login:  (random.int(0, 100000) + luxon.DateTime.local().toMillis()).toString(),
                password: "ooo",
                email: "email"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                data.login = data.login + "___"
                apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                    assert.equal(res.statusCode, 200)
                    let response = ""
                    res.on('data', (chunk) => {
                        response += chunk
                    })
                    res.on("end", () => {
                        assert.equal(parseInt(response), PlayerSaveResponses.EMAIL_TAKEN)
                    })
                })
            })
        })

        it("should create new player, login him, return data (with 0 deaths and rank) and code 200", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: (random.int(0, 100000) + luxon.DateTime.local().toMillis()).toString(),
                password: "bbb",
                email: (random.int(0, 100000) + luxon.DateTime.local().toMillis()).toString()
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 200)
                let response = ""
                res.on('data', (chunk) => {
                    response += chunk
                })
                return res.on("end", () => {
                    assert.equal(parseInt(response), PlayerSaveResponses.ALL_OK)
                    const dataForLogin = {
                        login: "ooo",
                    }
                    return apiManager.send(APIRequests.PLAYER_LOGIN, dataForLogin).then((res: IncomingMessage) => {
                        let responseInJson = ""
                        res.on("data", (chunk) => {
                            responseInJson += chunk
                        })
                        res.on("end", () => {
                            const p: Player = JSON.parse(responseInJson)
                            console.log(p)
                            assert.equal(p.deaths, 0)
                            assert.notEqual(p.rank.name, "")
                        })
                        assert.equal(res.statusCode, 200)
                    })
                })
            })
        })

        it("should create new player, login him and return code 422 (due to empty login)", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                login: "ooo",
                password: "bbb",
                email: "ooo"
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 200)
                const dataForLogin = {
                }
                apiManager.send(APIRequests.PLAYER_LOGIN, dataForLogin).then((res: IncomingMessage) => {
                    assert.equal(res.statusCode, 422)
                })
            })
        })

        it("should save player data by player login, return code 200", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const fakeLogin = (random.int(0, 100000) + luxon.DateTime.local().toMillis()).toString() + '082'
            const dataForNewAcc = {
                login: fakeLogin,
                password: "bbb",
                email:(random.int(0, 100000) + luxon.DateTime.local().toMillis()).toString() + 'emai1l'
            }
            return apiManager.send(APIRequests.PLAYER_REGISTER, dataForNewAcc).then((res: IncomingMessage) => {
            const data = {
                login: fakeLogin,
                deaths: 1000
            }
            return apiManager.send(APIRequests.PLAYER_SAVE, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 200)
            })
            })


   
        })

        it("shouldn't save player data due to missing id and login, return code 422", () => {
            const apiSetting: IAPISetting = {
                host: 'localhost',
                port: 8000
            }
            const promiseFactory = new PromiseFactory<Player[]>()
            const promiseFactoryForPosts = new PromiseFactory<IncomingMessage>()
            const apiManager = new APIManager<Player>(promiseFactory, promiseFactoryForPosts, apiSetting)
            const data = {
                deaths: 111,
            }
            return apiManager.send(APIRequests.PLAYER_SAVE, data).then((res: IncomingMessage) => {
                assert.equal(res.statusCode, 422)
            })
        })
        
    })
        
})
