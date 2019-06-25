import copy
import os.path

import pymongo
import yaml


class MongoHook:
    def __init__(self, config_path):
        with open(config_path) as config_file:
            config = yaml.safe_load(config_file)['mongo']
            self._db_name = config['db']
            self._collections = config['collections']
            self._mongo_client = pymongo.MongoClient(config['host'], config['port'])

    @property
    def collections(self):
        return copy.deepcopy(self._collections)

    def insert(self, document, *, collection):
        return self._mongo_client[self._db_name][collection].insert_one(document).inserted_id

    def update_user_stats(self, username, *, with_label, collection=None):
        if collection is None:
            collection = self._collections['users']

        user = self._mongo_client[self._db_name][collection].find_one({'username': username})

        if user is None:
            user = {
                'username': username,
                'denoisedCounter': 0,
                'labeledCounter': 0,
            }

        user['denoisedCounter'] += 1

        if with_label:
            user['labeledCounter'] += 1

        self._mongo_client[self._db_name][collection].save(user)


hook = MongoHook(os.path.join(os.path.dirname(__file__), 'test_config.yml'))
