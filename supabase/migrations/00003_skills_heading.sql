-- Actualizar el título de la sección Skills a "Technical Knowledge" / "Conocimientos técnicos"
update translations set value = 'Technical Knowledge' where key = 'skills.title' and language = 'en';
update translations set value = 'Conocimientos técnicos' where key = 'skills.title' and language = 'es';
update translations set value = 'Connaissances techniques' where key = 'skills.title' and language = 'fr';
update translations set value = 'Technische Kenntnisse' where key = 'skills.title' and language = 'de';
update translations set value = 'Технические знания' where key = 'skills.title' and language = 'ru';
