const readline = require('readline');
const { Client } = require('pg');
const fs = require('fs');

require('dotenv').config({ path: 'D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\envs\\\\db.env' });

function checkingInstallmentByNationalCode(nationalCode) {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  // Connect to the database
  client.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');

      // Execute SQL queries here
      const sql = fs.readFileSync('D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\db\\\\checking_installment.sql', 'utf-8');
      client.query(sql, [nationalCode])
        .then(res => {
          // Extract ID values from the result rows
          const ids = res.rows.map(row => row.id);

          console.log('Query results:', ids);

          // Close the connection when done
          client.end()
            .then(() => {
              console.log('Connection to PostgreSQL closed');
            })
            .catch((err) => {
              console.error('Error closing connection', err);
            });
        })
        .catch(err => console.error('Error executing query:', err));
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database', err);
    });
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for input
rl.question('Enter national code: ', (nationalCode) => {
  // Close readline interface
  rl.close();

  // Call the function with user input
  checkingInstallmentByNationalCode(nationalCode);
});
