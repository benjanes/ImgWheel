$(document).ready(function () {
    var $left_bar = $('#left-side'),
        $example_content = $('.example-content'),
        $expanded = $('.example-info-group-expanded'),
        $group_heading = $('.example-info-group-heading'),
        $example_title = $('.example-title'),
        $example_info = $('.example-info'),
        $demo = $('.demonstration'),
        $med_arrow = $('.arrow-med'),
        $top_arrow = $('.arrow-lrg-top'),
        $demo_top_cat = $('#demos'),
        $overview_top_cat = $('#overview'),
        $settings_top_cat = $('#settings'),
        $demos_heading = $('#demos-heading'),
        $settings_heading = $('#settings-heading'),
        $overview_heading = $('#overview-heading'),
        $main_cat = $('.main-cat');
    $left_bar.css({
        width: '380px'
    });
    $demo_top_cat.add($settings_top_cat).css({
        left: '-9999px'
    });
    $demos_heading.click(function () {
        $overview_top_cat.add($settings_top_cat).css({
            left: '-9999px'
        });
        $demo_top_cat.css('left', '0px');
    });
    $settings_heading.click(function () {
        $overview_top_cat.add($demo_top_cat).css({
            left: '-9999px'
        });
        $settings_top_cat.css('left', '0px');
    });
    $overview_heading.click(function () {
        $settings_top_cat.add($demo_top_cat).css({
            left: '-9999px'
        });
        $overview_top_cat.css('left', '0px');
    });
    $example_info.css({
        position: 'absolute',
        width: '373px',
        left: '0px',
        float: 'none'
    });
    ex_heights = [];
    $example_info.each(function () {
        var height = $(this).height();
        ex_heights.push(height);
    });
    $demo.css({
        position: 'absolute',
        left: '385px',
        right: '0px',
        float: 'none',
        margin: '0 20px',
    });
    $example_title.css({
        position: 'absolute',
        left: '-9999px'
    });
    $example_content.css({
        position: 'absolute',
        left: '-9999px',
        width: '100%'
    });
    for (var i = 0; i < ex_heights.length; i++) {
        $example_content.eq(i).height(ex_heights[i]+'px');
    }
    $example_title.eq(0).css({
        position: 'relative',
        left: '0px'
    });
    $example_content.eq(0).css({position: 'relative', left: '0px', height: ex_heights[0]+'px'});
    var start_coords = $example_content.eq(0).offset();
    var start_top = -(start_coords.top)+59;
    $demo.eq(0).css({
        top: start_top+'px'
    });
    $top_arrow.eq(0).css({
        transform: 'rotate(-90deg)',
        '-ms-transform': 'rotate(-90deg)',
        '-webkit-transform': 'rotate(-90deg)',
        'border-right': '9px solid red'
    });
    $('.arrow-lrg').eq(0).css({
        transform: 'rotate(-90deg)',
        '-ms-transform': 'rotate(-90deg)',
        '-webkit-transform': 'rotate(-90deg)',
        'border-right': '6px solid red'
    });

    $('.cat-title').toggle(
    function () {
        var $category = $(this).parent('.category'),
            $example = $category.children('.example'),
            $cat_subs = $example.children('.example-title'),
            $this_arrow = $(this).children('.arrow-lrg-top');
        if ($cat_subs.css('position', 'absolute')) { // if subheadings are hidden
            $example_title.not($cat_subs).css({
                position: 'absolute',
                left: '-9999px'
            });
            $cat_subs.css({
                position: 'relative',
                left: '0px'
            });
            $example_content.css({
                left: '-9999px',
                height: '0px'
            });
            $top_arrow.not($this_arrow).css({
                transform: 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'border-right': '9px solid black'
            });
            $this_arrow.css({
                transform: 'rotate(-90deg)',
                '-ms-transform': 'rotate(-90deg)',
                '-webkit-transform': 'rotate(-90deg)',
                'border-right': '9px solid red'
            });
        } else {
            if ($cat_subs.css('position', 'relative')) { // if subheadings are shown
                $example_title.css({
                    position: 'absolute',
                    left: '-9999px'
                });
                $example_content.css({
                    position: 'absolute',
                    left: '-9999px',
                    height: '0px'
                });
                $this_arrow.css({
                    transform: 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    '-webkit-transform': 'rotate(0deg)',
                    'border-right': '9px solid black'
                });
            }
        }
    }, function () {
    var $category = $(this).parent('.category'),
        $example = $category.children('.example'),
        $cat_subs = $example.children('.example-title'),
        $this_arrow = $(this).children('.arrow-lrg-top');
        if ($cat_subs.css('position', 'relative')) { // if subheadings are shown
            $example_title.css({
                position: 'absolute',
                left: '-9999px'
            });
            $example_content.css({
                position: 'absolute',
                left: '-9999px',
                height: '0px'
            });
            $this_arrow.css({
                transform: 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'border-right': '9px solid black'
            });
        } else {
            if ($cat_subs.css('position', 'absolute')) {
                $example_title.not($cat_subs).css({
                    position: 'absolute',
                    left: '-9999px'
                });
                $cat_subs.css({
                    position: 'relative',
                    left: '0px'
                });
                $example_content.css({
                    position: 'absolute',
                    left: '-9999px',
                    height: '0px'
                });
                $top_arrow.not($this_arrow).css({
                    transform: 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    '-webkit-transform': 'rotate(0deg)',
                    'border-right': '9px solid black'
                });
                $this_arrow.css({
                    transform: 'rotate(-90deg)',
                    '-ms-transform': 'rotate(-90deg)',
                    '-webkit-transform': 'rotate(-90deg)',
                    'border-right': '9px solid red'
                });
            }
        }
    });
    $example_title.toggle(
    function () { 
        var $ex_content = $(this).siblings('.example-content');
        var $this_demo = $ex_content.children('.demonstration');
        var $arrow = $(this).children('.arrow-lrg');
        if ($ex_content.css('position', 'absolute')) { // if related content is hidden
            $example_content.not($ex_content).css({position: 'absolute', left: '-9999px', height: '0px'});
            ex_content_num = $example_content.index($ex_content);
            $ex_content.css({position: 'relative', left: '0px', height: ex_heights[ex_content_num]+'px'});
            var ex_content_position = $ex_content.offset();
            var this_demo_top = -(ex_content_position.top)+59;
            $this_demo.css('top', this_demo_top+'px');
            $('.arrow-lrg').not($arrow).css({
                transform: 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'border-right': '6px solid black'
            });
            $arrow.css({
                transform: 'rotate(-90deg)',
                '-ms-transform': 'rotate(-90deg)',
                '-webkit-transform': 'rotate(-90deg)',
                'border-right': '6px solid red'
            });
            $expanded.hide();
            var $local_expandeds = $ex_content.find('.example-info-group-expanded'),
                $first_local_expanded = $local_expandeds.eq(0),
                $first_arrow_med = $first_local_expanded.prev('.example-info-group-heading').children('.arrow-med');
            $first_local_expanded.show();
            $first_arrow_med.css({
                transform: 'rotate(-90deg)',
                '-ms-transform': 'rotate(-90deg)',
                '-webkit-transform': 'rotate(-90deg)',
                'border-right': '6px solid red'
            });
        } else {
            if ($ex_content.css('position', 'relative')) { // if related content is displayed
                $ex_content.css({position: 'absolute', left: '-9999px', height: '0px'});
                $arrow.css({
                    transform: 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    '-webkit-transform': 'rotate(0deg)',
                    'border-right': '6px solid black'
                });
            }
        }
    }, function () {
        var $ex_content = $(this).siblings('.example-content'),
            $arrow = $(this).children('.arrow-lrg');
        if ($ex_content.css('position', 'relative')) {
            $ex_content.css({position: 'absolute', left: '-9999px', height: '0px'});
            $arrow.css({
                transform: 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'border-right': '6px solid black'
            });
        } else {
            if ($ex_content.css('position', 'absolute')) {
                $example_content.not($ex_content).css({position: 'absolute', left: '-9999px', height: '0px'});
                ex_content_num = $example_content.index($ex_content);
                $ex_content.css({position: 'relative', left: '0px', height: ex_heights[ex_content_num]+'px'});
                var ex_content_position = $ex_content.offset();
                var this_demo_top = -($ex_content_position.top)+59;
                

                $this_demo.css('top', this_demo_top+'px');

                $arrow.css({
                    transform: 'rotate(-90deg)',
                    '-ms-transform': 'rotate(-90deg)',
                    '-webkit-transform': 'rotate(-90deg)',
                    'border-right': '6px solid red'
                });
                $expanded.hide();
                var $local_expandeds = $ex_content.find('.example-info-group-expanded');
                $local_expandeds.eq(0).show();
            }
        }
    });
    $group_heading.click(
    function () {
        if ($(this).siblings('.example-info-group-expanded').is(':visible')) {
            $expanded.hide();
            $(this).children('.arrow-med').css({
                transform: 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'border-right': '6px solid white'
            });
        } else {
            if ($(this).siblings('.example-info-group-expanded').is(':hidden')) {
                $expanded.hide();
                $(this).siblings('.example-info-group-expanded').show();
                $med_arrow.css({
                    transform: 'rotate(0deg)',
                    '-ms-transform': 'rotate(0deg)',
                    '-webkit-transform': 'rotate(0deg)',
                    'border-right': '6px solid white'
                });
                $(this).children('.arrow-med').css({
                    transform: 'rotate(-90deg)',
                    '-ms-transform': 'rotate(-90deg)',
                    '-webkit-transform': 'rotate(-90deg)',
                    'border-right': '6px solid red'
                });
            } 
        }
    });
});