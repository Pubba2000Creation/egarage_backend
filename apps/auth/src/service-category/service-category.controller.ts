import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from '@app/common';


@Controller('serviceCategory')
@ApiTags('service-category opration list')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}


 /*
  **
   * Endpoint to create new service category.
   *
   * This endpoint Create new service category. It retrieves database.
   * Returns a response containing new created service category.
   *
   * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and datails of the service-center.
   */
  @Post()
  @ApiOperation({ summary: 'Create new service category' })
    @ApiBody({ type: CreateServiceCategoryDto })
    @ApiResponse({
      status: 201,
      description: 'service category created successfully.',
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
    @Body() createServiceCategoryDto: CreateServiceCategoryDto
  ): Promise<CommonResponseDto> {
    try {
      const responseData = await this.serviceCategoryService.create(createServiceCategoryDto);

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

  /*
   * Endpoint for getting all service-category data
   *
   * @returns CommonResponseDto containing the result of the operation
   */
  @Get()
   @ApiOperation({ summary: 'get All service-category in database' })
   @ApiResponse({
    status: 201,
    description: 'service-category getting successfully.',
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
  async findAll(): Promise<CommonResponseDto> {
    try {
      const responseData = await this.serviceCategoryService.findAll();
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.documents
      )
    } catch (error) {
      //handel unexpected error
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one service-category in database refer to id' })
  @ApiResponse({
    status: 201,
    description: 'service-category getting successfully.',
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
  async findOne(@Param('id') id: string): Promise<CommonResponseDto> {
    try {
      
      const responseData = await this.serviceCategoryService.findOne(id); // get response data
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document
      )
    } catch (error) {
      //error handling
         throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
         )
    }
   
  }

  @Patch(':id')
  @ApiBody({ type: UpdateServiceCategoryDto })
  @ApiOperation({ summary: 'get new-updated service-category in database' })
  @ApiResponse({
  status: 201,
  description: 'service-category getting successfully.',
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
  async update(@Param('id') id: string, @Body() updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<CommonResponseDto> {
    try {
      //getting response data
      const responseData = await this.serviceCategoryService.update(id , updateServiceCategoryDto);

      // return the updated service Category center details
      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document
      )
    } catch (error) {
      // error handeling //
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service-category in database' })
  @ApiResponse({
  status: 201,
  description: 'service-category getting successfully.',
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
  async remove(@Param('id') id: string): Promise<CommonResponseDto> {
    try {
      //getting response data
      const responseData = await this.serviceCategoryService.remove(id);

      // return the deleted service Category center details
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
      );
    }
  }
}
