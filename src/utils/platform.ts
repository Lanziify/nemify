import { getPlatformInitState } from '@/feature/auth/repositories/auth.repository';

let initialized: boolean | null = null;

export async function loadPlatformState() {
  const isPlatformInit = await getPlatformInitState();

  initialized = isPlatformInit?.initialized ?? false;
}

export function isPlatformInitialized() {
  return initialized;
}

export function setPlatformInitialized(value: boolean) {
  initialized = value;
}

export async function refreshPlatformState() {
  const result = await getPlatformInitState();

  initialized = result?.initialized;
}
