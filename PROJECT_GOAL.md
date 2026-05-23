# Fitness Coach Web — Project Goal

## Final Outcome

A local-first fitness coach workstation for personal training management. The system provides:
- Training plan view and tracking
- Training review with RPE and performance metrics
- Diet and nutrition logging
- Historical data archive and browsing

## Target User

Single user (self-hosted). No multi-user support, no authentication, no cloud sync.

## Current Status

**v0.1 Read-only MVP complete.**

- 5 个页面可访问（Dashboard / Coach / Review / Diet / Archive）
- 只读本地 JSON 数据
- 本地 JSON 缺失时自动 fallback 到 Mock 数据
- 数据源状态可见（Local JSON / Mock fallback）
- 数据质量标记
- 不写入 JSON，不接 AI，不使用数据库

## Non-Negotiables

1. **No database** — Local JSON files only
2. **No login/auth** — Single-user local application
3. **No SaaS/cloud sync** — Data stays on local machine
4. **No real personal training data committed** — Mock data only in repository
5. **Private coach workstation UI** — Dark theme, data dashboard style
6. **Read-only** — No write to source JSON files

## Success Criteria

- [x] User can view training plans (read-only)
- [x] User can review past training sessions with RPE and ratings (read-only)
- [x] User can view daily meals and track macros (read-only)
- [x] User can browse historical training data
- [x] Application runs entirely offline with local JSON files
- [ ] User can mark training completion (future)
- [ ] User can log new meals (future)
- [ ] AI plan generation (future)

## Quality Gates

- `npm run build` passes without errors
- `npm run lint` passes without errors
- No TypeScript errors
- No sensitive data in repository
- Dark theme UI is consistent and professional

## Phase Plan

| Phase | Status | Description |
|-------|--------|-------------|
| PR1 | ✅ | UI/Mock Dashboard stable |
| PR1.1 | ✅ | Project structure and data adapter layer |
| PR1.2 | ✅ | Read-only local JSON data integration |
| PR1.3 | ✅ | Review stats + data quality markers |
| PR1.4–PR1.11 | ✅ | Polish and clarity cleanup |
| **PR2** | **✅** | **v0.1 Read-only MVP finalization** |
| PR2.1 | ✅ | Read-time data normalization |
| **PR2.2** | **✅** | **Archive read-only search & filters** |
| **PR3** | **✅** | **AI Coach API + training plan preview** |
| PR4 | Planned | Safe write + plan save |

## Out of Scope (v0.1)

- Database (PostgreSQL, SQLite, etc.)
- Authentication/login system
- SaaS deployment
- Cloud sync
- AI API integration
- Image upload
- Write/edit/save operations
- Complex charts (recharts/chart.js/d3)
