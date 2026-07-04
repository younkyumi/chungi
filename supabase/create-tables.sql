-- ============================================
-- CHUNGI 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. users (회원)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '👤',
  provider TEXT DEFAULT 'email',          -- email, kakao, google
  blood TEXT,                              -- A, B, O, AB
  ddi TEXT,                                -- 띠 (쥐, 소, 호랑이 ...)
  zodiac TEXT,                             -- 별자리
  gijildo TEXT,                            -- 기질도 (화형, 수형 ...)
  birth_year INT,
  birth_month INT,
  birth_day INT,
  tags TEXT[] DEFAULT '{}',                -- VVIP, MVP, VIP, 파워유저, 굿즈구매, 신규
  inflow TEXT,                             -- 유입 경로
  total_paid INT DEFAULT 0,
  point INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_visit TIMESTAMPTZ DEFAULT now()
);

-- 2. contents_history (콘텐츠 이용 기록)
CREATE TABLE IF NOT EXISTS contents_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL,                -- 관상짤, 사주, 연애운, 타로 ...
  service_name TEXT NOT NULL,
  input_data JSONB DEFAULT '{}',           -- 입력값 (이름, 생년월일 등)
  result_data JSONB DEFAULT '{}',          -- 분석 결과
  price INT DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. goods (굿즈 상품)
CREATE TABLE IF NOT EXISTS goods (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🎁',
  category TEXT NOT NULL,                  -- 오행보완, 12영수형, 미니부적, 별자리, 혈액형 ...
  price INT NOT NULL,
  original_price INT,
  sale_percent INT DEFAULT 0,
  description TEXT,
  tags TEXT[] DEFAULT '{}',                -- 추천, 인기, 신상 ...
  color TEXT,                              -- UI 배경색
  stock INT DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  ohaeng TEXT,                             -- 연관 오행
  ddi TEXT,                                -- 연관 띠
  ytype TEXT,                              -- 연관 영수형
  zodiac TEXT,                             -- 연관 별자리
  blood TEXT,                              -- 연관 혈액형
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. orders (주문/결제)
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL DEFAULT 'goods', -- goods, content
  items JSONB NOT NULL DEFAULT '[]',        -- [{goods_id, name, price, qty}]
  total_price INT NOT NULL,
  discount INT DEFAULT 0,
  coupon_id BIGINT,
  payment_method TEXT DEFAULT 'kakao',      -- kakao, card, toss, naver
  status TEXT DEFAULT 'paid',               -- paid, cancelled, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. coupons (쿠폰)
CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent',     -- percent, fixed
  discount_value INT NOT NULL,              -- 퍼센트 or 고정금액
  target TEXT DEFAULT 'all',                -- all, goods, content
  min_price INT DEFAULT 0,
  max_uses INT DEFAULT 0,                   -- 0 = 무제한
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. share_badges (공유 뱃지/업적)
CREATE TABLE IF NOT EXISTS share_badges (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,                 -- kakao, instagram, twitter, link
  service_id TEXT,                          -- 공유한 콘텐츠
  shared_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contents_history_user ON contents_history(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_history_service ON contents_history(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_goods_category ON goods(category);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_share_badges_user ON share_badges(user_id);

-- ============================================
-- RLS (Row Level Security) 활성화
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_badges ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 (goods, coupons)
CREATE POLICY "goods_public_read" ON goods FOR SELECT USING (true);
CREATE POLICY "coupons_public_read" ON coupons FOR SELECT USING (is_active = true);

-- 로그인 사용자 본인 데이터 접근
CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "history_own" ON contents_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "orders_own" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "badges_own" ON share_badges FOR ALL USING (auth.uid() = user_id);
