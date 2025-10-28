import Decimal from 'decimal.js';

export const serializeDecimal = (value: unknown) => {
  if (value instanceof Decimal) {
    return Number(value.toFixed(2));
  }
  return value;
};

export const serializeEntity = <T>(entity: T): T => {
  if (!entity || typeof entity !== 'object') {
    return entity;
  }
  const result: any = Array.isArray(entity) ? [] : {};
  for (const [key, val] of Object.entries(entity as Record<string, unknown>)) {
    if (val instanceof Decimal) {
      result[key] = serializeDecimal(val);
    } else if (Array.isArray(val)) {
      result[key] = val.map((item) => serializeEntity(item));
    } else if (val && typeof val === 'object' && !(val instanceof Date)) {
      result[key] = serializeEntity(val);
    } else {
      result[key] = val;
    }
  }
  return result;
};
