import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/Primitives';
import { Wifi, Coffee, Users, ArrowRight, Zap } from 'lucide-react';
import { RoomType } from '@/types';
import Link from 'next/link';

export default function HomePage() {

  const categories = [
    {
      type: RoomType.QUIET_POD,
      title: '沉浸式静音仓',
      description: '极致静谧，配备人体工学座椅与隔音设施，专为深度学习与专注工作打造。',
      icon: <Zap className="w-8 h-8 text-black" />,
      color: 'bg-brand-green/20'
    },
    {
      type: RoomType.COLLAB_SUITE,
      title: '灵感协作室',
      description: '宽敞空间支持多人研讨，配备白板与投屏设备，激发团队灵感碰撞。',
      icon: <Users className="w-8 h-8 text-black" />,
      color: 'bg-secondary/20'
    },
    {
      type: RoomType.WINDOW_SEAT,
      title: '景观开放座',
      description: '通透落地窗景，享受自然光线与开阔视野，让学习时光更轻松惬意。',
      icon: <Coffee className="w-8 h-8 text-black" />,
      color: 'bg-brand-cream'
    }
  ];

  return (
    <div className="flex flex-col">
      <section className="relative bg-brand-cream border-b-4 border-black overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 opacity-100">
          <Image
            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
            alt="Anime Style Study Room"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-brand-green/20 mix-blend-overlay"></div>
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 flex flex-col items-center text-center z-10">
          <div className="bg-white border-4 border-black shadow-neo p-8 md:p-12 rotate-1 max-w-4xl mx-auto transform transition-transform hover:rotate-0 duration-300">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none mt-2 mb-6 uppercase">
              预订您的专属 <br className="md:hidden" /> <span className="text-brand-green bg-black px-2">学习空间</span>
            </h1>
            <p className="text-black font-bold text-lg md:text-2xl max-w-2xl mx-auto mb-8 line-clamp-2 md:line-clamp-none border-t-2 border-black pt-6">
              像星巴克一样舒适，专为高效学习打造。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link href="/rooms">
                <Button size="lg" className="w-full sm:w-auto text-xl px-8 py-6 border-2 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black bg-brand-green text-white hover:bg-brand-green/90">
                  开始预约 <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-grow bg-brand-cream min-h-screen py-8 md:py-16 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12 text-center">
             <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tight mb-4">
               <span className="bg-brand-green text-white px-2 mr-2">空间</span>
               类型导览
             </h2>
             <p className="text-lg md:text-xl font-bold text-gray-600 max-w-2xl mx-auto">
               无论您需要独自专注还是团队协作，我们都有适合您的完美空间。
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-10">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/rooms?type=${encodeURIComponent(category.type)}`}
                className={`bg-white border-4 border-black shadow-neo p-8 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-300 cursor-pointer group`}
              >
                <div className={`p-6 border-4 border-black shadow-neo-sm mb-6 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                   {category.icon}
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase">{category.title}</h3>
                <p className="text-gray-700 font-bold mb-8 leading-relaxed flex-grow border-t-2 border-black pt-4 w-full">
                  {category.description}
                </p>
                <Button
                   className="w-full bg-black text-white border-2 border-transparent hover:bg-brand-green hover:border-black hover:text-white font-black shadow-none"
                >
                   浏览房型 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ))}
          </div>

          <div className="text-center pt-8 border-t-4 border-black border-dashed">
             <p className="text-xl font-black text-black mb-6">
               还有更多选择等待您的探索...
             </p>
             <Link href="/rooms">
                <Button
                   size="lg"
                   className="bg-white text-black border-2 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black px-10"
                >
                   查看完整列表 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
             </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center p-6 border-4 border-black shadow-neo bg-brand-green/20 hover:bg-brand-green/30 transition-colors">
              <div className="bg-white p-4 border-4 border-black shadow-neo-sm mb-6 rounded-none rotate-3">
                <Wifi className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">极速网络</h3>
              <p className="text-black font-medium border-t-2 border-black pt-4 w-full">千兆网络接入，确保查阅资料与视频课程流畅无卡顿。</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border-4 border-black shadow-neo bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="bg-white p-4 border-4 border-black shadow-neo-sm mb-6 rounded-none -rotate-2">
                <Coffee className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">舒适氛围</h3>
              <p className="text-black font-medium border-t-2 border-black pt-4 w-full">精心设计的灯光与人体工学座椅，助您快速进入心流状态。</p>
            </div>

             <div className="flex flex-col items-center text-center p-6 border-4 border-black shadow-neo bg-brand-cream hover:bg-brand-cream/80 transition-colors">
              <div className="bg-white p-4 border-4 border-black shadow-neo-sm mb-6 rounded-none rotate-1">
                <Users className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3 uppercase">社群共进</h3>
              <p className="text-black font-medium border-t-2 border-black pt-4 w-full">与志同道合的伙伴一起学习，互相激励，共同进步。</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
