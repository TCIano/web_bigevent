$(function () {
    const form = layui.form;
    // 初始化富文本编辑器
    initEditor()
    //获取文章分类列表
    const initCategory = () => {
        //发送请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('获取文章分类列表失败');
                const htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                //调用layui方法渲染页面
                form.render('select')
            }
        })
    }

    //点击选择封面安按钮跳出 input文件选择框
    $('#btnChooseImage').click(() => {
        $('#coverFile').click();
    })

    //给input文件上传框监听状态改变事件,获取用户选择的文件列表
    $('#coverFile').change((e) => {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('"请上传图片"')
        }
        //获取图片
        const file = e.target.files[0]
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义发布状态
    let art_state = '已发布';

    //点击另存 ，改变发布状态为草稿
    $('#btnSave2').click(function () {
        art_state = '草稿';
    })

    //发布文章
    $('#form-pub').submit(function (e) {
        e.preventDefault();
        //获取数据,将数据存到formdata中
        const fd = new FormData($(this)[0]);
        //把状态内容加到formdata中
        fd.append('state', art_state);

        console.log(fd.get('title'));
        console.log(fd.get('cate_id'));
        console.log(fd.get('content'));
        console.log(fd.get('state'));
        //把图片封面加入到formdata中
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticles(fd)
            })
    })

    //发送发布文章请求
    const publishArticles = (fd) => {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('发布文章失败')
                //成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
                //调用父元素的更改高亮方法
                window.parent.change();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //调用获取文章分类信息
    initCategory()
})