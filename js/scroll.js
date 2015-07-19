$(function(){
  $(window).scroll(function(){
    var now = $(window).scrollTop();

    var under = $('body').height() - (now+$(window).height());

    if(now>1500 && under>200){
      $('#page-top').fadeIn('slow');
    }else{
      $('#page-top').fadeOut('slow');
    }
  });

  $('#move-page-top').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
  });
});
