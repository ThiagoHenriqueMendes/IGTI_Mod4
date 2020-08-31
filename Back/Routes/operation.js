/*testes de mais comentarios*/
import express from 'express';
import mongoose from 'mongoose';
import { error } from 'console';
import { acountModel } from '../Models/accounts.js';
import { isNumber } from 'util';

const modifiedFile = './Files/ModifiedFile/gradesModified.json';
const app = express.Router();

async function OpenConnection() {
  try {
    console.log('Entrou no OpenConnection');
    await mongoose.connect(
      'mongodb+srv://igtiUser:Igti2020@igti.mq8zz.mongodb.net/IGTI?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Conectado no MongoDB');
  } catch (error) {
    console.log('Erro ao conectar no MongoDB - ' + error.message);
  }
}

async function CloseConnection() {
  try {
    console.log('Entrou no CloseConnection');
    await mongoose.connection.close();

    console.log('Conexão finalizada!');
  } catch (error) {
    console.log('Erro ao fechar conexão - ' + error.message);
  }
}

app.post('/deposito', async (_req, _resp, next) => {
  try {
    OpenConnection();
    console.log('POST');
    let body = await _req.body;

    if (Object.keys(body).length === 0)
      _resp.status(400).send({ retorno: 'Requisição sem nenhuma informação' });
    else if (
      !body.hasOwnProperty('agencia') ||
      body.agencia.length === 0 ||
      !isNumber(body.agencia)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "agencia" não informado ou valor vazio' });
    } else if (
      !body.hasOwnProperty('conta') ||
      body.conta.length === 0 ||
      !isNumber(body.conta)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "conta" não informado ou valor vazio' });
    }
    //else if (!body.hasOwnProperty('name') || body.name.length === 0) {
    //   _resp
    //     .status(400)
    //     .send({ retorno: 'parâmetro "name" não informado ou valor vazio' });
    else if (!body.hasOwnProperty('balance') || !isNumber(body.balance)) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "balance" não informado ou valor vazio' });
    }
    const conta = await acountModel.find({
      agencia: body.agencia,
      conta: body.conta,
    });

    if (conta.length === 0)
      _resp.status(500).send({ error: 'CONTA NÃO LOCALIZADA' });
    else {
      conta[0].balance += parseFloat(body.balance);

      const data = await acountModel.findByIdAndUpdate(
        { _id: conta[0]._id },
        conta[0],
        {
          new: true,
        }
      );
      console.log(conta[0]._id);
      _resp.send(data);
      // _resp.send(conta);
    }
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.post('/saque', async (_req, _resp, next) => {
  try {
    OpenConnection();
    console.log('POST');
    let body = await _req.body;

    if (Object.keys(body).length === 0)
      _resp.status(400).send({ retorno: 'Requisição sem nenhuma informação' });
    else if (
      !body.hasOwnProperty('agencia') ||
      body.agencia.length === 0 ||
      !isNumber(body.agencia)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "agencia" não informado ou valor vazio' });
    } else if (
      !body.hasOwnProperty('conta') ||
      body.conta.length === 0 ||
      !isNumber(body.conta)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "conta" não informado ou valor vazio' });
    }
    //else if (!body.hasOwnProperty('name') || body.name.length === 0) {
    //   _resp
    //     .status(400)
    //     .send({ retorno: 'parâmetro "name" não informado ou valor vazio' });
    else if (!body.hasOwnProperty('balance') || !isNumber(body.balance)) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "balance" não informado ou valor vazio' });
    }
    const conta = await acountModel.find({
      agencia: body.agencia,
      conta: body.conta,
    });

    if (conta.length === 0)
      _resp.status(500).send({ error: 'CONTA NÃO LOCALIZADA' });
    else {
      const novoSaldo = conta[0].balance - (1 + parseFloat(body.balance));

      if (novoSaldo < 0)
        _resp.status(500).send({ error: 'SALDO INSUFICIENTE' });
      else {
        conta[0].balance = novoSaldo;

        const data = await acountModel.findByIdAndUpdate(
          { _id: conta[0]._id },
          conta[0],
          {
            new: true,
          }
        );
        console.log(conta[0]._id);
        _resp.send(data);
      }
    }
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.post('/saldo', async (_req, _resp, next) => {
  try {
    OpenConnection();
    console.log('POST');
    let body = await _req.body;

    if (Object.keys(body).length === 0)
      _resp.status(400).send({ retorno: 'Requisição sem nenhuma informação' });
    else if (
      !body.hasOwnProperty('agencia') ||
      body.agencia.length === 0 ||
      !isNumber(body.agencia)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "agencia" não informado ou valor vazio' });
    } else if (
      !body.hasOwnProperty('conta') ||
      body.conta.length === 0 ||
      !isNumber(body.conta)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "conta" não informado ou valor vazio' });
    }
    const conta = await acountModel.find({
      agencia: body.agencia,
      conta: body.conta,
    });

    if (conta.length === 0)
      _resp.status(500).send({ error: 'CONTA NÃO LOCALIZADA' });
    else {
      _resp.send('Saldo atual: ' + conta[0].balance);
    }
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.delete('/desativar', async (_req, _resp, next) => {
  try {
    OpenConnection();
    console.log('POST');
    let body = await _req.body;

    if (Object.keys(body).length === 0)
      _resp.status(400).send({ retorno: 'Requisição sem nenhuma informação' });
    else if (
      !body.hasOwnProperty('agencia') ||
      body.agencia.length === 0 ||
      !isNumber(body.agencia)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "agencia" não informado ou valor vazio' });
    } else if (
      !body.hasOwnProperty('conta') ||
      body.conta.length === 0 ||
      !isNumber(body.conta)
    ) {
      _resp
        .status(400)
        .send({ retorno: 'parâmetro "conta" não informado ou valor vazio' });
    }
    const conta = await acountModel.find({
      agencia: body.agencia,
      conta: body.conta,
    });

    if (conta.length === 0)
      _resp.status(500).send({ error: 'CONTA NÃO LOCALIZADA' });
    else {
      const data = await acountModel.deleteOne({ _id: conta[0]._id });
      _resp.send(data);

      // _resp.send('Conta removida');
    }
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.post('/ccc', async (_req, _resp, next) => {
  try {
    OpenConnection();
    console.log('POST');
    let body = await _req.body;

    if (Object.keys(body).length === 0)
      _resp.status(400).send({ retorno: 'Requisição sem nenhuma informação' });
    else if (
      !body.hasOwnProperty('contaOrigem') ||
      body.contaOrigem.length === 0 ||
      !isNumber(body.contaOrigem)
    ) {
      _resp.status(400).send({
        retorno: 'parâmetro "contaOrigem" não informado ou valor vazio',
      });
    } else if (
      !body.hasOwnProperty('contaDestino') ||
      body.contaDestino.length === 0 ||
      !isNumber(body.contaDestino)
    ) {
      _resp.status(400).send({
        retorno: 'parâmetro "contaDestino" não informado ou valor vazio',
      });
    } else if (
      !body.hasOwnProperty('balanceCCC') ||
      !isNumber(body.balanceCCC)
    ) {
      _resp.status(400).send({
        retorno: 'parâmetro "balanceCCC" não informado ou valor vazio',
      });
    }
    const contaOrigem = await acountModel.find({
      conta: body.contaOrigem,
    });

    const contaDestino = await acountModel.find({
      conta: body.contaDestino,
    });

    if (contaOrigem.length === 0)
      _resp.status(500).send({ error: 'CONTA ORIGEM NÃO LOCALIZADA' });
    else if (contaDestino.length === 0)
      _resp.status(500).send({ error: 'CONTA DESTINO NÃO LOCALIZADA' });
    else {
      let tarifa = 0;
      console.log(contaOrigem);
      console.log(contaDestino);

      if (contaOrigem[0].agencia !== contaDestino[0].agencia) tarifa = 8;
      console.log(tarifa);

      contaOrigem[0].balance -= tarifa + parseFloat(body.balanceCCC);
      contaDestino[0].balance += parseFloat(body.balanceCCC);

      console.log('novos valores');
      console.log(contaOrigem);
      console.log(contaDestino);

      const dataOrigem = await acountModel.findByIdAndUpdate(
        { _id: contaOrigem[0]._id },
        contaOrigem[0],
        {
          new: true,
        }
      );

      const dataDestino = await acountModel.findByIdAndUpdate(
        { _id: contaDestino[0]._id },
        contaDestino[0],
        {
          new: true,
        }
      );
      _resp.send(contaOrigem);
    }
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.get('/', async (_req, _resp, next) => {
  try {
    await OpenConnection();
    console.log('entrou');
    const retults = await acountModel.find();
    console.log(retults.length);
    _resp.send(retults);
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.get('/agencia/:id?/media', async (_req, _resp, next) => {
  try {
    await OpenConnection();
    console.log('ENTROU NO GET');
    let parametro = _req.params;
    const results = await acountModel.aggregate([
      { $match: { agencia: Number(parametro.id) } },
      {
        $group: {
          _id: '$agencia',
          avgBalance: { $avg: '$balance' },
        },
      },
    ]);
    console.log(parametro);
    _resp.send(results);
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.get('/top/:id?/crescente', async (_req, _resp, next) => {
  try {
    let parametro = _req.params;
    // const findAccounts = await Account.aggregate([
    //   { $sort: { balance: 1 } },
    // ]).limit(Number(limit));
    await OpenConnection();
    console.log('entrou');
    const retults = await acountModel
      .find()
      .sort({ balance: Number(1) })
      .limit(Number(parametro.id));
    console.log(retults.length);
    _resp.send(retults);
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.get('/top/:id?/decrescente', async (_req, _resp, next) => {
  try {
    let parametro = _req.params;
    // const findAccounts = await Account.aggregate([
    //   { $sort: { balance: 1 } },
    // ]).limit(Number(limit));
    await OpenConnection();
    console.log('entrou');
    const retults = await acountModel
      .find()
      .sort({ balance: Number(-1) })
      .limit(Number(parametro.id));
    console.log(retults.length);
    _resp.send(retults);
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.get('/private', async (_req, _resp, next) => {
  try {
    await OpenConnection();
    console.log('entrou');
    const distinctAgencia = await acountModel.distinct('agencia');
    console.log(distinctAgencia);

    let results = [];
    let bulk = [];
    for (let index = 0; index < distinctAgencia.length; index++) {
      let account = await acountModel
        .find({ agencia: distinctAgencia[index] })
        .sort({ balance: Number(-1) })
        .limit(1);

      let bulkItem = {
        replaceOne: {
          $filter: { _id: account._id },
          $replacement: { agencia: Number(99) },
        },
      };
      bulk.push(bulkItem);

      results.push(account);
    }
    // let result2 = results.map((account) => {
    //   return {
    //     _id: account[0]._id,
    //     agencia: 99,
    //     conta: account[0].conta,
    //     balance: account[0].balance,
    //   };
    // });
    // for (let index = 0; index < result2.length; index++) {
    //   let bulkItem = {
    //     replaceOne: {
    //       filter: { _id: result2[index]._id },
    //       replacement: { agencia: Number(99) },
    //     },
    //   };
    //   bulk.push(bulkItem);
    // }

    // await acountModel.bulkWrite(bulk);
    console.log('bulk');
    console.log(bulk);
    _resp.send(results);
  } catch (err) {
    next(err);
  } finally {
    CloseConnection();
  }
});

app.use((err, _req, resp, _next) => {
  resp.status(500).send({ error: 'ERRO INTERNO: ' + err.message });
});
export default app;
