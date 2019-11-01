from flask import Flask, jsonify, request
from db.db_error import DbError
from db.tasks import Tasks

class Api:
    def __init__(self, db):
        self.db = db
        self.tasks = Tasks(db)

    def app(self):
        app = Flask(__name__)
        @app.route("/")
        def hello():
            try:
                sql = self.tasks.get_all()
                return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))
            except DbError as error:
                return jsonify(str(error))

        @app.route("/lists")
        def lists():
            try:
                sql = self.tasks.get_lists()
                return jsonify(sql)
            except DbError as error:
                return jsonify(str(error))

        @app.route("/echo", methods=["POST"])
        def echo():
            try:
                res = request.json
                return jsonify(res)
            except error:
                return jsonify(str(error))
        return app
