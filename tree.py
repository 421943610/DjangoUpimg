import os
from collections import OrderedDict

# 转化目录包括子目录为DICT格式目录树
# 返回以转入目录的相对路径为KEY的dict数据
class Pathtotree(dict):
    # 计算上目录
    def __init__(self, path):
        super().__init__()
        self.path = path
        dir = OrderedDict()
        dir.update({'根目录':{'path': '', 'child': OrderedDict()}})
        # for root, names, files in os.walk(path):
        #     isdir = names
        #     break
        # if isdir:
        #     for val in isdir:
        #         dir.update({val:{'path': val, 'child': OrderedDict()}})
        self.dict = self._Setchilddir(self.path, dir)
    # 递归子目录
    def _Setchilddir(self, path, args):
        for k, v in args.items():
            dir = os.path.join(path, v['path'])
            for root, names, files in os.walk(dir):
                isdir = names
                break
            if isdir:
                for val in isdir:
                    childdir = os.path.join(v['path'], val)
                    v['child'].update({val:{'path': childdir, 'child': OrderedDict()}})
                    self._Setchilddir(path, v['child'])
        return args
    def get(self):
        return self.dict