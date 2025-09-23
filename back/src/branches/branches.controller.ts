import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ERoles } from 'src/common/rolesEnum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async findAll() {
    return await this.branchesService.findAll();
  }

  @Roles(ERoles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(@Body() sucursal: CreateBranchDto) {
    return await this.branchesService.addBranch(sucursal);
  }
}
