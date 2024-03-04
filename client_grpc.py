import grpc
import checking_cheque_pb2
import checking_cheque_pb2_grpc
import execjs
import checking_installment_pb2_grpc
import checking_installment_pb2
# import checking_installment_pb


with open("checking_installment_pb.js", "r") as file:
    javascript_code = file.read()

ctx = execjs.compile(javascript_code)


def check_installment(national_code):
    channel = grpc.insecure_channel('localhost:50052')
    stub = ctx.call("CheckingInstallmentServiceStub", channel)
    # stub = checking_installment_pb.CheckingInstallmentServiceStub(channel)
    request = ctx.CheckInstallmentRequest(national_code=national_code)
    try:
        response = stub.CheckInstallment(request)
        print("Response:", response)
    except grpc.RpcError as e:
        print(f"Error occurred: {e}")


def get_installment_ids(national_code):
    channel = grpc.insecure_channel('[::1]:50052')
    stub = checking_installment_pb2_grpc.CheckingInstallmentServiceStub(channel)
    response = stub.CheckInstallment(checking_installment_pb2.CheckInstallmentRequest(national_code=national_code))
    if response.installment_ids:
        print("Installment IDs:", response.installment_ids)
    print("Message:", response.message)


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
