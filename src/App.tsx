import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  Treemap,
} from "recharts";
import { 
  Sun, 
  Moon, 
  TrendingUp, 
  Package, 
  Truck, 
  DollarSign, 
  ThumbsUp, 
  Zap,
  LayoutDashboard,
  BarChart3,
  PieChart as PieChartIcon,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { products, ProductData, KeywordData } from "./data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

// Helper to categorize keywords for radar chart
const categorizeKeywords = (keywords: KeywordData[]) => {
  const categories = {
    "품질/성능": ["좋아요", "좋습니다", "좋고", "좋네요", "좋은", "만족합니다", "최고예요", "역시", "정말", "진짜", "제품", "두께도", "두껍고", "발림성", "촉촉하고", "음질", "노이즈캔슬링", "노캔"],
    "배송/서비스": ["배송", "배송도", "배송이", "빠르고", "빠르게", "빠른", "감사합니다", "받았습니다", "잘쓸게요", "항상"],
    "가격/가성비": ["저렴하게", "가성비", "가격도", "가격대비"],
    "사용성/경험": ["먹고", "먹는", "꾸준히", "계속", "쓰고", "사용하기", "사용하고", "부드럽게", "자연스럽게", "바르고", "발리고"],
    "기타/감성": ["너무", "아주", "생각보다", "같아요", "있어요", "있습니다", "유통기한도"]
  };

  return Object.entries(categories).map(([name, words]) => {
    const score = keywords
      .filter(k => words.some(w => k.word.includes(w)))
      .reduce((acc, curr) => acc + curr.score, 0);
    return { subject: name, A: score, fullMark: 500 };
  });
};

const getInsights = (productName: string) => {
  switch (productName) {
    case "오메가3":
      return `오메가3 제품의 TF-IDF 분석 결과, 소비자들은 '꾸준히'와 '항상'이라는 키워드를 통해 장기적인 섭취 습관을 중요하게 여기고 있음을 알 수 있습니다. 특히 '배송'과 '유통기한'에 대한 언급이 상위권에 포진해 있어, 건강기능식품 특성상 제품의 신선도와 빠른 수급이 구매 결정의 핵심 요소로 작용합니다. '저렴하게'라는 키워드 또한 유의미한 점수를 기록하여, 고관여 제품임에도 불구하고 가격 경쟁력이 재구매를 유도하는 강력한 동인이 되고 있습니다. 비즈니스 관점에서는 정기 구독 서비스를 강화하고 유통기한 임박 세일 등을 전략적으로 활용하여 고객의 충성도를 높이는 전략이 유효할 것으로 판단됩니다. 또한 '생각보다'라는 키워드는 기대 이상의 품질을 경험했을 때 나타나는 반응으로, 제품의 순도나 캡슐 크기 등 구체적인 품질 소구점을 상세 페이지에 강조할 필요가 있습니다.`;
    case "물티슈":
      return `물티슈 시장은 '가성비'와 '두께'가 지배적인 키워드로 나타났습니다. 소비자들은 단순히 저렴한 가격만을 찾는 것이 아니라, '가격 대비 두께' 즉, 실질적인 사용 편의성을 극도로 중시하고 있습니다. '미엘'과 같은 특정 브랜드명이 상위권에 노출되는 것은 브랜드 인지도가 형성된 충성 고객층이 존재함을 시사합니다. '적당하고'라는 표현은 너무 얇지도 두껍지도 않은 표준적인 품질에 대한 만족감을 나타내며, 이는 대중적인 시장 타겟팅의 기준이 됩니다. 배송 관련 키워드인 '빠르고' 역시 높은 점수를 기록하여, 생필품으로서의 즉시성이 매우 중요함을 보여줍니다. 향후 마케팅 전략으로는 '도톰한 엠보싱'과 '경제적인 대용량 구성'을 결합한 패키지 상품을 주력으로 밀고 나가는 것이 효과적일 것입니다. 또한 '항상' 키워드의 높은 점수는 반복 구매 주기가 짧음을 의미하므로, 알림 서비스나 자동 결제 혜택을 제공하는 것이 매출 안정화에 기여할 것입니다.`;
    case "달바선크림":
      return `달바 선크림의 분석 결과는 기능성 화장품으로서의 독보적인 위치를 잘 보여줍니다. '발림성', '촉촉하고', '톤업'이라는 세 가지 키워드가 압도적인 점수를 기록하며 제품의 핵심 가치를 형성하고 있습니다. 특히 '부드럽게'와 '자연스럽게'라는 키워드는 인위적이지 않은 피부 표현을 원하는 현대 소비자들의 니즈를 정확히 관통하고 있음을 의미합니다. '피부가'라는 키워드는 민감성 피부나 특정 피부 타입에 대한 적합성을 논의하는 리뷰가 많음을 시사하므로, 저자극 테스트 완료 등의 신뢰성 지표를 강조하는 것이 중요합니다. '저렴하게' 키워드는 프리미엄 브랜드임에도 불구하고 프로모션 기간의 구매 비중이 높음을 나타내며, 이는 올리브영 등 주요 채널의 행사 전략이 매출에 지대한 영향을 미치고 있음을 보여줍니다. 비즈니스 인사이트 측면에서, '톤업' 기능을 강화한 라인업 확장이나 '수분감'을 강조한 계절별 마케팅을 통해 브랜드 아이덴티티를 더욱 공고히 할 수 있습니다.`;
    case "에어팟프로2세대":
      return `에어팟 프로 2세대는 기술적 우위와 브랜드 신뢰도가 결합된 전형적인 고가 IT 기기의 특성을 보입니다. '노이즈캔슬링', '음질', '노캔'과 같은 기술적 키워드가 상위권을 차지하며 제품의 구매 목적이 명확함을 입증합니다. '역시'와 '최고예요'라는 감성적 키워드는 애플 브랜드에 대한 높은 충성도와 기대치를 충족시켰을 때의 만족감을 대변합니다. 흥미로운 점은 '저렴하게'와 '배송' 키워드가 IT 기기임에도 상당히 높은 점수를 기록했다는 것인데, 이는 고가의 정품을 최저가로 안전하게 구매하고자 하는 소비자들의 심리가 반영된 결과입니다. '음질도' 키워드는 전작 대비 개선된 성능에 대한 긍정적 피드백으로 해석됩니다. 비즈니스 전략으로는 정품 인증 보장 마케팅과 더불어 빠른 배송 인프라를 강조하여 가품에 대한 우려를 불식시키고 구매 전환율을 높이는 것이 필수적입니다. 또한 '프로'라는 네이밍에 걸맞은 전문적인 기능 설명을 강화하여 프리미엄 가치를 유지해야 합니다.`;
    default:
      return "";
  }
};

const ChartCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
        <Icon size={18} />
      </div>
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
    </div>
    <div className="h-[250px] w-full">
      {children}
    </div>
  </motion.div>
);

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData>(products[0]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const top10Keywords = useMemo(() => 
    selectedProduct.keywords.slice(0, 10).filter(k => k.word !== "em" && k.word !== "br"), 
    [selectedProduct]
  );

  const radarData = useMemo(() => categorizeKeywords(selectedProduct.keywords), [selectedProduct]);

  const distributionData = useMemo(() => 
    selectedProduct.keywords.slice(0, 5).map((k, i) => ({ name: k.word, value: k.score })),
    [selectedProduct]
  );

  const cumulativeData = useMemo(() => {
    let sum = 0;
    return selectedProduct.keywords.slice(0, 15).map(k => {
      sum += k.score;
      return { name: k.word, cumulative: sum };
    });
  }, [selectedProduct]);

  const treemapData = useMemo(() => ({
    name: "Keywords",
    children: selectedProduct.keywords.slice(0, 20).map(k => ({ name: k.word, size: k.score }))
  }), [selectedProduct]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-bottom border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BizInsight</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">TF-IDF Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Selector */}
        <div className="flex flex-wrap gap-2 mb-10">
          {products.map((product) => (
            <button
              key={product.name}
              onClick={() => setSelectedProduct(product)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border",
                selectedProduct.name === product.name
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-400 dark:hover:border-blue-500"
              )}
            >
              {product.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Insights & Summary */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              key={selectedProduct.name + "insight"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4 opacity-80">
                <TrendingUp size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Business Insight</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">{selectedProduct.name} 분석</h2>
              <p className="text-blue-50 leading-relaxed text-sm whitespace-pre-wrap">
                {getInsights(selectedProduct.name)}
              </p>
            </motion.div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                핵심 키워드 Top 5
              </h3>
              <div className="space-y-3">
                {top10Keywords.slice(0, 5).map((k, i) => (
                  <div key={k.word} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-400 w-4">{i + 1}</span>
                      <span className="font-medium group-hover:text-blue-500 transition-colors">{k.word}</span>
                    </div>
                    <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                      {k.score.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Charts Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="상위 키워드 점수 분석" icon={BarChart3}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10Keywords} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#333" : "#eee"} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="word" 
                    type="category" 
                    width={80} 
                    tick={{ fontSize: 12, fill: isDark ? "#999" : "#666" }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? "#18181b" : "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ color: "#3B82F6" }}
                  />
                  <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="카테고리별 영향력 (Radar)" icon={TrendingUp}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={isDark ? "#333" : "#eee"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: isDark ? "#999" : "#666" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 500]} tick={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="주요 키워드 비중 (Pie)" icon={PieChartIcon}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? "#18181b" : "#fff", border: "none", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="누적 키워드 영향력 추이" icon={TrendingUp}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#333" : "#eee"} />
                  <XAxis dataKey="name" hide />
                  <YAxis tick={{ fontSize: 10, fill: isDark ? "#999" : "#666" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? "#18181b" : "#fff", border: "none", borderRadius: "8px" }}
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCum)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="키워드 중요도 트리맵" icon={LayoutDashboard}>
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData.children}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  fill="#3B82F6"
                >
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? "#18181b" : "#fff", border: "none", borderRadius: "8px" }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="고객 만족도 시그널" icon={ThumbsUp}>
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="flex gap-2">
                  {["좋아요", "만족합니다", "감사합니다", "좋네요"].map((word) => {
                    const score = selectedProduct.keywords.find(k => k.word === word)?.score || 0;
                    const intensity = Math.min(score / 100, 1);
                    return (
                      <div 
                        key={word}
                        className="flex flex-col items-center"
                        style={{ opacity: 0.3 + intensity * 0.7 }}
                      >
                        <div className="w-12 bg-blue-500 rounded-t-lg" style={{ height: `${intensity * 100}px` }} />
                        <span className="text-[10px] mt-2 font-medium">{word}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-zinc-500 text-center px-4">
                  긍정 키워드의 TF-IDF 점수를 기반으로 한 브랜드 선호도 시각화
                </p>
              </div>
            </ChartCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6 text-zinc-400">
            <Package size={20} />
            <Truck size={20} />
            <DollarSign size={20} />
            <MessageSquare size={20} />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; 2026 BizInsight Dashboard. All data based on TF-IDF keyword analysis.
          </p>
        </div>
      </footer>
    </div>
  );
}

