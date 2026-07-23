-- Seed skills_display_mode in site_config
INSERT INTO site_config (key, value) VALUES ('skills_display_mode', '"marquee"') ON CONFLICT (key) DO NOTHING;
