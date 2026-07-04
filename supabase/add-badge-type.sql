-- content_settings 테이블에 badge_type 컬럼 추가
ALTER TABLE content_settings ADD COLUMN IF NOT EXISTS badge_type TEXT DEFAULT '무료';
