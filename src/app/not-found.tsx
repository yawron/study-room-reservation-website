import Link from 'next/link'
import { Button } from '@/components/Primitives'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream p-4">
      <div className="bg-white border-4 border-black shadow-neo p-8 max-w-md w-full text-center rotate-2 hover:rotate-0 transition-transform duration-300">
        <h1 className="text-8xl font-black text-black mb-4">404</h1>
        <h2 className="text-2xl font-bold text-black mb-6 uppercase border-b-4 border-brand-accent inline-block pb-1">
          页面未找到
        </h2>
        <p className="text-gray-600 font-bold mb-8">
          抱歉，您访问的页面似乎迷路了。它可能已被移动或删除。
        </p>
        <Link href="/">
          <Button size="lg" className="w-full">
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}
