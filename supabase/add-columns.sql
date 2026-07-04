-- goods 테이블 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
ALTER TABLE goods ADD COLUMN IF NOT EXISTS ohaeng TEXT DEFAULT '해당없음';
ALTER TABLE goods ADD COLUMN IF NOT EXISTS is_season BOOLEAN DEFAULT false;
ALTER TABLE goods ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
