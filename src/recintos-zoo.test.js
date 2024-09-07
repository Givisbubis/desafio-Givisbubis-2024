// src/recintos-zoo.test.js
import { RecintosZoo } from './recintos-zoo.js';

test('Deve rejeitar animal inválido', () => {
    const zoo = new RecintosZoo();
    const resultado = zoo.analisaRecintos('UNICORNIO', 1);
    expect(resultado.erro).toBe('Animal inválido');
});

test('Deve rejeitar quantidade inválida', () => {
    const zoo = new RecintosZoo();
    const resultado = zoo.analisaRecintos('LEAO', 0);
    expect(resultado.erro).toBe('Quantidade inválida');
});

test('Não deve encontrar recintos para 10 macacos', () => {
    const zoo = new RecintosZoo();
    const resultado = zoo.analisaRecintos('MACACO', 10);
    expect(resultado.erro).toBe('Não há recinto viável');
});

test('Deve encontrar recinto para 1 crocodilo', () => {
    const zoo = new RecintosZoo();
    const resultado = zoo.analisaRecintos('CROCODILO', 1);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis).toEqual([
        'Recinto 4 (espaço livre: 5 total: 8)'
    ]);
});

test('Deve encontrar recintos para 2 macacos', () => {
    const zoo = new RecintosZoo();
    const resultado = zoo.analisaRecintos('MACACO', 2);
    expect(resultado.erro).toBeFalsy();
    expect(resultado.recintosViaveis).toEqual([
        'Recinto 1 (espaço livre: 5 total: 10)',
        'Recinto 2 (espaço livre: 3 total: 5)',
        'Recinto 5 (espaço livre: 4 total: 9)'
    ]);
});
