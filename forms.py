from django import forms
from DjangoUpimg.widgets import Upimg_input

class Upimg(forms.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['widget'] = Upimg_input(attrs={'Class': 'container-fluid'})
        kwargs['label'] = ''
        super().__init__(*args, **kwargs)
    pass
