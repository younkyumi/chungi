-- seasons 테이블 생성
-- Supabase SQL Editor에서 실행하세요
CREATE TABLE IF NOT EXISTS seasons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  product_ids INTEGER[] DEFAULT '{}'
);

-- RLS
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seasons_public_read" ON seasons FOR SELECT USING (true);
