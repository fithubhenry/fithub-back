// src/branches/branches.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Post()
  create(sucursal: CreateBranchDto) {
    return this.branchesService.addBranch(sucursal);
    // Lógica para crear una nueva sucursal
  }
}
