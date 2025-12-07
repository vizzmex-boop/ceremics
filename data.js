/**
 * 静态数据文件
 * 包含：朝代信息、陶瓷种类、工序流程
 * 数据源：《中国陶瓷史》
 */

// 朝代与窑口数据
// 顺序：新石器 -> 清朝
const dynasties = [
    {
        id: "neolithic",
        name: "新石器时代",
        period: "约公元前8000年 - 公元前2000年",
        description: "中国陶瓷的起源时期。陶器的发明是人类文明发展的重要标志。这一时期以红陶、灰陶、黑陶和白陶为主。仰韶文化的彩陶以其绚丽的纹饰著称，龙山文化的黑陶则以薄如蛋壳的精湛工艺代表了当时的最高水平。",
        features: [
            "陶器的发明：人类第一次将粘土转化为耐用器皿",
            "仰韶文化彩陶：红底黑彩，纹饰优美，图案包含人面、鱼纹等",
            "龙山文化黑陶：黑、薄、光、纽，'蛋壳陶'薄如蝉翼",
            "制作工艺：从早期的手制（泥条盘筑）发展到晚期的轮制技术"
        ],
        locations: [
            { name: "大地湾遗址", type: "culture", category: "painted", coords: [105.90, 35.00] }, // 甘肃天水 (早期彩陶)
            { name: "半坡遗址", type: "culture", category: "painted", coords: [109.05, 34.27] },   // 陕西西安 (人面鱼纹)
            { name: "磁山遗址", type: "culture", category: "red_pottery", coords: [113.97, 36.79] }, // 河北武安
            { name: "裴李岗遗址", type: "culture", category: "red_pottery", coords: [113.73, 34.40] }, // 河南新郑
            { name: "仰韶文化", type: "culture", category: "painted", coords: [111.93, 34.77] }, // 河南渑池 (彩陶)
            { name: "马家窑文化", type: "culture", category: "painted", coords: [103.82, 35.98] }, // 甘肃临洮 (彩陶巅峰)
            { name: "大溪文化", type: "culture", category: "painted", coords: [109.88, 31.08] },   // 重庆巫山 (红陶/彩陶)
            { name: "屈家岭文化", type: "culture", category: "painted", coords: [113.11, 31.03] }, // 湖北京山 (蛋壳彩陶)

            { name: "龙山文化", type: "culture", category: "black", coords: [117.53, 36.72] },   // 山东章丘 (黑陶/蛋壳陶)
            { name: "良渚文化", type: "culture", category: "black", coords: [119.99, 30.42] },   // 浙江杭州 (黑陶)
            { name: "河姆渡文化", type: "culture", category: "black", coords: [121.35, 29.98] }, // 浙江余姚 (黑陶/炭黑)
            { name: "齐家文化", type: "culture", category: "black", coords: [103.57, 35.48] },   // 甘肃广河 (过渡期/黑陶)
            { name: "大汶口文化", type: "culture", category: "black", coords: [117.08, 36.20] }, // 山东泰安 (黑陶/白陶)
            { name: "马家浜文化", type: "culture", category: "black", coords: [120.75, 30.75] }, // 浙江嘉兴 (红陶/黑陶)
            { name: "崧泽文化", type: "culture", category: "black", coords: [121.12, 31.15] }    // 上海青浦 (黑陶)
        ],
        charts: {
            distribution: {
                name: "陶器类型分布",
                data: [
                    { value: 40, name: "红陶" },
                    { value: 30, name: "灰陶" },
                    { value: 20, name: "黑陶" },
                    { value: 10, name: "彩陶" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [3, 6, 8, 3, 2],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "xia-shang-zhou",
        name: "夏商周",
        period: "约公元前2070年 - 公元前256年",
        description: "从陶向瓷过渡的关键时期。商代中期出现了'原始瓷器'，这是中国陶瓷史上的一次飞跃，标志着瓷器的滥觞。这一时期白陶工艺达到顶峰，图案刻划精美，与青铜器纹饰互为借鉴，体现了极高的艺术成就。",
        features: [
            "原始瓷器的诞生：商代中期出现，釉色青绿，质地坚硬",
            "白陶工艺巅峰：商代晚期白陶洁白如玉，雕刻精美饕餮纹",
            "印纹硬陶流行：长江以南地区广泛流行，纹饰丰富多样",
            "窑炉技术进步：高温窑炉的使用使烧成温度显著提高"
        ],
        locations: [
            { name: "二里头遗址", type: "culture", category: "white_pottery", coords: [112.69, 34.69] }, // 河南偃师 (白陶)
            { name: "殷墟", type: "culture", category: "white_pottery", coords: [114.31, 36.12] },       // 河南安阳 (白陶巅峰)
            { name: "三星堆遗址", type: "culture", category: "proto_porcelain", coords: [104.20, 30.99] }, // 四川广汉 (陶器)
            { name: "盘龙城遗址", type: "culture", category: "proto_porcelain", coords: [114.26, 30.69] }, // 湖北武汉 (硬陶)
            { name: "郑州商城", type: "kiln", category: "proto_porcelain", coords: [113.69, 34.75] },    // 原始瓷出土
            { name: "吴城遗址", type: "kiln", category: "proto_porcelain", coords: [115.58, 28.01] },    // 江西清江 (原始瓷)
            { name: "二里岗", type: "kiln", category: "impressed_pottery", coords: [113.65, 34.72] }     // 河南郑州 (印纹硬陶)
        ],
        charts: {
            distribution: {
                name: "产品类型构成",
                data: [
                    { value: 70, name: "灰陶" },
                    { value: 15, name: "印纹硬陶" },
                    { value: 10, name: "原始瓷" },
                    { value: 5, name: "白陶" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [5, 5, 7, 4, 3],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "qin-han",
        name: "秦汉",
        period: "公元前221年 - 公元220年",
        description: "陶瓷业迅速发展，完成了从陶到瓷的质变。秦兵马俑代表了陶塑艺术的高峰，气势恢宏。汉代釉陶广泛流行，特别是低温铅釉陶的烧制成功。东汉晚期，成熟青瓷在越窑烧制成功，中国正式进入瓷器时代。",
        features: [
            "秦兵马俑：陶塑艺术的巅峰制作，写实主义风格",
            "汉代釉陶：绿釉、黄釉等低温铅釉陶广泛用于随葬和日常生活",
            "成熟青瓷诞生：东汉晚期上虞等地烧制出成熟青瓷",
            "越窑青瓷初具规模：南方青瓷逐步发展，北方陶瓷业积蓄力量"
        ],
        locations: [
            { name: "秦始皇陵", type: "culture", category: "terracotta", coords: [109.27, 34.38] },   // 兵马俑 (陶塑)
            { name: "马王堆汉墓", type: "culture", category: "glazed_pottery", coords: [113.02, 28.21] }, // 湖南长沙 (彩绘陶/漆器)
            { name: "满城汉墓", type: "culture", category: "glazed_pottery", coords: [115.32, 38.95] },   // 河北保定
            { name: "南越王墓", type: "culture", category: "glazed_pottery", coords: [113.25, 23.14] },   // 广东广州
            { name: "上虞窑", type: "kiln", category: "celadon", coords: [120.87, 30.03] },        // 早期越窑 (成熟青瓷)
            { name: "长沙窑", type: "kiln", category: "glazed_pottery", coords: [112.98, 28.25] },    // 早期发展 (釉陶)
            { name: "宜兴窑", type: "kiln", category: "proto_porcelain", coords: [119.82, 31.36] },   // 江苏宜兴 (原始瓷)
            { name: "德清窑", type: "kiln", category: "black_porcelain", coords: [119.97, 30.54] }    // 浙江德清 (早期黑瓷)
        ],
        charts: {
            distribution: {
                name: "陶瓷产品占比",
                data: [
                    { value: 50, name: "灰陶" },
                    { value: 30, name: "釉陶" },
                    { value: 15, name: "早期青瓷" },
                    { value: 5, name: "原始瓷" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [6, 7, 6, 7, 4],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "three-kingdoms",
        name: "三国两晋南北朝",
        period: "公元220年 - 581年",
        description: "陶瓷发展的变革与融合期。南方越窑青瓷持续稳步发展，北方则成功烧制出早期白瓷，为后世'南青北白'格局奠定了基础。佛教的兴盛深刻影响了陶瓷造型与纹饰，莲花尊等带有佛教色彩的器物大量出现。",
        features: [
            "南青北白雏形：南方越窑、瓯窑规模扩大，北方白瓷诞生",
            "北方白瓷突破：北朝时期成功烧制出白瓷，打破青瓷一统天下",
            "佛教艺术影响：莲花瓣纹、佛像等成为流行装饰",
            "独特造型：鸡首壶等造型反映了当时的审美情趣"
        ],
        locations: [
            { name: "越窑", type: "kiln", category: "celadon", coords: [121.03, 30.14] },          // 浙江慈溪 (青瓷)
            { name: "德清窑", type: "kiln", category: "black_porcelain", coords: [119.97, 30.54] }, // 浙江德清 (黑瓷)
            { name: "洪州窑", type: "kiln", category: "celadon", coords: [115.82, 28.27] },        // 江西丰城 (青瓷)
            { name: "相州窑", type: "kiln", category: "white", coords: [114.35, 36.10] },          // 河南安阳 (北朝白瓷)
            { name: "瓯窑", type: "kiln", category: "celadon", coords: [120.65, 28.01] },          // 浙江温州 (青瓷)
            { name: "婺州窑", type: "kiln", category: "celadon", coords: [119.64, 29.08] },        // 浙江金华 (青瓷)
            { name: "邛窑", type: "kiln", category: "celadon", coords: [103.46, 30.41] }           // 四川邛崃 (青瓷)
        ],
        charts: {
            distribution: {
                name: "青白瓷格局",
                data: [
                    { value: 75, name: "青瓷" },
                    { value: 15, name: "黑瓷" },
                    { value: 10, name: "早期白瓷" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [7, 6, 7, 6, 4],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "sui",
        name: "隋朝",
        period: "581年 - 618年",
        description: "承前启后的短暂时期。白瓷生产技术取得突破性进展，邢窑白瓷'类银类雪'，与南方越窑青瓷并驾齐驱。青瓷生产也更加成熟，釉色更加晶莹。这一时期的发展为唐代陶瓷的繁荣奠定了坚实基础。",
        features: [
            "白瓷技术大突破：邢窑白瓷洁白细腻，透光性好",
            "青瓷工艺成熟：淮南窑、湘阴窑等青瓷质量显著提高",
            "窑炉改进：馒头窑和龙窑的结构进一步优化",
            "器型风格：趋向饱满、大气，体现了时代的雄浑风格"
        ],
        locations: [
            { name: "湘阴窑", type: "kiln", category: "celadon", coords: [112.90, 28.68] },        // 湖南湘阴 (青瓷)
            { name: "邢窑", type: "kiln", category: "white", coords: [114.50, 37.43] },          // 河北内丘 (白瓷)
            { name: "安阳窑", type: "kiln", category: "white", coords: [114.35, 36.10] },        // 河南安阳 (白瓷)
            { name: "寨里窑", type: "kiln", category: "celadon", coords: [117.95, 36.65] },        // 山东淄博 (青瓷)
            { name: "寿州窑", type: "kiln", category: "celadon", coords: [116.98, 32.62] },        // 安徽淮南 (青瓷)
            { name: "邛崃窑", type: "kiln", category: "celadon", coords: [103.46, 30.41] },        // 四川邛崃 (青瓷)
            { name: "洪州窑", type: "kiln", category: "celadon", coords: [115.78, 28.19] }         // 江西丰城 (青瓷)
        ],
        charts: {
            distribution: {
                name: "产品类型分布",
                data: [
                    { value: 60, name: "青瓷" },
                    { value: 40, name: "白瓷" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [7, 6, 6, 6, 5],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "tang",
        name: "唐朝",
        period: "618年 - 907年",
        description: "中国陶瓷史上的繁荣时期，正式形成了'南青北白'的壮阔局面。南方越窑'类玉类冰'，北方邢窑'类银类雪'。唐三彩作为一种多彩低温釉陶，以其绚丽的色彩和生动的造型闻名于世，通过丝绸之路传播到世界各地。",
        features: [
            "南青北白：越窑青瓷与邢窑白瓷并峙，代表当时最高水平",
            "唐三彩：黄、绿、白等多彩釉色，造型生动，主要用于陪葬",
            "长沙窑创新：首创铜红釉和釉下褐彩，将诗书画引入瓷器装饰",
            "秘色瓷：越窑青瓷中的极品，釉色千峰翠色，专供皇室"
        ],
        locations: [
            // 南方青瓷
            { name: "越窑", type: "kiln", category: "celadon", coords: [121.03, 30.14] },      // 浙江慈溪
            { name: "温州窑", type: "kiln", category: "celadon", coords: [120.65, 28.01] },    // 浙江温州
            { name: "婺州窑", type: "kiln", category: "celadon", coords: [119.64, 29.12] },    // 浙江金华
            { name: "寿州窑", type: "kiln", category: "celadon", coords: [116.98, 32.62] },    // 安徽淮南
            { name: "邛崃窑", type: "kiln", category: "celadon", coords: [103.46, 30.41] },    // 四川邛崃
            { name: "洪州窑", type: "kiln", category: "celadon", coords: [115.78, 28.19] },    // 江西丰城
            { name: "西村窑", type: "kiln", category: "celadon", coords: [113.23, 23.16] },    // 广东广州
            { name: "岳州窑", type: "kiln", category: "celadon", coords: [113.12, 29.37] },    // 湖南岳阳
            { name: "长沙窑", type: "kiln", category: "celadon", coords: [112.98, 28.25] },    // 湖南长沙（青釉褐彩）

            // 北方白瓷
            { name: "邢窑", type: "kiln", category: "white", coords: [114.50, 37.43] },        // 河北内丘
            { name: "定窑", type: "kiln", category: "white", coords: [114.68, 38.62] },        // 河北曲阳
            { name: "磁州窑", type: "kiln", category: "white", coords: [114.38, 36.43] },      // 河北邯郸
            { name: "巩义窑", type: "kiln", category: "white", coords: [113.03, 34.75] },      // 河南巩义（也烧三彩）
            { name: "鲁山窑", type: "kiln", category: "black_porcelain", coords: [112.90, 33.74] }, // 河南鲁山 (花釉)
            { name: "密县窑", type: "kiln", category: "white", coords: [113.38, 34.52] },      // 河南新密
            { name: "浑源窑", type: "kiln", category: "white", coords: [113.68, 39.69] },      // 山西浑源
            { name: "景德镇窑", type: "kiln", category: "white", coords: [117.20, 29.29] }     // 江西景德镇
        ],
        charts: {
            distribution: {
                name: "南青北白格局",
                data: [
                    { value: 40, name: "青瓷 (越窑等)" },
                    { value: 40, name: "白瓷 (邢窑等)" },
                    { value: 15, name: "唐三彩" },
                    { value: 5, name: "花釉/黑釉" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [8, 8, 8, 9, 9],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "song",
        name: "宋朝",
        period: "960年 - 1279年",
        description: "中国陶瓷艺术的巅峰时期，名窑遍布各地，百花齐放。五大名窑（汝、官、哥、钧、定）各具特色，代表了宋瓷的高雅品位。宋瓷讲究釉色之美，追求含蓄、内敛、沉静的雅致风格，达到了美学的极致。八大窑系形成，民窑与官窑争奇斗艳。",
        features: [
            "五大名窑：汝窑天青、官窑紫口铁足、哥窑金丝铁线、钧窑窑变、定窑印花",
            "八大窑系：定窑、磁州窑、耀州窑、钧窑、龙泉窑、景德镇、建窑、越窑",
            "景德镇青白瓷：色质如玉，声如磬，被称为'饶玉'",
            "黑釉茶盏：伴随斗茶风俗，建盏、吉州窑木叶盏盛行"
        ],
        locations: [
            // 五大名窑
            { name: "汝窑", type: "kiln", category: "ru", coords: [112.87, 33.87] },          // 河南宝丰 (天青)
            { name: "官窑", type: "kiln", category: "guan", coords: [114.33, 34.80] },        // 开封/杭州 (紫口铁足)
            { name: "哥窑", type: "kiln", category: "ge", coords: [119.92, 28.05] },          // 浙江龙泉 (金丝铁线)
            { name: "钧窑", type: "kiln", category: "jun", coords: [113.37, 34.15] },         // 河南禹州 (入窑一色出窑万彩)
            { name: "定窑", type: "kiln", category: "ding", coords: [114.68, 38.62] },        // 河北曲阳 (白瓷)

            // 定窑系 (白瓷)
            { name: "介休窑", type: "kiln", category: "ding_type", coords: [111.91, 37.02] }, // 山西介休
            { name: "平定窑", type: "kiln", category: "ding_type", coords: [113.63, 37.79] }, // 山西平定
            { name: "彭县窑", type: "kiln", category: "ding_type", coords: [103.94, 30.99] }, // 四川彭州
            { name: "萧县窑", type: "kiln", category: "ding_type", coords: [116.94, 34.19] }, // 安徽萧县

            // 磁州窑系 (民窑巨擘)
            { name: "磁州窑", type: "kiln", category: "cizhou", coords: [114.38, 36.37] },    // 河北磁县
            { name: "登封窑", type: "kiln", category: "cizhou", coords: [113.02, 34.45] },    // 河南登封
            { name: "扒村窑", type: "kiln", category: "cizhou", coords: [113.46, 34.16] },    // 河南禹州
            { name: "当阳峪窑", type: "kiln", category: "cizhou", coords: [113.36, 35.29] },  // 河南修武
            { name: "鹤壁集窑", type: "kiln", category: "cizhou", coords: [114.20, 35.90] },  // 河南鹤壁
            { name: "博山窑", type: "kiln", category: "cizhou", coords: [117.86, 36.49] },    // 山东淄博

            // 耀州窑系 (北方青瓷)
            { name: "耀州窑", type: "kiln", category: "yaozhou", coords: [109.08, 35.10] },   // 陕西铜川
            { name: "临汝窑", type: "kiln", category: "yaozhou", coords: [112.84, 34.16] },   // 河南汝州
            { name: "宜阳窑", type: "kiln", category: "yaozhou", coords: [112.18, 34.51] },   // 河南宜阳
            { name: "内乡窑", type: "kiln", category: "yaozhou", coords: [111.85, 33.04] },   // 河南内乡
            { name: "永福窑", type: "kiln", category: "yaozhou", coords: [109.98, 24.98] },   // 广西永福

            // 景德镇窑系 (青白瓷)
            { name: "景德镇窑", type: "kiln", category: "jingdezhen", coords: [117.20, 29.30] }, // 江西景德镇
            { name: "吉州窑", type: "kiln", category: "jingdezhen", coords: [114.90, 27.11] },   // 江西吉安
            { name: "德化窑", type: "kiln", category: "jingdezhen", coords: [118.24, 25.49] },   // 福建德化
            { name: "泉州窑", type: "kiln", category: "jingdezhen", coords: [118.58, 24.90] },   // 福建泉州
            { name: "潮州窑", type: "kiln", category: "jingdezhen", coords: [116.63, 23.66] },   // 广东潮州

            // 龙泉窑系 (南方青瓷)
            { name: "龙泉窑", type: "kiln", category: "longquan", coords: [119.12, 28.08] },     // 浙江龙泉

            // 建窑系 (黑釉)
            { name: "建窑", type: "kiln", category: "jian", coords: [118.12, 27.33] }            // 福建建阳
        ],
        charts: {
            distribution: {
                name: "八大窑系产品占比",
                data: [
                    { value: 35, name: "青瓷 (龙泉/耀州)" },
                    { value: 25, name: "白瓷 (定窑系)" },
                    { value: 20, name: "青白瓷 (景德镇)" },
                    { value: 10, name: "黑釉 (建/吉)" },
                    { value: 10, name: "钧釉/磁州" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [9, 10, 8, 9, 9],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "liao-jin-xixia",
        name: "辽金西夏",
        period: "907年 - 1227年",
        description: "民族特色鲜明的陶瓷发展时期。辽代陶瓷造型多模仿契丹族皮囊容器，如鸡冠壶，风格独特。金代陶瓷在继承中原磁州窑风格基础上，粗犷豪放，创烧了红绿彩。西夏灵武窑则以剔刻花工艺著称，纹饰具有浓郁的民族风情。",
        features: [
            "辽代特色：鸡冠壶、凤首瓶等契丹民族造型，辽三彩",
            "金代红绿彩：磁州窑系创烧釉上红绿彩，开彩瓷先河",
            "西夏灵武窑：剔刻花装饰，党项族风格，胎体厚重",
            "风格融合：中原制瓷技术与北方游牧民族文化的完美结合"
        ],
        locations: [
            // 辽代窑口 (内蒙古、辽宁)
            { name: "缸瓦屯窑", type: "kiln", category: "liao", coords: [118.96, 42.28] },    // 内蒙古赤峰 (辽代官窑)
            { name: "林东窑", type: "kiln", category: "liao", coords: [119.53, 43.98] },      // 内蒙古巴林左旗 (辽上京)
            { name: "江官屯窑", type: "kiln", category: "liao", coords: [123.20, 41.28] },    // 辽宁辽阳
            { name: "大官屯窑", type: "kiln", category: "liao", coords: [124.08, 41.87] },    // 辽宁抚顺

            // 金代窑口 (山西)
            { name: "大同窑", type: "kiln", category: "jin", coords: [113.29, 40.09] },       // 山西大同
            { name: "怀仁窑", type: "kiln", category: "jin", coords: [113.10, 39.82] },       // 山西怀仁
            { name: "浑源窑", type: "kiln", category: "jin", coords: [113.69, 39.70] },       // 山西浑源

            // 西夏窑口
            { name: "灵武窑", type: "kiln", category: "xixia", coords: [106.33, 38.10] },    // 宁夏灵武

            // 金代继续烧造的名窑
            { name: "定窑", type: "kiln", category: "ding", coords: [114.68, 38.62] },        // 金代继续烧造
            { name: "磁州窑", type: "kiln", category: "cizhou", coords: [114.38, 36.37] }     // 金代继续烧造
        ],
        charts: {
            distribution: {
                name: "民族特色陶瓷分布",
                data: [
                    { value: 40, name: "白瓷/白地黑花" },
                    { value: 20, name: "辽三彩" },
                    { value: 20, name: "黑釉/褐釉" },
                    { value: 20, name: "青瓷" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [7, 8, 7, 6, 4],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "yuan",
        name: "元朝",
        period: "1271年 - 1368年",
        description: "继往开来的创新时期。景德镇窑在制瓷工艺上取得重大突破，成熟的青花瓷惊艳问世，釉里红瓷器也烧制成功。卵白釉（枢府瓷）的烧造为明初甜白釉奠定基础。元代瓷器胎体厚重，器型硕大，纹饰繁密，体现了蒙元文化的雄厚豪放。",
        features: [
            "青花瓷成熟：使用进口苏麻离青料，层次丰富，蓝白相映",
            "釉里红创烧：高温铜红釉下彩，烧成难度极高",
            "枢府瓷（卵白釉）：军事机构枢府定烧，釉质失透润泽",
            "大型器物：大罐、大盘流行，适应蒙古族饮食习惯"
        ],
        locations: [
            // 景德镇窑系 (元代中心)
            { name: "景德镇窑", type: "kiln", category: "jingdezhen_blue_white", coords: [117.20, 29.30] },      // 景德镇 (青花、釉里红、卵白釉等)

            // 龙泉窑系 (元代大发展)
            { name: "龙泉窑", type: "kiln", category: "longquan", coords: [119.12, 28.08] },        // 浙江龙泉 (外销瓷主力)

            // 钧窑系
            { name: "钧窑", type: "kiln", category: "jun", coords: [113.37, 34.15] },               // 河南禹州

            // 磁州窑系
            { name: "磁州窑", type: "kiln", category: "cizhou", coords: [114.38, 36.37] },          // 河北磁县

            // 其他地方名窑
            { name: "霍州窑", type: "kiln", category: "white", coords: [111.75, 36.56] },           // 山西霍州
            { name: "耀州窑", type: "kiln", category: "yaozhou", coords: [109.08, 35.10] },         // 陕西铜川
            { name: "定窑", type: "kiln", category: "ding", coords: [114.68, 38.62] },              // 河北曲阳
            { name: "吉州窑", type: "kiln", category: "jizhou", coords: [114.90, 27.11] }           // 江西吉安
        ],
        charts: {
            distribution: {
                name: "元代陶瓷产品构成",
                data: [
                    { value: 40, name: "青花瓷" },
                    { value: 30, name: "龙泉青瓷" },
                    { value: 15, name: "青白瓷" },
                    { value: 10, name: "钧釉" },
                    { value: 5, name: "釉里红/枢府" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [9, 8, 10, 9, 10],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "ming",
        name: "明朝",
        period: "1368年 - 1644年",
        description: "中国瓷器生产全面繁荣，景德镇成为全国制瓷中心，设立御窑厂。青花瓷成为主流，永乐、宣德青花苍古浓艳，成化青花淡雅秀美。彩瓷技术大发展，五彩、斗彩争奇斗艳。福建德化白瓷如'象牙白'，享誉海外。",
        features: [
            "景德镇御窑：专供宫廷，制度严苛，产品精益求精",
            "青花巅峰：永宣青花凝重，成化青花淡雅，各具神韵",
            "彩瓷大发展：成化斗彩（鸡缸杯）、嘉万五彩，色彩绚丽",
            "德化白瓷：色泽温润如玉，'中国白'风靡欧洲"
        ],
        locations: [
            // 景德镇御窑 (明代中心)
            { name: "景德镇御窑", type: "kiln", category: "jingdezhen_imperial", coords: [117.20, 29.30] },      // 景德镇 (御窑厂)

            // 地方名窑
            { name: "德化窑", type: "kiln", category: "dehua", coords: [118.24, 25.49] },           // 福建德化 (中国白)
            { name: "漳州窑", type: "kiln", category: "dehua", coords: [117.65, 24.51] },           // 福建平和 (克拉克瓷)
            { name: "宜兴窑", type: "kiln", category: "yixing", coords: [119.82, 31.36] },          // 江苏宜兴 (紫砂壶)
            { name: "石湾窑", type: "kiln", category: "shiwan", coords: [113.11, 23.02] },          // 广东佛山 (广钧)
            { name: "龙泉窑", type: "kiln", category: "longquan", coords: [119.12, 28.08] },        // 浙江龙泉 (走向衰落)
            { name: "磁州窑", type: "kiln", category: "cizhou", coords: [114.15, 36.42] }           // 河北彭城 (彭城窑)
        ],
        charts: {
            distribution: {
                name: "明代瓷器品类占比",
                data: [
                    { value: 60, name: "青花瓷" },
                    { value: 20, name: "彩瓷 (五彩/斗彩)" },
                    { value: 10, name: "白瓷 (德化)" },
                    { value: 10, name: "颜色釉/紫砂" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [9, 9, 9, 10, 10],
                        name: '综合评估'
                    }
                ]
            }
        }
    },
    {
        id: "qing",
        name: "清朝",
        period: "1644年 - 1911年",
        description: "中国古代陶瓷发展的集大成时期，制瓷工艺达到历史顶峰。康、雍、乾三朝盛世，官窑瓷器精美绝伦。粉彩的创烧与珐琅彩的引进，使瓷器色彩空前丰富。单色釉品种繁多，仿古与创新并举。",
        features: [
            "康雍乾盛世：工艺精湛，品质卓越，造型千变万化",
            "彩瓷新品：粉彩（软彩）柔和淡雅，珐琅彩富丽堂皇",
            "颜色釉集大成：郎窑红、豇豆红、胭脂红、茶叶末等几十种新釉色",
            "工艺极致：转心瓶、透雕等高难度工艺品的出现"
        ],
        locations: [
            // 景德镇御窑 (清代巅峰)
            { name: "景德镇御窑", type: "kiln", category: "jingdezhen_imperial", coords: [117.20, 29.30] },      // 景德镇 (集大成者)

            // 地方名窑 (百花齐放)
            { name: "磁州窑", type: "kiln", category: "cizhou", coords: [114.15, 36.42] },          // 河北彭城 (民窑主力)
            { name: "宜兴窑", type: "kiln", category: "yixing", coords: [119.82, 31.36] },          // 江苏宜兴 (紫砂巅峰)
            { name: "石湾窑", type: "kiln", category: "shiwan", coords: [113.11, 23.02] },          // 广东佛山 (陶塑)
            { name: "龙泉窑", type: "kiln", category: "longquan", coords: [119.12, 28.08] },        // 浙江龙泉 (继续烧造)
            { name: "德化窑", type: "kiln", category: "dehua", coords: [118.24, 25.49] },           // 福建德化 (青花/白瓷)
            { name: "钦州窑", type: "kiln", category: "qinzhou", coords: [108.62, 21.96] },         // 广西钦州 (坭兴陶)
            { name: "醴陵窑", type: "kiln", category: "fen_cai", coords: [113.50, 27.65] }          // 湖南醴陵 (釉下五彩)
        ],
        charts: {
            distribution: {
                name: "清代瓷器品种分布",
                data: [
                    { value: 40, name: "青花瓷" },
                    { value: 30, name: "彩瓷 (粉彩/珐琅)" },
                    { value: 20, name: "颜色釉" },
                    { value: 10, name: "其他品种" }
                ]
            },
            radar: {
                indicator: [
                    { name: '技术', max: 10 },
                    { name: '艺术', max: 10 },
                    { name: '创新', max: 10 },
                    { name: '产量', max: 10 },
                    { name: '影响', max: 10 }
                ],
                data: [
                    {
                        value: [10, 9, 9, 10, 10],
                        name: '综合评估'
                    }
                ]
            }
        }
    }
];

const ceramicTypes = [
    {
        id: "cai-tao",
        name: "彩陶",
        period: "新石器时代",
        description: "彩陶是新石器时代的一种陶器，以赭红、黑、白等色在陶胎上绘制纹饰，图案古朴抽象，具有极高的艺术价值。",
        features: ["赭红黑白", "古朴抽象", "新石器艺术"],
        imageUrl: "Pic/photo-2/彩陶.png",
        vizData: {
            radar: [6, 4, 9, 8], // 温度, 难度, 艺术, 历史
            attr: { type: "陶器", temp: "800℃-1000℃" },
            composition: { "SiO₂": 65.2, "Al₂O₃": 16.5, "Fe₂O₃": 6.5, "CaO": 3.5, "K₂O": 2.8, "MgO": 2.5, "Na₂O": 1.0, "其他": 2.0 }
        }
    },
    {
        id: "hei-tao",
        name: "黑陶",
        period: "新石器时代",
        description: "黑陶是龙山文化的典型代表，以'黑、薄、光、纽'为特征，蛋壳黑陶更是达到了陶器制作的巅峰。",
        features: ["黑薄光纽", "蛋壳陶", "龙山文化"],
        imageUrl: "Pic/photo-2/黑陶.png",
        vizData: {
            radar: [7, 9, 8, 7],
            attr: { type: "陶器", temp: "900℃-1050℃" },
            composition: { "SiO₂": 63.5, "Al₂O₃": 18.2, "Fe₂O₃": 6.8, "K₂O": 3.0, "CaO": 2.5, "MgO": 2.0, "Na₂O": 1.0, "其他": 3.0 }
        }
    },
    {
        id: "qing-ci",
        name: "青瓷",
        period: "东汉 - 清",
        description: "青瓷是中国最早出现的瓷器，以氧化铁为着色剂。越窑青瓷如冰似玉，龙泉青瓷翠绿莹润。",
        features: ["釉色青翠", "如冰似玉", "历史最久"],
        imageUrl: "Pic/photo-2/青瓷.png",
        vizData: {
            radar: [9, 7, 9, 10], // 高温, 中难, 高艺, 极广
            attr: { type: "瓷器", temp: "1200℃-1300℃" },
            composition: { "SiO₂": 68.5, "Al₂O₃": 13.5, "CaO": 11.5, "K₂O": 3.5, "Fe₂O₃": 1.8, "Na₂O": 0.5, "MgO": 0.5, "其他": 0.2 }
        }
    },
    {
        id: "bai-ci",
        name: "白瓷",
        period: "北朝 - 清",
        description: "白瓷的出现打破了青瓷一统天下的局面。邢窑白瓷类银类雪，德化白瓷洁白如玉。",
        features: ["洁白如玉", "透光性好", "类银类雪"],
        imageUrl: "Pic/photo-2/白瓷.png",
        vizData: {
            radar: [9, 7, 8, 9],
            attr: { type: "瓷器", temp: "1280℃-1300℃" },
            composition: { "SiO₂": 71.0, "Al₂O₃": 11.5, "CaO": 5.5, "MgO": 4.5, "K₂O": 4.0, "Na₂O": 1.5, "Fe₂O₃": 0.5, "其他": 1.5 }
        }
    },
    {
        id: "tang-san-cai",
        name: "唐三彩",
        period: "唐",
        description: "唐三彩是一种低温釉陶器，以黄、绿、白三色为主，色彩斑斓，造型生动。",
        features: ["低温釉陶", "色彩斑斓", "造型生动"],
        imageUrl: "Pic/photo-2/唐三彩.png",
        vizData: {
            radar: [5, 6, 9, 8],
            attr: { type: "釉陶", temp: "800℃-900℃" },
            composition: { "PbO": 53.0, "SiO₂": 38.0, "Al₂O₃": 4.5, "CuO": 2.0, "Na₂O": 1.0, "其他": 1.0, "K₂O": 0.5 }
        }
    },
    {
        id: "qing-hua",
        name: "青花",
        period: "元 - 清",
        description: "青花瓷是釉下彩瓷的一种，以钴料绘制纹饰，蓝白相间，明净素雅，是中国瓷器的代表。",
        features: ["蓝白相间", "明净素雅", "釉下彩绘"],
        imageUrl: "Pic/photo-2/青花.png",
        vizData: {
            radar: [10, 8, 9, 10],
            attr: { type: "釉下彩瓷", temp: "1280℃-1320℃" },
            composition: { "SiO₂": 72.5, "Al₂O₃": 15.2, "CaO": 4.2, "K₂O": 3.2, "Na₂O": 2.8, "Fe₂O₃": 0.8, "CoO": 0.5, "MgO": 0.5, "其他": 0.3 }
        }
    },
    {
        id: "you-li-hong",
        name: "釉里红",
        period: "元 - 清",
        description: "釉里红是以铜红料绘制纹饰的釉下彩瓷，烧制难度极大，红色热烈沉稳。",
        features: ["釉下铜红", "烧制难", "热烈沉稳"],
        imageUrl: "Pic/photo-2/釉里红.png",
        vizData: {
            radar: [10, 10, 9, 5], // 难度极高
            attr: { type: "釉下彩瓷", temp: "1250℃-1280℃" },
            composition: { "SiO₂": 71.5, "Al₂O₃": 14.8, "CaO": 4.5, "K₂O": 3.2, "Na₂O": 2.8, "其他": 1.0, "Fe₂O₃": 0.8, "CuO": 0.8, "MgO": 0.6 }
        }
    },
    {
        id: "dou-cai",
        name: "斗彩",
        period: "明 - 清",
        description: "斗彩是釉下青花与釉上彩相结合的装饰品种，争奇斗艳，清新雅致。",
        features: ["青花勾勒", "釉上填彩", "争奇斗艳"],
        imageUrl: "Pic/photo-2/斗彩.png",
        vizData: {
            radar: [9, 9, 9, 6],
            attr: { type: "釉下+釉上", temp: "二次烧成" },
            composition: { "PbO": 68.0, "SiO₂": 27.0, "K₂O": 1.5, "Al₂O₃": 1.5, "CuO": 1.0, "Na₂O": 1.0 }
        }
    },
    {
        id: "wu-cai",
        name: "五彩",
        period: "明 - 清",
        description: "五彩瓷色彩浓烈，画风豪放，以红、绿、黄、紫等色为主，视觉冲击力强。",
        features: ["色彩浓烈", "画风豪放", "视觉冲击"],
        imageUrl: "Pic/photo-2/五彩.png",
        vizData: {
            radar: [9, 8, 8, 7],
            attr: { type: "釉上彩瓷", temp: "二次烧成" },
            composition: { "PbO": 68.0, "SiO₂": 27.0, "K₂O": 1.5, "Al₂O₃": 1.5, "CuO": 1.0, "Na₂O": 1.0 }
        }
    },
    {
        id: "fen-cai",
        name: "粉彩",
        period: "清",
        description: "粉彩受珐琅彩影响，在彩料中加入玻璃白，色彩柔和淡雅，立体感强。",
        features: ["色彩柔和", "立体感强", "画工精细"],
        imageUrl: "Pic/photo-2/粉彩.png",
        vizData: {
            radar: [9, 9, 10, 8],
            attr: { type: "釉上彩瓷", temp: "二次烧成" },
            composition: { "PbO": 45.0, "SiO₂": 42.0, "As₂O₃": 4.5, "K₂O": 3.5, "Al₂O₃": 2.5, "Na₂O": 1.0, "其他": 1.0, "CuO": 0.5 }
        }
    },
    {
        id: "fa-lang-cai",
        name: "珐琅彩",
        period: "清",
        description: "珐琅彩是宫廷御用瓷器，吸收西洋技法，色彩艳丽，纹饰精美绝伦。",
        features: ["宫廷御用", "西洋技法", "精美绝伦"],
        imageUrl: "Pic/photo-2/珐琅彩.png",
        vizData: {
            radar: [9, 10, 10, 4],
            attr: { type: "釉上彩瓷", temp: "二次烧成" },
            composition: { "SiO₂": 45.0, "PbO": 35.0, "B₂O₃": 8.5, "K₂O": 4.0, "Al₂O₃": 3.0, "As₂O₃": 2.0, "Na₂O": 1.5, "CuO": 1.0 }
        }
    }
];

const craftSteps = [
    {
        id: "cai-shi",
        name: "采石",
        description: "景德镇制瓷所用的瓷石，采自附近山区。工匠们在深山中开采出洁白细腻的瓷石，这是制作上等瓷器的基础原料。正如《天工开物》所言：'土出务源、名曰高梁山'。",
        imageUrl: "Pic/photo-3/1_采石.png",
        chartType: "material",
        chartData: {
            name: "典型瓷石矿物组成",
            data: [
                { value: 65, name: '二氧化硅 (SiO₂)' },
                { value: 20, name: '氧化铝 (Al₂O₃)' },
                { value: 10, name: '长石' },
                { value: 5, name: '其他杂质' }
            ]
        }
    },
    {
        id: "lian-ni",
        name: "练泥",
        description: "采回的瓷石需经粉碎、淘洗，制成洁白的'不(dūn)子'。然后将瓷泥反复揉搓、拍打，挤出气泡，使泥料组织致密，水分均匀，以防烧制时开裂。",
        imageUrl: "Pic/photo-3/2_练泥.png",
        chartType: "material",
        chartData: {
            name: "优质瓷泥成分配比",
            data: [
                { value: 50, name: '高岭土 (骨)' },
                { value: 30, name: '长石 (肉)' },
                { value: 20, name: '石英 (筋)' }
            ]
        }
    },
    {
        id: "la-pi",
        name: "拉坯",
        description: "这是陶瓷成型的关键步骤。工匠将泥团掷于辘轳车上，随轮旋转，运用手法的推、拉、收、放，将泥团拉制成各种器型的雏形。所谓'如冰似玉'的器型，全在这一拉之间。",
        imageUrl: "Pic/photo-3/3_拉坯.png",
        chartType: "yield",
        chartData: {
            stage: "拉坯",
            yield: 95,
            description: "一次成型良品率较高，损耗主要来自原料杂质。"
        }
    },
    {
        id: "li-pi",
        name: "利坯",
        description: "待坯体稍干后，置于利桶上，用特制的刀具旋削修整。使器表光洁、厚薄适度、线条流畅。利坯决定了瓷器的最终形态，要求极高，所谓'修坯如有神'。",
        imageUrl: "Pic/photo-3/4_利坯.png",
        chartType: "yield",
        chartData: {
            stage: "利坯",
            yield: 90,
            description: "精细修整风险较高，易出现胎壁破裂或变形，良品率有所下降。"
        }
    },
    {
        id: "hua-pi",
        name: "画坯",
        description: "在干燥的坯体上用青花料（氧化钴）或其他色料绘制纹饰。画工们运笔如飞，勾勒出山水、人物、花鸟。'工匠来八方，器成天下走'，精美的画面是瓷器的灵魂。",
        imageUrl: "Pic/photo-3/5_画坯.png",
        chartType: "workload",
        chartData: {
            name: "工时投入占比",
            data: [
                { value: 40, name: '画坯与装饰' },
                { value: 20, name: '成型与修坯' },
                { value: 20, name: '原料制备' },
                { value: 20, name: '烧制与选别' }
            ]
        }
    },
    {
        id: "shi-you",
        name: "施釉",
        description: "施釉使瓷器表面形成玻璃质保护层。工艺有蘸釉、荡釉、吹釉等。釉料多由石灰石、草木灰和长石配制而成。'无釉不成瓷'，釉色决定了瓷器的质感与色泽。",
        imageUrl: "Pic/photo-3/6_施釉.png",
        chartType: "material",
        chartData: {
            name: "典型青花瓷釉料配方",
            data: [
                { value: 70, name: '釉果 (长石)' },
                { value: 20, name: '釉灰 (石灰石+凤尾草)' },
                { value: 10, name: '石英' }
            ]
        }
    },
    {
        id: "shao-yao",
        name: "烧窑",
        description: "将装有坯体的匣钵放入窑中，经1300℃左右的高温焙烧。经过'火'的洗礼，泥胎发生物理化学反应，最终通过'还原'气氛，烧成晶莹剔透的瓷器。",
        imageUrl: "Pic/photo-3/7_烧窑.png",
        chartType: "temperature",
        chartData: {
            name: "高温还原焰烧成曲线",
            xAxis: ['0h', '2h', '4h', '6h', '12h', '18h', '24h'],
            data: [20, 300, 600, 950, 1280, 1320, 100] // 模拟升温、还原保温、冷却
        }
    }
];


