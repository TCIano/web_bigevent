$(function () {
    const form = layui.form
    const laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    //渲染列表，发起请求
    const initTable = () => {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('获取文章信息失败');
                layer.msg(res.message)
                //模板渲染列表
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用分页
                renderPage(res.total)
            }
        })
    }

    //渲染筛选区域中的分类
    const initCase = () => {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                layer.msg('获取文章列表成功')
                //模板渲染
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //渲染
                form.render('select')
            }
        })
    }

    //调用筛选区域的分类函数

    //筛选功能（监听筛选按钮提交事件）
    $('#form-search').submit((e) => {
        e.preventDefault();
        //获取筛选区取到的内容
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        console.log(q);
        //重新渲染
        initTable()
    })

    //分页功能
    const renderPage = (total) => {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            //切换时候触发事件
            // 执行renderPage（）时候为首次加载，执行jump
            // 点击分页时候也会加载，也会执行jump
            jump: (obj, first) => {
                console.log(obj);
                console.log(first);
                q.pagenum = obj.curr;// 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;// 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                //如果不是首次加载，就调用渲染列表函数，如果是首次加载那么就让他自己加载
                if (!first) {
                    initTable();
                }
            }
        })
    }

    //给删除按钮添加事件委托
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id');
        //获取当前按钮个数
        const btnNum = $('.btn-delete').length;
        console.log(btnNum);
        console.log(id);
        // 发出询问
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //发出删除请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg('删除文章失败');
                    //删除到当前分页没有数据之后，让pagenum自动减一
                    //用按钮个数来判断是否当前分页有无数据
                    if (btnNum === 1) {
                        //如果当前页为第一页那么删除完数据就不会让页数减少
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    //重新渲染
                    initTable();
                    layer.close(index);
                }
            })

        });

    })

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    initCase();
})