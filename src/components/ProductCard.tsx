import { motion } from "motion/react";
import { Product, Language } from "../types";
import { I18N } from "../constants";

type ProductCardProps = {
  product: Product;
  lang: Language;
  onClick: () => void;
};

export function ProductCard({ product, lang, onClick }: ProductCardProps) {
  const t = I18N[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#f4f4f5] relative">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          src={product.images[0]} 
          alt={product.name_zh} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 right-6 bg-brand-black text-brand-white px-4 py-1 font-mono text-[9px] uppercase tracking-[0.3em]">
          {product.stock === 'instock' ? t.stock_instock : t.stock_custom}
        </div>
        
        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/5 transition-colors duration-500" />
        
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-brand-white p-4 w-full flex justify-between items-center shadow-2xl">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">View Details</span>
            <span className="text-xl">→</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-start border-t border-brand-black/5 pt-6">
        <div>
          <h3 className="font-editorial text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-2 group-hover:translate-x-2 transition-transform duration-500">
            {lang === 'zh' ? product.name_zh : product.name_en}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-brand-black/20" />
            <p className="font-mono text-[10px] text-brand-gray uppercase tracking-[0.2em]">
              {lang === 'zh' ? product.type_zh : product.type_en}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold tracking-tighter">NT$ {product.price.toLocaleString()}</p>
          <p className="font-mono text-[9px] text-brand-gray uppercase tracking-widest mt-1">Available</p>
        </div>
      </div>
    </motion.div>
  );
}
