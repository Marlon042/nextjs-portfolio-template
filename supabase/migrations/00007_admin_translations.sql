-- Admin panel sidebar translations (Spanish)
-- Keys use English words as fallback when no translation exists

INSERT INTO translations (key, language, value) VALUES
  ('Admin Panel', 'es', 'Panel de Administración'),
  ('Dashboard', 'es', 'Panel Principal'),
  ('Projects', 'es', 'Proyectos'),
  ('Sections', 'es', 'Secciones'),
  ('Skills', 'es', 'Habilidades'),
  ('Icons', 'es', 'Iconos'),
  ('Testimonials', 'es', 'Testimonios'),
  ('Translations', 'es', 'Traducciones'),
  ('Settings', 'es', 'Configuración'),
  ('Sign Out', 'es', 'Cerrar Sesión')
ON CONFLICT (key, language) DO NOTHING;
