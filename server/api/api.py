from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from db.db_error import DbError
from db.tasks import Tasks

class Api:
    def __init__(self, db):
        self.db = db
        self.tasks = Tasks(db)

    def app(self):
        app = Flask(__name__)
        CORS(app)
        @app.route("/")
        def hello():
            try:
                sql = self.tasks.get_all()
                return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/lists", methods=["GET"])
        def get_lists():
            try:
                sql = self.tasks.get_lists()
                return jsonify(sql)
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/lists/<id>", methods=["GET"])
        def get_list(id):
            try:
                if not id:
                    return Response("Id missing", status=400)
                result = self.tasks.get_list(id)
                if result == "NOT_FOUND":
                    return Response("List not found", status=404)
                return jsonify(result)
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/lists/<id>", methods=["POST"])
        def update_list(id):
            try:
                req = request.json
                if not req or not req["name"]:
                    return Response("Request body missing or bad", status=400)
                result = self.tasks.add_or_update_list(id, req["name"])
                return jsonify({ "result": 'OK', "id": result })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/lists", methods=["POST"])
        def add_list():
            try:
                req = request.json
                if not req or not req["name"]:
                    return Response("Request body missing or bad", status=400)
                result = self.tasks.add_or_update_list(None, req["name"])
                return jsonify({ "result": 'OK', "id": result })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/users", methods=["GET"])
        def get_users():
            try:
                return jsonify(self.tasks.get_users())
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route("/echo", methods=["POST"])
        def echo():
            try:
                res = request.json
                return jsonify(res)
            except error:
                return jsonify(str(error)), 500
        return app
