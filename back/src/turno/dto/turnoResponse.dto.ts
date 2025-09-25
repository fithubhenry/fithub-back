export class TurnoResponseDto {
  id: string;
  fecha: Date;
  estado: string;
  userId: string;
  claseId: string | null;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  activo: boolean;
}
