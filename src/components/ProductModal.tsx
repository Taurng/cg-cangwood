import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, CreditCard, Landmark, Wallet } from "lucide-react";
import { Product, Language } from "../types";
import { I18N } from "../constants";
import { useState, useRef } from "react";
import { isMobile } from 'react-device-detect';

type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onCheckout?: () => void;
  onAddToCart?: () => void;
};

export function ProductModal({ product, isOpen, onClose, lang, onCheckout, onAddToCart }: ProductModalProps) {
  const t = I18N[lang];
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const handleClose = () => {
    setIsZoomed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-md"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className={`bg-brand-white w-full max-w-7xl relative z-[101] shadow-2xl flex ${
              isMobile ? 'flex-col h-[100dvh] overflow-y-auto' : 'flex-row h-[85vh] overflow-hidden rounded-xl'
            }`}
          >
            {/* Image Gallery Side */}
            <div className={`w-full flex flex-col border-brand-black/10 ${
              isMobile ? 'h-[50dvh] flex-shrink-0 border-b' : 'md:w-[60%] h-full border-r'
            }`}>
              <div 
                ref={containerRef}
                className={`w-full relative bg-[#f4f4f5] overflow-hidden ${
                  isMobile ? 'h-full' : 'h-[85%]'
                } ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
              >
                <motion.img 
                  key={activeImage}
                  src={product.images[activeImage]} 
                  className={`w-full h-full select-none ${isZoomed ? 'object-cover' : (isMobile ? 'object-contain p-6' : 'object-contain p-16')}`} 
                  alt={product.name_zh}
                  referrerPolicy="no-referrer"
                  animate={{ 
                    scale: isZoomed ? 2.5 : 1,
                  }}
                  drag={isZoomed}
                  dragConstraints={containerRef}
                  dragElastic={0.1}
                  onClick={() => setIsZoomed(!isZoomed)}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                />
                {!isZoomed && (
                  <div className="absolute bottom-8 left-8 bg-brand-black text-brand-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] pointer-events-none">
                    Zoom Interaction
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className={`w-full border-t border-brand-black/10 flex p-4 gap-4 overflow-x-auto items-center bg-brand-white flex-shrink-0 ${
                  isMobile ? 'h-[100px]' : 'h-[15%]'
                }`}>
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        setActiveImage(i);
                        setIsZoomed(false);
                      }}
                      className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border transition-all duration-300 ${activeImage === i ? 'border-brand-black scale-105' : 'border-transparent opacity-30 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className={`w-full bg-brand-white relative ${
              isMobile ? 'h-auto p-6 pb-24 flex-shrink-0' : 'md:w-[40%] h-full flex flex-col justify-between overflow-y-auto p-12 lg:p-16'
            }`}>
              <div className={`absolute z-10 ${isMobile ? 'top-4 right-4 bg-white/80 backdrop-blur rounded-full shadow-sm' : 'top-8 right-8'}`}>
                <button onClick={handleClose} className="hover:rotate-90 transition-transform p-2 group">
                  <X className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8 group-hover:scale-110 transition-transform'}`} />
                </button>
              </div>

              <div className={`space-y-10 ${isMobile ? 'mt-4' : 'mt-0'}`}>
                <div>
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">Category</span>
                    <div className="h-[1px] flex-grow bg-brand-black/10" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                      {lang === 'zh' ? product.type_zh : product.type_en}
                    </span>
                  </div>
                  <h2 className="font-editorial text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4 md:mb-6 pr-12">
                    {lang === 'zh' ? product.name_zh : product.name_en}
                  </h2>
                  <p className="font-mono text-xl md:text-2xl tracking-tight mb-8 md:mb-12">
                    NT$ {product.price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gray">Description</h3>
                  <p className="text-lg font-light leading-relaxed text-brand-darkgray">
                    {lang === 'zh' ? product.desc_zh : product.desc_en}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-brand-black/10">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gray mb-2">Material</h4>
                    <p className="font-mono text-xs uppercase">{lang === 'zh' ? 'FSC 認證實木' : 'FSC Certified Solid Wood'}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gray mb-2">Lead Time</h4>
                    <p className="font-mono text-xs uppercase">{lang === 'zh' ? '4-6 週 (訂製)' : '4-6 Weeks (Bespoke)'}</p>
                  </div>
                </div>
              </div>
              
              <div className={`flex flex-col gap-4 ${isMobile ? 'mt-8' : 'mt-auto pt-10'}`}>
                <div className="flex gap-4">
                  <button 
                    onClick={onAddToCart}
                    className="flex-1 border border-brand-black py-4 md:py-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-brand-black hover:text-brand-white transition-all flex items-center justify-center gap-2 md:gap-3"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.cart_add}</span>
                  </button>
                  <button 
                    onClick={onCheckout}
                    className="flex-1 bg-brand-black text-brand-white py-4 md:py-6 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-brand-darkgray transition-all flex items-center justify-center gap-2 md:gap-4 group"
                  >
                    <span>{t.btn_shop_now}</span>
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
                
                <div className="pt-8 border-t border-brand-black/10">
                  <h4 className="font-mono text-[8px] uppercase tracking-widest text-brand-gray mb-4">{t.payment_method}</h4>
                  <div className="flex gap-6 text-brand-gray opacity-50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-mono text-[8px] uppercase">{t.payment_credit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      <span className="font-mono text-[8px] uppercase">{t.payment_bank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="font-mono text-[8px] uppercase">{t.payment_line}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
