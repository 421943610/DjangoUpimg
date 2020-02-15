from django import forms

class Upimg_input(forms.TextInput):
    template_name = 'DjangoUpimg/UpimgInput.html'
    class Media:
        js = ['DjangoUpimg/VueUpimg.js']
        css = {'all': ['DjangoUpimg/Upimg.css']}
        pass
    pass
