const fs = require('fs');
const path = require('path');

function loadDB() {
    try {
        const raw = fs.readFileSync("./db2.json", "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("Erro ao ler db2.json:", err.message);
        return {
            grupos: []
        };
    }
}

function saveDB(db) {
    try {
        fs.writeFileSync("./db2.json", JSON.stringify(db, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error('Erro ao salvar db2.json:', err.message);
        return false;
    }
}

let db = loadDB();

console.log(db);

db.grupos[1]["nome"] = "garcia";

saveDB(db);

console.log(db.grupos[1]["nome"]);
