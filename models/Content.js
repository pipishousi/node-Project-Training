
//把mongoose模块加载进来
var mongoose = require('mongoose');

//把在schema定义模块加载进来
var contentsSchema = require('../schemas/contents');

//紧接着通过mongoose底下的方法model创建一个模型，起名叫Content，第二个引用的shemale库，然后通过module.exports方法把这个模型暴露出去
module.exports = mongoose.model('Content',contentsSchema);