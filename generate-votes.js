// Script para generar votos aleatorios en Google Sheets
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwtRCl9OjUT9ZiG4dGYVELDFgrGPnWeh6um2XLJxfnQ8hkV9iGRQ50yIu17VXUugq14/exec';

// Configuración: 169 votos con ganador para Opción A (por poco)
const TOTAL_VOTES = 169;
const VOTES_A = 86;  // Opción A: 86 votos (50.9%)
const VOTES_B = 83;  // Opción B: 83 votos (49.1%)

const userAgents = [
  // Windows 10
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  
  // Windows 11
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
  
  // macOS - Safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
  
  // macOS - Chrome
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  
  // macOS - Firefox
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0',
  
  // macOS - Brave
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120.0.0.0',
  
  // iPhone iOS 16-26
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 20_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/20.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 21_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/21.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 22_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/22.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 23_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/23.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  
  // iPad
  'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  
  // Android - Samsung
  'Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  
  // Android - Xiaomi
  'Mozilla/5.0 (Linux; Android 13; Xiaomi 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Redmi Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Mi 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
  
  // Android - Oppo
  'Mozilla/5.0 (Linux; Android 13; OPPO CPH2451) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; OPPO Find X5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  
  // Android - Honor
  'Mozilla/5.0 (Linux; Android 13; HONOR 90) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; HONOR X8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  
  // Android - Motorola
  'Mozilla/5.0 (Linux; Android 13; moto g84 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; motorola edge 30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  
  // Android - Alcatel
  'Mozilla/5.0 (Linux; Android 11; Alcatel 3X 2020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; Alcatel 1S) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
  
  // Android - Generic/Unknown
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
  
  // Brave Browser
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.60',
  
  // Unknown/Generic
  'Unknown Device',
  'Mozilla/5.0 (compatible; Bot/1.0)',
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomTimestamp() {
  // Obtener la fecha de ayer
  const now = new Date();
  now.setDate(now.getDate() - 1); // Restar 1 día
  
  // Crear fechas para ayer a las 7:40 AM y 23:59 PM
  const startTime = new Date(now);
  startTime.setHours(7, 40, 0, 0);
  
  const endTime = new Date(now);
  endTime.setHours(23, 59, 0, 0);
  
  const randomTime = startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime());
  const date = new Date(randomTime);
  
  // Formato manual: M/D/YYYY H:mm:ss
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

async function sendVote(option, timestamp, userAgent) {
  const params = new URLSearchParams({
    option,
    timestamp,
    userAgent
  });
  
  const url = `${WEBHOOK_URL}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error enviando voto ${option}:`, error.message);
    return null;
  }
}

async function generateVotes() {
  console.log('🗳️  Iniciando generación de votos...');
  console.log(`📊 Total: ${TOTAL_VOTES} votos`);
  console.log(`🅰️  Opción A: ${VOTES_A} votos`);
  console.log(`🅱️  Opción B: ${VOTES_B} votos`);
  console.log('');

  // Crear array con todos los votos
  const allVotes = [
    ...Array(VOTES_A).fill('a'),
    ...Array(VOTES_B).fill('b')
  ];

  // Mezclar aleatoriamente
  allVotes.sort(() => Math.random() - 0.5);

  let successCount = 0;
  let errorCount = 0;

  // Enviar votos en grupos para no saturar
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < allVotes.length; i += BATCH_SIZE) {
    const batch = allVotes.slice(i, i + BATCH_SIZE);
    const promises = batch.map((option) => 
      sendVote(option, getRandomTimestamp(), getRandomUserAgent())
    );
    
    const results = await Promise.all(promises);
    
    results.forEach((result, index) => {
      if (result && result.success) {
        successCount++;
        process.stdout.write('✅');
      } else {
        errorCount++;
        process.stdout.write('❌');
      }
    });
    
    // Pequeña pausa entre lotes
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n');
  console.log('=========================');
  console.log('📈 Resumen:');
  console.log(`✅ Votos exitosos: ${successCount}`);
  console.log(`❌ Votos fallidos: ${errorCount}`);
  console.log(`🏆 Ganador: Opción A con ${VOTES_A} votos (${((VOTES_A/TOTAL_VOTES)*100).toFixed(1)}%)`);
  console.log('=========================');
}

// Ejecutar
generateVotes().catch(console.error);
