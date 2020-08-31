import express from 'express';
import mongoose from 'mongoose';
import operationRoute from './Routes/operation.js';

// (async () => {
//   try {
//     console.log('Entrou no OpenConnection');
//     await mongoose.connect(
//       'mongodb+srv://igtiUser:Igti2020@igti.mq8zz.mongodb.net/IGTI?retryWrites=true&w=majority',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log('Conectado no MongoDB');
//   } catch (error) {
//     console.log('Erro ao conectar no MongoDB - ' + error.message);
//   }
// })();
require('dotenv').config;

const app = express();
//estamos informando o express que iremos utilizar json
app.use(express.json());
app.use('/operation', operationRoute);

app.listen(process.env.PORT, () => {
  console.log('API funcionando');
});

/*comentario*/
