class DbError(BaseException):
    def __init__(self, error):
        super().__init__(BaseException, error)
        self.error = error

    def __repr__(self):
        return "Db error " + str(self.error)
