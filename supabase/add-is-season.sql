-- goods 테이블에 is_season 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
ALTER TABLE goods ADD COLUMN IF NOT EXISTS is_season BOOLEAN DEFAULT false;
