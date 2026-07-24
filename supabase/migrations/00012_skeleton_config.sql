-- Seed skeleton settings in site_config
INSERT INTO site_config (key, value) VALUES ('skeleton_style', '"shimmer"') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('skeleton_delay', '2000') ON CONFLICT (key) DO NOTHING;
