const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { config } = require('dotenv');

config();

async function accessSpreadsheet() {
    const creds = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes:['https://www.googleapis.com/auth/spreadsheets']
    });
    const doc = new GoogleSpreadsheet('1CSSAOvqKQKUVQg7dd1atnrxzZIiyFOxDrqvUUD53CUg', creds);
    
    await doc.loadInfo(); 
    return doc;
}

async function testConnection() {
    try {
        const doc = await accessSpreadsheet();
        console.log(`Conexão com a planilha ${doc.title} estabelecida`);
    } catch (error) {
        console.error('Erro ao conectar à planilha:', error);
    }
}
module.exports = { accessSpreadsheet, testConnection };