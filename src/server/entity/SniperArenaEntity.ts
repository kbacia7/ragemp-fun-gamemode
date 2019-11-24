import { Model } from "objection"
import { SniperArenaSpawnPoint } from "./SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "./SniperArenaWeapon"

export class SniperArenaEntity extends Model {
  public static tableName = "sniper_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public active: boolean

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "sniper_arenas.id",
          to: "sniper_arenas_spawns.arenaId",
        },
        modelClass: SniperArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
      weapons: {
        join: {
          from: "sniper_arenas.id",
          to: "sniper_arenas_weapons.arenaId",
        },
        modelClass: SniperArenaWeapon,
        relation: Model.HasManyRelation,
      },
    }

}
}
