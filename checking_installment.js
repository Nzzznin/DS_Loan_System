const readline = require('readline');
const { Client } = require('pg');
const fs = require('fs');
const { connectToDatabase } = require('./db_connection.js');
const { checkingNationalCodeExistence } = require('./national_code_existence.js')

require('dotenv').config({ path: 'D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\envs\\\\db.env' });

function checkNationalCode(nationalCode) {
  return checkingNationalCodeExistence(nationalCode)
    .then(result => {
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
      // Execute SQL queries here
      const sql = fs.readFileSync('D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\db\\\\checking_installment.sql', 'utf-8');
      return client.query(sql, [nationalCode])
        .then(res => {
          // Extract ID values from the result rows
          const ids = res.rows.map(row => row.id);
          if (ids.length > 0) {
            console.log(ids);
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
  return checkNationalCode(nationalCode)
    .then(result => {
      if (result === true) {
        // Call checkingInstallmentByNationalCode function if the national code exists
        return checkingInstallmentByNationalCode(nationalCode);
      } else {
        // Return a message indicating that the national code does not exist
        return "National code does not exist in the database";
      }
    })
    .catch(error => {
      console.error('Error occurred while checking national code:', error);
      return null; // Return null if an error occurs
    });
}
