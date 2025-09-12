import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../common/rolesEnum';

export const Roles = (...roles: ERoles[]) => SetMetadata('rol', roles);
