//**ふわっと表示させる**//
window.addEventListener("scroll", function () {
    const scrollAnimationElm = document.querySelectorAll(".scroll_up");
    const scrollAnimationFunc = function () {
        for (let i = 0; i < scrollAnimationElm.length; i++) {
            const triggerMargin = 100;
            if (
                window.innerHeight >
                scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin
            ) {
                scrollAnimationElm[i].classList.add("on");
            }
        }
    };
    window.addEventListener("load", scrollAnimationFunc);
    window.addEventListener("scroll", scrollAnimationFunc);
});

//**pageTOPボタン**//
const pagetop_btn = document.querySelector(".pagetop");

pagetop_btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

//**ハンバーガーメニュー**//
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger-menu");
    const nav = document.querySelector(".p-header_nav");
    const links = document.querySelectorAll(".p-header_nav a"); // すべてのナビゲーションリンクを取得

    // ハンバーガーメニューをクリックしたときの開閉処理
    hamburger.addEventListener("click", () => {
        if (hamburger.classList.contains("is-active")) {
            hamburger.classList.remove("is-active");
            nav.classList.remove("is-active");
        } else {
            hamburger.classList.add("is-active");
            nav.classList.add("is-active");
        }
    });

    // ナビゲーションリンクをクリックしたときにメニューを閉じる
    links.forEach(function(link) {
        link.addEventListener("click", () => {
            hamburger.classList.remove("is-active");
            nav.classList.remove("is-active");
        });
    });
});

class Slider {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      this.sliderContainer = this.container.querySelector(".slider_outer");
      this.slides = this.sliderContainer.querySelectorAll("img");
      this.nextBtn = this.container.querySelector(".next-btn");
      this.backBtn = this.container.querySelector(".back-btn");
      this.menuClickPics = this.container.querySelectorAll(".menu-click-pic");
      this.menuTexts = this.container.querySelectorAll(".menu-texts");

      this.sliderStatus = 1;
      this.slideWidts = []; // 各スライドの幅を保存
      this.totalSlides = this.slides.length;

      this.init();
    }

    init() {
        this.calculateSlideWidths(); // 各スライドの幅を事前に計算
        this.nextBtn.addEventListener("click", () => this.nextSlide());
        this.backBtn.addEventListener("click", () => this.previousSlide());
        this.updateSlider(); // 初期状態の更新
        this.updateButtonState(); // ボタンの有効/無効状態を設定
    }

    calculateSlideWidths() {
        this.slideWidths = Array.from(this.slides).map(slide => slide.clientWidth);
    }

    getOffset() {
        // 現在のスライドまでの合計幅を計算
        return this.slideWidths.slice(0, this.sliderStatus - 1).reduce((acc, width) => acc + width, 0);
    }

    nextSlide() {
        if (this.sliderStatus < this.totalSlides) {
            this.sliderStatus++;
            this.updateSlider();
            this.updateButtonState(); // ボタンの有効/無効状態を更新
        }
    }

    previousSlide() {
        if (this.sliderStatus > 1) {
            this.sliderStatus--;
            this.updateSlider();
            this.updateButtonState(); // ボタンの有効/無効状態を更新
        }
    }

    updateSlider() {
        const offset = this.getOffset(); // 現在のオフセットを取得
        this.sliderContainer.style.transform = `translateX(-${offset}px)`;

        this.menuClickPics.forEach((pic, index) => {
            pic.style.opacity = index === this.sliderStatus - 1 ? "1" : "0.3";
        });

        this.menuTexts.forEach((text, index) => {
            text.style.display = index === this.sliderStatus - 1 ? "block" : "none";
        });
    }

    updateButtonState() {
        // 次へボタンを無効化
        if (this.sliderStatus >= this.totalSlides) {
            this.nextBtn.disabled = true;
        } else {
            this.nextBtn.disabled = false;
        }

        // 戻るボタンを無効化
        if (this.sliderStatus <= 1) {
            this.backBtn.disabled = true;
        } else {
            this.backBtn.disabled = false;
        }
    }

    resetSlider() {
        this.sliderStatus = 1;
        this.updateSlider();
        this.updateButtonState();
    }
}


function handleMediaQuery() {
    const mediaQuery = window.matchMedia("(min-width: 701px)");
    let sliderInstances = []; // スライダーのインスタンスを管理

    function handleSliderActivation() {
        const sliderContainers = document.querySelectorAll(".food"); // 各スライダーコンテナを取得

        if (mediaQuery.matches) {
            // スライダーを有効化
            sliderContainers.forEach(container => {
                const containerClass = `.${container.classList[1]}`; // food2, dessert, drink など
                if (!sliderInstances.some(instance => instance.container === container)) {
                    const sliderInstance = new Slider(containerClass); // スライダーを初期化
                    sliderInstances.push(sliderInstance);
                }
            });
        } else {
            // スライダーを無効化（位置をリセット）
            sliderInstances.forEach(instance => {
                instance.resetSlider();
            });
            sliderInstances = []; // インスタンスをクリア
        }
    }

    handleSliderActivation();
    mediaQuery.addEventListener("change", handleSliderActivation);
}

window.addEventListener("load", () => {
    handleMediaQuery();
});

window.addEventListener("resize", () => {
    const sliderContainers = document.querySelectorAll(".food");
    sliderContainers.forEach(container => {
        const sliderInstance = new Slider(`.${container.classList[1]}`);
        sliderInstance.calculateSlideWidths();
        sliderInstance.updateSlider();
    });
});
