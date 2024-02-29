from db_connection import database_connection


def checking_nationalCode_existance(nationalCode):
    try:
        connection = database_connection()
        if connection:
            cursor = connection.cursor()
            query_path = "D:\\Projects\\DS_Project\\DS1\\DS_Loan_Sytem\\db\\nationalCode_existance.sql"

            # Read the contents of the SQL file
            with open(query_path, 'r') as file:
                query = file.read()

            # Execute the query with the nationalCode parameter
            cursor.execute(query, (nationalCode,))
            result = cursor.fetchall()

            # Check if the result is None (no data found)
            if len(result) == 0:
                return "%s Not Exist in Client List" % nationalCode
            elif result[0][0] == nationalCode:
                return nationalCode

    except Exception as e:
        # Handle any exceptions that occur during database operations
        print("An error occurred:", e)
        return None


# if __name__ == "__main__":
#     print(checking_nationalCode_existance('0690776225'))
