(function ($) {
	"use strict";

	$(window).on('load', function () {
		preloader();
		wowAnimation();
		
	});

	/*------------------------------------------
	= preloader
	-------------------------------------------*/
	function preloader() {
		$('#preloader').fadeOut('slow',function(){
			$(this).remove();
		});
	}

	//gasp
	gsap.config({
		nullTargetWarn: false,
	});
	
	/*------------------------------------------
	= back to top
	-------------------------------------------*/
	$(window).scroll(function () {
		if ($(this).scrollTop() > 500) {
			$('.xb-backtotop').addClass('active');
		} else {
			$('.xb-backtotop').removeClass('active');
		}
	});  
	$(function () {
		$(".scroll").on('click', function () {
			$("html,body").animate({ scrollTop: 0 }, "slow");
			return false
		});
	});

	/*------------------------------------------
	= sticky header
	-------------------------------------------*/
	function stickyHeader() {
		var scrollDirection = "";
		var lastScrollPosition = 0;

		// Clone and make header sticky if the element with class 'xb-header' exists
		if ($('.xb-header').length) {
			$('.xb-header').addClass('original').clone(true).insertAfter('.xb-header').addClass('xb-header-area-sticky xb-sticky-stt').removeClass('original');
		}

		// Handle scroll events
		$(window).on("scroll", function () {
			var currentScrollPosition = $(window).scrollTop();

			// Determine scroll direction
			scrollDirection = currentScrollPosition < lastScrollPosition ? "up" : "down";
			lastScrollPosition = currentScrollPosition;

			// Check if element with ID 'xb-header-area' has class 'is-sticky'
			if ($("#xb-header-area").hasClass("is-sticky")) {
				// Add or remove classes based on scroll position for sticky header and mobile header
				if (lastScrollPosition > 100) {
					$(".xb-header-area-sticky.xb-sticky-stb").addClass("xb-header-fixed");
				} else {
					$(".xb-header-area-sticky.xb-sticky-stb").removeClass("xb-header-fixed");
				}

				// Add or remove classes for sticky header based on scroll direction
				if (scrollDirection === "up" && lastScrollPosition > 100) {
					$(".xb-header-area-sticky.xb-sticky-stt").addClass("xb-header-fixed");
				} else {
					$(".xb-header-area-sticky.xb-sticky-stt").removeClass("xb-header-fixed");
				}
			}
		});
	}
	stickyHeader();

	/*------------------------------------------
	= header search
	-------------------------------------------*/
	$(".header-search-btn").on("click", function (e) {
		e.preventDefault();
		$(".header-search-form-wrapper").addClass("open");
		$('.header-search-form-wrapper input[type="search"]').focus();
		$('.body-overlay').addClass('active');
	});
	$(".xb-search-close").on("click", function (e) {
		e.preventDefault();
		$(".header-search-form-wrapper").removeClass("open");
		$("body").removeClass("active");
		$('.body-overlay').removeClass('active');
	});

	/*------------------------------------------
	= sidebar
	-------------------------------------------*/
	$('.sidebar-menu-close, .body-overlay').on('click', function () {
		$('.offcanvas-sidebar').removeClass('active');
		$('.body-overlay').removeClass('active');
	});

	$('.offcanvas-sidebar-btn').on('click', function () {
		$('.offcanvas-sidebar').addClass('active');
		$('.body-overlay').addClass('active');
	});
	$('.body-overlay').on('click', function () {
		$(this).removeClass('active');
		$(".header-search-form-wrapper").removeClass("open");
	});


	/*------------------------------------------
	= mobile menu
	-------------------------------------------*/
	$('.xb-nav-hidden li.menu-item-has-children > a').append('<span class="xb-menu-toggle"></span>');
	$('.xb-header-menu li.menu-item-has-children, .xb-menu-primary li.menu-item-has-children').append('<span class="xb-menu-toggle"></span>');
	$('.xb-menu-toggle').on('click', function () {
		if (!$(this).hasClass('active')) {
			$(this).closest('ul').find('.xb-menu-toggle.active').toggleClass('active');
			$(this).closest('ul').find('.sub-menu.active').toggleClass('active').slideToggle();
		}
		$(this).toggleClass('active');
		$(this).closest('.menu-item').find('> .sub-menu').toggleClass('active');
		$(this).closest('.menu-item').find('> .sub-menu').slideToggle();
	});

	$('.xb-nav-hidden li.menu-item-has-children > a').click(function (e) {
		var target = $(e.target);
		if ($(this).attr('href') === '#' && !(target.is('.xb-menu-toggle'))) {
			e.stopPropagation();
			if (!$(this).find('.xb-menu-toggle').hasClass('active')) {
				$(this).closest('ul').find('.xb-menu-toggle.active').toggleClass('active');
				$(this).closest('ul').find('.sub-menu.active').toggleClass('active').slideToggle();
			}
			$(this).find('.xb-menu-toggle').toggleClass('active');
			$(this).closest('.menu-item').find('> .sub-menu').toggleClass('active');
			$(this).closest('.menu-item').find('> .sub-menu').slideToggle();
		}
	});
	$(".xb-nav-mobile").on('click', function () {
		$(this).toggleClass('active');
		$('.xb-header-menu').toggleClass('active');
	});

	$(".xb-menu-close, .xb-header-menu-backdrop").on('click', function () {
		$(this).removeClass('active');
		$('.xb-header-menu').removeClass('active');
	});

	/*------------------------------------------
	= nice select
	-------------------------------------------*/
	$('select').niceSelect();

	/*------------------------------------------
	= data background and bg color
	-------------------------------------------*/
	$("[data-background]").each(function () {
		$(this).css("background-image", "url(" + $(this).attr("data-background") + ") ")
	})
	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));

	});

	/*------------------------------------------
	= aos animation
	-------------------------------------------*/
	function wowAnimation() {
		var wow = new WOW({
			boxClass: 'wow',
			animateClass: 'animated',
			offset: 0,
			mobile: true,
			live: true
		});
		wow.init();
	}

	/*------------------------------------------
	= counter
	-------------------------------------------*/
	if ($(".xbo").length) {
		$('.xbo').appear();
		$(document.body).on('appear', '.xbo', function (e) {
			var odo = $(".xbo");
			odo.each(function () {
				var countNumber = $(this).attr("data-count");
				$(this).html(countNumber);
			});
			window.xboOptions = {
				format: 'd',
			};
		});
	}

	if ($(".xbo_trigger").length) {
        var odo = $(".xbo_trigger");
        odo.each(function () {
            var countNumber = $(this).attr("data-count");
            var odometerInstance = new Odometer({
                el: this,
                value: 0,
                format: 'd',
            });
            odometerInstance.render();
            odometerInstance.update(countNumber);
        });
        $('.xbo_trigger').appear();
        $(document.body).on('appear', '.xboh', function (e) {
        });
    }

	/*------------------------------------------
	= isotop
	-------------------------------------------*/
	$('.grid').imagesLoaded(function () {
		var $grid = $('.grid').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				// use outer width of grid-sizer for columnWidth
				columnWidth: '.grid-item',
			}
		});

		// filter items on button click
		$('.career-menu').on('click', 'button', function () {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});
	});

	//for menu active class
	$('.career-menu button').on('click', function (event) {
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
		event.preventDefault();
	});

	/*------------------------------------------
	= Background Parallaxie - Start
	-------------------------------------------*/
	$(document).ready(function () {
		$('.parallaxie').parallaxie({
			speed: 0.5,
			offset: 0,
		});
	});

	/*------------------------------------------
	= smooth scroll
	-------------------------------------------*/
	const lenis = new Lenis({
		duration: .8,
		smoothWheel: true,
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);


	
	/*------------------------------------------
	= testimonial slide
	-------------------------------------------*/
	var slider = new Swiper(".xb-testimonial-slider", {
		loop: true,
		speed: 400,
		spaceBetween: 30,
		slidesPerView: 5,
		centeredSlides: false,
		autoplay: {
			enabled: true,
			delay: 6000
		},
		breakpoints: {
			'1700': {
				slidesPerView: 5,
			},
			'1600': {
				slidesPerView: 4,
			},
			'1024': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	/*------------------------------------------
	= testimonial slide
	-------------------------------------------*/
	var slider = new Swiper(".ac-testimonial-slider", {
		loop: true,
		speed: 400,
		spaceBetween: 30,
		slidesPerView: 3,
		centeredSlides: false,
		autoplay: {
			enabled: true,
			delay: 6000
		},
		breakpoints: {
			'1600': {
				slidesPerView: 3,
			},
			'1200': {
				slidesPerView: 3,
			},
			'1024': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	/*------------------------------------------
	= blog slide
	-------------------------------------------*/
	var slider = new Swiper(".blog-slider", {
		loop: true,
		speed: 400,
		spaceBetween: 30,
		slidesPerView: 1,
		centeredSlides: false,
		autoplay: {
			enabled: true,
			delay: 6000
		},
		pagination: {
			el: ".swiper-pagination",
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		breakpoints: {
			'1600': {
				slidesPerView: 1,
			},
			'1024': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	/*------------------------------------------
	= ai-testimonial slide
	-------------------------------------------*/
	var swiper = new Swiper(".ai-testimonial-slider-nav", {
		loop: true,
		spaceBetween: 0,
		slidesPerView: 1,
		freeMode: true,
		effect: "fade",
		watchSlidesProgress: true,
		allowTouchMove: true,
		breakpoints: {
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	var swiper2 = new Swiper(".ai-testimonial-slider-img", {
		loop: true, 
		spaceBetween: 0,
		slidesPerView: 1,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		autoplay: {
			enabled: true,
			delay: 6000
		},
		thumbs: {
			swiper: swiper,
		},
	});


	/*------------------------------------------
	= inhover active
	-------------------------------------------*/
	$(".xb-mouseenter").on('mouseenter', function () {
		$(".xb-mouseenter").removeClass("active");
		$(this).addClass("active");
	});
	$(".xb-mouseenter2").on('mouseenter', function () {
		$(".xb-mouseenter2").removeClass("active");
		$(this).addClass("active");
	});

	/*------------------------------------------
	= click button active
	-------------------------------------------*/
	$(function () {
		$('.category li').on('click', function () {
			var active = $('.category li.active');
			active.removeClass('active');
			$(this).addClass('active');
		});
	});

	/*------------------------------------------
	= magnificPopup
	-------------------------------------------*/
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});
	$('.popup-video').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-zoom-in',
	});

	/*------------------------------------------
	= Accordion Box
	-------------------------------------------*/
	if ($(".accordion_box").length) {
		$(".accordion_box").on("click", ".acc-btn", function () {
			var outerBox = $(this).parents(".accordion_box");
			var target = $(this).parents(".accordion");

			if ($(this).next(".acc_body").is(":visible")) {
				$(this).removeClass("active");
				$(this).next(".acc_body").slideUp(300);
				$(outerBox).children(".accordion").removeClass("active-block");
			} else {
				$(outerBox).find(".accordion .acc-btn").removeClass("active");
				$(this).addClass("active");
				$(outerBox).children(".accordion").removeClass("active-block");
				$(outerBox).find(".accordion").children(".acc_body").slideUp(300);
				target.addClass("active-block");
				$(this).next(".acc_body").slideDown(300);
			}
		});
	}
	
	/*------------------------------------------
	= marquee
	-------------------------------------------*/
	$('.marquee-left').marquee({
		speed: 20,
		gap: 0,
		delayBeforeStart: 0,
		direction: 'left',
		duplicated: true,
		pauseOnHover: false,
		startVisible: true,
	});	
	$('.marquee-right').marquee({
		speed: 20,
		gap: 0,
		delayBeforeStart: 0,
		direction: 'right',
		duplicated: true,
		pauseOnHover: false,
		startVisible: true,
	});	

	/*------------------------------------------
	= Language Select
	-------------------------------------------*/
	const locales = ["en-GB","ar-SA","zh-CN","de-DE","es-ES","fr-FR","hi-IN","it-IT","in-ID","ja-JP","ko-KR","nl-NL","no-NO","pl-PL","pt-BR","sv-SE","fi-FI","th-TH","tr-TR","uk-UA","vi-VN","ru-RU","he-IL"];

	function getFlagSrc(countryCode) {
		return /^[A-Z]{2}$/.test(countryCode)
		? `https://flagsapi.com/${countryCode.toUpperCase()}/shiny/64.png`
		: "";
	}

	$(document).ready(function () {
		function setSelectedLocale(locale) {
		const intlLocale = new Intl.Locale(locale);

		const $dropdownContent = $("#language_dropdown > ul");
		$dropdownContent.empty();

		const otherLocales = locales.filter(loc => loc !== locale);
		$.each(otherLocales, function (index, otherLocale) {
			const otherIntlLocale = new Intl.Locale(otherLocale);
			const otherLangName = new Intl.DisplayNames([otherLocale], { type: "language" }).of(otherIntlLocale.language);

			const $listEl = $("<li>").html(`${otherLangName} <img src="${getFlagSrc(otherIntlLocale.region)}" />`);
			$listEl.val(otherLocale);

			$listEl.on("mousedown", function () {
			setSelectedLocale(otherLocale);
			});

			$dropdownContent.append($listEl);
		});

		$("#language_active_btn").html(`<span><img src="${getFlagSrc(intlLocale.region)}" /></span> <i class="fa-solid fa-angle-down"></i>`);
		}

		setSelectedLocale(locales[0]);

		const browserLang = new Intl.Locale(navigator.language).language;
		$.each(locales, function (index, locale) {
		const localeLang = new Intl.Locale(locale).language;
		if (localeLang === browserLang) {
			setSelectedLocale(locale);
		return false; // Break loop
		}
	});
	});

	/*------------------------------------------
	= process trigger
	-------------------------------------------*/
	document.addEventListener("DOMContentLoaded", function () {
		const xbProcessItem = document.querySelectorAll(".xb-process-item");
		const processStep = document.querySelectorAll(".xb-process-step");
		
		const options = {
			root: null,
			threshold: 0.5
		};
	
		let observer = new IntersectionObserver(function (entries) {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					let index = Array.from(xbProcessItem).indexOf(entry.target);
	
					xbProcessItem.forEach(item => item.classList.remove('active'));
					processStep.forEach(item => item.classList.remove('active'));
	
					xbProcessItem[index].classList.add('active');
					processStep[index].classList.add('active');
				}
			});
		}, options);
	
		xbProcessItem.forEach(item => {
			observer.observe(item);
		});
	
	});

	/*------------------------------------------
	= pricing Toggle btn
	-------------------------------------------*/
	function priceToggle(){
		const toggleBtn = document.getElementById('price-toggle-btn');
		const time = document.getElementById('time');
		const dollarPrice = document.getElementById('dollar-price');
	
		if (!toggleBtn || !time || !dollarPrice) return;
	
		toggleBtn.addEventListener('click', function () {
			const isActive = this.classList.toggle('active');
	
			if (isActive) {
				dollarPrice.innerText = dollarPrice.dataset.priceYear || '';
				time.innerText = time.dataset.timeYear || '';
			} else {
				dollarPrice.innerText = dollarPrice.dataset.priceMonth || '';
				time.innerText = time.dataset.timeMonth || '';
			}
		});
	}
	priceToggle();

	/*------------------------------------------
	= Text reveal With Scroll 
	-------------------------------------------*/
	if($('.xb-text-reveal').length) {
		var textheading = $(".xb-text-reveal");

		if(textheading.length == 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
			
			el.split = new SplitText(el, { 
				type: "lines,words,chars",
				linesClass: "split-line"
			});
			
			if( $(el).hasClass('xb-text-reveal') ){
				gsap.set(el.split.chars, {
					opacity: .3,
					x: "-7",
				});
			}
			el.anim = gsap.to(el.split.chars, {
				scrollTrigger: {
					trigger: el,
					start: "top 92%",
					end: "top 60%",
					markers: false,
					scrub: 1,
				},

				x: "0",
				y: "0",
				opacity: 1,
				duration: .7,
				stagger: 0.2,
			});
			
		});
	}

	/*------------------------------------------
	= project section animation
	-------------------------------------------*/
	function ptojectScale(){
		let tl = gsap.timeline();
		let pr = gsap.matchMedia();
		pr.add("(min-width: 767px)", () => {
			let otherSections = document.querySelectorAll('.des-portfolio-panel')
			otherSections.forEach((section, index) => {
				gsap.set(otherSections, {
					scale: 1,
				});
				tl.to(section, {
					scale: .8,
					scrollTrigger: {
						trigger: section,
						pin: section,
						scrub: 1,
						start: 'top 0',
						end: "bottom 60%",
						endTrigger: '.des-portfolio-wrap',
						pinSpacing: false,
						markers: false,
					},
				})
			})
		});
	}
	ptojectScale();

	/*------------------------------------------
	= auto tab class change animation
	-------------------------------------------*/
	document.addEventListener("DOMContentLoaded", function () {
		let tabs = document.querySelectorAll('.xb-video-nav .nav-link'); 
		if (!tabs.length) return;

		let index = 0;
		let intervalTime = 3000;

		setInterval(() => {
			index = (index + 1) % tabs.length;

			if (typeof bootstrap !== "undefined" && bootstrap.Tab) {
				let nextTab = new bootstrap.Tab(tabs[index]);
				nextTab.show();
			}
		}, intervalTime);
	});


	/*------------------------------------------
	= hover class active and change elements
	-------------------------------------------*/
	function brand_animation() {
		var element = $(".ai-brand-list .current");

		function activeBrandList(e) {
			if (!e || !e.length) return;

			e.closest("li").removeClass("mleave").addClass("current");
			e.closest("li").siblings().removeClass("current").addClass("mleave");
		}

		$(".ai-brand-list li").on("mouseenter", function () {
			var e = $(this);
			var index = e.index();

			activeBrandList(e);
			$(".ai-brand-logo li").removeClass("active").eq(index).addClass("active");
		});

		$(".ai-brand-list").on("mouseleave", function () {
			element = $(".ai-brand-list .current");
			var index = element.index();

			activeBrandList(element);
			$(".ai-brand-logo li").removeClass("active").eq(index).addClass("active");
			element.closest("li").siblings().removeClass("mleave");
		});

		$(".ai-brand-list li").on("click", function () {
			$(".ai-brand-list li").removeClass("current");
			$(this).addClass("current");

			var index = $(this).index();
			$(".ai-brand-logo li").removeClass("active").eq(index).addClass("active");
		});

		activeBrandList(element);
	}
	brand_animation();


	/*------------------------------------------
	= hover class active and change elements
	-------------------------------------------*/
	function download_book_animation() {
		var element = $(".ai-download-book-list .current");

		function activeBookList(e) {
			if (!e || !e.length) return;

			e.removeClass("mleave").addClass("current");
			e.siblings().removeClass("current").addClass("mleave");
		}

		$(".ai-download-book-list .list").on("mouseenter", function () {
			var e = $(this);
			var index = e.index();

			activeBookList(e);
			$(".ai-download-book .book-item").removeClass("active").eq(index).addClass("active");
		});

		$(".ai-download-book-list").on("mouseleave", function () {
			element = $(".ai-download-book-list .current");
			var index = element.index();

			activeBookList(element);
			$(".ai-download-book .book-item").removeClass("active").eq(index).addClass("active");
			element.siblings().removeClass("mleave");
		});

		$(".ai-download-book-list .list").on("click", function () {
			$(".ai-download-book-list .list").removeClass("current");
			$(this).addClass("current");

			var index = $(this).index();
			$(".ai-download-book .book-item").removeClass("active").eq(index).addClass("active");
		});

		activeBookList(element);
	}

	download_book_animation();


	/*------------------------------------------
	= project sticky 
	-------------------------------------------*/
	document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".xb-project-item");
    const paginations = document.querySelectorAll(".xb-project-pagination li");

    if (!items.length || !paginations.length) return;

    items.forEach((item) => {
        item.style.transition = "opacity 0.6s ease";
        item.style.opacity = "1";
    });

    function updateActive() {
        let indexToActivate = 0;
        let triggerLine = window.innerHeight * 0.3; 

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top <= triggerLine) {
                indexToActivate = index;
            }
        });

        // pagination update
        paginations.forEach((el) => el.classList.remove("active"));
        if (paginations[indexToActivate]) {
            paginations[indexToActivate].classList.add("active");
        }

        // fade effect
        items.forEach((item, i) => {
            if (i === indexToActivate) {
                item.style.opacity = "1"; 
            } else if (i < indexToActivate) {
                item.style.opacity = "0.3";
            } else {
                item.style.opacity = "1"; 
            }
        });
    }

    window.addEventListener("scroll", updateActive);
    updateActive();
});








})(jQuery);


