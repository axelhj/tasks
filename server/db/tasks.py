class Tasks:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.sql('select title, description from task limit 100')

    def get_lists(self):
        return self.db.sql_nested_list('''
select l.id as id, name, t.id as id2, t.title as title, t.description as description from list as l
left join task_in_list as tl on l.id = tl.list_id
left join task as t on t.id = tl.task_id
order by id
limit 100''',
            'id,name,id,title,description'.split(','),
            'tasks',
            0,
            2,
            2
        )

    def get_list(self, id):
        list = self.db.sql_nested_list('''
select l.id as id, name, t.id as id2, t.title as title, t.description as description from list as l
left join task_in_list as tl on l.id = tl.list_id
left join task as t on t.id = tl.task_id
order by id
limit 1''',
            'id,name,id,title,description'.split(','),
            'tasks',
            0,
            2,
            2
        )
        if len(list) != 1:
            return "NOT_FOUND"
        return list[0]

    def add_or_update_list(self, id, name, sort_order = None):
        if id:
            self.db.prepared_sql('''
    insert into list (name) value (%s) where id = %s
    ''',
                [name, id],
                False
            )
        else:
            self.db.prepared_sql('''
    insert into list (name) value (%s)
    ''',
                [name],
                False
            )
        return 0

    def del_list(self, id):
        # TODO: Taks referencing list through task_in_list
        raise Error("not implemented")