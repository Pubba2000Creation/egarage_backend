import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
 constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.find({});
  }


  //funtion for getting user by id
  findOne(_id: string) {
    return this.userRepository.findOne({_id})
  }


  //funtion for change user details and update
  update(_id: string, updateUserDto: UpdateUserDto) {
     return this.userRepository.findOneAndUpdate(
      { _id: _id },
      {$set: updateUserDto}
     );
  }

  //the funtion for delete user account 

  remove(_id: string) {
    return this.userRepository.findOneAndDelete({ _id });
  }
}
