const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'bd.json');

// ===================================
// ===== PERSISTÊNCIA & HELPER DB =====
// ===================================

function loadDB() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const defaultDB = {
                nomePraca: "Praça da França",
                pontosBicicletas: [],
                usuarios: [],
                corridas: []
            };
            saveDB(defaultDB);
            return defaultDB;
        }
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

// Helper para verificar se a entrada do usuário solicita a ação de voltar
function eOpcaoVoltar(input) {
    if (typeof input !== 'string') return false;
    const str = input.trim().toLowerCase();
    return str === '0' || str === 'voltar' || str === 'v' || str === 'cancelar';
}

// ==================================
// ===== APLICAÇÃO ECO BIKE (CLI) =====
// ==================================

let db = loadDB();
let currentUser = null;

function main() {
    let rodando = true;

    while (rodando) {
        console.clear();

        if (!currentUser) {
            console.log(`
=====================================================
            🚲  ECO BIKE - TELA INICIAL  🚲
=====================================================
[1] Login
[2] Cadastrar novo usuário
[0] Sair do Sistema
=====================================================
`);
            const opcao = prompt("Escolha uma opção: ");

            if (eOpcaoVoltar(opcao)) {
                console.log("\nObrigado por usar a Eco Bike! Até mais.");
                rodando = false;
                break;
            }

            switch (opcao) {
                case "1":
                    login();
                    break;
                case "2":
                    cadastro();
                    break;
                default:
                    console.log("\nOpção inválida!");
                    prompt("Pressione ENTER para continuar...");
            }
        } else {
            const saldo = Number(currentUser.saldo || 0);
            console.log(`
=====================================================
            🚲  ECO BIKE - MENU PRINCIPAL  🚲
=====================================================
Usuário: ${currentUser.nome} (${currentUser.email})
Saldo Atual: R$ ${saldo.toFixed(2)}
=====================================================
[1] Alugar bicicletas e patinetes
[2] Meus aluguéis / Devolução
[3] Ver Perfil
[4] Gerenciar Saldo (Adicionar/Remover)
[0] Sair da conta (Logout)
=====================================================
`);
            const opcao = prompt("Escolha uma opção: ");

            if (eOpcaoVoltar(opcao)) {
                console.log(`\nLogout efetuado com sucesso! Até logo, ${currentUser.nome}.`);
                currentUser = null;
                prompt("Pressione ENTER para continuar...");
                continue;
            }

            switch (opcao) {
                case "1":
                    alugarBikes();
                    break;
                case "2":
                    devolverAluguel();
                    break;
                case "3":
                    verPerfil();
                    break;
                case "4":
                    mexerSaldo();
                    break;
                default:
                    console.log("\nOpção inválida!");
                    prompt("Pressione ENTER para continuar...");
            }
        }
    }
}

// ===== CADASTRO =====
function cadastro() {
    console.clear();
    console.log("=== CADASTRO DE NOVO USUÁRIO ===");
    console.log("(Digite '0' a qualquer momento para cancelar e voltar)\n");

    const nome = prompt("Digite seu nome completo (ou 0 para voltar): ").trim();
    if (eOpcaoVoltar(nome)) return;
    if (!nome) {
        console.log("Nome inválido!");
        prompt("Pressione ENTER para voltar...");
        return;
    }

    const email = prompt("Digite seu email (ou 0 para voltar): ").trim().toLowerCase();
    if (eOpcaoVoltar(email)) return;
    if (!email) {
        console.log("Email inválido!");
        prompt("Pressione ENTER para voltar...");
        return;
    }

    const usuarioExistente = db.usuarios.find(u => u.email && u.email.toLowerCase() === email);
    if (usuarioExistente) {
        console.log("Já existe um usuário cadastrado com este e-mail!");
        prompt("Pressione ENTER para tentar novamente...");
        return;
    }

    const cpf = prompt("Digite seu CPF (ou 0 para voltar): ").trim();
    if (eOpcaoVoltar(cpf)) return;

    const senha = prompt("Digite sua senha (ou 0 para voltar): ");
    if (eOpcaoVoltar(senha)) return;

    const senha2 = prompt("Digite novamente sua senha (ou 0 para voltar): ");
    if (eOpcaoVoltar(senha2)) return;

    if (senha !== senha2 || !senha) {
        console.log("As senhas não coincidem ou estão vazias!");
        prompt("Pressione ENTER para tentar novamente...");
        return;
    }

    const novoUsuario = {
        id: getNextId(db.usuarios),
        nome: nome,
        email: email,
        cpf: cpf,
        senha: senha,
        saldo: 0,
        alugueis: []
    };

    db.usuarios.push(novoUsuario);
    saveDB(db);
    currentUser = novoUsuario;

    console.log(`
---------------------------------
 Cadastro Concluído com Sucesso! 
 Logado automaticamente como: ${nome}
---------------------------------
`);
    prompt("Pressione ENTER para ir ao menu principal...");
}

