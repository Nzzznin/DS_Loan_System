const { connectToDatabase } = require('./db_connection.js');
const fs = require('fs');

function checkingNationalCodeExistence(nationalCode) {
  return connectToDatabase()
    .then((client) => {
      const queryPath = 'D:\\\\Projects\\\\DS_Project\\\\DS1\\\\DS_Loan_Sytem\\\\db\\\\checking_national_code_existence_2.sql';
      const query = fs.readFileSync(queryPath, 'utf-8');

      return client.query(query, [nationalCode])
        .then(res => {
          if (res.rows.length === 0) {
            return `${nationalCode} Not Exist in Client List`;
          } else {
            const foundNationalCode = res.rows[0].national_code;
            if (foundNationalCode === nationalCode) {
              return nationalCode;
            } else {
              return null; // Return null if the found national code does not match the input
            }
          }
        })
        .catch(err => {
          console.error('Error executing query:', err);
          return null; // Return null if an error occurs
        })
        .finally(() => {
          client.end()
            .then(() => {
              console.log('Connection to PostgreSQL closed');
            })
            .catch((err) => {
              console.error('Error closing connection', err);
            });
        });
    })
    .catch(err => {
      console.error('Error connecting to database:', err);
      return null; // Return null if an error occurs
    });
}

module.exports = {
  checkingNationalCodeExistence: checkingNationalCodeExistence
};

// // Example usage:
// checkingNationalCodeExistence('0690776225')
//   .then(result => {
//     console.log(result);
//   });
