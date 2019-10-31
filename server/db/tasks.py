class Tasks:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.sql('select title, description from task limit 100')
