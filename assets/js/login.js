$(function () {
    $('#link_reg').click(() => {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    $('#link_login').click(() => {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    //先从layui引入 form
    const form = layui.form;
    //自定义表单验证
    form.verify({
        //数组的形式
        password: [/^[\S]{6,12}$/,
            "密码必须6到12位，且不能出现空格"],
        //函数形式
        //value获取输入密码的值
        repwd: (value) => {
            //获取输入框内的密码
            const pwd = $('.reg-box [name=password]').val();
            console.log(pwd, value);
            if (pwd !== value) return "两次密码不一致";
        }
    });

    //监听注册表单监听事件
    //根路径
    // const baseUrl = 'http://www.liulongbin.top:3007'//改为对应的请求拦截器
    $('#form_reg').submit((e) => {
        e.preventDefault();
        //发送ajax注册请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            //传输注册框内的内容
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: (res) => {
                console.log(res);
                // 如果状态不是0则发送请求失败
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功');
                //注册成功之后跳转到登录页面
                $('#link_login').click();
            }
        });
    });

    //监听登录表单监听事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        //发送请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                //如果状态码不是0登陆失败
                if (res.status !== 0) return layer.msg('登陆失败！');
                layer.msg('登陆成功');
                //把身份认证的token存储在localstorage中
                localStorage.setItem('token', res.token);
                //跳转到index页面
                location.href = '/index.html';
            }
        })
    });
});