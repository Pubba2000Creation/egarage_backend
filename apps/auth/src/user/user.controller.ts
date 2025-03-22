import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from '@app/common';
import { response } from 'express';
import { RESPONSE_PASSTHROUGH_METADATA } from '@nestjs/common/constants';

@Controller('user')
@ApiTags('User oprations list')
export class UserController {
  constructor(private readonly userService: UserService) {}
/**
 * Endpoint to retrieve all user details.
 *
 * This endpoint fetches all the users available in the database.
 * Returns a response containing all user details.
 *
 * @returns {Promise<CommonResponseDto>} A response object containing a success flag, message, and list of users.
 */
@Get()
@ApiOperation({ summary: 'Retrieve all user details' })
@ApiResponse({
  status: 200,
  description: 'All users retrieved successfully.',
  type: CommonResponseDto,
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error - Server failure.',
})
async findAll(): Promise<CommonResponseDto> {
  try {
    const responseData = await this.userService.findAll();
    return new CommonResponseDto(
      true,
      'All users retrieved successfully',
      responseData.documents,
    );
  } catch (error) {
    console.error('Error in UserController.findAll:', error);
    throw new HttpException(
      new CommonResponseDto(false, 'Error retrieving users', null),
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
@ApiOperation({ summary: 'Retrieve user details by ID' })
@ApiParam({
  name: 'id',
  description: 'The unique identifier of the user to retrieve',
  required: true,
  type: String,
})
@ApiResponse({
  status: 200,
  description: 'User details retrieved successfully.',
  type: CommonResponseDto,
})
@ApiResponse({
  status: 404,
  description: 'User not found.',
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error - Server failure.',
})
async findOne(@Param('id') id: string): Promise<CommonResponseDto> {
  try {
    const responseData = await this.userService.findOne(id);
    return new CommonResponseDto(
      true,
      responseData.message,
      responseData.document,
    );
  } catch (error) {
    console.error('Error in UserController.findOne:', error);
    throw new HttpException(
      new CommonResponseDto(false, 'Error retrieving user', null),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


/**
 * Endpoint for updating user details.
 * 
 * This endpoint updates the details of a user based on the provided user ID and update data.
 * It returns the updated user details if the operation is successful or an appropriate error message otherwise.
 * 
 * @param {string} id - The ID of the user to update.
 * @param {UpdateUserDto} updateUserDto - The DTO containing the updated user details.
 * @returns {Promise<CommonResponseDto>} A response object containing the success flag, message, and updated user details.
 */
  @Patch(':id')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to update.',
    required: true,
    type: String,
  })
  @ApiBody({
    description: 'User details to be updated.',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User details updated successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<CommonResponseDto> {
    try {
      const responseData = await this.userService.update(id, updateUserDto);

      // Check if the user was found and updated.
      if (!responseData.document) {
        throw new HttpException(
          new CommonResponseDto(false, 'User not found', null),
          HttpStatus.NOT_FOUND,
        );
      }

      // Return the updated user details.
      return new CommonResponseDto(
        true,
        'User details updated successfully',
        responseData.document,
      );
    } catch (error) {
      console.error('Error in UserController.update:', error);

      // Rethrow known exceptions to avoid overwriting their status codes or messages.
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle unexpected errors.
      throw new HttpException(
        new CommonResponseDto(false, 'Error updating user', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


/**
 * Endpoint for deleting a user by ID.
 * 
 * This endpoint deletes a user from the database based on the provided user ID.
 * It returns a success message and the deleted user details if the operation is successful.
 * If the user is not found, a `404 Not Found` error is returned.
 * 
 * @param {string} id - The unique identifier of the user to delete.
 * @returns {Promise<CommonResponseDto>} A response object indicating the result of the delete operation.
 */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to delete.',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    type: CommonResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Server failure.',
  })
  async remove(@Param('id') id: string): Promise<CommonResponseDto> {
    try {
      const responseData = await this.userService.remove(id);

      // Check if the user was found and deleted.
      if (!responseData.document) {
        throw new HttpException(
          new CommonResponseDto(false, 'User not found', null),
          HttpStatus.NOT_FOUND,
        );
      }

      // Return the deleted user details.
      return new CommonResponseDto(
        true,
        'User deleted successfully',
        responseData.document,
      );
    } catch (error) {
      console.error('Error in UserController.remove:', error);

      // Rethrow known exceptions to avoid overwriting their status codes or messages.
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle unexpected errors.
      throw new HttpException(
        new CommonResponseDto(false, 'Error deleting user', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



}
