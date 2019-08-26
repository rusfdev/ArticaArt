import Barba from "barba.js";
import device from 'current-device';
import Scrollbar from 'smooth-scrollbar';
import easing from '../libs/easing/easing';
import bgVideo from '../libs/bg-video/bgvideo';
import TweenMax from "gsap/TweenMax";
import Lazy from "jquery-lazy";
import Parallax from 'parallax-js'
import Splitter from 'split-html-to-chars';

//global var
var $document = $(document),
    $page = $('.page-wrapper'),
    $pageContainer = $('.page-container'),
    $preloader = $('.preloader'),
    $barbaContainer = $('.barba-container'),
    $paginationItem,
    $logo = $('.logo'),
    $container = $('.container_display-size'),
    $inner = $('.container__inner'),
    $scrollThumb,
    $label = $('.label-ind'),
    $header = $('.header'),
    headerH,
    headerIsVisible = true,
    dataNewLabel = false,
    dataOldLabel = false,
    exitAnimationProgress,
    enterAnimationProgress,
    inScroll = false,
    pageW,
    pageOrder = $barbaContainer.data('order'),
    pageId = $barbaContainer.attr('id'),
    enterAnimation,
    exitAnimation,
    logoState = false,
    navState = false,
    logoAnimation,
    navBtnFadeAnimation = new TimelineMax({paused: true})
      .set('.nav-btn', {autoAlpha: 1})
      .staggerFromTo('.nav-btn__item', 1.25, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut, stagger: {amount: 0.25}})
      .staggerFromTo('.nav-btn__item', 1.25, {x: 50}, {x: 0, ease: Power3.easeOut, stagger: {amount: 0.25}}, 0, '-=1.5')
      .to('.nav-btn__item:eq(1)', 1, {scaleX: 0.7, xPercent: 15}, '-=1.5'),
    mouseAnimation,
    mouseHoverAnimation,
    paginationAnimation,
    navBtnHoverAnimation,
    navBtnAnimation,
    scrollbarAnimation,
    labelFadeAnimation,
    labelHideAnimation,
    headerToggleAnimation = new TimelineMax(),
    headerStyleAnimation = new TimelineMax(),
    headerItemsAnimation = new TimelineMax(),
    project1backgroundAnimation,
    preloaderTimer,
    displayHeight,
    scrollbar,
    scrollY;


$document.ready(function() {
  nav();
  barba();
  scroll();
});

window.addEventListener('load', 
  function() {
    pageEnterAnimation(true);
}, false);
window.addEventListener('resize', function(){
  resizeEvents('fast');
});

//functions
$.fn.hasAttr = function(name) {  
  return this.attr(name) !== undefined;
};

