//global var
var $page = $('.page-wrapper'),
    $document = $(document),
    $preloader = $('.preloader'),
    $barbaContainer = $('.barba-container'),
    $pgItem = $('.pagination__item'),
    $pgLink = $('.pagination__link'),
    $logo = $('.logo'),
    newLabel = $barbaContainer.data('label'),
    oldLabel,
    inAnimation = true,
    inScroll = false,
    $label = $('#' + newLabel),
    pageWidth = $page.width(),
    pageOrder = $barbaContainer.data('order'),
    pageId = $barbaContainer.attr('id'),
    enterAnimation,
    exitAnimation,
    logoState = false,
    navState = false,
    logoAnimation,
    navBtnFadeAnimation = new TimelineMax({paused: true})
      .set('.nav-btn', {autoAlpha: 1})
      .staggerFromTo('.nav-btn__item', 0.3, {opacity: 0, x: 30}, {opacity: 1, x: 0, ease: Back.easeOut.config(3)}, 0.1),
    paginationAnimation1 = new TimelineMax({paused: true})
      .set('.pagination', {autoAlpha: 1})
      .staggerFromTo('.pagination__item', 0.8, {opacity: 0, y: 0, x: 10}, {opacity: 1, y: 0, x: 0, ease: Back.easeOut.config(3)}, 0.1),
    paginationAnimation2 = new TimelineMax({paused: true})
      .set('.pagination', {autoAlpha: 1})
      .staggerFromTo('.pagination__item', 0.8, {opacity: 0, x: 0, y: 15}, {opacity: 1, x: 0, y: 0, ease: Back.easeOut.config(3)}, 0.1),
    navBtnHoverAnimation,
    navBtnAnimation,
    labelFadeAnimation,
    labelHideAnimation,
    preloaderTimer;

$document.ready(function() {
  nav();
  barba();
  categories();
  niceScroll();
  scroll();
});

window.addEventListener('load', 
  function() {
    pageEnterAnimation(true);
}, false);

