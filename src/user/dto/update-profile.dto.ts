import { PartialType } from '@nestjs/mapped-types';
import { UserProfileDto } from './UserProfile.dto';

export class UpdateProfileDto extends PartialType(UserProfileDto) {}
