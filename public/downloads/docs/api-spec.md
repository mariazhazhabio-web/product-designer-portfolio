# API specification (proposed REST API v1)

The prototype runs fully in the browser; this is the contract a production backend would implement. JSON over HTTPS, OAuth 2.0 bearer tokens, ISO 8601 UTC timestamps, league time zone in league settings.

## Conventions
- Base URL: `/v1`
- Errors: `{ "error": { "code": "VALIDATION_FAILED", "message": "…", "fields": { "venueId": "Choose a venue." } } }`
- Pagination: `?cursor=…&limit=50` → `{ data: [], nextCursor }`
- Authorization: every endpoint enforces role + team scope (see Role-based access map). 403 responses include `requiredPermission`.
- Idempotency: `Idempotency-Key` header on POST.

## Events
### `GET /v1/leagues/{leagueId}/events`
Query: `from`, `to` (required), `teamId`, `venueId`, `type`, `status`. Returns role-scoped events.

### `POST /v1/events`
```json
{
  "leagueId": "lg_1", "title": "Hawks vs Comets", "type": "game",
  "teamIds": ["t-hawks", "t-comets"], "venueId": "v-ca",
  "start": "2026-11-28T14:00:00Z", "end": "2026-11-28T15:15:00Z",
  "notes": "Bring both jerseys", "expectedAttendance": 120,
  "recurrence": { "freq": "WEEKLY", "byDay": ["TU","TH"], "until": "2027-01-10" },
  "notify": true
}
```
201 → `{ "event": {…} | "series": {…, occurrences: n}, "conflicts": Conflict[] }`. Saving with conflicts is allowed; conflicts are returned so the UI can show them.

### `PATCH /v1/events/{id}?scope=this|following|all`
Partial update. For `following`/`all`, date changes are rejected (`422 SCOPE_DATE_CHANGE`); time, venue, teams, notes apply per occurrence.

### Lifecycle
- `POST /v1/events/{id}/cancel` `{ reason, scope: "this"|"following" }`
- `POST /v1/events/{id}/postpone` `{ reason }`
- `POST /v1/events/{id}/restore`
- `DELETE /v1/events/{id}` (admin only)
- `POST /v1/events/{id}/duplicate` `{ offsetDays: 7 }`

## Conflicts
- `POST /v1/conflicts/check` body = draft event → `{ conflicts: Conflict[] }` (no save)
- `GET /v1/leagues/{id}/conflicts?severity=error|warning&includeAcknowledged=false`
- `POST /v1/conflicts/{conflictId}/acknowledge` (warnings only)
- `GET /v1/events/{id}/alternatives?days=14&limit=3` → `Alternative[]`

```ts
type Conflict = { id: string; kind: "venue_double_booked" | "team_overlap" | "coach_unavailable" | "player_unavailable" | "insufficient_rest" | "facility_closed" | "outside_hours" | "maintenance" | "capacity" | "recurring_conflict"; severity: "error" | "warning"; eventIds: string[]; title: string; message: string; fix: string };
type Alternative = { event: Event; score: number; reasons: string[]; tradeoffs: string[]; warnings: string[] };
```

## Scheduling proposals (assistant)
- `POST /v1/schedule-proposals` `{ leagueId, prompt, parentProposalId? }` → `Proposal` with `understood[]`, `events[]`, `explanation[]`, `warnings[]`, `stats[]`, `version`
- `PATCH /v1/schedule-proposals/{id}` `{ events }`: server re-validates, returns per-row conflicts
- `POST /v1/schedule-proposals/{id}/approve` (admin/org manager) → creates events in one revision
- `POST /v1/schedule-proposals/{id}/reject`

## RSVP & attendance
- `PUT /v1/events/{id}/rsvps/{personId}` `{ status: "yes"|"no"|"maybe" }`: allowed for self, guardian of person, or team staff
- `GET /v1/events/{id}/rsvps` → counts + roster (staff only)
- `POST /v1/events/{id}/rsvp-reminders` → `{ queued: n }`
- `PUT /v1/events/{id}/attendance` `{ present: personId[] }`

## People, teams, venues
- `GET/POST/PATCH /v1/teams`, `/v1/people`, `/v1/people/{id}/availability`
- `GET/POST/PATCH /v1/venues`, `POST /v1/venues/{id}/blocks` `{ kind: "closure"|"maintenance", start, end, reason }`

## Import / export / share
- `POST /v1/imports/csv` (multipart, ≤1 MB) `?dryRun=true` → `{ rows: [{ line, errors[], event? }] }`; without dryRun imports valid rows
- `GET /v1/exports/events.csv?…filters`
- `POST /v1/share-links` `{ teamId, expiresAt? }` → `{ url }`; `GET /v1/shared/{token}` (public, read-only)

## Calendar
- `GET /v1/calendars/{token}.ics`: subscribable feed (webcal), regenerated on change
- `POST /v1/calendar-connections` `{ provider: "google"|"microsoft" }` → OAuth URL; callback stores tokens server-side (encrypted); events written to a dedicated "SportSync" calendar

## Notifications
- `GET /v1/notifications?unread=true`, `POST /v1/notifications/read` `{ ids }`
- `GET/PUT /v1/notification-preferences` `{ [type]: Channel[] }`

## Revisions
- `GET /v1/leagues/{id}/revisions`, `POST /v1/revisions/{id}/restore`

## Webhooks (for integrations)
`event.created`, `event.updated`, `event.cancelled`, `schedule.published`, `rsvp.updated`. Signed with HMAC-SHA256 (`X-SportSync-Signature`).
