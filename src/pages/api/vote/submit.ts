import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { option, timestamp } = data;

    // URL de tu Google Apps Script
    const GOOGLE_SCRIPT_URL = import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

    console.log('=== VOTO RECIBIDO ===');
    console.log('Opción:', option);
    console.log('Timestamp:', timestamp);
    console.log('URL de Google Script:', GOOGLE_SCRIPT_URL ? 'Configurada' : 'NO CONFIGURADA');

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('TU_URL_AQUI')) {
      console.warn('⚠️ GOOGLE_SHEETS_WEBHOOK_URL no está configurada correctamente');
      return new Response(JSON.stringify({ success: true, message: 'Voto registrado localmente (sin Google Sheets)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Preparar datos para enviar como parámetros de URL (para evitar problemas con redirects)
    const params = new URLSearchParams({
      option,
      timestamp: new Date(timestamp).toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    const urlWithParams = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    console.log('Enviando a Google Sheets:', urlWithParams);

    // Enviar datos a Google Sheets usando GET para evitar problemas con redirects
    const response = await fetch(urlWithParams, {
      method: 'GET',
      redirect: 'follow'
    });

    const responseText = await response.text();
    console.log('Respuesta de Google Script (status):', response.status);
    console.log('Respuesta de Google Script (body):', responseText);

    if (!response.ok) {
      console.error('❌ Error al enviar a Google Sheets:', response.status, responseText);
      throw new Error('Error al enviar a Google Sheets');
    }

    console.log('✅ Voto enviado exitosamente a Google Sheets');
    return new Response(JSON.stringify({ success: true, message: 'Voto registrado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error procesando voto:', error);
    // Retornar éxito para no bloquear la experiencia del usuario
    return new Response(JSON.stringify({ success: true, message: 'Voto procesado (con error en segundo plano)' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
