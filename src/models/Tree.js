const { accessSpreadsheet } = require('../config/sheets');

class Tree {
    constructor() {
        this.sheetTitle = 'ArvoreTransferencia';
    }

    async getSheet() {
        const doc = await accessSpreadsheet();
        return doc.sheetsByTitle[this.sheetTitle];
    }

    async getAllData() {
        try {
            const sheet = await this.getSheet();
            const rows = await sheet.getRows();
            
            const data = [];
            let lastNonEmptyCell = '';
    
            for (const row of rows) {
                const rowData = row._rawData || []; // Use a propriedade correta se `_rawData` não estiver disponível
    
                // Atualiza o valor da célula mesclada para a linha atual
                if (rowData[0]) {
                    lastNonEmptyCell = rowData[0]; // Atualiza com o valor da célula atual se não estiver vazia
                }
    
                // Preenche a linha com o valor da célula mesclada
                const adjustedRow = rowData.map((cell, index) => {
                    return index === 0 && !cell ? lastNonEmptyCell : cell;
                });
                
                data.push(adjustedRow);
            }
    
            return data;
        } catch (error) {
            console.error('Erro ao buscar todos os dados:', error);
            throw error;
        }
    }    
    

    async searchByKeywords(text) {
        try {
            if (!Array.isArray(text)) {
                throw new Error('O parâmetro text deve ser um array de palavras.');
            }
    
            const stopWords = [
                'a', 'o', 'e', 'de', 'do', 'da', 'dos', 'das', 'um', 'uma', 'uns', 'umas',
                'em', 'por', 'com', 'para', 'no', 'na', 'nos', 'nas', 'ao', 'à', 'aos', 'às',
                'sobre', 'entre', 'até', 'após', 'perante', 'diante', 'contra', 'sem',
                'não', 'nem', 'que', 'qual', 'quais', 'quanto', 'quantos', 'quantas',
                'quem', 'onde', 'como', 'quando', 'cujas', 'cujos', 'cujas', 'mas',
                'ou', 'se', 'pois', 'porém', 'todavia', 'embora', 'ainda', 'também',
                'então', 'assim', 'deste', 'dessa', 'daquele', 'daquela', 'este', 'esta',
                'aquele', 'aquela', 'isso', 'isto', 'aquilo', 'já', 'aí', 'ali', 'aqui',
                'lá', 'por isso', 'de novo', 'por tanto', 'pois é'
            ];
    
            // Filtra as stop words do array de palavras
            const keywords = text
                .map(word => word.toLowerCase().trim())
                .filter(word => word && !stopWords.includes(word)); // Remove palavras vazias e stop words
    
            const allData = await this.getAllData();
    
            // Mapeia as linhas com a contagem de palavras-chave correspondentes
            const keywordMatches = allData.map((row, index) => {
                const cola = row[0]?.toLowerCase() || '';
                const processo = row[1]?.toLowerCase() || '';
                const tema = row[2]?.toLowerCase() || '';
    
                const matchCount = [cola, processo, tema].reduce((count, cell) => {
                    const cellMatches = keywords.filter(keyword => cell.includes(keyword)).length;
                    return count + cellMatches;
                }, 0);
    
                return { row: [cola, processo, tema], matchCount, index: index + 1 };
            });
    
            // Filtra e ordena as linhas pela contagem de palavras-chave em ordem decrescente
            const filteredData = keywordMatches
                .filter(item => item.matchCount > 0) // Mantém apenas as linhas que têm correspondências
                .sort((a, b) => b.matchCount - a.matchCount); // Ordena em ordem decrescente
    
            // Retorna os dados formatados conforme solicitado
            return filteredData.map(item => ({
                number: item.index, // Número da linha
                cola: item.row[0],
                processo: item.row[1],
                tema: item.row[2]
            }));
        } catch (error) {
            console.error('Erro ao buscar dados por palavras-chave:', error);
            throw error;
        }
    }
}    

module.exports = Tree;