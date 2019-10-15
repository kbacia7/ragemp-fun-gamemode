export interface ICommand {
    alias: string[],
    execute: (player: PlayerMp, args: string[]) => void
}
