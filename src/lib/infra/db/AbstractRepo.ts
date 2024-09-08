import { EntityTarget, FindOptionsRelations, FindOptionsWhere } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { BaseEntity } from "./BaseEntity"
import { readConnection, writeConnection } from "./DatabaseModule"
import { GenericAppError } from "../../core/logic/AppError"

export abstract class AbstractRepo<T extends BaseEntity> {
  constructor(private readonly entityTarget: EntityTarget<T>) {}

  async create(entity: T): Promise<T> {
    return writeConnection.manager.getRepository(this.entityTarget).save(entity)
  }

  async findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T> {
    const entity = await readConnection.getRepository(this.entityTarget).findOne({ where, relations })

    return entity
  }

  async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>) {
    const updateResult = await writeConnection.manager.getRepository(this.entityTarget).update(where, partialEntity)

    if (!updateResult.affected) {
      console.warn("Entity not found with where", where)
      throw new GenericAppError.NotFoundError("Entity not found.")
    }

    return this.findOne(where)
  }

  async find(where: FindOptionsWhere<T>) {
    return readConnection.getRepository(this.entityTarget).findBy(where)
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await writeConnection.manager.getRepository(this.entityTarget).delete(where)
  }
}
