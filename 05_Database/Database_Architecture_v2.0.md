# Project Nova - Database Architecture v2.0

## Purpose

This document defines the core database entities for Project Nova.

The database is designed to support:

- Multi-tenant architecture
- Enterprise customers
- AI-powered verification workflows
- Audit compliance
- Scalability
- Future API integrations

---

# Core Modules

1. Organizations
2. Users
3. Roles & Permissions
4. Candidates
5. Verification Requests
6. Verification Checks
7. Documents
8. Reports
9. Notifications
10. Audit Logs
11. Billing
12. API Keys

---

# Entity Relationship (High Level)

Organization
│
├── Users
│
├── Verification Requests
│       │
│       ├── Candidate
│       ├── Verification Checks
│       ├── Documents
│       └── Reports
│
└── Billing

Every action generates Audit Logs.

---

# Database Standards

- UUID Primary Keys
- created_at
- updated_at
- deleted_at (Soft Delete)
- created_by
- updated_by

---

# Security Standards

- Row Level Security Ready
- Encryption for Sensitive Fields
- Immutable Audit Logs
- Least Privilege Access

---

# Future Integrations

- EPFO
- DigiLocker
- Aadhaar (Authorized)
- PAN Verification
- GST
- CIN/MCA
- eCourts
- Police Verification
- AI Risk Engine

---

Status

Draft v2.0
