# Battle memory audit — 2026-11-11

Baseline: eb8a5f6 / 2026.11.11.2. Measurements used isolated installed Chrome,
mocked game documents and intercepted network. Each heap sample followed explicit
garbage collection. No real account, installed userscript manager, or hours-long
live session was exercised. This does not prove the absence of every memory leak.

## Findings

| Scenario | Result |
| --- | --- |
| 1,000 AJAX round replacements | DOM nodes settled at 1,222; event listeners stayed at 243. JS heap was 2.85 MiB at round 250 and 2.93 MiB at round 1,000. |
| 20,000 updates without full-log recording | DOM/listener counts stayed stable. JS heap was 2.80 MiB after 5,000 updates and 2.91 MiB after 20,000. Action history is reset on round replacement. |
| 20,000 updates with full-log recording | 60,000 retained log lines; JS heap reached 5.31 MiB, then 7.93 MiB after serializing a checkpoint. Full history is intentional, but has no size cap. |
| 40 calls to the real statistics-preview flow with a 50,000-line log | Before: 40 unreleased Blob URLs representing 125.46 MiB. After: zero URLs and zero retained Blob bytes. |
| 20 actual statistics-window open/close cycles after the fix | Returned to one document, 1,262 nodes, 243 listeners, zero theme-document references and zero Blob URLs. |
| Saving a synthetic 120,000-line full log | Chrome raised QuotaExceededError. This is storage exhaustion, distinct from JavaScript heap exhaustion. The threshold depends on log contents and existing storage. |

Blob bytes above are the total logical size registered by live object URLs, not
measured renderer RAM. The browser may manage their backing data outside the JS heap.

## Changes

- Do not construct a full-log download when opening statistics: that link was
  discarded by the preview path while its Blob URL remained live.
- Create download data only when the result-page download link is clicked; revoke
  the URL after 30 seconds. Repeated downloads and Unicode contents are verified.
- Remove routine console dumps of entire logs and record objects.
- Save compact battle statistics before the optional full-log checkpoint, so a
  failed log write does not skip those writes. The old saved log and pending in-memory
  lines remain intact; this does not remove the full-log storage limit.

Targeted export, quota-failure and final-settlement regressions passed. Temporary
stress probes and raw measurements remain in ignored .test-output/; no user
configurations are included. Complete logs are not truncated, and historical
statistics are not deleted. Very long full logs, very large statistics archives,
other installed scripts and actual userscript-manager storage still require live
profiling if the user observes a real crash.
