import grpc
import checking_cheque_pb2
import checking_cheque_pb2_grpc
from checking_cheque import check
from concurrent import futures


class ChequeServicer(checking_cheque_pb2_grpc.ChequeServiceServicer):
    def Check(self, request, context):
        national_code = request.national_code
        print('Received Check request for national code: %s' %national_code)
        result = check(national_code)

        response = checking_cheque_pb2.ChequeResponse()
        if isinstance(result, list):
            response.cheque_ids.extend(result)
            print('Check result: Cheque IDs found: %s' %result)
        else:
            response.message = result
            print('Check result: %s' %result)
        return response


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    checking_cheque_pb2_grpc.add_ChequeServiceServicer_to_server(ChequeServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    server.start()
    print('Server started listening on port 50051...')
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
