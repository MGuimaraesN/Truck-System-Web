import { beforeAll, describe, expect, it, vi } from 'vitest';
import { utils } from 'xlsx';

vi.mock('@/env', () => ({
  env: {
    DATABASE_URL: 'file:./test.db',
    JWT_SECRET: 'secret',
  },
}));

let sanitizeRow: typeof import('./importExcel').sanitizeRow;
let normalizeNumber: typeof import('./importExcel').normalizeNumber;
let parseDate: typeof import('./importExcel').parseDate;
let inferCategoria: typeof import('./importExcel').inferCategoria;
let loadSheet: typeof import('./importExcel').loadSheet;

beforeAll(async () => {
  const importer = await import('./importExcel');
  sanitizeRow = importer.sanitizeRow;
  normalizeNumber = importer.normalizeNumber;
  parseDate = importer.parseDate;
  inferCategoria = importer.inferCategoria;
  loadSheet = importer.loadSheet;
});

describe('sanitizeRow', () => {
  it('ignores total columns and empty markers', () => {
    const row = {
      Total: 'Total Geral',
      col1: 'should ignore',
      '__EMPTY': 'value',
      Nome: 'Teste',
      Valor: ' 123,45 ',
    };

    const sanitized = sanitizeRow(row);
    expect(sanitized).toEqual({ Nome: 'Teste', Valor: '123,45' });
  });
});

describe('normalizeNumber', () => {
  it('converts localized numbers to floats', () => {
    expect(normalizeNumber('1.234,56')).toBeCloseTo(1234.56);
    expect(normalizeNumber('  ')).toBeNull();
  });
});

describe('parseDate', () => {
  it('parses excel serials and iso strings', () => {
    const serialDate = 45291; // 2023-12-31
    const parsedSerial = parseDate(serialDate);
    expect(parsedSerial).instanceOf(Date);
    expect(parsedSerial?.toISOString()).toContain('2023-12-31');

    const parsedString = parseDate('2024-01-15');
    expect(parsedString?.toISOString()).toContain('2024-01-15');
  });
});

describe('inferCategoria', () => {
  it('maps keywords to categories', () => {
    expect(inferCategoria('Pagamento pedagio')).toBe('PEDAGIO');
    expect(inferCategoria('Serviço de borracharia')).toBe('MANUTENCAO_PNEU');
    expect(inferCategoria('Lavagem externa')).toBe('LAVAGEM');
    expect(inferCategoria(undefined)).toBe('OUTRAS');
  });
});

describe('loadSheet', () => {
  it('loads first sheet that matches name ignoring totals and pivots', () => {
    const wb = utils.book_new();
    const freteData = [
      { Data: '2024-01-01', Valor: '100,00', Total: 'ignore' },
      { Data: 'Total Geral', Valor: 'Total' },
      { Data: '2024-01-02', Valor: '200,00' },
    ];
    const freteSheet = utils.json_to_sheet(freteData);
    utils.book_append_sheet(wb, freteSheet, 'Frete Dados');

    const pivotSheet = utils.json_to_sheet([{ Foo: 'bar' }]);
    utils.book_append_sheet(wb, pivotSheet, 'Frete Total Pivot');

    const rows = loadSheet(wb, 'Frete');
    expect(rows).toHaveLength(2);
    expect(rows[0]?.Data).toBe('2024-01-01');
    expect(rows[1]?.Valor).toBe('200,00');
  });
});
