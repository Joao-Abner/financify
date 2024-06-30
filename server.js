const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs').promises;
const path = require('path');

const dbFilePath = path.resolve(__dirname, 'db.json');

server.use(middlewares);
server.use(jsonServer.bodyParser);

async function readDatabase() {
  try {
    const data = await fs.readFile(dbFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o db.json:', error);
    throw error;
  }
}

async function writeDatabase(db) {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Erro ao escrever no db.json:', error);
    throw error;
  }
}

server.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let db = await readDatabase();

    const user = db.users.find(user => user.username === username && user.password === password);
    if (user) {
      res.status(200).json({ id: user.id, username: user.username });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro interno ao autenticar usuário' });
  }
});


server.get('/users/:userId/transactions', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user || !user.transactions) {
      return res.status(404).json({ error: 'Transações não encontradas para o usuário' });
    }

    res.status(200).json(user.transactions);
  } catch (error) {
    console.error('Erro ao obter transações:', error);
    res.status(500).json({ error: 'Erro interno ao obter transações' });
  }
});

server.post('/users/:userId/transactions', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const transaction = req.body;
    transaction.id = user.transactions.length ? user.transactions[user.transactions.length - 1].id + 1 : 1;
    user.transactions.push(transaction);

    // Atualiza o saldo do usuário
    if (transaction.type === 'income') {
      user.saldo += transaction.amount;
    } else {
      user.saldo -= transaction.amount;
    }

    // Escreve as alterações de volta no db.json
    await writeDatabase(db);

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    res.status(500).json({ error: 'Erro interno ao adicionar transação' });
  }
});


server.get('/users/:userId/saldo', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const balance = user.saldo;
    res.status(200).json(balance);
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    res.status(500).json({ error: 'Erro interno ao obter saldo' });
  }
});


server.delete('/users/:userId/transactions/:transactionId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const transactionId = Number(req.params.transactionId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user || !user.transactions) {
      return res.status(404).json({ error: 'Transações não encontradas para o usuário' });
    }

    const transactionIndex = user.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex >= 0) {
      user.transactions.splice(transactionIndex, 1);
      await writeDatabase(db);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Transação não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro interno ao deletar transação' });
  }
});

server.put('/users/:userId/transactions/:transactionId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const transactionId = parseInt(req.params.transactionId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user || !user.transactions) {
      return res.status(404).json({ error: 'Usuário ou transações não encontradas' });
    }

    const transactionIndex = user.transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const updatedTransaction = { ...user.transactions[transactionIndex], ...req.body };
    user.transactions[transactionIndex] = updatedTransaction;

    // Atualiza o saldo do usuário
    if (req.body.type && req.body.amount) {
      const originalTransaction = user.transactions[transactionIndex];
      if (originalTransaction.type === 'income') {
        user.saldo -= originalTransaction.amount;
      } else {
        user.saldo += originalTransaction.amount;
      }

      if (updatedTransaction.type === 'income') {
        user.saldo += updatedTransaction.amount;
      } else {
        user.saldo -= updatedTransaction.amount;
      }
    }

    await writeDatabase(db);

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar transação' });
  }
});

server.get('/users/:userId/goals', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user || !user.goals) {
      return res.status(404).json({ error: 'Objetivos não encontrados para o usuário' });
    }

    res.status(200).json(user.goals);
  } catch (error) {
    console.error('Erro ao obter objetivos:', error);
    res.status(500).json({ error: 'Erro interno ao obter objetivos' });
  }
});

server.post('/users/:userId/goals', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const goal = req.body;
    goal.id = user.goals.length ? user.goals[user.goals.length - 1].id + 1 : 1;
    user.goals.push(goal);
    await writeDatabase(db);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Erro ao adicionar objetivo:', error);
    res.status(500).json({ error: 'Erro interno ao adicionar objetivo' });
  }
});

server.delete('/users/:userId/goals/:goalId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const goalId = parseInt(req.params.goalId);
    let db = await readDatabase();
    const user = db.users.find(user => user.id === userId);

    if (!user || !user.goals) {
      return res.status(404).json({ error: 'Objetivos não encontrados para o usuário' });
    }

    const goalIndex = user.goals.findIndex(goal => goal.id === goalId);
    if (goalIndex >= 0) {
      user.goals.splice(goalIndex, 1);
      await writeDatabase(db);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Objetivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar objetivo:', error);
    res.status(500).json({ error: 'Erro interno ao deletar objetivo' });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
