-- 천기캐시 시스템
-- Supabase SQL Editor에서 실행하세요

-- 유저 캐시 잔액
CREATE TABLE IF NOT EXISTS user_cash (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INT DEFAULT 0,
  total_charged INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 캐시 거래 내역
CREATE TABLE IF NOT EXISTS cash_transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- charge, use, gift_send, gift_receive, refund, bonus
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  description TEXT,
  service_id TEXT, -- 사용시 어떤 서비스에 썼는지
  gift_code TEXT, -- 선물 코드
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 선물 코드
CREATE TABLE IF NOT EXISTS gift_codes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  amount INT NOT NULL,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active', -- active, used, expired
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE user_cash ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cash_own" ON user_cash FOR ALL USING (true);
CREATE POLICY "transactions_own" ON cash_transactions FOR ALL USING (true);
CREATE POLICY "gifts_all" ON gift_codes FOR ALL USING (true);
