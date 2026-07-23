-- Actualizar contact.help y contact.subtitle en todos los idiomas

UPDATE translations SET value = 'I''m ready to help you'
WHERE key = 'contact.help' AND language = 'en';

UPDATE translations SET value = 'Je suis prêt à vous aider'
WHERE key = 'contact.help' AND language = 'fr';

UPDATE translations SET value = 'Ich bin bereit, Ihnen zu helfen'
WHERE key = 'contact.help' AND language = 'de';

UPDATE translations SET value = 'Я готов вам помочь'
WHERE key = 'contact.help' AND language = 'ru';

UPDATE translations SET value = 'I build applications designed to solve real needs'
WHERE key = 'contact.subtitle' AND language = 'en';

UPDATE translations SET value = 'Je construis des applications conçues pour répondre à des besoins réels'
WHERE key = 'contact.subtitle' AND language = 'fr';

UPDATE translations SET value = 'Ich entwickle Anwendungen, die echte Bedürfnisse lösen'
WHERE key = 'contact.subtitle' AND language = 'de';

UPDATE translations SET value = 'Я создаю приложения для решения реальных задач'
WHERE key = 'contact.subtitle' AND language = 'ru';
