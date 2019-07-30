//global var
var $page = $('.page-wrapper'),
    $document = $(document),
    $preloader = $('.preloader'),
    $barbaContainer = $('.barba-container'),
    $pgItem = $('.pagination__item'),
    $pgLink = $('.pagination__link'),
    $logo = $('.logo'),
    pageOrder = $barbaContainer.data('order'),
    pageId = $barbaContainer.attr('id'),
    enterAnimation,
    exitAnimation,
    logoAnimation,
    navBtnHoverAnimation,
    navBtnAnimation;

$document.ready(function() {
  nav();
  barba();
  categories();
});

window.addEventListener('load', 
  function() {
    if($page.find('img').length > 0) {
      lazy();
      $('img').bind('load', function () {
        pageReady();
      });
    } else {
      pageReady();
    }
}, false);

function pageReady() {
  logoAnimation = new TimelineMax({paused: true})
    .set($logo, {autoAlpha: 1})
    .staggerFromTo($logo.find('.logo__item'), 0.5, {opacity: 0, y: 10}, {opacity: 1, y: 0, ease: Back.easeOut.config(3)}, 0.05)

  $preloader.fadeOut(300);
  $page.css({'visibility': 'visible'});
  pageEnterAnimation(pageId, true);
  if(pageId !== 'main') {
    logoAnimation.play();
  }
  //mainVideo();
}

$document.on('click', '.ajax-link', function(e) {
  e.preventDefault();
  $('.pagination__link').removeClass('active');
  if($(this).hasClass('index-link')) {
    logoAnimation.reverse();
  }
  if($(this).hasClass('stage-link')) {
    var stage = $(this).data('stage');
    $pgItem.eq(stage - 1).find('.pagination__link').addClass('onload');
  }
  if($(this).hasClass('pagination__link')) {
    $(this).addClass('onload');
  }
})


//functions

function lazy() {
  $(".lazy").Lazy({
    effect: 'fadeIn',
    visibleOnly: true,
    effectTime: 0,
    threshold: 0,
    imageBase: false,
    defaultImage: false
  });
}

function mainVideo() {
  var $videoContainer = $('.video-wrapper'),
  videoPath = $videoContainer.data('path');

  $('.video-wrapper').append('<video class="video-wrapper__content" loop autoplay muted playsinline><source class="video-source" src='+ videoPath +' type="video/mp4">');
  $('.video-wrapper__content').bgVideo ({
    fullScreen : false, 
    fadeIn : 500,
    pauseAfter: 0,
    fadeOnPause : false,
    fadeOnEnd : true,
    showPausePlay: false
  });
}

function nav() {
  var $navButton = $('.nav-btn'),
      $overlay = $('.overlay'),
      inAnim = false,
      openAnimation;

  navBtnAnimation = new TimelineMax({reversed: true, paused: true})
    .set($navButton.find('.nav-btn__item'), {css:{overflow:'visible'}})
    .to($navButton.find('.nav-btn__item'), 0.15, {x: -8})
    .to([$navButton.find('.nav-btn__item:eq(0)'), $navButton.find('.nav-btn__item:eq(2)')], 0.15, {y: 0})
    .set($navButton.find('.nav-btn__item'), {css:{overflow:'hidden'}})
    .set($navButton.find('.nav-btn__item:eq(1)'), {opacity: 0})
    .to($navButton.find('.nav-btn__item:eq(0)'), 0.15, {rotation: 45})
    .to($navButton.find('.nav-btn__item:eq(2)'), 0.15, {rotation: 135}, '-=0.15')

  navBtnHoverAnimation = new TimelineMax({paused: true})
    .to($navButton.find('.nav-btn__item:eq(1) span'), 0.15, {x: -8})
    .to([$navButton.find('.nav-btn__item:eq(0) span'), $navButton.find('.nav-btn__item:eq(2) span')], 0.15, {x: 0}, '-=0.15')


  
  $navButton.on('click mouseenter mouseleave', function(e) {
    if(e.type == 'click') {
      if (navBtnAnimation.reversed()) {
        navBtnAnimation.stop()
        navBtnAnimation.play()
      } else {
        navBtnAnimation.stop()
        navBtnAnimation.reverse()
      }
    } else if(e.type == 'mouseenter') {
      navBtnHoverAnimation.play();
    } else if(e.type == 'mouseleave') {
      navBtnHoverAnimation.reverse();
    }
  })
}

function paginationCheck() {
  $pgItem.eq(pageOrder - 1).find('.pagination__link').addClass('active');
}
function paginationChange() {
  $pgItem.find('.pagination__link').removeClass('active').removeClass('onload');
  $pgItem.eq(pageOrder - 1).find('.pagination__link').addClass('active');
}


