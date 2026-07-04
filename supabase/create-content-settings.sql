CREATE TABLE IF NOT EXISTS content_settings (
  content_id TEXT PRIMARY KEY,
  name TEXT,
  price INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_preparing BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE content_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_settings_public_read" ON content_settings FOR SELECT USING (true);
CREATE POLICY "content_settings_public_write" ON content_settings FOR ALL USING (true);
