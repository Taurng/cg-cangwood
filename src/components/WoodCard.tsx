import { motion } from "motion/react";
import { Wood, Language } from "../types";

type WoodCardProps = {
  wood: Wood;
  lang: Language;
};

export function WoodCard({ wood, lang }: WoodCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center border-b border-brand-black/5 pb-24"
    >
      <div className="md:col-span-7 aspect-[16/9] md:aspect-square overflow-hidden bg-[#f4f4f5] relative group">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5 }}
          src={wood.img} 
          alt={wood.name_zh} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-black/5 group-hover:bg-transparent transition-colors duration-1000" />
      </div>
      
      <div className="md:col-span-5 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gray">Material Guide</span>
          <div className="h-[1px] flex-grow bg-brand-black/10" />
        </div>
        
        <h3 className="font-editorial text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-8">
          {lang === 'zh' ? wood.name_zh : wood.name}
        </h3>
        
        <div className="space-y-8">
          <p className="text-xl font-light leading-relaxed text-brand-darkgray">
            {lang === 'zh' ? wood.desc_zh : wood.desc_en}
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-black/10">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gray mb-2">Origin</h4>
              <p className="font-mono text-xs uppercase">North America / Europe</p>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gray mb-2">Hardness</h4>
              <p className="font-mono text-xs uppercase">High Density</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
