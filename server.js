const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs').promises;
const path = require('path');

const dbFilePath = path.resolve(__dirname, 'db.json');

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Função auxiliar para ler o db.json
async function readDatabase() {
  try {
    const data = await fs.readFile(dbFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o db.json:', error);
    throw error;
  }
}

// Função auxiliar para escrever no db.json
async function writeDatabase(db) {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Erro ao escrever no db.json:', error);
    throw error;
  }
}

// Middleware para adicionar uma nova transação
server.post('/', async (req, res) => {
  try {
    let db = await readDatabase();

    const transaction = req.body;

    // Atualiza o saldo com base no tipo de transação
    if (transaction.type === 'income') {
      db.saldo.total += transaction.amount;
    } else if (transaction.type === 'expense') {
      db.saldo.total -= transaction.amount;
    }
    // Adiciona a transação ao array
    transaction.id = db.transactions.length ? db.transactions[db.transactions.length - 1].id + 1 : 1; // Gera um ID único
    db.transactions.push(transaction);

    // Escreve no arquivo db.json
    await writeDatabase(db);

    // Retorna a transação adicionada com status 201 (Created)
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    res.status(500).json({ error: 'Erro interno ao adicionar transação' });
  }
});

// Middleware para deletar uma transação
server.delete('/', async (req, res) => {
  try {
    let db = await readDatabase();

    const transactionId = Number(req.params.id);

    // Encontra a transação pelo ID
    const transactionIndex = db.transactions.findIndex(t => t.id === transactionId);

    if (transactionIndex >= 0) {
      const transaction = db.transactions[transactionIndex];

      // Atualiza o saldo com base no tipo de transação
      if (transaction.type === 'income') {
        db.saldo.total -= transaction.amount;
      } else if (transaction.type === 'expense') {
        db.saldo.total += transaction.amount;
      }

      // Remove a transação do array
      db.transactions.splice(transactionIndex, 1);

      // Escreve no arquivo db.json
      await writeDatabase(db);

      // Retorna status 204 (No Content)
      res.status(204).end();
    } else {
      // Se a transação não for encontrada, retorna status 404 (Not Found)
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro interno ao deletar transação' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});