import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Construction, Clock, ShieldCheck, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f0a8]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e2b13c]/5 rounded-full blur-[120px]" />
      
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Icon & Badge */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-[#1a1a1a] border border-[#00f0a8]/20 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#00f0a8]/5 animate-pulse">
            <Construction size={40} className="text-[#00f0a8]" />
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#00f0a8]/10 border border-[#00f0a8]/20 text-[#00f0a8] text-xs font-bold uppercase tracking-widest">
            Feature in Development
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Something <span className="text-[#00f0a8]">Exceptional</span> is Growing
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
            We're currently cultivating this feature to ensure it meets the high standards of the NBSAP Gambia platform. It will be available in the next phase of our rollout.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl text-left space-y-2">
            <Clock size={20} className="text-[#e2b13c]" />
            <h3 className="font-bold text-sm">Coming Soon</h3>
            <p className="text-xs text-gray-500">Finalizing the user interface and experience.</p>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl text-left space-y-2">
            <ShieldCheck size={20} className="text-[#00f0a8]" />
            <h3 className="font-bold text-sm">Secure</h3>
            <p className="text-xs text-gray-500">Ensuring data integrity and RLS protection.</p>
          </div>
          <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl text-left space-y-2">
            <Zap size={20} className="text-blue-400" />
            <h3 className="font-bold text-sm">Optimized</h3>
            <p className="text-xs text-gray-500">Built for speed and seamless performance.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/admin/dashboard">
            <Button className="bg-[#00f0a8] hover:bg-[#00d696] text-black font-bold px-8 h-12 rounded-xl transition-all hover:scale-105">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 px-8 rounded-xl">
            <Mail className="mr-2 h-4 w-4" /> Notify Me
          </Button>
        </div>

        {/* Footer Branding */}
        <div className="pt-12 opacity-30">
          <p className="text-xs font-medium tracking-widest uppercase">NBSAP Gambia • Digital Conservation</p>
        </div>
      </div>
    </div>
  );
}
