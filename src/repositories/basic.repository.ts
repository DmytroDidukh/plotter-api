import { Model } from 'mongoose';
import { ApiNotFoundError } from '@api-modules/errors';

class BasicRepository<V> {
    entityName: string;

    constructor(private readonly model: Model<V>) {}

    findById(id: string): Promise<V | null> {
        return this.model.findById({ _id: id }).lean();
    }

    async findByIdOrFail(id: string): Promise<V> {
        const entity = await this.model.findById({ _id: id }).lean();

        if (!entity) {
            throw new ApiNotFoundError({ resourceId: id, resourceName: this.entityName });
        }

        return entity as V;
    }

    async create(data: Omit<V, '_id' | 'createdAt' | 'updatedAt'>): Promise<V> {
        return await this.model.create(data);
    }

    updateOneField<T extends keyof Omit<V, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: V[T],
    ): Promise<V> {
        return this.model
            .findOneAndUpdate({ _id: id }, { [fieldName]: fieldValue }, { new: true })
            .lean();
    }

    async updateOneFieldOrFail<T extends keyof Omit<V, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: V[T],
    ): Promise<V> {
        const update = { [fieldName]: fieldValue };
        const updatedEntity = await this.model
            .findOneAndUpdate({ _id: id }, update, { new: true })
            .lean();

        if (!updatedEntity) {
            throw new ApiNotFoundError({ resourceId: id, resourceName: this.entityName });
        }

        return updatedEntity as V;
    }

    updateOne<T>(id: string, data: T): Promise<V> {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
    }
}

export { BasicRepository };
