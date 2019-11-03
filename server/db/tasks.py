class Tasks:
    def __init__(self, db):
        self.db = db

    def get_users_by_task_id(self, task_ids = []):
        user_id_replace = (',').join(['%s'] * len(task_ids))
        return self.db.sql_nested_list('''
select u.id as id, u.name as name, u.bio as bio, ut.id as id2 from user as u
left join user_in_task as ut on u.id = ut.user_id
where u.id in ({})
order by id
limit 100'''.format(user_id_replace),
            'id,name,bio,id'.split(','),
            'tasks',
            0,
            3,
            3,
            task_ids
        )

    def get_lists(self):
        lists = self.db.sql_nested_list('''
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
        taskById = {}
        for list_items in lists:
            for task in list_items['tasks']:
                task['members'] = []
                taskById[task['id']] = task
        users = self.get_users_by_task_id(list(taskById.keys()))
        for user in users:
            for task in user['tasks']:
                task = taskById[task['id']]
                task['members'].append({
                    'id': user['id'],
                    'name': user['name']
                })
        return lists


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
update list set name = (%s) where id = %s
''',
                [name, id],
                False,
                persisting = True
            )
            return id
        else:
            return self.db.prepared_sql('''
insert into list (name) value (%s)
''',
                [name],
                fetch = True,
                persisting = True
            )

    def add_or_update_task(self, task_id, title, description, list_id = None):
        new_task_id = None
        if task_id:
            self.db.prepared_sql('''
update task set title = (%s), description = (%s) where id = %s
''',
                [title, description, task_id],
                False,
                persisting = True
            )
        else:
            new_task_id = self.db.prepared_sql('''
insert into task (title, description) values (%s, %s)
''',
                [title, description],
                fetch = True,
                persisting = True
            )
        if list_id:
            self.db.prepared_sql('''
insert into task_in_list (list_id, task_id)
values (%s, %s)
on duplicate key update
list_id = VALUES(list_id), task_id = VALUES(task_id)
''',
                [list_id, task_id if task_id else new_task_id],
                False,
                persisting = True
            )
        return new_task_id

    def del_list(self, id):
        self.db.prepared_sql(
            'delete from list where id = %s',
            [id],
            False,
            persisting = True
        )
        self.db.sql('''
delete t from task as t
left join task_in_list as tl on tl.task_id = t.id
where tl.task_id is NULL
''',
            None,
            False,
            persisting = True
        )

    def del_task(self, id):
        self.db.prepared_sql(
            'delete from task where id = %s',
            [id],
            False,
            persisting = True
        )

    def get_tasks(self):
        return self.db.sql('''
select t.id as t, title, description, list_id as list from task as t
left join task_in_list as l on t.id = l.task_id
limit 100
''',
        'id,title, description,list'.split(','))

    def get_users(self):
        return self.db.sql('select id, name, bio from user limit 100', 'id,name,bio'.split(','))
