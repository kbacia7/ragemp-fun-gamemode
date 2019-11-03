import { IRaceData } from "./IRaceData"

export class RaceData implements IRaceData {
    public timeInMs: number
    public checkpoints: number
    public name: string

    public constructor(timeInMs: number, checkpoints: number, name: string) {
        this.timeInMs = timeInMs
        this.checkpoints = checkpoints
        this.name = name
    }
}
