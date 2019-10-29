from mysql import connector
from mysql.connector import Error
from flask import Flask, jsonify

def connect():
    try:
        return connector.connect(
            host='localhost',
            database='Tasks',
            user='user',
            password='local_dev_password_is_unset'
        )
    except Error as error:
        print(error)
        return None

app = None
def init_api():
    app = Flask(__name__)

    @app.route("/")
    def hello():
        res = []
        conn = connect()
        if conn != None and conn.is_connected():
            print("connecting succeeded")
            cursor = conn.cursor()
            cursor.execute('select title, description from task limit 100')
            rows = cursor.fetchmany()
            while rows:
                for row in rows:
                    res.append(row[0] + ": " + row[1])
                rows = cursor.fetchmany()
        return jsonify(res)

    app.run(host="0.0.0.0", port=80),

if __name__ == '__main__':
    init_api()
