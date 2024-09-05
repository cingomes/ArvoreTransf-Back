const Tree = require('../models/Tree');
const treeModel = new Tree();

async function searchWords(req, res) {
    try {
        const text = req.body.text; // Supondo que o corpo da requisição seja { "text": "aqui vai o texto do usuário" }
        if (typeof text !== 'string') {
            return res.status(400).json({ error: "Text should be a string." });
        }

        const keywords = text.split(/\s+/).map(word => word.trim().toLowerCase()); // Divide o texto em palavras e converte para minúsculas

        const colas = await treeModel.searchByKeywords(keywords);
        return res.json(colas);
    } catch (error) {
        console.error("Algo deu errado!", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function allData(req, res) {
    try {
        const allData = await treeModel.getAllData();
        return res.json(allData);
    } catch (error) {
        console.error('Algo deu errado!', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { searchWords, allData };
