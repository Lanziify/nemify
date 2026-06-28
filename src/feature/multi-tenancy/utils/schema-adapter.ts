import {
  BaseCampusRoleFormValues,
  CreateCampusRoleFormValues,
  UpdateCampusRoleFormValues,
} from '../schema/campus.schema';
import { CampusRoleRow } from '../data/role-columns';

type ExtractedCreateCampusRoleOptions = Omit<
  CreateCampusRoleFormValues,
  'role' | 'permission'
>;

export class CampusSchemaAdapter {
  constructor(private baseData: BaseCampusRoleFormValues) {}

  transformBaseValuesToCreate(
    values: ExtractedCreateCampusRoleOptions
  ): CreateCampusRoleFormValues {
    return {
      ...values,
      role: this.baseData.role,
      permission: this.baseData.permission,
    };
  }

  transformBaseValuesToUpdate(
    rowValues: CampusRoleRow
  ): UpdateCampusRoleFormValues {
    return {
      organizationId: rowValues.organizationId,

      roleId: rowValues.id,

      roleName: rowValues.role,

      data: {
        ...(rowValues.role != this.baseData.role && {
          roleName: this.baseData.role,
        }),
        permission: this.baseData.permission,
      },
    };
  }
}
