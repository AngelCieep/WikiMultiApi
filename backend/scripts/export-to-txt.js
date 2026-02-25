const fs = require('fs');
const path = require('path');
const connectDB = require('../database');
const Universe = require('../models/universe.model');
const Characters = require('../models/characters.model');

// Crear carpeta de salida si no existe
const outputDir = path.join(__dirname, 'exports');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Convierte Map a objeto plano para JSON
 */
function mapToObject(map) {
  if (!map || map.size === 0) return {};
  const obj = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Limpia un documento de Mongoose para exportación JSON
 */
function cleanDocument(doc) {
  const obj = doc.toObject();
  
  // Convertir Maps a objetos
  if (obj.statLabels) {
    obj.statLabels = mapToObject(obj.statLabels);
  }
  if (obj.stats) {
    obj.stats = mapToObject(obj.stats);
  }
  
  return obj;
}

/**
 * Función principal
 */
async function exportData() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Conectado exitosamente\n');
    
    // 1. Obtener todos los universos
    console.log('📚 Obteniendo universos...');
    const universes = await Universe.find({}).sort({ name: 1 });
    console.log(`   Encontrados: ${universes.length} universos\n`);
    
    // 2. Guardar todos los universos en un archivo JSON
    const universesFilePath = path.join(outputDir, 'universes.txt');
    const universesData = universes.map(u => cleanDocument(u));
    fs.writeFileSync(universesFilePath, JSON.stringify(universesData, null, 2), 'utf8');
    console.log(`✅ Universos guardados en: ${universesFilePath}`);
    console.log(`   ${universes.length} universos en formato JSON\n`);
    
    // 3. Para cada universo, obtener sus personajes y guardarlos
    let totalCharacters = 0;
    for (const universe of universes) {
      console.log(`📖 Procesando universo: ${universe.name} (${universe.slug})...`);
      
      const characters = await Characters.find({ universeId: universe._id }).sort({ name: 1 });
      console.log(`   Personajes encontrados: ${characters.length}`);
      
      if (characters.length === 0) {
        console.log(`   ⚠️  Sin personajes, omitiendo archivo\n`);
        continue;
      }
      
      totalCharacters += characters.length;
      
      // Crear archivo JSON para este universo
      const fileName = `characters_${universe.slug}.txt`;
      const filePath = path.join(outputDir, fileName);
      
      const charactersData = characters.map(c => cleanDocument(c));
      fs.writeFileSync(filePath, JSON.stringify(charactersData, null, 2), 'utf8');
      
      console.log(`   ✅ Guardado en: ${filePath}`);
      console.log(`   ${characters.length} personajes en formato JSON\n`);
    }
    
    console.log('╔' + '═'.repeat(78) + '╗');
    console.log('║' + ' '.repeat(25) + '¡EXPORTACIÓN COMPLETA!' + ' '.repeat(31) + '║');
    console.log('╚' + '═'.repeat(78) + '╝');
    console.log(`\n📁 Archivos generados en: ${outputDir}`);
    console.log(`   • 1 archivo de universos (${universes.length} registros)`);
    console.log(`   • ${universes.filter(async u => {
      const chars = await Characters.countDocuments({ universeId: u._id });
      return chars > 0;
    }).length} archivos de personajes (${totalCharacters} registros totales)`);
    console.log(`\n💡 Todos los archivos están en formato JSON válido y listos para importar\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la exportación:', error);
    process.exit(1);
  }
}

// Ejecutar el script
exportData();
