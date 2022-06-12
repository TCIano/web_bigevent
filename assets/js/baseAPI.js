// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter((options) => {
    console.log(options);
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    //注入token
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    };

    //校验权限
    options.complete = (res) => {
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //强制清空
            localStorage.removeItem('token');
            //强制跳转
            location.href = '/login.html'
        }
    }
});