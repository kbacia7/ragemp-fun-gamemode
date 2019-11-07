import { RaceData } from "./RaceData"

export class RaceDataFactory {
    public create(timeInMs: number, checkpoints: number, name: string) {
        return new RaceData(timeInMs, checkpoints, name)
    }
}
