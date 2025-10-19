document.addEventListener('DOMContentLoaded', function () {
	// 统一且更健壮的视频模态控制（事件委托，焦点恢复，键盘处理）
	const videoModal = document.getElementById('video-modal');
	const videoIframe = document.getElementById('video-iframe');
	const closeBtn = document.getElementById('close-video-modal');
	let lastTrigger = null;
	let modalActive = false;

	function isFocusable(el) {
		if (!el) return false;
		const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
		return el.matches && el.matches(focusableSelectors);
	}
	function getFocusableElements(root) {
		return Array.from(root.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'))
			.filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
	}

	function openVideoModal(src, trigger) {
		if (!videoModal || !videoIframe) return;
		lastTrigger = trigger || null;
		// 如果传入相对页面并且需要自动播放，可由调用方在 data-video 中带上 autoplay 参数
		videoIframe.src = src || '';
		videoModal.classList.add('active');
		videoModal.setAttribute('aria-hidden', 'false');
		videoIframe.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		modalActive = true;
		// 将焦点移到关闭按钮，启用焦点陷阱
		if (closeBtn) closeBtn.focus();
		// 初次打开立即调整尺寸，并在窗口缩放时继续调整
		adjustVideoModalSize();
		window.addEventListener('resize', adjustVideoModalSize, { passive: true });
	}

	function closeVideoModal() {
		if (!videoModal || !videoIframe) return;
		videoModal.classList.remove('active');
		videoModal.setAttribute('aria-hidden', 'true');
		videoIframe.setAttribute('aria-hidden', 'true');
		// 清空 iframe.src，确保视频、音频停止（适用于 iframe 嵌入视频）
		videoIframe.src = '';
		document.body.style.overflow = '';
		modalActive = false;
		// 恢复触发元素的焦点
		try { if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus(); } catch (e) {}
		lastTrigger = null;
		// 移除 resize 监听
		window.removeEventListener('resize', adjustVideoModalSize);
	}

	/* 新增：根据视口调整模态尺寸（主要是为了在不支持 aspect-ratio 的浏览器也能有合适效果） */
	function adjustVideoModalSize() {
		try {
			const modalContent = videoModal ? videoModal.querySelector('.video-modal-content') : null;
			if (!modalContent) return;
			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
			// prefer width up to 1200px, but keep margins
			const maxWidth = Math.min(1200, Math.round(vw * 0.96));
			const maxHeight = Math.round(vh * 0.9);
			// target 16:9
			const targetHeight = Math.min(Math.round(maxWidth * 9 / 16), maxHeight);
			// apply computed size (uses inline styles as override)
			modalContent.style.width = Math.max(320, maxWidth) + 'px';
			modalContent.style.height = targetHeight + 'px';
			// Ensure iframe fills it
			if (videoIframe) {
				videoIframe.style.width = '100%';
				videoIframe.style.height = '100%';
			}
		} catch (e) {
			// ignore sizing errors
		}
	}

	// 事件委托：任何带 data-video 的元素（.video-link）都能触发
	document.body.addEventListener('click', function (e) {
		const link = e.target.closest && e.target.closest('.video-link');
		if (!link) return;
		e.preventDefault();
		e.stopPropagation();
		const src = link.getAttribute('data-video');
		if (src) {
			openVideoModal(src, link);
		}
	});

	// 关闭按钮
	if (closeBtn) {
		closeBtn.addEventListener('click', function (e) {
			e.preventDefault();
			closeVideoModal();
		});
	}

	// 点击遮罩空白处关闭（点击 modal 背景）
	if (videoModal) {
		videoModal.addEventListener('click', function (e) {
			if (e.target === videoModal) {
				closeVideoModal();
			}
		});
	}

	// 键盘处理：ESC 关闭；Tab 限制在模态内（焦点陷阱）
	document.addEventListener('keydown', function (e) {
		if (!modalActive) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			closeVideoModal();
			return;
		}
		if (e.key === 'Tab') {
			// 焦点陷阱：循环焦点在模态内元素
			const focusable = getFocusableElements(videoModal);
			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;
			if (e.shiftKey) {
				if (active === first || active === videoModal) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (active === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
	});
});
