# Complete Testing Guide

## Prerequisites Checklist

Before testing, ensure:
- [ ] Docker Desktop is running
- [ ] All dependencies installed (`pnpm install`)
- [ ] Packages built (`cd packages/shared && pnpm build`, etc.)
- [ ] Environment files configured
- [ ] Docker services started (`docker compose up -d`)
- [ ] Database migrated and seeded (`cd apps/api && pnpm prisma migrate deploy && pnpm prisma db seed`)

## Quick Start Services

### Terminal 1 - API Server
```bash
cd apps/api
pnpm dev

# Wait for: "Server listening on port 4000"
```

### Terminal 2 - Worker
```bash
cd apps/worker
pnpm dev

# Wait for: "Worker started"
```

### Terminal 3 - Web UI
```bash
cd apps/web
pnpm dev

# Wait for: "Ready on http://localhost:3000"
```

## Test Suite

### 1. API Health Check ✅

**Test**: Verify API is responding

```bash
curl http://localhost:4000/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-08T..."
}
```

**Status**: ✅ Pass / ❌ Fail

---

### 2. Homepage Test ✅

**Test**: Load homepage

**Steps**:
1. Open browser: http://localhost:3000
2. Verify page loads without errors
3. Check for:
   - "AI-Powered Slide Decks" heading
   - "Get Started" button
   - "Browse Templates" button
   - 3 feature cards

**Expected**: Professional homepage with gradient background

**Status**: ✅ Pass / ❌ Fail

---

### 3. API Status Page Test ✅

**Test**: Diagnostic page works

**Steps**:
1. Navigate to: http://localhost:3000/api-status
2. Click "Refresh" button
3. Verify all services show "Healthy"

**Expected**:
- API Server: ✅ Healthy
- Decks Endpoint: ✅ Healthy
- Templates Endpoint: ✅ Healthy

**If any fail**: Follow troubleshooting steps on the page

**Status**: ✅ Pass / ❌ Fail

---

### 4. Presentations List Test ✅

**Test**: View existing decks

**Steps**:
1. Navigate to: http://localhost:3000/decks
2. Check page loads
3. Verify demo deck appears (from seed data)

**Expected**:
- "Presentations" heading
- "Create New Deck" button
- At least 1 deck card showing
- Card shows: title, status, slide count, date

**Status**: ✅ Pass / ❌ Fail

---

### 5. Templates Page Test ✅

**Test**: View templates

**Steps**:
1. Navigate to: http://localhost:3000/templates
2. Verify templates appear

**Expected**:
- "Templates" heading
- 2 template cards (Corporate Blue, Modern Minimal)
- Each shows: color palette, font info, "Use Template" button

**Status**: ✅ Pass / ❌ Fail

---

### 6. Create Deck Form Test ✅

**Test**: Create deck form loads and validates

**Steps**:
1. Navigate to: http://localhost:3000/decks/new
2. Try submitting empty form
3. Verify validation works (title required)
4. Fill in form:
   - Title: "Test Presentation Q4"
   - Description: "Testing deck creation"
   - Leave other fields as default
5. Click "Create Deck"

**Expected**:
- Form has all fields
- Submit button disabled when title empty
- Shows loading spinner when submitting
- Redirects to edit page (NOT 404!)

**Status**: ✅ Pass / ❌ Fail

---

### 7. Deck Creation Flow Test ✅

**Critical Test**: End-to-end deck creation

**Steps**:
1. Go to http://localhost:3000/decks/new
2. Fill form:
   - Title: "Integration Test Deck"
   - Audience: Executive
   - Goal: Persuade
   - Start Mode: Start Blank
   - Target Slides: 5
3. Submit
4. Wait for redirect
5. Verify edit page loads

**Expected**:
- ✅ Redirects to `/decks/{id}/edit`
- ✅ NO 404 ERROR
- ✅ Shows deck title
- ✅ Shows "Generating your deck..." message
- ✅ After 10-30 seconds, shows slides in sidebar

**Status**: ✅ Pass / ❌ Fail

**If fails**:
- Check API logs for errors
- Check worker logs
- Verify Redis is running: `docker compose ps`

---

### 8. Edit Page Direct Access Test ✅

**Test**: Direct URL access works

