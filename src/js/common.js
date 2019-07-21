$(document).ready(function () {
  scrollInit();
});
$(window).resize(function () {
  innerWidth = $('body').innerWidth();
});

//global variables
var innerWidth = $('body').innerWidth(),
//scroll-styling
cursorcolorVar = "transparent",
cursorwidthVar = "15px",
cursorborderVar = "0",
cursorborderradiusVar = "0",
zindexVar = [100],
bouncescrollVar = false,
$scrollContainer = $('.scroll-container');

//scroll
function scrollInit() {
  if ($('html').hasClass('desktop')) {
    $('body').niceScroll({
      cursorcolor: cursorcolorVar,
      cursorwidth: cursorwidthVar,
      cursorborder: cursorborderVar,
      cursorborderradius: cursorborderradiusVar,
      zindex: zindexVar,
      bouncescroll: bouncescrollVar,
      autohidemode: true
    });
    setInterval(function() {
      $('body').getNiceScroll().resize();
    }, 50);
  } else {
    $('html, body').css('overflow', 'auto');
  }
};