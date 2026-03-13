import { motion } from "motion/react";
import { Language } from "../types";
import { I18N } from "../constants";
import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";

type NavbarProps = {
  lang: Language;
  setLang: (lang: Language) => void;
  setView: (view: 'home' | 'shop' | 'wood') => void;
  onOpenAdmin: () => void;
  cartCount: number;
  onOpenCart: () => void;
};

export function Navbar({ lang, setLang, setView, onOpenAdmin, cartCount, onOpenCart }: NavbarProps) {
  const t = I18N[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full px-8 md:px-12 py-8 flex justify-between items-center z-50 transition-all duration-700 ${scrolled ? 'bg-brand-white/90 backdrop-blur-xl border-b border-brand-black/5 py-6' : 'bg-transparent'}`}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-editorial text-2xl md:text-3xl tracking-tighter cursor-pointer text-brand-black" 
        onClick={() => setView('home')}
      >
        CAMG WOOD.
      </motion.div>
      
      <div className="flex gap-8 md:gap-12 items-center">
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] items-center text-brand-black">
          <button onClick={() => setView('shop')} className="hover:opacity-40 transition-opacity relative group">
            {t.nav_shop}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black group-hover:w-full transition-all duration-300" />
          </button>
          <button onClick={() => setView('wood')} className="hover:opacity-40 transition-opacity relative group">
            {t.nav_wood}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black group-hover:w-full transition-all duration-300" />
          </button>
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} 
            className="hover:opacity-40 transition-opacity"
          >
            {lang === 'zh' ? 'EN' : 'ZH'}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenCart}
            className="relative p-2 hover:opacity-40 transition-opacity text-brand-black"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-black text-brand-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Nav - Language Switcher */}
          <div className="flex md:hidden items-center font-mono text-[10px] uppercase tracking-widest text-brand-black">
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} 
              className="border border-brand-black/20 px-3 py-1"
            >
              {lang === 'zh' ? 'EN' : 'ZH'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
