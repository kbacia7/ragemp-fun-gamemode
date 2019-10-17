export interface IPlayerData {
    id: number,
    rank: string,
    kills: number,
    deaths: number,
    status: string,
    ping: number,
    name: string,
    isLogged: boolean,
    playAsGuest: boolean,
    nameColor: string
    initialize: (player: PlayerMp) => void
    load: (player: PlayerMp) => IPlayerData
    sync: (player: PlayerMp) => void
}
