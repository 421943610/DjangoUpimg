import os, time, random, json
from django.shortcuts import render, HttpResponse
from django.conf import settings

# Create your views here.
def Modal(this):
    if this.method == "POST":
        path = os.path.join(settings.STATICFILES_DIRS[0], 'DjangoUpimg')
        file = this.FILES.getlist('file')
        dirs = os.path.join(path, this.POST.get('path'))
        reqpath = os.path.join('/static/DjangoUpimg', this.POST.get('path'))
        if not os.path.exists(dirs):
            os.makedirs(dirs)
        req = []
        for v in file:
            filename, filetype = v.name.split('.')
            newfilename = '%s_%d.%s' % (time.strftime('%Y%m%d%H%M%S'), random.randint(0, 100), filetype)
            newfileurl = os.path.join(dirs, newfilename)
            with open(newfileurl, 'wb+') as fs:
                for chunk in v.chunks():
                    fs.write(chunk)
            req.append(os.path.join(reqpath, newfilename))
        return HttpResponse(json.dumps(req))
    return render(this, 'DjangoUpimg/Modal.html')
def Read_DIR(this):
    from DjangoUpimg.tree import Pathtotree
    pardir = os.path.join(settings.STATICFILES_DIRS[0], 'DjangoUpimg')
    if this.method == "POST":
        print(this.POST.get('path'))
        path = os.path.join(pardir, this.POST.get('path'))
        os.mkdir(os.path.join(path, this.POST.get('dirname')))
    tree = Pathtotree(pardir).get()
    return HttpResponse(json.dumps(tree))
def Read_Img(this):
    path = os.path.join(settings.STATICFILES_DIRS[0], 'DjangoUpimg')
    dirs = os.path.join(path, this.GET.get('path'))
    fileurl = []
    for paths, name, files in os.walk(dirs):
        for v in files:
            fileurl.append(os.path.join(paths.replace(settings.STATICFILES_DIRS[0],'/static'), v))
    return HttpResponse(json.dumps(fileurl))
    pass