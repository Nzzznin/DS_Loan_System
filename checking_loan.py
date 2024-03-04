import grpc
import checking_cheque_pb2
import checking_cheque_pb2_grpc


def get_cheque_ids(national_code):
    channel = grpc.insecure_channel('[::1]:50051')
    stub = checking_cheque_pb2_grpc.ChequeServiceStub(channel)
    response = stub.Check(checking_cheque_pb2.CheckRequest(national_code=national_code))
    if response.cheque_ids:
        print("Cheque IDs:", response.cheque_ids)
    print("Message:", response.message)


if __name__ == '__main__':
    national_code = input("Enter national code: ")
    get_cheque_ids(national_code)
