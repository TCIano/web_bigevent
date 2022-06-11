
//获取用户信息
function getUserInfo() {
    //发出请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: (res) => {
            console.log(res);
            if (res.status !== 0) return layer.msg('获取用户信息失败!');
            layer.msg('获取用户信息成功!');
            //渲染用户头像和名称
            renderAvatar(res.data)
        },
        // complete: (res) => {
        //     console.log(res);
        //     //验证身份,验证失败
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         //强制清空
        //         localStorage.removeItem('token');
        //         //强制跳转
        //         location.href = '/login.html'
        //         //跳转页面


        //     }
        // }
    });
}

//渲染用户头像和名称
//如果用户有头像，那么就直接设置图片头像，如果没有设置文本头像
const renderAvatar = (userInfo) => {
    //渲染欢迎语
    const name = userInfo.nickname || userInfo.username;
    $('#welcome').html('欢迎 ' + name);
    //渲染头像
    if (userInfo.user_pic !== null) {
        // 如果设置了头像，那么就直接显示头像
        $('.layui-nav-img').attr('src', userInfo.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没设置头像，就让首字母大写变为头像？
        $('.layui-nav-img').hide();
        //让首字母大写并且显示出来
        $('.text-avatar').html(name[0].toUpperCase());
    }
}

//退出后台
$('#btnLogout').click(() => {
    layer.confirm('是否要退出?', { icon: 3, title: '提示' }, function (index) {
        //移除token
        localStorage.removeItem('token');
        //跳转页面
        location.href = '/login.html';
    });
})
//获取用户信息列表
getUserInfo();