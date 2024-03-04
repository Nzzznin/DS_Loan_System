const readline = require('readline');
const { Client } = require('pg');
const fs = require('fs');
const { connectToDatabase } = require('./db_connection.js');
const { checkingNationalCodeExistence } = require('./national_code_existence.js')

require('dotenv').config({ path: 'D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\envs\\\\db.env' });

function checkNationalCode(nationalCode) {
  console.log('Checking national code:', nationalCode);
  return checkingNationalCodeExistence(nationalCode)
    .then(result => {
      console.log('National code check result:', result);
      return result === nationalCode; // Return true if the national code exists, false otherwise
    })
    .catch(error => {
      console.error('Error occurred while checking national code:', error);
      return false; // Return false if an error occurs
    });
}

function checkingInstallmentByNationalCode(nationalCode) {
  return connectToDatabase()
    .then((client) => {
      console.log('Connected to database');
      // Execute SQL queries here
      const sql = fs.readFileSync('D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\db\\\\checking_installment.sql', 'utf-8');
      return client.query(sql, [nationalCode])
        .then(res => {
          console.log('Query result:', res.rows);
          // Extract ID values from the result rows
          const ids = res.rows.map(row => row.id);
          if (ids.length > 0) {
            console.log('IDs found:', ids);
            return ids;
          } else {
            console.log('No results found for the given national code.');
            return 'No';
          }
        })
        .catch(err => {
          console.error('Error executing query:', err);
          throw err; // Re-throw the error to be handled by the caller
        })
        .finally(() => {
          // Close the connection when done
          client.end()
            .then(() => {
              console.log('Connection to PostgreSQL closed');
            })
            .catch((err) => {
              console.error('Error closing connection', err);
            });
        });
    });
}

function check(nationalCode) {
  console.log('Checking national code:', nationalCode);
  return checkNationalCode(nationalCode)
    .then(result => {
      console.log('National code check result:', result);
      if (result === true) {
        // Call checkingInstallmentByNationalCode function if the national code exists
        return checkingInstallmentByNationalCode(nationalCode);
      } else {
        // Return a message indicating that the national code does not exist
        console.log('National code does not exist in the database');
        return "National code does not exist in the database";
      }
    })
    .catch(error => {
      console.error('Error occurred while checking national code:', error);
      return null; // Return null if an error occurs
    });
}

var xmlrpc = require('xmlrpc');
const server = xmlrpc.createServer({ host: 'localhost', port: 8001 });

server.on('check', function (err, params, callback) {
    const [nationalCode] = params; // Extracting nationalCode from params array
    console.log('Received check request with national code:', nationalCode);

    check(nationalCode)
        .then(result => {
            console.log('Sending result to client:', result);
            callback(null, result);
        })
        .catch(error => {
            console.error('Error occurred while checking national code:', error);
            callback(error);
        });
});

console.log('XML-RPC server is listening on port 8001...');