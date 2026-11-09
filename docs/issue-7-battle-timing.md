# Issue #7: split-view turn intervals

The report describes increasing turn intervals in Chrome split view. The supplied CSV contains 148 samples over 294 seconds, including 130 numeric round/interval samples. After excluding the 11 intervals above 1,000 ms, median intervals increase from 354.5 ms in rounds 6–10 to 509 ms in rounds 46–50. The progression is not strictly monotonic. The CSV does not measure requests, script processing, scheduling delays, or document visibility, so it cannot identify the cause.

## Changes

- Read and serialize only the current action during ordinary updates. Retain native DOM history, nested Scan markup, full initialization/final snapshots, and exported battle history.
- Traverse recorder cells lazily instead of collecting all historical cells on every update.
- Cancel an overdue trailing throttle callback before executing a newer immediate call. This prevents replay after timers have been delayed; it does not establish that Chrome split view caused the reported delay.
- Rename the displayed “Network delay” value to “Turn interval”: it measures the interval between processing callbacks, not network round-trip time.

## Evidence

Offline Chrome fixtures verify bounded reads with 10,000 previous actions, nested Scan/translation compatibility, unchanged counters/history, delayed-timer cancellation, and timing lifecycle behavior. The focused battle suite passes 76 tests.

Before adding the diagnostic wrapper, two local benchmark runs with 40 samples per scenario measured median processing of a 2,000-row log at 1.7/1.8 ms before and 1.0/1.0 ms after. The 100-row cases stayed around 0.4–1.1 ms. This small synthetic improvement does not explain the reported hundreds of milliseconds, and does not constitute live split-view validation.

## Rechecking split view

Read `JPXPlus.getBattleTiming()` in the page console after an action. The frozen snapshot contains `samples`, `intervalMs`, `queueMs`, `processingMs`, and `visibility`. Only the latest sample is retained; there is no polling, persistence, network interception, or upload.

- `intervalMs`: interval between processing callbacks; pauses and navigation can affect it.
- `queueMs`: time from the most recent log MutationObserver callback to processing; null for direct processing. It excludes waiting before the observer runs and is not response time.
- `processingMs`: synchronous JPX processing duration; excludes later asynchronous work and browser rendering.

Compare equivalent single-window, separate-window, and split-view sessions. The issue remains open pending real split-view reproduction and timing evidence.
