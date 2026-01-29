-- Create a trigger to auto-create a `profiles` row when a new auth.users row is inserted.
-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New Query).

-- Note: This runs as a database-level trigger and bypasses client RLS checks.
-- It safely inserts a minimal profile record for every newly created auth user.

create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, role, created_at, updated_at)
  values (new.id, new.email, 'citizen', now(), now())
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Optional: verify by selecting from profiles after creating a user
-- select * from public.profiles where id = '<new-user-uuid>';
