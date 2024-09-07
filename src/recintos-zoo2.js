class RecintosZoo {
    constructor() {
        // Definindo os recintos existentes
        this.recintos = [
            { numero: 1, biomas: ['savana'], tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, biomas: ['floresta'], tamanhoTotal: 5, animais: [] },
            { numero: 3, biomas: ['savana', 'rio'], tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, biomas: ['rio'], tamanhoTotal: 8, animais: [] },
            { numero: 5, biomas: ['savana'], tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        // Definindo as informações dos animais
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validações de entrada
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Pegando as características do animal
        const animalInfo = this.animais[animal];
        const tamanhoNecessario = animalInfo.tamanho * quantidade;

        // Encontrar recintos viáveis
        const recintosViaveis = this.recintos.filter(recinto => {
            // Verificar se o bioma é adequado
            if (!recinto.biomas.some(bioma => animalInfo.biomas.includes(bioma))) {
                return false;
            }

            // Calcular o espaço disponível
            const ocupacaoAtual = recinto.animais.reduce((acc, a) => {
                const infoAnimal = this.animais[a.especie];
                return acc + (infoAnimal.tamanho * a.quantidade);
            }, 0);
            let espacoLivre = recinto.tamanhoTotal - ocupacaoAtual;

            // Regras específicas para carnívoros e convivência
            if (animalInfo.carnivoro) {
                if (recinto.animais.length > 0 && recinto.animais[0].especie !== animal) {
                    return false;
                }
            } else if (animal === 'HIPOPOTAMO' && recinto.animais.length > 0) {
                if (!recinto.biomas.includes('savana') || !recinto.biomas.includes('rio')) {
                    return false;
                }
            } else if (animal === 'MACACO' && recinto.animais.length === 0) {
                return false;
            }

            // Considerar espaço extra se houver múltiplas espécies
            if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal)) {
                espacoLivre -= 1;
            }

            // Verificar se há espaço suficiente
            return espacoLivre >= tamanhoNecessario;
        }).map(recinto => {
            const ocupacaoAtual = recinto.animais.reduce((acc, a) => {
                const infoAnimal = this.animais[a.especie];
                return acc + (infoAnimal.tamanho * a.quantidade);
            }, 0);
            let espacoLivre = recinto.tamanhoTotal - ocupacaoAtual;

            if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal)) {
                espacoLivre -= 1;
            }

            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre - tamanhoNecessario} total: ${recinto.tamanhoTotal})`;
        });

        // Retornar resultado
        if (recintosViaveis.length > 0) {
            return { recintosViaveis: recintosViaveis.sort() };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };

// Exemplo de uso
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos("MACACO", 2)); // Saída esperada
console.log(zoo.analisaRecintos("UNICORNIO", 1)); // Saída esperada para animal inválido
console.log(zoo.analisaRecintos("LEAO", 3)); // Saída esperada para "Não há recinto viável"
