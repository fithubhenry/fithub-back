import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { FiltroClasesDto } from './dto/filtros.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FiltrosRepository {
  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
  ) {}

  async filtrarClases(filtro: FiltroClasesDto) {
    const queryBuilder = this.claseRepository.createQueryBuilder('clase');

    if (filtro.intensidad) {
      queryBuilder.andWhere('clase.intensidad = :intensidad', {
        intensidad: filtro.intensidad,
      });
    }

    if (filtro.sede) {
      queryBuilder.andWhere('clase.sede = :sede', {
        sede: filtro.sede,
      });
    }

    if (filtro.tipo) {
      queryBuilder.andWhere('clase.tipo = :tipo', { tipo: filtro.tipo });
    }

    if (filtro.grupo_musculo) {
      queryBuilder.andWhere(
        `
    EXISTS (
      SELECT 1
      FROM json_array_elements(
        CASE
          WHEN json_typeof(clase.grupo_musculo) = 'array' THEN clase.grupo_musculo
          ELSE json_build_array(clase.grupo_musculo)
        END
      ) AS elem
      WHERE elem::text IN (:...grupo_musculo)
    )
  `,
        { grupo_musculo: filtro.grupo_musculo.map((g) => `"${g}"`) },
      );
    }

    if (filtro.sub_musculo) {
      queryBuilder.andWhere(
        `
    EXISTS (
      SELECT 1
      FROM json_array_elements(
        CASE
          WHEN json_typeof(clase.sub_musculo) = 'array' THEN clase.sub_musculo
          ELSE json_build_array(clase.sub_musculo)
        END
      ) AS elem
      WHERE elem::text IN (:...sub_musculo)
    )
  `,
        { sub_musculo: filtro.sub_musculo.map((s) => `"${s}"`) },
      );
    }

    return await queryBuilder.getMany();
  }
}
