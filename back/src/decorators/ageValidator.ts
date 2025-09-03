import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class EsMayorDeEdadConstraint implements ValidatorConstraintInterface {
  validate(fecha_nacimiento: Date, args: ValidationArguments) {
    if (!fecha_nacimiento) return false;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha_nacimiento.getFullYear();
    const mes = hoy.getMonth() - fecha_nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha_nacimiento.getDate())) {
      edad--;
    }

    return edad >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El usuario debe tener al menos 18 años';
  }
}

export function EsAdulto(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EsMayorDeEdadConstraint,
    });
  };
}
