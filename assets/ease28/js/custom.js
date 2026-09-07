$(function () {
    $('.mbtn').on('click', function () {
        $(this).toggleClass('on');
        $('#header .gnb_container').toggleClass('on');
        $('#header h1').toggleClass('on');
    });


    $('.gnb>ul>li>a').on('click', function (e) {
        if ($(this).next().is('ul') && $('#header .gnb_container').hasClass('on')) {
            e.preventDefault();
            $('#header .gnb_container .gnb>ul>li ul').stop().slideUp();
            $(this).next().stop().slideDown();
        }

    });


    $(window).on('resize', function () {
        let w = $(window).width();

        if (w > 768) {
            $('#header .gnb_container').removeClass('on');
            $('.gnb>ul>li ul').removeAttr('style');
        }

    });


    // 메뉴가 열려 있을 때 뒤 페이지가 따라 스크롤되는 것을 막는다.
    // 단, 흰 메뉴판(.gnb) 안에서의 스크롤은 허용해야 항목이 많을 때 끝까지 볼 수 있다.
    $('#header .gnb_container').on('scroll wheel touchmove', function (e) {
        if ($(this).hasClass('on') && !$(e.target).closest('.gnb').length) {
            e.preventDefault();
            return false;
        }
    });


});

$(function () {
    // 로그인 팝업 : 상단 바의 로그인 아이콘으로 열고, 배경·닫기 버튼·ESC 로 닫는다
    var $loginPop = $('#login_pop');

    if ($loginPop.length) {
        // 로그인 버튼은 헤더(.hd_out)와 모바일 메뉴(.m_out) 두 군데에 있으므로
        // 특정 부모에 묶지 말고 클래스로 한 번에 잡는다.
        $(document).on('click', '.login_btn', function () {
            // 모바일 메뉴가 열려 있으면 먼저 닫는다 (팝업이 메뉴 뒤로 가려지지 않도록)
            $('#header .gnb_container').removeClass('on');
            $('.mbtn').removeClass('on');
            $('#header h1').removeClass('on');

            $loginPop.addClass('on');
            $loginPop.find('input[name="mb_id"]').trigger('focus');
        });

        $loginPop.on('click', '.lp_bg, .lp_close', function () {
            $loginPop.removeClass('on');
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $loginPop.hasClass('on')) {
                $loginPop.removeClass('on');
            }
        });

        // 자동로그인 안내 (그누보드 기본 아웃로그인과 동일한 동작)
        $loginPop.find('#lp_auto').on('click', function () {
            if (this.checked && !confirm('자동로그인을 사용하시면 다음부터 회원아이디와 비밀번호를 입력하실 필요가 없습니다.\n\n공공장소에서는 개인정보가 유출될 수 있으니 사용을 자제하여 주십시오.\n\n자동로그인을 사용하시겠습니까?')) {
                return false;
            }
        });
    }
});

$(function () {
    $(window).on("scroll", function () {
        $(".default").each(function () {
            var elementTop = $(this).offset().top;   // 요소의 위치
            var scrollTop = $(window).scrollTop();   // 스크롤 위치
            var windowHeight = $(window).height();   // 창 높이

            // 요소가 화면의 절반 이상 보일 때
            if (scrollTop + windowHeight > elementTop + 100) {
                $(this).addClass("on");
            } else {
                $(this).removeClass("on");
            }
        });
    }).trigger("scroll"); // 새로고침 시에도 체크
});



$(function () {
    $('#side_lnk .d_btn').on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 400)
    });


    $(window).on('scroll', function () {
        let sct = $(window).scrollTop();

        if (sct > 500) {
            $('#side_lnk').addClass('on')
        } else {
            $('#side_lnk').removeClass('on')
        }
    })
});


$(function () {

    $(window).on('scroll', function () {
        let sct = $(window).scrollTop();

        if (sct > 90) {
            $('#header').addClass('scr')
        } else {
            $('#header').removeClass('scr')
        }
    });

});



$(function () {
    $('.to_top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 })
    });


    $(window).on('scroll', function () {
        let sct = $(window).scrollTop();

        if (sct > 500) {
            $('.to_top').addClass('on')
        } else {
            $('.to_top').removeClass('on')
        }
    })
});


$(function () {
    $('.footer #lnk').on('change', function () {
        let lnk = $(this).val();
        if (lnk) {
            window.open(lnk)
        }
    })
});


$(function () {
    // Lenis 스무스 스크롤 초기화
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // 다른 스크립트(앵커 내비게이션 등)에서 사용할 수 있도록 전역 노출
    window.lenis = lenis;

    // Lenis 스크롤 이벤트에 AOS 업데이트 연결
    lenis.on('scroll', () => {
        AOS.refresh();
    });

    // AOS 초기화
    // AOS 스크롤 애니메이션
    // aos.css 의 [data-aos^=fade]{opacity:0} 은 JS 없이도 적용되므로,
    // 라이브러리가 없을 때는 속성을 직접 지워 콘텐츠가 숨은 채 남지 않게 한다.
    if (typeof AOS === 'undefined') {
        document.querySelectorAll('[data-aos]').forEach(function (el) {
            el.removeAttribute('data-aos');
        });
    } else {
        AOS.init({
            once: true, // 한 번만 재생 (오르내릴 때마다 반복되면 산만하다)
            duration: 700,
            offset: 80,
            easing: 'ease-out-quad',

            // 반응형(1024px 이하)에서는 사용하지 않는다.
            // AOS 는 비활성화 시 data-aos 속성을 스스로 제거하므로 콘텐츠는 그대로 보인다.
            disable: function () {
                return window.innerWidth <= 1024;
            },
        });

        // 이미지 로드 등으로 위치가 바뀐 경우 대비
        setTimeout(function () {
            AOS.refresh();
        }, 100);
    }
});


$(function () {
    feather.replace();
    lucide.createIcons();
});

/* ──────────────────────────────────────────────────────────
   머리 높이 재기
   히어로는 "화면 높이 - 머리 높이" 로 잡는다. 머리(상단 바 + 헤더)의
   높이는 테마마다 다르고 화면 폭에 따라도 달라지므로, CSS 에 어림값을
   두고 여기서 실제 값을 재어 덮어쓴다.
   ────────────────────────────────────────────────────────── */
(function () {
    var root = document.documentElement;

    function measure() {
        var head = document.getElementById('header');
        if (!head) return;
        // 스크롤해서 메뉴 줄이 화면에 붙은 상태면 제 높이가 아니다
        if (head.className.indexOf('scr') >= 0) return;

        var bar = document.getElementById('top_bar');
        var h = head.offsetHeight + (bar ? bar.offsetHeight : 0);
        if (h > 0) root.style.setProperty('--hd-h', h + 'px');
    }

    measure();
    window.addEventListener('load', measure);   // 글꼴이 자리를 잡은 뒤 한 번 더

    var timer = null;
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(measure, 150);
    });
})();

