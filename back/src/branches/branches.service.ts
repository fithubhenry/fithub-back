import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async findAll(): Promise<Branch[]> {
    return await this.branchRepository.find();
  }

  async addBranch(sucursal: CreateBranchDto): Promise<Branch> {
    if (
      !sucursal.name ||
      !sucursal.address ||
      !sucursal.latitude ||
      !sucursal.longitude
    ) {
      throw new Error('Todos los campos son obligatorios');
    }
    if (sucursal.latitude < -90 || sucursal.latitude > 90)
      throw new Error('La latitud debe estar entre -90 y 90');
    if (sucursal.longitude < -180 || sucursal.longitude > 180)
      throw new Error('La longitud debe estar entre -180 y 180');
    const foundBranch = await this.branchRepository.findOne({
      where: { name: sucursal.name },
    });
    if (foundBranch) throw new Error('Ya existe una sucursal con ese nombre');
    const newBranch = this.branchRepository.create(sucursal);
    await this.branchRepository.save(newBranch);
    return newBranch;
  }
}
