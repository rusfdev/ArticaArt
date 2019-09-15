import Barba from "barba.js";
import device from 'current-device';
import Scrollbar from 'smooth-scrollbar';
import easing from '../libs/easing/easing';
import Hammer from 'hammerjs';
import bgVideo from '../libs/bg-video/bgvideo';
import TweenMax, { TweenLite } from "gsap/TweenMax";
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
    $container,
    $inner,
    $scrollThumb,
    $label = $('.label-ind'),
    $header = $('.header'),
    headerIsVisible = true,
    //labels
    dataNewLabel = false,
    dataOldLabel = false,
    //page transitions
    enterAnimation,
    exitAnimation,
    defaultEnterAnimation,
    defaultEnterAnimationMobile,
    defaultExitAnimation,
    defaultExitAnimationMobile,
    forwardEnterAnimation,
    forwardExitAnimation,
    backEnterAnimation,
    backExitAnimation,
    enterAnimationProgress,
    exitAnimationProgress,
    animationDirection = 'default',
    animationTime = 0,
    firstAnimation = true,
    pageLoaded = false,
    //logo animations
    logoShowAnimation,
    logoHideAnimation,
    logoVisible = false,
    //paginationPreloader
    preloaderH,
    preloaderW,
    preloaderY,
    preloaderX,
    preloaderXright,
    preloaderYbottom,
    preloaderPosCenter = true,
    animationStartLoading,
    //pageParams
    pageW,
    headerH,
    innerH,
    innerW,
    //
    pageOrder = $barbaContainer.data('order'),
    pageId = $barbaContainer.attr('id'),
    navState = false,
    navBtnFadeAnimation,
    //main mouse button
    mouseAnimation,
    mouseTouched = false,

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
    deferred,
    scrollY;

window.addEventListener('load', 
  function() {
    newPageLoading();
    setParams();
    paginationPreloader();
}, false);
window.addEventListener('resize', function(){
  setParams();
});

