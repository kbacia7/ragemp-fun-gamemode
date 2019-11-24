import { Model } from "objection"
import { OneShootArenaSpawnPoint } from "./OneShootArenaSpawnPoint"
import { OneShootArenaWeapon } from "./OneShootArenaWeapon"
import { SniperArenaSpawnPoint } from "./SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "./SniperArenaWeapon"

export class OneShootArena extends Model {
  public static tableName = "one_shoot_arenas"
  public readonly id!: number
  public name: string
  public author: string
  public active: boolean

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "one_shoot_arenas.id",
          to: "one_shoot_arenas_spawns.arenaId",
        },
        modelClass: OneShootArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
      weapons: {
        join: {
          from: "one_shoot_arenas.id",
          to: "one_shoot_arenas_weapons.arenaId",
        },
        modelClass: OneShootArenaWeapon,
        relation: Model.HasManyRelation,
      },
    }

}
}
