export interface IObjectFactory {
    create: (
        model: number,
        position: Vector3Mp,
        rotation: Vector3Mp,
        alpha: number,
        dimension: number,
    ) => ObjectMp
}
