import { Model, SaveOptions } from 'mongoose';
import { ApiNotFoundError } from '@api-modules/errors';

class BasicRepository<VModel> {
    entityName: string;

    constructor(private readonly model: Model<VModel>) {}

    findById(id: string): Promise<VModel | null> {
        return this.model.findById({ _id: id }).lean();
    }

    async findByIdOrFail(id: string): Promise<VModel> {
        const entity = await this.model.findById({ _id: id }).lean();

        if (!entity) {
            throw new ApiNotFoundError({ resourceId: id, resourceName: this.entityName });
        }

        return entity as VModel;
    }

    async create<T>(data: T, options?: SaveOptions): Promise<VModel> {
        const createdDocument = new this.model(data);
        return (await createdDocument.save(options)).toJSON() as unknown as VModel;
    }

    updateOneField<T extends keyof Omit<VModel, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: VModel[T],
    ): Promise<VModel> {
        return this.model
            .findOneAndUpdate({ _id: id }, { [fieldName]: fieldValue }, { new: true })
            .lean();
    }

    async updateOneFieldOrFail<T extends keyof Omit<VModel, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: VModel[T],
    ): Promise<VModel> {
        const update = { [fieldName]: fieldValue };
        const updatedEntity = await this.model
            .findOneAndUpdate({ _id: id }, update, { new: true })
            .lean();

        if (!updatedEntity) {
            throw new ApiNotFoundError({ resourceId: id, resourceName: this.entityName });
        }

        return updatedEntity as VModel;
    }

    updateOne<T>(id: string, data: T): Promise<VModel> {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
    }
}

export { BasicRepository };
