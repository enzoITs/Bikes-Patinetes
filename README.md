# 🚲 Eco Bike - Sistema de Aluguel de Bicicletas e Patinetes

Um aplicativo interativo de linha de comando (CLI) desenvolvido em Node.js para gerenciamento e aluguel de bicicletas e patinetes elétricos em pontos de apoio urbanos.

---

## 📋 Funcionalidades

- 🔐 **Autenticação & Cadastro**: Registro de novos usuários com validação de credenciais e e-mail único.
- 💳 **Gerenciamento de Saldo**: Funcionalidade para depositar (adicionar) e sacar (remover) saldo da conta.
- 🚲 **Catálogo de Veículos**:
  - Bike Urbana Classic (`R$ 4,00 / hora`)
  - Bike Mountain Pro (`R$ 5,50 / hora`)
  - E-Bike City Plus ⚡ (`R$ 8,00 / hora`)
  - Patinete EcoRide ⚡ (`R$ 5,00 / hora`)
  - Patinete Urban Pro ⚡ (`R$ 6,50 / hora`)
- ⏱️ **Aluguel & Devolução**: Cálculo automático de custo por hora, débito do saldo e registro de aluguéis ativos e histórico global de corridas.
- 👤 **Perfil do Usuário**: Exibição de dados da conta, saldo atual e quantidade de aluguéis ativos.
- 💾 **Persistência de Dados**: Leitura e salvamento automático das alterações no arquivo de banco de dados JSON (`bd.json`).
- ⚡ **Arquitetura Estável**: Sistema baseado em laço iterativo (`while`), sem risco de estouro de memória por chamada recursiva (*Stack Overflow*).

---

## 📂 Estrutura do Projeto

```text
Bikes-Patinetes/
├── package.json          # Dependências do projeto (prompt-sync)
├── README.md             # Documentação do projeto
└── projeto/
    ├── bd.json           # Banco de dados em formato JSON
    ├── index.js          # Script de exibição e verificação de dados do BD
    └── teste.js          # Aplicação principal interativa (CLI)
```

---

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- `npm` (gerenciador de pacotes do Node)

---

## 🚀 Como Executar

### 1. Instalar as dependências

No terminal, execute o comando abaixo para instalar as dependências necessárias:

```bash
npm install
```

### 2. Iniciar o aplicativo interativo (CLI)

Para abrir a interface de linha de comando do sistema Eco Bike:

```bash
node projeto/teste.js
```

### 3. Exibir dados do banco de dados

Para visualizar a lista de usuários registrados, veículos por ponto de apoio e o histórico de corridas salvas:

```bash
node projeto/index.js
```

---

## 📊 Estrutura do Banco de Dados (`bd.json`)

O arquivo [`projeto/bd.json`](file:///c:/Temp/china/Bikes-Patinetes/projeto/bd.json) armazena a estrutura do sistema:

- **`nomePraca`**: Nome da praça ou ponto central.
- **`pontosBicicletas`**: Lista de pontos de apoio (A, B, C) e veículos disponíveis.
- **`usuarios`**: Cadastro de usuários, senhas, saldos e lista de aluguéis ativos.
- **`corridas`**: Histórico global de corridas realizadas no sistema.

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais e de estudo.