function pageEnterAnimation(newId, firstAnimation) {
  if(firstAnimation==true) {
    paginationCheck();
  } else {
    paginationChange();
  }

  if(newId=='categories') {
    enterAnimation = new TimelineMax({onComplete: function() {
      $barbaContainer.css('overflow', 'visible');
    }})
      .staggerFromTo(".categories-block__container", 0.5, {opacity:0, y: 50}, {opacity:1, y: 0, ease: Back.easeOut.config(3)}, 0.05);
  }
  else if(newId=='main') {
    //mainVideo();
    enterAnimation = new TimelineMax({
      onComplete: function() {
      $barbaContainer.css('overflow', 'visible');
      },
      onStart: function() {
        logoAnimation.reverse();
      }
    })
      .fromTo('.main-page', 0.5, {opacity: 0}, {opacity: 1})
  }
}


function barba() {
  var $newPage,
      $oldPage;

  var ExpandTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOldPage()])
        .then(this.showNewPage.bind(this));
    },
  
    fadeOldPage: function() {
      $oldPage = $(this.oldContainer);
      var oldId = $oldPage.attr('id');
      var deferred = Barba.Utils.deferred();
      //
      pageExitAnimation(oldId);
      //
      function pageExitAnimation() {
        $barbaContainer.css('overflow', 'hidden');
      
        if(oldId=='categories') {
          exitAnimation = new TimelineMax({
            onComplete: function() {
              deferred.resolve();
            }
          })
            .staggerTo(".categories-block__container", 0.5, {opacity:0, y: 50, ease: Power4.easeIn, 
              stagger: {
                from: "end",
                amount: 0.5
              }
          });
        }
        else if(oldId == 'main') {
          exitAnimation = new TimelineMax({
            onComplete: function() {
              deferred.resolve();
              logoAnimation.play();
            }
          })
            .to('.barba-container', 0.5, {opacity: 0})
        }
      }
      return deferred.promise;
    },
    showNewPage: function() {
      this.done();
      $barbaContainer.addClass('hidden');
      $newPage = $(this.newContainer);
      var newId = $newPage.attr('id');
      pageOrder = $newPage.data('order');

      if($newPage.find('img').length > 0) {
        lazy();
        $('img').bind('load', function () {
          $barbaContainer.removeClass('hidden');
          pageEnterAnimation(newId)
        });
      } else {
        $barbaContainer.removeClass('hidden');
        pageEnterAnimation(newId)
      }

    }
  });

  Barba.Pjax.getTransition = function() {
    var transitionObj = ExpandTransition;
    return transitionObj;
  }
  Barba.Pjax.start();
}

//category
function categories() {
  var $block = $('.categories-block__container'),
  animation = {},
  state;

  $page.on('mouseenter touchstart touchend mouseleave', '.categories-block__container', function(e) {
    var $current = $(this),
        num = $current.parent().index() + 1,
        w = $current.width(),
        h = $current.height(),
        off = $current.offset(),
        x = e.pageX - off.left,
        y = e.pageY - off.top,
        xShift, 
        yShift, 
        xText,
        yText,
        side;
    if (x / w > .5) {
      xShift = w - x;
      xText = 'right';
    } else {
      xShift = x;
      xText = 'left';
    }			
    if (y / h > .5) {
      yShift = h - y;
      yText = 'bottom';
    } else {
      yShift = y;
      yText = 'top';
    }			
    side = (xShift < yShift) ? xText : yText;
    
    function anim(direction, side) {
      var x, y;
      if(side=='top') {
        x = 0, y = -($current.height());
      } else if(side=='right') {
        x = $current.width(), y = 0;
      } else if(side=='bottom') {
        x = 0, y = $current.height();
      } else if(side=='left') {
        x = -($current.width()), y = 0;
      }
      if(['num' + num] in animation) {
        animation['num' + num].stop();
      }
      if(direction=='forward') {
        animation['num' + num] = new TimelineMax()
          .set($current.find('.categories-block__bg'), {opacity: 1})
          .to($current.find('.icon'), 0.5, {rotation: 180})
          .to($current.find('.icon'), 0.5, {css:{fill:'#fff'}}, '-=0.5')
          .fromTo($current.find('.categories-block__bg'), 0.5, {x: x, y: y}, {x: 0, y: 0},'-=0.5')
          .fromTo($current.find('.categories-block__sub-title'), 0.3, {opacity: 0, y: 15}, {opacity: 1, y: 0})
          .staggerFromTo($current.find('.categories-block__sub-title span'), 0.3, {opacity: 0, y: 10}, {opacity: 1, y: 0, ease: Back.easeOut.config(3)}, 0.05)
      } else if(direction=='back') {
        animation['num' + num] = new TimelineMax()
          .to($current.find('.categories-block__bg'), 0.5, {x: x, y: y})
          .set($current.find('.categories-block__bg'), {opacity: 0})
          .to($current.find('.icon'), 0.5, {css:{fill:'#000'}}, '-=0.5')
          .to($current.find('.icon'), 0.5, {rotation: 0}, '-=0.5')
          .to($current.find('.categories-block__sub-title'), 0.3, {opacity: 0}, '-=0.5')
      }
    }
    if(e.type == 'mouseenter') {
      anim('forward', side);

    } else if(e.type == 'mouseleave') {
      anim('back', side);
    }
  })
}


