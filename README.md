# Distributed Loan Eligibility System

A distributed-systems project that decides whether a bank customer can get a loan. The decision is made by combining two independent services — written in **different languages** and talking over **different RPC protocols** — that share a **PostgreSQL** database.

A customer is eligible only if they have **no outstanding cheques** and **no unpaid installments**.

## Architecture

```
                         ┌──────────────────────────────┐
                         │      checking_loan.py        │
                         │   (Python client / decider)  │
                         └───────┬──────────────┬───────┘
                      gRPC :50051│              │XML-RPC :8001
                                 ▼              ▼
              ┌──────────────────────┐   ┌──────────────────────────┐
              │   Cheque service     │   │   Installment service    │
              │  Python · gRPC       │   │  Node.js · XML-RPC/gRPC  │
              │  cheque_server.py    │   │  checking_installment.js │
              └──────────┬───────────┘   └────────────┬─────────────┘
                         │                            │
                         └──────────┬─────────────────┘
                                    ▼
                           ┌─────────────────┐
                           │   PostgreSQL    │
                           │ client, cheque, │
                           │  installment    │
                           └─────────────────┘
```

| Component | Language | Protocol / port | What it does |
|---|---|---|---|
| `cheque_server.py` | Python | gRPC · `50051` | Returns the IDs of a client's unpaid cheques (`status = 0`) |
| `checking_installment.js` | Node.js | XML-RPC · `8001` | Returns the IDs of a client's unpaid installments |
| `installment_server.js` | Node.js | gRPC · `50052` | gRPC version of the installment check |
| `checking_loan.py` | Python | client | Queries both services and makes the loan decision |
| `client_grpc.py` | Python | client | Stand-alone gRPC client for testing the services |

### Decision logic

| Cheque service | Installment service | Result |
|---|---|---|
| No unpaid cheques | No unpaid installments | ✅ `Yes, You can get loan` |
| National code not found | National code not found | `National Code Not Found` |
| anything else | anything else | ❌ `No, You can not get loan` |

Both services first check that the national code exists in the `client` table before looking for unpaid items.

## gRPC contracts

```proto
// checking_cheque.proto
service ChequeService {
  rpc Check(CheckRequest) returns (ChequeResponse);
}
message CheckRequest   { string national_code = 1; }
message ChequeResponse { repeated int32 cheque_ids = 1; string message = 2; }

// checking_installment.proto
service CheckingInstallmentService {
  rpc CheckInstallment(CheckInstallmentRequest) returns (CheckInstallmentResponse);
}
message CheckInstallmentRequest  { string national_code = 1; }
message CheckInstallmentResponse { repeated int32 ids = 1; string message = 2; }
```

## Database

The services expect three tables: `client` (with `national_code`), `cheque` (with `debtor_id`, `status`) and `installment` (with `client_id`, `status`). The queries live in [`db/`](db):

```sql
-- unpaid cheques
SELECT ch.ID FROM cheque ch
INNER JOIN client c ON c.ID = ch.debtor_id
WHERE ch.status = 0 AND c.national_code = %s;

-- unpaid installments
SELECT i.ID FROM installment i
INNER JOIN client c ON i.client_id = c.ID
WHERE i.status = 0 AND c.national_code = $1;
```

## Getting started

### Prerequisites
- Python 3.9+
- Node.js 14+
- PostgreSQL

### 1. Configure the database connection

Create `envs/db.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

> **Note:** the `.env` path, the log path and the SQL query paths are currently hard-coded as absolute Windows paths in `db_connection.py`, `db_connection.js`, `checking_cheque.py`, `checking_installment.js` and `national_code_existence.*`. Update them to match where you cloned the project.

### 2. Install dependencies

```bash
# Python
pip install grpcio grpcio-tools psycopg2-binary python-dotenv

# Node.js
npm install pg dotenv xmlrpc @grpc/grpc-js @grpc/proto-loader
```

### 3. Start the services

```bash
python cheque_server.py            # Cheque service      → gRPC :50051
node checking_installment.js       # Installment service → XML-RPC :8001
```

### 4. Check a customer

```bash
python checking_loan.py
# Enter national code: 0012345678
# Yes, You can get loan
```

### Regenerating gRPC stubs

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. checking_cheque.proto
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. checking_installment.proto
```

## Docker

Dockerfiles for each service are in [`dockerfiles/`](dockerfiles):

```bash
docker build -f dockerfiles/Dockerfile_Cheque      -t loan-cheque .
docker build -f dockerfiles/Dockerfile_installment -t loan-installment .
docker build -f dockerfiles/Dockerfile_loan        -t loan-client .
```

## Project structure

```
DS_Loan_System/
├── checking_cheque.proto / *_pb2*.py        # Cheque gRPC contract + generated stubs
├── checking_installment.proto / *_pb*.js|py # Installment gRPC contract + generated stubs
├── cheque_server.py                         # Cheque gRPC server
├── checking_cheque.py                       # Cheque business logic
├── checking_installment.js                  # Installment logic + XML-RPC server
├── installment_server.js                    # Installment gRPC server
├── checking_loan.py                         # Loan decision client
├── client_grpc.py                           # Test client
├── national_code_existence.py / .js         # Client lookup helpers
├── db_connection.py / .js                   # PostgreSQL connection
├── db/                                      # SQL queries
└── dockerfiles/                             # One Dockerfile per service
```
