import grpc
import checking_cheque_pb2
import checking_cheque_pb2_grpc
import xmlrpc.client


def installment(national_code):
    installment_server = xmlrpc.client.ServerProxy("http://localhost:8001")
    installment_verify = installment_server.check(national_code)  # Pass national_code as the parameter
    return installment_verify


def cheque(national_code):
    channel = grpc.insecure_channel('0.0.0.0:50051')
    stub = checking_cheque_pb2_grpc.ChequeServiceStub(channel)
    response = stub.Check(checking_cheque_pb2.CheckRequest(national_code=national_code))
    if response.cheque_ids:
        return response.cheque_ids
    else:
        return response.message


def check_loan(national_code):
    if installment(national_code) == 'No' and cheque(national_code) == 'No':
        return 'Yes, You can get loan'
    elif installment(national_code) == 'National code does not exist in the database' and cheque(national_code) == 'National Code Not Found':
        return 'National Code Not Found'
    else:
        return 'No, You can not get loan'


if __name__ == '__main__':
    national_code = input("Enter national code: ")
    loan_result = check_loan(national_code)
    print(loan_result)
