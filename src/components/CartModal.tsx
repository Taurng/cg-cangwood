import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { CartItem, Language } from "../types";
import { I18N } from "../constants";

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  lang: Language;
};

export function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, lang }: CartModalProps) {
  const t = I18N[lang];
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-brand-white w-full max-w-md h-full shadow-2xl relative z-[151] flex flex-col"
          >
            <div className="p-6 border-b border-brand-black/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h3 className="font-editorial text-2xl uppercase tracking-tight">{t.cart_title}</h3>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-darkgray/40 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="font-mono text-xs uppercase tracking-widest">{t.cart_empty}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name_zh} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-mono text-[10px] uppercase font-bold truncate pr-4">
                          {lang === 'zh' ? item.product.name_zh : item.product.name_en}
                        </h4>
                        <button 
                          onClick={() => onRemove(item.product.id)}
                          className="text-brand-gray hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-brand-black/10">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-mono text-[10px]">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-mono text-[10px] font-bold">
                          NT$ {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-black/10 bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-gray">{t.cart_total}</span>
                  <span className="font-mono text-xl font-bold">NT$ {total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-brand-darkgray transition-all"
                >
                  {t.cart_checkout}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
