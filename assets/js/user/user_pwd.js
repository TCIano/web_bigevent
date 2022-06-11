$(function () {
    console.log(1111);
    //定义校验规则
    const form = layui.form;
    form.verify({
        //密码校验
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        //校验新密码和旧密码不应该相同
        samePwd: (val) => {
            if (val === $('[name=oldPwd]').val()) return "新密码和旧密码不能相同";
        },
        //校验新密码和确认密码应该相同
        rePwd: (value) => {
            if (value !== $('[name=newPwd]').val()) return "确认密码和新密码不相同"
        },

    });

    //更新 修改密码,监听
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('修改密码成功')
                //清空token
                localStorage.removeItem('token');
                //跳转页面,通过当前window的父级跳转
                window.parent.location.href = '/login.html'
            }
        })
    })
})