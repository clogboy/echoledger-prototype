# storage.py
class StorageBackend:
    def __init__(self):
        self.db = {}

    def get(self, idea_id):
        return self.db.get(idea_id)

    def set(self, idea_id, record):
        self.db[idea_id] = record
