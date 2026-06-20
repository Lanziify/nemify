import { loadPlatformState } from '@/utils/platform';

export async function register() {
  await loadPlatformState();
}
