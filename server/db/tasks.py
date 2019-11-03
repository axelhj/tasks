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

    def del_list(self, id):
        # TODO: Taks referencing list through task_in_list
        raise Error("not implemented")

    def get_users(self):
        return self.db.sql('select id, name, bio from user limit 100', 'id,name,bio'.split(','))
