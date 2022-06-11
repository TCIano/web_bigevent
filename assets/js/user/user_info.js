$(function () {
    const form = layui.form;
    //校验规则
    form.verify({
        nickname: (value) => {
            if (value.length > 6) return '昵称长度不能超过六位'
        }
    });

    //获取用户基本信息
    const initUserInfo = () => {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('获取用户信息失败');
                layer.msg('获取用户信息成功');
                //为表单赋值
                form.val("formUserInfo", res.data)

            }
        })
    }

    //重置表单
    $('#btnReset').click((e) => {
        e.preventDefault();
        //重新调用 用户信息
        initUserInfo()
    })

    //修改更新用户信息
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.meg('修改用户信息失败');
                layer.msg('修改用户信息成功')
                //调用父级的获取用户信息方法
                console.log(window);
                window.parent.getUserInfo();
            }
        })
    })

    //调用获取用户信息函数
    initUserInfo()

})