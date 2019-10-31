from db.db import Db
from api.api import Api

connection_details = {
    'host': 'localhost',
    'database': 'Tasks',
    'user': 'user',
    'password': 'local_dev_password_is_unset'
}

if __name__ == '__main__':
    db = Db(
        connection_details['host'],
        connection_details['database'],
        connection_details['user'],
        connection_details['password']
    )
    api = Api(db)
    api.app().run(host="0.0.0.0", port=80),
