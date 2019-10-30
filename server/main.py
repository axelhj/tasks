from mysql import connector
from mysql.connector import Error
from flask import Flask, jsonify, request

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

def execute_sql(sql):
    conn = connect()
    if conn != None and conn.is_connected():
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchmany()
        result = []
        while rows:
            result += rows
            rows = cursor.fetchmany()
        return result
    return None

def init_api():
    app = Flask(__name__)

    @app.route("/")
    def hello():
        res = []
        conn = connect()
        if conn != None and conn.is_connected():
            sql = execute_sql('select title, description from task limit 100')
            if not sql:
                return jsonify('error')
            return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))

    @app.route("/echo", methods=["POST"])
    def echo():
        res = request.json
        return jsonify(res)

    app.run(host="0.0.0.0", port=80),

if __name__ == '__main__':
    init_api()
