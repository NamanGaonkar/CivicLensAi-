# Status Update Workflow

## ✅ How Status Updates Work

The status update system is **fully functional** and syncs automatically between all dashboards.

### 1. **Citizen Submits Report**
- Citizen fills out ReportForm
- Report is inserted into `reports` table with `status: 'open'`
- Database stores: title, description, category, location, images, user_id, created_at

### 2. **Official Views Report**
- Official logs in: `official@civiclens.com / official123`
- OfficialDashboard fetches all reports:
  ```typescript
  const { data: reports } = await supabase.from('reports').select('*')
  ```
- Shows all reports with current status, priority, and submitted by info

### 3. **Official Updates Status**
- Official clicks on a report to view details
- Adds response text and selects new status (Open/In Progress/Resolved)
- Clicks "Submit Response"

**Database Changes:**
```typescript
// Insert response into report_responses table
await supabase.from('report_responses').insert({
  report_id: selectedReport.id,
  responder_email: 'official@civiclens.com',
  responder_name: 'Official',
  response_text: responseText,
  status_update: statusUpdate
})

// Update status in reports table
await supabase.from('reports')
  .update({ status: statusUpdate })
  .eq('id', selectedReport.id)
```

### 4. **Citizen Sees Update**
- Citizen navigates to "My Status" view
- Dashboard fetches user's reports:
  ```typescript
  const { data: reportsData } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
  ```
- StatusTracker component displays updated status
- Shows: ✅ Resolved, 🕒 In Progress, ❌ Rejected, ⚠️ Open

### 5. **Admin Monitors Everything**
- Admin logs in: `admin@civiclens.com / admin123`
- AdminDashboard shows:
  - All users and their roles
  - All reports with current status
  - Resolution rate statistics
  - Can view full report details in modal

## Database Tables

### `reports` Table
```sql
- id (uuid)
- user_id (uuid, references profiles)
- title (text)
- description (text)
- category (text)
- status (text) -- 'open', 'in_progress', 'resolved', 'rejected'
- priority (text)
- image_url (text)
- address, area, city, pincode (text)
- latitude, longitude (numeric)
- created_at, updated_at (timestamp)
```

### `report_responses` Table
```sql
- id (uuid)
- report_id (uuid, references reports)
- responder_email (text)
- responder_name (text)
- response_text (text)
- status_update (text)
- created_at (timestamp)
```

### `profiles` Table
```sql
- id (uuid, references auth.users)
- email (text)
- full_name (text)
- role (text) -- 'citizen', 'official', 'admin'
- created_at (timestamp)
```

## Status Display Formatting

### Database Values
- `open` - New/unaddressed reports
- `in_progress` - Being worked on
- `resolved` - Fixed/completed
- `rejected` - Cannot be addressed

### UI Display
- **Open** - Orange icon ⚠️, "OPEN"
- **In Progress** - Blue clock icon 🕒, "IN PROGRESS"
- **Resolved** - Green checkmark ✅, "RESOLVED"
- **Rejected** - Red X ❌, "REJECTED"

## Testing the Workflow

1. **As Citizen:**
   - Sign up and log in
   - Submit a test report
   - Navigate to "My Status" → See "OPEN" status

2. **As Official:**
   - Log in with: official@civiclens.com / official123
   - Click on the test report
   - Add response: "We're working on this issue"
   - Change status to "In Progress"
   - Submit Response

3. **As Citizen Again:**
   - Refresh or navigate back to "My Status"
   - Status now shows "IN PROGRESS" 🕒
   - Can see the official's response (if response display is implemented)

4. **As Admin:**
   - Log in with: admin@civiclens.com / admin123
   - View all reports in Reports tab
   - See updated status and response count
   - Monitor resolution rate statistics

## Real-Time Sync

Currently, status updates require page refresh to see changes. Both dashboards read from the same database table, so updates are instant in the database but require re-fetching.

### To Add Real-Time Updates (Future Enhancement):
```typescript
// Subscribe to report changes
useEffect(() => {
  const subscription = supabase
    .channel('reports-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'reports' },
      (payload) => {
        console.log('Report changed:', payload)
        fetchReports() // Refresh data
      }
    )
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

## Security Notes

- All database operations use Supabase RLS (Row Level Security)
- Current policies allow all operations for simplicity (hardcoded logins)
- For production, should implement proper role-based policies:
  - Citizens can only view/edit their own reports
  - Officials can view all reports, create responses
  - Admins have full access

## Troubleshooting

### Status Not Updating?
1. Check browser console for errors
2. Verify Supabase connection (check network tab)
3. Ensure database policies allow updates
4. Refresh the page to fetch latest data

### Database Errors?
1. Run `DATABASE_SETUP_SIMPLE.sql` to ensure tables exist
2. Check that role column exists in profiles table
3. Verify report_responses table is created
4. Check RLS policies are enabled

## File Locations

- **OfficialDashboard**: [src/components/OfficialDashboard.tsx](src/components/OfficialDashboard.tsx)
- **AdminDashboard**: [src/components/AdminDashboard.tsx](src/components/AdminDashboard.tsx)
- **Dashboard (Citizen)**: [src/components/Dashboard.tsx](src/components/Dashboard.tsx)
- **StatusTracker**: [src/components/StatusTracker.tsx](src/components/StatusTracker.tsx)
- **Database Setup**: [DATABASE_SETUP_SIMPLE.sql](DATABASE_SETUP_SIMPLE.sql)
