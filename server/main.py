from os import environ, getcwd, path
from dotenv import load_dotenv
from db.db import Db
from api.api import Api

env_path = path.join(getcwd(), ".env")
if path.isfile(env_path):
    load_dotenv(env_path)

hostname = environ.get('SQL_HOSTNAME')
unix_socket = environ.get('SQL_CONNECTION_NAME')
database = environ.get('SQL_DATABASE_NAME')
user = environ.get('SQL_USERNAME')
password = environ.get('SQL_PASSWORD')

db = Db(hostname, database, user, password, unix_socket)
api = Api(db)
app = api.app()

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080),
