import os
from dotenv import load_dotenv
import logging
import psycopg2

# Configure logging
logging.basicConfig(filename='D:\\Projects\\DS_Project\\DS1\\DS_Loan_Sytem\\logs\\db_connection.log',
                    level=logging.DEBUG,
                    format='%(asctime)s - %(process)d : %(levelname)s - %(name)s - %(message)s')

# Specify the path to the .env file
dotenv_path = 'D:\\Projects\\DS_Project\\DS1\\DS_Loan_Sytem\\envs\\db.env'

# Load environment variables from .env file
load_dotenv(dotenv_path)

# Get database configuration from environment variables
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")


def database_connection():
    try:
        connection = psycopg2.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name
        )
        if connection:
            logging.info("Connected to database")
            # print("Connected to database")
        else:
            logging.error("Failed to connect to database")
            # print("Failed to connect to database")
        return connection
    except Exception as e:
        logging.error("An error occurred while connecting to the database: %s", e)
        print("An error occurred:", e)
        return None


# if __name__ == "__main__":
#     db_connection_result = database_connection()
