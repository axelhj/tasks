from mysql import connector
from mysql.connector import Error

def get_obj(rows, fields):
    if fields:
        result = []
        for row in rows:
            obj = {}
            for i, field in enumerate(row, start=0):
                obj[fields[i]] = field
            result.append(obj)
        return result
    else:
        return rows

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

    def sql(self, sql, fields = None, fetch = True):
        try:
            conn = self.connect()
            if conn == None or not conn.is_connected():
                return None
            cursor = conn.cursor()
            cursor.execute(sql)
            if not fetch:
                return None
            rows = cursor.fetchmany()
            result = []
            while rows:
                result += get_obj(rows, fields)
                rows = cursor.fetchmany()
            return result
        finally:
            if conn and conn.is_connected():
                if cursor:
                    cursor.close()
                conn.close()

    def prepared_sql(self, sql, values = [], fetch = True):
        conn = None
        cursor = None
        try:
            conn = self.connect()
            if conn == None or not conn.is_connected():
                return None
            cursor = conn.cursor(prepared = True)
            cursor.execute(sql, values)
            if not fetch:
                return None
            rows = cursor.fetchmany()
            result = []
            while rows:
                result += get_obj(rows, fields)
                rows = cursor.fetchmany()
            return result
        finally:
            if conn and conn.is_connected():
                if cursor:
                    cursor.close()
                conn.close()
