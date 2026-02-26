import type { PersonajeCard, PersonajeDetail, UniversoCard, UniversoDetail } from './index';

// Utilidad para validar tipos básicos
const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Validador de PersonajeCard
export function validatePersonajeCard(data: unknown): PersonajeCard {
  if (!isObject(data)) {
    throw new Error('Los datos del personaje deben ser un objeto');
  }

  if (!isString(data._id) || data._id.trim() === '') {
    throw new Error('El personaje debe tener un ID válido');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('El personaje debe tener un nombre válido');
  }

  if (!isString(data.universeId) || data.universeId.trim() === '') {
    throw new Error('El personaje debe tener un universeId válido');
  }

  // Campos opcionales con validación de tipo
  if (data.title !== undefined && data.title !== null && !isString(data.title)) {
    throw new Error('El título del personaje debe ser una cadena de texto');
  }

  if (data.image !== undefined && data.image !== null && !isString(data.image)) {
    throw new Error('La imagen del personaje debe ser una URL válida');
  }

  if (data.booleanField !== undefined && !isBoolean(data.booleanField)) {
    throw new Error('El campo booleanField debe ser un valor booleano');
  }

  if (data.views !== undefined && !isNumber(data.views)) {
    throw new Error('Las vistas del personaje deben ser un número');
  }

  if (data.createdAt !== undefined && !isString(data.createdAt)) {
    throw new Error('La fecha de creación debe ser una cadena de texto');
  }

  if (data.updatedAt !== undefined && !isString(data.updatedAt)) {
    throw new Error('La fecha de actualización debe ser una cadena de texto');
  }

  return data as unknown as PersonajeCard;
}

// Validador de PersonajeDetail
export function validatePersonajeDetail(data: unknown): PersonajeDetail {
  if (!isObject(data)) {
    throw new Error('Los datos detallados del personaje deben ser un objeto');
  }

  if (!isString(data._id) || data._id.trim() === '') {
    throw new Error('El personaje debe tener un ID válido');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('El personaje debe tener un nombre válido');
  }

  if (!isString(data.universeId) || data.universeId.trim() === '') {
    throw new Error('El personaje debe tener un universeId válido');
  }

  // Validar campos opcionales
  if (data.title !== undefined && data.title !== null && !isString(data.title)) {
    throw new Error('El título debe ser una cadena de texto');
  }

  if (data.image !== undefined && data.image !== null && !isString(data.image)) {
    throw new Error('La imagen debe ser una URL válida');
  }

  if (data.booleanField !== undefined && !isBoolean(data.booleanField)) {
    throw new Error('El campo booleanField debe ser booleano');
  }

  if (data.views !== undefined && !isNumber(data.views)) {
    throw new Error('Las vistas deben ser un número');
  }

  // Validar description como string
  if (data.description !== undefined && data.description !== null && !isString(data.description)) {
    throw new Error('La descripción debe ser una cadena de texto');
  }

  // Validar descriptionSections como array de objetos
  if (data.descriptionSections !== undefined && data.descriptionSections !== null) {
    if (!isArray(data.descriptionSections)) {
      throw new Error('descriptionSections debe ser un array');
    }
    (data.descriptionSections as unknown[]).forEach((section, index) => {
      if (!isObject(section)) {
        throw new Error(`La sección ${index} de descriptionSections debe ser un objeto`);
      }
      // Los campos sectionTitle y content son opcionales en DescriptionSection
      if (section.sectionTitle !== undefined && !isString(section.sectionTitle)) {
        throw new Error(`La sección ${index} debe tener un sectionTitle de tipo string`);
      }
      if (section.content !== undefined && !isString(section.content)) {
        throw new Error(`La sección ${index} debe tener un content de tipo string`);
      }
    });
  }

  // Validar arrays de strings
  const arrayFields = ['abilities', 'weaknesses', 'allies', 'enemies'];
  arrayFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      if (!isArray(data[field])) {
        throw new Error(`${field} debe ser un array`);
      }
      (data[field] as unknown[]).forEach((item, index) => {
        if (!isString(item)) {
          throw new Error(`Todos los elementos de ${field} deben ser cadenas de texto (error en índice ${index})`);
        }
      });
    }
  });

  // Validar campos numéricos
  const numericFields = ['powerLevel', 'age', 'height', 'weight'];
  numericFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null && !isNumber(data[field])) {
      throw new Error(`${field} debe ser un número`);
    }
  });

  // Validar fechas
  if (data.createdAt !== undefined && !isString(data.createdAt)) {
    throw new Error('createdAt debe ser una cadena de texto');
  }

  if (data.updatedAt !== undefined && !isString(data.updatedAt)) {
    throw new Error('updatedAt debe ser una cadena de texto');
  }

  return data as unknown as PersonajeDetail;
}

