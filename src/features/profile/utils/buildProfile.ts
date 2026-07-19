/**
 * @file        buildProfile.ts
 * @feature     Profile
 * @description Maps authenticated User to a full UserProfile with role-specific defaults.
 * @data        buildProfileFromAuth
 * @author      MiStarStudio
 */

import type { User } from '../../auth/types/auth.types';
import { getWorkerById } from '../../labor/data/mockLaborData';
import type { UserProfile } from '../types/profile.types';

const DEFAULT_AVATAR = (seed: string) => `https://picsum.photos/seed/profile-${seed}/200/200`;

/** Builds UserProfile from auth session; worker role gets placeholder skills and rate until API loads. */
export function buildProfileFromAuth(user: User): UserProfile {
  const base: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    region: user.region,
    avatarUrl: DEFAULT_AVATAR(user.id),
    verified: true,
  };

  if (user.role === 'WORKER') {
    const workerProfile = getWorkerById(user.id);
    if (workerProfile) {
      return {
        ...base,
        skills: workerProfile.skills,
        certifications: workerProfile.certifications,
        certificationFiles: [],
        hourlyRate: workerProfile.hourlyRate,
      };
    }
    // TODO(api): replace with worker fields from GET /users/me or GET /workers/{id}
    return {
      ...base,
      skills: ['Land Clearing', 'Planting', 'Harvesting'],
      certifications: ['AgroSafety Certificate'],
      certificationFiles: [],
      hourlyRate: 25,
    };
  }

  return base;
}
