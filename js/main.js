// main.js
document.addEventListener('DOMContentLoaded', function() {
    // 折叠功能实现
    const collapseBtn = document.getElementById('collapseBtn');
    const collapsibleContent = document.getElementById('collapsibleContent');
    const icon = collapseBtn.querySelector('i');
    
    collapseBtn.addEventListener('click', function() {
        collapsibleContent.classList.toggle('active');
        icon.classList.toggle('rotate-icon');
        
        // 更改按钮文本
        if (collapsibleContent.classList.contains('active')) {
            collapseBtn.innerHTML = '<i class="fa fa-chevron-down rotate-icon" aria-hidden="true"></i> 收起驾校列表';
        } else {
            collapseBtn.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i> 查看大同市驾校列表';
        }
    });
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (this.getAttribute('href') !== '#') {
                // 如果是实际链接则不阻止默认行为
                return true;
            }
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // 折叠面板功能（t.html部分整合）
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    document.querySelectorAll('.accordion-content').forEach(content => {
        const isOpen = content.getAttribute('data-open') === 'true';
        if (isOpen) {
            content.classList.add('active');
            content.previousElementSibling.querySelector('.accordion-icon').style.transform = 'rotate(180deg)';
        }
    });
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            content.classList.toggle('active');
            icon.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            content.setAttribute('data-open', content.classList.contains('active'));
        });
    });
    // 导航菜单激活状态
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.accordion');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        // 控制回到顶部按钮显示/隐藏
        const backToTopBtn = document.querySelector('.back-to-top');
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    if (this.classList.contains('nav-link')) {
                        const content = targetElement.querySelector('.accordion-content');
                        if (!content.classList.contains('active')) {
                            targetElement.querySelector('.accordion-header').click();
                        }
                    }
                }
            }
        });
    });
    // 表格行悬停效果增强
    const tableRows = document.querySelectorAll('table tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateZ(5px)';
            row.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            row.style.transition = 'all 0.3s ease';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateZ(0)';
            row.style.boxShadow = 'none';
        });
    });
    
    // 右下角按钮功能
    document.getElementById('topBtn').onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.getElementById('bottomBtn').onclick = function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    // 微信二维码弹窗（悬浮或点击均可显示，离开隐藏）
    const wxBtn = document.getElementById('wxBtn');
    const wxQrcodePopup = document.getElementById('wxQrcodePopup');
    let wxPopupTimer;
    function showWxPopup() {
        wxQrcodePopup.style.display = 'block';
    }
    function hideWxPopup() {
        wxQrcodePopup.style.display = 'none';
    }
    wxBtn.addEventListener('mouseenter', showWxPopup);
    wxBtn.addEventListener('mouseleave', function() {
        wxPopupTimer = setTimeout(hideWxPopup, 200);
    });
    wxQrcodePopup.addEventListener('mouseenter', function() {
        clearTimeout(wxPopupTimer);
    });
    wxQrcodePopup.addEventListener('mouseleave', hideWxPopup);
    wxBtn.addEventListener('click', function() {
        showWxPopup();
    });
});