// Validador de UniversoCard
export function validateUniversoCard(data: unknown): UniversoCard {
  if (!isObject(data)) {
    throw new Error('Los datos del universo deben ser un objeto');
  }

  if (!isString(data._id) || data._id.trim() === '') {
    throw new Error('El universo debe tener un ID válido');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('El universo debe tener un nombre válido');
  }

  // Campos opcionales
  if (data.backgroundImage !== undefined && data.backgroundImage !== null && !isString(data.backgroundImage)) {
    throw new Error('backgroundImage debe ser una URL válida');
  }

  if (data.primaryColor !== undefined && data.primaryColor !== null && !isString(data.primaryColor)) {
    throw new Error('primaryColor debe ser una cadena de texto');
  }

  if (data.isActive !== undefined && !isBoolean(data.isActive)) {
    throw new Error('isActive debe ser un valor booleano');
  }

  if (data.popularityScore !== undefined && !isNumber(data.popularityScore)) {
    throw new Error('popularityScore debe ser un número');
  }

  if (data.createdAt !== undefined && !isString(data.createdAt)) {
    throw new Error('createdAt debe ser una cadena de texto');
  }

  if (data.updatedAt !== undefined && !isString(data.updatedAt)) {
    throw new Error('updatedAt debe ser una cadena de texto');
  }

  return data as unknown as UniversoCard;
}

// Validador de UniversoDetail
export function validateUniversoDetail(data: unknown): UniversoDetail {
  if (!isObject(data)) {
    throw new Error('Los datos detallados del universo deben ser un objeto');
  }

  if (!isString(data._id) || data._id.trim() === '') {
    throw new Error('El universo debe tener un ID válido');
  }

  if (!isString(data.name) || data.name.trim() === '') {
    throw new Error('El universo debe tener un nombre válido');
  }

  // Campos opcionales pero validados si existen
  if (data.description !== undefined && data.description !== null && !isString(data.description)) {
    throw new Error('description debe ser una cadena de texto');
  }

  if (data.backgroundImage !== undefined && data.backgroundImage !== null && !isString(data.backgroundImage)) {
    throw new Error('backgroundImage debe ser una URL válida');
  }

  if (data.logo !== undefined && data.logo !== null && !isString(data.logo)) {
    throw new Error('logo debe ser una URL válida');
  }

  if (data.primaryColor !== undefined && data.primaryColor !== null && !isString(data.primaryColor)) {
    throw new Error('primaryColor debe ser un código de color válido');
  }

  if (data.isActive !== undefined && !isBoolean(data.isActive)) {
    throw new Error('isActive debe ser un valor booleano');
  }

  if (data.popularityScore !== undefined && !isNumber(data.popularityScore)) {
    throw new Error('popularityScore debe ser un número');
  }

  if (data.releaseDate !== undefined && !isString(data.releaseDate)) {
    throw new Error('releaseDate debe ser una cadena de texto');
  }

  if (data.createdAt !== undefined && !isString(data.createdAt)) {
    throw new Error('createdAt debe ser una cadena de texto');
  }

  if (data.updatedAt !== undefined && !isString(data.updatedAt)) {
    throw new Error('updatedAt debe ser una cadena de texto');
  }

  return data as unknown as UniversoDetail;
}

// Validador de respuestas de API
export function validateAPIResponse<T>(
  data: unknown,
  validator: (item: unknown) => T
): { status: T[]; count?: number } {
  if (!isObject(data)) {
    throw new Error('La respuesta de la API debe ser un objeto');
  }

  if (!('status' in data)) {
    throw new Error('La respuesta de la API debe contener un campo "status"');
  }

  if (!isArray(data.status)) {
    // Si status no es un array, podría ser un objeto único
    if (isObject(data.status)) {
      return { status: [validator(data.status)] };
    }
    throw new Error('El campo "status" debe ser un array o un objeto');
  }

  // Validar cada elemento del array
  const validatedItems = data.status.map((item, index) => {
    try {
      return validator(item);
    } catch (error) {
      throw new Error(
        `Error en el elemento ${index} de la respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  });

  return {
    status: validatedItems,
    count: isNumber(data.count) ? data.count : undefined
  };
}

// Validador de respuesta única
export function validateSingleAPIResponse<T>(
  data: unknown,
  validator: (item: unknown) => T
): { status: T } {
  if (!isObject(data)) {
    throw new Error('La respuesta de la API debe ser un objeto');
  }

  if (!('status' in data)) {
    throw new Error('La respuesta de la API debe contener un campo "status"');
  }

  if (!isObject(data.status) && !isArray(data.status)) {
    throw new Error('El campo "status" debe ser un objeto o un array');
  }

  return { status: validator(data.status) };
}
