import { motion } from "motion/react";
import { Home, Package, TreeDeciduous, Instagram, MessageCircle, Settings } from "lucide-react";
import { Language } from "../types";
import { I18N } from "../constants";

type MobileBottomNavProps = {
  lang: Language;
  activeView: 'home' | 'shop' | 'wood';
  setView: (view: 'home' | 'shop' | 'wood') => void;
  onOpenAdmin: () => void;
};

export function MobileBottomNav({ lang, activeView, setView, onOpenAdmin }: MobileBottomNavProps) {
  const t = I18N[lang];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shop', icon: Package, label: t.nav_shop },
    { id: 'wood', icon: TreeDeciduous, label: t.nav_wood },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-brand-white/90 backdrop-blur-xl border-t border-brand-black/5 z-50 md:hidden px-8 py-4 flex justify-between items-center">
      <div className="flex gap-10">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-brand-black scale-110' : 'text-brand-gray opacity-40'}`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="w-1 h-1 bg-brand-black rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex gap-6 items-center border-l border-brand-black/5 pl-8">
        <a href="https://lin.ee/FUUvJlG" target="_blank" rel="noopener noreferrer" className="text-brand-black opacity-40 hover:opacity-100 transition-opacity">
          <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <button onClick={onOpenAdmin} className="text-brand-black opacity-20 hover:opacity-100 transition-opacity">
          <Settings className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
