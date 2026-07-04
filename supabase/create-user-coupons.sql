CREATE TABLE IF NOT EXISTS user_coupons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  discount_amount INT NOT NULL,
  min_price INT DEFAULT 0,
  target_service TEXT DEFAULT 'all',
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_own" ON user_coupons FOR ALL USING (true);
