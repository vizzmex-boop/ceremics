/**
 * 交互脚本
 * 处理导航、地图、图表和数据展示
 */

document.addEventListener('DOMContentLoaded', () => {

    // 全局状态
    const state = {
        currentSection: 'history', // 当前板块
        currentDynastyIndex: 0     // 当前朝代索引
    };

    // 缓存 DOM 元素，减少查询开销
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('section');
    const timelineTrack = document.querySelector('.timeline-track');
    const dynastyTitle = document.getElementById('dynasty-title');
    const dynastyPeriod = document.getElementById('dynasty-period');
    const dynastyDescription = document.getElementById('dynasty-description');
    const dynastyFeatures = document.getElementById('dynasty-features');

    // ====== 样式配置 ======
    const chartStyle = {
        fontTitle: 'Ma Shan Zheng',
        fontBody: 'Noto Serif SC',
        colorText: '#2c2c2c',
        colorSubText: '#5a5a5a',
        colorAxis: '#8b4513',
        colorSplitArea: ['#f4f1ea', '#eaddcf']
    };

    // ECharts 实例，resize 时需要用到
    let myChart = null;
    let barChart = null;
    let pieChart = null;
    let craftChart = null;
    let typeCompositionChart = null;

    // 播放控制
    let isPlaying = false;
    let playInterval = null;

    // 初始化
    init();

    // 初始化入口
    function init() {
        setupNavigation();
        injectOverviewNode();
        renderTimeline();
        setupAuthorModal();

        // 地图初始化较慢，异步处理
        initMap().then(() => {
            updateDynastyContent(0);
        });

        initTypesSection();
        initCraftSection();
        setupGalleryButton();

        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            if (myChart) myChart.resize();
            if (barChart) barChart.resize();
            if (pieChart) pieChart.resize();
            if (craftChart) craftChart.resize();
            if (typeCompositionChart) typeCompositionChart.resize();
            drawSCurve();
        });
    }

    // 加载并渲染地图
    async function initMap() {
        const chartDom = document.getElementById('map-container');
        myChart = echarts.init(chartDom);
        myChart.showLoading();

        try {
            // 获取 GeoJSON 数据
            const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
            const chinaJson = await response.json();

            myChart.hideLoading();
            echarts.registerMap('china', chinaJson);

            const option = {
                backgroundColor: 'transparent',
                title: {
                    text: '陶瓷文化地图',
                    left: 'center',
                    textStyle: {
                        color: chartStyle.colorText,
                        fontFamily: chartStyle.fontTitle,
                        fontSize: 28
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return `${params.name}<br/>${params.data.type === 'kiln' ? '窑口' : '文化遗址'}`;
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#8b4513',
                    textStyle: {
                        color: chartStyle.colorText,
                        fontFamily: chartStyle.fontBody
                    }
                },
                geo: {
                    map: 'china',
                    roam: true,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#f4f1ea',
                            borderColor: '#999',
                            borderWidth: 1
                        },
                        emphasis: {
                            areaColor: '#e6dcd0'
                        }
                    }
                },
                series: [] // 初始为空，后续 updateDynastyContent 填充
            };
            myChart.setOption(option);
        } catch (error) {
            console.error('地图加载失败:', error);
            myChart.hideLoading();
            chartDom.innerHTML = '地图加载失败，请重试';
        }
    }

    // 导航切换逻辑
    // 导航切换
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetSection = link.getAttribute('data-section');

                // 更新 active 状态
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // 切换板块
                sections.forEach(section => {
                    section.classList.remove('active-section');
                    if (section.id === `${targetSection}-section`) {
                        section.classList.add('active-section');
                    }
                });

                state.currentSection = targetSection;

                // 切换回 history 板块时 resize 地图
                if (targetSection === 'history' && myChart) {
                    setTimeout(() => myChart.resize(), 100);
                }

                // 如果切换到种类板块，重绘S曲线以修正位置
                if (targetSection === 'types') {
                    setTimeout(() => {
                        drawSCurve();
                    }, 50);
                }

                // 如果切换到工艺板块，重置图表大小
                if (targetSection === 'craft' && craftChart) {
                    setTimeout(() => {
                        craftChart.resize();
                    }, 50);
                }
            });
        });
    }

    // 渲染时间轴
    function renderTimeline() {
        timelineTrack.innerHTML = ''; // 清空现有内容

        dynasties.forEach((dynasty, index) => {
            const node = document.createElement('div');
            node.className = `timeline-node ${index === 0 ? 'active' : ''}`;
            node.setAttribute('data-index', index);

            node.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-label">${dynasty.name}</div>
            `;

            node.addEventListener('click', () => {
                updateDynastyContent(index);

                // 更新时间轴激活状态
                document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
                node.classList.add('active');
            });

            timelineTrack.appendChild(node);
        });
    }

    // 更新朝代内容
    function updateDynastyContent(index, fromPlayback = false) {
        const data = dynasties[index];
        state.currentDynastyIndex = index;

        const dynastyInfo = document.querySelector('.dynasty-info');
        const visualDisplay = document.querySelector('.visual-display');

        // 1. 转场动画 (非播放模式下)
        if (!fromPlayback) {
            if (dynastyInfo) dynastyInfo.classList.add('transitioning-out');
            if (visualDisplay) visualDisplay.classList.add('map-transitioning');
        }

        const chartsContainer = document.getElementById('overview-charts');
        if (chartsContainer) chartsContainer.style.display = 'none';

        // 2. 更新数据 (播放模式下无延迟)
        const delay = fromPlayback ? 0 : 400;

        setTimeout(() => {
            // 2. 更新内容
            const dynastyTitle = document.getElementById('dynasty-title');
            const dynastyPeriod = document.getElementById('dynasty-period');
            const dynastyDescription = document.getElementById('dynasty-description');
            const dynastyFeatures = document.getElementById('dynasty-features');

            if (dynastyTitle) dynastyTitle.textContent = data.name;
            if (dynastyPeriod) dynastyPeriod.textContent = data.period;
            if (dynastyDescription) dynastyDescription.innerHTML = `<p>${data.description}</p>`;

            // 更新特征列表
            if (dynastyFeatures) {
                if (data.id === 'overview') {
                    dynastyFeatures.style.display = 'none';
                } else {
                    dynastyFeatures.style.display = 'block';
                    const featuresHtml = `
                        <h3>主要特征</h3>
                        <ul>
                            ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    `;
                    dynastyFeatures.innerHTML = featuresHtml;
                }
            }


            // 更新地图数据
            if (myChart && data.locations) {
                updateMapData(data);
            }

            // 更新文物图集
            updateDynastyGallery(data);

            // 控制播放按钮显示及图表显示
            const playbackControl = document.getElementById('playback-control');
            const chartsContainer = document.getElementById('overview-charts');

            if (playbackControl) {
                if (data.id === 'overview') {
                    playbackControl.style.display = 'block';
                    // 显示并渲染总览图表
                    if (chartsContainer) {
                        chartsContainer.style.display = 'flex';
                        setTimeout(renderOverviewCharts, 50);
                    }
                } else {
                    playbackControl.style.display = 'none';
                    if (typeof isPlaying !== 'undefined' && isPlaying && !fromPlayback) {
                        stopHistoryPlayback();
                    }

                    // 显示并渲染朝代专属图表
                    if (chartsContainer) {
                        chartsContainer.style.display = 'flex';
                        setTimeout(() => {
                            renderDynastyCharts(data);
                        }, 50);
                    }
                }
            }

            // 3. 移除淡出类，添加淡入类 (仅在非演示模式下)
            if (!fromPlayback) {
                if (dynastyInfo) {
                    dynastyInfo.classList.remove('transitioning-out');
                    dynastyInfo.classList.add('transitioning-in');

                    // 动画结束后清理类
                    setTimeout(() => {
                        dynastyInfo.classList.remove('transitioning-in');
                    }, 500);
                }
                if (visualDisplay) {
                    setTimeout(() => {
                        visualDisplay.classList.remove('map-transitioning');
                    }, 600);
                }
            } else {
                // 如果是播放模式，确保清理掉可能存在的transitioning-out类
                if (dynastyInfo) dynastyInfo.classList.remove('transitioning-out');
                if (visualDisplay) visualDisplay.classList.remove('map-transitioning');
            }
        }, delay);
    }

    // 朝代ID到文件夹名的映射
    const dynastyFolderMap = {
        'neolithic': '新石器时代',
        'xia-shang-zhou': '夏商周',
        'qin-han': '秦汉',
        'three-kingdoms': '三国两晋南北朝',
        'sui': '隋',
        'tang': '唐朝',
        'song': '宋',
        'liao-jin-xixia': '辽金西夏',
        'yuan': '元',
        'ming': '明',
        'qing': '清'
    };

    // 朝代文物图片数据
    const dynastyArtifacts = {
        'neolithic': [
            { name: '人面鱼纹彩陶盆', file: '人面鱼纹彩陶盆.jpg' },
            { name: '黑陶高脚杯', file: '黑陶高脚杯.jpg' }
        ],
        'xia-shang-zhou': [
            { name: '印纹白陶壶', file: '印纹白陶壶.jpg' },
            { name: '原始瓷甬钟', file: '原始瓷甬钟.jpg' }
        ],
        'qin-han': [
            { name: '兵马俑', file: '兵马俑.jpg' },
            { name: '加彩灰陶壶', file: '加彩灰陶壶.jpg' }
        ],
        'three-kingdoms': [
            { name: '青瓷狮子形烛台', file: '青瓷狮子形烛台.jpg' },
            { name: '青瓷魂瓶', file: '青瓷魂瓶.jpg' }
        ],
        'sui': [
            { name: '隋朝女乐师陶俑', file: '隋朝女乐师陶俑.jpg' },
            { name: '青釉四系罐', file: '青釉四系罐.png' }
        ],
        'tang': [
            { name: '唐三彩骆驼载乐舞俑', file: '唐三彩骆驼载乐舞俑.jpg' },
            { name: '唐三彩龙耳瓶', file: '唐三彩龙耳瓶.JPG' }
        ],
        'song': [
            { name: '天蓝釉刻花鹅颈瓶', file: '天蓝釉刻花鹅颈瓶.png' },
            { name: '紫红釉六角棱花盘', file: '紫红釉六角棱花盘.JPG' }
        ],
        'liao-jin-xixia': [
            { name: '三彩折枝花纹圆盒', file: '三彩折枝花纹圆盒.png' },
            { name: '黄釉凤首花口瓶', file: '黄釉凤首花口瓶.png' }
        ],
        'yuan': [
            { name: '釉里红菊唐草玉壶春瓶', file: '釉里红菊唐草玉壶春瓶.jpg' },
            { name: '青花莲池水禽盘', file: '青花莲池水禽盘.JPG' }
        ],
        'ming': [
            { name: '五彩鱼藻壶', file: '五彩鱼藻壶.jpg' },
            { name: '明成化斗彩鸡缸杯', file: '明成化斗彩鸡缸杯.jpg' }
        ],
        'qing': [
            { name: '康熙款蓝地珐琅彩牡丹纹碗', file: '康熙款蓝地珐琅彩牡丹纹碗.png' },
            { name: '粉彩桃天球瓶', file: '粉彩桃天球瓶.jpg' }
        ]
    };

    // 设置文物图集按钮
    function setupGalleryButton() {
        const galleryBtn = document.getElementById('show-gallery-btn');
        const galleryContainer = document.getElementById('dynasty-gallery');

        if (galleryBtn && galleryContainer) {
            galleryBtn.addEventListener('click', () => {
                showGallery();
            });
        }
    }

    // 显示文物图集
    function showGallery() {
        const galleryContainer = document.getElementById('dynasty-gallery');
        if (!galleryContainer) return;

        const dynastyData = dynasties[state.currentDynastyIndex];

        // 总览模式显示所有朝代的文物
        if (dynastyData.id === 'overview') {
            let allArtifactsHtml = '';
            Object.keys(dynastyArtifacts).forEach(dynastyId => {
                const artifacts = dynastyArtifacts[dynastyId];
                const folderName = dynastyFolderMap[dynastyId];
                if (artifacts && artifacts.length > 0) {
                    artifacts.forEach(artifact => {
                        allArtifactsHtml += `
                            <div class="gallery-item">
                                <img src="Pic/photo-1/${folderName}/${artifact.file}" alt="${artifact.name}" loading="lazy">
                                <div class="gallery-item-name">${artifact.name}</div>
                            </div>
                        `;
                    });
                }
            });

            galleryContainer.innerHTML = `
                <span class="gallery-close">&times;</span>
                <h3>文物展示</h3>
                <div class="gallery-grid">
                    ${allArtifactsHtml}
                </div>
            `;
        } else {
            const artifacts = dynastyArtifacts[dynastyData.id];
            const folderName = dynastyFolderMap[dynastyData.id];

            if (!artifacts || artifacts.length === 0) {
                galleryContainer.innerHTML = `
                    <span class="gallery-close">&times;</span>
                    <h3>文物展示</h3>
                    <p style="color:#fff; text-align:center;">暂无该朝代的文物图片</p>
                `;
            } else {
                galleryContainer.innerHTML = `
                    <span class="gallery-close">&times;</span>
                    <h3>${dynastyData.name} · 文物展示</h3>
                    <div class="gallery-grid">
                        ${artifacts.map(artifact => `
                            <div class="gallery-item">
                                <img src="Pic/photo-1/${folderName}/${artifact.file}" alt="${artifact.name}" loading="lazy">
                                <div class="gallery-item-name">${artifact.name}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }

        galleryContainer.classList.add('visible');

        // 绑定关闭按钮
        const closeBtn = galleryContainer.querySelector('.gallery-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                galleryContainer.classList.remove('visible');
            });
        }

        // 点击背景关闭
        galleryContainer.addEventListener('click', (e) => {
            if (e.target === galleryContainer) {
                galleryContainer.classList.remove('visible');
            }
        });

        // 图片点击放大
        const galleryImages = galleryContainer.querySelectorAll('.gallery-item img');
        galleryImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                showImageLightbox(img.src, img.alt);
            });
        });
    }

    // 图片放大预览
    function showImageLightbox(src, alt) {
        // 创建或获取 lightbox 容器
        let lightbox = document.getElementById('image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox';
            lightbox.className = 'image-lightbox';
            document.body.appendChild(lightbox);
        }

        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
            <div class="lightbox-caption">${alt}</div>
        `;

        lightbox.classList.add('visible');

        // 关闭按钮
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('visible');
        });

        // 点击背景关闭
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('visible');
            }
        });
    }

    // 更新朝代文物图集 (已弃用，改为按钮触发)
    function updateDynastyGallery(dynastyData) {
        // 此函数保留兼容性但不再自动显示
    }

    // 注入历史总览节点
    function injectOverviewNode() {
        // 检查是否已经存在 (防止重复注入)
        if (dynasties.some(d => d.id === 'overview')) return;

        const allLocations = [];
        dynasties.forEach(dynasty => {
            dynasty.locations.forEach(loc => {
                // 克隆位置对象并添加朝代ID，用于总览模式下的颜色区分
                allLocations.push({
                    ...loc,
                    dynastyId: dynasty.id,
                    originalCategory: loc.category // 保留原始分类
                });
            });
        });

        const overviewNode = {
            id: "overview",
            name: "历史总览",
            period: "新石器时代 - 清朝",
            description: "纵览中国陶瓷发展长河...",
            features: [
                "跨越万年的陶瓷文明史",
                "由北向南的制瓷中心转移",
                "从陶到瓷的质变（原始瓷-成熟青瓷-白瓷）",
                "三国两晋南北朝：南青北白格局初现",
                "五大名窑与八大窑系的辉煌"
            ],
            locations: allLocations
        };

        // 添加到清朝之后 (即数组末尾)
        dynasties.push(overviewNode);
    }

    // 获取朝代颜色
    function getDynastyColor(dynastyId) {
        switch (dynastyId) {
            case 'neolithic': return '#d2691e'; // 新石器 - 赭红
            case 'xia-shang-zhou': return '#8b4513'; // 夏商周 - 陶土褐
            case 'qin-han': return '#a0522d'; // 秦汉 - 砖红
            case 'three-kingdoms': return '#4169e1'; // 三国两晋南北朝 - 魏晋蓝
            case 'sui': return '#789262'; // 隋 - 橄榄绿
            case 'tang': return '#bfbfbf'; // 唐 - 洁白 (南青北白)
            case 'song': return '#7cc5d0'; // 宋 - 天青
            case 'liao-jin-xixia': return '#deb887'; // 辽金西夏 - 沙色
            case 'yuan': return '#1e3c72'; // 元 - 青花蓝
            case 'ming': return '#ffd700'; // 明 - 御窑黄
            case 'qing': return '#ff69b4'; // 清 - 珐琅彩粉
            default: return '#999999';
        }
    }

    // 获取窑口样式 (颜色和标签)
    function getKilnStyle(category, dynastyId) {
        let color = '#8b4513'; // 默认窑口
        let label = '其他窑口';

        // 五大名窑 - 统一颜色 (汝窑天青色)
        const fiveGreatKilnsColor = '#5da5b0';

        // 检查是否为五大名窑
        if (['ru', 'guan', 'ge', 'jun', 'ding'].includes(category)) {
            color = fiveGreatKilnsColor;

            // 辽金西夏和元代显示具体窑口名称
            if (dynastyId === 'liao-jin-xixia' || dynastyId === 'yuan') {
                if (category === 'ru') label = '汝窑';
                else if (category === 'guan') label = '官窑';
                else if (category === 'ge') label = '哥窑';
                else if (category === 'jun') label = '钧窑';
                else if (category === 'ding') label = '定窑';
            } else {
                // 宋代统一显示为"五大名窑"
                label = '五大名窑';
            }
        }

        // 宋代其他窑系
        else if (category === 'ding_type') { color = '#dccbba'; label = '定窑系'; }
        else if (category === 'cizhou') { color = '#3e3e3e'; label = '磁州窑'; }
        else if (category === 'yaozhou') { color = '#6b8e23'; label = '耀州窑'; }
        else if (category === 'jingdezhen') { color = '#87a9a9'; label = '景德镇'; }
        else if (category === 'longquan') { color = '#3cb371'; label = '龙泉窑'; }
        else if (category === 'jian') { color = '#000000'; label = '建窑'; }

        // 夏商周秦汉三国
        else if (category === 'white_pottery') { color = '#f5f5f5'; label = '白陶'; }
        else if (category === 'proto_porcelain') { color = '#8fbc8f'; label = '原始瓷'; }
        else if (category === 'impressed_pottery') { color = '#a0522d'; label = '印纹硬陶'; }
        else if (category === 'terracotta') { color = '#cd5c5c'; label = '陶塑'; }
        else if (category === 'glazed_pottery') { color = '#daa520'; label = '釉陶'; }
        else if (category === 'black_porcelain') { color = '#2f4f4f'; label = '早期黑瓷'; }
        else if (category === 'celadon') { color = '#789262'; label = '青瓷'; }
        else if (category === 'white') { color = '#bfbfbf'; label = '白瓷'; }

        // 新石器时代
        else if (category === 'painted') { color = '#d2691e'; label = '彩陶文化'; }
        else if (category === 'black') { color = '#2c2c2c'; label = '黑陶文化'; }

        // 辽金西夏
        else if (category === 'liao') { color = '#deb887'; label = '辽代窑口'; }
        else if (category === 'jin') { color = '#cd5c5c'; label = '金代窑口'; }
        else if (category === 'xixia') { color = '#4682b4'; label = '西夏窑口'; }

        // 元代
        else if (category === 'jingdezhen_blue_white') { color = '#1e3c72'; label = '景德镇窑'; }
        else if (category === 'jingdezhen_underglaze_red') { color = '#8b0000'; label = '釉里红'; }
        else if (category === 'jingdezhen_qingbai') { color = '#c0d9d9'; label = '青白釉'; }
        else if (category === 'jingdezhen_shufu') { color = '#f0f8ff'; label = '卵白釉'; }
        else if (category === 'jingdezhen_blue') { color = '#0000cd'; label = '蓝釉瓷'; }
        else if (category === 'jizhou') { color = '#5d4037'; label = '吉州窑'; }

        // 明代
        else if (category === 'jingdezhen_imperial') { color = '#ffd700'; label = '御窑厂'; }
        else if (category === 'jingdezhen_doucai') { color = '#ff7f50'; label = '斗彩'; }
        else if (category === 'jingdezhen_wucai') { color = '#ff4500'; label = '五彩'; }
        else if (category === 'jingdezhen_yellow') { color = '#ffff00'; label = '黄釉'; }
        else if (category === 'dehua') { color = '#ffffff'; label = '德化窑'; }
        else if (category === 'yixing') { color = '#8b4513'; label = '宜兴窑'; }
        else if (category === 'shiwan') { color = '#4169e1'; label = '石湾窑'; }

        // 清代
        else if (category === 'jingdezhen_enamel') { color = '#ff69b4'; label = '珐琅彩'; }
        else if (category === 'jingdezhen_famille_rose') { color = '#ffb6c1'; label = '粉彩'; }
        else if (category === 'jingdezhen_langyao') { color = '#b22222'; label = '郎窑红'; }
        else if (category === 'qinzhou') { color = '#8b4513'; label = '钦州窑'; }

        return { color: color, label: label };
    }

    // 生成图例
    function generateLegend(dynastyData) {
        const legendContainer = document.getElementById('map-legend');
        legendContainer.innerHTML = '';

        if (dynastyData.id === 'overview') {
            // 总览模式：显示朝代颜色图例
            const dynastiesToShow = dynasties.filter(d => d.id !== 'overview');
            dynastiesToShow.forEach(d => {
                const color = getDynastyColor(d.id);
                const item = document.createElement('div');
                item.className = 'legend-item';
                item.innerHTML = `
                    <span class="legend-color" style="background-color: ${color}"></span>
                    <span class="legend-label">${d.name}</span>
                `;
                legendContainer.appendChild(item);
            });
        } else {
            // 普通模式：显示窑口类型图例 (按标签去重)
            const styleMap = new Map();

            dynastyData.locations.forEach(loc => {
                const style = getKilnStyle(loc.category, dynastyData.id);
                if (!styleMap.has(style.label)) {
                    styleMap.set(style.label, style.color);
                }
            });

            styleMap.forEach((color, label) => {
                const item = document.createElement('div');
                item.className = 'legend-item';
                item.innerHTML = `
                    <span class="legend-color" style="background-color: ${color}"></span>
                    <span class="legend-label">${label}</span>
                `;
                legendContainer.appendChild(item);
            });
        }
    }

    // 标签开关逻辑
    document.getElementById('label-toggle').addEventListener('change', function (e) {
        const showLabel = e.target.checked;
        myChart.setOption({
            series: [{
                label: {
                    show: showLabel
                }
            }]
        });
    });

    // 历史演变演示逻辑
    document.getElementById('play-history-btn').addEventListener('click', function () {
        if (isPlaying) {
            stopHistoryPlayback();
        } else {
            startHistoryPlayback();
        }
    });

    function startHistoryPlayback() {
        isPlaying = true;
        const btn = document.getElementById('play-history-btn');
        const galleryBtn = document.getElementById('show-gallery-btn');

        btn.innerHTML = '<span class="play-icon">■</span> 停止演示';
        btn.classList.add('playing');

        // 禁用文物按钮
        if (galleryBtn) {
            galleryBtn.disabled = true;
            galleryBtn.style.opacity = '0.5';
            galleryBtn.style.cursor = 'not-allowed';
        }

        // 进入全屏模式
        const visualDisplay = document.querySelector('.visual-display');
        const closeBtn = document.getElementById('fullscreen-close');
        if (visualDisplay) {
            visualDisplay.classList.add('fullscreen-mode');
            if (myChart) {
                myChart.resize();
                // 放大地图
                myChart.setOption({
                    geo: {
                        zoom: 1.5,
                        center: [105, 36] // 设置中心点
                    }
                });
            }
        }
        if (closeBtn) closeBtn.style.display = 'block';

        let currentIndex = 0;
        // 过滤掉总览节点，只演示具体朝代
        const timelineDynasties = dynasties.filter(d => d.id !== 'overview');

        // 立即显示第一个朝代
        updateDynastyContent(currentIndex, true);

        playInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex >= timelineDynasties.length) {
                stopHistoryPlayback();
                // 演示结束后回到总览
                const overviewIndex = dynasties.findIndex(d => d.id === 'overview');
                if (overviewIndex !== -1) {
                    updateDynastyContent(overviewIndex, true);
                }
            } else {
                updateDynastyContent(currentIndex, true);
            }
        }, 4000); // 每4秒切换一次
    }

    function stopHistoryPlayback() {
        isPlaying = false;
        clearInterval(playInterval);
        const btn = document.getElementById('play-history-btn');
        const galleryBtn = document.getElementById('show-gallery-btn');

        btn.innerHTML = '<span class="play-icon">▶</span> 历史演变演示';
        btn.classList.remove('playing');

        // 启用文物按钮
        if (galleryBtn) {
            galleryBtn.disabled = false;
            galleryBtn.style.opacity = '1';
            galleryBtn.style.cursor = 'pointer';
        }

        // 退出全屏模式
        const visualDisplay = document.querySelector('.visual-display');
        const closeBtn = document.getElementById('fullscreen-close');
        if (visualDisplay) {
            visualDisplay.classList.remove('fullscreen-mode');
            if (myChart) {
                myChart.resize();
                // 恢复默认缩放
                myChart.setOption({
                    geo: {
                        zoom: 1.2,
                        center: [104.2, 36] // 恢复默认中心点
                    }
                });
            }
        }
        if (closeBtn) closeBtn.style.display = 'none';
    }

    // 全屏关闭按钮事件
    document.getElementById('fullscreen-close')?.addEventListener('click', stopHistoryPlayback);

    // 更新地图数据
    function updateMapData(dynastyData) {
        // 生成图例
        generateLegend(dynastyData);

        const seriesData = dynastyData.locations.map(loc => {
            let color;
            let borderColor = 'transparent';
            let borderWidth = 0;

            if (dynastyData.id === 'overview') {
                // 总览模式：按朝代着色
                color = getDynastyColor(loc.dynastyId);
            } else {
                // 普通模式：按窑口类型着色
                const style = getKilnStyle(loc.category, dynastyData.id);
                color = style.color;

                // 特殊处理边框 (白瓷等浅色)
                if (loc.category === 'white' || loc.category === 'ding' || loc.category === 'ding_type' || loc.category === 'jingdezhen' || loc.category === 'dehua' || loc.category === 'white_pottery') {
                    borderColor = '#999';
                    borderWidth = 1;
                }
            }

            return {
                name: loc.name,
                value: [...loc.coords],
                type: loc.type,
                itemStyle: {
                    color: color,
                    borderColor: borderColor,
                    borderWidth: borderWidth
                }
            };
        });

        // 检查是否在全屏模式
        const isFullscreen = document.querySelector('.visual-display')?.classList.contains('fullscreen-mode');

        myChart.setOption({
            // 添加过渡动画配置
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut',
            title: {
                subtext: dynastyData.name + '陶瓷分布',
                subtextStyle: {
                    fontSize: isFullscreen ? 26 : 14,
                    color: chartStyle.colorSubText,
                    fontFamily: chartStyle.fontBody
                }
            },
            series: [{
                name: '地点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: seriesData,
                symbolSize: 15,
                showEffectOn: 'render',

                // 开启全局过渡动画
                universalTransition: {
                    enabled: true
                },

                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: document.getElementById('label-toggle').checked,
                    fontFamily: 'Noto Serif SC',
                    color: '#333'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                },
                emphasis: {
                    scale: true
                }
            }]
        });
    }

    // --- 陶瓷种类板块逻辑 (垂直交错时间轴) ---
    function initTypesSection() {
        const container = document.querySelector('.types-content');

        // 清空容器
        container.innerHTML = '';

        // 生成节点
        ceramicTypes.forEach((type, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            item.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-image">
                        <img src="${type.imageUrl}" alt="${type.name}">
                    </div>
                    <div class="timeline-info">
                        <h3>${type.name}</h3>
                        <span class="timeline-period">${type.period}</span>
                        <p class="timeline-desc">${type.description}</p>
                        <div class="timeline-features">
                            ${type.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                        </div>
                        
                        <button class="viz-btn">
                            <span>📊</span> 数据解析
                        </button>
                    </div>

                    <div class="timeline-chart-container">
                        <div class="timeline-chart-close">×</div>
                        <div class="chart-controls" style="text-align: center; margin-bottom: 10px; padding-top: 10px;">
                            <span class="chart-tab active" data-type="radar" style="cursor: pointer; padding: 5px 15px; margin: 0 5px; border-radius: 15px; background: #8b4513; color: #fff; font-size: 14px; transition: all 0.3s;">综合评估</span>
                            <span class="chart-tab" data-type="composition" style="cursor: pointer; padding: 5px 15px; margin: 0 5px; border-radius: 15px; background: #e0e0e0; color: #333; font-size: 14px; transition: all 0.3s;">化学成分</span>
                        </div>
                        <div class="type-chart-content" style="width:100%; height:300px;"></div>
                    </div>
                </div>
                <div class="timeline-marker"></div>
            `;

            // 绑定事件
            const btn = item.querySelector('.viz-btn');
            const closeBtn = item.querySelector('.timeline-chart-close');
            const chartContainer = item.querySelector('.timeline-chart-container');
            const chartDiv = item.querySelector('.type-chart-content');
            const tabs = item.querySelectorAll('.chart-tab');

            // 切换图表类型
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // 更新Tab样式
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.background = '#e0e0e0';
                        t.style.color = '#333';
                    });
                    tab.classList.add('active');
                    tab.style.background = '#8b4513';
                    tab.style.color = '#fff';

                    const chartType = tab.getAttribute('data-type');
                    if (chartType === 'radar') {
                        renderTypeRadar(chartDiv, type);
                    } else {
                        renderTypeComposition(chartDiv, type);
                    }
                });
            });

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 关闭其他打开的图表
                document.querySelectorAll('.timeline-chart-container.active').forEach(el => {
                    if (el !== chartContainer) el.classList.remove('active');
                });

                chartContainer.classList.add('active');

                // 重置为默认显示综合评估
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.background = '#e0e0e0';
                    t.style.color = '#333';
                });
                const defaultTab = item.querySelector('[data-type="radar"]');
                defaultTab.classList.add('active');
                defaultTab.style.background = '#8b4513';
                defaultTab.style.color = '#fff';

                renderTypeRadar(chartDiv, type);
            });

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chartContainer.classList.remove('active');
            });

            container.appendChild(item);
        });

        // 绘制S曲线 (延时确保DOM渲染完成)
        setTimeout(drawSCurve, 100);
    }

    function renderTypeRadar(dom, typeData) {
        if (!typeData.vizData) return;

        let chart = echarts.getInstanceByDom(dom);
        if (!chart) {
            chart = echarts.init(dom);
        }

        // 清除可能存在的其他类型图表配置
        chart.clear();
        const data = typeData.vizData;

        const option = {
            title: {
                text: typeData.name + '综合评估',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 20,
                    fontFamily: chartStyle.fontTitle,
                    color: chartStyle.colorText
                }
            },
            tooltip: { trigger: 'item' },
            radar: {
                indicator: [
                    { name: '烧成温度', max: 10 },
                    { name: '工艺难度', max: 10 },
                    { name: '艺术表现', max: 10 },
                    { name: '历史地位', max: 10 }
                ],
                radius: '55%', // 适度调整半径
                center: ['50%', '50%'], // 上移中心位置
                splitNumber: 4,
                splitArea: {
                    areaStyle: {
                        color: chartStyle.colorSplitArea
                    }
                },
                axisName: {
                    color: chartStyle.colorSubText,
                    fontFamily: chartStyle.fontBody,
                    padding: [3, 5]
                }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: data.radar,
                    name: '各项指标 (1-10)',
                    itemStyle: { color: '#8b4513' },
                    areaStyle: {
                        opacity: 0.6,
                        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                            { color: 'rgba(139, 69, 19, 0.2)', offset: 0 },
                            { color: 'rgba(139, 69, 19, 0.8)', offset: 1 }
                        ])
                    }
                }]
            }],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    bottom: 10, // 下移文字至底部
                    style: {
                        text: `类型: ${data.attr.type} | 典型温度: ${data.attr.temp}`,
                        fontSize: 12,
                        fill: '#888'
                    }
                }
            ]
        };

        chart.setOption(option);

        // 自适应大小
        window.addEventListener('resize', () => chart.resize());
    }

    function drawSCurve() {
        const wrapper = document.querySelector('.s-timeline-wrapper');
        const svg = document.querySelector('.s-curve-svg');
        const path = document.getElementById('s-curve-path');
        const markers = document.querySelectorAll('.timeline-marker');
        const contentContainer = document.querySelector('.types-content');

        if (markers.length === 0) return;

        // 获取容器相对于视口的位置，用于计算相对坐标
        const wrapperRect = wrapper.getBoundingClientRect();
        const contentRect = contentContainer.getBoundingClientRect();

        // 更新SVG高度以匹配内容高度
        const totalHeight = contentContainer.scrollHeight;
        svg.style.height = `${totalHeight}px`;

        // 计算所有标记点的中心坐标 (相对于 types-content)
        const points = Array.from(markers).map(marker => {
            const rect = marker.getBoundingClientRect();
            // 计算相对于 contentContainer 的坐标
            // 注意：contentContainer 可能被滚动，但这里我们想要的是相对于文档流的顶部
            // 实际上，因为 SVG 是 absolute 定位在 types-content 内，我们需要相对于 types-content 的坐标
            return {
                x: rect.left - contentRect.left + rect.width / 2,
                y: rect.top - contentRect.top + rect.height / 2
            };
        });

        // 生成平滑曲线路径
        if (points.length > 0) {
            let d = `M ${wrapperRect.width / 2} 0`; // 起点：容器顶部中心

            // 连接到第一个点
            d += ` C ${wrapperRect.width / 2} ${points[0].y / 2}, ${points[0].x} ${points[0].y / 2}, ${points[0].x} ${points[0].y}`;

            // 连接后续点
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const midY = (p1.y + p2.y) / 2;

                // 使用三次贝塞尔曲线连接
                d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
            }

            // 延伸到底部
            const lastPoint = points[points.length - 1];
            d += ` C ${lastPoint.x} ${totalHeight}, ${wrapperRect.width / 2} ${totalHeight}, ${wrapperRect.width / 2} ${totalHeight}`;

            path.setAttribute('d', d);
        }
    }



    // 初始化总览图表
    function initOverviewCharts() {
        const barContainer = document.getElementById('kiln-bar-chart');
        const pieContainer = document.getElementById('ceramic-pie-chart');

        if (barContainer && !barChart) {
            barChart = echarts.init(barContainer);
        }
        if (pieContainer && !pieChart) {
            pieChart = echarts.init(pieContainer);
        }
    }

    // 渲染总览图表
    function renderOverviewCharts() {
        initOverviewCharts();

        // 柱状图配置
        const barOption = {
            title: {
                text: '中国历代窑口数量分布',
                subtext: '数据样本来源：基于《中国陶瓷史》及各省考古普查数据',
                left: 'center',
                textStyle: { fontFamily: chartStyle.fontTitle, color: chartStyle.colorText, fontSize: 18 },
                subtextStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#8b4513',
                textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
            },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: ['新石器时代', '夏商周', '秦汉', '魏晋南北朝', '隋', '唐', '宋', '辽金西夏', '元', '明', '清'],
                axisLabel: { interval: 0, rotate: 45, fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                axisLine: { lineStyle: { color: chartStyle.colorAxis } }
            },
            yAxis: {
                type: 'value',
                name: '主要窑址数量',
                nameTextStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                axisLabel: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                splitLine: { lineStyle: { type: 'dashed', color: '#ccc' } }
            },
            series: [{
                data: [120, 180, 300, 350, 80, 800, 1300, 550, 450, 300, 220],
                type: 'bar',
                itemStyle: {
                    color: function (params) {
                        const colors = ['#d2691e', '#8b4513', '#a0522d', '#4169e1', '#789262', '#bfbfbf', '#7cc5d0', '#deb887', '#1e3c72', '#ffd700', '#ff69b4'];
                        return colors[params.dataIndex] || '#5470c6';
                    },
                    borderRadius: [5, 5, 0, 0]
                }
            }]
        };

        // 饼状图配置
        const pieOption = {
            title: {
                text: '中国各朝代出土/馆藏陶瓷数量占比',
                subtext: '基于主要博物馆馆藏及全国可移动文物普查数据估算',
                left: 'center',
                textStyle: { fontFamily: chartStyle.fontTitle, color: chartStyle.colorText, fontSize: 18 },
                subtextStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#8b4513',
                textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                textStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                data: ['新石器时代', '夏商周', '秦汉', '魏晋南北朝', '隋', '唐', '宋', '辽金西夏', '元', '明', '清']
            },
            series: [{
                name: '出土陶瓷朝代分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold',
                        formatter: '{b}\n{d}%'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 4, name: '新石器时代', itemStyle: { color: '#d2691e' } },
                    { value: 2, name: '夏商周', itemStyle: { color: '#8b4513' } },
                    { value: 9, name: '秦汉', itemStyle: { color: '#a0522d' } },
                    { value: 4, name: '魏晋南北朝', itemStyle: { color: '#4169e1' } },
                    { value: 1, name: '隋', itemStyle: { color: '#789262' } },
                    { value: 9, name: '唐', itemStyle: { color: '#bfbfbf' } },
                    { value: 12, name: '宋', itemStyle: { color: '#7cc5d0' } },
                    { value: 3, name: '辽金西夏', itemStyle: { color: '#deb887' } },
                    { value: 4, name: '元', itemStyle: { color: '#1e3c72' } },
                    { value: 24, name: '明', itemStyle: { color: '#ffd700' } },
                    { value: 28, name: '清', itemStyle: { color: '#ff69b4' } }
                ]
            }]
        };

        if (barChart) {
            barChart.clear();
            barChart.setOption(barOption);
        }
        if (pieChart) {
            pieChart.clear();
            pieChart.setOption(pieOption);
        }
    }

    // 渲染朝代专属图表
    function renderDynastyCharts(data) {
        if (!data.charts) return;

        initOverviewCharts(); // 确保图表实例被初始化

        // 1. 饼图 (左侧 - 产业结构/产品分布)
        // 1. 饼图 (左侧 - 产业结构/产品分布)
        const distributionOption = {
            title: {
                text: data.charts.distribution.name,
                left: 'center',
                textStyle: { fontFamily: chartStyle.fontTitle, color: chartStyle.colorText, fontSize: 18 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#8b4513',
                textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
            },
            legend: {
                top: 'bottom',
                textStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText }
            },
            series: [{
                name: '产品分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false, position: 'center' },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold',
                        formatter: '{b}\n{d}%'
                    }
                },
                labelLine: { show: false },
                data: data.charts.distribution.data
            }]
        };

        // 2. 雷达图 (右侧 - 综合评估)
        const radarOption = {
            title: {
                text: '陶瓷文明综合评估',
                left: 'center',
                textStyle: { fontFamily: chartStyle.fontTitle, color: chartStyle.colorText, fontSize: 18 }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#8b4513',
                textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
            },
            radar: {
                indicator: data.charts.radar.indicator,
                center: ['50%', '55%'], // Adjust center to avoid title overlap
                radius: '60%', // Adjust radius
                axisName: {
                    color: chartStyle.colorSubText,
                    fontFamily: chartStyle.fontBody
                },
                splitArea: {
                    areaStyle: {
                        color: chartStyle.colorSplitArea
                    }
                }
            },
            series: [{
                name: '综合能力',
                type: 'radar',
                data: data.charts.radar.data,
                areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                        { color: 'rgba(139, 69, 19, 0.4)', offset: 0 },
                        { color: 'rgba(139, 69, 19, 0.8)', offset: 1 }
                    ])
                },
                lineStyle: {
                    color: '#8b4513'
                },
                itemStyle: {
                    color: '#8b4513'
                }
            }]
        };

        if (barChart) {
            barChart.clear();
            barChart.setOption(distributionOption);
        }
        if (pieChart) {
            pieChart.clear();
            pieChart.setOption(radarOption);
        }
    }

    // --- 陶瓷工艺板块逻辑 ---
    function initCraftSection() {
        const container = document.getElementById('craft-steps-container');
        if (!container) return;

        container.innerHTML = '';

        craftSteps.forEach((step, index) => {
            const card = document.createElement('div');
            card.className = `craft-step-card ${index === 0 ? 'active' : ''}`;
            card.innerHTML = `
                <div class="craft-step-img">
                    <img src="${step.imageUrl}" alt="${step.name}">
                </div>
                <div class="craft-step-info">
                    <h3>${step.name}</h3>
                </div>
            `;

            card.addEventListener('click', () => {
                // 更新选中状态
                document.querySelectorAll('.craft-step-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // 更新内容
                updateCraftContent(index);
            });

            container.appendChild(card);
        });

        // 初始化显示第一个步骤
        if (craftSteps.length > 0) {
            updateCraftContent(0);
        }
    }

    function updateCraftContent(index) {
        const step = craftSteps[index];
        const descEl = document.getElementById('chart-description');
        const chartContainer = document.getElementById('craft-chart-container');

        // 更新描述
        if (descEl) {
            descEl.innerHTML = `<strong>${step.name}</strong>：${step.description}`;
        }

        // 渲染图表
        if (chartContainer) {
            renderCraftChart(step.chartType, step.chartData);
        }
    }

    function renderCraftChart(type, data) {
        const chartContainer = document.getElementById('craft-chart-container');
        if (!craftChart) {
            craftChart = echarts.init(chartContainer);
            // 响应窗口大小变化
            window.addEventListener('resize', () => {
                if (craftChart) craftChart.resize();
            });
        }

        craftChart.clear();

        let option = {};

        // 通用配置 - 增加 itemGap 以分离标题和副标题
        // 通用配置 - 增加 itemGap 以分离标题和副标题
        const commonTitle = {
            text: data.name || '数据分析',
            subtext: data.description || '',
            left: 'center',
            top: 10,
            itemGap: 10, // 标题和副标题的间距
            textStyle: { fontFamily: chartStyle.fontTitle, color: '#5d4037', fontSize: 20 },
            subtextStyle: {
                color: chartStyle.colorSubText,
                fontSize: 12,
                fontFamily: chartStyle.fontBody,
                lineHeight: 18,
                width: 320, // 增加宽度
                overflow: 'break'
            }
        };
        const commonTooltip = {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#8b4513',
            textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
        };

        if (type === 'material') {
            // 南丁格尔玫瑰图 / 饼图
            option = {
                title: commonTitle,
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: { bottom: '0%' },
                series: [{
                    name: '成分',
                    type: 'pie',
                    radius: [20, 80], // 稍微减小半径
                    center: ['50%', '60%'], // 下移中心点
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: true,
                        formatter: '{b}\n{d}%'
                    },
                    data: data.data
                }]
            };
        } else if (type === 'temperature') {
            // 升温曲线 (折线图)
            option = {
                title: commonTitle,
                tooltip: { trigger: 'axis' },
                grid: { top: 100, bottom: 30, left: 50, right: 30 }, // 增加顶部空间
                xAxis: {
                    type: 'category',
                    data: data.xAxis,
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                    name: '温度(°C)',
                    max: 1400,
                    nameTextStyle: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                    axisLabel: { fontFamily: chartStyle.fontBody, color: chartStyle.colorSubText },
                    splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
                },
                series: [{
                    data: data.data,
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(139, 69, 19, 0.6)' },
                            { offset: 1, color: 'rgba(139, 69, 19, 0.1)' }
                        ])
                    },
                    lineStyle: { width: 3, color: '#8b4513' },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最高温' }
                        ],
                        itemStyle: { color: '#cd5c5c' }
                    }
                }]
            };
        } else if (type === 'yield') {
            // 仪表盘 (良品率)
            option = {
                title: commonTitle,
                series: [{
                    type: 'gauge',
                    center: ['50%', '65%'], // 下移中心
                    radius: '80%', // 调整半径
                    progress: { show: true, width: 10, itemStyle: { color: chartStyle.colorAxis } }, // 调整颜色
                    axisLine: { lineStyle: { width: 10, color: [[1, '#eaddcf']] } }, // 背景色
                    pointer: { itemStyle: { color: chartStyle.colorAxis } },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}%',
                        offsetCenter: [0, '70%'],
                        fontSize: 24,
                        fontFamily: chartStyle.fontTitle,
                        color: chartStyle.colorText
                    },
                    data: [{ value: data.yield, name: '良品率', title: { show: true, offsetCenter: [0, '40%'], color: chartStyle.colorSubText, fontSize: 14 } }]
                }]
            };
        } else if (type === 'workload') {
            // 漏斗图 (工时/投入)
            option = {
                title: commonTitle,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}%",
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#8b4513',
                    textStyle: { color: chartStyle.colorText, fontFamily: chartStyle.fontBody }
                },
                series: [{
                    name: '工时投入',
                    type: 'funnel',
                    left: '10%',
                    top: 100, // 增加顶部距离
                    bottom: 20,
                    width: '80%',
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        show: true,
                        position: 'inside',
                        fontFamily: chartStyle.fontBody,
                        color: '#fff'
                    },
                    labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
                    itemStyle: { borderColor: '#fff', borderWidth: 1 },
                    emphasis: { label: { fontSize: 20 } },
                    data: data.data
                }]
            };
        }

        craftChart.setOption(option);
    }



    /**
     * 渲染化学成分柱状图
     */
    function renderTypeComposition(dom, typeData) {
        if (!typeData.vizData || !typeData.vizData.composition) {
            let chart = echarts.getInstanceByDom(dom);
            if (chart) chart.dispose();
            dom.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;color:#888;">暂无化学成分数据</div>';
            return;
        }

        let chart = echarts.getInstanceByDom(dom);
        if (!chart) {
            chart = echarts.init(dom);
        }
        chart.clear();

        const compData = typeData.vizData.composition;
        const xAxisData = Object.keys(compData);
        const seriesData = Object.values(compData);

        const option = {
            title: {
                text: typeData.name + '化学成分分析',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 20,
                    fontFamily: chartStyle.fontTitle,
                    color: chartStyle.colorText
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: '{b}: {c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    interval: 0,
                    rotate: 30, // 稍微倾斜以防重叠
                    color: chartStyle.colorSubText,
                    fontFamily: chartStyle.fontBody
                },
                axisTick: { alignWithLabel: true },
                axisLine: { lineStyle: { color: chartStyle.colorAxis } }
            },
            yAxis: {
                type: 'value',
                name: '含量 (%)',
                nameTextStyle: {
                    color: chartStyle.colorSubText,
                    align: 'right'
                },
                axisLabel: {
                    color: chartStyle.colorSubText,
                    fontFamily: chartStyle.fontBody
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#e0e0e0'
                    }
                }
            },
            series: [{
                name: '化学成分',
                type: 'bar',
                barWidth: '60%',
                data: seriesData,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#8b4513' },
                        { offset: 0.5, color: '#a0522d' },
                        { offset: 1, color: '#cd853f' }
                    ]),
                    borderRadius: [5, 5, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    fontSize: 10,
                    color: chartStyle.colorSubText
                }
            }]
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    /**
     * 设置作者信息弹窗交互
     */
    function setupAuthorModal() {
        const logo = document.getElementById('site-logo');
        const modal = document.getElementById('author-modal');
        const closeBtn = document.querySelector('.close-author');

        if (logo && modal && closeBtn) {
            // 点击Logo打开弹窗
            logo.addEventListener('click', () => {
                modal.style.display = 'block';
                // 使用现有的淡入动画
                const content = modal.querySelector('.modal-content');
                content.style.animation = 'none';
                content.offsetHeight; /* 触发重绘 */
                content.style.animation = 'lightboxFadeIn 0.3s forwards';
            });

            // 点击关闭按钮
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // 点击外部关闭
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

});
