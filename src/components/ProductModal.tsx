import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, CreditCard, Landmark, Wallet } from "lucide-react";
import { Product, Language } from "../types";
import { I18N } from "../constants";
import { useState, useRef } from "react";

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
            className="bg-brand-white w-full max-w-7xl h-[90vh] md:h-[85vh] flex flex-col md:flex-row shadow-2xl overflow-hidden relative z-[101]"
          >
            <div className="w-full md:w-[60%] h-[40%] md:h-full flex flex-col border-b md:border-b-0 md:border-r border-brand-black/10">
              <div 
                ref={containerRef}
                className={`w-full h-full md:h-[85%] relative bg-[#f4f4f5] overflow-hidden ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
              >
                <motion.img 
                  key={activeImage}
                  src={product.images[activeImage]} 
                  className={`w-full h-full select-none ${isZoomed ? 'object-cover' : 'object-contain p-8 md:p-16'}`} 
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
                <div className="w-full h-[15%] border-t border-brand-black/10 flex p-6 gap-6 overflow-x-auto items-center bg-brand-white">
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        setActiveImage(i);
                        setIsZoomed(false);
                      }}
                      className={`w-20 h-20 flex-shrink-0 border transition-all duration-300 ${activeImage === i ? 'border-brand-black scale-105' : 'border-transparent opacity-30 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-[40%] p-8 md:p-20 flex flex-col justify-between overflow-y-auto bg-brand-white h-[60%] md:h-full relative">
              <div className="absolute top-8 right-8">
                <button onClick={handleClose} className="hover:rotate-90 transition-transform p-2 group">
                  <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">Category</span>
                    <div className="h-[1px] flex-grow bg-brand-black/10" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                      {lang === 'zh' ? product.type_zh : product.type_en}
                    </span>
                  </div>
                  <h2 className="font-editorial text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6">
                    {lang === 'zh' ? product.name_zh : product.name_en}
                  </h2>
                  <p className="font-mono text-2xl md:text-3xl tracking-tight mb-12">
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
              
              <div className="flex flex-col gap-4 mt-12">
                <div className="flex gap-4">
                  <button 
                    onClick={onAddToCart}
                    className="flex-1 border border-brand-black py-6 font-mono text-xs uppercase tracking-[0.3em] hover:bg-brand-black hover:text-brand-white transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.cart_add}</span>
                  </button>
                  <button 
                    onClick={onCheckout}
                    className="flex-1 bg-brand-black text-brand-white py-6 font-mono text-xs uppercase tracking-[0.3em] hover:bg-brand-darkgray transition-all flex items-center justify-center gap-4 group"
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
