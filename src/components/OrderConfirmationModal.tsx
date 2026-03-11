import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ExternalLink } from "lucide-react";
import { Product, Language } from "../types";

type OrderConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  product: Product;
  lang: Language;
  onConfirm: () => void;
};

export function OrderConfirmationModal({ isOpen, onClose, orderId, product, lang, onConfirm }: OrderConfirmationModalProps) {
  const isZh = lang === 'zh';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-brand-white w-full max-w-md p-8 md:p-12 shadow-2xl relative z-[201] border border-brand-black"
          >
            <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-brand-black rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-brand-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial text-3xl uppercase tracking-tight">
                  {isZh ? '確認最終訂單' : 'Confirm Final Order'}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                  {isZh ? '請確認以下資訊以進行付款' : 'Please confirm details for payment'}
                </p>
              </div>

              <div className="bg-gray-50 p-6 space-y-4 text-left border border-brand-black/5">
                <div className="flex justify-between items-center border-b border-brand-black/10 pb-3">
                  <span className="font-mono text-[10px] uppercase text-brand-gray">{isZh ? '訂單編號' : 'Order ID'}</span>
                  <span className="font-mono text-xs font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-brand-black/10 pb-3">
                  <span className="font-mono text-[10px] uppercase text-brand-gray">{isZh ? '產品編號' : 'Product ID'}</span>
                  <span className="font-mono text-xs font-bold">#{product.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-brand-black/10 pb-3">
                  <span className="font-mono text-[10px] uppercase text-brand-gray">{isZh ? '產品名稱' : 'Product Name'}</span>
                  <span className="font-mono text-xs font-bold truncate max-w-[150px]">{isZh ? product.name_zh : product.name_en}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-[10px] uppercase text-brand-gray">{isZh ? '總計金額' : 'Total Amount'}</span>
                  <span className="font-mono text-lg font-bold">NT$ {product.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={onConfirm}
                  className="w-full bg-brand-black text-brand-white py-5 font-mono text-xs uppercase tracking-[0.2em] hover:bg-brand-darkgray transition-all flex items-center justify-center gap-3 group"
                >
                  <span>{isZh ? '前往 LINE 完成付款' : 'Pay via LINE Official'}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <p className="font-mono text-[9px] uppercase tracking-widest text-brand-gray leading-relaxed">
                  {isZh ? '* 點擊後將跳轉至 LINE 官方帳號，由專人為您處理訂單確認與付款事宜。' : '* You will be redirected to our LINE Official Account for order confirmation and payment processing.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
