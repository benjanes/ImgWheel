/*
 * ImgWheel
 * http://www.benjanes.com/ImgWheel
 *
 * Copyright (c) 2014 Ben Janes
 * Licensed under the MIT license.
 */

(function($) {

$.fn.ImgWheel = function(options) {

  // Default settings
  var settings = $.extend({
      animateSpeedMax: 500,
      animateSpeedMin: 2000,
      delayMax: 500,
      delayMin: 2000,
      imgPlacement: 'center',
      displayWidth: '100%',
      direction: '',
      articleWidth: '100%',
      articleAlignment: 'center',
      functionality: ''
  }, options);

  return this.each( function() {
    var $display = $(this);
    $display.css('position', 'relative');
    var $container = $(this).children('.image-container'),
        $articles = $(this).children('.article-container'),
        $image = $container.find('img'),
        images = $image.length,
        $article = $articles.find('article');

    // Add divs for triggering animations
    $container.append('<div class="left-ImgWheel-scroll"></div><div class="right-ImgWheel-scroll"></div>');
    var $left = $container.children('.left-ImgWheel-scroll'),
        $right = $container.children('.right-ImgWheel-scroll');
    
    // Select any extra divs within the targeted div for display below ImgWheel, if
    // such divs are present. These are placed vertically and resized below.
    var $nonImgWheel_divs = $display.children('div:not(.image-container, .article-container)');

    // Ensure correct arrow display, regardless of ImgWheel direction
    if (settings.functionality === 'click') {
      if (settings.direction === '') {
        $left.append('<div class="left-arrow">&#9664;</div>');
        $right.append('<div class="right-arrow">&#9654;</div>');
      }
      if (settings.direction === 'reverse') {
        $left.append('<div class="right-arrow">&#9654;</div>');
        $right.append('<div class="left-arrow">&#9664;</div>');
      }
    }

    if (settings.functionality === 'click') {
      var $left_arrow = $container.find('.left-arrow'),
          $right_arrow = $container.find('.right-arrow');
      $left_arrow.add($right_arrow).hide().css({
        position: 'absolute',
        color: 'white',
        'text-shadow': '1px 1px 5px black, 1px -1px 5px black, -1px -1px 5px black, -1px 1px 5px black',
        cursor: 'pointer'
      });
      $container.hover(
        function() {
          $left_arrow.add($right_arrow).fadeIn(100);
        }, function() {
          $left_arrow.add($right_arrow).fadeOut(100);
        }
      );
    }

    // Swap left and right trigger div placement depending on ImgWheel direction. 
    if (settings.direction === 'reverse') {
      $left.css({
        position: 'absolute',
        top: '0',
        right: '0',
        'z-index': '20'
      });
      $right.css({
        position: 'absolute',
        top: '0',
        left: '0',
        'z-index': '20'
      });
    } else {
      $left.css({
        position: 'absolute',
        top: '0',
        left: '0',
        'z-index': '20'
      });
      $right.css({
        position: 'absolute',
        top: '0',
        right: '0',
        'z-index': '20'
      });
    }   
    $display.css('width', settings.displayWidth);
    var w = $display.width();
    $container.css({
      width: w+'px',
      height: (w/4)+'px',
      position: 'relative'
    });

    // Set h and remove 'px'. h is effectively set relative to w.
    var h = parseInt(($container.css('height')), 10);

    $left.add($right).css({
      width: ((1/3)*w)+'px',
      height: h+'px'
    });
    $articles.css({
      position: 'absolute',
      top: h+'px',
      width: settings.articleWidth
    });
    var article_w = parseInt(($articles.css('width')), 10);

    // Collect height of each article.
    var articleHeights = [];
    $article.each(function() {
      var article_h = $(this).height();
      articleHeights.push(article_h);
    });

    // If other divs exist within the targeted div, collect their heights.
    var nonImgWheel_divHeights = [];
    $nonImgWheel_divs.each(function(){
      $(this).css({
        top: h+'px'
      });
      var div_h = $(this).height();
      nonImgWheel_divHeights.push(div_h);
    });

    // Total height of the display is set equal to height of the image container plus the height
    // of either the tallest article or the tallest extra div (nonImgWheel_div), whichever is tallest.
    var subDivs = articleHeights.concat(nonImgWheel_divHeights),
        max_subDiv_h = Math.max.apply(Math,subDivs);
    $display.css({
      height: (h+max_subDiv_h)+'px'
    });

    if (settings.articleAlignment === 'left') {
      var article_align = '0px';
    } else {
      if (settings.articleAlignment === 'right') {
        article_align = (w-article_w)+'px';
      } else {
        article_align = ((w/2)-(article_w/2))+'px';
      }
    }
    $articles.css('left', article_align);
    $article.hide();
    if (settings.imgPlacement === 'top') {
      var zero_top = '0px', // zero_top refers to top of an image when its height is 0px (not displayed)
          med_top = '0px'; // med_top refers to top of image when it has intermediate height (on either side of display)
      if (settings.functionality === 'click') {
        $left_arrow.css({
          bottom: '5px',
          left: '5px'
        });
        $right_arrow.css({
          bottom: '5px',
          right: '5px'
        });
      }
    } else {
      if (settings.imgPlacement === 'bottom') {
        var zero_top = h+'px',
            med_top = (h*(2/5))+'px';
        if (settings.functionality === 'click') {
          $left_arrow.css({
          top: '5px',
          left: '5px'
        });
        $right_arrow.css({
          top: '5px',
          right: '5px'
        });
        }
      } else {
        var zero_top = (h/2)+'px',
            med_top = (h*(1/5))+'px';
        if (settings.functionality === 'click') {
          $left_arrow.css({
          bottom: '5px',
          left: '5px'
        });
        $right_arrow.css({
          bottom: '5px',
          right: '5px'
        });
        }
      }
    }

    // Hide images until page is fully loaded.
    $image.css('position', 'absolute').hide();

    // Set counter variables for ImgWheel scrolling.
    var a = 0,
        b = 1,
        c = 2,
        y = images - 2,
        z = images - 1;

    // Collect href attribute for each image in the ImgWheel if it is wrapped in anchor tags. If
    // an image is wrapped in anchor tags, remove them. The anchor tags will only be included when
    // an image is in the central position in the ImgWheel, and only if it had anchor tags to begin with.
    var img_href = [];
    $image.each(function(){
      if ($(this).parent().is('a')) {
        href = $(this).parent().attr('href');
        $(this).unwrap();
      } else {
        href = '';
      }
      img_href.push(href);
      $(this).attr('src', $(this).attr('src')); // Workaround for fixing 'load' issues in IE-- resets src attr
    });
    if (img_href[a] !== '') {
      $image.eq(a).wrap('<a href="' + img_href[a] + '"></a>');
    }

    // Establish array for storage of img widths relative to h.
    var img_fullwidth = [];

    // Array to store aspect ratio for each original image, set once on image loading
    var aspectratio = [];

    // Calculate original aspect ratio of each image and calculate width relative to the given value of h.
    // Establish initial placement of images within the display container.
    $image.load(function () {
      img_fullwidth = [];
      aspectratio = [];
      $image.each(function(){
        var nativeCopy = new Image();
        nativeCopy.src = $(this).attr("src");
        var imageWidth = nativeCopy.width,
            imageHeight = nativeCopy.height;
        aspectratio.push(imageWidth/imageHeight);
      });
      for(var i = 0; i < images; i++) {
        img_fullwidth.push(aspectratio[i]*h);
      }
      $image.css({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      });
      $image.eq(z).css({
        width: (img_fullwidth[z]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(17/20))-((img_fullwidth[z]*(3/5))/2))+'px', 
        top: med_top
      });
      $image.eq(a).addClass('onlyCentral').css({
        width: 'auto', 
        height: h+'px', 
        left: ((w/2)-(img_fullwidth[a]/2))+'px', 
        top: '0px', 
        'z-index': 15
      });
      $image.eq(b).css({
        width: (img_fullwidth[b]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(3/20))-((img_fullwidth[b]*(3/5))/2))+'px', 
        top: med_top
      });
      $image.not($image.eq(a)).addClass('everythingBut');
      $article.eq(a).show();
      $image.show();
    });
	
    // Definition for counterclockwise scrolling (to the right)
    function counterclockwise() {
      if (img_href[a] !== '') {
        $image.eq(a).unwrap();
      }
      if (img_href[b] !== '') {
        $image.eq(b).wrap('<a href="' + img_href[b] + '"></a>');
      }
      $article.eq(a).hide();
      $article.eq(b).show();
      $image.eq(a).animate({
        width: (img_fullwidth[a]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(17/20))-((img_fullwidth[a]*(3/5))/2))+'px', 
        top: med_top, 
        'z-index': 0
      }, animateInterval)
      .removeClass('onlyCentral')
      .addClass('everythingBut');
      $image.eq(b).animate({
        width: img_fullwidth[b]+'px', 
        height: h+'px', 
        left: ((w/2)-(img_fullwidth[b]/2))+'px', 
        top: '0px', 
        'z-index': 15
      }, animateInterval)
      .removeClass('everythingBut')
      .addClass('onlyCentral');
      $image.eq(c).animate({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      }, 0)
      .animate({
        width: (img_fullwidth[c]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(3/20))-((img_fullwidth[c]*(3/5))/2))+'px', 
        top: med_top
      }, animateInterval);
      $image.eq(y).animate({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      }, animateInterval);
      $image.eq(z).animate({
        width: '0px', 
        height: '0px', 
        left: w+'px', 
        top: zero_top
      }, animateInterval);
      if (a === images - 1) {
        a = 0;
      } else {
        a++;
      }
      if (b === images - 1) {
        b = 0;
      } else {
        b++;
      }
      if (c === images - 1) {
        c = 0;
      } else {
        c++;
      }
      if (y === images - 1) {
        y = 0;
      } else {
        y++;
      }
      if (z === images - 1) {
        z = 0;
      } else {
        z++;
      } 
    } // end of definition for counterclockwise scrolling

    // Definition for clockwise scrolling (to the left)
    function clockwise() {        
      if (img_href[a] !== '') {
        $image.eq(a).unwrap();
      }
      if (img_href[z] !== '') {
        $image.eq(z).wrap('<a href="' + img_href[z] + '"></a>');
      }
      $article.eq(a).hide();
      $article.eq(z).show();
      $image.eq(a).animate({
        width: (img_fullwidth[a]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(3/20))-((img_fullwidth[a]*(3/5))/2))+'px', 
        top: med_top, 
        'z-index': 0
      }, animateInterval)
      .removeClass('onlyCentral')
      .addClass('everythingBut');
      $image.eq(b).animate({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      }, animateInterval);
      $image.eq(c).animate({
        width: '0px', 
        height: '0px', 
        left: w+'px', 
        top: zero_top
      }, animateInterval);
      $image.eq(y).animate({
        width: '0px', 
        height: '0px', 
        left: w+'px', 
        top: zero_top
      }, 0)
      .animate({
        width: (img_fullwidth[y]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(17/20))-((img_fullwidth[y]*(3/5))/2))+'px', 
        top: med_top
      }, animateInterval);
      $image.eq(z).animate({
        width: img_fullwidth[z]+'px', 
        height: h+'px', 
        left: ((w/2)-(img_fullwidth[z]/2))+'px', 
        top: '0px', 
        'z-index': 15
      }, animateInterval)
      .removeClass('everythingBut')
      .addClass('onlyCentral');
      if (a === 0) {
        a = images -1;
      } else {
        a--;
      }
      if (b === 0) {
        b = images -1;
      } else {
        b--;
      }
      if (c === 0) {
        c = images -1;
      } else {
        c--;
      }
      if (y === 0) {
        y = images -1;
      } else {
        y--;
      }
      if (z === 0) {
        z = images -1;
      } else {
        z--;
      } 
    } // end of definition for clockwise scrolling

    // Timers set with a small delay to allow for prevention of queue buildup when user mouses over the
    // triggering div repeatedly
    function counterclockwise_init() {
      counterclockwise_timeout = setTimeout(function(){
        counterclockwise();
      }, 300);
    }
    function clockwise_init() {
      clockwise_timeout = setTimeout(function(){
        clockwise();
      }, 300);
    }

    // Define functions allowing for variable animation speed during mouseover based on mouse position within
    // the triggering div
    function left_timer() {
      if (settings.direction === 'reverse') {
        animateInterval = ((1-(rel_x/range))*(settings.animateSpeedMin - settings.animateSpeedMax)) + settings.animateSpeedMax;
        delay = ((1-(rel_x/range))*(settings.delayMin - settings.delayMax)) + settings.delayMax;
      } else {
        if (settings.direction === '') {
          animateInterval = ((rel_x/range)*(settings.animateSpeedMin - settings.animateSpeedMax)) + settings.animateSpeedMax;
          delay = ((rel_x/range)*(settings.delayMin - settings.delayMax)) + settings.delayMax;
        } 
      }
      counterclockwise_init();
      left_timeout = setTimeout(function(){
        left_timer();
      }, delay);
    }
    function right_timer() {
      if (settings.direction === 'reverse') {
        animateInterval = ((rel_x/range)*(settings.animateSpeedMin - settings.animateSpeedMax)) + settings.animateSpeedMax;
        delay = ((rel_x/range)*(settings.delayMin - settings.delayMax)) + settings.delayMax;
      } else {
        if (settings.direction === '') {
          animateInterval = ((1-(rel_x/range))*(settings.animateSpeedMin - settings.animateSpeedMax)) + settings.animateSpeedMax;
          delay = ((1-(rel_x/range))*(settings.delayMin - settings.delayMax)) + settings.delayMax;
        }
      }
      clockwise_init();
      right_timeout = setTimeout(function(){
        right_timer();
      }, delay);
    }

    // Define handler functions with timeouts to permit function triggering only after the prior function
    // has been run (duration of prior function is equal to animateInterval)
    function left_click_handler(){
      animateInterval = settings.animateSpeedMax;
      if (settings.direction === 'reverse') {
        clockwise();
      } else {
        counterclockwise();
      }
      setTimeout(function(){
        $left_arrow.one('click', left_click_handler);
      }, animateInterval);
    }
    function right_click_handler(){
      animateInterval = settings.animateSpeedMax;
      if (settings.direction === 'reverse') {
        counterclockwise();
      } else {
        clockwise();
      }
      setTimeout(function(){
        $right_arrow.one('click', right_click_handler);
      }, animateInterval);
    }

    // Deploy scrolling functions on click if click functionality enabled.
    if (settings.functionality === 'click') {
      $left_arrow.one('click', left_click_handler);
      $right_arrow.one('click', right_click_handler);
    } else {
    // default settings for triggering scrolling motion
      if (settings.functionality === '') {
        $right.bind('touchstart mouseover', function(e){
          this_position = $(this).offset();
          rel_x = e.pageX - this_position.left;
          range = $(this).width();
          $(this).mousemove(function(e){
            this_position = $(this).offset();
            rel_x = e.pageX - this_position.left;
            range = $(this).width();
          });
          right_timer();
        });
        $right.bind('touchend mouseout', function(e) {
          clearTimeout(clockwise_timeout);
          clearTimeout(right_timeout);
          e.preventDefault();
        });
        $left.bind('touchstart mouseover', function(e){
          this_position = $(this).offset();
          rel_x = e.pageX - this_position.left;
          range = $(this).width();
          $(this).mousemove(function(e){
            this_position = $(this).offset();
            rel_x = e.pageX - this_position.left;
            range = $(this).width();
          });
          left_timer();
        });
        $left.bind('touchend mouseout', function(e) {
          clearTimeout(counterclockwise_timeout);
          clearTimeout(left_timeout);
          e.preventDefault();
        });
      }
    }

