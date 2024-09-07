class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false, especial: true }
        };
    }

    analisaRecintos(especie, quantidade) {
        // Validar espécie
        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }

        // Validar quantidade
        if (typeof quantidade !== "number" || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[especie];
        const tamanhoTotalNecessario = animalInfo.tamanho * quantidade;
        let recintosViaveis = [];

        for (const recinto of this.recintos) {
            // Calcular o espaço ocupado por animais já existentes
            const espacoOcupado = recinto.animais.reduce((acc, a) => acc + this.animais[a.especie].tamanho * a.quantidade, 0);
            const espacoDisponivel = recinto.tamanho - espacoOcupado;

            // Checar compatibilidade de bioma
            if (!animalInfo.biomas.includes(recinto.bioma) && !(animalInfo.especial && recinto.bioma === "savana e rio")) {
                continue;
            }

            // Regras de carnívoros
            const carnívorosExistentes = recinto.animais.some(a => this.animais[a.especie].carnivoro);
            if (animalInfo.carnivoro && recinto.animais.length > 0 && carnívorosExistentes && !recinto.animais.every(a => this.animais[a.especie].carnivoro)) {
                continue; // Carnívoros só podem habitar com a mesma espécie
            }

            // Regras para hipopótamos
            if (animalInfo.especial && recinto.bioma !== "savana e rio" && recinto.animais.length > 0) {
                continue; // Hipopótamos só podem compartilhar com outras espécies em savana e rio
            }

            // Regras para macacos
            if (especie === "MACACO" && recinto.animais.length === 0 && quantidade === 1) {
                continue; // Macacos não gostam de ficar sozinhos
            }

            // Checar espaço necessário
            let espacoNecessario = tamanhoTotalNecessario;
            if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === especie)) {
                espacoNecessario += 1; // Espaço extra se houver outras espécies
            }

            // Verificar se há espaço suficiente
            if (espacoDisponivel >= espacoNecessario) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - tamanhoTotalNecessario,
                    espacoTotal: recinto.tamanho
                });
            }
        }

        // Ordenar recintos viáveis
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
        };
    }
}

export { RecintosZoo };
