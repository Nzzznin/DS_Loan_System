from db_connection import database_connection


def checking_national_code_existence(national_code):
    try:
        connection = database_connection()
        if connection:
            cursor = connection.cursor()
            query_path = "D:\\Projects\\DS_Project\\DS1\\DS_Loan_Sytem\\db\\checking_national_code_existence.sql"

            # Read the contents of the SQL file
            with open(query_path, 'r') as file:
                query = file.read()

            # Execute the query with the nationalCode parameter
            cursor.execute(query, (national_code,))
            result = cursor.fetchall()

            # Check if the result is None (no data found)
            if len(result) == 0:
                return "%s Not Exist in Client List" % national_code
            elif result[0][0] == national_code:
                return national_code

    except Exception as e:
        # Handle any exceptions that occur during database operations
        print("An error occurred:", e)
        return None
