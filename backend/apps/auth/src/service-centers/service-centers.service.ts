import { Injectable } from '@nestjs/common';
import { CreateServiceCenterDto } from './dto/create-service-center.dto';
import { UpdateServiceCenterDto } from './dto/update-service-center.dto';
import { serviceCenterRepository } from './service-centers.repository';

@Injectable()
export class ServiceCentersService {

  constructor (private readonly serviceCentersRepository: serviceCenterRepository) {}

  /**
   * Search for service centers based on a keyword. 
   * The method allows searching by specific fields defined for the service center.
   * 
   * @param {string} searchKeyword - The keyword to search for.
   * @returns {Promise<{ documents: any[]; message: string }>} - Returns search results and a message.
   */
    search (searchKeyword: string) {

      //declare the search filds in database
      const searchableFields = ['serviceTitle', 'description', 'servicesOffered'];

      // Now call the abstract repo search method, passing the desired fields
      return this.serviceCentersRepository.search(searchKeyword, searchableFields);
    }

  /**
   * Create a new service center.
   * 
   * @param {CreateServiceCenterDto} createServiceCenterDto - The DTO containing the new service center details.
   * @returns {Promise<any>} - Returns the created service center document.
   */
    create(createServiceCenterDto: CreateServiceCenterDto) {
    return this.serviceCentersRepository.create(createServiceCenterDto);
    }

  /**
   * Retrieve all service centers from the database.
   * 
   * @returns {Promise<any[]>} - Returns an array of service center documents.
   */
    findAll() {
      return this.serviceCentersRepository.find({});
    }

  
  /**
   * Retrieve a single service center by its ID.
   * 
   * @param {string} _id - The ID of the service center to retrieve.
   * @returns {Promise<any>} - Returns the service center document.
   */
    findOne(_id: String) {
      return this.serviceCentersRepository.findOne({_id});
    }

  /**
   * Update an existing service center with new details.
   * 
   * @param {string} _id - The ID of the service center to update.
   * @param {UpdateServiceCenterDto} updateServiceCenterDto - The DTO containing the updated service center details.
   * @returns {Promise<any>} - Returns the updated service center document.
   */
    update(_id: string, updateServiceCenterDto: UpdateServiceCenterDto) {
    
      //add funtions for the service-center update
      return this.serviceCentersRepository.findOneAndUpdate(
        { _id: _id },
        {$set: updateServiceCenterDto},
      );
    }


  /**
   * Remove a service center from the database by its ID.
   * 
   * @param {string} id - The ID of the service center to remove.
   * @returns {Promise<any>} - Returns the deleted service center document.
   */
    remove(id: string) {
      return this.serviceCentersRepository.findOneAndDelete({ _id: id });
    }
}
