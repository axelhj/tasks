from mysql import connector
from mysql.connector import Error
from db.db_error import DbError

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
    def __init__(self, host, database, user, password, unix_socket = None):
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.unix_socket = unix_socket

    def connect(self):
        try:
            if self.host:
                return connector.connect(
                    host = self.host,
                    database = self.database,
                    user = self.user,
                    password = self.password
                )
            else:
                return connector.connect(
                    unix_socket = self.unix_socket,
                    database = self.database,
                    user = self.user,
                    password = self.password
                )
        except Error as error:
            raise DbError(error)

    def sql_nested_list(self, sql, fields, sub_key, id_index, nested_id_index, split_index, prepared_values = None):
        conn = None
        try:
            conn = self.connect()
            if conn == None or not conn.is_connected():
                raise DbError("Could not establish connection to " + str(self.host))
            cursor = conn.cursor() if prepared_values else conn.cursor(prepared = True)
            if prepared_values:
                cursor.execute(sql, prepared_values)
            else:
                cursor.execute(sql)
            rows = cursor.fetchmany()
            ids = {}
            groups = []
            while rows:
                for row in rows:
                    id = row[id_index]
                    ids[id] = True
                    last_group = None
                    if len(groups) > 0:
                        last_group = groups[len(groups) - 1]
                    sub_obj = get_obj([row[split_index:]], fields[split_index:])[0]
                    if last_group and id == last_group[fields[id_index]]:
                        last_group[sub_key].append(sub_obj)
                    else:
                        obj = get_obj([row[:split_index]], fields)[0]
                        if row[nested_id_index]:
                            obj[sub_key] = [sub_obj]
                        else:
                            obj[sub_key] = []
                        groups.append(obj)
                rows = cursor.fetchmany()
            # len(keys(ids))) should match len(groups)
            return groups
        except Error as error:
            raise DbError(error)
        finally:
            if conn and conn.is_connected():
                if cursor:
                    cursor.close()
                conn.close()

    def sql(self, sql, fields = None, fetch = True, persisting = False):
        conn = None
        try:
            conn = self.connect()
            if conn == None or not conn.is_connected():
                raise DbError("Could not establish connection to " + str(self.host))
            cursor = conn.cursor()
            cursor.execute(sql)
            if persisting:
                conn.commit()
                return cursor.lastrowid
            if not fetch:
                return None
            rows = cursor.fetchmany()
            result = []
            while rows:
                result += get_obj(rows, fields)
                rows = cursor.fetchmany()
            return result
        except Error as error:
            if persisting  and conn and conn.is_connected():
                conn.rollback()
            raise DbError(error)
        finally:
            if conn and conn.is_connected():
                if cursor:
                    cursor.close()
                conn.close()

    def prepared_sql(self, sql, values = [], fetch = True, persisting = False):
        conn = None
        cursor = None
        try:
            conn = self.connect()
            if conn == None or not conn.is_connected():
                raise DbError("Could not establish connection to " + str(self.host))
            cursor = conn.cursor(prepared = True)
            cursor.execute(sql, values)
            if persisting:
                conn.commit()
                return cursor.lastrowid
            if not fetch:
                return None
            rows = cursor.fetchmany()
            result = []
            while rows:
                result += get_obj(rows, fields)
                rows = cursor.fetchmany()
            return result
        except Error as error:
            if persisting and conn and conn.is_connected():
                conn.rollback()
            raise DbError(error)
        finally:
            if conn and conn.is_connected():
                if cursor:
                    cursor.close()
                conn.close()