// ===== LOGIN =====
function login() {
    console.clear();
    console.log("=== LOGIN ===");
    console.log("(Digite '0' a qualquer momento para voltar ao menu inicial)\n");

    const email = prompt("Digite seu email (ou 0 para voltar): ").trim().toLowerCase();
    if (eOpcaoVoltar(email)) return;

    const senha = prompt("Digite sua senha (ou 0 para voltar): ");
    if (eOpcaoVoltar(senha)) return;

    const usuario = db.usuarios.find(u => u.email && u.email.toLowerCase() === email && u.senha === senha);

    if (usuario) {
        if (!Array.isArray(usuario.alugueis)) usuario.alugueis = [];
        if (typeof usuario.saldo !== 'number') usuario.saldo = Number(usuario.saldo) || 0;

        currentUser = usuario;
        console.log(`
---------------------------------
 Login Concluído com Sucesso! 
 Bem-vindo(a), ${usuario.nome}!
---------------------------------
`);
        prompt("Pressione ENTER para continuar...");
    } else {
        console.log("\nEmail ou senha incorretos.");
        prompt("Pressione ENTER para tentar novamente...");
    }
}

// ===== PERFIL =====
function verPerfil() {
    console.clear();
    console.log("=== PERFIL DO USUÁRIO ===");
    console.log(`ID: ${currentUser.id}`);
    console.log(`Nome: ${currentUser.nome}`);
    console.log(`Email: ${currentUser.email}`);
    console.log(`CPF: ${currentUser.cpf || 'Não informado'}`);
    console.log(`Saldo: R$ ${Number(currentUser.saldo || 0).toFixed(2)}`);
    console.log(`Veículos alugados ativos: ${currentUser.alugueis ? currentUser.alugueis.length : 0}`);
    
    prompt("\nPressione [0] ou ENTER para voltar ao menu...");
}

// ===== ALUGAR BIKES =====
function alugarBikes() {
    console.clear();

    const catalogo = [
        { id: 1, nome: "Bike Urbana Classic", preco: 4.0 },
        { id: 2, nome: "Bike Mountain Pro", preco: 5.5 },
        { id: 3, nome: "E-Bike City Plus ⚡", preco: 8.0 },
        { id: 4, nome: "Patinete EcoRide ⚡", preco: 5.0 },
        { id: 5, nome: "Patinete Urban Pro ⚡", preco: 6.5 }
    ];

    console.log(`
=====================================================
            🚲  CATÁLOGO ECO BIKE  🚲
=====================================================
[1] Bike Urbana Classic  - R$ 4,00 / 1h
[2] Bike Mountain Pro    - R$ 5,50 / 1h
[3] E-Bike City Plus ⚡   - R$ 8,00 / 1h
[4] Patinete EcoRide ⚡   - R$ 5,00 / 1h
[5] Patinete Urban Pro ⚡ - R$ 6,50 / 1h
[0] Cancelar / Voltar
=====================================================
`);

    const numInput = prompt("Escolha o número do veículo (1-5 ou 0 para Voltar): ").trim();
    if (eOpcaoVoltar(numInput)) return;

    const num = Number(numInput);
    if (isNaN(num) || num < 1 || num > 5) {
        console.log("\nOpção de veículo inválida!");
        prompt("Pressione ENTER...");
        return;
    }

    const tempoInput = prompt("Digite a duração do aluguel em horas (ou 0 para Voltar): ").trim();
    if (eOpcaoVoltar(tempoInput)) return;

    const tempo = Number(tempoInput);
    if (isNaN(tempo) || tempo <= 0) {
        console.log("\nTempo de uso inválido!");
        prompt("Pressione ENTER...");
        return;
    }

    const item = catalogo[num - 1];
    const total = item.preco * tempo;
    const saldoAtual = Number(currentUser.saldo || 0);

    if (saldoAtual < total) {
        console.log(`\nSaldo insuficiente! Custo total: R$ ${total.toFixed(2)} | Saldo atual: R$ ${saldoAtual.toFixed(2)}`);
        prompt("Adicione saldo antes de realizar este aluguel. ENTER para continuar...");
        return;
    }

    currentUser.saldo = saldoAtual - total;
    if (!Array.isArray(currentUser.alugueis)) currentUser.alugueis = [];

    const novoAluguel = {
        id: getNextId(currentUser.alugueis),
        veiculo: item.nome,
        horas: tempo,
        valorTotal: total,
        data: new Date().toLocaleString('pt-BR')
    };

    currentUser.alugueis.push(novoAluguel);

    if (!Array.isArray(db.corridas)) db.corridas = [];
    db.corridas.push({
        id: getNextId(db.corridas),
        idUsuario: currentUser.id,
        veiculo: item.nome,
        inicio: novoAluguel.data,
        duracaoHoras: tempo,
        valorTotal: total
    });

    saveDB(db);

    console.log(`
-----------------------------------------------------
  Veículo Alugado com Sucesso! 🚲
  Veículo: ${item.nome}
  Duração: ${tempo} hora(s)
  Total Pago: R$ ${total.toFixed(2)}
  Saldo Restante: R$ ${currentUser.saldo.toFixed(2)}
-----------------------------------------------------
`);
    prompt("Pressione ENTER para voltar ao menu...");
}

