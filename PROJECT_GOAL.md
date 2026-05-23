# Fitness Coach Web — Project Goal

## Final Outcome

A local-first fitness coach workstation for personal training management. The system provides:
- Training plan generation and execution tracking
- Training review with RPE and performance metrics
- Diet and nutrition logging
- Historical data archive and browsing

## Target User

Single user (self-hosted). No multi-user support, no authentication, no cloud sync.

## Non-Negotiables

1. **No database in PR1/PR1.1** — Local JSON files only
2. **No login/auth** — Single-user local application
3. **No SaaS/cloud sync** — Data stays on local machine
4. **No real personal training data committed** — Mock data only in repository
5. **Private coach workstation UI** — Dark theme, data dashboard style, not a gym marketing page

## Success Criteria

- User can view training plans and mark completion
- User can review past training sessions with RPE and ratings
- User can log daily meals and track macros
- User can browse historical training data
- Application runs entirely offline with local JSON files

## Quality Gates

- `npm run build` passes without errors
- `npm run lint` passes without errors
- No TypeScript errors
- No sensitive data in repository
- Dark theme UI is consistent and professional

## Phase Plan

| Phase | Status | Description |
|-------|--------|-------------|
| PR1 | ✅ Current | UI/Mock Dashboard stable — dark theme, navigation, mock data |
| PR1.1 | Planned | Project structure and data adapter layer preparation |
| PR1.2 | Planned | Read-only local JSON data integration |
| PR1.3 | Planned | Training review/statistics calculation completion |
| PR2 | Planned | AI prompt/API integration evaluation |

## Out of Scope

- Database (PostgreSQL, SQLite, etc.)
- Authentication/login system
- SaaS deployment
- Cloud sync
- Real AI API integration (PR1)
- Real training data import (PR1)
- Mobile responsive design (PR1)
- Complex charts (PR1)
