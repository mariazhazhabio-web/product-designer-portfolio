# Edge cases

| # | Area | Edge case | Expected behaviour | Prototype |
|---|---|---|---|---|
| 1 | Events | End time before start time | Inline error on End; save blocked | ✅ |
| 2 | Events | Event crosses venue closing time | "Outside operating hours" blocking conflict | ✅ |
| 3 | Events | Back-to-back events at same venue (end = start) | Not a conflict | ✅ |
| 4 | Recurring | Edit "this and following" on first occurrence | Equivalent to all | ✅ |
| 5 | Recurring | Cancel "this and following" | Future occurrences cancelled, past untouched | ✅ |
| 6 | Recurring | Two series clash on many dates | One grouped "recurring conflict" | ✅ |
| 7 | Conflicts | Same team, two events overlapping | Team overlap (error) | ✅ |
| 8 | Conflicts | Games for same team 2h apart | Insufficient rest (warning; threshold in Settings) | ✅ |
| 9 | Conflicts | 3 of 8 players unavailable | Warning; ≥ threshold → error | ✅ |
| 10 | Conflicts | Coach coaches two teams playing simultaneously | Coach-level overlap via team overlap / availability | Partial (team-level) |
| 11 | Conflicts | Conflict in the past | Ignored (only upcoming events checked) | ✅ |
| 12 | Alternatives | No free slot in 14 days | Clear message + suggestions to relax rules | ✅ |
| 13 | Postponed | Postponed event has old date in the past | "Find a new date" searches from today | ✅ |
| 14 | Assistant | Too few days for round robin with once-per-day | Switch to pool play + explain | ✅ |
| 15 | Assistant | More teams requested than exist | Adds placeholder "Guest Team" + warning | ✅ |
| 16 | Assistant | Edited row now conflicts | Row highlighted; Approve disabled | ✅ |
| 17 | Assistant | Coach tries to approve | Disabled with explanation | ✅ |
| 18 | RSVP | Parent with children on both teams in one game | One control per child | ✅ |
| 19 | RSVP | RSVP after event ended | Hidden; attendance tracking instead | ✅ |
| 20 | Import | Wrong file type / > 1 MB | Specific error, nothing imported | ✅ |
| 21 | Import | Missing required columns | Lists missing columns | ✅ |
| 22 | Import | Quoted commas, escaped quotes | Parsed correctly | ✅ (unit test) |
| 23 | ICS | Long descriptions, commas, semicolons | Escaped and folded at 75 octets | ✅ (unit test) |
| 24 | Time zones | Viewer in a different time zone than league | Show league time with zone label | ❌ future (prototype uses device time) |
| 25 | DST | Recurring event across daylight-saving change | Keep local wall-clock time | ❌ future (server RRULE) |
| 26 | Offline | Edit while offline | Saved locally; banner; sync confirmation | ✅ (simulated) |
| 27 | Permissions | Parent opens assistant URL directly | Permission notice, not a blank page | ✅ |
| 28 | Storage | localStorage unavailable (private mode) | Runs in memory | ✅ |
| 29 | Share | Invalid team in share link | "This shared link isn't valid" | ✅ |
| 30 | Data age | Saved demo data older than 10 days | Fresh sample loaded so dates stay current | ✅ |
