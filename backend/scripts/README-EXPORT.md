# Export to TXT Script

## Descripción
Este script escanea todos los universos y personajes de la base de datos MongoDB y los exporta a archivos TXT en formato JSON, listos para ser importados nuevamente a la base de datos.

## Archivos generados

### 1. `universes.txt`
Array JSON con todos los universos de la base de datos. Contiene:
- Toda la información del modelo Universe
- Maps convertidos a objetos planos (statLabels)
- Formato JSON indentado (2 espacios) para legibilidad

### 2. `characters_{slug}.txt`
Un archivo por cada universo que contenga personajes, con el formato:
- `characters_pokemon.txt`
- `characters_breaking-bad.txt`
- etc.

Cada archivo contiene:
- Array JSON con todos los personajes de ese universo
- Maps convertidos a objetos planos (stats)
- Formato JSON indentado (2 espacios)

## Uso

### Opción 1: Con npm script
```bash
cd backend
npm run export
```

### Opción 2: Directamente con Node
```bash
cd backend
node scripts/export-to-txt.js
```

## Ubicación de salida
Los archivos se guardan en:
```
backend/scripts/exports/
├── universes.txt (JSON array)
├── characters_pokemon.txt (JSON array)
├── characters_breaking-bad.txt (JSON array)
└── ...
```

## Importación a MongoDB

Para importar los datos de vuelta a la base de datos:

```javascript
// Ejemplo con universes.txt
const fs = require('fs');
const Universe = require('./models/universe.model');

const data = JSON.parse(fs.readFileSync('./scripts/exports/universes.txt', 'utf8'));
await Universe.insertMany(data);
```

O usando mongoimport:
```bash
mongoimport --uri="your-connection-string" --collection=universos --file=universes.txt --jsonArray
```

## Requisitos
- Conexión activa a la base de datos MongoDB
- Variables de entorno configuradas (MONGODB_URI)

## Notas
- Si un universo no tiene personajes, no se genera su archivo
- Los archivos se sobrescriben en cada ejecución
- La carpeta `exports/` se crea automáticamente si no existe
- Los Maps de Mongoose se convierten automáticamente a objetos planos
- El formato JSON es válido y puede parsearse directamente con `JSON.parse()`
