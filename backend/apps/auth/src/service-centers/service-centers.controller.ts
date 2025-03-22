import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ServiceCentersService } from './service-centers.service';
import { CreateServiceCenterDto } from './dto/create-service-center.dto';
import { UpdateServiceCenterDto } from './dto/update-service-center.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from '@app/common';

@Controller('service-centers')
@ApiTags('service-center oprations list')
export class ServiceCentersController {
  constructor(private readonly serviceCentersService: ServiceCentersService) {}
    /**
 * Operation to search service centers based on a keyword.
 * Function returns a list of matched service centers with a common response DTO.
 * @param searchKeyword
 * @returns
 */
  @Get('search')
  @ApiOperation({ description: 'Search service centers by keyword', summary: 'Search service centers' })
  @ApiQuery({
    name: 'keyword',
    description: 'The search keyword to filter service centers',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No matching service centers found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
  async search(@Query('keyword') keyword: string): Promise<CommonResponseDto> {
    try {
      const responseData = await this.serviceCentersService.search(keyword);
      
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.documents,
      );
    } catch (error) {
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
/*
  **
   * Endpoint to create new service-center.
   *
   * This endpoint Create new service-center. It retrieves database.
   * Returns a response containing new created service-center.
   *
   * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and datails of the service-center.
   */
  @Post()
  @ApiOperation({ summary: 'Create new service center' })
  @ApiBody({ type: CreateServiceCenterDto })
  @ApiResponse({
    status: 201,
    description: 'Service center created successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
  async create(
    @Body() createServiceCenterDto: CreateServiceCenterDto,
  ): Promise<CommonResponseDto> {
    try {
      const response = await this.serviceCentersService.create(createServiceCenterDto);

      return new CommonResponseDto(
        true,
        'Service center created successfully.',
        response.document,
      );
    } catch (error) {
      // Handle unexpected errors
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 /*
   * Endpoint for getting all service-center data
   *
   * @returns CommonResponseDto containing the result of the operation
   */
  @Get()
   @ApiOperation({ summary: 'get All service centers in database' })
   @ApiResponse({
    status: 201,
    description: 'Service centers getting successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
 async findAll(): Promise<CommonResponseDto>{
   try {
    const response = await this.serviceCentersService.findAll();
    return new CommonResponseDto(
      true,
      'Service centers getting successfully.',
      response.documents,
    );
   } catch (error) {
    //error handling
    throw new HttpException(
      new CommonResponseDto(false, error.message, null),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
   }
  }

  /**
 * Endpoint to retrieve a specific user by ID.
 *
 * This endpoint fetches the details of a user based on the provided ID.
 * Returns a response containing the user details if found, or an error message otherwise.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and user details.
 */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve service center details by service-center ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the service center to retrieve',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'service-center details retrieved successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'service-center not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
   async findOne(@Param('id') id: string):Promise<CommonResponseDto> {
    try {
      const responseData = await this.serviceCentersService.findOne(id);
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document,
      );

    } catch (error) {
      //error handling
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint to update a specific service-centers by ID.
    *
    * This endpoint update the details of a service center based on the provided ID and provided data.
    * Returns a response containing the user details if found, or an error message otherwise.
   * @param id 
   * @param updateServiceCenterDto 
   * @returns 
   */

  @Patch(':id')
  @ApiOperation({description:'update service center by id', summary:'update service center by id'})
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the service center to update',
    required: true,
    type: String,
  })
  @ApiBody({
    type: UpdateServiceCenterDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Service center updated successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'service-center not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
   async update(@Param('id') id: string, @Body() updateServiceCenterDto: UpdateServiceCenterDto):Promise<CommonResponseDto> {
    try {

      //get the results form the system
      const responseData = await this.serviceCentersService.update(id, updateServiceCenterDto);

      //retuen new response form the system
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document,
      );
      
    } catch (error) {
      //handel error
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
/**
 * opartion for delete service center base on the service center id
 * funtion retuen the deleted service center deatils with commn response dto
 * @param id 
 * @returns 
 */
    @Delete(':id')
    @ApiOperation({description:'delete service center by id', summary:'delete service center by id'})
    @ApiParam({
      name: 'id',
      description: 'The unique identifier of the service center to delete',
      required: true,
      type: String,
    })
    @ApiResponse({
      status: 200,
      description: 'Service center deleted successfully.',
      type: CommonResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'service-center not found.',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error - Server failure.',
    })
   async remove(@Param('id') id: string):Promise<CommonResponseDto>{
    try {
      const responseData = await this.serviceCentersService.remove(id);
      //return the deleted service center details
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document
      )
    } catch (error) {
      //handel unexpected error
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }


}
