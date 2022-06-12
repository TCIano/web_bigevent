$(function () {
    const form = layui.form;
    //定义获取文章分类列表
    const initArtCateList = () => {
        //请求调用获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败')
                console.log(res);
                //调用模板
                const htmlStr = template('tpl-table', res)
                //渲染
                $('tbody').empty().html(htmlStr)
            }
        });
    }
    //给添加按钮绑定点击事件 
    let indexAdd = null
    $("#btnAddCate").click(() => {
        //获取弹出层模态框索引
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html(),
        });
    });

    //给添加模态框表单添加点击监听事件(模态框为最后添加的,on事件委托可以动态添加事件)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('添加文章分类失败')
                layer.msg('添加文章分类成功');
                //添加成功之后关闭模态框，然后重新调用获取文章分类列表
                initArtCateList();
                //关闭弹出层模态框
                layer.close(indexAdd);
            }
        })
    });

    //事件委托给修改按钮添加点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });
        //获取点击该行的内容渲染到 弹出的 修改框中
        //获取Id
        let id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: (res) => {
                console.log(res);
                //获取form里面的值
                form.val('form-edit', res.data)

            }
        });
    })

    //修改数据，给submit添加委托事件
    $('body').on('submit', '#form-edit', function () {
        //发送请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg('更新分类失败')
                layer.msg('更新数据成功')
                //渲染数据
                initArtCateList()
                //关闭弹出层
                layer.close(indexEdit);

            }
        });
    })

    //点击删除文章分类
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        let id = $(this).attr('data-id');
        //跳出确认是否删除框
        layer.confirm(
            "确定删除吗？",
            { icon: 3, title: "提示" },
            (index) => {
                //发送请求
                $.ajax({
                    method: "GET",
                    url: '/my/article/deletecate/' + id,
                    success: (res) => {
                        if (res.status !== 0) return layer.msg('删除失败')
                        layer.msg('更新成功')
                        //渲染数据
                        layer.close(index)
                        initArtCateList()
                    }
                })
                //关闭弹框
            }
        )

    })
    //调用获取文章列表函数
    initArtCateList()
})