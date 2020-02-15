new Vue ({
    el: 'FORM',
    data: {
        ismodal: false,
    },
    methods: {
        ShowModal(eve){
            if (this.ismodal){
                Upload_img.imgurldom = eve.target.previousElementSibling
                Upload_img.Openmodal();
            }else{
                let div = document.createElement('div');
                div.id = 'DjangoUpimg';
                div.setAttribute('v-show', 'isshow');
                div.className = 'border w-75';
                div = this.$el.parentNode.appendChild(div);
                axios
                .get('/DjangoUpimg/')
                .then(response => {
                    div.innerHTML = response.data
                    Upload_img.$mount('#DjangoUpimg');
                    Upload_img.imgurldom = eve.target.previousElementSibling
                    Upload_img.Openmodal();
                    this.ismodal = true;
                })
            }
        },
    }
})
Vue.component('upimgpath', {
    template:   "<li class='text-muted'>" + 
                    "<span class='selectpath' @click='selectdir($event, path)'>{{ name }}</span>" + 
                    "<ul v-if='Object.keys(this.list.child).length' v-show='fold'>" + 
                        "<upimgpath @emitpath='emitpath' v-for='(v, d) in list.child' :list='v' :name='d' :path='v.path' :key='d'></upimgpath>" + 
                    "</ul>" + 
                "</li>",
    props: {
        'list': Object,
        'name': String,
        'path': String,
    },
    data: function(){
        return {
            'fold': false,
            'meit': '',
        };
    },
    methods: {
        emitpath(str){
            this.$emit('emitpath', str);
        },
        selectdir(event, str){
            let parentnode = this.searchparentnode(event.target);
            let span = parentnode.getElementsByTagName('span')
            for (i = 0; i < span.length; i++){
                span[i].classList.remove('selectpathback')
            }
            event.target.classList.add('selectpathback')
            this.fold = !this.fold;
            this.emitpath(str);
        },
        searchparentnode(event){
            while (event.nodeName != "DIV"){
                event = event.parentNode
            }
            return event
        },
    }
});
var Upload_img = new Vue ({
    data: {
        imgsize: '',// 图片总大小(str)
        imgurl: [],// 图片预览数据
        seimgurl: [],// 在线图片数据
        imgurldom: null,// text表单DOM，用于显示图片地址
        isshow: true,// 是否显示上传组件窗口
        upsewin: true,// 是否显示上传图片窗口
        preview: false,// 是否显示预览窗口
        servwin: false,// 是否显示在线图片窗口
        size: 0,// 图片总大小(int)
        error: false,// 是否显示错误窗口
        errormession: '',// 错误信息
        addinput: true,// 添加图片按钮
        uploadinput: false,// 上传图片按钮
        closeinput: true,// 删除图片按钮
        retuimgurl: '',// 选择要返回的图片地址
        pathdict: {},// 目录数据
        selectdir: '',// 选择目录，用于添加子目录与显示图片
    },
    watch: {
        imgurl(){
            if (this.imgurl.length < 1){
                this.Upimg();
            };
            if (this.imgurl.length >= 10){
                this.addinput = false;
            }
        },
        preview(){
            if (!this.preview) {
                this.imgurl.splice(0);
                this.addinput = true;
                this.closeinput = true;
            };
        },
        selectdir(){
            this.viewimg()
        },
        servwin() {
            if (!this.servwin) {
                this.seimgurl.splice(0)
            }
        },
        servwin(){
            this.viewimg()
        },
    },
    methods: {
        // 打开选择文件对话窗口
        selfile(){
            document.getElementById('xrupfile').click()
        },
        // 关闭上传组件窗口
        Closewindow(){
            this.isshow = false;
            this.imgurl.splice(0)
        },
        Openmodal(){
            this.isshow = true;
            let vm = this
            axios
            .get('/DjangoUpimg/ReadDir/')
            .then(function(data){
                vm.pathdict = data.data
            });
        },
        // 显示上传图片窗口
        Upimg(){
            this.upsewin = true;
            this.preview = false;
            this.servwin = false;
            this.uploadinput = false;
        },
        // 显示选择在线图片窗口
        servimg(){
            this.upsewin = false;
            this.preview = false;
            this.uploadinput = false;
            this.servwin = true;
        },
        // 显示预览窗口
        Preview(el){
            let file = el.target.files[0]
            if (!file) return;
            // 文件类型判断
            if (!this.TypeToBoolean(file.type)){
                this.error = true;
                this.errormession = '请上传jpeg, png, ico等图片文件';
                return
            }else{
                this.error = false;
            };
            // 文件size计算
            if (!file.size) return;
            this.size = this.size + file.size
            this.imgsize = this.BytesToSize(this.size);
            // 图片预览
            this.FileView(file)
            this.upsewin = false;
            this.preview = true;
            this.servwin = false;
            this.uploadinput = true;
        },
        // 文件类型判断是否存在
        TypeToBoolean(type){
            let typelist = ['image/jpeg', 'image/png', 'image/ico']
            return !typelist.indexOf(type)? true : false;
        },
        // 文件大小换算
        BytesToSize(bytes){
            if (bytes === 0) return '0 B';
            let k = 1024;
            size = ['B', 'KB', 'MB', 'GB'];
            i = Math.floor(Math.log(bytes) / Math.log(k))
            re = (bytes / Math.pow(k, i)).toPrecision(3) + " " + size[i]
            return re
        },
        // 生成预览数据
        FileView(file){
            let reader = new FileReader();
            reader._vue = this;
            reader.readAsDataURL(file);
            reader.onload = function(){
                file.src = this.result;
                this._vue.imgurl.push(file);
            }
        },
        // 删除预览数据
        FileViewDel(index){
            this.imgurl.splice(index, 1);
        },
        // 开始上传图片
        Uploadimg(){
            let forms = new FormData(this.$refs.DjangoUpimgForm);
            forms.append('path', this.selectdir)
            for (i = 0; i < this.imgurl.length; i++){
                forms.append('file', this.imgurl[i])
            }
            axios
            .post('/DjangoUpimg/',forms)
            .then(response => {
                response.data.forEach(this.setimgurl)
                this.addinput = false;
                this.closeinput = false;
                this.uploadinput = false;
            })

        },
        // 选择文件
        SelectImg(eve){
            if (!this.closeinput || this.servwin){
                let pardom = eve.target.parentNode.parentNode.childNodes
                pardom.forEach(this.SetSelectImg)
                eve.target.parentNode.classList.add('selectimg')
                this.retuimgurl = eve.target.getAttribute('src')
            }
        },
        // 处理选择文件
        SetSelectImg(v){
            if (v.id == 'img') {
                v.classList.remove('selectimg')
            }
        },
        // 确定选择图片并返回图片地址
        EnterSelect(){
            this.imgurldom.value = this.retuimgurl;
            this.Closewindow();
        },
        // 处理图片地址为服务器地址
        setimgurl(v, k){
            let newimgurl = this.imgurl[k]
            newimgurl.src = v
            this.imgurl.splice(k, 1, newimgurl)
        },
        // 处理目录子组件返回地址
        selectpath(str){
            this.selectdir = str;
        },
        // 添加目录
        adddir(){
            let pathform = new FormData(this.$refs.DjangoUpimgAddPath)
            let vm = this
            if (this.selectdir == '/') {
                pathform.append('path', '')
            }else{
                pathform.append('path', this.selectdir)
            }
            axios.post('/DjangoUpimg/ReadDir/', pathform)
            .then(function(data){
                vm.pathdict = data.data
                vm.$refs.DjangoUpimgAddPath[1].value = ''
            });
        },
        // 显示在线图片
        viewimg(){
            let vm = this
            if (this.servwin){
                axios
                .get('/DjangoUpimg/ReadImg/?path=' + this.selectdir)
                .then(function(data){
                    vm.seimgurl = data.data
                })
            }
        },
    },
})
