import { ICheckpointFactory } from "./ICheckpointFactory"

export class CheckpointFactory implements ICheckpointFactory {
    public create(
        type: number,
        position: Vector3Mp,
        radius: number,
        direction: Vector3Mp,
        color: [number, number, number, number],
        visible: boolean,
        dimension: number,
    ) {
        return mp.checkpoints.new(type, position, radius, {
            color, dimension, direction, visible,
        })
    }
}
