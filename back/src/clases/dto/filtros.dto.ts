import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  EIntensidad,
  EGrupoMuscular,
  ESubMusculo,
  ETipos,
} from '../../common/clasesEnums';

export class FiltroClasesDto {
  @IsOptional()
  @IsEnum(EIntensidad)
  intensidad?: EIntensidad;

  @IsOptional()
  @IsEnum(EGrupoMuscular, { each: true })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) return value;
    return [value];
  })
  grupo_musculo?: EGrupoMuscular[];

  @IsOptional()
  @IsEnum(ESubMusculo, { each: true })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) return value;
    return [value];
  })
  sub_musculo?: ESubMusculo[];

  @IsOptional()
  @IsEnum(ETipos)
  tipo?: ETipos;

  @IsOptional()
  @IsString()
  sede?: string;
}

export interface OpcionesFiltro {
  intensidades: EIntensidad[];
  gruposMusculares: EGrupoMuscular[];
  subMusculos: ESubMusculo[];
  tipos: ETipos[];
  sedes: string[];
}
