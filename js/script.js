document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const sections = document.querySelectorAll('.section');
    const dots = document.querySelectorAll('.dot');
    const scrollContainer = document.querySelector('.scroll-container');
    const soundToggle = document.querySelector('.sound-toggle');
    const progressBars = document.querySelectorAll('.progress-bar');
    const counterElement = document.getElementById('counter');
    
    // 自定义光标元素
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    // 菜单元素
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // 3D元素
    const pillContainer = document.getElementById('pill-model');
    const particlesContainer = document.getElementById('particles');
    
    // 变量
    let currentSection = 0;
    let isScrolling = false;
    let soundEnabled = false;
    let answers = {};
    let menuOpen = false;
    let resultsChart = null;
    let pillModel = null;
    let particles = [];
    let landingPageActive = true; // 新增: 标记着陆页是否处于活动状态
    
    // 添加部分完成状态跟踪
    let sectionCompletionStatus = {};
    
    // 检查部分是否已完成
    function checkSectionCompletion(sectionId) {
        // 如果已经记录为完成，直接返回true
        if (sectionCompletionStatus[sectionId]) {
            return true;
        }
        
        // 根据部分ID检查完成状态
        switch (sectionId) {
            case 'exercise':
                // 检查是否选择了运动选项
                return answers['exercise'] !== undefined;
                
            case 'diet':
                // 检查是否至少选择了一种食物
                return answers['diet'] && answers['diet'].length > 0;
                
            case 'sleep':
                // 检查是否设置了睡眠时间和质量
                return answers['sleep'] && answers['sleep'].time && answers['sleep'].quality;
                
            case 'stress':
                // 检查是否完成了压力测试
                return answers['stress'] !== undefined;
                
            case 'quiz1':
                // 检查是否回答了问题1
                return answers['quiz1'] !== undefined;
                
            case 'quiz2':
                // 检查是否回答了问题2
                return answers['quiz2'] !== undefined;
                
            case 'life-scenario':
                // 检查是否选择了生活场景
                return answers['life-scenario'] !== undefined;
                
            case 'lifestyle':
                // 检查是否选择了生活方式
                return answers['lifestyle'] !== undefined;
                
            case 'family-history':
                // 检查是否选择了家族病史
                return answers['family-history'] && answers['family-history'].length > 0;
                
            case 'symptoms':
                // 检查是否选择了症状
                return answers['symptoms'] && answers['symptoms'].length > 0;
                
            case 'bmi':
                // 检查是否选择了BMI范围
                return answers['bmi'] !== undefined;
                
            case 'heart-challenge':
                // 检查是否完成了心跳挑战
                return answers['heart-challenge'] !== undefined;
                
            case 'welcome':
            case 'assessment-intro':
            case 'processing':
            case 'results':
                // 欢迎、介绍、处理和结果页不需要完成操作
                return true;
                
            default:
                return false;
        }
    }
    
    // 显示完成消息
    function showCompletionMessage(section) {
        // 创建或获取消息元素
        let completionMessage = document.querySelector('.completion-message');
        if (!completionMessage) {
            completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            document.body.appendChild(completionMessage);
        }
        
        // 设置消息内容
        let sectionName = "";
        if (section) {
            // 尝试从section标题获取名称
            const title = section.querySelector('.section-title');
            if (title) {
                sectionName = title.textContent;
            } else {
                // 使用ID作为后备
                sectionName = section.id.replace(/-/g, ' ');
                // 首字母大写
                sectionName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
            }
        }
        
        completionMessage.textContent = `${sectionName || '题目'}完成！点击按钮继续`;
        
        // 显示消息
        completionMessage.classList.add('show');
        
        // 3秒后隐藏消息
        setTimeout(() => {
            completionMessage.classList.remove('show');
        }, 3000);
    }
    
    // 更新按钮状态
    function updateButtonStatus(section) {
        if (!section) return;
        
        const sectionId = section.id;
        const continueButton = section.querySelector('.thin-button');
        
        if (!continueButton) return;
        
        const isCompleted = checkSectionCompletion(sectionId);
        const wasCompletedBefore = sectionCompletionStatus[sectionId];
        
        if (isCompleted) {
            continueButton.classList.remove('disabled');
            continueButton.removeAttribute('disabled');
            
            // 如果这是首次完成
            if (!wasCompletedBefore) {
                // 标记为已完成
                sectionCompletionStatus[sectionId] = true;
                
                // 添加完成标记到部分
                section.classList.add('completed');
                
                // 添加完成动画到按钮
                continueButton.classList.add('completed');
                setTimeout(() => {
                    continueButton.classList.remove('completed');
                }, 1000);
                
                // 显示完成消息
                showCompletionMessage(section);
            }
        } else {
            continueButton.classList.add('disabled');
            continueButton.setAttribute('disabled', 'disabled');
            
            // 移除完成标记
            section.classList.remove('completed');
        }
    }
    
    // 初始化
    init();
    
    function init() {
        // 设置初始活动部分
        updateActiveSection(0);
        
        // 添加事件监听器
        scrollContainer.addEventListener('scroll', handleScroll);
        soundToggle.addEventListener('click', toggleSound);
        
        // 检查背景音乐状态
        checkBgmStatus();
        
        // 监听着陆页完成事件
        document.addEventListener('landingCompleted', () => {
            landingPageActive = false;
            updateActiveSection(0);
        });
        
        // 添加表单监听器
        setupFormInputs();
        
        // 设置按钮
        setupButtons();
        
        // 设置自定义光标
        setupCustomCursor();
        
        // 设置菜单
        setupMenu();
        
        // 设置动态背景
        setupDynamicBackground();
        
        // 设置3D药丸模型
        setup3DPill();
        
        // 设置粒子效果
        setupParticles();
        
        // 开始加载动画
        animateCounter();
        
        // 模拟加载
        simulateLoading();
        
        // 为所有部分添加完成指示器
        addCompletionIndicators();
        
        // 为所有部分添加继续提示
        addContinueHints();
    }
    
    // 为所有部分添加完成指示器
    function addCompletionIndicators() {
        document.querySelectorAll('.section').forEach(section => {
            // 跳过不需要完成的部分
            const skipSections = ['welcome', 'assessment-intro', 'processing', 'results'];
            if (skipSections.includes(section.id)) return;
            
            // 添加完成指示器
            const completionIndicator = document.createElement('div');
            completionIndicator.className = 'section-completion';
            completionIndicator.innerHTML = '<i class="fas fa-check-circle"></i> 已完成';
            section.appendChild(completionIndicator);
        });
    }
    
    // 为所有部分添加继续提示
    function addContinueHints() {
        document.querySelectorAll('.section .thin-button').forEach(button => {
            const section = button.closest('.section');
            
            // 创建继续提示
            const continueHint = document.createElement('div');
            continueHint.className = 'continue-hint';
            continueHint.textContent = '完成当前题目后继续';
            
            // 将提示添加到按钮之后
            button.parentNode.insertBefore(continueHint, button.nextSibling);
        });
    }
    
    // 检查背景音乐状态
    function checkBgmStatus() {
        const bgm = document.getElementById('bgm');
        if (bgm) {
            // 音频初始状态为静音（浏览器策略）
            soundEnabled = false;
            soundToggle.innerHTML = '<span>声音</span>';
            soundToggle.classList.remove('active');
        }
    }
    
    // 加载动画的计数器
    function animateCounter() {
        let count = 0;
        const duration = 3000; // 与CSS中的progress动画持续时间一致
        const increment = 1;
        const interval = duration / 100; // 将总时间分为100份
        
        const counterInterval = setInterval(() => {
            count += increment;
            if (counterElement) {
                counterElement.textContent = Math.min(count, 100);
            }
            if (count >= 100) {
                clearInterval(counterInterval);
            }
        }, interval);
    }
    
    // 自定义光标设置
    function setupCustomCursor() {
        // 检测是否为触摸设备
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        
        // 如果是触摸设备，隐藏自定义光标
        if (isTouchDevice) {
            const cursorElements = document.querySelectorAll('.custom-cursor, .custom-cursor-follower');
            cursorElements.forEach(el => {
                el.style.display = 'none';
            });
            return;
        }
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // 鼠标跟随器有轻微延迟，使用GSAP创建平滑跟随效果
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });
        
        // 当鼠标悬停在可点击元素上时改变光标样式
        const clickableElements = document.querySelectorAll('.thin-button, .option, .dot, .sound-toggle, .menu-toggle, .menu-item, .landing-btn, .landing-nav-btn');
        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
    
    // 设置菜单
    function setupMenu() {
        menuToggle.addEventListener('click', toggleMenu);
        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                toggleMenu();
                // 可以添加导航到特定部分的逻辑
            });
        });
    }
    
    // 切换菜单状态
    function toggleMenu() {
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        } else {
            menu.classList.remove('active');
            document.body.style.overflow = ''; // 恢复滚动
        }
    }
    
    // 设置动态背景
    function setupDynamicBackground() {
        const lineBackground = document.querySelector('.line-background');
        const canvas = document.createElement('canvas');
        lineBackground.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // 设置画布大小
        canvas.width = width;
        canvas.height = height;
        
        // 在窗口大小改变时更新画布大小
        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });
        
        // 创建动态线条
        const lines = [];
        const lineCount = 5;
        
        for (let i = 0; i < lineCount; i++) {
            lines.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: Math.random() * 50 + 150,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                thickness: Math.random() * 1 + 0.5
            });
        }
        
        // 动画循环
        function animate() {
            // 清除画布
            ctx.clearRect(0, 0, width, height);
            
            // 绘制每条线
            ctx.strokeStyle = 'rgba(93, 71, 119, 0.1)';
            
            for (let i = 0; i < lineCount; i++) {
                const line = lines[i];
                
                // 更新线条角度
                line.angle += line.speed;
                
                // 计算线条端点
                const startX = line.x;
                const startY = line.y;
                const endX = startX + Math.cos(line.angle) * line.length;
                const endY = startY + Math.sin(line.angle) * line.length;
                
                // 绘制线条
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineWidth = line.thickness;
                ctx.stroke();
                
                // 如果线条超出屏幕，重新定位
                if (endX < 0 || endX > width || endY < 0 || endY > height) {
                    line.x = Math.random() * width;
                    line.y = Math.random() * height;
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    function handleScroll() {
        if (isScrolling || landingPageActive) return;
        
        // 节流滚动事件
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
            
            // 计算哪个部分在视图中
            const scrollPosition = scrollContainer.scrollTop;
            const windowHeight = window.innerHeight;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (
                    scrollPosition >= sectionTop - windowHeight / 3 &&
                    scrollPosition < sectionTop + sectionHeight - windowHeight / 3
                ) {
                    updateActiveSection(index);
                }
            });
            
            // 为活动部分应用视差效果
            applyParallaxEffect();
            
        }, 100);
    }
    
    function updateActiveSection(index) {
        if (landingPageActive) return; // 如果着陆页活动，不更新部分
        
        currentSection = index;
        
        // 更新点指示器
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 更新部分可见性
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
            } else if (Math.abs(i - index) > 1) {
                section.classList.remove('active');
            }
        });
        
        // 如果是结果部分，不需要经过处理部分
        if (sections[index] && sections[index].id === 'results') {
            // 已经通过calculateResults计算了结果，无需额外处理
            return;
        }
        
        // 如果我们在处理部分，启动进度动画
        if (sections[index] && sections[index].id === 'processing') {
            setTimeout(() => {
                // 模拟处理时间然后自动滚动到结果
                simulateProcessing();
            }, 1000);
        }
    }
    
    function applyParallaxEffect() {
        const activeSection = sections[currentSection];
        if (!activeSection) return;
        
        const scrollPosition = scrollContainer.scrollTop;
        const sectionTop = activeSection.offsetTop;
        const relativeScroll = scrollPosition - sectionTop;
        
        // 为活动部分中的元素应用视差效果
        const titles = activeSection.querySelectorAll('h1, h2');
        const paragraphs = activeSection.querySelectorAll('p');
        const shapes = activeSection.querySelectorAll('.shape');
        
        titles.forEach(title => {
            title.style.transform = `translateY(${relativeScroll * 0.2}px)`;
        });
        
        paragraphs.forEach(paragraph => {
            paragraph.style.transform = `translateY(${relativeScroll * 0.1}px)`;
        });
        
        shapes.forEach((shape, index) => {
            if (index === 0) {
                shape.style.transform = `translate(${relativeScroll * -0.05}px, ${relativeScroll * 0.1}px)`;
            } else {
                shape.style.transform = `translate(${relativeScroll * 0.05}px, ${relativeScroll * -0.1}px)`;
            }
        });
    }
    
    function toggleSound() {
        soundEnabled = !soundEnabled;
        
        const bgm = document.getElementById('bgm');
        
        // 切换声音图标/文本
        if (soundEnabled) {
            soundToggle.innerHTML = '<span>声音开启</span>';
            soundToggle.classList.add('active');
            // 如果启用，播放背景音乐
            if (bgm) {
                bgm.muted = false; // 取消静音
            }
            playBackgroundMusic();
        } else {
            soundToggle.innerHTML = '<span>声音</span>';
            soundToggle.classList.remove('active');
            // 停止背景音乐
            if (bgm) {
                bgm.muted = true; // 静音
            }
            stopBackgroundMusic();
        }
    }
    
    // 播放背景音乐
    function playBackgroundMusic() {
        const bgm = document.getElementById('bgm');
        if (bgm) {
            bgm.volume = 0.5; // 设置音量为50%
            bgm.play().catch(error => {
                console.log('背景音乐播放失败:', error);
            });
        }
    }
    
    // 停止背景音乐
    function stopBackgroundMusic() {
        const bgm = document.getElementById('bgm');
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0; // 重置到开始位置
        }
    }
    
    function setupFormInputs() {
        // 图形选项
        const graphicOptions = document.querySelectorAll('.graphic-option');
        graphicOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 清除同组的其他选择
                const parentContainer = option.closest('.graphic-options');
                if (parentContainer) {
                    parentContainer.querySelectorAll('.graphic-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                }
                
                // 设置为选中
                option.classList.add('selected');
                
                // 记录答案
                const value = option.getAttribute('data-value');
                const sectionId = option.closest('.section').id;
                answers[sectionId] = value;
                
                // 改变药丸颜色
                const pillId = `${sectionId}-pill`;
                const pillElement = document.getElementById(pillId);
                if (pillElement) {
                    // 根据选择设置药丸颜色
                    updatePillColor(pillElement, value);
                }
                
                // 更新按钮状态
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 拖拽食物
        setupDragDropFood();
        
        // 睡眠评估滑块
        setupSleepSliders();
        
        // 压力评估
        setupStressPill();
        
        // 场景选择
        const scenarioOptions = document.querySelectorAll('.scenario-option');
        scenarioOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 清除其他选择
                const parentContainer = option.closest('.scenario-container');
                if (parentContainer) {
                    parentContainer.querySelectorAll('.scenario-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                }
                
                // 设置为选中
                option.classList.add('selected');
                
                // 记录答案
                const value = option.getAttribute('data-value');
                const sectionId = option.closest('.section').id;
                answers[sectionId] = value;
                
                // 改变药丸颜色
                const pillId = `scenario-pill`;
                const pillElement = document.getElementById(pillId);
                if (pillElement) {
                    updatePillColor(pillElement, value);
                }
                
                // 更新按钮状态
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 家族病史
        const familyHistoryOptions = document.querySelectorAll('#family-history input[type="checkbox"]');
        familyHistoryOptions.forEach(option => {
            option.addEventListener('change', () => {
                // 记录所有选中的选项
                const selectedOptions = Array.from(familyHistoryOptions)
                    .filter(opt => opt.checked)
                    .map(opt => opt.value);
                
                answers['family-history'] = selectedOptions;
                
                // 更新家族树可视化
                updateFamilyTree(selectedOptions);
                
                // 更新按钮状态
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 症状自测
        const symptomOptions = document.querySelectorAll('#symptoms input[type="checkbox"]');
        symptomOptions.forEach(option => {
            option.addEventListener('change', () => {
                // 记录所有选中的选项
                const selectedOptions = Array.from(symptomOptions)
                    .filter(opt => opt.checked)
                    .map(opt => opt.value);
                
                answers['symptoms'] = selectedOptions;
                
                // 更新身体地图
                updateBodyMap(selectedOptions);
                
                // 如果选择了"没有症状"，取消其他选择
                if (option.value === '7' && option.checked) {
                    symptomOptions.forEach(opt => {
                        if (opt.value !== '7') {
                            opt.checked = false;
                        }
                    });
                } else if (option.value !== '7' && option.checked) {
                    // 如果选择了其他选项，取消"没有症状"
                    const noSymptomsOption = document.getElementById('symptom-7');
                    if (noSymptomsOption) {
                        noSymptomsOption.checked = false;
                    }
                }
                
                // 更新按钮状态
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 心跳挑战
        setupHeartChallenge();
        
        // BMI选项事件处理
        const bmiOptions = document.querySelectorAll('input[name="bmi"]');
        const viewResultsButton = document.querySelector('.view-results-button');
        
        bmiOptions.forEach(option => {
            option.addEventListener('change', () => {
                // 记录答案
                answers['bmi'] = option.value;
                
                // 启用查看结果按钮
                if (viewResultsButton) {
                    viewResultsButton.classList.remove('disabled');
                    viewResultsButton.removeAttribute('disabled');
                }
                
                // 更新按钮状态
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 查看结果按钮点击事件
        if (viewResultsButton) {
            viewResultsButton.addEventListener('click', () => {
                if (!viewResultsButton.classList.contains('disabled')) {
                    // 计算结果
                    calculateResults();
                    
                    // 找到结果页面
                    const resultsSection = document.getElementById('results');
                    if (resultsSection) {
                        // 激活结果页面
                        resultsSection.classList.add('active');
                        
                        // 滚动到结果页面
                        resultsSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // 更新当前部分索引
                        const resultsSectionIndex = Array.from(sections).findIndex(s => s.id === 'results');
                        if (resultsSectionIndex !== -1) {
                            updateActiveSection(resultsSectionIndex);
                        }
                    }
                }
            });
            
            // 添加触摸事件支持
            viewResultsButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!viewResultsButton.classList.contains('disabled')) {
                    viewResultsButton.click();
                }
            });
        }
    }
    
    // 设置拖拽食物功能
    function setupDragDropFood() {
        const foodItems = document.querySelectorAll('.food-item');
        const plate = document.getElementById('food-plate');
        const plateItems = document.getElementById('plate-items');
        
        if (!foodItems.length || !plate || !plateItems) return;
        
        let selectedFoods = [];
        let touchDragging = false;
        let currentDragItem = null;
        let initialTouchPos = { x: 0, y: 0 };
        let dragItemOffset = { x: 0, y: 0 };
        
        // 为每个食物项添加拖拽事件
        foodItems.forEach(item => {
            // 桌面端拖拽
            item.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-value'));
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            
            // 触摸设备拖拽
            item.addEventListener('touchstart', e => {
                touchDragging = true;
                currentDragItem = item;
                const touch = e.touches[0];
                initialTouchPos.x = touch.clientX;
                initialTouchPos.y = touch.clientY;
                
                // 获取元素相对于触摸点的偏移量
                const rect = item.getBoundingClientRect();
                dragItemOffset.x = touch.clientX - rect.left;
                dragItemOffset.y = touch.clientY - rect.top;
                
                // 创建克隆元素用于拖拽显示
                const clone = item.cloneNode(true);
                clone.id = "drag-clone";
                clone.style.position = "fixed";
                clone.style.left = (touch.clientX - dragItemOffset.x) + "px";
                clone.style.top = (touch.clientY - dragItemOffset.y) + "px";
                clone.style.opacity = "0.8";
                clone.style.zIndex = "1000";
                document.body.appendChild(clone);
                
                item.classList.add('dragging');
                e.preventDefault(); // 防止滚动和其他默认行为
            });
        });
        
        // 处理触摸移动
        document.addEventListener('touchmove', e => {
            if (!touchDragging || !currentDragItem) return;
            
            const touch = e.touches[0];
            const clone = document.getElementById("drag-clone");
            
            if (clone) {
                clone.style.left = (touch.clientX - dragItemOffset.x) + "px";
                clone.style.top = (touch.clientY - dragItemOffset.y) + "px";
            }
            
            // 检查是否在盘子上方
            const plateRect = plate.getBoundingClientRect();
            if (touch.clientX >= plateRect.left && touch.clientX <= plateRect.right &&
                touch.clientY >= plateRect.top && touch.clientY <= plateRect.bottom) {
                plate.classList.add('drag-over');
            } else {
                plate.classList.remove('drag-over');
            }
            
            e.preventDefault(); // 防止页面滚动
        });
        
        // 处理触摸结束
        document.addEventListener('touchend', e => {
            if (!touchDragging || !currentDragItem) return;
            
            const clone = document.getElementById("drag-clone");
            if (clone) {
                document.body.removeChild(clone);
            }
            
            const touch = e.changedTouches[0];
            const plateRect = plate.getBoundingClientRect();
            
            // 检查是否在盘子上释放
            if (touch.clientX >= plateRect.left && touch.clientX <= plateRect.right &&
                touch.clientY >= plateRect.top && touch.clientY <= plateRect.bottom) {
                
                const foodValue = currentDragItem.getAttribute('data-value');
                
                // 检查是否已经添加过
                if (!selectedFoods.includes(foodValue)) {
                    // 添加到已选列表
                    selectedFoods.push(foodValue);
                    
                    // 创建食物元素在盘子中
                    const foodClone = document.createElement('div');
                    foodClone.className = 'plate-food';
                    foodClone.innerHTML = currentDragItem.querySelector('.food-icon').innerHTML;
                    foodClone.setAttribute('data-value', foodValue);
                    
                    // 随机位置
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 30 + 20;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    foodClone.style.transform = `translate(${x}px, ${y}px)`;
                    plateItems.appendChild(foodClone);
                    
                    // 添加点击移除功能
                    foodClone.addEventListener('click', () => {
                        plateItems.removeChild(foodClone);
                        selectedFoods = selectedFoods.filter(f => f !== foodValue);
                        
                        // 更新答案
                        answers['diet'] = selectedFoods;
                        
                        // 更新按钮状态
                        const section = currentDragItem.closest('.section');
                        if (section) {
                            updateButtonStatus(section);
                        }
                    });
                    
                    // 添加触摸移除功能
                    foodClone.addEventListener('touchend', (e) => {
                        e.preventDefault();
                        plateItems.removeChild(foodClone);
                        selectedFoods = selectedFoods.filter(f => f !== foodValue);
                        
                        // 更新答案
                        answers['diet'] = selectedFoods;
                        
                        // 更新按钮状态
                        const section = currentDragItem.closest('.section');
                        if (section) {
                            updateButtonStatus(section);
                        }
                    });
                    
                    // 记录答案
                    answers['diet'] = selectedFoods;
                    
                    // 更新药丸颜色
                    updatePillColor(document.getElementById('diet-pill'), selectedFoods.length);
                    
                    // 更新按钮状态
                    const section = currentDragItem.closest('.section');
                    if (section) {
                        updateButtonStatus(section);
                    }
                }
            }
            
            plate.classList.remove('drag-over');
            currentDragItem.classList.remove('dragging');
            touchDragging = false;
            currentDragItem = null;
        });
        
        // 桌面端接收拖放
        plate.addEventListener('dragover', e => {
            e.preventDefault();
            plate.classList.add('drag-over');
        });
        
        plate.addEventListener('dragleave', () => {
            plate.classList.remove('drag-over');
        });
        
        plate.addEventListener('drop', e => {
            e.preventDefault();
            plate.classList.remove('drag-over');
            
            const foodValue = e.dataTransfer.getData('text/plain');
            
            // 检查是否已经添加过
            if (selectedFoods.includes(foodValue)) return;
            
            // 添加到已选列表
            selectedFoods.push(foodValue);
            
            // 创建食物元素在盘子中
            const foodItem = document.querySelector(`.food-item[data-value="${foodValue}"]`);
            if (foodItem) {
                const foodClone = document.createElement('div');
                foodClone.className = 'plate-food';
                foodClone.innerHTML = foodItem.querySelector('.food-icon').innerHTML;
                foodClone.setAttribute('data-value', foodValue);
                
                // 随机位置
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 30 + 20;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                foodClone.style.transform = `translate(${x}px, ${y}px)`;
                plateItems.appendChild(foodClone);
                
                // 添加点击移除功能
                foodClone.addEventListener('click', () => {
                    plateItems.removeChild(foodClone);
                    selectedFoods = selectedFoods.filter(f => f !== foodValue);
                    
                    // 更新答案
                    answers['diet'] = selectedFoods;
                    
                    // 更新按钮状态
                    const section = foodItem.closest('.section');
                    if (section) {
                        updateButtonStatus(section);
                    }
                });
                
                // 添加触摸移除功能
                foodClone.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    plateItems.removeChild(foodClone);
                    selectedFoods = selectedFoods.filter(f => f !== foodValue);
                    
                    // 更新答案
                    answers['diet'] = selectedFoods;
                    
                    // 更新按钮状态
                    const section = foodItem.closest('.section');
                    if (section) {
                        updateButtonStatus(section);
                    }
                });
            }
            
            // 记录答案
            answers['diet'] = selectedFoods;
            
            // 更新药丸颜色
            updatePillColor(document.getElementById('diet-pill'), selectedFoods.length);
            
            // 更新按钮状态
            const section = document.getElementById('diet');
            if (section) {
                updateButtonStatus(section);
            }
        });
    }
    
    // 设置睡眠滑块
    function setupSleepSliders() {
        const sleepTimeSlider = document.getElementById('sleep-time');
        const sleepQualitySlider = document.getElementById('sleep-quality');
        const sleepTimeValue = document.getElementById('sleep-time-value');
        const sleepQualityText = document.getElementById('sleep-quality-text');
        const starsContainer = document.getElementById('stars-container');
        const moonPath = document.getElementById('moon-path');
        
        if (!sleepTimeSlider || !sleepQualitySlider) return;
        
        // 睡眠时间滑块
        sleepTimeSlider.addEventListener('input', () => {
            const hours = sleepTimeSlider.value;
            if (sleepTimeValue) sleepTimeValue.textContent = hours;
            
            // 记录答案
            if (!answers['sleep']) answers['sleep'] = {};
            answers['sleep'].time = hours;
            
            // 更新星星
            updateStars(hours, sleepQualitySlider.value);
            
            // 更新按钮状态
            const section = sleepTimeSlider.closest('.section');
            if (section) {
                updateButtonStatus(section);
            }
        });
        
        // 睡眠质量滑块
        sleepQualitySlider.addEventListener('input', () => {
            const quality = sleepQualitySlider.value;
            const qualityTexts = ['很差', '差', '一般', '好', '很好'];
            
            if (sleepQualityText) sleepQualityText.textContent = qualityTexts[quality - 1];
            
            // 记录答案
            if (!answers['sleep']) answers['sleep'] = {};
            answers['sleep'].quality = quality;
            
            // 更新月亮
            updateMoon(quality);
            
            // 更新星星
            updateStars(sleepTimeSlider.value, quality);
            
            // 更新按钮状态
            const section = sleepQualitySlider.closest('.section');
            if (section) {
                updateButtonStatus(section);
            }
        });
        
        // 初始化星星
        function updateStars(hours, quality) {
            if (!starsContainer) return;
            
            // 清除现有星星
            starsContainer.innerHTML = '';
            
            // 根据小时和质量生成星星
            const starCount = Math.floor(hours * quality / 3);
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // 随机位置和大小
                const size = Math.random() * 3 + 1;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${left}%`;
                star.style.top = `${top}%`;
                star.style.opacity = Math.random() * 0.5 + 0.2;
                star.style.animationDelay = `${Math.random() * 2}s`;
                
                starsContainer.appendChild(star);
            }
            
            // 更新药丸颜色
            updatePillColor(document.getElementById('sleep-pill'), Math.min(5, Math.floor((parseInt(hours) + parseInt(quality)) / 2)));
        }
        
        // 更新月亮
        function updateMoon(quality) {
            if (!moonPath) return;
            
            // 根据质量更改月亮颜色
            const alpha = 0.5 + (quality * 0.1);
            moonPath.setAttribute('fill', `rgba(154, 139, 165, ${alpha})`);
        }
        
        // 初始化视觉效果
        updateStars(sleepTimeSlider.value, sleepQualitySlider.value);
        updateMoon(sleepQualitySlider.value);
    }
    
    // 设置压力药丸交互
    function setupStressPill() {
        const stressPill = document.getElementById('stress-pill');
        const stressLevelFill = document.getElementById('stress-level-fill');
        const stressValue = document.getElementById('stress-value');
        const stressParticles = document.getElementById('stress-particles');
        
        if (!stressPill || !stressLevelFill || !stressValue) return;
        
        let pressStartTime = 0;
        let pressTimer = null;
        let stressLevel = 0;
        let particleElements = [];
        
        // 检测是否为触摸设备
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        
        // 长按事件 - 鼠标
        stressPill.addEventListener('mousedown', startPress);
        window.addEventListener('mouseup', endPress);
        
        // 长按事件 - 触摸
        stressPill.addEventListener('touchstart', handleTouchStart);
        stressPill.addEventListener('touchend', handleTouchEnd);
        stressPill.addEventListener('touchcancel', handleTouchEnd);
        
        function handleTouchStart(e) {
            e.preventDefault(); // 防止默认行为，如滚动
            startPress(e);
        }
        
        function handleTouchEnd(e) {
            e.preventDefault(); // 防止默认行为
            endPress();
        }
        
        function startPress(e) {
            if (e) e.preventDefault();
            pressStartTime = Date.now();
            
            // 开始计时器增加压力值
            pressTimer = setInterval(() => {
                stressLevel = Math.min(100, stressLevel + 2);
                updateStressUI();
                
                // 添加粒子
                if (stressLevel > 30 && stressParticles) {
                    createParticle();
                }
                
                // 挤压药丸效果
                stressPill.style.transform = `scale(${1 - stressLevel * 0.002}, ${1 + stressLevel * 0.001})`;
            }, 100);
        }
        
        function endPress() {
            if (pressTimer) {
                clearInterval(pressTimer);
                pressTimer = null;
                
                // 记录答案
                answers['stress'] = stressLevel;
                
                // 更新药丸颜色
                updatePillColor(document.getElementById('stress-indication-pill'), Math.ceil(stressLevel / 20));
                
                // 恢复药丸形状
                stressPill.style.transform = 'scale(1)';
                
                // 更新按钮状态
                const section = stressPill.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            }
        }
        
        function updateStressUI() {
            if (stressLevelFill) stressLevelFill.style.width = `${stressLevel}%`;
            if (stressValue) stressValue.textContent = `${stressLevel}%`;
        }
        
        function createParticle() {
            if (!stressParticles) return;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 随机位置和大小
            const size = Math.random() * 5 + 2;
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = `rgba(93, 71, 119, ${Math.random() * 0.5 + 0.2})`;
            particle.style.left = `50%`;
            particle.style.top = `50%`;
            particle.style.transform = `translate(-50%, -50%)`;
            
            stressParticles.appendChild(particle);
            
            // 动画
            gsap.to(particle, {
                x: x,
                y: y,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: "power2.out",
                onComplete: () => {
                    if (stressParticles.contains(particle)) {
                        stressParticles.removeChild(particle);
                    }
                }
            });
            
            particleElements.push(particle);
        }
    }
    
    // 设置心跳挑战
    function setupHeartChallenge() {
        const startButton = document.getElementById('start-challenge');
        const heartShape = document.querySelector('.heart-shape');
        const challengeTimer = document.getElementById('challenge-timer');
        const challengeFeedback = document.getElementById('challenge-feedback');
        const scoreValue = document.getElementById('challenge-score-value');
        const heartChallenge = document.getElementById('heart-challenge');
        
        if (!startButton || !heartShape || !challengeTimer || !heartChallenge) return;
        
        let isChallengePlaying = false;
        let challengeInterval = null;
        let timeLeft = 15;
        let beatPattern = [];
        let userClicks = [];
        let lastBeatTime = 0;
        
        // 触摸和点击事件处理
        const handleUserInteraction = () => {
            userHeartClick();
        };
        
        startButton.addEventListener('click', () => {
            if (isChallengePlaying) return;
            
            // 重置
            isChallengePlaying = true;
            timeLeft = 15;
            beatPattern = [];
            userClicks = [];
            
            // 更新UI
            startButton.textContent = '挑战中...';
            startButton.disabled = true;
            challengeTimer.textContent = timeLeft;
            
            // 生成心跳模式 (60-100 BPM)
            const bpm = Math.floor(Math.random() * 41) + 60;
            const interval = 60000 / bpm; // 毫秒
            
            // 开始心跳
            lastBeatTime = Date.now();
            challengeInterval = setInterval(() => {
                // 心跳动画
                heartBeat();
                
                // 记录心跳时间
                beatPattern.push(Date.now());
                
                // 更新倒计时
                timeLeft--;
                challengeTimer.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endChallenge();
                }
            }, interval);
            
            // 监听用户点击和触摸
            heartChallenge.addEventListener('click', handleUserInteraction);
            heartChallenge.addEventListener('touchend', (e) => {
                e.preventDefault(); // 防止点击事件也被触发
                handleUserInteraction();
            });
        });
        
        // 为开始按钮添加触摸支持
        startButton.addEventListener('touchend', (e) => {
            e.preventDefault(); // 防止点击事件也被触发
            startButton.click(); // 触发点击事件
        });
        
        function heartBeat() {
            heartShape.classList.add('pulse');
            setTimeout(() => {
                heartShape.classList.remove('pulse');
            }, 400);
        }
        
        function userHeartClick() {
            if (!isChallengePlaying) return;
            
            userClicks.push(Date.now());
            
            // 显示点击反馈
            const timeSinceLastBeat = Date.now() - lastBeatTime;
            const beatInterval = 60000 / 80; // 假设平均80BPM
            
            if (timeSinceLastBeat < beatInterval * 0.7) {
                challengeFeedback.textContent = '太早了!';
                challengeFeedback.style.color = '#FF5555';
            } else if (timeSinceLastBeat > beatInterval * 1.3) {
                challengeFeedback.textContent = '太晚了!';
                challengeFeedback.style.color = '#FF5555';
            } else {
                challengeFeedback.textContent = '很好!';
                challengeFeedback.style.color = '#55AA55';
            }
            
            // 淡出反馈
            setTimeout(() => {
                challengeFeedback.textContent = '';
            }, 500);
        }
        
        function endChallenge() {
            clearInterval(challengeInterval);
            isChallengePlaying = false;
            
            // 计算结果
            const score = calculateHeartScore(beatPattern, userClicks);
            
            // 更新UI
            startButton.textContent = '重新挑战';
            startButton.disabled = false;
            scoreValue.textContent = `${score}%`;
            
            // 记录答案
            answers['heart-challenge'] = score;
            
            // 更新药丸颜色
            updatePillColor(document.getElementById('challenge-pill'), Math.ceil(score / 20));
            
            // 移除事件监听器
            heartChallenge.removeEventListener('click', handleUserInteraction);
            heartChallenge.removeEventListener('touchend', handleUserInteraction);
            
            // 更新按钮状态
            const section = startButton.closest('.section');
            if (section) {
                updateButtonStatus(section);
            }
        }
        
        function calculateHeartScore(pattern, clicks) {
            if (pattern.length === 0 || clicks.length === 0) return 0;
            
            // 通过比较两个数组计算分数
            let totalDifference = 0;
            let matchedBeats = 0;
            
            for (let i = 0; i < pattern.length; i++) {
                const beatTime = pattern[i];
                
                // 找到最接近的用户点击
                let closestClick = null;
                let minDifference = Infinity;
                
                for (let j = 0; j < clicks.length; j++) {
                    const clickTime = clicks[j];
                    const difference = Math.abs(beatTime - clickTime);
                    
                    if (difference < minDifference && difference < 1000) { // 1秒内的点击才算
                        minDifference = difference;
                        closestClick = clickTime;
                    }
                }
                
                if (closestClick !== null) {
                    totalDifference += minDifference;
                    matchedBeats++;
                    
                    // 移除已匹配的点击，防止重复使用
                    clicks = clicks.filter(c => c !== closestClick);
                }
            }
            
            // 计算平均差异和匹配率
            const avgDifference = matchedBeats > 0 ? totalDifference / matchedBeats : 1000;
            const matchRate = matchedBeats / pattern.length;
            
            // 转换为百分比分数 (差异越小，匹配率越高，分数越高)
            let score = (1 - (avgDifference / 1000)) * 50 + matchRate * 50;
            score = Math.max(0, Math.min(100, Math.round(score)));
            
            return score;
        }
    }
    
    // 更新家族树可视化
    function updateFamilyTree(selectedOptions) {
        const grandparentNode = document.getElementById('node-grandparent');
        const parent1Node = document.getElementById('node-parent1');
        const parent2Node = document.getElementById('node-parent2');
        
        if (!grandparentNode || !parent1Node || !parent2Node) return;
        
        // 重置
        [grandparentNode, parent1Node, parent2Node].forEach(node => {
            node.classList.remove('active');
        });
        
        // 根据选择激活节点
        if (selectedOptions.length > 0 && selectedOptions[0] !== '6') { // 如果不是"没有问题"
            // 根据问题数量分配节点
            if (selectedOptions.length >= 3) {
                grandparentNode.classList.add('active');
                parent1Node.classList.add('active');
                parent2Node.classList.add('active');
            } else if (selectedOptions.length === 2) {
                parent1Node.classList.add('active');
                parent2Node.classList.add('active');
            } else {
                parent1Node.classList.add('active');
            }
        }
        
        // 更新药丸颜色
        if (selectedOptions.includes('6')) {
            // 没有问题 = 好
            updatePillColor(document.getElementById('family-pill'), 5);
        } else {
            // 问题越多越差
            const value = 5 - Math.min(4, selectedOptions.length);
            updatePillColor(document.getElementById('family-pill'), value);
        }
        
        // 更新按钮状态
        const section = document.getElementById('family-history');
        if (section) {
            updateButtonStatus(section);
        }
    }
    
    // 更新身体地图
    function updateBodyMap(selectedOptions) {
        const heartPart = document.getElementById('body-part-heart');
        
        if (!heartPart) return;
        
        // 重置
        heartPart.classList.remove('active');
        
        // 如果有心脏相关症状，激活心脏
        const heartSymptoms = ['1', '2', '3']; // 胸痛、气短、心悸
        const hasHeartSymptoms = selectedOptions.some(opt => heartSymptoms.includes(opt));
        
        if (hasHeartSymptoms && !selectedOptions.includes('7')) {
            heartPart.classList.add('active');
        }
        
        // 更新药丸颜色
        if (selectedOptions.includes('7')) {
            // 没有症状 = 好
            updatePillColor(document.getElementById('symptoms-pill'), 5);
        } else {
            // 症状越多越差
            const value = 5 - Math.min(4, selectedOptions.length);
            updatePillColor(document.getElementById('symptoms-pill'), value);
        }
        
        // 更新按钮状态
        const section = document.getElementById('symptoms');
        if (section) {
            updateButtonStatus(section);
        }
    }
    
    // 更新药丸颜色
    function updatePillColor(pillElement, value) {
        if (!pillElement) return;
        
        // 获取所有Three.js相关的canvas
        const canvas = pillElement.querySelector('canvas');
        if (!canvas) return;
        
        // 获取渲染器和场景
        const renderer = canvas.__renderer;
        const scene = canvas.__scene;
        
        if (!renderer || !scene) return;
        
        // 根据值更新药丸颜色
        const pillMesh = scene.children.find(child => child.type === 'Mesh');
        
        if (pillMesh) {
            let color;
            switch(parseInt(value)) {
                case 1:
                    color = 0xFF5555; // 红色
                    break;
                case 2:
                    color = 0xFF9955; // 橙色
                    break;
                case 3:
                    color = 0xFFDD55; // 黄色
                    break;
                case 4:
                    color = 0x77DD77; // 绿色
                    break;
                case 5:
                    color = 0x5D4777; // 紫色(默认)
                    break;
                default:
                    color = 0x9A8BA5; // 淡紫色
            }
            
            pillMesh.material.color.set(color);
        }
    }
    
    function setupButtons() {
        const thinButtons = document.querySelectorAll('.thin-button');
        
        // 初始化所有按钮状态
        document.querySelectorAll('.section').forEach(section => {
            updateButtonStatus(section);
        });
        
        thinButtons.forEach(button => {
            // 处理点击事件
            button.addEventListener('click', handleButtonClick);
            
            // 处理触摸事件
            button.addEventListener('touchend', (e) => {
                e.preventDefault(); // 防止默认行为和双重触发
                handleButtonClick.call(button, e);
            });
            
            // 为触摸设备添加活动状态样式
            button.addEventListener('touchstart', () => {
                button.classList.add('active-touch');
            });
            
            button.addEventListener('touchend', () => {
                button.classList.remove('active-touch');
            });
            
            button.addEventListener('touchcancel', () => {
                button.classList.remove('active-touch');
            });
        });
        
        function handleButtonClick(e) {
            const section = this.closest('.section');
                
                if (section) {
                // 如果是结果页面的按钮
                if (section.id === 'results') {
                    const buttonText = this.querySelector('span').textContent;
                    if (buttonText === '了解更多') {
                        openWebsite();
                    } else if (buttonText === '分享结果') {
                        handleShare();
                    }
                    return;
                }
                
                // 检查该部分是否完成
                const sectionId = section.id;
                if (!checkSectionCompletion(sectionId)) {
                    // 如果未完成，不允许继续
                    return;
                }
                
                // 如果是BMI部分（最后一题），直接计算结果并显示结果页
                if (section.id === 'bmi') {
                    // 先计算结果
                    calculateResults();
                    
                    // 找到结果页索引
                    const resultsIndex = Array.from(sections).findIndex(section => section.id === 'results');
                    if (resultsIndex !== -1) {
                        // 直接滚动到结果页
                        scrollContainer.scrollTo({
                            top: sections[resultsIndex].offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // 更新当前部分为结果页
                        setTimeout(() => {
                            updateActiveSection(resultsIndex);
                        }, 100);
                    }
                    return;
                }
                
                    // 如果是数据处理页之前的按钮，滚动到下一部分
                    if (section.id !== 'processing') {
                        scrollToNextSection();
                    }
                    
                    // 如果是心跳挑战之后的按钮，进入数据处理
                    if (section.id === 'heart-challenge') {
                        simulateProcessing();
                    }
                }
        }
        
        // 分享按钮
        const shareButton = document.querySelector('.share-button');
        if (shareButton) {
            shareButton.addEventListener('click', handleShare);
            shareButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleShare();
            });
        }
        
        // 官网链接
        const websiteButton = document.querySelector('.website-button');
        if (websiteButton) {
            websiteButton.addEventListener('click', openWebsite);
            websiteButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                openWebsite();
            });
        }
        
        function handleShare() {
                // 实现分享功能
                if (navigator.share) {
                    navigator.share({
                        title: '我的心动指数结果',
                        text: `我在HP药厂的心动时刻测试中获得了${document.querySelector('.score-text').textContent}分！测测你的心脏健康状况吧。`,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    alert('复制链接分享给好友吧！');
                }
        }
        
        function openWebsite() {
                window.open('https://www.example.com', '_blank');
        }
        
        // 为所有单选和复选框添加触摸事件支持
        const radioOptions = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        radioOptions.forEach(option => {
            const label = option.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    option.checked = !option.checked;
                    
                    // 触发change事件
                    const event = new Event('change', { bubbles: true });
                    option.dispatchEvent(event);
                });
            }
            
            // 添加完成状态更新
            option.addEventListener('change', () => {
                const section = option.closest('.section');
                if (section) {
                    updateButtonStatus(section);
                }
            });
        });
        
        // 为场景选项添加触摸事件支持
        const scenarioOptions = document.querySelectorAll('.scenario-option');
        scenarioOptions.forEach(option => {
            option.addEventListener('click', () => handleScenarioSelection(option));
            
            option.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleScenarioSelection(option);
            });
        });
        
        function handleScenarioSelection(option) {
            // 清除其他选择
            const parentContainer = option.closest('.scenario-container');
            if (parentContainer) {
                parentContainer.querySelectorAll('.scenario-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
            
            // 设置为选中
            option.classList.add('selected');
            
            // 记录答案
            const value = option.getAttribute('data-value');
            const sectionId = option.closest('.section').id;
            answers[sectionId] = value;
            
            // 改变药丸颜色
            const pillId = `scenario-pill`;
            const pillElement = document.getElementById(pillId);
            if (pillElement) {
                updatePillColor(pillElement, value);
            }
            
            // 更新按钮状态
            const section = option.closest('.section');
            if (section) {
                updateButtonStatus(section);
            }
        }
        
        // 为图形选项添加触摸事件支持
        const graphicOptions = document.querySelectorAll('.graphic-option');
        graphicOptions.forEach(option => {
            option.addEventListener('click', () => handleGraphicSelection(option));
            
            option.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleGraphicSelection(option);
            });
        });
        
        function handleGraphicSelection(option) {
            // 清除同组的其他选择
            const parentContainer = option.closest('.graphic-options');
            if (parentContainer) {
                parentContainer.querySelectorAll('.graphic-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
            
            // 设置为选中
            option.classList.add('selected');
            
            // 记录答案
            const value = option.getAttribute('data-value');
            const sectionId = option.closest('.section').id;
            answers[sectionId] = value;
            
            // 改变药丸颜色
            const pillId = `${sectionId}-pill`;
            const pillElement = document.getElementById(pillId);
            if (pillElement) {
                updatePillColor(pillElement, value);
            }
            
            // 更新按钮状态
            const section = option.closest('.section');
            if (section) {
                updateButtonStatus(section);
            }
        }
    }
    
    function scrollToNextSection() {
        if (currentSection < sections.length - 1) {
            const nextSection = sections[currentSection + 1];
            scrollContainer.scrollTo({
                top: nextSection.offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    function simulateLoading() {
        // 模拟3秒加载
        setTimeout(() => {
            // 完成加载后自动滚动到欢迎页
            scrollToNextSection();
        }, 3000);
    }
    
    function simulateProcessing() {
        // 模拟数据处理
        const processingBarFill = document.getElementById('processing-bar-fill');
        let progress = 0;
        
        const processingInterval = setInterval(() => {
            progress += 1;
            if (processingBarFill) {
                processingBarFill.style.width = `${progress}%`;
            }
            
            if (progress >= 100) {
                clearInterval(processingInterval);
                
                // 计算结果
            calculateResults();
                
                // 显示结果页
                setTimeout(() => {
            scrollToNextSection();
                }, 500);
            }
        }, 30);
    }
    
    function calculateResults() {
        // 计算总分和风险级别
        let totalScore = 0;
        let maxScore = 0;
        let categories = {
            lifestyle: 0,
            knowledge: 0,
            symptoms: 0,
            history: 0
        };
        
        // 生活方式评分（总分400分）
        // 1. 运动评分（100分）
        if (answers['exercise']) {
            const exerciseScore = parseInt(answers['exercise']) * 20;
            totalScore += exerciseScore;
            categories.lifestyle += exerciseScore;
            maxScore += 100;
        }
        
        // 2. 饮食评分（100分）
        if (answers['diet'] && answers['diet'].length) {
            // 健康食物: 蔬菜, 水果, 鱼类
            const healthyFoods = ['vegetables', 'fruits', 'fish'];
            // 不健康食物: 快餐, 甜食, 碳酸饮料
            const unhealthyFoods = ['fastfood', 'sweets', 'soda'];
            
            let dietScore = 0;
            let healthyCount = answers['diet'].filter(food => healthyFoods.includes(food)).length;
            let unhealthyCount = answers['diet'].filter(food => unhealthyFoods.includes(food)).length;
            
            if (healthyCount > unhealthyCount) {
                dietScore = 80 + healthyCount * 5; // 最高100
            } else if (healthyCount === unhealthyCount) {
                dietScore = 60;
            } else {
                dietScore = Math.max(30, 60 - unhealthyCount * 10); // 最低30
            }
            
            totalScore += dietScore;
            categories.lifestyle += dietScore;
            maxScore += 100;
        }
        
        // 3. 睡眠评分（100分）
        if (answers['sleep']) {
            let sleepScore = 0;
            const hours = parseInt(answers['sleep'].time || 7);
            
            // 睡眠时间评分（60分）
            if (hours >= 7 && hours <= 8) {
                sleepScore += 60; // 最佳睡眠时间
            } else if (hours >= 6 && hours <= 9) {
                sleepScore += 45; // 可接受范围
            } else {
                sleepScore += 30; // 睡眠时间不理想
            }
            
            // 睡眠质量评分（40分）
            const quality = parseInt(answers['sleep'].quality || 3);
            sleepScore += quality * 8; // 1-5质量，加8-40分
            
            totalScore += sleepScore;
            categories.lifestyle += sleepScore;
            maxScore += 100;
        }
        
        // 4. 压力评分（100分）
        if (answers['stress'] !== undefined) {
            const stressLevel = parseInt(answers['stress']);
            const stressScore = Math.max(30, 100 - stressLevel); // 最低30分
            
            totalScore += stressScore;
            categories.lifestyle += stressScore;
            maxScore += 100;
        }
        
        // 平均生活方式得分
        if (categories.lifestyle > 0) {
            categories.lifestyle = Math.round(categories.lifestyle / 4);
        }
        
        // 知识测试评分（总分300分）
        // 1. 心率知识（100分）
        if (answers['quiz1']) {
            const isCorrect = answers['quiz1'] === '2';
            const knowledgeScore = isCorrect ? 100 : 50;
            
            totalScore += knowledgeScore;
            categories.knowledge += knowledgeScore;
            maxScore += 100;
        }
        
        // 2. 心脏健康知识（100分）
        if (answers['quiz2']) {
            const isCorrect = answers['quiz2'] === '1';
            const knowledgeScore = isCorrect ? 100 : 50;
            
            totalScore += knowledgeScore;
            categories.knowledge += knowledgeScore;
            maxScore += 100;
        }
        
        // 3. 心跳挑战（100分）
        if (answers['heart-challenge']) {
            const challengeScore = parseInt(answers['heart-challenge']);
            
            totalScore += challengeScore;
            categories.knowledge += challengeScore;
            maxScore += 100;
        }
        
        // 平均知识得分
        if (categories.knowledge > 0) {
            categories.knowledge = Math.round(categories.knowledge / 3);
        }
        
        // 生活场景评分（100分）
        if (answers['life-scenario']) {
            let scenarioScore = 0;
            switch(answers['life-scenario']) {
                case '2': // 活跃生活
                    scenarioScore = 90;
                    break;
                case '4': // 学习压力
                    scenarioScore = 70;
                    break;
                case '1': // 办公室工作
                    scenarioScore = 60;
                    break;
                case '3': // 数字生活
                    scenarioScore = 50;
                    break;
                default:
                    scenarioScore = 60;
            }
            
            totalScore += scenarioScore;
            categories.lifestyle += scenarioScore;
            maxScore += 100;
        }
        
        // 家族病史评分（100分）
        if (answers['family-history'] && answers['family-history'].length) {
            let historyScore = 0;
            
            if (answers['family-history'].includes('6')) {
                historyScore = 100; // 没有已知的心脏问题
            } else {
                historyScore = Math.max(40, 100 - (answers['family-history'].length * 15));
            }
            
            totalScore += historyScore;
            categories.history = historyScore;
            maxScore += 100;
        }
        
        // 症状评分（100分）
        if (answers['symptoms'] && answers['symptoms'].length) {
            let symptomsScore = 0;
            
            if (answers['symptoms'].includes('7')) {
                symptomsScore = 100; // 没有症状
            } else {
                symptomsScore = Math.max(30, 100 - (answers['symptoms'].length * 15));
            }
            
            totalScore += symptomsScore;
            categories.symptoms = symptomsScore;
            maxScore += 100;
        }
        
        // 计算最终分数(0-100)
        const finalScore = Math.round((totalScore / maxScore) * 100);
        
        // 确定风险级别和状态
        let riskLevel = '';
        let recommendedProduct = '';
        
        if (finalScore >= 90) {
            riskLevel = '低风险';
            recommendedProduct = 'heart-daily';
        } else if (finalScore >= 70) {
            riskLevel = '中风险';
            recommendedProduct = 'heart-active';
        } else if (finalScore >= 50) {
            riskLevel = '高风险';
            recommendedProduct = 'heart-active';
        } else {
            riskLevel = '极高风险';
            recommendedProduct = 'heart-pro';
        }
        
        // 显示结果
        displayResults(finalScore, riskLevel, recommendedProduct, categories);
    }
    
    function displayResults(score, riskLevel, recommendedProduct, categories) {
        // 更新分数圆环
        const scoreCircleFill = document.querySelector('.score-circle-fill');
        const scoreText = document.querySelector('.score-text');
        const riskValue = document.querySelector('.risk-value');
        
        // 确保结果页面是活动的
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.classList.add('active');
            
            // 滚动到结果页面
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (scoreCircleFill) {
            // 计算圆环填充
            const circumference = 2 * Math.PI * 90; // 圆的周长
            scoreCircleFill.style.strokeDasharray = `${circumference}`;
            
            // 重置偏移量以触发动画
            scoreCircleFill.style.strokeDashoffset = `${circumference}`;
            
            // 强制重排以确保动画生效
            scoreCircleFill.getBoundingClientRect();
            
            // 设置新的偏移量来显示百分比
            const fillOffset = circumference - (score / 100) * circumference;
            scoreCircleFill.style.strokeDashoffset = `${fillOffset}`;
        }
        
        if (scoreText) {
            // 使用动画效果显示分数
            let currentScore = 0;
            const duration = 2000; // 2秒动画
            const interval = 20; // 每20ms更新一次
            const steps = duration / interval;
            const increment = score / steps;
            
            // 清除可能存在的旧计时器
            if (window.scoreInterval) {
                clearInterval(window.scoreInterval);
            }
            
            // 立即显示初始值
            scoreText.textContent = '0';
            
            window.scoreInterval = setInterval(() => {
                currentScore += increment;
                if (currentScore >= score) {
                    currentScore = score;
                    clearInterval(window.scoreInterval);
                    window.scoreInterval = null;
                }
                scoreText.textContent = Math.round(currentScore);
            }, interval);
        }
        
        if (riskValue) {
            riskValue.textContent = riskLevel;
            
            // 设置风险级别颜色
            switch(riskLevel) {
                case '低风险':
                    riskValue.style.color = '#77DD77';
                    break;
                case '中风险':
                    riskValue.style.color = '#FFDD55';
                    break;
                case '高风险':
                    riskValue.style.color = '#FFA500';
                    break;
                case '极高风险':
                    riskValue.style.color = '#FF5555';
                    break;
            }
        }
        
        // 更新图表
        updateResultsChart(categories);
        
        // 更新推荐产品
        updateProductRecommendation(recommendedProduct);
    }
    
    function updateProductRecommendation(recommendedProduct) {
        const productName = document.querySelector('.product-name');
        const productDescription = document.querySelector('.product-description');
        
        if (productName && productDescription) {
            switch(recommendedProduct) {
                case 'heart-daily':
                    productName.textContent = '心动日常护理';
                    productDescription.textContent = '恭喜！您的心脏健康状况良好，风险较低。建议使用这款日常保健品来维持健康状态。';
                    break;
                case 'heart-active':
                    productName.textContent = '心动活力素';
                    productDescription.textContent = '您的心脏健康状况存在一定风险。这款营养补充剂能帮助您改善心血管健康水平。';
                    break;
                case 'heart-pro':
                    productName.textContent = '心动专业配方';
                    productDescription.textContent = '您的心脏健康状况风险较高。这款专业营养方案将帮助您全面改善心脏健康，建议同时咨询医生。';
                    break;
            }
        }
    }
    
    function updateResultsChart(categories) {
        const ctx = document.getElementById('resultsChart');
        
        if (!ctx) return;
        
        // 销毁旧图表
        if (resultsChart) {
            resultsChart.destroy();
        }
        
        // 创建新图表
        resultsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['生活方式', '心脏知识', '家族病史', '症状自测'],
            datasets: [{
                    label: '心脏健康指标',
                    data: [
                        categories.lifestyle,
                        categories.knowledge,
                        categories.history,
                        categories.symptoms
                    ],
                    backgroundColor: 'rgba(93, 71, 119, 0.2)',
                    borderColor: '#5D4777',
                    pointBackgroundColor: '#5D4777',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#5D4777'
                }]
            },
            options: {
            scales: {
                r: {
                    angleLines: {
                            display: true
                        },
                        min: 0,
                        max: 100,
                    ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }
    
    // 点击点导航
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollContainer.scrollTo({
                top: sections[index].offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // 设置3D药丸模型
    function setup3DPill() {
        if (!pillContainer) return;
        
        // 使用Three.js创建3D药丸模型
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(200, 200);
        pillContainer.appendChild(renderer.domElement);
        
        // 创建药丸几何体
        const geometry = new THREE.CapsuleGeometry(1, 2, 16, 16);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x5D4777,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
        });
        
        pillModel = new THREE.Mesh(geometry, material);
        scene.add(pillModel);
        
        // 添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        camera.position.z = 5;
        
        // 动画函数
        function animate() {
            requestAnimationFrame(animate);
            
            if (pillModel) {
                pillModel.rotation.x += 0.01;
                pillModel.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // 设置各部分的药丸
        setupSectionPills();
    }
    
    // 设置各部分的药丸动画
    function setupSectionPills() {
        const pillAnimations = document.querySelectorAll('.pill-animation');
        
        pillAnimations.forEach(pill => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            
            const width = pill.offsetWidth;
            const height = pill.offsetHeight;
            
            renderer.setSize(width, height);
            pill.appendChild(renderer.domElement);
            
            // 创建药丸几何体
            const geometry = new THREE.CapsuleGeometry(1, 2, 16, 16);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0x5D4777,
                metalness: 0.1,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
            });
            
            const pillMesh = new THREE.Mesh(geometry, material);
            scene.add(pillMesh);
            
            // 添加灯光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);
            
            camera.position.z = 5;
            
            // 动画函数
            function animate() {
                requestAnimationFrame(animate);
                
                pillMesh.rotation.x += 0.01;
                pillMesh.rotation.y += 0.01;
                
                renderer.render(scene, camera);
            }
            
            animate();
        });
    }
    
    // 设置粒子效果
    function setupParticles() {
        if (!particlesContainer) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;
        particlesContainer.appendChild(canvas);
        
        // 创建粒子
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1,
                color: `rgba(154, 139, 165, ${Math.random() * 0.5})`,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5,
                opacitySpeed: Math.random() * 0.01,
            });
        }
        
        // 动画粒子
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                // 更新位置
                p.x += p.speedX;
                p.y += p.speedY;
                p.opacity += p.opacitySpeed;
                
                // 边界检查
                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;
                
                // 不透明度循环
                if (p.opacity <= 0 || p.opacity >= 0.5) {
                    p.opacitySpeed *= -1;
                }
                
                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(154, 139, 165, ${p.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
}); 