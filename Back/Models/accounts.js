import mongoose from 'mongoose';

const acountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    // required: true,
  },
  conta: {
    type: Number,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  balance: {
    type: Number,
    // required: true,
    //Valida se a nota inserida e' menor que zero
    // validate(value) {
    //   if (value < 0) throw new Error('Valor negativo para Balance');
    // },
  },
});

const acountModel = mongoose.model('accounts', acountSchema, 'accounts');

export { acountModel };