//functions
function lazy() {
  $(".lazy").Lazy({
    effect: 'fadeIn',
    visibleOnly: true,
    effectTime: 0,
    threshold: 0,
    imageBase: false,
    defaultImage: false,
    afterLoad: function(element) {
      var box = element.parent();
      if(!box.hasClass('cover-box_size-auto')) {
        var boxH = box.height(),
          boxW = box.width(),
          imgH = element.height(),
          imgW = element.width();
        if ((boxW / boxH) >= (imgW / imgH)) {
          element.addClass('ww').removeClass('wh');
        } else {
          element.addClass('wh').removeClass('ww');
        }
      }
    }
  });
}
function niceScroll() {
  $('.page-block').niceScroll({
    cursorcolor: '#000',
    cursorwidth: '5px',
    cursorborder: '0',
    cursorborderradius: '0',
    zindex: 1000,
    bouncescroll: false,
    autohidemode: "leave",
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
//parralax
function parralax1() {
  //init parralax
  var scene = document.getElementById('scene');
  var parallaxInstance = new Parallax(scene, {
    limitY: '10',
    limitX: '80'
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
function logoToggle(state) {
  if(state == true && logoState==false) {
    logoAnimation = new TimelineMax()
    .set($logo, {autoAlpha: 1})
    .staggerFromTo($logo.find('.logo__item'), 0.5, {opacity: 0, y: 10}, {opacity: 1, y: 0, ease: Back.easeOut.config(3)}, 0.05),
    logoState=true;
  } else if(state == false && logoState==true) {
    if(inScroll == true) {
      logoAnimation = new TimelineMax()
      .to($logo, 0.5, {opacity: 0})
    } else {
      logoAnimation.reverse();
    }
    logoState=false;
  }
}
function navToggle(state) {
  if(state == true && navState==false) {
    if(pageWidth > 1024) {
      paginationAnimation1.play();
    } else {
      paginationAnimation2.play();
    }
    navState=true;
  } else if(state == false && navState==true) {
    if(pageWidth > 1024) {
      paginationAnimation1.reverse();
    } else {
      paginationAnimation2.reverse();
    }
    navState=false;
  }
}
function onStartAnimation() {
  inAnimation = false;
  inScroll = true;
}
function onCompleteAnimation(type) {
  $barbaContainer.css('overflow', 'visible');
  inScroll = false;
}
function showLabel() {
  labelFadeAnimation = new TimelineMax()
    .set($label, {autoAlpha: 1})
    .fromTo($label.find('.icon'), 1.5, {opacity: 0, rotation: 0}, {opacity: 1, rotation: 180, ease: Power3.easeOut})
    .fromTo($label.find('.label-item__title'), 0.5, {opacity: 0, y: 15}, {opacity: 1, y: 0}, '-=1')
    .staggerFromTo($label.find('.latter'), 0.5, {opacity: 0, y: 10}, {opacity: 1, y: 0, ease: Back.easeOut.config(3)}, 0.05, '-=1')
  oldLabel = newLabel;
}
function hideLabel() {
  if(inScroll == true) {
    labelHideAnimation = new TimelineMax()
    .to($label, 0.5, {opacity: 0, ease: Power3.easeOut})
  } else {
    labelHideAnimation = new TimelineMax()
    .to($label.find('.icon'), 1, {opacity: 0, rotation: 0, ease: Power3.easeIn})
    .to($label.find('.label-item__title'), 0.5, {opacity: 0, y: 15}, '-=0.5')
    .set($label, {autoAlpha: 0})
  }
}


function pageEnterAnimation(firstAnimation) {
  $barbaContainer = $('.barba-container');
  pageId = $barbaContainer.attr('id');
  pageOrder = $barbaContainer.data('order');

  inAnimation = true;
  
  if($barbaContainer.find('img').length > 0) {
    lazy();
    $('img').bind('load', function () {
      anim();
    });
  } else {
    anim();
  }

  function anim() {
    $barbaContainer.removeClass('hidden');
    clearTimeout(preloaderTimer);
    $preloader.fadeOut(200);
    if(firstAnimation==true) {
      paginationCheck();
      $preloader.fadeOut(300);
      $page.css({'visibility': 'visible'});
      navBtnFadeAnimation.play();
      if(pageId !== 'main') {
        logoToggle(true);
        logoState = true;
        if(!$barbaContainer.hasClass('project')) {
          navToggle(true);
          navState = true;
        }
      }
    } else {
      enterAnimation.stop();
      if(pageId !== 'main') {
        logoToggle(true);
        if(!$barbaContainer.hasClass('project')) {
          navToggle(true);
        } else {
          navToggle(false);
        }
      } else {
        logoToggle(false);
        navToggle(false);
      }
      paginationChange();
    }
    if($barbaContainer.attr('data-label')) {
      newLabel = $barbaContainer.data('label');
      $label = $('#' + newLabel);
      if(newLabel !== oldLabel) {
        $label = $('#' + oldLabel);
        hideLabel();
        $label = $('#' + newLabel);
        showLabel();
      }
    } else {
      hideLabel();
      oldLabel = false;
    }
    //анимация для страницы категорий
    if(pageId=='categories') {
      categories();
      enterAnimation = new TimelineMax({onStart:function(){onStartAnimation();},onComplete:function(){onCompleteAnimation()}})
      .staggerFromTo(".categories-block__container", 0.75, {opacity:0, y: 50}, {opacity:1, y: 0, ease: Back.easeOut.config(4)}, 0.1);
    }
    //анимация для главной страницы
    else if(pageId=='main') {
      mainVideo();
      enterAnimation = new TimelineMax({onStart:function(){onStartAnimation()},onComplete:function(){onCompleteAnimation()}})
      .fromTo('.main-page', 1, {opacity: 0}, {opacity: 1})
    }
    //анимация для превью страниц
    else if(pageId=='projectPreview') {
      var $image = $('.project-preview__image'),
          w = $image.width();
      enterAnimation = new TimelineMax({onStart:function(){onStartAnimation()},onComplete:function(){onCompleteAnimation()}})
      .set('.project-preview__container', {autoAlpha: 1})
      .fromTo('.project-preview__image .project-preview__link', 1.5, {x: -w/2, opacity: 0}, {x: 0, opacity: 1, ease: Power3.easeOut})
      .fromTo('.project-preview__title', 1, {y: -50, opacity: 0}, {y: 0, opacity: 1, ease: Power3.easeOut}, '-=1.5')
      .fromTo('.project-preview__line', 1, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Power3.easeOut}, '-=1')
      .fromTo('.project-preview__description', 1, {y: -50, opacity: 0}, {y: 0, opacity: 1, ease: Power3.easeOut}, '-=1.25')
      .fromTo('.project-preview__demo', 0.8, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Power3.easeOut}, '-=1')
    }
    //анимация для project3
    else if(pageId=='project3') {
      enterAnimation = new TimelineMax({paused: true, onStart:function(){onStartAnimation()},onComplete:function(){onCompleteAnimation();parralax1()}})
      .to('.project3__line span:first-child', 0.5, {yPercent: -100, ease: Power2.easeIn})
      .to('.project3__line span:last-child', 0.5, {yPercent: 100, ease: Power2.easeIn}, '-=0.5')
      .set('.project3__background', {autoAlpha: 1})
      .to('.project3__background-item:first-child span', 0.7, {xPercent: -100, ease: Power2.easeOut})
      .to('.project3__background-item:last-child span', 0.7, {xPercent: 100, ease: Power2.easeOut}, '-=0.7')
      .to('.label-item__title, .label-item', 0.7, {css:{backgroundColor: '#efefef'}}, '-=0.7')
      .to('.nav-btn__item', 0.7, {css:{backgroundColor: '#fff'}}, '-=0.7')
      .set('.project3__overlay', {autoAlpha: 1})
      .to('.project3__overlay-item:first-child span', 0.5, {xPercent: -100, ease: Power3.easeIn})
      .to('.project3__overlay-item:last-child span', 0.5, {xPercent: -100, ease: Power3.easeIn}, '-=0.5')
      .set('.project3__line', {autoAlpha: 0})
      .to('.project3 .hidden-item', 0.5, {opacity:1})
      .to('.project3__overlay-item:first-child span', 0.5, {xPercent: -200, ease: Power3.easeOut}, '-=0.5')
      .to('.project3__overlay-item:last-child span', 0.5, {xPercent: -200, ease: Power3.easeOut}, '-=0.5')
      .set('.project3__overlay', {autoAlpha: 0})
      enterAnimation.play()
    }
  }
}
$page.on('click', '.ajax-link', function(e) {
  e.preventDefault();
  $('.pagination__link').removeClass('active');

  if($(this).hasClass('index-link')) {
    logoToggle(false);
    navToggle(false);
  }
  if($(this).hasClass('stage-link')) {
    var stage = $(this).data('stage');
    $pgItem.eq(stage - 1).find('.pagination__link').addClass('onload');
  }
  if($(this).hasClass('pagination__link')) {
    $(this).addClass('onload');
  }
  if($(this).hasClass('project-preview__link')) {
    navToggle(false);
  }
  if($(this).attr('data-label')) {
    if(newLabel !== $(this).data('label')) {
      hideLabel();
    }
  } else {
    hideLabel();
    oldLabel = false;
  }
})

function scroll() {
  var h,
      $link,
      pagesCount = $('.pagination__link').length;
  $(window).on('wheel', function(event){
    if(inAnimation==false) {
      if(!$barbaContainer.hasClass('project')) {
        if(pageId=='main') {
          if(event.originalEvent.deltaY > 0){
            $link = $('#main .ajax-link');
            goToPage();
          }
        } else if(pageId == 'projectPreview' || pageId == 'categories') {
          var index = $('.pagination__link.active').parent().index();
          if(event.originalEvent.deltaY > 0){
            if(index + 1 < pagesCount) {
              $link = $('.pagination__item').eq(index + 1).find('.pagination__link');
              goToPage();
            }
          } else {
            if(index + 1 > 1) {
              $link = $('.pagination__item').eq(index - 1).find('.pagination__link');
              goToPage();
            } else {
              $link = $('.logo__link');
              goToPage();
            }
          }
        }
      }
    }
  });
  function goToPage() {
    $link.trigger('click');
    h = $link.attr('href');
    Barba.Pjax.goTo(h);
    inScroll = true;
    inAnimation = true;
  }
}
function barba() {
  var $newPage,
      $oldPage;
  var ExpandTransition = Barba.BaseTransition.extend({
    start: function() {Promise.all([this.newContainerLoading, this.fadeOldPage()]).then(this.showNewPage.bind(this));},
    fadeOldPage: function() {
      $oldPage = $(this.oldContainer);
      var oldId = $oldPage.attr('id'),
          deferred = Barba.Utils.deferred();

      pageExitAnimation(oldId);
      function timerStart() {
        preloaderTimer = setTimeout(function() {
          $preloader.fadeIn(200);
        }, 500)
      }
      function pageExitAnimation() {
        $barbaContainer.css('overflow', 'hidden');
        if(inScroll == true) {
          if(oldId == 'project3') {
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
            .to('.barba-container', 0.5, {opacity: 0})
            .to('.label-item__title, .label-item', 0.7, {css:{backgroundColor: '#fff'}}, '-=0.5')
            .to('.nav-btn__item', 0.5, {css:{backgroundColor: '#000'}}, '-=0.5')
          } else {
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve()}})
            .to('.barba-container', 0.5, {opacity: 0})
          }
        } else {
          //анимация для главной страницы
          if(oldId == 'main') {
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
              .to('.barba-container', 0.5, {opacity: 0})
          }

          //анимация для страницы категорий
          else if(oldId=='categories') {
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
              .staggerTo(".categories-block__container", 0.5, {opacity:0, y: 50, ease: Power4.easeIn, stagger: {from: "end", amount: 0.5}});
          }

          //анимация для страницы превью
          else if(oldId == 'projectPreview') {
            var $image = $('.project-preview__image'), w = $image.width();
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
              .to('.project-preview__image .project-preview__link', 1, {x: w, opacity: 0, ease: Power3.easeIn})
              .to('.project-preview__label .icon', 1, {opacity: 0, rotation: -180, ease: Power3.easeIn}, '-=1')
              .to('.project-preview__label-title', 0.5, {opacity: 0, y: 15}, '-=0.5')
              .to('.project-preview__demo', 0.5, {x: -100, opacity: 0, ease: Power3.easeIn}, '-=1')
              .to('.project-preview__line', 0.5, {x: -100, opacity: 0, ease: Power3.easeIn}, '-=1')
              .to('.project-preview__description', 0.5, {x: -100, opacity: 0, ease: Power3.easeIn}, '-=0.8')
              .to('.project-preview__title', 0.5, {x: -100, opacity: 0, ease: Power3.easeIn}, '-=0.6')
          }
          else if(oldId == 'project3') {
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
            .set('.project3__overlay', {autoAlpha: 1})
            .to('.label-item__title, .label-item', 0.5, {css:{backgroundColor: '#fff'}})
            .to('.nav-btn__item', 0.5, {css:{backgroundColor: '#000'}}, '-=0.5')
            .to('.project3 .hidden-item', 0.5, {opacity:0, ease: Power2.easeIn}, '-=0.5')
            .fromTo('.project3__overlay-item:first-child span', 0.5, {xPercent: -100, yPercent:100}, {yPercent:0, ease: Power3.easeIn}, '-=0.5')
            .fromTo('.project3__overlay-item:last-child span', 0.5, {xPercent: -100, yPercent:-100}, {yPercent:0, ease: Power3.easeIn}, '-=0.5')
            .set('.project3 .hidden-item, .project3__background', {autoAlpha: 0})
            .to('.project3__overlay-item:first-child span', 0.5, {yPercent:-100, opacity:0, ease: Power3.easeIn})
            .to('.project3__overlay-item:last-child span', 0.5, {yPercent:100, opacity:0, ease: Power3.easeIn}, '-=0.5')        }

          //анимация для остальных
          else {
            deferred.resolve();
            logoToggle(true);
          }
        }
      }
      return deferred.promise;
    },
    showNewPage: function() {
      this.done();
      $newPage = $(this.newContainer);
      pageEnterAnimation();
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
  var $block = $('.categories-block__container');
  
  function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  

  $block.each(function() {
    var $current = $(this),
        animation,
        animationR,
        state = false,
        random,
        rotateVal = 180,
        sign,
        interval = randomInteger(1, 9) * 130,
        randomAnimation = function() {
          random = randomInteger(1, 9),
          interval = random * 400,
          sign = Math.floor(Math.random() * 2) === 0;
          if(!sign) {
            rotateVal = 180;
          } else {
            rotateVal = 0;
          }
          animationR = new TimelineMax({})
          .to($current.find('.icon'), 0.4, {rotation: rotateVal});
          timer = setTimeout(randomAnimation, interval);
        },
        timer = setTimeout(randomAnimation, interval);

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
      if(state == true) {
        animation.stop();
      }
      if(direction=='forward') {
        animation = new TimelineMax()
          .set($current.find('.categories-block__bg'), {opacity: 1})
          .to($current.find('.icon'), 0.5, {rotation: 180, ease: Power1.easeInOut})
          .to($current.find('.icon'), 0.5, {css:{fill:'#fff'}}, '-=0.5')
          .fromTo($current.find('.categories-block__bg'), 0.5, {x: x, y: y}, {x: 0, y: 0},'-=0.5')
          .fromTo($current.find('.categories-block__sub-title'), 0.3, {opacity: 0, y: 15}, {opacity: 1, y: 0})
          .staggerFromTo($current.find('.categories-block__sub-title span'), 0.3, {opacity: 0, y: 10}, {opacity: 1, y: 0, ease: Back.easeOut.config(3)}, 0.05)
      } else if(direction=='back') {
        animation = new TimelineMax()
          .to($current.find('.categories-block__bg'), 0.5, {x: x, y: y})
          .set($current.find('.categories-block__bg'), {opacity: 0})
          .to($current.find('.icon'), 0.5, {css:{fill:'#000'}}, '-=0.5')
          .to($current.find('.icon'), 0.5, {rotation: 0}, '-=0.5')
          .to($current.find('.categories-block__sub-title'), 0.3, {opacity: 0}, '-=0.5')
      }
    }
    
    $current.on('mouseenter touchstart touchend mouseleave', function(e) {
      var w = $current.width(),
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
      if(e.type == 'mouseenter') {
        timer = clearTimeout(timer);
        anim('forward', side);
        state = true;
      } else if(e.type == 'mouseleave') {
        anim('back', side);
        timer = setTimeout(randomAnimation, interval);
      }
    })
  })
}


