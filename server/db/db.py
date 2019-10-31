from mysql import connector
from mysql.connector import Error

class Db:
    def __init__(self, host, database, user, password):
        self.host = host
        self.database = database
        self.user = user
        self.password = password

    def connect(self):
        try:
            return connector.connect(
                host = self.host,
                database = self.database,
                user = self.user,
                password = self.password
            )
        except Error as error:
            print("Db-error: " + str(error))
            return None

    def execute_sql(self, sql):
        conn = self.connect()
        if conn == None or not conn.is_connected():
            return None
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchmany()
        result = []
        while rows:
            result += rows
            rows = cursor.fetchmany()
        return result
