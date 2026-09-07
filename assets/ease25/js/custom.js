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
        $('#top_bar .login_btn').on('click', function () {
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

// 스크롤에 반응하는 것들(등장 효과 · 헤더 · 사이드 버튼 · 맨 위로)을
// 하나의 핸들러에서 한 프레임에 한 번만 처리한다.
// 스무스 스크롤(Lenis)은 매 프레임 scroll 을 발생시키므로, 핸들러를 따로 두면
// 같은 프레임에 위치를 여러 번 다시 재게 되어 스크롤이 끌리듯 늘어진다.
$(function () {
    var $win = $(window);
    var $header = $('#header');
    var $side = $('#side_lnk');
    var $toTop = $('.to_top');
    var $default = $('.default');
    var ticking = false;

    function onScroll() {
        var sct = $win.scrollTop();
        var winH = window.innerHeight;

        $header.toggleClass('scr', sct > 90);
        $side.toggleClass('on', sct > 500);
        $toTop.toggleClass('on', sct > 500);

        // 화면 안으로 100px 이상 들어오면 등장
        $default.each(function () {
            var top = this.getBoundingClientRect().top;
            this.classList.toggle('on', winH > top + 100);
        });

        ticking = false;
    }

    $win.on('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    });

    onScroll(); // 새로고침 시에도 체크


    $('#side_lnk .d_btn, .to_top').on('click', function () {
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            $('html, body').animate({ scrollTop: 0 }, 400);
        }
    });
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

    // Lenis 는 실제 창을 스크롤하므로 AOS 는 자체 스크롤 감지로 동작한다.
    // 여기서 매 프레임 AOS.refresh() 를 부르면 모든 요소의 위치를 다시 재는
    // 강제 레이아웃이 초당 60번 일어나 스크롤이 끌리듯 늘어진다. (부르지 않는다)

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

        // 위치가 실제로 바뀔 때만 다시 잰다 (스크롤 중에는 부르지 않는다)
        var aosTimer = null;
        $(window).on('load resize', function () {
            clearTimeout(aosTimer);
            aosTimer = setTimeout(function () {
                AOS.refresh();
            }, 150);
        });
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

