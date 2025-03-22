import { Logger, NotFoundException } from '@nestjs/common';
import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {
    this.logger = new Logger(model.modelName);
  }

  async create(
    document: Omit<TDocument, '_id'>,
  ): Promise<{ document: TDocument; message: string }> {
    try {
      const createdDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });

      const savedDocument = await createdDocument.save();
      return { document: savedDocument.toJSON() as TDocument, message: 'Creation is successful' };
    } catch (error) {
      this.logger.error('Error occurred during creation:', error);
      throw new NotFoundException('Error occurred during creation');
    }
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ document: TDocument; message: string }> {
    let successMessage = '';
    const document = (await this.model
      .findOne(filterQuery)
      .lean(true)) as TDocument;
    if (!document) {
      this.logger.warn(
        `Document not found with filter query: ${JSON.stringify(filterQuery)}`,
      );
      // throw new NotFoundException('The document was not found in database');
      successMessage = 'Not found in the system';
    } else {
      successMessage = 'Successfully found in the system';
    }
    return { document, message: successMessage };
  }

  async findByUser(
    userId: string,
  ): Promise<{ document: TDocument; message: string }> {
    const document = (await this.model.find().lean(true)) as TDocument;
    let successMessage = '';
    if (!document) {
      this.logger.warn(
        `Document not found with filter query: ${JSON.stringify(userId)}`,
      );
      // throw new NotFoundException('The documents not found in database');
      successMessage = 'Not found in the system';
    } else {
      successMessage = 'Successfully found in the system';
    }
    return { document, message: successMessage };
  }


async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<{ document: TDocument; message: string }> {
    const document = (await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean(true)) as TDocument;
    let successMessage = '';
    if (!document) {
      this.logger.warn(
        `Document not found with filter query: ${JSON.stringify(filterQuery)}`,
      );
      // throw new NotFoundException('The document was not found');
      successMessage = 'Not found in the system';
    } else {
      successMessage = 'Update is successfully completed';
    }
    return { document, message: successMessage };
  }
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ document: TDocument; message: string }> {
    const document = (await this.model
      .findOneAndDelete(filterQuery)
      .lean(true)) as TDocument;
    if (!document) {
      this.logger.warn(
        `Document not found with filter query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('The document was not in the Databse');
    }
    const successMessage = 'Delete is successfully completed';
    return { document, message: successMessage };
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<{ documents: TDocument[]; message: string }> {
    const documents = (await this.model
      .find(filterQuery)
      .lean(true)) as TDocument[];
    let successMessage = '';
    if (documents.length === 0) {
      this.logger.warn(
        `Documents not found with filter query: ${JSON.stringify(filterQuery)}`,
      );
      // throw new NotFoundException('No documents found in the Database');
      successMessage = 'Not found in the system';
    } else {
      successMessage = 'Successfully found in the system';
    }
    return { documents, message: successMessage };
  }



  //abstact funtion for serching the document
// In Abstract Repository (this can be the base class for your repository)
async search(
  searchKeyword: string,
  searchableFields: string[], // Array of fields to search across
  additionalFilters: FilterQuery<TDocument> = {},
  limit: number = 10,
  skip: number = 0
): Promise<{ documents: TDocument[]; message: string }> {
  if (!searchKeyword || typeof searchKeyword !== "string") {
    return { documents: [], message: "Invalid search keyword" };
  }

  // Dynamically build the $or condition based on the searchable fields provided
  const searchCriteria: FilterQuery<TDocument> = {
    ...additionalFilters,
    $or: searchableFields.map(field => ({
      [field]: { $regex: searchKeyword, $options: "i" }, // Case-insensitive regex search
    })) as Record<string, any>[], // Type assertion to ensure this fits the FilterQuery structure
  };

  try {
    const documents = await this.model
      .find(searchCriteria)
      .skip(skip)
      .limit(limit)
      .lean() as TDocument[];

    return {
      documents,
      message: documents.length > 0 ? "Successfully found in the system" : "Not found in the system",
    };
  } catch (error) {
    console.error("Error executing search:", error);
    return { documents: [], message: "An error occurred during search" };
  }
}






}
