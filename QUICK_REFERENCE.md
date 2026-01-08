# Quick Reference: Polling Fix

## The Fix in 30 Seconds

**Problem**: Page stuck on "Generating..." forever
**Cause**: Frontend never checked if slides were ready
**Solution**: Auto-poll every 3s, show progress, timeout at 90s

---

## Key Numbers

- **Poll interval**: 3 seconds
- **Timeout**: 90 seconds
- **Max requests**: ~30 per deck
- **Progress estimate**: 5 seconds per slide

---

## State Machine (5 States)

```
loading → generating → completed
             ↓
          timeout
             ↓
          error
```

---

## What Users See

### Generating (0-90s):
```
⟳ Generating your deck...
▓▓▓▓▓▓▓░░░ 65%
Elapsed: 18s / ~25s
Checking every 3s (attempt #6)

[Refresh Now]  [Cancel & Delete]
```

### Timeout (>90s):
```
⏱️ Generation Taking Longer
This is unusual...

[Check Again]  [Back]  [Delete]
```

### Completed:
```
✅ Deck created successfully!
5 slides ready

[Export PPTX]
```

---

## Files Changed

1. `apps/web/src/app/decks/[id]/edit/page.tsx` - Complete rewrite

---

## Key Code Snippets

### Polling Setup:
```typescript
useEffect(() => {
  if (generationState === 'generating') {
    const interval = setInterval(fetchDeck, 3000);
    return () => clearInterval(interval);
  }
}, [generationState]);
```

### State Logic:
```typescript
if (slideCount > 0) {
  setGenerationState('completed');
  stopPolling();
} else if (status === 'FAILED') {
  setGenerationState('error');
  stopPolling();
} else if (elapsed > 90000) {
  setGenerationState('timeout');
  stopPolling();
} else {
  setGenerationState('generating');
}
```

---

## Test It

```bash
# 1. Start services
cd apps/api && pnpm dev
cd apps/web && pnpm dev
cd apps/worker && pnpm dev

# 2. Create deck
open http://localhost:3000/decks/new

# 3. Watch polling in action!
# Should see progress bar, timer, polling counter
```

---

## Debugging

### Check polling is working:
- Open DevTools Network tab
- Should see GET `/api/decks/:id` every 3 seconds

### Check worker is processing:
- Watch worker terminal logs
- Should see "Processing deck..." messages

### Force timeout test:
- Stop worker
- Create deck
- Should timeout after 90s with clear message

---

## Documentation

- `POLLING_FIX_SUMMARY.md` - Detailed technical explanation
- `SOLUTION_COMPLETE.md` - Complete solution overview
- `QUICK_REFERENCE.md` - This file

---

## Status: ✅ READY TO DEPLOY
