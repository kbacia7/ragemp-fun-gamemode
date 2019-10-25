export interface ICheckpointFactory {
    create: (
        type: number,
        position: Vector3Mp,
        radius: number,
        direction: Vector3Mp,
        color: [number, number, number, number],
        visible: boolean,
        dimension: number,
    ) => CheckpointMp
}
