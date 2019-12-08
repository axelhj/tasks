from os import environ
from db.db import Db
from api.api import Api

def get_env(key, default = None):
    return environ[key] if key in environ else default

def get_connection_details():
    unix_socket = get_env('CLOUD_SQL_CONNECTION_NAME')
    database = get_env('CLOUD_SQL_DATABASE_NAME')
    user = get_env('CLOUD_SQL_USERNAME')
    password = get_env('CLOUD_SQL_PASSWORD')
    if unix_socket:
        return {
            'unix_socket': unix_socket,
            'database': database,
            'user': user,
            'password': password
        }
    else:
        return {
            'host': 'localhost',
            'database': 'Tasks',
            'user': 'user',
            'password': 'local_dev_password_is_unset'
        }

connection_details = get_connection_details()
db = Db(
    connection_details['host'] \
        if 'host' in connection_details \
            else None,
    connection_details['database'],
    connection_details['user'],
    connection_details['password'],
    connection_details['unix_socket'] \
        if 'unix_socket' in connection_details \
            else None
)
api = Api(db)
app = api.app()

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080),
