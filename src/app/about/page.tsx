import React from 'react';
import { Metadata } from 'next';
import { Coffee, BookOpen, Zap, Users, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/Primitives';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们 | StarStudy',
  description: '了解 StarStudy 的品牌故事与核心理念 - 打造城市中的专注绿洲。',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-brand-cream">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
            alt="About StarStudy" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-brand-cream/60 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black shadow-neo p-8 md:p-12 rotate-2 transform hover:rotate-0 transition-transform duration-300">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black mb-6 tracking-tight uppercase">
              重新定义<span className="text-white bg-black px-2 ml-2">学习空间</span>
            </h1>
            <p className="text-lg md:text-2xl text-black font-bold max-w-2xl mx-auto leading-relaxed border-t-2 border-black pt-6">
              在喧嚣的城市中，为您开辟一方静谧。StarStudy 不仅仅是一个座位，更是您梦想起航的地方。
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 md:py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="relative border-4 border-black shadow-neo transform hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Our Story" 
                  className="w-full h-auto object-cover transition-all duration-500"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center space-x-2 text-black font-black tracking-wider text-sm uppercase bg-brand-green px-3 py-1 border-2 border-black inline-flex shadow-neo-sm transform -rotate-2">
                <Coffee className="w-5 h-5" />
                <span>品牌故事</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-black leading-tight uppercase">
                灵感源自咖啡馆，<br />专为深度工作而生。
              </h2>
              <p className="text-black font-medium leading-relaxed text-lg border-l-4 border-brand-green pl-4">
                StarStudy 的诞生源于一个简单的困扰：图书馆太压抑，咖啡馆太吵闹。我们需要一个既能享受舒适氛围，又能保持高度专注的地方。
              </p>
              <p className="text-black font-medium leading-relaxed text-lg">
                我们将精品咖啡馆的惬意与专业自习室的功能性完美融合。这里有符合人体工学的座椅、柔和护眼的灯光、高速稳定的网络，以及一群同样为了梦想而努力的伙伴。
              </p>
              <div className="pt-8 border-t-4 border-black border-dashed">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-100 p-4 border-2 border-black shadow-neo-sm">
                    <h4 className="text-3xl font-black text-black">20+</h4>
                    <p className="text-black font-bold text-sm uppercase">城市覆盖</p>
                  </div>
                  <div className="bg-gray-100 p-4 border-2 border-black shadow-neo-sm">
                    <h4 className="text-3xl font-black text-black">50,000+</h4>
                    <p className="text-black font-bold text-sm uppercase">服务会员</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-brand-cream border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase">核心体验</h2>
          <p className="text-black font-bold max-w-2xl mx-auto mb-16 text-xl">
            我们关注每一个细节，只为让您的学习效率最大化。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 border-4 border-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
              <div className="w-16 h-16 bg-brand-green border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-neo-sm">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">极致静谧</h3>
              <p className="text-black font-medium leading-relaxed border-t-2 border-black pt-4">
                全空间采用声学吸音材料，配合严格的静音公约，为您打造不受打扰的深度思考空间。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border-4 border-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
              <div className="w-16 h-16 bg-brand-cream border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-neo-sm">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">智能便捷</h3>
              <p className="text-black font-medium leading-relaxed border-t-2 border-black pt-4">
                微信小程序一键预约，智能门禁扫码入座，座位电源充足，千兆光纤网络覆盖。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border-4 border-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
              <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-neo-sm">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">成长社群</h3>
              <p className="text-black font-medium leading-relaxed border-t-2 border-black pt-4">
                定期举办读书会与行业分享，在这里，您遇到的不只是室友，更是未来的合作伙伴。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environment Gallery */}
      <section className="py-16 md:py-24 bg-white overflow-hidden border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase">沉浸式环境</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
            <div className="col-span-2 md:col-span-2 row-span-2 relative border-4 border-black overflow-hidden group shadow-neo">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                alt="Main Space" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white bg-black px-2 py-1 font-black text-lg border-2 border-white">开放式研习区</span>
              </div>
            </div>
            <div className="col-span-1 md:col-span-1 row-span-1 relative border-4 border-black overflow-hidden group shadow-neo">
              <img 
                src="https://images.unsplash.com/photo-1517502884422-41e157d2ed44?q=80&w=2300&auto=format&fit=crop" 
                alt="Focus Room" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="col-span-1 md:col-span-1 row-span-1 relative border-4 border-black overflow-hidden group shadow-neo">
               <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
                alt="Meeting Room" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="col-span-2 md:col-span-2 row-span-1 relative border-4 border-black overflow-hidden group shadow-neo">
               <img 
                src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2070&auto=format&fit=crop" 
                alt="Lounge" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white bg-black px-2 py-1 font-black text-lg border-2 border-white">休闲休息区</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-cream text-black text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">准备好开始专注了吗？</h2>
          <p className="text-black font-bold text-xl mb-10 max-w-2xl mx-auto">
            立即预订您的专属座位，体验 StarStudy 带来的高效与舒适。新用户注册即送 2 小时免费体验券。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link href="/rooms">
                <Button size="lg" className="w-full sm:w-auto text-xl px-10 py-6 border-2 border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] bg-brand-green text-white font-black">
                  浏览空间
                </Button>
             </Link>
             <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-xl px-10 py-6 bg-white text-black border-2 border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-black">
                  注册会员
                </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
