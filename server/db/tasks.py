class Tasks:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.sql('select title, description from task limit 100')

    def get_lists(self):
        return self.db.sql('''
select l.id as id, name, t.title as title, t.description as description from list as l
inner join task_in_list as tl on l.id = tl.list_id
inner join task as t on t.id = tl.task_id
limit 100''',
'id,name,title,description'.split(','))
