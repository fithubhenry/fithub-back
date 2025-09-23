// src/branches/dto/create-branch.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
