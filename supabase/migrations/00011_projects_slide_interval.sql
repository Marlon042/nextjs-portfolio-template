-- Seed projects_slide_interval in site_config
INSERT INTO site_config (key, value) VALUES ('projects_slide_interval', '4000') ON CONFLICT (key) DO NOTHING;
