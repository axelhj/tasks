class Tasks:
    def __init__(self, db):
        self.db = db

    def multiply_symbol(self, count):
        return (', ').join(['%s'] * count)

    def insert_list_symbols(self, list_len, lists_len):
        return ', '.join(['({})'.format(self.multiply_symbol(list_len))] * lists_len)

    def get_users_by_task_id(self, task_ids = []):
        task_id_replace = self.multiply_symbol(len(task_ids))
        return self.db.sql_nested_list('''
select u.id as id, u.name as name, u.bio as bio, ut.task_id as task_id
from user as u
left join user_in_task as ut on u.id = ut.user_id
where ut.task_id in ({})
order by id
limit 100'''.format(task_id_replace),
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

    def add_or_update_task(self, task_id, title, description, members = [], list_id = None):
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
        members_count = len(members) if members else 0
        if members_count:
            insert_task_id = int(task_id) if task_id else new_task_id
            values = []
            values_nested = [[insert_task_id, member['id']] for member in members]
            for nested in values_nested:
                values += nested
            user_ids_replace = self.insert_list_symbols(2, members_count)
            self.db.prepared_sql('''
insert into user_in_task (task_id, user_id)
values {}
'''.format(user_ids_replace),
                values,
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