function resizeEvents(type) {
  $container = $('.container_display-size'),
  $inner = $('.container__inner'),
  displayHeight = $('body').height(),
  headerH = $header.height(),
  pageW = $page.width();

  $container.css('height', displayHeight);
  $pageContainer.css('height', displayHeight);

  var innerHeight = $inner.height();

  $label.each(function() {
    var $el = $(this),
        elHeight = $el.height(),
        elYpos = $inner.offset().top - $container.offset().top + innerHeight - elHeight;
    if(type == 'fast') {
      var anim = new TimelineMax().set($el, {y: elYpos});
    } else {
      var anim = new TimelineMax().to($el, 1.5, {y: elYpos, ease: Power3.easeInOut});
    }
  })

  $('.lazy').each(function() {
    imagesResize($(this))
  });
}
function imagesResize(element) {
  var box = element.parent();
  if(!box.hasClass('cover-box_size-auto')) {
    var boxH = box.height(),
        boxW = box.width();
    setTimeout(function() {
      var imgH = element.height(),
          imgW = element.width();
      if ((boxW / boxH) >= (imgW / imgH)) {
      element.addClass('ww').removeClass('wh');
      } else {
        element.addClass('wh').removeClass('ww');
      }
    }, 50)
  }
}
function headerView(view) {
  if(view=='new') {
    headerStyleAnimation.stop();
    headerStyleAnimation = new TimelineMax()
      .set($header.find('.header__background'), {opacity: 1})
      .set('.nav-btn__item', {css:{backgroundColor: '#000'}})
      .set('.logo_small svg', {css:{fill: '#000'}})
  } else if(view=='default') {
    headerStyleAnimation.stop();
    if(exitAnimationProgress==true && inScroll !== true) {
      if(headerIsVisible == true) {
        headerStyleAnimation = new TimelineMax()
          .to($header, 1, {y: 0, ease: Power2.easeIn})
          .to($header.find('.header__background'), 1, {opacity: 0, ease: Power2.easeIn}, '-=1')
          .to($header.find('.header__shadow'), 1, {opacity: 0, ease: Power2.easeIn}, '-=1')
          .to('.nav-btn__item', 1, {css:{backgroundColor: '#000'}, ease: Power2.easeIn}, '-=1')
          .to('.logo_small svg', 1, {css:{fill: '#000'}, ease: Power2.easeIn}, '-=1')
      } else {
        headerStyleAnimation = new TimelineMax()
          .set($header.find('.header__background'), {opacity: 0})
          .set($header.find('.header__shadow'), {opacity: 0})
          .set('.nav-btn__item', {css:{backgroundColor: '#000'}})
          .set('.logo_small svg', {css:{fill: '#000'}})
          .to($header, 1, {y: 0, ease: Power1.easeOut, onComplete: function() {
            headerIsVisible = true;
        }})
      }
    } else {
      headerStyleAnimation = new TimelineMax()
      .to($header.find('.header__background'), 0.5, {opacity: 0, ease: Power2.easeOut})
      .to($header.find('.header__shadow'), 0.5,{opacity: 0,  ease: Power2.easeOut}, '-=0.5')

      if(pageId=='project3') {
        headerItemsAnimation = new TimelineMax()
          .to('.nav-btn__item', 0.5, {css:{backgroundColor: '#fff'},  ease: Power2.easeOut})
      }
    }
  }
}
function scrollbarFunction() {
  //init scrollbar
    scrollbar = Scrollbar.init(document.querySelector('.page-container'), {
      damping: 0.03
    });
    $scrollThumb = $('.scrollbar-thumb');
    $scrollThumb.append('<span></span>');
    scrollbar.addListener(listener);
    scrollbar.track.yAxis.show();

  var flag1 = false,
      flag2 = false,
      flag3 = false,
      scrollOld = 0,
      changeColorAnim;

  if(pageId=='project3') {
    changeColorAnim = new TimelineMax()
    .set($scrollThumb.find('span'), {css:{backgroundColor: '#fff'}})
  }
  function listener(status) {
    scrollY = scrollbar.offset.y;

    if(pageId=='project1') {
      if(scrollY < displayHeight) {
        var parralaxAnimation = new TimelineMax()
          .set($('.project__layer:first-child .project__layer-container'), {y: -(scrollY - scrollY/1.25), x:(scrollY - scrollY/1.025)})
          .set($('.project__layer:last-child .project__layer-container'), {y: -(scrollY - scrollY/1.15), x:-(scrollY - scrollY/1.025)})
      }
    } else if(pageId=='project3') {
      if(scrollY < displayHeight) {
        var parralaxAnimation = new TimelineMax()
          .set($('.project__layer:first-child .project__layer-container'), {y: -(scrollY - scrollY/1.25)})
          .set($('.project__layer:last-child .project__layer-container'), {y: -(scrollY - scrollY/1.15)})
      }
      var x1 = scrollbar.size.container.height - scrollY,
          x2 = scrollbar.track.yAxis.thumb.offset + scrollbar.track.yAxis.thumb.realSize/2;
      if(x1 < x2) {
        if(flag1 == false) {
          flag1 = true;
          changeColorAnim = new TimelineMax()
            .to($scrollThumb.find('span'), 1, {css:{backgroundColor: '#000'}})
          }
      } else {
        if(flag1 == true) {
          flag1 = false;
          changeColorAnim = new TimelineMax()
            .to($scrollThumb.find('span'), 1, {css:{backgroundColor: '#fff'}})
          }
      } 
    }

    //если скролл вниз
    if(scrollY > scrollOld) {
      if(flag2 == false && headerIsVisible == true && scrollY>headerH) {
        flag2 = true;
        headerToggleAnimation.stop();
        headerToggleAnimation.eventCallback("onComplete", null);
        headerToggleAnimation = new TimelineMax()
        .to($header, 0.5, {y: -headerH, ease: Sine.easeIn, 
          onComplete: function() {
            headerIsVisible = false;
          }
        })
        .to($header.find('.header__shadow'), 0.5, {opacity: 0, ease: Sine.easeIn}, '-=0.5')
      }
    }
    //если скролл вверх
    else if(exitAnimationProgress!==true) {
      if(flag2 == true && scrollY>displayHeight && headerIsVisible == false) {
        flag2 = false;
        headerToggleAnimation.stop();
        headerToggleAnimation.eventCallback("onComplete", null);
        headerToggleAnimation = new TimelineMax()
        .to($header, 0.5, {y: 0, ease: Power3.easeOut, 
          onStart: function() {
            headerView('new');
          },
          onComplete: function() {
            headerIsVisible = true;
          }
        })
        .to($header.find('.header__shadow'), 0.5, {opacity: 1, ease: Power3.easeOut}, '-=0.5')
      }
      if(flag2 == false && headerIsVisible == true && scrollY<displayHeight && scrollY>headerH) {
        flag2 = true;
        headerToggleAnimation = new TimelineMax()
          .to($header, 0.5, {y: -headerH, ease: Power2.easeIn, 
            onComplete: function() {
              headerIsVisible = false;
              headerView('default');
            }
          })
          .to($header.find('.header__shadow'), 0.5, {opacity: 0, ease: Power2.easeIn}, '-=0.5')
      }
      if(scrollY<headerH) {
        flag2 = false;
        headerToggleAnimation.stop();
        headerToggleAnimation.eventCallback("onComplete", null);
        headerToggleAnimation = new TimelineMax()
        .to($header, 0.5, {y: 0, ease: Power3.easeOut, 
          onStart: function() {
            headerView('default');
          },
          onComplete: function() {
            headerIsVisible = true;
          }
      })
      }
    }
    scrollOld = scrollY;
  }
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
//split text
function splitText() {
  let $els = document.querySelectorAll(".js-split");
  [].forEach.call($els, function(el) {
    if(!el.classList.contains('js-splitted')) {
      el.classList.add('js-splitted');
      el.outerHTML = Splitter(el.outerHTML, '<span class="letter">$</span>');
    }
  })
}
//parralax
function parralaxProject() {
  if($('html').hasClass('desktop')) {
    //init parralax
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
      limitY: '10',
      limitX: '80'
    });
  }
}
function parralaxMain() {
  if($('html').hasClass('desktop')) {
    //init parralax
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
      limitY: '80',
      limitX: '80'
    });
  }
}
function nav() {
  var $navButton = $('.nav-btn');
  
  navBtnHoverAnimation = new TimelineMax({paused: true})
    .to('.nav-btn__item:eq(1)', 0.3, {scaleX:1, xPercent:0, ease: Power1.easeOut})
    .to('.nav-btn__item:eq(0), .nav-btn__item:eq(2)', 0.3, {scaleX:0.7, xPercent:15, ease: Power1.easeOut}, '-=0.3')
  navBtnAnimation = new TimelineMax({paused: true})
    .to('.nav-btn__item:eq(1)', 0.3, {scaleX:1, xPercent:0, ease: Power1.easeOut})
  
  $navButton.on('click mouseenter touchstart touchend mouseleave', function(e) {
    e.preventDefault();
    if(e.type == 'mouseenter' || e.type == 'touchstart') {
      navBtnHoverAnimation.play();
    } else if(e.type == 'mouseleave' || e.type == 'touchend') {
      navBtnHoverAnimation.reverse();
    }
  })
}
function pagination() {
  $paginationItem = $('.pagination__item');
  $paginationItem.find('.pagination__link').removeClass('active').removeClass('onload');
  $paginationItem.eq(pageOrder - 1).find('.pagination__link').addClass('active');
}
function logoToggle(state) {
  if(state == true && logoState==false) {
    logoAnimation = new TimelineMax()
    .set($logo, {autoAlpha: 1})
    .staggerFromTo($logo.find('.logo__item'), 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut, stagger: {amount: 0.5}})
    .staggerFromTo($logo.find('.logo__item'), 1, {yPercent: 50, xPercent:-15}, {yPercent:0, xPercent:0, ease: Power4.easeOut, stagger: {amount: 0.5}}, 0, '-=1.5'),
    logoState=true;
  } else if(state == false && logoState==true) {
    if(inScroll == true) {
      logoAnimation = new TimelineMax()
      .to($logo, 0.5, {opacity: 0, ease: Power1.easeIn})
      .set($logo, {autoAlpha: 0})
    } else {
      logoAnimation = new TimelineMax()
      .staggerTo($logo.find('.logo__item'), 0.5, {opacity: 0, yPercent: 50, xPercent:-15, ease: Power2.easeIn, stagger: {from: "end", amount: 0.5}})
      .set($logo, {autoAlpha: 0})
    }
    logoState=false;
  }
}
function navToggle(state) {
  if(state == true && navState==false) {
    paginationAnimation = new TimelineMax()
    .set('.pagination', {autoAlpha: 1})
    .staggerFromTo('.pagination__item', 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut, stagger: {amount: 0.5}})
    .staggerFromTo('.pagination__item', 1, {y: 40, x: 40}, {y: 0, x: 0, ease: Power3.easeOut, stagger: {amount: 0.5}}, 0, '-=1.5')
    navState=true;
  } else if(state == false && navState==true) {
    if(inScroll == true) {
      paginationAnimation = new TimelineMax()
      .to('.pagination', 0.5, {opacity: 0, ease: Power1.easeIn})
      .set('.pagination', {autoAlpha: 0})
    } else {
      paginationAnimation.reverse();
    }
    navState=false;
  }
}
function labelToggle(dataLabel, state) {
  var $el = $('#' + dataLabel);
  if(state == true) {
    labelFadeAnimation = new TimelineMax()
      .set($el, {autoAlpha: 1}).set($el, {css: {'z-index': '100'}})
      .fromTo($el.find('.icon'), 1.5, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
      .fromTo($el.find('.icon'), 1.5, {rotation: 0}, {rotation: 180, ease: Power3.easeOut}, '-=1.5')
      .fromTo($el.find('.label-item__title'), 0.5, {yPercent: 50}, {autoAlpha: 1, yPercent: 0},'-=1')
      .staggerFromTo($el.find('.letter'), 0.5, {opacity: 0, yPercent: 35, xPercent:-10}, {opacity:1, yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {amount: 0.5}}, 0, '-=1')
    dataOldLabel = dataNewLabel;
    } else {
    if(inScroll == true) {
      labelHideAnimation = new TimelineMax()
      .set($el, {css: {'z-index': '99'}})
      .to($el, 0.5, {autoAlpha: 0, ease: Power1.easeIn})
    } else {
      labelHideAnimation = new TimelineMax()
      .set($el, {css: {'z-index': '99'}})
      .to($el.find('.icon'), 1, {opacity: 0, rotation: 0, ease: Power3.easeIn})
      .to($el.find('.label-item__title'), 0.75, {opacity: 0, yPercent: 50, ease: Power3.easeIn}, '-=0.75')
      .set($el, {autoAlpha: 0})
    }
  }
}
function onCompleteAnimation(type) {
  inScroll = false;
  enterAnimationProgress = false;
}

function pageEnterAnimation(firstAnimation) {
  $barbaContainer = $('.barba-container');
  pageId = $barbaContainer.attr('id');
  pageOrder = $barbaContainer.data('order');
  $barbaContainer.show();
  splitText();

  //проверка какой нужно показать лейбл и показывать ли его вообще
  if($barbaContainer.hasAttr('data-label')) {
    if($barbaContainer.hasAttr('data-project')) {
      $label.find('.label-ind__container').css('background-color', '#fff');
    } else {
      $label.find('.label-ind__container').css('background-color', 'transparent');
    }
    //
    dataNewLabel = $barbaContainer.data('label');
    if(dataNewLabel !== dataOldLabel) {
      if(dataOldLabel !== false) {
        labelToggle(dataOldLabel, false);
      }
      labelToggle(dataNewLabel, true);
    }
  } else {
    if(dataOldLabel !== false) {
      labelToggle(dataOldLabel, false);
      dataOldLabel = false;
      dataNewLabel = false;
    }
  }

  //Если есть картинки - сначала грузим их, далее запускаем анимацию
  if($barbaContainer.find('.lazy').length > 0) {
    var imageLoaded = 0,
        imagesCount = $barbaContainer.find('.lazy').length;
    $('.lazy').bind('load', function () {
      imageLoaded = imageLoaded + 1;
      if(imageLoaded == imagesCount) {
        anim();
      }
    });
    $(".lazy").Lazy({
      effect: 'fadeIn',
      visibleOnly: true,
      effectTime: 0,
      threshold: 0,
      imageBase: false,
      defaultImage: false,
      afterLoad: function(element) {
        imagesResize(element);
      }
    });
  } else {
    anim();
  }

  function anim() {
    exitAnimationProgress = false;
    enterAnimationProgress = true;
    inScroll = true;
    preloaderTimer = clearTimeout(preloaderTimer);
    $preloader.fadeOut(200);
    pagination();
    if(firstAnimation==true) {
      $page.css({'visibility': 'visible'});
      navBtnFadeAnimation.play();
      resizeEvents('fast');
      if(pageId !== 'main') {
        logoToggle(true);
        logoState = true;
        if(!$barbaContainer.hasAttr('data-project')) {
          navToggle(true);
          navState = true;
        }
      }
    } else {
      enterAnimation.stop();
      resizeEvents();
      if(pageId !== 'main') {
        logoToggle(true);
        if(!$barbaContainer.hasAttr('data-project')) {
          navToggle(true);
        } else {
          navToggle(false);
        }
      } else {
        logoToggle(false);
        navToggle(false);
      }
    }
    //анимация для главной страницы
    if(pageId=='main') {
      parralaxMain();
      var flag = false;
      mouseAnimation = new TimelineMax({repeat: -1})
      .fromTo('.main-page__scroll svg:last-child', 0.5, {opacity: 0}, {opacity: 1})
      .fromTo('.main-page__scroll svg:last-child', 1.25, {y:0}, {y:7, ease: Power1.easeOut}, '-=0.5')
      .fromTo('.main-page__scroll svg:last-child', 0.5, {opacity: 1}, {opacity: 0, ease: Power1.easeOut}, '-=0.5')

      enterAnimation = new TimelineMax({onComplete:function(){onCompleteAnimation();mainVideo();}})
      .set('.page-block', {autoAlpha: 1})
      .fromTo('.main-page__scroll, .main-page__background', 1.5, {opacity:0}, {opacity:1, ease: Power2.easeInOut})
      .fromTo('.main-page__background', 1.5, {scale:1.3}, {scale:1, ease: Power2.easeOut}, '-=1.5')
      .fromTo('.main-page__scroll', 1.5, {y: -100}, {y:0, ease: Power3.easeOut}, '-=1.5')
      .staggerFromTo('.main-page .logo__item', 1, {opacity: 0}, {opacity: 0.6, ease: Power2.easeInOut, stagger: {amount: 0.5}}, 0, '-=1.5')
      .staggerFromTo('.main-page .logo__item', 1, {yPercent: 50, xPercent:-15}, {yPercent:0, xPercent:0, ease: Power4.easeOut, stagger: {amount: 0.5}}, 0, '-=1.5')
      .staggerFromTo('.logo__description .latter', 0.75, {opacity: 0}, {opacity: 0.6, ease: Power2.easeInOut, stagger: {amount: 0.75}}, 0, '-=1.5')
      .staggerFromTo('.logo__description .latter', 0.75, {yPercent: 50, xPercent:-15}, {yPercent:0, xPercent:0, ease: Power4.easeOut, stagger: {amount: 0.75}}, 0, '-=1.5')

      $('.main-page__scroll').on('click mouseenter touchstart mouseleave touchend', function(e) {
        if(e.type == 'mouseenter' || e.type == 'touchstart') {
          mouseAnimation.stop();
          if(flag==true) {
            mouseHoverAnimation.stop();
          }
          mouseHoverAnimation = new TimelineMax()
          .to('.main-page__scroll svg:last-child', 0.5, {opacity: 1, y:10})
          flag = true;
        } else if(e.type == 'mouseleave' || e.type == 'touchend') {
          if(exitAnimationProgress == false) {
            mouseHoverAnimation = new TimelineMax({onComplete: function() {
              mouseAnimation.restart();
            }})
            .to('.main-page__scroll svg:last-child', 0.5, {opacity: 0})
          }
        }
      })
    }
    //анимация для страницы категорий
    else if(pageId=='categories') {
      categories();
      enterAnimation = new TimelineMax({onComplete:function(){onCompleteAnimation()}})
      .set('.page-block, .categories-block .label-item', {autoAlpha: 1})
      .staggerFromTo(".categories-block__container", 1, {opacity:0}, {opacity:1, ease: Power2.easeInOut, stagger: {amount: 0.5}})
      .staggerFromTo(".categories-block__container", 1, {yPercent: 50}, {yPercent: 0, ease: Back.easeOut.config(3), stagger: {amount: 0.5}}, 0, '-=1.5');
    }
    //анимация для превью страниц
    else if(pageId=='projectPreview') {
      enterAnimation = new TimelineMax({onComplete:function(){onCompleteAnimation()}})
      .set('.page-block', {autoAlpha: 1})
      .fromTo('.project-preview__container', 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
      .fromTo('.project-preview__image .project-preview__link', 1.5, {xPercent: -50}, {xPercent: 0, ease: Power3.easeOut}, '-=1')
      .fromTo('.project-preview__title', 1.5, {yPercent: -50}, {yPercent: 0, ease: Power3.easeOut}, '-=1.5')
      .fromTo('.project-preview__line', 1.5, {xPercent: 50}, {xPercent: 0, ease: Power3.easeOut}, '-=1.5')
      .fromTo('.project-preview__description', 1.5, {xPercent: -100}, {xPercent: 0, ease: Power3.easeOut}, '-=1.5')
      .fromTo('.project-preview__demo', 1.5, {y: -40}, {y: 0, ease: Power3.easeOut}, '-=1.5')
    }
    else if(pageId=='project1') {
      parralaxProject();
      project1backgroundAnimation = new TimelineMax({repeat: -1, paused: true})
        .to('.project__head, .label-ind__container, .label-item__title', 2, {css: {backgroundColor: '#F39500'}, ease: Power2.easeInOut}, '+=2')
        .to('.project__head, .label-ind__container, .label-item__title', 2, {css: {backgroundColor: '#980000'}, ease: Power2.easeInOut}, '+=2')
        .to('.project__head, .label-ind__container, .label-item__title', 2, {css: {backgroundColor: '#FACB8D'}, ease: Power2.easeInOut}, '+=2')
        .to('.project__head, .label-ind__container, .label-item__title', 2, {css: {backgroundColor: '#003679'}, ease: Power2.easeInOut}, '+=2')
      enterAnimation = new TimelineMax({onComplete:function(){onCompleteAnimation();project1backgroundAnimation.play();scrollbarFunction();}})
        .set('.page-block', {autoAlpha: 1})
        .fromTo('.project1__scene, .project__description', 1.5, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
        .fromTo('.project1__layer:first-child .project1__layer-container', 1.5, {x:50}, {x:0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.project1__layer:last-child .project1__layer-container', 1.5, {x:-50}, {x:0, ease: Power3.easeOut}, '-=1.5')
        .to('.project__head, .label-ind__container, .label-item__title', 1.5, {css: {backgroundColor: '#003679'}, ease: Power3.easeOut}, '-=1.5')
    }
    //анимация для project3
    else if(pageId=='project3') {
      parralaxProject();
      enterAnimation = new TimelineMax({onComplete:function(){onCompleteAnimation();scrollbarFunction()}})
      .set('.page-block', {autoAlpha: 1})
      .to('.project3__line span:first-child', 0.5, {yPercent: -100, ease: Power2.easeIn})
      .to('.project3__line span:last-child', 0.5, {yPercent: 100, ease: Power2.easeIn}, '-=0.5')
      .set('.project3__background', {autoAlpha: 1})
      .to('.project3__background-item:first-child span', 0.7, {xPercent: -100, ease: Power2.easeOut})
      .to('.project3__background-item:last-child span', 0.7, {xPercent: 100, ease: Power2.easeOut}, '-=0.7')
      .to('.label-item__title, .label-ind__container', 0.7, {css:{backgroundColor: '#efefef'}}, '-=0.7')
      .to('.nav-btn__item', 0.7, {css:{backgroundColor: '#fff'}}, '-=0.7')
      .set('.project3__overlay', {autoAlpha: 1})
      .to('.project3__overlay-item span', 0.5, {xPercent: -100, ease: Power3.easeIn})
      .set('.project3__line', {autoAlpha: 0})
      .fromTo('.project3 .hidden-item', 0.5, {x: 50, opacity: 0}, {x: 0, opacity: 1, ease: Power3.easeOut})
      .to('.project3__overlay-item span', 0.5, {xPercent: -200, ease: Power3.easeOut}, '-=0.5')
      .set('.project3__overlay', {autoAlpha: 0})
    }
  }
}
$document.on('click', '.ajax-link', function(e) {
  e.preventDefault();
  var $link = $(this);
  
  if($link.hasClass('index-link')) {
    logoToggle(false);
    if(!$barbaContainer.hasAttr('data-project')) {
      navToggle(false);
    }
  } else if($link.hasClass('pagination__link')) {
    $link.addClass('onload');
  } else if($link.hasClass('project-link')) {
    navToggle(false);
  }
  //labels
  if(dataOldLabel !== false) {
    if($link.attr('data-label')) {
      if(dataOldLabel !== $link.data('label')) {
        labelToggle(dataOldLabel, false);
      }
    } else {
      labelToggle(dataOldLabel, false);
      dataOldLabel = false;
      dataNewLabel = false;
    }
  }
})

function scroll() {
  var h,
      $link,
      pagesCount = $('.pagination__link').length;
  $(window).on('wheel', function(event){
    if(exitAnimationProgress==false) {
      if(!$barbaContainer.hasClass('project')) {
        if(pageId=='main' && !enterAnimationProgress) {
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

      exitAnimationProgress = true;

      pageExitAnimation(oldId);

      function timerStart() {
        preloaderTimer = setTimeout(function() {
          $preloader.fadeIn(200);
        }, 500)
      }

      function pageExitAnimation() {
        enterAnimation.eventCallback("onComplete", null);
        var exitAnimationFast = new TimelineMax({paused: true, onComplete:function(){timerStart();deferred.resolve()}})
          .to('.page-block', 0.5, {opacity: 0, ease: Power2.easeIn})
        
        //анимация для главной страницы
        if(oldId == 'main') {
          if(inScroll == true) {
            exitAnimation = exitAnimationFast.play();
          } else {
            exitAnimation = new TimelineMax({onStart:function() {
              mouseAnimation.stop();
              mouseHoverAnimation = new TimelineMax()
              .to('.main-page__scroll svg:last-child', 1, {y:50, ease: Power3.easeInOut})
              .to('.main-page__scroll svg:last-child', 0.25, {opacity: 1, ease: Power2.easeIn}, '-=1')
              .to('.main-page__scroll svg:first-child', 0.75, {opacity: 0, ease: Power2.easeInOut}, '-=0.75')
              .to('.main-page__scroll svg:last-child', 0.75, {opacity: 0, ease: Power2.easeInOut}, '-=0.75')
              }, onComplete:function(){timerStart();deferred.resolve()}})
              .staggerTo('.main-page .logo__item', 0.5, {opacity: 0, yPercent: 50, xPercent:-15, ease: Power2.easeIn, stagger: {from: "end", amount: 0.5}})
              .staggerTo('.logo__description .latter', 0.5, {opacity: 0, yPercent: 50, xPercent:-15, ease: Power3.easeIn, stagger: {from: "end", amount: 0.5}}, 0, '-=1')
              .to('.main-page__background', 1, {scale:1.3, opacity:0, ease: Power3.easeIn}, '-=1') 
          }
        }
        //анимация для страницы категорий
        else if(oldId=='categories') {
          if(inScroll == true) {
            exitAnimation = exitAnimationFast.play();
          } else {
            exitAnimation = new TimelineMax({onComplete:function(){timerStart();deferred.resolve()}})
              .staggerTo(".categories-block__container", 0.5, {opacity:0, yPercent: 50, ease: Power3.easeIn, stagger: {from: 'end', amount: 0.5}});
          }
        }
        //анимация для страницы превью
        else if(oldId == 'projectPreview') {
          if(inScroll == true) {
            exitAnimation = exitAnimationFast.play();
          } else {
            exitAnimation = new TimelineMax({onComplete:function(){timerStart();deferred.resolve()}})
              .to('.project-preview__image .project-preview__link', 1, {xPercent: 100, opacity: 0, ease: Power3.easeIn})
              .staggerTo('.project-preview__item', 0.7, {x: -200, opacity: 0, ease: Power3.easeIn, stagger: {amount: 0.3, from: 'end'}}, 0, '-=1')
          }
        }
        //для страниц проектов
        else if($barbaContainer.hasAttr('data-project')) {
          if(inScroll == true) {
            enterAnimation.stop();
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
              .to('.project__container, .project__content, .project3__head', 0.5, {opacity: 0, ease: Power2.easeIn})
              .to('.project1__head, .label-ind__container, .label-item__title', 0.5, {css:{backgroundColor: '#fff'}, ease: Power2.easeIn}, '-=0.5')
              .to('.nav-btn__item', 0.5, {css:{backgroundColor: '#000'}, ease: Power2.easeIn}, '-=0.5')
              .to('.logo_small svg', 0.5, {css:{fill: '#000'}, ease: Power2.easeIn}, '-=0.5')
          } else {
            if(scrollY>0) {
              headerView('default');
              scrollbar.scrollTo(0, 0, 1000, {
                easing: easing.easeFromTo
              });
            }
            scrollbarAnimation = new TimelineMax()
              .to($scrollThumb, 1, {opacity: 0, ease: Power2.easeIn, onComplete: function() {
                scrollbar.destroy();
              }})
              
            if(pageId=='project1') {
              project1backgroundAnimation.stop();
            }
            exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
              .to('.project__head, .label-ind__container, .label-item__title, .project3__background-item span', 1, {css: {backgroundColor: '#fff'}, ease: Power4.easeIn})
              .to('.project__content, .project__text, .project__description', 1, {autoAlpha: 0, ease: Power2.easeIn}, '-=1')
              .to('.project__scene', 1, {autoAlpha: 0, ease: Power1.easeIn}, '-=1')
              .to('.project__scene', 1, {scale: 0.5, ease: Power2.easeIn}, '-=1')
              .to('.nav-btn__item', 1, {css:{backgroundColor: '#000'}, ease: Power2.easeIn}, '-=1')
              .to('.logo_small svg', 1, {css:{fill: '#000'}, ease: Power2.easeIn}, '-=1')
          }
        }
        //анимация для остальных
        else {
          deferred.resolve();
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
function categories(state) {
  var $block = $('.categories-block__container');
  
  function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  

  $block.each(function() {
    var $current = $(this),
        animation,
        animationRandom,
        state = false,
        random = randomInteger(1, 9),
        rotateVal = 0,
        totalVal,
        interval = random * 600,
        randomAnimation = function() {
          if(pageId=='categories') {
            random = randomInteger(1, 10);
            interval = random * 600;
            if(random > 5) {
              if(rotateVal == 360) {
                rotateVal = rotateVal - 180;
                totalVal = '-=180';
              } else {
                rotateVal = rotateVal + 180;
                totalVal = '+=180';
              }
            } else {
              if(rotateVal == -360) {
                rotateVal = rotateVal + 180;
                totalVal = '+=180';
              } else {
                rotateVal = rotateVal - 180;
                totalVal = '-=180';
              }
            }
            animationRandom = new TimelineMax()
            .to($current.find('.icon'), 0.5, {rotation: totalVal});
            timer = setTimeout(randomAnimation, interval);
          } else {
            timer = clearTimeout(timer);
          } 
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
          .to($current.find('.icon'), 1, {rotation: 180, ease: Power2.easeInOut})
          .to($current.find('.icon'), 0.5, {css:{fill:'#fff'}, ease: Power2.easeInOut}, '-=1')
          .fromTo($current.find('.categories-block__bg'), 0.5, {x: x, y: y}, {x: 0, y: 0, ease: Power1.easeOut},'-=1')
          .fromTo($current.find('.label-item__title'), 0.5, {y: 15, x: 0}, {autoAlpha: 1, y: 0},'-=0.5')
          .staggerFromTo($current.find('.letter'), 0.5, {opacity: 0, yPercent: 35, xPercent:-10}, {opacity:1, yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {each: 0.05}}, 0, '-=0.5')
      } else if(direction=='back') {
        animation = new TimelineMax()
          .to($current.find('.categories-block__bg'), 0.5, {x: x, y: y})
          .to($current.find('.label-item__title'), 0.25, {autoAlpha: 0}, '-=0.5')
          .set($current.find('.categories-block__bg'), {opacity: 0})
          .to($current.find('.icon'), 0.5, {css:{fill:'#000'}}, '-=0.5')
          .to($current.find('.icon'), 0.5, {rotation: 0}, '-=0.5')
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


