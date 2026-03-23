import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts";
import { 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb,
  Search,
  Layers,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Smartphone,
  Cpu,
  ShoppingBag,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { products, ProductData, KeywordData } from "./data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F59E0B", "#10B981", "#06B6D4"];

// Categorization logic for Radar
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

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden",
    className
  )}>
    {children}
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 20;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderSlide = () => {
    const getProductIndex = (page: number) => {
      if (page >= 4 && page <= 7) return 0;
      if (page >= 8 && page <= 11) return 1;
      if (page >= 12 && page <= 15) return 2;
      if (page >= 16 && page <= 18) return 3;
      return -1;
    };

    const productIdx = getProductIndex(currentPage);
    const currentProduct = productIdx >= 0 ? products[productIdx] : null;

    switch (currentPage) {
      case 0: // Title Slide
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
            >
              <Presentation size={48} className="text-white" />
            </motion.div>
            <div className="space-y-4">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
              >
                TF-IDF 기반<br />제품별 키워드 인사이트
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/40 font-medium"
              >
                종합 비즈니스 분석 및 전략 보고서
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-12 flex items-center gap-2 text-white/30 text-sm font-bold tracking-widest uppercase"
            >
              <span>Strategy Planning Dept.</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>2026 Q1 Report</span>
            </motion.div>
          </div>
        );

      case 1: // Executive Summary
        return (
          <div className="p-16 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <Target className="text-indigo-400" size={32} />
              <h2 className="text-4xl font-bold">Executive Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <GlassCard className="p-8 space-y-4">
                <h3 className="text-xl font-bold text-indigo-300">분석 목적</h3>
                <p className="text-white/70 leading-relaxed">
                  본 보고서는 주요 이커머스 제품군의 소비자 리뷰 데이터를 TF-IDF 알고리즘으로 분석하여, 
                  단순 빈도수를 넘어선 핵심 키워드의 가중치를 산출하고 이를 통한 시장 기회 요인을 도출하는 데 목적이 있습니다.
                </p>
              </GlassCard>
              <GlassCard className="p-8 space-y-4">
                <h3 className="text-xl font-bold text-purple-300">핵심 발견</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-green-400 mt-1 shrink-0" />
                    <span>건강기능식품: '지속성'과 '신뢰성'이 구매 결정의 핵심</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-green-400 mt-1 shrink-0" />
                    <span>생활용품: '가성비'를 넘어선 '실질적 품질(두께 등)' 중시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-green-400 mt-1 shrink-0" />
                    <span>뷰티/IT: '기능적 우위'와 '브랜드 경험'의 결합</span>
                  </li>
                </ul>
              </GlassCard>
            </div>
          </div>
        );

      case 2: // Methodology
        return (
          <div className="p-16 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-12">
              <Search className="text-blue-400" size={32} />
              <h2 className="text-4xl font-bold">Analysis Methodology</h2>
            </div>
            <div className="flex gap-12 items-center">
              <div className="flex-1 space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-2xl text-blue-400 border border-white/10">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Data Collection</h4>
                    <p className="text-white/50">제품별 상위 1,000건 이상의 실제 구매 리뷰 데이터 수집 및 전처리</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-2xl text-purple-400 border border-white/10">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">TF-IDF Vectorization</h4>
                    <p className="text-white/50">단어 빈도(TF)와 역문서 빈도(IDF)를 결합하여 특정 제품에서만 유독 강조되는 핵심 키워드 추출</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-2xl text-pink-400 border border-white/10">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Insight Derivation</h4>
                    <p className="text-white/50">추출된 키워드 가중치를 바탕으로 소비자 페르소나 분석 및 비즈니스 전략 수립</p>
                  </div>
                </div>
              </div>
              <div className="w-1/3">
                <GlassCard className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <div className="text-center space-y-4">
                    <Cpu size={48} className="mx-auto text-white/80" />
                    <div className="text-sm font-mono text-white/40">Algorithm Logic</div>
                    <div className="text-2xl font-bold">W(d,t) = TF(d,t) * log(N/df(t))</div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        );

      case 3: // Overview of Products
        return (
          <div className="p-16 h-full">
            <div className="flex items-center gap-3 mb-12">
              <Layers className="text-pink-400" size={32} />
              <h2 className="text-4xl font-bold">Target Products Overview</h2>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {products.map((p, i) => (
                <motion.div 
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 h-full flex flex-col items-center text-center space-y-4 hover:bg-white/20 transition-colors cursor-default">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      {i === 0 && <Smartphone className="text-blue-400" />}
                      {i === 1 && <Package className="text-green-400" />}
                      {i === 2 && <ShoppingBag className="text-pink-400" />}
                      {i === 3 && <Monitor className="text-purple-400" />}
                    </div>
                    <h4 className="text-xl font-bold">{p.name}</h4>
                    <p className="text-xs text-white/40 uppercase tracking-tighter">Category: {["Health", "Living", "Beauty", "Tech"][i]}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 19: // Conclusion
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
            >
              <CheckCircle2 size={64} className="text-green-400" />
            </motion.div>
            <h2 className="text-6xl font-black">Conclusion & Next Steps</h2>
            <p className="text-xl text-white/50 max-w-2xl">
              데이터 기반의 의사결정은 시장의 불확실성을 제거합니다. 
              본 분석 결과를 바탕으로 각 제품군별 최적화된 마케팅 믹스 전략을 실행할 것을 권고합니다.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl pt-8">
              <GlassCard className="p-4 text-sm font-bold text-white/60">정기 구독 모델 강화</GlassCard>
              <GlassCard className="p-4 text-sm font-bold text-white/60">정품 인증 마케팅</GlassCard>
              <GlassCard className="p-4 text-sm font-bold text-white/60">리뷰 기반 제품 개선</GlassCard>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(0)}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl shadow-xl mt-8"
            >
              Restart Presentation
            </motion.button>
          </div>
        );

      default:
        if (currentProduct) {
          const slideInProduct = productIdx === 3 ? (currentPage - 16) % 3 : (currentPage - 4) % 4;
          const top10 = currentProduct.keywords.slice(0, 10).filter(k => k.word !== "em" && k.word !== "br");
          const radarData = categorizeKeywords(currentProduct.keywords);

          if (slideInProduct === 0) { // Product Intro & Top Keywords
            return (
              <div className="p-16 h-full flex flex-col justify-center">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Product Analysis 0{productIdx + 1}</span>
                    <h2 className="text-6xl font-black mt-2">{currentProduct.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white/20">0{productIdx + 1} / 04</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-1">
                    <GlassCard className="p-8 h-full">
                      <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-400" />
                        Top 5 Keywords
                      </h4>
                      <div className="space-y-4">
                        {top10.slice(0, 5).map((k, i) => (
                          <div key={k.word} className="flex items-center justify-between">
                            <span className="text-white/60 font-medium">{i + 1}. {k.word}</span>
                            <span className="text-indigo-300 font-mono text-sm">{k.score.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                  <div className="col-span-2">
                    <GlassCard className="p-8 h-full bg-indigo-500/10">
                      <h4 className="text-xl font-bold mb-4">분석 요약</h4>
                      <p className="text-white/70 leading-relaxed">
                        {currentProduct.name} 제품군은 소비자 리뷰에서 품질에 대한 높은 만족도와 더불어 특정 기능적 요소가 구매 결정의 핵심으로 작용하고 있습니다. 
                        TF-IDF 가중치 분석 결과, 일반적인 긍정 표현 외에도 제품 고유의 특성을 나타내는 단어들이 상위권에 포진되어 있습니다.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            );
          }

          if (slideInProduct === 1) { // Keyword Score Analysis
            return (
              <div className="p-16 h-full flex flex-col">
                <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
                  <BarChart3 className="text-blue-400" />
                  Keyword Score Distribution
                </h2>
                <div className="flex-1">
                  <GlassCard className="p-8 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={top10} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="word" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 14 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                          itemStyle={{ color: '#818cf8' }}
                        />
                        <Bar dataKey="score" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                            </linearGradient>
                          </defs>
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </GlassCard>
                </div>
              </div>
            );
          }

          if (slideInProduct === 2 || (productIdx === 3 && slideInProduct === 2)) { // Category Radar or Combined Insights
            if (productIdx === 3 && slideInProduct === 2) {
              // Special case for last product to fit 20 slides
              return (
                <div className="p-16 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-8">
                    <Lightbulb className="text-amber-400" size={32} />
                    <h2 className="text-4xl font-bold">Strategic Insights</h2>
                  </div>
                  <GlassCard className="p-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                    <p className="text-2xl leading-relaxed text-white/90 font-medium whitespace-pre-wrap">
                      {getInsights(currentProduct.name)}
                    </p>
                  </GlassCard>
                </div>
              );
            }
            return (
              <div className="p-16 h-full flex flex-col">
                <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
                  <Target className="text-purple-400" />
                  Category Impact Analysis
                </h2>
                <div className="flex-1 flex gap-8">
                  <div className="w-1/2">
                    <GlassCard className="p-8 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 500]} tick={false} axisLine={false} />
                          <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#a78bfa"
                            fill="#a78bfa"
                            fillOpacity={0.5}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </GlassCard>
                  </div>
                  <div className="w-1/2 space-y-6">
                    <GlassCard className="p-6">
                      <h4 className="font-bold text-purple-300 mb-2">품질/성능 집중도</h4>
                      <p className="text-sm text-white/60">해당 제품은 품질 관련 키워드에서 가장 높은 밀도를 보이며, 이는 브랜드 신뢰도의 핵심 자산입니다.</p>
                    </GlassCard>
                    <GlassCard className="p-6">
                      <h4 className="font-bold text-blue-300 mb-2">서비스 경험 지수</h4>
                      <p className="text-sm text-white/60">배송 및 고객 응대에 대한 긍정적 키워드가 꾸준히 노출되어 전체적인 구매 여정의 만족도가 높습니다.</p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            );
          }

          if (slideInProduct === 3) { // Detailed Insights
            return (
              <div className="p-16 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-8">
                  <Lightbulb className="text-amber-400" size={32} />
                  <h2 className="text-4xl font-bold">Business Insights</h2>
                </div>
                <GlassCard className="p-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                  <p className="text-2xl leading-relaxed text-white/90 font-medium whitespace-pre-wrap">
                    {getInsights(currentProduct.name)}
                  </p>
                </GlassCard>
              </div>
            );
          }
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-pink-600/10 blur-[100px] rounded-full" />

      {/* Main Presentation Area */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        <header className="px-12 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black">B</div>
            <span className="font-bold tracking-tighter text-xl">BizInsight</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/40">
              PAGE {currentPage + 1} / {totalPages}
            </div>
          </div>
        </header>

        <main className="flex-1 px-12 pb-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full"
            >
              <GlassCard className="w-full h-full relative">
                {renderSlide()}
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation Controls */}
        <div className="absolute bottom-20 right-20 flex gap-4 z-50">
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

