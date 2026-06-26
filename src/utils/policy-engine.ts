export type PermissionMap = Record<string, string[]>;

export class PolicyEngine {
  constructor(private permissions: PermissionMap) {}

  can(resource: string, action: string) {
    return this.permissions[resource]?.includes(action);
  }
}
