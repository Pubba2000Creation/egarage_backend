import { Injectable } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategoryRepository } from './service-category.repository';

@Injectable()
export class ServiceCategoryService {
  // Injecting the repository to handle database operations
  constructor(
    private readonly serviceCategoryRepository: ServiceCategoryRepository, // Follow camelCase naming conventions
  ) {}

  /**
   * Creates a new service category.
   * This method accepts a DTO containing the data required to create a service category.
   * It then uses the repository to interact with the database and persist the data.
   *
   * @param {CreateServiceCategoryDto} createServiceCategoryDto - Data transfer object containing details for the new service category.
   * @returns {Promise<any>} The created service category document from the database.
   */
    async create(createServiceCategoryDto: CreateServiceCategoryDto) {
     return this.serviceCategoryRepository.create(createServiceCategoryDto);
    }

  /**
   * Fetches all service categories.
   * This method will be fully implemented to retrieve and return all records from the database.
   *
   * @returns {Promise<string>} A placeholder message for now.
    */
    findAll() {
      return this.serviceCategoryRepository.find({});
    }

  /**
   * Fetches a specific service category by ID.
   * This method will retrieve a service category document based on its unique identifier.
   *
   * @param {number} id - The ID of the service category to retrieve.
   * @returns {Promise<string>} A placeholder message for now.
   */
  findOne(_id: string) {
    return  this.serviceCategoryRepository.findOne({_id});
  }

  /**
   * Updates an existing service category.
   * This method accepts an ID and a DTO containing the updated details.
   *
   * @param {number} id - The ID of the service category to update.
   * @param {UpdateServiceCategoryDto} updateServiceCategoryDto - DTO containing the updated details.
   * @returns {Promise<string>} A placeholder message for now.
   */
  update(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return this.serviceCategoryRepository.findOneAndUpdate(
      {_id:id}, 
      {$set: updateServiceCategoryDto}
    );
  }

  /**
   * Deletes a service category by ID.
   * This method will remove a service category document based on its unique identifier.
   *
   * @param {number} id - The ID of the service category to delete.
   * @returns {Promise<string>} A placeholder message for now.
   */
  remove(id: string) {
    return this.serviceCategoryRepository.findOneAndDelete({_id:id});
  }
}
