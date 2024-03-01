from db_connection import database_connection
from national_code_existence import checking_national_code_existence


def checking_national_code(national_code):
    try:
        connection = database_connection()
        if connection:
            result_check_national_code = checking_national_code_existence(national_code)
            if result_check_national_code == national_code:
                return True
            else:
                return False
    except Exception as e:
        print("An error occurred while checking : " ,e)
        return None


def checking_cheque(national_code):
    try:
        connection = database_connection()
        if connection:
            cursor = connection.cursor()
            query_path = "D:\\Projects\\DS_Project\\DS1\\DS_Loan_Sytem\\db\\checking_cheque.sql"

            # Read the contents of the SQL file
            with open(query_path, 'r') as file:
                query = file.read()

            # Execute the query with the nationalCode parameter
            cursor.execute(query, (national_code,))
            result = cursor.fetchall()

            # Check if the result is None (no data found)
            if len(result) == 0:
                print("Does not have any cheque IDs")
                return 'No'
            else:
                Cheque_list = []
                # Iterate through the result and append cheque IDs to the list
                for Cheque in result:
                    Cheque_list.append(Cheque[0])
                print(Cheque_list)

                connection.close()
                print("Connection closed")

                return Cheque_list

    except Exception as e:
        # Handle any exceptions that occur during database operations
        print("An error occurred:", e)
        return None


def check(national_code):
    check_result = checking_national_code(national_code)
    if check_result:
        return checking_cheque(national_code)
    else:
        return 'National Code Not Found'



