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
      animateSpeed: 500,
      delay: 1000,
      imgPlacement: 'center',
      displayWidth: '100%',
      direction: '',
      articleWidth: '100%',
      articleAlignment: 'center',
      functionality: ''
  }, options);

  return this.each( function() {
    var $display = $(this);
    $display.css({
      position: 'relative',
    });
    var $container = $(this).children('.image-container');
    var $articles = $(this).children('.article-container');
    var $image = $container.find('img');
    var images = $image.length;
    var $article = $articles.find('article');

    // Add divs for triggering animations
    $container.append('<div class="left-ImgWheel-scroll"></div><div class="right-ImgWheel-scroll"></div>');
    var $left = $container.children('.left-ImgWheel-scroll');
    var $right = $container.children('.right-ImgWheel-scroll');
    
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
      $left_arrow = $('.left-arrow');
      $right_arrow = $('.right-arrow');
      $left_arrow.add($right_arrow).hide().css({
        position: 'absolute',
        color: 'white',
        'text-shadow': '1px 1px 5px black, 1px -1px 5px black, -1px -1px 5px black, -1px 1px 5px black',
        cursor: 'pointer'
      });
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
      position: 'relative',
    });

    // Set h and remove 'px'. h is effectively set relative to w.
    var h = parseInt(($container.css('height')), 10);

    $left.add($right).css({
      width: ((1/4)*w)+'px',
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
    var subDivs = articleHeights.concat(nonImgWheel_divHeights);
    var max_subDiv_h = Math.max.apply(Math,subDivs);
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
      var zero_top = '0px'; // zero_top refers to top of an image when its height is 0px (not displayed)
      var med_top = '0px'; // med_top refers to top of image when it has intermediate height (on either side of display)
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
        var zero_top = h+'px';
        var med_top = (h*(2/5))+'px';
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
        var zero_top = (h/2)+'px';
        var med_top = (h*(1/5))+'px';
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
    var a = 0;
    var b = 1;
    var c = 2;
    var y = images - 2;
    var z = images - 1;

    //var animateInterval = settings.animateSpeed;
    var delay = settings.delay;

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
    $image.load( function(){
      img_fullwidth = [];
      aspectratio = [];
      $image.each(function(){
        var nativeCopy = new Image();
        nativeCopy.src = $(this).attr("src");
        var imageWidth = nativeCopy.width;
        var imageHeight = nativeCopy.height;
        aspectratio.push(imageWidth/imageHeight);
      });
      for(var i = 0; i < $image.length; i++) {
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
      $(window).load(function(){
        $image.show();
      });
    });

    

    // Definition for counterclockwise scrolling (to the right)
    var counterclockwise = function(){
      if (img_href[a] !== '') {
        $image.eq(a).unwrap();
      }
      if (img_href[b] !== '') {
        $image.eq(b).wrap('<a href="' + img_href[b] + '"></a>');
      }
      $article.eq(a).hide();
      $article.eq(b).show();
      $image.eq(a).stop().animate({
        width: (img_fullwidth[a]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(17/20))-((img_fullwidth[a]*(3/5))/2))+'px', 
        top: med_top, 
        'z-index': 0
      }, animateInterval)
      .removeClass('onlyCentral')
      .addClass('everythingBut');
      $image.eq(b).stop().animate({
        width: img_fullwidth[b]+'px', 
        height: h+'px', 
        left: ((w/2)-(img_fullwidth[b]/2))+'px', 
        top: '0px', 
        'z-index': 15
      }, animateInterval)
      .removeClass('everythingBut')
      .addClass('onlyCentral');
      $image.eq(c).stop().animate({
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
      $image.eq(y).stop().animate({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      }, animateInterval);
      $image.eq(z).stop().animate({
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
    }; // end of definition for counterclockwise scrolling

    // Definition for clockwise scrolling (to the left)
    var clockwise = function(){
        //set-up with mouseposition relative to the $(this)?
        //alternatively, set-up with the position div divided into 5 parts... insert 5 divs into parent div,
        //set position and width based on w or w of the 'position div'...
        //use mousemove()?... find relative position within $(this)

      $(this).mousemove(function(e){
        var this_position = $(this).offset();
        var rel_x = e.pageX - this_position.left;
        var range = $(this).width();

        var animateInterval = (1/(rel_x/range))*(settings.animateSpeed);


      });
        

      if (img_href[a] !== '') {
        $image.eq(a).unwrap();
      }
      if (img_href[z] !== '') {
        $image.eq(z).wrap('<a href="' + img_href[z] + '"></a>');
      }
      $article.eq(a).hide();
      $article.eq(z).show();
      $image.eq(a).stop().animate({
        width: (img_fullwidth[a]*(3/5))+'px', 
        height: (h*(3/5))+'px', 
        left: ((w*(3/20))-((img_fullwidth[a]*(3/5))/2))+'px', 
        top: med_top, 
        'z-index': 0
      }, animateInterval)
      .removeClass('onlyCentral')
      .addClass('everythingBut');
      $image.eq(b).stop().animate({
        width: '0px', 
        height: '0px', 
        left: '0px', 
        top: zero_top
      }, animateInterval);
      $image.eq(c).stop().animate({
        width: '0px', 
        height: '0px', 
        left: w+'px', 
        top: zero_top
      }, animateInterval);
      $image.eq(y).stop().animate({
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
      $image.eq(z).stop().animate({
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
    }; // end of definition for clockwise scrolling

    // Display arrows on hover and deploy scrolling functions on click if click functionality enabled.
    if (settings.functionality === 'click') {
      $container.hover(
        function() {
          $left_arrow.add($right_arrow).fadeIn(100);
        }, function() {
          $left_arrow.add($right_arrow).fadeOut(100);
        }
      );
      $left_arrow.click(function() {
        if (settings.direction === 'reverse') {
          clockwise();
        } else {
          counterclockwise();
        }
      });
      $right_arrow.click(function() {
        if (settings.direction === 'reverse') {
          counterclockwise();
        } else {
          clockwise();
        }
      });
    } 

    // default settings for triggering scrolling motion
    if (settings.functionality === '') {
      $left.bind('touchstart mouseover', function(e) {
        counterclockwise(); // bypass delay on initial mouseover
        loop_on_left = setInterval(counterclockwise, delay);
        e.preventDefault();
      });
      $left.bind('touchend mouseout', function(e) {
        clearInterval(loop_on_left);
        e.preventDefault();
      });

      if (settings.functionality === '') {
        $right.bind('touchstart mouseover', function(e) {
          clockwise(); // bypass delay on initial mouseover
          loop_on_right = setInterval(clockwise, delay);
          e.preventDefault();
        });
        $right.bind('touchend mouseout', function(e) {
          clearInterval(loop_on_right);
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
        width: ((1/4)*w)+'px',
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
      } // end of set_sizes

      var resizeTimer;
      $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(set_sizes, 25); // wait 25 milliseconds after resizing window before resizing elements
      });
    });
  };
})(jQuery);