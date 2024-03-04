const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { check } = require('./checking_installment.js');

const PROTO_PATH = __dirname + '/checking_installment.proto';

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const checkingInstallmentProto = grpc.loadPackageDefinition(packageDefinition);

function checkInstallment(call, callback) {
  const nationalCode = call.request.national_code;

  check(nationalCode)
    .then(result => {
      const response = {
        ids: result === 'No' ? [] : result,
        message: typeof result === 'string' ? result : ''
      };
      callback(null, response);
    })
    .catch(error => {
      console.error('Error occurred:', error);
      callback(error, null);
    });
}

function main() {
  const server = new grpc.Server();
  // Access the service definition from the loaded proto file
  server.addService(checkingInstallmentProto.checking_installment.CheckingInstallmentService.service, { checkInstallment });
  server.bindAsync('localhost:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://localhost:50051');
    server.start();
  });
}

main();
