-- ============================================================
-- 호환 ALTER (chungi_db_full00.sql 실행 후, supplement.sql / supplement2.sql 실행 전 한 번 실행)
-- 목적: full00의 풍부한 스키마와 supplement 들의 단순 INSERT 컬럼명을 양립시킴
-- 4개 테이블 (dream_interpretations / taemong / ilju_60 / tarot_cards)
-- ============================================================

-- ─── dream_interpretations 호환 ────────────────────────────
ALTER TABLE dream_interpretations ADD COLUMN IF NOT EXISTS keyword             TEXT;
ALTER TABLE dream_interpretations ADD COLUMN IF NOT EXISTS category            TEXT;
ALTER TABLE dream_interpretations ADD COLUMN IF NOT EXISTS traditional_meaning TEXT;
ALTER TABLE dream_interpretations ADD COLUMN IF NOT EXISTS modern_meaning      TEXT;
ALTER TABLE dream_interpretations ADD COLUMN IF NOT EXISTS is_lucky            BOOLEAN;
ALTER TABLE dream_interpretations ALTER COLUMN keywords    DROP NOT NULL;
ALTER TABLE dream_interpretations ALTER COLUMN title       DROP NOT NULL;
ALTER TABLE dream_interpretations ALTER COLUMN short_desc  DROP NOT NULL;

-- ─── taemong 호환 ───────────────────────────────────────────
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS symbol           TEXT;
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS category         TEXT;
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS child_trait      TEXT;
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS career_aptitude  TEXT;
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS gender_hint      TEXT;
ALTER TABLE taemong ADD COLUMN IF NOT EXISTS is_lucky         BOOLEAN;
ALTER TABLE taemong ALTER COLUMN keywords DROP NOT NULL;
ALTER TABLE taemong ALTER COLUMN title    DROP NOT NULL;
ALTER TABLE taemong ALTER COLUMN result   DROP NOT NULL;

-- ─── ilju_60 호환 ──────────────────────────────────────────
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS ilju             TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS hanzi            TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS nabaum_o5        TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS strength         TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS weakness         TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS love_style       TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS health_weakness  TEXT;
ALTER TABLE ilju_60 ADD COLUMN IF NOT EXISTS wealth_style     TEXT;
ALTER TABLE ilju_60 ALTER COLUMN heavenly_stem  DROP NOT NULL;
ALTER TABLE ilju_60 ALTER COLUMN earthly_branch DROP NOT NULL;
ALTER TABLE ilju_60 ALTER COLUMN name_ko        DROP NOT NULL;
-- UNIQUE(heavenly_stem, earthly_branch) 제거 (supplement INSERT는 이 컬럼들에 값을 안 넣음)
ALTER TABLE ilju_60 DROP CONSTRAINT IF EXISTS ilju_60_heavenly_stem_earthly_branch_key;

-- ─── tarot_cards 호환 ──────────────────────────────────────
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS card_name      TEXT;
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS number         INTEGER;
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS upright_yesno  TEXT;
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS reversed_yesno TEXT;
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS keywords       TEXT;
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS element        TEXT;
ALTER TABLE tarot_cards ALTER COLUMN card_id     DROP NOT NULL;
ALTER TABLE tarot_cards ALTER COLUMN name_joseon DROP NOT NULL;
ALTER TABLE tarot_cards ALTER COLUMN name_en     DROP NOT NULL;
ALTER TABLE tarot_cards ALTER COLUMN display_ko  DROP NOT NULL;
-- UNIQUE(card_id) 제거
ALTER TABLE tarot_cards DROP CONSTRAINT IF EXISTS tarot_cards_card_id_key;

-- ============================================================
-- 위 ALTER 후 supplement.sql / supplement2.sql 그대로 실행 가능
-- ============================================================
