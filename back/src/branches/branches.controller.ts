import { Controller, Get, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async findAll() {
    return await this.branchesService.findAll();
  }

  @Post()
  async create(sucursal: CreateBranchDto) {
    return await this.branchesService.addBranch(sucursal);
  }
}
