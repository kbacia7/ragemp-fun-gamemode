export interface IBlipFactory {
    create: (
        sprite: number,
        position: Vector3Mp,
        name: string,
        scale: number,
        color: number,
        alpha: number,
        drawDistance: number,
        shortRange: boolean,
        rotation: number,
        dimension: number,
    ) => BlipMp
}
