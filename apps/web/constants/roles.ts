export const DEFAULT_ROLES = {
  SUPER_ADMIN: "Super Admin",
  ORGANIZATION_ADMIN: "Organization Admin",
  HR_MANAGER: "HR Manager",
  RECRUITER: "Recruiter",
  OPERATIONS: "Operations",
  QA_REVIEWER: "QA Reviewer",
  READ_ONLY: "Read Only",
} as const;

export type DefaultRole = typeof DEFAULT_ROLES[keyof typeof DEFAULT_ROLES];
