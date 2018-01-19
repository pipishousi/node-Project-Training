//提交评论

$('#messageBtn').on('click',function(){
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid: $('#contentId').val(),
            content:$('#messageContent').val()
        },
        success: function(responseData){
            // console.log(responseData);
            $('#messageContent').val('');
            renderComment(responseData.data.comments);
        }
    })
});

//每次页面重载的时候获取下该文章的所有评论
    $.ajax({
        url:'/api/comment',
        data:{
            contentid: $('#contentId').val(),
        },
        success: function(responseData){
            renderComment(responseData.data.reverse());
        }
    });


function renderComment(comments){

    $('#messageCount').html(comments.length);


    // //判断是否有评论
    // if (comments.length == 0) {
    //     $('#noComments').html('<div >还没有留言!</div>');
    //     $('#pager').hide();
    //     $('#messageList').hide();
    // } else {
    //     $('#pager').show();
    //     $('#messageList').show();x
    //     $('#noComments').html('');

    var html ='';
    for (var i=0; i<comments.length;i++){
        html +=('<div class="messageBox">'+
        '<p class="name "><span class="fl">'+comments[i].username+'</span><span class="fr">'+formatData(comments[i].postTime)+'</span></span></p><p>'+comments[i].content+'</p>'+
    '</div>');
    }
    $('.messageList').html(html);
}

function formatData(d){
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}

