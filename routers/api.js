var express = require('express');
var router = express.Router();
var Content = require('../models/Content');
var User= require('../models/User');

// router.get('/user',function(req,res,next){
//     res.send('API-User');
// });

//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData ={
        code:0,
        message:''
    }
    next();
});
/**
 * 用户注册
 * 注册逻辑
 * 1、用户名不能为空
 * 2、密码不能为空
 * 3、两次输入密码必须一致
 * *用户的操作反馈：
 * 1、用户是否已经被注册了
 *      数据库查询
 */

router.post('/user/register',function(req,res,next){
    var username =req.body.username;
    var password =req.body.password;
    var repassword =req.body.repassword;

    //用户名是否为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    //用户名是否已经被注册了，如果数据中已经存的和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username:username
    }).then(function(userInfo){
        if (userInfo){
            //表示数据库有该记录
            responseData.code = 4;
            responseData.message = "用户已经被注册了";
            res.json(responseData);
            return;
        }
        //保存用户注册信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.message='注册成功';
        res.json(responseData);
    });
});
/**
 * 登录
 */
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    if(username==''||password==''){
        responseData.code = 1;
        responseData.message = '用户名或者密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中用户名和密码的记录是否存在，如果存在则登陆成功
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或者密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码是正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo',JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
            
        }));
        res.json(responseData);
        return;
    })
});
/**
 * 推出的方法
 */
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
})

/**
 * 获取指定文章的所有评论
 */

router.get('/comment',function(req,res){
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id:contentId
    }).then(function(content){  
        responseData.data =content.comments;
        res.json(responseData);
    })
});

/**
 * 评论提交
 */
router.post('/comment/post',function(req,res){
    //这里需要前端传过来文章的id，这样才知道评论针对是哪篇文章
    var contentId = req.body.contentid || '';
    var postData={
        userInfo:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };


    //查询当前这篇文章内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content){  
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.message ='评论成功';
        responseData.data =newContent;
        res.json(responseData);
    }); 
})
module.exports = router;