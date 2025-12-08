const prompt = require('prompt-sync')();

// Variáveis globais
let emailGlobal = "";
let senhaGlobal = "";
let lista = [];
let saldo = 0;

// ===== SISTEMA PRINCIPAL =====

while (true) {
    console.clear();
    const sairN = prompt(`
-----------------------------------------------------------------
Entrar [1]
Sair   [2]
-----------------------------------------------------------------
`);

    if (sairN === "2") {
        console.log("Sistema encerrado. Até mais!");
        break;
    }

    if (sairN !== "1") {
        console.log("Escolha inválida!");
        prompt("Pressione ENTER para continuar...");
        continue;
    }

    // Tela inicial
    console.clear();
    const inicio = prompt(`
----------------------------------------
[1] Login
[2] Cadastro
----------------------------------------
`);

    if (inicio == "1") {
        if (emailGlobal === "") {
            console.log("Você não possui cadastro!");
            console.log("Direcionando para o cadastro...");
            prompt("Pressione ENTER para continuar...");
            cadastro();
        } else {
            login();
        }
    } else if (inicio == "2") {
        cadastro();
    } else {
        console.log("Opção inválida!");
        prompt("Pressione ENTER para continuar...");
    }
}

// ============================
// ===== FUNÇÃO CADASTRO =====
// ============================

function cadastro() {
    console.clear();
    console.log("=== CADASTRO ===");

    const email = prompt("Digite seu email: ");
    const cpf = prompt("Digite seu CPF: ");
    const senha = prompt("Digite sua senha: ");
    const senha2 = prompt("Digite novamente sua senha: ");

    if (senha !== senha2) {
        console.log("As senhas não coincidem. Tente novamente.");
        prompt("Pressione ENTER para continuar...");
        return cadastro();
    }

    emailGlobal = email;
    senhaGlobal = senha;

    console.log(`
---------------------------
|   Cadastro Concluído    |
---------------------------
`);
    prompt("Pressione ENTER para fazer login...");
    login();
}

// ========================
// ======= LOGIN =========
// ========================

function login() {
    console.clear();
    console.log("=== LOGIN ===");

    const email2 = prompt("Digite seu email: ");
    const senha3 = prompt("Digite sua senha: ");

    if (email2 === emailGlobal && senha3 === senhaGlobal) {
        console.log(`
---------------------------
|     Login Concluído     |
---------------------------
`);
        prompt("Pressione ENTER para continuar...");
        menu();
    } else {
        console.log("Email ou senha incorretos.");
        prompt("Pressione ENTER para tentar novamente...");
        login();
    }
}

// ===========================
// ===== MENU PRINCIPAL =====
// ===========================

function menu() {
    console.clear();
    const opcao = prompt(`
----------------------------------------
Saldo: R$ ${saldo.toFixed(2)}
----------------------------------------
[1] Alugar bicicletas e patinetes
[2] Meus aluguéis / Devolução
[3] Perfil
[4] Saldo da conta
[5] Sair
----------------------------------------
`);

    switch (opcao) {
        case "1": alugarBikes(); break;
        case "2": devolverAluguel(); break;
        case "3":
            console.clear();
            console.log("=== PERFIL ===");
            console.log(`Email: ${emailGlobal}`);
            console.log(`Aluguéis ativos: ${lista.length}`);
            prompt("\nPressione ENTER para voltar...");
            menu();
            break;

        case "4": mexerSaldo(); break;

        case "5":
            console.log("Voltando ao menu principal...");
            prompt("Pressione ENTER...");
            return;

        default:
            console.log("Opção inválida!");
            prompt("Pressione ENTER...");
            menu();
    }
}

// =============================
// ======= ALUGAR BIKES =======
// =============================

function alugarBikes() {
    console.clear();

    console.log(`
=====================================================
        🚲  CATÁLOGO ECO BIKE  🚲
=====================================================
[1] Bike Urbana Classic  - R$ 4,00 / 1h
[2] Bike Mountain Pro    - R$ 5,50 / 1h
[3] E-Bike City Plus ⚡   - R$ 8,00 / 1h
[4] Patinete EcoRide ⚡   - R$ 5,00 / 1h
[5] Patinete Urban Pro ⚡ - R$ 6,50 / 1h
=====================================================
`);

    const num = Number(prompt("Escolha o veículo (1-5): "));
    const tempo = Number(prompt("Digite o tempo de uso (horas): "));

    if (!num || num < 1 || num > 5) return alugarBikes();
    if (!tempo || tempo <= 0) return alugarBikes();

    const tabela = [
        { nome: "Bike Urbana Classic", preco: 4 },
        { nome: "Bike Mountain Pro", preco: 5.5 },
        { nome: "E-Bike City Plus ⚡", preco: 8 },
        { nome: "Patinete EcoRide ⚡", preco: 5 },
        { nome: "Patinete Urban Pro ⚡", preco: 6.5 }
    ];

    const item = tabela[num - 1];
    const total = item.preco * tempo;

    if (saldo < total) {
        console.log("Saldo insuficiente!");
        prompt("Pressione ENTER...");
        return menu();
    }

    saldo -= total;
    lista.push(`${item.nome} – ${tempo}h (R$ ${total.toFixed(2)})`);

    console.log("Alugado com sucesso!");
    prompt("Pressione ENTER para voltar ao menu...");
    menu();
}

// ============================
// ===== DEVOLVER ALUGUEL =====
// ============================

function devolverAluguel() {
    console.clear();

    if (lista.length === 0) {
        console.log("Você não possui nenhum aluguel.");
        prompt("Pressione ENTER...");
        return menu();
    }

    console.log("=== MEUS ALUGUÉIS ===");

    lista.forEach((item, i) => {
        console.log(`[${i + 1}] ${item}`);
    });

    const opcao = prompt(`
--------------------------------------
[1] Devolver um veículo
[2] Voltar ao menu
--------------------------------------
`);

    if (opcao === "1") {
        const pos = Number(prompt("Digite o número do item: "));

        if (!pos || pos < 1 || pos > lista.length) {
            console.log("Opção inválida!");
            prompt("ENTER...");
            return devolverAluguel();
        }

        const removido = lista.splice(pos - 1, 1);

        console.log(`
---------------------------------
Veículo devolvido com sucesso!
${removido}
---------------------------------
        `);

        prompt("ENTER para voltar...");
        return menu();
    }

    menu();
}

// ============================
// ========= SALDO ============
// ============================

function mexerSaldo() {
    console.clear();
    const o = prompt(`
-------------------------------------
[1] Adicionar Saldo
[2] Remover Saldo
-------------------------------------
`);

    const valor = Number(prompt("Digite o valor: "));

    if (!valor || valor <= 0) {
        console.log("Valor inválido!");
        prompt("ENTER...");
        return mexerSaldo();
    }

    if (o === "1") {
        saldo += valor;
        console.log("Saldo adicionado!");

    } else if (o === "2") {
        if (valor > saldo) {
            console.log("Saldo insuficiente!");
            prompt("ENTER...");
            return mexerSaldo();
        }

        saldo -= valor;
        console.log("Saldo removido!");
    } else {
        console.log("Opção inválida!");
        prompt("ENTER...");
        return mexerSaldo();
    }

    prompt("Pressione ENTER para voltar ao menu...");
    menu();
}
