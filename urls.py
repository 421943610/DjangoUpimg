from django.urls import path
from DjangoUpimg import views as DjangoUpimg_v

app_name = 'DjangoUpimg'

urlpatterns = [
    path('', DjangoUpimg_v.Modal, name='Modal'),
    path('ReadDir/', DjangoUpimg_v.Read_DIR, name='Read_DIR'),
    path('ReadImg/', DjangoUpimg_v.Read_Img, name='Read_Img'),
]