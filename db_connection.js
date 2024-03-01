const { Client } = require('pg');

require('dotenv').config({ path: 'D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\envs\\\\db.env' });

function connectToDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  return client.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');
      return client;
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database', err);
      throw err; // Re-throw the error to be handled by the caller
    });
}

module.exports = {
  connectToDatabase: connectToDatabase
};
