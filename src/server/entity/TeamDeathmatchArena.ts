import { Model } from "objection"
import { TeamDeathmatchArenaSpawnPoint } from "./TeamDeathmatchArenaSpawnPoint"
import { TeamDeathmatchArenaWeapon } from "./TeamDeathmatchArenaWeapon"

export class TeamDeathmatchArena extends Model {
  public static tableName = "tdm_arenas"
  public readonly id!: number
  public name: string
  public author: string

  public static get relationMappings()  {
    return {
      spawns: {
        join: {
          from: "tdm_arenas.id",
          to: "tdm_arenas_spawns.arenaId",
        },
        modelClass: TeamDeathmatchArenaSpawnPoint,
        relation: Model.HasManyRelation,
      },
      weapons: {
        join: {
          from: "tdm_arenas.id",
          to: "tdm_arenas_weapons.arenaId",
        },
        modelClass: TeamDeathmatchArenaWeapon,
        relation: Model.HasManyRelation,
      },
    }

}
}
