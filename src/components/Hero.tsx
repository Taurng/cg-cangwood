import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Language } from '../types';
import { I18N } from '../constants';

type HeroProps = {
  lang: Language;
  setView: (view: 'home' | 'shop' | 'wood') => void;
  onOpenAI: () => void;
  images: {
    hero_bg: string;
    hero_main: string;
  };
};

export function Hero({ lang, setView, onOpenAI, images }: HeroProps) {
  const t = I18N[lang];

  return (
    <header className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={images.hero_bg} 
          className="w-full h-full object-cover opacity-5 grayscale"
          alt=""
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-white/80 via-transparent to-brand-white" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.5em] mb-12 opacity-50"
            >
              {t.subtitle}
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial text-[15vw] lg:text-[12vw] leading-[0.85] uppercase tracking-tighter"
              dangerouslySetInnerHTML={{ __html: t.hero_title }}
            />
          </div>
          
          <div className="lg:col-span-4 flex flex-col justify-end pb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="aspect-square w-full max-w-[300px] bg-brand-black/5 rounded-full flex items-center justify-center relative group cursor-pointer overflow-hidden mb-12"
              onClick={() => setView('shop')}
            >
              <div className="absolute inset-0 border border-brand-black/10 rounded-full scale-90 group-hover:scale-100 transition-transform duration-700" />
              
              {/* Main Image in Circle */}
              <img 
                src={images.hero_main} 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 grayscale"
                alt=""
                referrerPolicy="no-referrer"
              />

              <div className="text-center z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest block mb-2">{t.btn_shop_now}</span>
                <span className="text-4xl">→</span>
              </div>
              <motion.div 
                className="absolute inset-0 bg-brand-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
              >
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-white">{t.btn_enter_shop}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-brand-black/10 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-2"
          >
            <p className="text-2xl md:text-4xl font-light leading-tight max-w-2xl text-brand-black">
              {t.desc1} <span className="text-brand-gray">{t.desc2}</span>
            </p>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <a 
                href="#mission"
                className="group flex items-center gap-4 font-mono text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                <span className="w-10 h-[1px] bg-brand-black group-hover:w-16 transition-all" />
                {t.brand_mission_title}
              </a>
              <a 
                href="#navigation"
                className="group flex items-center gap-4 font-mono text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                <span className="w-10 h-[1px] bg-brand-black group-hover:w-16 transition-all" />
                {t.btn_shop_now}
              </a>
              <button 
                onClick={onOpenAI}
                className="group flex items-center gap-4 font-mono text-xs uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                <span className="w-10 h-[1px] bg-brand-black group-hover:w-16 transition-all" />
                {t.btn_ai}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-1 flex flex-col gap-6 font-mono text-[10px] uppercase tracking-widest text-brand-darkgray justify-end"
          >
            <div className="flex justify-between border-b border-brand-black/10 pb-3">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-black rounded-full animate-pulse"></span> 
                <span>{t.status}</span>
              </span> 
              <span>(2026)</span>
            </div>
            <div className="flex justify-between border-b border-brand-black/10 pb-3">
              <span>{t.location}</span> 
              <span>TW / KHH</span>
            </div>
            <div className="flex justify-between border-b border-brand-black/10 pb-3">
              <span>Studio</span> 
              <span>CAMG WOOD</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
