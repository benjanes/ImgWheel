$(document).ready(function () {
	$('#overview-example').ImgWheel({articleWidth: '50%', articleAlignment: 'right'});
	$('#example1').ImgWheel();
	$('#example2').ImgWheel({displayWidth: '50%'});
	$('#example3').ImgWheel({displayWidth: '400px'});
	$('#example4').ImgWheel({animateSpeedMax: 1000, animateSpeedMin: 1000, delayMax: 1400, delayMin: 1400});
	$('#example5').ImgWheel({animateSpeedMax: 400, animateSpeedMin: 400, delayMax: 500, delayMin: 1750});
	$('#example6').ImgWheel({animateSpeedMax: 200, animateSpeedMin: 3000, delayMax: 1000, delayMin: 3000});
	$('#example7').ImgWheel({imgPlacement: 'bottom'});
	$('#example8').ImgWheel({direction: 'reverse'});
	$('#example9').ImgWheel({functionality: 'click'});
	$('#example10').ImgWheel();
	$('#example11').ImgWheel();
	$('#example12').ImgWheel({articleWidth: '60%', articleAlignment: 'right'});
	$('#example13').ImgWheel({articleWidth: '60%', articleAlignment: 'left'});

// sidebar gets fixed at top of page
	var $header = $('.site-header'),
		$page_content = $('.page-content'),
		$content_block = $('.content-block'),
		$sidebar = $('#sidebar-nav'),
		$footer = $('.site-footer'),
		block_positions_top = [],
		block_positions_bottom = [],
		header_height = $header.outerHeight(),
		content_padding = $page_content.css('padding-top'),
		sidebar_height = $sidebar.outerHeight(),
		sidebar_trigger = header_height + (parseInt(content_padding, 10)),
		footer_height = $footer.outerHeight(),
		foot_side_comb_height = footer_height + sidebar_height + 15,
		doc_length = $(document).height(),
		abs_pos_trigger = doc_length - foot_side_comb_height,
		page_height = $(window).height();

	// Measure and store positions of the content-blocks for triggering visibility during scrolling
    $content_block.each(function () {
        var top = $(this).offset().top,
            bottom = top + $(this).outerHeight();
        block_positions_top.push(top);
        block_positions_bottom.push(bottom);
    });


	$(window).scroll(function () {
		var page_top = $(document).scrollTop(),
			page_bottom = page_top + page_height,
			block_top_trigger = (page_height * (1 / 4)) + page_top,
			block_bottom_trigger = (page_height * (3 / 5)) + page_top;
	// fix sidebar nav position when scrolling
		if (page_top < sidebar_trigger) {
			$sidebar.css({position: 'relative'});
		} else {
			if (page_top > sidebar_trigger && page_top <= abs_pos_trigger) {
				$sidebar.css({position: 'fixed', top: 0, bottom: 'auto'});
			} else {
				if (page_top > abs_pos_trigger) {
					$sidebar.css({position: 'absolute', bottom: 0, top: 'auto'});
				}
			}	
		}
	// content blocks fade into and out of view during scrolling
        for (var i = 0; i < block_positions_top.length; i++) {
            if (block_positions_bottom[i] < block_top_trigger || block_positions_top[i] > block_bottom_trigger) {
                $content_block.eq(i).addClass('invisible');
            } else {
                $content_block.eq(i).removeClass('invisible');
            }
        }
	});
	
	// recalculate relevant sizes on window resizing
	function reset_sizes() {
		block_positions_top = [];
		block_positions_bottom = [];
		page_height = $(window).height();
		sidebar_height = $sidebar.outerHeight();
		sidebar_trigger = header_height + (parseInt(content_padding, 10));
		footer_height = $footer.outerHeight();
		foot_side_comb_height = footer_height + sidebar_height + 15;
		doc_length = $(document).height();
		abs_pos_trigger = doc_length - foot_side_comb_height;
		$content_block.each(function () {
    	    var top = $(this).offset().top,
    	        bottom = top + $(this).outerHeight();
    	    block_positions_top.push(top);
    	    block_positions_bottom.push(bottom);
    	});
	}
	var resizeTimer;
	$(window).resize(function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(reset_sizes, 25);
	});


});