/************************************************************************
** everything below here is for responsiveness on window resize events **
************************************************************************/
    function set_sizes() {
      w = $display.width();
      $container.css({
        width: w+'px',
        height: (w/4)+'px'
      });
      h = parseInt(($container.css('height')), 10);
      $articles.css('top', h+'px');
      $left.add($right).css({
        width: ((1/3)*w)+'px',
        height: h+'px'
      });

      // Recalculate img_fullwidth for the new container height.
      img_fullwidth = [];
      for(var i = 0; i < $image.length; i++) {
        img_fullwidth.push(aspectratio[i]*h);
      }

      // Reestablish vertical image placement relative to the new h.
      if (settings.imgPlacement === 'top') {
        zero_top = '0px';
        med_top = '0px';
      } else {
        if (settings.imgPlacement === 'bottom') {
          zero_top = h+'px';
          med_top = (h*(2/5))+'px';
        } else {
          zero_top = (h/2)+'px';
          med_top = (h*(1/5))+'px';
        }
      }

      // Recalculate starting image properties for new h.
      $image.css({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      });
      $image.eq(z).css({
        width: (img_fullwidth[z]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(17/20))-((img_fullwidth[z]*(3/5))/2))+'px', 
        top: med_top
      });
      $image.eq(a).addClass('onlyCentral').css({
        width: 'auto', 
        height: h+'px', 
        left: ((w/2)-(img_fullwidth[a]/2))+'px', 
        top: '0px', 
        'z-index': 15
      });
      $image.eq(b).css({
        width: (img_fullwidth[b]*(3/5))+'px', 
        height: (h*(3/5))+'px',
        left: ((w*(3/20))-((img_fullwidth[b]*(3/5))/2))+'px', 
        top: med_top
      });
      $articles.css({
        position: 'absolute',
        top: h+'px',
        width: settings.articleWidth
      });
      article_w = parseInt(($articles.css('width')), 10);

      // Recalculate heights of articles and nonImgWheel_divs given the new display width,
      // then apply the maximum height to the total height of the display container.
      articleHeights = [];
      $article.each(function() {
        var article_h = $(this).innerHeight();
        articleHeights.push(article_h);
      });
      nonImgWheel_divHeights = [];
      $nonImgWheel_divs.each(function(){
        $(this).css({
          top: h+'px'
        });
        var div_h = $(this).height();
        nonImgWheel_divHeights.push(div_h);
      });
      subDivs = articleHeights.concat(nonImgWheel_divHeights);
      max_subDiv_h = Math.max.apply(Math,subDivs);
      $display.css({
        height: (h+max_subDiv_h)+'px'
      });
      if (settings.articleAlignment === 'left') {
        article_align = '0px';
      } else {
        if (settings.articleAlignment === 'right') {
          article_align = (w-article_w)+'px';
        } else {
          article_align = ((w/2)-(article_w/2))+'px';
        }
      }
      $articles.css('left', article_align);
      } // end of set_sizes() definition

      var resizeTimer;
      $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(set_sizes, 25); // wait 25 milliseconds after resizing window before resizing elements
      });
    });
  };
})(jQuery);