//page transitions
function barba() {
  var ExpandTransition = Barba.BaseTransition.extend({
    start: function() {Promise.all([this.newContainerLoading, this.fadeOldPage()]).then(this.showNewPage.bind(this));},
    //exit
    fadeOldPage: function() {
      deferred = Barba.Utils.deferred();
      
      exitAnimationProgress = true;
      paginationPreloader();
      transitions();

      return deferred.promise;
    },
    //enter
    showNewPage: function() {
      console.log('new')
      this.done();
      newPageLoading();
    }
  });
  Barba.Pjax.getTransition = function() {
    var transitionObj = ExpandTransition;
    return transitionObj;
  }
  Barba.Pjax.start();     
}
//
function newPageLoading() {
  $barbaContainer = $('.barba-container');
  pageId = $barbaContainer.attr('id');
  pageOrder = $barbaContainer.data('order');
  //Если есть картинки - сначала грузим их, далее запускаем анимацию
  if($barbaContainer.find('.lazy').length > 0) {
    var imageLoaded = 0,
        imagesCount = $barbaContainer.find('.lazy').length;
    $('.lazy').bind('load', function () {
      imageLoaded = imageLoaded + 1;
      if(imageLoaded == imagesCount) {
        pageLoaded = true;
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
    pageLoaded = true;
  }
  splitText();
}
//анимации елементов при переходах
function transitions() {
  //если заходим на страницу
  if(enterAnimationProgress == true) {
    //переходы
    if(pageId=='main') {
      defaultEnterAnimation = new TimelineMax({paused: true})
        .set('.page-block', {autoAlpha: 1})
        .fromTo('.main-page__scroll, .main-page__background', 1.5, {opacity:0}, {opacity:1, ease: Power2.easeInOut})
        .fromTo('.main-page__background', 1.5, {scale:1.5}, {scale:1, ease: Power2.easeOut}, '-=1.5')
        .fromTo('.main-page__scroll', 1.5, {y: -100}, {y:0, ease: Power3.easeOut}, '-=1.5')
        .staggerFromTo('.main-page .logo__item', 1, {opacity: 0}, {opacity: 0.6, ease: Power2.easeInOut, stagger: {amount: 0.5, from: 'end'}}, 0, '-=1.5')
        .staggerFromTo('.main-page .logo__item', 1, {yPercent: -50, xPercent:15}, {yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {amount: 0.5, from: 'end'}}, 0, '-=1.5')
        .staggerFromTo('.logo__description .latter', 0.75, {opacity: 0}, {opacity: 0.6, ease: Power2.easeInOut, stagger: {amount: 0.75, from: 'end'}}, 0, '-=1.5')
        .staggerFromTo('.logo__description .latter', 0.75, {yPercent: -50, xPercent:15}, {yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {amount: 0.75, from: 'end'}}, 0, '-=1.5')
      defaultExitAnimation = new TimelineMax({paused: true})
        .staggerTo('.main-page .logo__item', 0.6, {opacity: 0, yPercent: -50, xPercent:15, ease: Power3.easeIn, stagger: {amount: 0.4}})
        .staggerTo('.logo__description .latter', 0.5, {opacity: 0, yPercent: -100, xPercent:15, ease: Power3.easeIn, stagger: {amount: 0.5}}, 0, '-=1')
        .to('.main-page__background', 1, {scale:1.5, opacity:0, ease: Power3.easeIn}, '-=1')
        .to('.main-page__scroll svg:last-child', 1, {y:50, ease: Power2.easeInOut}, '-=1')
        .to('.main-page__scroll svg:last-child', 0.25, {opacity: 1, ease: Power3.easeOut}, '-=1')
        .to('.main-page__scroll svg:first-child', 0.75, {opacity: 0, ease: Power2.easeInOut}, '-=0.75')
        .to('.main-page__scroll svg:last-child', 0.75, {opacity: 0, ease: Power2.easeInOut}, '-=0.75')
      forwardEnterAnimation = defaultEnterAnimation;
      forwardExitAnimation = defaultExitAnimation;
      backEnterAnimation = defaultEnterAnimation;
      backExitAnimation = defaultExitAnimation;
      enterAnimation = defaultEnterAnimation;
    } 
    else if(pageId=='categories') {
      defaultEnterAnimation = new TimelineMax({paused: true})
        .set('.page-block, .categories-block .label-item', {autoAlpha: 1})
        .fromTo('.categories-block', 1.5, {opacity:0}, {opacity:1, ease: Power2.easeInOut}) 
        .fromTo('.categories-block:first-child', 1.5, {yPercent: -100, xPercent: -100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(2)', 1.5, {yPercent: -100, xPercent: 0}, {yPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(3)', 1.5, {yPercent: -100, xPercent: 100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(4)', 1.5, {yPercent: 100, xPercent: -100}, {yPercent:0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(5)', 1.5, {yPercent: 100, xPercent: 0}, {yPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(6)', 1.5, {yPercent: 100, xPercent: 100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
      defaultEnterAnimationMobile = new TimelineMax({paused: true})
        .set('.page-block, .categories-block .label-item', {autoAlpha: 1})
        .fromTo('.categories-block', 1.5, {opacity:0}, {opacity:1, ease: Power2.easeInOut}) 
        .fromTo('.categories-block:first-child', 1.5, {yPercent: -100, xPercent: -100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(2)', 1.5, {yPercent: -100, xPercent: 100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(3)', 1.5, {yPercent: 0, xPercent: -100}, {xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(4)', 1.5, {yPercent: 0, xPercent: 100}, {xPercent:0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(5)', 1.5, {yPercent: 100, xPercent: -100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.categories-block:nth-child(6)', 1.5, {yPercent: 100, xPercent: 100}, {yPercent: 0, xPercent: 0, ease: Power3.easeOut}, '-=1.5')
      defaultExitAnimation = new TimelineMax({paused: true})
        .to('.categories-block', 1, {opacity:0}, {opacity:1, ease: Power3.easeIn}) 
        .to('.categories-block:first-child', 1, {yPercent: -100, xPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(2)', 1, {yPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(3)', 1, {yPercent: -100, xPercent: 100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(4)', 1, {yPercent: 100, xPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(5)', 1, {yPercent: 100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(6)', 1, {yPercent: 100, xPercent: 100, ease: Power3.easeIn}, '-=1')
      defaultExitAnimationMobile = new TimelineMax({paused: true})
        .to('.categories-block', 1, {opacity:0}, {opacity:1, ease: Power3.easeIn}) 
        .to('.categories-block:first-child', 1, {yPercent: -100, xPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(2)', 1, {yPercent: -100, xPercent: 100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(3)', 1, {xPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(4)', 1, {xPercent: 100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(5)', 1, {yPercent: 100, xPercent: -100, ease: Power3.easeIn}, '-=1')
        .to('.categories-block:nth-child(6)', 1, {yPercent: 100, xPercent: 100, ease: Power3.easeIn}, '-=1')  
      forwardEnterAnimation = new TimelineMax({paused: true})
        .set('.page-block, .categories-block .label-item', {autoAlpha: 1})
        .staggerFromTo(".categories-block", 1, {opacity:0}, {opacity:1, ease: Power2.easeInOut, stagger: {amount: 0.5}})
        .staggerFromTo(".categories-block", 1, {yPercent: 50, xPercent: 0}, {yPercent: 0, ease: Back.easeOut.config(3), stagger: {amount: 0.5}}, 0, '-=1.5');
      forwardExitAnimation = new TimelineMax({paused: true})
        .staggerTo(".categories-block", 0.5, {opacity: 0, yPercent: -50, ease: Power3.easeIn, stagger: {amount: 0.5}});
      backExitAnimation = new TimelineMax({paused: true})
        .staggerTo(".categories-block", 0.5, {opacity: 0, yPercent: 50, ease: Power3.easeIn, stagger: {amount: 0.5, from: 'end'}});
      backEnterAnimation = new TimelineMax({paused: true})
        .set('.page-block, .categories-block .label-item', {autoAlpha: 1})
        .staggerFromTo(".categories-block", 1, {opacity:0}, {opacity:1, ease: Power2.easeInOut, stagger: {amount: 0.5, from: 'end'}})
        .staggerFromTo(".categories-block", 1, {yPercent: -50, xPercent: 0}, {yPercent: 0, ease: Back.easeOut.config(3), stagger: {amount: 0.5, from: 'end'}}, 0, '-=1.5');
      
      if(animationDirection=='default') {
        if(pageW>768) {
          enterAnimation = defaultEnterAnimation;
        } else {
          enterAnimation = defaultEnterAnimationMobile;
        }
      } 
      else if(animationDirection=='forward') {
        if(pageW>768) {
          enterAnimation = forwardEnterAnimation;
        } else {
          enterAnimation = forwardEnterAnimationMobile;
        }
      } else if(animationDirection=='back') {
        if(pageW>768) {
          enterAnimation = backEnterAnimation;
        } else {
          enterAnimation = backEnterAnimationMobile;
        }
      }
    } 
    else if(pageId=='projectPreview') {
      defaultEnterAnimation = new TimelineMax({paused: true})
        .set('.page-block', {autoAlpha: 1})
        .fromTo('.project-preview__container', 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
        .fromTo('.project-preview__image', 1.5, {xPercent: -50}, {xPercent: 0, ease: Power3.easeOut}, '-=1')
        .fromTo('.project-preview__title', 1.5, {yPercent: -50}, {yPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.project-preview__line', 1.5, {xPercent: 50}, {xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.project-preview__description', 1.5, {xPercent: -100}, {xPercent: 0, ease: Power3.easeOut}, '-=1.5')
        .fromTo('.project-preview__demo', 1.5, {y: -40}, {y: 0, ease: Power3.easeOut}, '-=1.5')
      defaultExitAnimation = new TimelineMax({paused: true})
        .to('.project-preview__image', 1, {xPercent: 100, opacity: 0, ease: Power3.easeIn})
        .staggerTo('.project-preview__item', 0.7, {x: -200, opacity: 0, ease: Power3.easeIn, stagger: {amount: 0.3, from: 'end'}}, 0, '-=1')

      enterAnimation = defaultEnterAnimation;
      /* if(animationDirection=='default') {
        enterAnimation = defaultEnterAnimation;
      } 
      else if(animationDirection=='forward') {
        if(pageW>768) {
          enterAnimation = forwardEnterAnimation;
        } else {

        }
      } 
      else if(animationDirection=='back') {
        if(pageW>768) {
          enterAnimation = backEnterAnimation;
        } else {

        }
      }   */
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

    enterAnimation.play();
    enterAnimation.eventCallback("onStart", function(){
      curentLabel();
      if(firstAnimation==true) {
        logoAnimations();
        nav();
        $pageContainer.css('visibility', 'visible');
        $header.css('visibility', 'visible');
        navBtnFadeAnimation.play();
      }
      if(pageId == 'main') {
        logoToggle('hide')
        mainPageEvents();
      } else {
        logoToggle('show')
        if($barbaContainer.hasAttr('data-project')) {
        } else {
          if(pageId == 'categories') {
            categories();
          } else if(pageId == 'projectPreview') {
            hoverAnimations();
          }
        }
      }
    });
    enterAnimation.eventCallback("onComplete", function(){
      enterAnimationProgress=false;
      animationDirection = 'default';
      if(firstAnimation == true) {
        barba();
        siteNavEvents();
        firstAnimation = false;
      }
    });
  }
  //еcли выходим со страницы
  else if(exitAnimationProgress == true) {
    if(pageId=='main') {
      exitAnimation = defaultExitAnimation;
    } 
    else if(pageId=='categories') {
      if(animationDirection=='default') {
        if(pageW>768) {
          exitAnimation = defaultExitAnimation;
        } else {
          exitAnimation = defaultExitAnimationMobile;
        }
      }
      else if(animationDirection=='forward') {
        if(pageW>768) {
          exitAnimation = forwardExitAnimation;
        } else {

        }
      } 
      else if(animationDirection=='back') {
        if(pageW>768) {
          exitAnimation = backExitAnimation;
        } else {
          
        }
      }
    } 
    else if(pageId=='projectPreview') {
      exitAnimation = defaultExitAnimation;
    }

    exitAnimation.play();
    exitAnimation.eventCallback("onStart", function(){
      if(pageId=='main') {
        mouseAnimation.stop();
      }
    });
    exitAnimation.eventCallback("onComplete", function(){
      animationTime=0;
      deferred.resolve();
    });
  }
}
function pageExitAnimation() {

  var exitAnimationFast = new TimelineMax({paused: true, onComplete:function(){timerStart();deferred.resolve()}})
    .to('.page-block', 0.5, {opacity: 0, ease: Power1.easeIn})
  
  //для страниц проектов
  if($barbaContainer.hasAttr('data-project')) {
    if(enterAnimationProgress == true) {
      enterAnimation.stop();
      exitAnimation = new TimelineMax({onComplete:function(){deferred.resolve();timerStart()}})
        .to('.project__container, .project__content, .project3__head', 0.5, {opacity: 0, ease: Power1.easeIn})
        .to('.project1__head, .label-ind__container, .label-item__title', 0.5, {css:{backgroundColor: '#fff'}, ease: Power1.easeIn}, '-=0.5')
        .to('.nav-btn__item', 0.5, {css:{backgroundColor: '#000'}, ease: Power1.easeIn}, '-=0.5')
        .to('.logo_small svg', 0.5, {css:{fill: '#000'}, ease: Power1.easeIn}, '-=0.5')
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
function siteNavEvents() {
  var $link,
      Event,
      hrefAdress,
      $touchArea = document.querySelector('.page-wrapper'),
      pagesCount = $('.pagination__link').length,
      cursorPosD,
      timeSpeed = 1.5,
      touched = false,
      panLeft = false,
      panRight = false,
      panUp = false,
      panDown = false;

  var touchEvents = new Hammer.Manager($touchArea);
  var swipe = new Hammer.Swipe();
  var pan = new Hammer.Pan().set({ threshold: 1 });
  touchEvents.add(swipe);
  touchEvents.add(pan);

  //события свайпов
  touchEvents.on("swipeleft swiperight swipeup swipedown panleft panend panstart panup pandown panright", function(event) {
    Event = event.type;
    
    if(!enterAnimationProgress && !exitAnimationProgress) {
      //если поставили палец
      if(Event=='panstart') {
        touched = true;
        if(pageW>1024 || pageId=='main') {
          cursorPosD = event.center.y;
        } else {
          cursorPosD = event.center.x;
        }
      } 
      //подняли палец с дисплея
      else if(Event=='panend') {
        touched = false;
        animationTime = 0;
        backExitAnimation.reverse();
        forwardExitAnimation.reverse();
        animationStartLoading.reverse();
        if(pageId=='categories') {
          if(panDown==true || panRight==true) {
            logoHideAnimation.reverse();
          }
        }
        if(panLeft==true || panUp==true) {
        if(pageId=='main') {
            mouseAnimation.play();
          }
        }
        panLeft = false;
        panRight = false;
        panUp = false;
        panDown = false;
      }
      //если длина свайпа достаточная
      else if(animationTime>0.6) {
        touched = false;
        if(panUp==true || panLeft==true) {
          animationDirection = 'forward';
        } else if(panDown == true || panRight==true) {
          animationDirection = 'back';
        }
        panLeft = false;
        panRight = false;
        panUp = false;
        panDown = false;
      }
      //процесс ерзанья пальцами
      else if(touched==true) {
        if(pageW>1024 || pageId=='main') {
          if(Event=='panup') {
            if(panDown == false) {
              panUp = true;
              animationTime = -((event.center.y - cursorPosD)/displayHeight)*timeSpeed;
              forwardExitAnimation.play(animationTime, false);
              forwardExitAnimation.stop();
              animationStartLoading.play(animationTime, false);
              animationStartLoading.stop();
              if(pageId=='main') {
                mouseAnimation.stop();
              }
            } 
            else {
              if(animationTime>0) {
                backExitAnimation.reverse(animationTime);
                backExitAnimation.stop();
                animationStartLoading.reverse(animationTime);
                animationStartLoading.stop();
                if(pageId=='categories') {
                  logoHideAnimation.reverse(animationTime);
                  logoHideAnimation.stop();
                } 
                animationTime = ((event.center.y - cursorPosD)/displayHeight)*timeSpeed;
              } else {
                panDown = false;
              }
            }
          } else if(Event=='pandown') {
            if(panUp == false && pageId!=='main') {
              panDown = true;
              animationTime = ((event.center.y - cursorPosD)/displayHeight)*timeSpeed;
              backExitAnimation.play(animationTime, false);
              backExitAnimation.stop();
              animationStartLoading.play(animationTime, false);
              animationStartLoading.stop();
              if(pageId=='categories') {
                logoHideAnimation.play(animationTime);
                logoHideAnimation.stop();
              }
            } else {
              if(animationTime>0) {
                forwardExitAnimation.reverse(animationTime);
                forwardExitAnimation.stop();
                animationStartLoading.reverse(animationTime);
                animationStartLoading.stop();
                animationTime = -((event.center.y - cursorPosD)/displayHeight)*timeSpeed;
              } else {
                if(pageId=='main') {
                  cursorPosD = event.center.y;
                  if(mouseTouched == false) {
                    mouseAnimation.play();
                  }
                }
                panUp = false;
              }
            }
          }
        } 
        else {
          if(Event=='panleft') {
            if(panRight == false) {
              panLeft = true;
              animationTime = -((event.center.x - cursorPosD)/pageW)*timeSpeed;
              forwardExitAnimationMobile.play(animationTime, false);
              forwardExitAnimationMobile.stop();
              animationStartLoading.play(animationTime, false);
              animationStartLoading.stop();
            } 
            else {
              if(animationTime>0) {
                backExitAnimationMobile.reverse(animationTime);
                backExitAnimationMobile.stop();
                animationStartLoading.reverse(animationTime, false);
                animationStartLoading.stop();
                if(pageId=='categories') {
                  logoHideAnimation.reverse(animationTime);
                  logoHideAnimation.stop();
                } 
                animationTime = ((event.center.x - cursorPosD)/pageW)*timeSpeed;
              } else {
                panRight = false;
              }
            }
          } else if(Event=='panright') {
            if(panLeft == false) {
              panRight = true;
              animationTime = ((event.center.x - cursorPosD)/pageW)*timeSpeed;
              backExitAnimationMobile.play(animationTime, false);
              backExitAnimationMobile.stop();
              animationStartLoading.play(animationTime, false);
              animationStartLoading.stop();
              if(pageId=='categories') {
                logoHideAnimation.play(animationTime);
                logoHideAnimation.stop();
              }
            } else {
              if(animationTime>0) {
                forwardExitAnimationMobile.reverse(animationTime);
                forwardExitAnimationMobile.stop();
                animationStartLoading.reverse(animationTime, false);
                animationStartLoading.stop();
                animationTime = -((event.center.x - cursorPosD)/pageW)*timeSpeed;
              } else {
                panLeft = false;
              }
            }
          }
        }
      }
    }
    eventChecking();
  });
  //события скролла
  $(window).on('wheel', function(event){
    Event = event;
    if(Event.originalEvent === undefined) {
      animationDirection = 'back'
    } else {
      if(Event.originalEvent.deltaY > 0) {
        animationDirection = 'forward';
      } else {
        animationDirection = 'back'
      }
    }
    eventChecking();
  });

  //обрабокта событий
  function eventChecking() {
    if(!enterAnimationProgress && !exitAnimationProgress) {
        if(animationDirection == 'forward'){
          if(pageOrder < pagesCount-1) {
            $link = $('.pagination__item').eq(pageOrder + 1).find('.pagination__link');
            goToPage();
          }
        } else if(animationDirection == 'back') {
          if(pageOrder > 0) {
            $link = $('.pagination__item').eq(pageOrder - 1).find('.pagination__link');
            goToPage();
          } else {
            $link = $('.logo__link');
            goToPage();
          }
        }
    }
  }
  
  function goToPage() {
    $link.trigger('click');
    hrefAdress = $link.attr('href');
    Barba.Pjax.goTo(hrefAdress);
  }
}

//click actions
$document.on('click', '.ajax-link', function(e) {
  e.preventDefault();
  var $link = $(this);
  
  if($link.hasClass('index-link')) {
    animationDirection = 'back';
    logoToggle('hide');
  } else if($link.hasClass('pagination__link')) {
    if($link.parent().index()==0) {
      logoToggle('hide');
    }
    if($link.parent().index()>pageOrder) {
      animationDirection = 'forward';
    } else {
      animationDirection = 'back';
    }
  } else if($link.hasClass('project-link')) {
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

function paginationPreloader() {
  var $item,
  x, y,
  repeatCount = 0,
  minLoaderRepeat = 2,
  loadingFlag = false,
  animationLoadingEnd;

  function getParams() {
    $item = $('.pagination__item').eq(pageOrder);
    y = ($item.offset().top - $('.pagination').offset().top)*1.43;
    x = ($item.offset().left - $('.pagination').offset().left)*1.43;
    repeatCount = 0;
  }
  function getAnimations() {
    if(pageW>1024) {
      animationStartLoading = new TimelineMax({paused:true})
        .set('.pagination', {css:{'overflow': 'hidden'}})
        .set('a', {css:{'pointer-events': 'none'}})
        .set('.pagination__loader', {autoAlpha: 1})
        .to('.pagination__loader', 0.6, {y:0, ease: Power1.easeIn})
        .to('.pagination__loader', 0.6, {css:{'height':'100%'}, ease: Power1.easeIn}, '-=0.6')
        .to('.pagination', 0.6, {scale:0.7, ease: Power1.easeIn}, '-=0.6')
        .to('.pagination .dot', 0.6, {autoAlpha:0, ease:Power1.easeOut}, '-=0.6')
        .to('.pagination__bg', 0.6, {autoAlpha: 1, ease:Power1.easeIn}, '-=0.6')
      animationLoadingEnd = new TimelineMax({paused:true})
        .to('.pagination__loader', 0.9, {y:y, ease:Power3.easeInOut})
        .to('.pagination__loader', 0.9, {css:{'height':'8px'}, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination', 0.9, {scale:1, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination__bg', 0.9, {autoAlpha: 0, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination .dot', 0.9, {autoAlpha:1, ease:Power3.easeInOut}, '-=0.9')
        .set('.pagination__loader', {autoAlpha: 0})
        .set('a', {css:{'pointer-events': 'all'}})
        .set($item.find('.pagination__link'), {css:{'pointer-events': 'none'}})    
        .set('.pagination', {css:{'overflow': 'visible'}})
    } else {
      animationStartLoading = new TimelineMax({paused:true})
        .set('.pagination', {css:{'overflow': 'hidden'}})
        .set('a', {css:{'pointer-events': 'none'}})
        .set('.pagination__loader', {autoAlpha: 1})
        .to('.pagination__loader', 0.6, {x:0, ease:Power1.easeIn})
        .to('.pagination__loader', 0.6, {css:{'width':'100%'}, ease:Power1.easeIn}, '-=0.6')
        .to('.pagination', 0.6, {scale:0.7, ease:Power1.easeIn}, '-=0.6')
        .to('.pagination .dot', 0.6, {autoAlpha:0, ease:Power1.easeOut}, '-=0.6')
        .to('.pagination__bg', 0.6, {autoAlpha: 1, ease:Power1.easeIn}, '-=0.6')
      animationLoadingEnd = new TimelineMax({paused:true})
        .to('.pagination__loader', 0.9, {x:x, ease:Power3.easeInOut})
        .to('.pagination__loader', 0.9, {css:{'width':'8px'}, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination', 0.9, {scale:1, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination__bg', 0.9, {autoAlpha: 0, ease:Power3.easeInOut}, '-=0.9')
        .to('.pagination .dot', 0.9, {autoAlpha:1, ease:Power3.easeInOut}, '-=0.9')
        .set('.pagination__loader', {autoAlpha: 0})
        .set('a', {css:{'pointer-events': 'all'}})
        .set($item.find('.pagination__link'), {css:{'pointer-events': 'none'}})    
        .set('.pagination', {css:{'overflow': 'visible'}})
    }
    animationStartLoading.eventCallback("onComplete", function() {
      if(loadingFlag == false) {
        $item.find('.pagination__link').removeClass('active');
        loading();
      }
    });
    animationLoadingEnd.eventCallback("onStart", function() {
      $item.find('.pagination__link').addClass('active');
    });
  }
  function loading() {
    loadingFlag = true;
    if(pageW>1024) {
      var animationLoadingFrom = new TimelineMax({paused: true})
        .to('.pagination__loader', 0.5, {yPercent:100, ease:Power3.easeIn})
      var animationLoadingTo = new TimelineMax({paused: true})
        .fromTo('.pagination__loader', 0.5, {yPercent:-100, immediateRender: false}, {yPercent:0, ease:Power3.easeOut})
    } else {
      var animationLoadingFrom = new TimelineMax({paused: true})
        .to('.pagination__loader', 0.5, {xPercent:100, ease:Power3.easeIn})
      var animationLoadingTo = new TimelineMax({paused: true})
        .fromTo('.pagination__loader', 0.5, {xPercent:-100, immediateRender: false}, {xPercent:0, ease:Power3.easeOut})
    }
    animationLoadingFrom.play();
    animationLoadingFrom.eventCallback("onComplete", function() {
      animationLoadingTo.play();
      if(pageLoaded==true && repeatCount>=minLoaderRepeat) {
        pageLoaded = false;
        repeatCount = 0;
        minLoaderRepeat = 0;
        if(pageW>1440) {
          var animationPosDefault = new TimelineMax({paused: true})
            .to('.pagination', 1, {y:-(preloaderY-10), x:-preloaderXright, ease: Power2.easeInOut});
        } else if(pageW>1024) {
          var animationPosDefault = new TimelineMax({paused: true})
            .to('.pagination', 1, {y:-(preloaderY-15), x:-preloaderXright, ease: Power2.easeInOut});
        } else {
          var animationPosDefault = new TimelineMax({paused: true})
            .to('.pagination', 1, {y:-preloaderYbottom, x:-preloaderX, ease: Power2.easeInOut});
        }
        animationPosDefault.play();
        animationPosDefault.eventCallback("onComplete", function() {
          preloaderPosCenter = false;
        });
        exitAnimationProgress = false;
        enterAnimationProgress = true;
        setParams();
        transitions();
      } 
      else if(preloaderPosCenter==false) {
        var animationPosCenter = new TimelineMax()
          .to('.pagination', 1, {y:-preloaderY, x:-preloaderX, ease: Power2.easeInOut});
        animationPosCenter.play();
        animationPosCenter.eventCallback("onComplete", function() {
          preloaderPosCenter = true;
        });
      }
    });
    animationLoadingTo.eventCallback("onComplete", function() {
      if(enterAnimationProgress !== true) {
        repeatCount++;
        loading();
      }
      //завершение загрузки      
      else {
        loadingFlag = false;
        getParams();
        getAnimations();
        animationLoadingEnd.play();
      }
    });
  }

  //process
  getParams();
  if(firstAnimation==true) {
    var animationPosCenter = new TimelineMax({paused: true})
      .set('.pagination', {y:-preloaderY, x:-preloaderX, scale: 0.7})
      .to('.pagination', 1, {autoAlpha:1, ease: Power2.easeInOut});
    animationPosCenter.play();
    loading();
  } else {
    animationStartLoading.play(animationTime);
  }
}


//functions
$.fn.hasAttr = function(name) {  
  return this.attr(name) !== undefined;
};

function setParams() {
  $container = $('.container_display-size');
  $inner = $('.container__inner');
  displayHeight = $('body').height();
  headerH = $header.height();
  pageW = $page.width();
  preloaderH = $('.pagination').height();
  preloaderW = $('.pagination').width(); 
  $container.css('height', displayHeight);
  $pageContainer.css('height', displayHeight);
  innerH = $inner.height();
  innerW = $inner.width();
  preloaderY = displayHeight/2-preloaderH/2;
  preloaderX = pageW/2-preloaderW/2;
  preloaderXright = 31;
  preloaderYbottom = 20;
  $('.lazy').each(function() {
    imagesResize($(this))
  });
  if(enterAnimationProgress!==true) {
    if(preloaderPosCenter == true) {
      console.log('setcenter')
      var set = new TimelineMax()
        .set('.pagination', {y:-preloaderY, x:-preloaderX});
    } else {
      if(pageW>1440) {
        var set = new TimelineMax()
          .set('.pagination', {y:-(preloaderY-10), x:-preloaderXright});
      } else if(pageW>1024) {
        var set = new TimelineMax()
          .set('.pagination', {y:-(preloaderY-15), x:-preloaderXright});
      } else {
        var set = new TimelineMax()
          .set('.pagination', {y:-preloaderYbottom, x:-preloaderX});
      }
    }
  }
  $label.each(function() {
    var $el = $(this),
        elHeight = $el.height(),
        elYpos = $inner.offset().top + innerH - elHeight;
    if(firstAnimation == true) {
      var set = new TimelineMax().set($el, {y: elYpos});
    } else {
      var set = new TimelineMax().to($el, 1.5, {y: elYpos, ease: Power3.easeInOut});
    }
  })
  if(pageW<=768) {
    if(pageId=='projectPreview') {
      var $t = $('.project-preview__description'),
          lw = $('#' + dataNewLabel).width(),
          mw = innerWidth-lw;

      $t.css('max-width', mw)
    }
  }
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
    if(exitAnimationProgress==true && enterAnimationProgress !== true) {
      if(headerIsVisible == true) {
        headerStyleAnimation = new TimelineMax()
          .to($header, 1, {y: 0, ease: Power2.easeIn})
          .to($header.find('.header__background'), 1, {opacity: 0, ease: Power2.easeIn}, '-=1')
          .to($header.find('.header__shadow'), 1, {opacity: 0, ease: Power2.easeIn}, '-=1')
          .to('.nav-btn__item', 1, {css:{backgroundColor: '#000'}, ease: Power2.easeIn}, '-=1')
          .to('.logo_small svg', 1, {css:{fill: '#000'}, ease: Power2.easeIn}, '-=1')
      } else {
        headerIsVisible = true;
        headerStyleAnimation = new TimelineMax()
          .set($header.find('.header__background'), {opacity: 0})
          .set($header.find('.header__shadow'), {opacity: 0})
          .set('.nav-btn__item', {css:{backgroundColor: '#000'}})
          .set('.logo_small svg', {css:{fill: '#000'}})
          .to($header, 1, {y: 0, ease: Power1.easeOut})
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
          .set($('.project__layer:first-child .project__layer-container'), {y: -(scrollY - scrollY/1.4), x:(scrollY - scrollY/1.05)})
          .set($('.project__layer:last-child .project__layer-container'), {y: -(scrollY - scrollY/1.25), x:-(scrollY - scrollY/1.05)})
      }
    } else if(pageId=='project3') {
      if(scrollY < displayHeight) {
        var parralaxAnimation = new TimelineMax()
          .set($('.project__layer:first-child .project__layer-container'), {y: -(scrollY - scrollY/1.15), x:-(scrollY - scrollY/1.015)})
          .set($('.project__layer:last-child .project__layer-container'), {y: -(scrollY - scrollY/1.1), x:(scrollY - scrollY/1.015)})
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


    if(exitAnimationProgress!==true) {
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
      else {
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
}
function mainPageEvents() {
  var mouseHoverAnimation,
      mouseHoverAnimationEnd,
      flag = false;

  mouseAnimation = new TimelineMax({repeat: -1})
    .fromTo('.main-page__scroll svg:last-child', 0.5, {opacity: 0}, {opacity: 1})
    .fromTo('.main-page__scroll svg:last-child', 1.25, {y:0}, {y:10, ease: Power1.easeOut}, '-=0.5')
    .fromTo('.main-page__scroll svg:last-child', 0.5, {opacity: 1}, {opacity: 0, ease: Power1.easeOut}, '-=0.5');
  
  $('.main-page__scroll').on('click mouseenter touchstart mouseleave touchend', function(e) {
    if(e.type == 'mouseenter' || e.type == 'touchstart') {
      mouseAnimation.stop();
      if(flag==true) {
        mouseHoverAnimationEnd.eventCallback("onComplete", null);
      }
      mouseTouched = true;
      mouseHoverAnimation = new TimelineMax()
        .to('.main-page__scroll svg:last-child', 0.5, {opacity: 1, y:10, ease: Power3.easeOut});
    } else if(e.type == 'mouseleave' || e.type == 'touchend') {
      mouseTouched = false;
      if(exitAnimationProgress == false) {
        mouseHoverAnimation.stop();
        mouseHoverAnimationEnd = new TimelineMax({onComplete: function() {
          mouseAnimation.restart();
        }})
          .to('.main-page__scroll svg:last-child', 0.5, {opacity: 0});
        flag=true;
      }
    }
  })
  
  //parralax
  if($('html').hasClass('desktop')) {
    //init parralax
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
      limitY: '80',
      limitX: '80'
    });
  }

  //запуск видео после загрузки анимаций
  setTimeout(function() {
    var $videoContainer = $('.video-wrapper'),
      videoPath = $videoContainer.data('path');
    //start video
    $('.video-wrapper').append('<video class="video-wrapper__content" loop autoplay muted playsinline><source class="video-source" src='+ videoPath +' type="video/mp4">');
    $('.video-wrapper__content').bgVideo ({
      fullScreen : false, 
      fadeIn : 500,
      pauseAfter: 0,
      fadeOnPause : false,
      fadeOnEnd : true,
      showPausePlay: false
    });
  }, 1500)
}
function splitText() {
  let $els = document.querySelectorAll(".js-split");
  [].forEach.call($els, function(el) {
    if(!el.classList.contains('js-splitted')) {
      el.classList.add('js-splitted');
      el.outerHTML = Splitter(el.outerHTML, '<span class="letter">$</span>');
    }
  })
}
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
function nav() {
  var $navButton = $('.nav-btn');

  navBtnFadeAnimation = new TimelineMax({paused: true})
    .set('.nav-btn', {autoAlpha: 1})
    .staggerFromTo('.nav-btn__item', 1.25, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut, stagger: {amount: 0.25}})
    .staggerFromTo('.nav-btn__item', 1.25, {x: 50}, {x: 0, ease: Power3.easeOut, stagger: {amount: 0.25}}, 0, '-=1.5')
    .to('.nav-btn__item:eq(1)', 1, {scaleX: 0.7, xPercent: 15}, '-=1.5');
  
  navBtnHoverAnimation = new TimelineMax({paused: true})
    .to('.nav-btn__item:eq(1)', 0.3, {scaleX:1, xPercent:0, ease: Power1.easeOut})
    .to('.nav-btn__item:eq(0), .nav-btn__item:eq(2)', 0.3, {scaleX:0.7, xPercent:15, ease: Power1.easeOut}, '-=0.3');
  navBtnAnimation = new TimelineMax({paused: true})
    .to('.nav-btn__item:eq(1)', 0.3, {scaleX:1, xPercent:0, ease: Power1.easeOut});
  
  $navButton.on('click mouseenter touchstart touchend mouseleave', function(e) {
    e.preventDefault();
    if(e.type == 'mouseenter' || e.type == 'touchstart') {
      navBtnHoverAnimation.play();
    } else if(e.type == 'mouseleave' || e.type == 'touchend') {
      navBtnHoverAnimation.reverse();
    }
  })
}
function logoAnimations() {
  var $logo = $('.logo_small');
  
  logoShowAnimation = new TimelineMax({paused: true})
    .set($logo, {autoAlpha: 1})
    .staggerFromTo($logo.find('.logo__item'), 1, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut, stagger: {amount: 0.5}})
    .staggerFromTo($logo.find('.logo__item'), 1, {yPercent: 50, xPercent:-15}, {yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {amount: 0.5}}, 0, '-=1.5');
  logoHideAnimation = new TimelineMax({paused: true})
    .staggerTo($logo.find('.logo__item'), 0.6, {opacity:0,yPercent:50, xPercent:-15, ease: Power3.easeIn, stagger: {from: "end", amount: 0.4}})
    .set($logo, {autoAlpha: 0})
}
function logoToggle(state) {
  if(state=='show' && logoVisible==false) {
    logoShowAnimation.play(animationTime);
    logoVisible = true;
  } else if(state=='hide' && logoVisible==true) {
    logoHideAnimation.play(animationTime);
    logoVisible = false;
  }
}
//labels
function curentLabel() {
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
}
function labelToggle(dataLabel, state) {
  var $el = $('#' + dataLabel);
  if(state == true) {
    labelFadeAnimation = new TimelineMax()
      .set($el, {autoAlpha: 1}).set($el, {css: {'z-index': '100'}})
      .fromTo($el.find('.icon'), 1.5, {opacity: 0}, {opacity: 1, ease: Power2.easeInOut})
      .fromTo($el.find('.icon'), 1.5, {rotation: 0}, {rotation: 180, ease: Power3.easeOut}, '-=1.5')
      .fromTo($el.find('.label-item__title'), 0.5, {opacity: 0, yPercent: 50}, {opacity: 1, yPercent: 0, ease: Power3.easeOut},'-=1')
      .staggerFromTo($el.find('.letter'), 0.5, {opacity: 0, yPercent: 35, xPercent:-10}, {opacity:1, yPercent:0, xPercent:0, ease: Power3.easeOut, stagger: {amount: 0.5}}, 0, '-=1')
    dataOldLabel = dataNewLabel;
    } else {
    if(enterAnimationProgress == true) {
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
function hoverAnimations() {
  var $hoverArea = $('.hover-area'), 
      anim,
      mouseEvents,
      touchEvents,
      flag = true;

  $hoverArea.on('mousemove mouseleave touchstart click touchend', function(event) {
    var $target = $(this),
        $child = $target.find('.hover-child'),
        posT = $target.offset().top,
        posL = $target.offset().left,
        h = $target.height(),
        w = $target.width(),
        halfHeight = h/2,
        halfWidth = w/2,
        x, y;
    
    //если событие мыши
    if(exitAnimationProgress!==true) {
      if(event.type == 'mousemove' && flag == true && touchEvents!==true) {
        //не чаще чем раз в 100мс
        flag = false;
        setTimeout(function() {
          flag = true;
        }, 100)
  
        x = Math.ceil(((event.clientX - posL)-halfWidth)/(1+((w*w)/7000))),
        y = Math.ceil(-((event.clientY - posT)-halfHeight)/(1+((h*h)/7000)));
  
        anim = new TimelineMax()
        .to($child, 0.5, {rotationX: y, rotationY: x, ease: Power3.easeOut})
      } else if(event.type == 'touchstart') {
        touchEvents = true;
  
        x = Math.ceil((((event.touches[0].clientX - posL)-halfWidth)/(1+((w*w)/7000)))),
        y = Math.ceil(-((((event.touches[0].clientY - posT)-halfHeight)/(1+((h*h)/7000)))));
        

        anim = new TimelineMax()
        .to($child, 0.5, {rotationX: y, rotationY: x, ease: Power3.easeOut})
      } else if(event.type == 'touchend' || event.type == 'mouseleave') {
        anim = new TimelineMax()
        .to($child, 0.5, {rotationX: 0, rotationY: 0, ease: Power3.easeOut, onComplete: function() {
          touchEvents = false;
        }})
      } else if(event.type == 'click') {
        anim = new TimelineMax()
        .to($child, 1, {rotationX: 0, rotationY: 0, ease: Power3.easeIn, onComplete: function() {
          touchEvents = false;
        }})
      }
    }
  })
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

