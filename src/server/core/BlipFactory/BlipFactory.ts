import { IBlipFactory } from "./IBlipFactory"

export class BlipFactory implements IBlipFactory {
    public create(
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
    ) {
        const blip = mp.blips.new(
            sprite, position, {
                alpha, color, dimension, drawDistance, name,
                rotation, scale, shortRange,
            },
        )
        if (color) {
            console.log(color)
            blip.color = color
        }
        return blip
    }
}
