import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { VehicletypeService } from './vehicletype.service';
import { CreateVehicletypeDto } from './dto/create-vehicletype.dto';
import { UpdateVehicletypeDto } from './dto/update-vehicletype.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponseDto } from '@app/common';
import { CreateServiceCenterDto } from '../service-centers/dto/create-service-center.dto';

@Controller('vehicletype')
@ApiTags('vehicle-type opration list')
export class VehicletypeController {
  constructor(private readonly vehicletypeService: VehicletypeService) {}
  /*
   **
   * Endpoint to create new vehicle-type.
   *
   * This endpoint Create new vehicle-type. It retrieves database.
   * Returns a response containing new created vehicle-type.
   *
   * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and datails of the vehicle-type.
   */
  @Post()
  @ApiOperation({ summary: 'Create new vehicle type' })
  @ApiBody({ type: CreateVehicletypeDto })
  @ApiResponse({
    status: 201,
    description: 'vehicle type created successfully.',
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
    @Body() createVehicletypeDto: CreateVehicletypeDto,
  ): Promise<CommonResponseDto> {
    try {
      const response =
        await this.vehicletypeService.create(createVehicletypeDto);
      return new CommonResponseDto(
        true,
        'vehicle type created successfully.',
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

  /**
   *
   * @returns
   */

  @ApiOperation({ summary: 'getting All vehicle type ' })
  @ApiResponse({
    status: 201,
    description: ' All vehicle type getting successfully.',
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
  @Get()
  async findAll(): Promise<CommonResponseDto> {
    try {
      const responseData = await this.vehicletypeService.findAll();
      return new CommonResponseDto(
        true,
        'vehicle type created successfully.',
        responseData.documents,
      );
    } catch (error) {
      //handel error
      throw new HttpException(
        new CommonResponseDto(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   *
   *
   *
   *
   */

  @ApiOperation({ summary: 'Retrieve a single vehicle type by its ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the vehicle type',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle type retrieved successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Vehicle type with the given ID does not exist.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommonResponseDto> {
    try {
      const responseData = await this.vehicletypeService.findOne(id);

      if (!responseData) {
        throw new HttpException(
          new CommonResponseDto(false, 'Vehicle type not found', null),
          HttpStatus.NOT_FOUND,
        );
      }

      return new CommonResponseDto(
        true,
        responseData.message,
        responseData.document,
        
      );
    } catch (error) {
      // Handle unexpected errors
      if (error instanceof HttpException) {
        throw error; // Re-throw known exceptions
      }
      throw new HttpException(
        new CommonResponseDto(false, 'Unexpected server error', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
/**
 * Endpoint to update an existing vehicle type.
 *
 * This endpoint updates the details of a specific vehicle type identified by its ID.
 * It retrieves the record from the database, applies the updates, and saves it back.
 * Returns a response containing the updated vehicle type details.
 *
 * @param {string} id - The unique identifier of the vehicle type to update.
 * @param {UpdateVehicletypeDto} updateVehicletypeDto - The data to update the vehicle type.
 * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and updated details of the vehicle type.
 */
@ApiOperation({ summary: 'Update a vehicle type' })
@ApiBody({ type: UpdateVehicletypeDto })
@ApiParam({
  name: 'id',
  description: 'The ID of the vehicle type to update',
  required: true,
  type: String,
})
@ApiResponse({
  status: 200,
  description: 'Vehicle type updated successfully.',
  type: CommonResponseDto,
})
@ApiResponse({
  status: 400,
  description: 'Bad Request - Invalid input data.',
})
@ApiResponse({
  status: 404,
  description: 'Not Found - Vehicle type not found.',
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error - Server failure.',
})
@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateVehicletypeDto: UpdateVehicletypeDto,
): Promise<CommonResponseDto> {
  try {
    const response = await this.vehicletypeService.update(
      id,
      updateVehicletypeDto,
    );

    return new CommonResponseDto(
      true,
      response.message,
      response.document,
    );
  } catch (error) {
    // Handle "not found" errors explicitly if thrown by the service
    if (error instanceof NotFoundException) {
      throw new HttpException(
        new CommonResponseDto(false, 'Vehicle type not found.', null),
        HttpStatus.NOT_FOUND,
      );
    }

    // Handle unexpected errors
    throw new HttpException(
      new CommonResponseDto(false, error.message, null),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * API endpoint for deleting a vehicle type.
 * 
 * This endpoint requires the ID of the vehicle type to be deleted. 
 * It provides a common response indicating the success or failure of the operation.
 *
 * @param id - The ID of the vehicle type to be deleted.
 * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and optional data.
 */
@ApiOperation({ summary: 'Delete a vehicle type' })
@ApiParam({
  name: 'id',
  description: 'The ID of the vehicle type to delete',
  required: true,
  type: String,
})
@ApiResponse({
  status: 200,
  description: 'Vehicle type deleted successfully.',
  type: CommonResponseDto,
})
@ApiResponse({
  status: 400,
  description: 'Bad Request - Invalid input data.',
})
@ApiResponse({
  status: 404,
  description: 'Not Found - Vehicle type not found.',
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error - An unexpected error occurred.',
})
@Delete(':id')
async remove(@Param('id') id: string): Promise<CommonResponseDto> {
  try {
    const response = await this.vehicletypeService.remove(id);

    return new CommonResponseDto(
      true,
      'Vehicle type deleted successfully.',
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



}
