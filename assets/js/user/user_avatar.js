$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //模拟点击上传事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });
    //上传图片，隐藏的图片输入框状态改变之后触发事件
    $('#file').change((e) => {
        if (e.target.files.length == 0) return "请上传文件"
        //获取到文件伪数组
        const file = e.target.files[0];
        console.log(file);
        //把文件转为url
        const imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    //点击确定按钮上传
    $('#btnUpload').click(() => {
        //拿到base64编码之后的头像
        const dataURL = $image.cropper("getCroppedCanvas", {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
            .toDataURL("image/png");
        $('#image').attr('src', dataURL);
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('上传图片失败')
                layer.msg('上传图片成功');
                //调用父级获取用户信息函数
                window.parent.getUserInfo();
            }
        })
    })

})