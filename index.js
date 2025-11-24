const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

function loadDB() {
    try {
        const raw = fs.readFileSync("./bd.json", `utf8`)
        return JSON.parse(raw)
    } catch (err) {
        console.error("Erro ao ler bd.json", err.message)
        return {
            nomePraça: '',
            pontosBicicletas: '',
            usuarios: '',
            corridas: '',
        }
    }
}

function sabeDB() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error('Erro ao salvar bd.json', err.message);
        return false;
    }
}

function getNextId() {
    const db = loadDB();

    const value = db.name || [];

    let maxId = 0;
    for (let i = 0; i < usuarios.length; i++) {
        const u = usuarios[i];
        if (typeof u.id === 'number' && u.id > maxId) {
            maxId = u.id;
        }
    }
    const newId = maxId !== 0 ? maxId + 1 : 1; //if ternario
    //condição (true ou false) ? valor se verdadeiro : valor se falso
}


while(true) {
    const sairN = prompt(`
        -----------------------------------------------------------------
        Entrar [1]
        Sair [2]
        -----------------------------------------------------------------
        `)

    if(sairN == '1') {

    } else if (sairN == "2") {
        break
    } else {
        console.log('Escolha invalida')
        continue;
    }

        // Variáveis globais
    let emailGlobal = "";
    let senhaGlobal = "";
    let lista = [];
    let saldo = 0;

    // ==== TELA INICIAL ====

    const inicio = prompt(`
    ----------------------------------------
    [1] Login
    [2] Cadastro
    ----------------------------------------
    `);

    if (inicio == "1") {
        console.log('Você não possui cadastro!');
        console.log('Vamos direcionar você para a página de cadastro!');
        cadastro();
    } else if (inicio == "2") {
        cadastro();
    } else {
        console.log("Opção inválida!");
    }

    
    // ==== CADASTRO 2 ====

    function cadastrarUsuario() {

    }

    // ==== CADASTRO ====

    function cadastro() {

        console.log('Vamos cadastrar você!');

        const email = prompt('Digite seu email: ');
        const cpf = prompt("Digite seu CPF: ");
        const senha = prompt("Digite sua senha: ");
        const senha2 = prompt('Digite novamente a senha: ');

        if (senha === senha2) {
            console.log(`
    ---------------------------
    |   Cadastro Concluído    |
    ---------------------------
    `);

            emailGlobal = email;
            senhaGlobal = senha;

            console.log("Vamos direcionar você para o login!");
            login();
        } else {
            console.log('As senhas não coincidem.');
            console.log('Por favor, faça novamente o cadastro!');
            cadastro();
        }
    }

    // ==== LOGIN ====

    function login() {
        const email2 = prompt("Digite seu email: ");
        const senha3 = prompt("Digite sua senha: ");

        if (email2 === emailGlobal && senha3 === senhaGlobal) {
            console.log(`
    ---------------------------
    |     Login Concluído     |
    ---------------------------
    `);
            menu();
        } else {
            console.log('Email ou senha estão errados.');
            console.log('Por favor, tente novamente.');
            login();
        }
    }

    // ==== MENU PRINCIPAL ====

    function menu() {
        const opcao = prompt(`
    ----------------------------------------
    Saldo: R$ ${saldo}
    ----------------------------------------
    [1] Alugar bicicletas e patinetes
    [2] Ver seus aluguéis 
    [3] Perfil
    [4] Saldo da conta
    [5] Sair
    ----------------------------------------
    `);

        if (opcao == "1") {
            alugarBikes();
        } else if (opcao == "2") {
            verAlugueis();
        } else if (opcao == "3") {
            console.log("Função de perfil ainda não criada!");
            menu();
        } else if (opcao == "4") {
        mexerSaldo();
        } else if (opcao == "5") {
            console.log("Obrigado por usar a Eco Bike!");
        } else {
            console.log("Opção inválida!");
            menu();
        }
    }

    // ==== CATÁLOGO / ALUGUEL ====

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

        let num = prompt("Digite o número do veículo que deseja alugar: ");
        let tempo = prompt('Digite o tempo que você vai usar (horas): ');

        // transforma em número
        num = parseInt(num);
        tempo = parseInt(tempo);

        if (num < 1 || num > 5) {
            console.log("Número inválido!");
            return alugarBikes();
        }

        if (tempo <= 0) {
            console.log("Tempo inválido!");
            return alugarBikes();
        }

        let preco = 0;
        let nome = "";

        if (num == 1) { preco = 4; nome = "Bike Urbana Classic"; }
        if (num == 2) { preco = 5.5; nome = "Bike Mountain Pro"; }
        if (num == 3) { preco = 8; nome = "E-Bike City Plus ⚡"; }
        if (num == 4) { preco = 5; nome = "Patinete EcoRide ⚡"; }
        if (num == 5) { preco = 6.5; nome = "Patinete Urban Pro ⚡"; }

        let total = preco * tempo;

        if (saldo >= total) {
            lista.push(`${nome} - R$ ${preco} / ${tempo}h`);
            saldo = saldo - total;
            console.log("Alugado com sucesso!");
        } else {
            console.log('Saldo insuficiente!');
            return alugarBikes();
        }

        menu();
    }

    // ==== VER ALUGUÉIS ====

    function verAlugueis() {
        console.clear();

        if (lista.length === 0) {
            console.log("Você não tem veículos alugados no momento.");
            return menu();
        }

        console.log("Seus aluguéis atuais:");
        console.log(lista);

        const opt = prompt(`
    --------------------------------
    [1] Cancelar um aluguel 
    [2] Voltar ao menu
    --------------------------------
    `);

        if (opt == "1") {
            const i = parseInt(prompt("Digite a posição do veículo que deseja remover: "));

            if (i < 1 || i > lista.length) {
                console.log("Posição inválida!");
                return verAlugueis();
            }

            lista.splice(i - 1, 1);
            console.log("Seu aluguel foi cancelado com sucesso!");
            menu();

        } else if (opt == "2") {
            menu();
        } else {
            console.log("Valor inválido!");
            verAlugueis();
        }
    }

    // ==== MEXER NO SALDO ====

    function mexerSaldo() {

        const o = prompt(`
    -------------------------------------
    [1] Adicionar Saldo
    [2] Remover Saldo
    -------------------------------------
    `);

        if (o == "1") {
            const valor = parseFloat(prompt("Quanto deseja depositar? "));

            if (valor <= 0) {
                console.log("Valor inválido!");
                return mexerSaldo();
            }

            saldo = saldo + valor;
            console.log("Saldo adicionado com sucesso!");

        } else if (o == "2") {
            const valor = parseFloat(prompt("Quanto deseja retirar? "));

            if (valor <= 0) {
                console.log("Valor inválido!");
                return mexerSaldo();
            }

            if (valor > saldo) {
                console.log("Saldo insuficiente!");
                return mexerSaldo();
            }

            saldo = saldo - valor;
            console.log("Saldo removido com sucesso!");

        } else {
            console.log("Opção inválida!");
            return mexerSaldo();
        }

        menu();
    }
}