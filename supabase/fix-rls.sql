-- RLS policies for admin operations
-- NOTE: In production, restrict these to authenticated admin users only.
-- For now, allow public access for development.

-- Goods table policies
CREATE POLICY "goods_public_update" ON goods FOR UPDATE USING (true);
CREATE POLICY "goods_public_insert" ON goods FOR INSERT WITH CHECK (true);
CREATE POLICY "goods_public_delete" ON goods FOR DELETE USING (true);

-- Seasons table policies
CREATE POLICY "seasons_public_all" ON seasons FOR ALL USING (true);
