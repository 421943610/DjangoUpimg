# DjangoUpimg
Django图片上传管理插件
# 安装方法：
##### 1、git命令安装
命令行进入Django工作区执行以下命令
```
git clone git@github.com:421943610/DjangoUpimg.git
```
##### 2、手动下载安装

1、点击[Download ZIP](https://github.com/421943610/DjangoUpimg/archive/master.zip)下载*DjangoUpimg.zip*压缩包到本地

2、提取*DjangoUpimg.zip*到Django工作区目录下

# 使用方法：
#### 1、加载bootstrap.css与vue.js文件
  些插件以bootstrap与vue组合编写，所以要在文本头载入bootstrap.css与vue.js这二个文件。
  
  载入方法在*第六步*中有示例。

#### 2、配置Django配置文件settings.py

  打开settings.py文件，将*DjangoUpimg*添加到INSTALLED_APPS变量下面
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'DjangoUpimg',
]
```
  配置STATIC，上传的图片文件会存放在static目录下
```
STATIC_URL = "/static/"
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
```
#### 3、配置Django路由文件urls.py
  引入*DjangoUpimg*的urls路由
```
from django.urls import path, include

urlpatterns = [
    path('', include('Loading.urls', namespace='Loading')),
    path('DjangoUpimg/', include('DjangoUpimg.urls', namespace='DjangoUpimg')),// <---这行是DjangoUpimg路由
    path('admin/', include('admin.urls', namespace='admin')),
]
```
#### 4、APP下创建表单引用
  在APP目录下新建forms.py文件引入*DjangoUpimg*表单，内容如下:
```
from django.forms import Form
from DjangoUpimg.forms import Upimg

class ImgForm(Form):
    logo = Upimg()
    ico = Upimg()
    pass
```
#### 5、APP下在Views.py视图文件中引用刚才新建在forms.py
```
from .forms import ImgForm

def index(request):
    form = ImgForm()
    return render(this, 'index.html', {'form': form})
    pass
```
#### 6、APP下templates目录中编辑index.html文件
```
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">
        <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
        <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
        <title>demo</title>
    </head>
    <body>
        <form acction enctype="application/x-www-form-urlencoded" method="POST">
            <div class="form_base d-flex p-2">
               <div class="input-group input-group-sm">
                   <div class="input-group-prepend">
                       <span class="input-group-text" id="inputGroup-sizing-sm">名称</span>
                   </div>
                  <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
               </div>
           </div>
           <div class="form_base d-flex p-2">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">LOGO</span>
              </div>
              <div class="custom-file">
                {{ form.logo }}  <!--生成name为logo的“DjangoUpimg”文本与按钮组合框-->
              </div>
            </div>
          </div>
          <div class="form_base d-flex p-2">
            <div class="input-group input-group-sm">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-sm">图标</span>
            </div>
            <div class="custom-file">
              {{ form.ico }}  <!--生成name为ico的“DjangoUpimg”文本与按钮组合框-->
            </div>
          </div>
        </div>
      </form>
      {{ form.media }} <!--这行很重要，一定要写在"form"表单后面，加载“DjangoUpimg”所需要在CSS,JS文件以及生成对话框-->
   </body>
</html>
```
