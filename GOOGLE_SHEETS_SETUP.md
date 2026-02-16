# Configuración de Google Sheets para Votación

## Paso 1: Crear una hoja de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Votaciones Colegio Militarizado" o el nombre que prefieras
4. En la primera fila, agrega estos encabezados:
   - A1: `Fecha y Hora`
   - B1: `Opción`
   - C1: `User Agent`
   - D1: `Timestamp`

## Paso 2: Crear el Google Apps Script

1. En tu hoja de Google Sheets, ve a **Extensiones** > **Apps Script**
2. Borra cualquier código que aparezca por defecto
3. Copia y pega el siguiente código:

```javascript
function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }
    
    // Preparar los datos para insertar
    var fecha = new Date(data.timestamp || Date.now());
    var opcion = data.option === 'a' ? 'Opción A (Nuevo)' : 'Opción B (Antiguo)';
    var userAgent = data.userAgent || 'Desconocido';
    var timestamp = data.timestamp || Date.now();
    
    // Agregar una nueva fila con los datos
    sheet.appendRow([
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
      opcion,
      userAgent,
      timestamp
    ]);
    
    // Retornar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Voto registrado' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar error
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Guarda el proyecto con el nombre "Webhook Votación"

## Paso 3: Implementar el Script como Web App

1. Haz clic en el botón **Implementar** (o **Deploy**) > **Nueva implementación**
2. Haz clic en el icono de engranaje ⚙️ junto a "Seleccionar tipo"
3. Selecciona **Aplicación web**
4. Configura lo siguiente:
   - **Descripción**: "Webhook para votaciones"
   - **Ejecutar como**: "Yo" (tu cuenta)
   - **Quién tiene acceso**: "Cualquier persona" (Anyone)
5. Haz clic en **Implementar**
6. **IMPORTANTE**: Copia la URL que aparece (será algo como: `https://script.google.com/macros/s/AKfycby.../exec`)
7. Autoriza los permisos que Google te solicite

## Paso 4: Configurar la URL en tu proyecto

1. En tu proyecto, crea un archivo `.env` en la raíz (si no existe)
2. Agrega la siguiente línea con la URL que copiaste:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
```

## Paso 5: Probar la integración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Realiza una votación en tu sitio web
3. Revisa tu hoja de Google Sheets para verificar que se haya registrado el voto

## Notas Importantes

- Los votos se envían a Google Sheets, pero también siguen guardándose localmente en el navegador
- Si el webhook de Google Sheets falla, la votación seguirá funcionando localmente
- Puedes ver estadísticas en tiempo real directamente en tu hoja de Google Sheets
- Para actualizar el script, haz una nueva implementación en Apps Script

## Solución de Problemas

### No se registran los votos
- Verifica que la URL del webhook esté correctamente configurada en `.env`
- Asegúrate de que el script esté implementado como "Cualquier persona" puede acceder
- Revisa la consola del navegador en busca de errores

### Error de permisos
- Ve a Apps Script > Implementaciones > Editar
- Cambia "Quién tiene acceso" a "Cualquier persona"
- Guarda los cambios

### Quiero ver más detalles
- En Google Sheets, puedes crear gráficas con los datos
- Agrega columnas adicionales según necesites
- Usa fórmulas de Sheets para análisis avanzado