// ===== DEVOLVER ALUGUEL =====
function devolverAluguel() {
    console.clear();

    if (!Array.isArray(currentUser.alugueis) || currentUser.alugueis.length === 0) {
        console.log("Você não possui nenhum veículo alugado no momento.");
        prompt("Pressione ENTER para voltar...");
        return;
    }

    console.log("=== SEUS VEÍCULOS ALUGADOS ===");
    currentUser.alugueis.forEach((item, index) => {
        console.log(`[${index + 1}] ${item.veiculo} - ${item.horas}h (R$ ${item.valorTotal.toFixed(2)}) - Alugado em: ${item.data}`);
    });

    console.log(`
--------------------------------------
[1] Devolver um veículo
[0] Voltar ao menu principal
--------------------------------------
`);

    const opcao = prompt("Escolha uma opção: ");
    if (eOpcaoVoltar(opcao)) return;

    if (opcao === "1") {
        const posInput = prompt("Digite o número do item que deseja devolver (ou 0 para Voltar): ").trim();
        if (eOpcaoVoltar(posInput)) return;

        const pos = Number(posInput);
        if (isNaN(pos) || pos < 1 || pos > currentUser.alugueis.length) {
            console.log("\nPosição inválida!");
            prompt("Pressione ENTER...");
            return;
        }

        const removido = currentUser.alugueis.splice(pos - 1, 1)[0];
        saveDB(db);

        console.log(`
---------------------------------
 Veículo devolvido com sucesso!
 Veículo: ${removido.veiculo}
---------------------------------
`);
        prompt("Pressione ENTER para continuar...");
    }
}

// ===== GERENCIAR SALDO =====
function mexerSaldo() {
    console.clear();
    const saldoAtual = Number(currentUser.saldo || 0);

    console.log(`
=====================================
       GERENCIAMENTO DE SALDO
=====================================
Saldo Atual: R$ ${saldoAtual.toFixed(2)}
-------------------------------------
[1] Adicionar Saldo (Depósito)
[2] Remover Saldo (Saque)
[0] Voltar ao Menu
=====================================
`);

    const o = prompt("Escolha uma opção: ");
    if (eOpcaoVoltar(o)) return;

    if (o !== "1" && o !== "2") {
        console.log("\nOpção inválida!");
        prompt("Pressione ENTER...");
        return;
    }

    const valorInput = prompt("Digite o valor em R$ (ou 0 para Voltar): ").trim();
    if (eOpcaoVoltar(valorInput)) return;

    const valor = Number(valorInput);
    if (isNaN(valor) || valor <= 0) {
        console.log("\nValor inválido! Digite um número positivo.");
        prompt("Pressione ENTER...");
        return;
    }

    if (o === "1") {
        currentUser.saldo = saldoAtual + valor;
        saveDB(db);
        console.log(`\nSucesso! Adicionado R$ ${valor.toFixed(2)}. Novo Saldo: R$ ${currentUser.saldo.toFixed(2)}`);
    } else if (o === "2") {
        if (valor > saldoAtual) {
            console.log("\nSaldo insuficiente para realizar este saque!");
            prompt("Pressione ENTER...");
            return;
        }
        currentUser.saldo = saldoAtual - valor;
        saveDB(db);
        console.log(`\nSucesso! Removido R$ ${valor.toFixed(2)}. Novo Saldo: R$ ${currentUser.saldo.toFixed(2)}`);
    }

    prompt("\nPressione ENTER para voltar ao menu...");
}

// Inicia a aplicação se executada diretamente
if (require.main === module) {
    main();
}

module.exports = {
    loadDB,
    saveDB,
    getNextId,
    main
};
