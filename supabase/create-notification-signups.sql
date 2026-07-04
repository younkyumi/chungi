CREATE TABLE IF NOT EXISTS notification_signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  notify_method TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE notification_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signups_public_all" ON notification_signups FOR ALL USING (true);
