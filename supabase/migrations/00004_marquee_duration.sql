-- Valor por defecto para la velocidad del carrusel de skills
insert into site_config (key, value) values ('marquee_duration', '20000')
on conflict (key) do nothing;
