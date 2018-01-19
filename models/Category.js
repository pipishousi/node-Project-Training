
//把mongoose模块加载进来
var mongoose = require('mongoose');

//把在schema定义模块加载进来
var categoriesSchema = require('../schemas/categories');

//紧接着通过mongoose底下的方法model创建一个模型，起名叫User，第二个引用的shemale库，然后通过module.exports方法把这个模型暴露出去
module.exports = mongoose.model('Category',categoriesSchema);