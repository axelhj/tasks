from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from db.db_error import DbError
from db.tasks import Tasks
import os

class Api:
    def __init__(self, db):
        self.db = db
        self.tasks = Tasks(db)

    def app(self, base_url=''):
        cwd = os.getcwd()
        app = Flask(__name__, static_folder = os.path.join(cwd, "static"), static_url_path='/')
        CORS(app)
        @app.route(base_url + "/")
        def hello():
            try:
                sql = self.tasks.get_all()
                return jsonify(list(map(lambda x: x[0] + ": " + x[1], sql)))
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/lists", methods=["GET"])
        def get_lists():
            try:
                sql = self.tasks.get_lists()
                return jsonify(sql)
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/lists/<id>", methods=["GET"])
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

        @app.route(base_url + "/lists/<id>", methods=["POST"])
        def update_list(id):
            try:
                req = request.json
                if not req:
                    return Response("Request body missing", status=400)
                name = req['name']
                if not name:
                    return Response("The task list name must be supplied", status=400)
                id = self.tasks.add_or_update_list(id, name)
                return jsonify({ "result": 'OK', "id": id })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/lists/<id>/delete", methods=["POST"])
        @app.route(base_url + "/lists/<id>", methods=["DELETE"])
        def delete_list(id):
            try:
                self.tasks.del_list(id)
                return jsonify({ "result": 'OK', "operation": 'delete', "id": id })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/lists", methods=["POST"])
        def add_list():
            try:
                req = request.json
                if not req:
                    return Response("Request body missing", status=400)
                name = req['name']
                if not name:
                    return Response("The task list name must be supplied", status=400)
                result = self.tasks.add_or_update_list(None, req["name"])
                return jsonify({ "result": 'OK', "id": result })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/tasks", methods=["GET"])
        def get_tasks():
            try:
                return jsonify(self.tasks.get_tasks())
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/tasks/<id>", methods=["POST"])
        def update_task(id):
            try:
                req = request.json
                if not req:
                    return Response("Request body missing", status=400)
                list_id = None
                title = None
                description = None
                members = []
                if 'list' in req:
                    list_id = req['list']
                if 'members' in req:
                    members = req['members']
                try:
                    title = req['title']
                    description = req['description']
                except:
                    return Response("The title and description must be supplied", status=400)
                self.tasks.add_or_update_task(id, title, description, members, list_id)
                return jsonify({ "result": 'OK', "id": id })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/tasks/<id>/delete", methods=["POST"])
        @app.route(base_url + "/tasks/<id>", methods=["DELETE"])
        def delete_task(id):
            try:
                self.tasks.del_task(id)
                return jsonify({ "result": 'OK', "operation": 'delete', "id": id })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/tasks", methods=["POST"])
        def add_task():
            try:
                req = request.json
                if not req:
                    return Response("Request body missing", status=400)
                list_id = None
                title = None
                description = None
                members = []
                if 'members' in req:
                    members = req['members']
                try:
                    list_id = req['list']
                    title = req['title']
                    description = req['description']
                except:
                    return Response("The list id, title and description must be supplied", status=400)
                result = self.tasks.add_or_update_task(None, title, description, members, list_id)
                return jsonify({ "result": 'OK', "id": result })
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/users", methods=["GET"])
        def get_users():
            try:
                return jsonify(self.tasks.get_users())
            except DbError as error:
                return jsonify(str(error)), 500

        @app.route(base_url + "/echo", methods=["POST"])
        def echo():
            try:
                res = request.json
                return jsonify(res)
            except error:
                return jsonify(str(error)), 500
        return app
