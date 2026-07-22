const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'bd.json');

function loadDB() {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error("Erro ao ler bd.json:", err.message);
        return {
            nomePraca: "Praça da França",
            pontosBicicletas: [],
            usuarios: [],
            corridas: []
        };
    }
}

function saveDB(db) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error('Erro ao salvar bd.json:', err.message);
        return false;
    }
}

function getNextId(lista) {
    if (!Array.isArray(lista) || lista.length === 0) return 1;
    let maxId = 0;
    for (const item of lista) {
        if (typeof item.id === 'number' && item.id > maxId) {
            maxId = item.id;
        }
    }
    return maxId + 1;
}

// Leitura e verificação do BD
let db = loadDB();

console.log("==========================================");
console.log(` Praça: ${db.nomePraca}`);
console.log("==========================================");

console.log("\n--- USUÁRIOS REGISTRADOS ---");
if (Array.isArray(db.usuarios)) {
    db.usuarios.forEach(u => {
        console.log(`[ID ${u.id}] Nome: ${u.nome} | Email: ${u.email || 'N/A'} | Saldo: R$ ${Number(u.saldo || 0).toFixed(2)}`);
    });
}

console.log("\n--- PONTOS DE APOIO DE BICICLETAS ---");
if (Array.isArray(db.pontosBicicletas)) {
    db.pontosBicicletas.forEach(ponto => {
        console.log(`Ponto ${ponto.local} (ID ${ponto.id}): ${ponto.bicicletas.length} veículo(s) disponível(is)`);
    });
}

console.log("\n--- HISTÓRICO DE CORRIDAS ---");
if (Array.isArray(db.corridas) && db.corridas.length > 0) {
    db.corridas.forEach(c => {
        console.log(`[Corrida #${c.id || 'N/A'}] Usuário ID: ${c.idUsuario} | Veículo: ${c.veiculo || c.idBicicleta} | Início: ${c.inicio}`);
    });
} else {
    console.log("Nenhuma corrida registrada.");
}

module.exports = {
    loadDB,
    saveDB,
    getNextId
};