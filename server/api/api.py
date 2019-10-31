from flask import Flask, jsonify, request
from db.tasks import Tasks

class Api:
    def __init__(self, db):
        self.db = db
        self.tasks = Tasks(db)

    def app(self):
        app = Flask(__name__)
        @app.route("/")
        def hello():
            res = []
            sql = self.tasks.get_all()
            if not sql:
                return jsonify('error')
            return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))

        @app.route("/echo", methods=["POST"])
        def echo():
            res = request.json
            return jsonify(res)
        return app