**Steps**:
1. Create a deck (test #7)
2. Copy the deck ID from URL
3. Open new tab
4. Navigate to: http://localhost:3000/decks/{id}/edit

**Expected**:
- Page loads with deck info
- No 404 error
- Shows deck details

**Status**: ✅ Pass / ❌ Fail

---

### 9. Navigation Test ✅

**Test**: All navigation links work

**Steps**:
1. From homepage, click "Get Started"
   - Expected: Goes to /decks
2. Click "Browse Templates"
   - Expected: Goes to /templates
3. Click "AI Slide Agent" logo
   - Expected: Goes to homepage
4. Click "Status" in header
   - Expected: Goes to /api-status
5. Click "Presentations" in header
   - Expected: Goes to /decks
6. Click "Create Deck" button
   - Expected: Goes to /decks/new

**Status**: ✅ Pass / ❌ Fail

---

### 10. Deck List Click Test ✅

**Test**: Clicking deck opens editor

**Steps**:
1. Go to http://localhost:3000/decks
2. Click on any deck card
3. Verify redirect to edit page

**Expected**:
- Opens /decks/{id}/edit
- No 404 error
- Shows deck editor

**Status**: ✅ Pass / ❌ Fail

---

### 11. Export PPTX Test ✅

**Test**: Export functionality

**Steps**:
1. Open any deck in editor
2. Click "Export PPTX" button
3. Check for alert/notification

**Expected**:
- Shows success message with job ID
- No errors in console

**Note**: Actual download link will appear after worker processes job

**Status**: ✅ Pass / ❌ Fail

---

### 12. Error Handling Test ✅

**Test**: Invalid deck ID handling

**Steps**:
1. Navigate to: http://localhost:3000/decks/invalid-id-123/edit
2. Verify error page shows

**Expected**:
- "Deck not found" message
- "Back to Presentations" button
- No crash

**Status**: ✅ Pass / ❌ Fail

---

### 13. Responsive Design Test ✅

**Test**: Mobile responsiveness

**Steps**:
1. Open any page
2. Resize browser to mobile width (375px)
3. Check layout adjusts

**Expected**:
- No horizontal scroll
- Navigation still accessible
- Cards stack vertically
- Buttons readable

**Status**: ✅ Pass / ❌ Fail

---

### 14. Form Validation Test ✅

**Test**: All form fields validate

**Steps**:
1. Go to create deck form
2. Test each field:
   - Title: Required, max length
   - Target Slides: Min 3, max 50
   - All dropdowns have valid options

**Expected**:
- Cannot submit without title
- Number field enforces limits
- All options selectable

**Status**: ✅ Pass / ❌ Fail

---

### 15. Loading States Test ✅

**Test**: Loading spinners appear

**Steps**:
1. Navigate to /decks
   - Should show spinner briefly
2. Create new deck
   - Should show "Creating..." on button
3. Open edit page
   - Should show spinner while loading

**Expected**:
- Spinners visible during async operations
- Professional loading messages
- No blank screens

**Status**: ✅ Pass / ❌ Fail

---

## Integration Tests

### Full User Journey

**Scenario**: New user creates their first deck

1. [ ] Land on homepage
2. [ ] Click "Get Started"
3. [ ] See empty deck list
4. [ ] Click "Create New Deck"
5. [ ] Fill out form
6. [ ] Submit form
7. [ ] Redirected to editor (NO 404!)
8. [ ] See deck being generated
9. [ ] Wait 30 seconds
10. [ ] Refresh page
11. [ ] See slides appear
12. [ ] Click "Export PPTX"
13. [ ] See success message
14. [ ] Go back to deck list
15. [ ] See newly created deck

**Status**: ✅ All Steps Pass / ❌ Failed at step: ___

---

## Performance Tests

### Load Times

Acceptable load times:
- Homepage: < 1 second
- Deck list: < 2 seconds
- Create form: < 1 second
- Edit page: < 3 seconds (includes API call)

**Test**:
1. Open DevTools Network tab
2. Load each page
3. Check "Load" time

**Status**: ✅ Pass / ❌ Fail

---

## Browser Compatibility

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Expected**: Works in all browsers

---

## Common Issues & Solutions

### Issue: "Cannot read property 'data'"

**Cause**: API returned error

**Fix**:
```bash
# Check API logs
cd apps/api
# Look for error messages

# Restart API
pnpm dev
```

### Issue: Blank page / white screen

**Cause**: JavaScript error

**Fix**:
1. Open browser console (F12)
2. Look for error messages
3. Check if component files exist
4. Rebuild: `rm -rf .next && pnpm dev`

### Issue: "404 Not Found" on routes

**Cause**: Next.js not rebuilt

**Fix**:
```bash
cd apps/web
rm -rf .next
pnpm dev
```

### Issue: Styles not loading

**Cause**: Tailwind not compiled

**Fix**:
```bash
cd apps/web
rm -rf .next
pnpm dev
```

### Issue: API calls fail with CORS error

**Cause**: API CORS not configured

**Fix**: Already configured in API, shouldn't happen

### Issue: Deck creation hangs

**Cause**: Worker not running

**Fix**:
```bash
cd apps/worker
pnpm dev
```

---

## Test Results Summary

Total Tests: 15
Passed: ___
Failed: ___

**Overall Status**: ✅ Ready for Use / ❌ Needs Fixes

---

## Production Readiness Checklist

Before deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] API endpoints secured
- [ ] Environment variables set
- [ ] Database backed up
- [ ] OpenAI API key configured
- [ ] Error tracking setup
- [ ] Performance optimized
- [ ] Mobile tested
- [ ] Accessibility checked

---

## Quick Diagnostic Commands

```bash
# Check if all services running
docker compose ps

# Check API health
curl http://localhost:4000/health

# Check web server
curl http://localhost:3000

# View API logs
cd apps/api && pnpm dev

# View worker logs
cd apps/worker && pnpm dev

# Check database
docker compose exec postgres psql -U postgres -d slidegen -c "SELECT COUNT(*) FROM \"Deck\";"

# Check Redis
redis-cli -h localhost -p 6379 ping

# Rebuild everything
pnpm clean && pnpm install && pnpm build && pnpm dev
```

---

## Need Help?

1. Check `/api-status` page in the app
2. Review `TROUBLESHOOTING.md`
3. Check Docker logs: `docker compose logs`
4. Review API logs in terminal
5. Open an issue with test results
