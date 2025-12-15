# Supabase Database Cleanup Instructions

## 1. Clear Test Data

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Clear all task logs (keeps table structure)
DELETE FROM task_logs;

-- Reset user metrics to zero (keeps user names and roles)
UPDATE users 
SET 
  total_tasks = 0,
  total_hours_saved = 0,
  avg_efficiency = 0,
  ai_tools_used = '[]',
  engagement_score = 0,
  stats = '[]',
  tasks_target = 10,
  hours_target = 0,
  deadline = NULL,
  completed_writing_tone_blueprint = FALSE
WHERE TRUE;
```

## 2. Update Column Names (if needed)

Check if these columns exist and rename if necessary:

```sql
-- Check current column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Rename columns if they have old names
-- (Run only if the column names don't match)
ALTER TABLE users RENAME COLUMN completed_tone_blueprint TO completed_writing_tone_blueprint;
```

## 3. Add Missing Columns

Add the `time_saved` column to task_logs if it doesn't exist:

```sql
-- Add time_saved column to task_logs
ALTER TABLE task_logs 
ADD COLUMN IF NOT EXISTS time_saved INTEGER DEFAULT 0;

-- Add hours_target and deadline to users if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS hours_target INTEGER DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS deadline TEXT;
```

## 4. Verify User Data

Check that users still have their basic info:

```sql
-- Verify users table
SELECT id, name, role, avatar 
FROM users 
ORDER BY name;
```

## Expected Result:
- All task logs deleted
- User names, roles, and avatars preserved
- All metrics reset to 0
- Writing Tone Blueprint status reset to FALSE

## About the "Kelly" Display

The "Kelly" name in the bottom left corner is the **current user profile section** in the sidebar. This shows:
- The current logged-in user's avatar
- Their name
- Their role (Staff/Owner)

This is intentional and helps users know which account they're viewing the dashboard from. If you want to change which user is shown as "current", you would need to implement a proper authentication system.

For now, it defaults to showing the first user in the array (Vic) based on this code in `App.tsx`:

```typescript
{users.length > 0 && (
  <div className="flex items-center space-x-3">
    <img src={users[0].avatar} alt="Vic" className="w-10 h-10 rounded-full border-2 border-skvarna-yellow" />
    <div>
      <p className="text-sm font-bold text-white">{users[0].name}</p>
      <p className="text-xs text-skvarna-steel">{users[0].role}</p>
    </div>
  </div>
)}
```

To change it to show Kelly instead, change `users[0]` to `users[1]` (or whichever index Kelly is at).
