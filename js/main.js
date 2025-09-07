// 工具函数
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const $on = (el, evt, fn) => el && el.addEventListener(evt, fn);

// 滚动按钮功能
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const footer = document.querySelector('footer');
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    scrollToBottomBtn.addEventListener('click', function() {
        const footerTop = footer.offsetTop;
        window.scrollTo({ top: footerTop, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    scrollToTopBtn.style.display = 'none';
});

// 轮播图指示器与自动轮播
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    function generateIndicators() {
        indicatorsContainer.innerHTML = '';
        slides.forEach((slide, index) => {
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            indicatorsContainer.appendChild(indicator);
        });
    }
    function updateCarousel() {
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });
    generateIndicators();
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }, 5000);
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    });
});

// 页面主交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 视频源、iframe源
    const videoSources = [
        "https://workdrive.zohopublic.com.cn/external/b7e23ca12250e0f5003fa47df6435c72bf9b830415b4705e4b7233abfeaef489/download?directDownload=true",
        "https://workdrive.zohopublic.com.cn/external/6c606102382bdab5b99b34175be319eb9a5eab25aabbb873fb3a31cd785711dd/download?directDownload=true",
        "https://workdrive.zohopublic.com.cn/external/7fd78328e5969ffb7dbe9f3aa2a47390a64ea773c85b107ae0e555e51e1b8b83/download?directDownload=true"
    ];
    const iframeSrcs = [
        "https://workdrive.zohopublic.com.cn/embed/kpgnr272ef737019b483e80ff06b2b907818f?toolbar=false&appearance=light&themecolor=green",
        "https://workdrive.zohopublic.com.cn/embed/kpgnr891a05e47ba64de290d2386fb3ecec7b?toolbar=false&appearance=light&themecolor=green",
        "https://workdrive.zohopublic.com.cn/embed/kpgnrab51ce9b0e4149438f932a14c612587f?toolbar=false&appearance=light&themecolor=green"
    ];

    // DOM元素收集
    const dom = {
        videoBtns: $$('.video-btn'),
        switchSrcBtns: $$('.switch-src-btn'),
        tipsBtn: $('#tips-btn'),
        tipsBox: $('#tips-box'),
        tipsItems: $$('.tips-item'),
        notesBtn: $('#notes-btn'),
        notesBox: $('#notes-box'),
        notesLists: [$('#notes-list-0'), $('#notes-list-1'), $('#notes-list-2')],
        downloadBtn: $('#download-btn'),
        downloadModal: $('#download-modal'),
        addNoteBtn: $('#add-note'),
        noteText: $('#note-text'),
        videoDescBtn: $('#video-desc-btn'),
        videoDescBox: $('#video-desc-box'),
        videoDescItems: $$('.video-desc-item'),
        carouselContainer: $('.carousel-container'),
        carouselSlides: $$('.carousel-slide'),
        prevBtn: $('.carousel-prev'),
        nextBtn: $('.carousel-next'),
        indicators: $$('.carousel-indicator'),
        pinButton: $('#pinButton'),
        popupImgBtnFixed: $('#popupImgBtnFixed'),
        player: null,
        iframeContainer: $('#iframe-container'),
        videoContainer: $('#video-container'),
        srcIframe: $('#src-iframe'),
        popupImg: $('#popup-img'),
        imgPopupModal: $('#img-popup-modal'),
        closeImgPopup: $('#close-img-popup'),
        copyAddressBtn: $('#copy-address-btn'),
        addressText: $('#address-text'),
        basicTipsContent: $('.basic-tips-content')
    };

    // 状态变量
    let currentVideoIndex = 0;
    let currentSlide = 0;
    let isPinned = false;
    let carouselInterval;
    let drag = { startX: 0, isDragging: false, threshold: 50, deltaX: 0 };

    // Plyr播放器初始化
    dom.player = new Plyr('#player', {
        controls: [
            'play-large', 'play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration',
            'mute', 'volume', 'captions', 'settings', 'speed', 'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed', 'loop'],
        autoplay: false,
        muted: false,
        i18n: {
            restart: '重新开始',
            rewind: '快退{seektime}秒',
            play: '播放',
            pause: '暂停',
            fastForward: '快进{seektime}秒',
            seek: '查找',
            seekLabel: '{currentTime} / {duration}',
            played: '已播放',
            buffered: '已缓冲',
            currentTime: '当前时间',
            duration: '总时长',
            volume: '音量',
            mute: '静音',
            unmute: '取消静音',
            enableCaptions: '开启字幕',
            disableCaptions: '关闭字幕',
            download: '下载',
            enterFullscreen: '全屏',
            exitFullscreen: '退出全屏',
            frameTitle: '播放器',
            captions: '字幕',
            settings: '设置',
            menuBack: '返回上一级菜单',
            speed: '速度',
            normal: '正常',
            quality: '质量',
            loop: '循环',
            start: '开始',
            end: '结束',
            all: '全部',
            reset: '重置',
            disabled: '禁用',
            enabled: '启用',
            advertisement: '广告',
            qualityBadge: {
                2160: '4K',
                1440: 'HD',
                1080: 'HD',
                720: 'HD',
                576: 'SD',
                480: 'SD',
            }
        }
    });

    // 统一显示/隐藏信息框
    function showBox(box) {
        [dom.tipsBox, dom.notesBox, dom.videoDescBox].forEach(b => b.classList.remove('visible'));
        box.classList.add('visible');
    }

    // 视频切换
    function switchVideo(index, useIframe = false) {
        currentVideoIndex = index;
        dom.videoBtns.forEach((btn, i) => btn.classList.toggle('active', i === index));
        dom.player.pause();
        dom.player.currentTime = 0;
        dom.player.stop && dom.player.stop();
        if (useIframe) {
            dom.videoContainer.style.display = 'none';
            dom.iframeContainer.style.display = 'block';
            dom.srcIframe.src = iframeSrcs[index];
        } else {
            dom.videoContainer.style.display = 'block';
            dom.iframeContainer.style.display = 'none';
            dom.srcIframe.src = '';
            dom.player.source = { type: 'video', sources: [{ src: videoSources[index], type: 'video/mp4' }] };
        }
        updateTips();
        updateVideoDesc();
        updateNotesList();
    }

    // 更新提示内容
    function updateTips() {
        dom.tipsItems.forEach((item, idx) => item.style.display = idx === currentVideoIndex ? 'block' : 'none');
    }
    // 更新视频说明
    function updateVideoDesc() {
        dom.videoDescItems.forEach((item, idx) => item.style.display = idx === currentVideoIndex ? 'block' : 'none');
    }
    // 更新笔记列表显示
    function updateNotesList() {
        dom.notesLists.forEach((list, idx) => list.style.display = idx === currentVideoIndex ? 'block' : 'none');
    }

    // 添加笔记
    function addNote() {
        const text = dom.noteText.value.trim();
        if (!text) return;
        const now = new Date();
        const timeString = now.toLocaleString();
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <div class="note-time">${timeString}</div>
            <div class="note-content">${text}</div>
            <button class="delete-note"><i class="fa fa-times"></i></button>
        `;
        dom.notesLists[currentVideoIndex].prepend(noteItem);
        dom.noteText.value = '';
    }

    // 删除笔记（事件委托）
    dom.notesLists.forEach(list => {
        $on(list, 'click', function (e) {
            if (e.target.closest('.delete-note')) {
                e.target.closest('.note-item').remove();
            }
        });
    });

    // 轮播图更新
    function updateCarousel() {
        dom.carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        dom.indicators.forEach((indicator, idx) => indicator.classList.toggle('active', idx === currentSlide));
    }
    // 轮播自动切换
    function startCarouselInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => {
            if (!isPinned) {
                currentSlide = (currentSlide + 1) % dom.carouselSlides.length;
                updateCarousel();
            }
        }, 5000);
    }

    // 轮播图拖动/滑动逻辑
    function bindCarouselDrag() {
        // 触摸
        $on(dom.carouselContainer, 'touchstart', e => {
            if (isPinned || e.touches.length !== 1) return;
            drag.isDragging = true; drag.startX = e.touches[0].clientX; drag.deltaX = 0;
        });
        $on(dom.carouselContainer, 'touchmove', e => {
            if (!drag.isDragging || isPinned) return;
            drag.deltaX = e.touches[0].clientX - drag.startX;
        });
        $on(dom.carouselContainer, 'touchend', () => {
            if (!drag.isDragging || isPinned) return;
            drag.isDragging = false;
            if (Math.abs(drag.deltaX) > drag.threshold) {
                currentSlide = (drag.deltaX > 0)
                    ? (currentSlide - 1 + dom.carouselSlides.length) % dom.carouselSlides.length
                    : (currentSlide + 1) % dom.carouselSlides.length;
                updateCarousel();
            }
            drag.deltaX = 0;
        });
        // 鼠标
        $on(dom.carouselContainer, 'mousedown', e => {
            if (isPinned) return;
            drag.isDragging = true; drag.startX = e.clientX; drag.deltaX = 0;
        });
        $on(dom.carouselContainer, 'mousemove', e => {
            if (!drag.isDragging || isPinned) return;
            drag.deltaX = e.clientX - drag.startX;
        });
        $on(dom.carouselContainer, 'mouseup', () => {
            if (!drag.isDragging || isPinned) return;
            drag.isDragging = false;
            if (Math.abs(drag.deltaX) > drag.threshold) {
                currentSlide = (drag.deltaX > 0)
                    ? (currentSlide - 1 + dom.carouselSlides.length) % dom.carouselSlides.length
                    : (currentSlide + 1) % dom.carouselSlides.length;
                updateCarousel();
            }
            drag.deltaX = 0;
        });
        $on(dom.carouselContainer, 'mouseleave', () => { drag.isDragging = false; drag.deltaX = 0; });
    }

    // 任务图标点击切换删除线
    $$('.task-icon').forEach(function (icon) {
        $on(icon, 'click', function () {
            const text = this.nextElementSibling;
            text.classList.toggle('task-done');
            this.style.color = text.classList.contains('task-done') ? '#2ecc71' : '#bbb';
        });
    });

    // 音乐播放器相关
    (() => {
        const musicBtn = document.getElementById('music-float-btn');
        const popup = document.getElementById('music-popup');
        const audio = document.getElementById('music-audio');
        const playBtn = document.getElementById('music-play');
        const prevBtn = document.getElementById('music-prev');
        const nextBtn = document.getElementById('music-next');
        const fileName = document.getElementById('music-file-name');
        const files = [
            {src: 'https://workdrive.zohopublic.com.cn/external/b195777bd183e88ef3bd75123f5952b6643973ff83f5c3040caaafcf9c042efe/download?directDownload=true', name: '夜间模拟语音1'},
            {src: 'https://workdrive.zohopublic.com.cn/external/d2c631696be70a3eda4037f3faa70f9013b416d7b64d3a5b66ce2de0070a0480/download?directDownload=true', name: '夜间模拟语音2'},
            {src: 'https://workdrive.zohopublic.com.cn/external/da7d9d62f4214f6fc84e44873e35bf8b90543744574e99aa5661dde5f9481621/download?directDownload=true', name: '夜间模拟语音3'},
            {src: 'https://workdrive.zohopublic.com.cn/external/833e30af12e80c422d9fb2fd96e596d5f5c6d6517453f9a87dd8e5c6b069d738/download?directDownload=true', name: '夜间模拟语音4'},
            {src: 'https://workdrive.zohopublic.com.cn/external/9a91fe1f0fcbf4e3443622a0a4b5e6844bdf7c6c1ebb9ed8ee9892dd6726385b/download?directDownload=true', name: '夜间模拟语音5'}
        ];
        let idx = 0;
        let isPlaying = false;

        function updatePlayer(autoPlay = false) {
            audio.src = files[idx].src;
            fileName.textContent = files[idx].name;
            playBtn.innerHTML = `<i class="fa fa-play"></i>`;
            isPlaying = false;
            audio.pause();
            audio.currentTime = 0;
            if (autoPlay) {
                audio.play();
                playBtn.innerHTML = `<i class="fa fa-pause"></i>`;
                isPlaying = true;
            }
        }

        musicBtn.onclick = (e) => {
            e.stopPropagation();
            if (popup.style.display === 'none' || popup.style.display === '') {
                popup.style.display = 'flex';
                updatePlayer();
            } else {
                popup.style.display = 'none';
                audio.pause();
                playBtn.innerHTML = `<i class="fa fa-play"></i>`;
                isPlaying = false;
            }
        };

        playBtn.onclick = (e) => {
            e.stopPropagation();
            if (isPlaying) {
                audio.pause();
                playBtn.innerHTML = `<i class="fa fa-play"></i>`;
                isPlaying = false;
            } else {
                audio.play();
                playBtn.innerHTML = `<i class="fa fa-pause"></i>`;
                isPlaying = true;
            }
        };

        prevBtn.onclick = (e) => {
            e.stopPropagation();
            idx = (idx - 1 + files.length) % files.length;
            updatePlayer(isPlaying);
        };

        nextBtn.onclick = (e) => {
            e.stopPropagation();
            idx = (idx + 1) % files.length;
            updatePlayer(isPlaying);
        };

        audio.onended = () => {
            playBtn.innerHTML = `<i class="fa fa-play"></i>`;
            isPlaying = false;
        };
    })();

    // 初始化页面
    function init() {
        bindCarouselDrag();
        // 视源切换
        dom.switchSrcBtns.forEach(btn => {
            $on(btn, 'click', function (e) {
                e.stopPropagation();
                const lineIndex = parseInt(this.closest('.video-btn').getAttribute('data-index'));
                switchVideo(lineIndex, true);
            });
        });
        // 线路按钮切换
        dom.videoBtns.forEach((btn, idx) => {
            $on(btn, 'click', () => switchVideo(idx, false));
        });
        // 按钮区域
        $on(dom.tipsBtn, 'click', () => showBox(dom.tipsBox) && updateTips());
        $on(dom.notesBtn, 'click', () => showBox(dom.notesBox) && updateNotesList());
        $on(dom.videoDescBtn, 'click', () => showBox(dom.videoDescBox) && updateVideoDesc());
        $on(dom.downloadBtn, 'click', () => {
            dom.downloadModal.classList.add('visible');
            setTimeout(() => dom.downloadModal.classList.remove('visible'), 1000);
        });
        $on(dom.addNoteBtn, 'click', addNote);
        $on(dom.noteText, 'keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); }
        });
        // 轮播图按钮
        $on(dom.prevBtn, 'click', () => {
            if (!isPinned) { currentSlide = (currentSlide - 1 + dom.carouselSlides.length) % dom.carouselSlides.length; updateCarousel(); }
        });
        $on(dom.nextBtn, 'click', () => {
            if (!isPinned) { currentSlide = (currentSlide + 1) % dom.carouselSlides.length; updateCarousel(); }
        });
        dom.indicators.forEach(indicator => {
            $on(indicator, 'click', () => {
                if (!isPinned) { currentSlide = parseInt(indicator.getAttribute('data-index')); updateCarousel(); }
            });
        });
        // 固定轮播图
        $on(dom.pinButton, 'click', () => {
            isPinned = !isPinned;
            dom.pinButton.classList.toggle('pinned', isPinned);
            isPinned ? clearInterval(carouselInterval) : startCarouselInterval();
        });
        // 图片弹窗
        $on(dom.popupImgBtnFixed, 'click', () => {
            const img = dom.carouselSlides[currentSlide].querySelector('img');
            dom.popupImg.src = img.src;
            dom.popupImg.alt = img.alt;
            dom.imgPopupModal.classList.add('visible');
        });
        $on(dom.closeImgPopup, 'click', () => dom.imgPopupModal.classList.remove('visible'));
        $on(dom.imgPopupModal, 'click', e => {
            if (e.target === dom.imgPopupModal) dom.imgPopupModal.classList.remove('visible');
        });
        // 地址复制
        $on(dom.copyAddressBtn, 'click', function () {
            const addressText = dom.addressText.textContent;
            navigator.clipboard.writeText(addressText).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fa fa-check"></i> 已复制';
                setTimeout(() => { this.innerHTML = originalText; }, 2000);
            });
        });
        // 基础提示展开/收纳（事件委托）
        $on(dom.basicTipsContent, 'click', function (e) {
            const toggle = e.target.closest('.exam-process-toggle');
            if (!toggle) return;
            const container = toggle.closest('.basic-tip-item');
            const content = container.querySelector('.exam-process-content');
            const icon = container.querySelector('.toggle-icon');
            content.classList.toggle('expanded');
            icon.classList.toggle('fa-angle-double-down', !content.classList.contains('expanded'));
            icon.classList.toggle('fa-angle-double-up', content.classList.contains('expanded'));
        });

        // 精简驾校版折叠卡片展开/收纳
        const schoolSummaryToggle = document.querySelector('#school-summary-toggle .exam-process-toggle');
        const schoolSummaryContent = document.getElementById('school-summary-content');
        const schoolSummaryIcon = document.querySelector('#school-summary-toggle .toggle-icon');
        schoolSummaryContent.classList.remove('expanded');
        schoolSummaryToggle.onclick = function () {
            schoolSummaryContent.classList.toggle('expanded');
            schoolSummaryIcon.classList.toggle('fa-angle-double-down', !schoolSummaryContent.classList.contains('expanded'));
            schoolSummaryIcon.classList.toggle('fa-angle-double-up', schoolSummaryContent.classList.contains('expanded'));
        };

        // 车载按钮·视频说明折叠卡片展开/收纳
        const carBtnDescToggle = document.querySelector('#car-btn-desc-toggle .exam-process-toggle');
        const carBtnDescContent = document.getElementById('car-btn-desc-content');
        const carBtnDescIcon = document.querySelector('#car-btn-desc-toggle .toggle-icon');
        carBtnDescContent.classList.remove('expanded');
        carBtnDescToggle.onclick = function () {
            carBtnDescContent.classList.toggle('expanded');
            carBtnDescIcon.classList.toggle('fa-angle-double-down', !carBtnDescContent.classList.contains('expanded'));
            carBtnDescIcon.classList.toggle('fa-angle-double-up', carBtnDescContent.classList.contains('expanded'));
        };

        // 车载按钮视频说明独立播放器逻辑
        const carBtnPlayer = new Plyr('#car-btn-player', {
            controls: [
                'play-large', 'play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration',
                'mute', 'volume', 'captions', 'settings', 'speed', 'fullscreen'
            ],
            settings: ['captions', 'quality', 'speed', 'loop'],
            autoplay: false,
            muted: false,
            i18n: {
                restart: '重新开始',
                rewind: '快退{seektime}秒',
                play: '播放',
                pause: '暂停',
                fastForward: '快进{seektime}秒',
                seek: '查找',
                seekLabel: '{currentTime} / {duration}',
                played: '已播放',
                buffered: '已缓冲',
                currentTime: '当前时间',
                duration: '总时长',
                volume: '音量',
                mute: '静音',
                unmute: '取消静音',
                enableCaptions: '开启字幕',
                disableCaptions: '关闭字幕',
                download: '下载',
                enterFullscreen: '全屏',
                exitFullscreen: '退出全屏',
                frameTitle: '播放器',
                captions: '字幕',
                settings: '设置',
                menuBack: '返回上一级菜单',
                speed: '速度',
                normal: '正常',
                quality: '质量',
                loop: '循环',
                start: '开始',
                end: '结束',
                all: '全部',
                reset: '重置',
                disabled: '禁用',
                enabled: '启用',
                advertisement: '广告',
                qualityBadge: {
                    2160: '4K',
                    1440: 'HD',
                    1080: 'HD',
                    720: 'HD',
                    576: 'SD',
                    480: 'SD',
                }
            }
        });
        const carBtnVideoContainer = document.getElementById('car-btn-video-container');
        const carBtnIframeContainer = document.getElementById('car-btn-iframe-container');
        const carBtnSrcIframe = document.getElementById('car-btn-src-iframe');
        const carBtnOnlineBtn = document.getElementById('carBtnOnlineBtn');
        const carBtnStreamBtn = document.getElementById('carBtnStreamBtn');
        carBtnVideoContainer.style.display = 'block';
        carBtnIframeContainer.style.display = 'none';
        carBtnSrcIframe.src = '';
        carBtnOnlineBtn.onclick = function(e) {
            e.stopPropagation();
            carBtnPlayer.pause();
            carBtnPlayer.currentTime = 0;
            carBtnPlayer.stop && carBtnPlayer.stop();
            carBtnVideoContainer.style.display = 'block';
            carBtnIframeContainer.style.display = 'none';
            carBtnSrcIframe.src = '';
        };
        carBtnStreamBtn.onclick = function(e) {
            e.stopPropagation();
            carBtnPlayer.pause();
            carBtnPlayer.currentTime = 0;
            carBtnPlayer.stop && carBtnPlayer.stop();
            carBtnVideoContainer.style.display = 'none';
            carBtnIframeContainer.style.display = 'block';
            carBtnSrcIframe.src = 'https://workdrive.zohopublic.com.cn/embed/kpgnr04aee3f766b142b3a8b137ef7ca90217?toolbar=false&appearance=light&themecolor=green';
        };
    }

    // 删除线样式
    (() => {
        const style = document.createElement('style');
        style.innerHTML = `.task-done { text-decoration: line-through; color: #aaa !important; }`;
        document.head.appendChild(style);
    })();

    document.addEventListener('DOMContentLoaded', init);
    init();
});
