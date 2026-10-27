-- Storage delete and update first look up the object, so they also need a select rule.
-- Without it, removing a talent's picture through the API did nothing.
-- Reading the pictures themselves still goes through the public bucket URL.

create policy "own pictures: read" on storage.objects for select to authenticated
  using (bucket_id = '{{SUPABASE_STORAGE_BUCKET}}' and (storage.foldername(name))[1] = (select auth.uid())::text);
