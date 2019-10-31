from flask import Flask, jsonify, request

class Api:
    def __init__(self, db):
        self.db = db

    def app(self):
        app = Flask(__name__)
        @app.route("/")
        def hello():
            res = []
            sql = self.db.execute_sql('select title, description from task limit 100')
            if not sql:
                return jsonify('error')
            return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))

        @app.route("/echo", methods=["POST"])
        def echo():
            res = request.json
            return jsonify(res)
        return app
