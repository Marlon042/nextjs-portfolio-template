# 🔥 Guía de Configuración de Firebase para el Formulario de Contacto

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto" o "Add project"
3. Ingresa un nombre para tu proyecto (ej: `portfolio-marlon`)
4. Sigue los pasos del asistente

### 2. Configurar Firestore Database
1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Elige modo de inicio (recomendado: "Modo de prueba")
4. Selecciona la ubicación más cercana (ej: `us-central1`)

### 3. Obtener Credenciales de Configuración
1. En Firebase Console, ve a "Configuración del proyecto" (⚙️)
2. En "Tus aplicaciones", haz clic en "Web" (</>)
3. Registra tu app con un nombre (ej: `Portfolio Web`)
4. Copia las credenciales y reemplázalas en `.env.local`

### 4. Configurar Variables de Entorno
Edita el archivo `.env.local` con tus credenciales reales:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id_real
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id_real
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id_real
```

### 5. Reglas de Seguridad (Opcional pero Recomendado)
En Firestore Database > Reglas, configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactSubmissions/{document} {
      allow read, write: if request.auth != null; // Solo usuarios autenticados
      // O para desarrollo:
      allow read, write: if true; // Permite todo (solo para desarrollo)
    }
  }
}
```

### 6. Probar la Configuración
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Envía un mensaje de prueba desde el formulario
3. Verifica en Firebase Console > Firestore Database que los datos se guardaron

## 🔍 Estructura de Datos Guardados
Cada envío se guarda con esta estructura:
```json
{
  "name": "Nombre del usuario",
  "email": "email@ejemplo.com",
  "subject": "Asunto del mensaje",
  "message": "Contenido del mensaje",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "new"
}
```

## 📧 Opción Avanzada: Envío de Emails
Para recibir notificaciones por email, puedes:
1. Usar **Firebase Functions** con un servicio como SendGrid
2. Configurar **Firebase Extensions** > "Trigger Email"
3. Integrar con **Nodemailer** y un servicio de email

## 🚨 Solución de Problemas Comunes
- **Error de CORS**: Asegúrate de configurar las reglas de seguridad correctamente
- **Credenciales incorrectas**: Verifica que las variables de entorno coincidan exactamente
- **Firestore no inicializado**: Reinicia el servidor después de configurar las variables

## 📊 Monitoreo
Puedes ver los mensajes recibidos en:
- Firebase Console > Firestore Database
- O crear un panel administrativo simple

¡Tu formulario de contacto ahora está listo para recibir mensajes! 🎉