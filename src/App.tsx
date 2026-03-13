import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { WoodCard } from './components/WoodCard';
import { ProductModal } from './components/ProductModal';
import { AdminPanel } from './components/AdminPanel';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingPage } from './components/LandingPage';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CartModal } from './components/CartModal';
import { INITIAL_PRODUCTS, INITIAL_WOODS, INITIAL_CATEGORIES, I18N, INITIAL_HOME_IMAGES } from './constants';
import { Language, Product, Wood, Category, CartItem, Order } from './types';
import { Instagram, MessageCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [view, setView] = useState<'home' | 'shop' | 'wood'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [woods, setWoods] = useState<Wood[]>(INITIAL_WOODS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [i18nData, setI18nData] = useState(I18N);
  const [homeImages, setHomeImages] = useState(INITIAL_HOME_IMAGES);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Fetch live data from data.json
    fetch('/cg-cangwood/data.json?t=' + Date.now())
      .then(res => {
        if (!res.ok) throw new Error('data.json not found');
        return res.json();
      })
      .then(data => {
        if (data.products) setProducts(data.products);
        if (data.woods) setWoods(data.woods);
        if (data.categories) setCategories(data.categories);
        if (data.i18nData) setI18nData(data.i18nData);
        if (data.homeImages) setHomeImages(data.homeImages);
        setIsDataLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load live data, falling back to locals/constants:', err);
        const p = localStorage.getItem('camg_products');
        if (p) setProducts(JSON.parse(p));
        const w = localStorage.getItem('camg_woods');
        if (w) setWoods(JSON.parse(w));
        const c = localStorage.getItem('camg_categories');
        if (c) setCategories(JSON.parse(c));
        const i = localStorage.getItem('camg_i18n');
        if (i) setI18nData(JSON.parse(i));
        const h = localStorage.getItem('camg_homeImages');
        if (h) setHomeImages(JSON.parse(h));
        setIsDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('camg_products', JSON.stringify(products));
  }, [products, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('camg_woods', JSON.stringify(woods));
  }, [woods, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('camg_categories', JSON.stringify(categories));
  }, [categories, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('camg_i18n', JSON.stringify(i18nData));
  }, [i18nData, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('camg_homeImages', JSON.stringify(homeImages));
  }, [homeImages, isDataLoaded]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderId: string, product: Product } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewCount, setViewCount] = useState(0);

  const t = i18nData[lang] || I18N['zh'];

  useEffect(() => {
    // Simulate view count increment
    const storedViews = localStorage.getItem('viewCount');
    const currentViews = storedViews ? parseInt(storedViews) : 0;
    const newViews = currentViews + 1;
    localStorage.setItem('viewCount', newViews.toString());
    setViewCount(newViews);
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [hasEntered]);

  const getSubCategoryIds = (catId: string): string[] => {
    const subCats = categories.filter(c => c.parentId === catId);
    let ids = subCats.map(c => c.id);
    subCats.forEach(c => {
      ids = [...ids, ...getSubCategoryIds(c.id)];
    });
    return ids;
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => {
        if (p.categoryId === activeCategory) return true;
        const subCatIds = getSubCategoryIds(activeCategory);
        return subCatIds.includes(p.categoryId);
      });

  const handleCheckoutLine = (product: Product) => {
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setConfirmedOrder({ orderId, product });
  };

  const handleFinalConfirm = () => {
    if (!confirmedOrder) return;
    const { orderId, product } = confirmedOrder;
    
    // Create actual order record
    const newOrder: Order = {
      id: orderId,
      items: [{ product, quantity: 1 }],
      total: product.price,
      customerName: "Guest",
      customerPhone: "N/A",
      paymentMethod: "LINE Pay",
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);

    const message = (lang === 'zh' ? 
      `您好，我想確認以下最終訂單並進行付款：\n訂單編號：${orderId}\n產品編號：${product.id}\n產品名稱：${product.name_zh}\n總計金額：NT$ ${product.price.toLocaleString()}` :
      `Hello, I would like to confirm the following final order and proceed with payment:\nOrder ID: ${orderId}\nProduct ID: ${product.id}\nProduct Name: ${product.name_en}\nTotal Amount: NT$ ${product.price.toLocaleString()}`
    );
    const lineUrl = `https://line.me/R/oaMessage/@FUUvJlG/?${encodeURIComponent(message)}`;
    window.open(lineUrl, '_blank');
    setConfirmedOrder(null);
    setSelectedProduct(null);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCartCheckout = () => {
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total,
      customerName: "Guest",
      customerPhone: "N/A",
      paymentMethod: "Cart Checkout",
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);

    const itemsStr = cart.map(item => `${item.product.name_zh} x ${item.quantity}`).join('\n');
    const message = `您好，我想確認以下購物車訂單：\n訂單編號：${orderId}\n項目：\n${itemsStr}\n總計：NT$ ${total.toLocaleString()}`;
    const lineUrl = `https://line.me/R/oaMessage/@FUUvJlG/?${encodeURIComponent(message)}`;
    window.open(lineUrl, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen font-sans bg-brand-white selection:bg-brand-black selection:text-brand-white">
      <AnimatePresence>
        {!hasEntered && (
          <LandingPage key="landing" lang={lang} onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar 
            lang={lang} 
            setLang={setLang} 
            setView={setView} 
            cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <MobileBottomNav 
            lang={lang}
            activeView={view}
            setView={setView}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero lang={lang} setView={setView} images={homeImages} />
                
                {/* Marquee */}
                <div className="w-full border-b border-brand-black bg-brand-black text-brand-white py-4 font-mono text-[10px] uppercase overflow-hidden">
                  <div className="marquee-container">
                    <div className="marquee-content tracking-[0.5em]">
                      HANDCRAFTED FURNITURE — BESPOKE DESIGN — SUSTAINABLE WOODWORKING — KAOHSIUNG STUDIO — 預約制參觀 — 手作溫潤質感 — 客製化家具訂製 — HANDCRAFTED FURNITURE — BESPOKE DESIGN — SUSTAINABLE WOODWORKING —
                    </div>
                  </div>
                </div>

                {/* Brand Story & Mission */}
                <section id="mission" className="py-24 md:py-48 px-6 md:px-12 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                    <div className="space-y-12">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                      >
                        <h2 className="font-editorial text-5xl md:text-7xl uppercase tracking-tighter mb-8">
                          {lang === 'zh' ? '我們的宗旨' : 'Our Mission'}
                        </h2>
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-brand-gray">
                          {lang === 'zh' ? 
                            '以工匠之心，賦予木材第二次生命。我們不只是製作家具，更是創造能陪伴您一生的生活藝術品。堅持傳統工藝與現代設計的融合，為每一個家打造獨一無二的溫潤質感。' :
                            'With a craftsman\'s heart, we give wood a second life. We don\'t just make furniture; we create life-long companions. We blend traditional techniques with modern design to bring warmth and uniqueness to every home.'
                          }
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="pt-12 border-t border-brand-black/10"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-[1px] bg-brand-black" />
                          <span className="font-mono text-xs uppercase tracking-widest">Est. 2024</span>
                        </div>
                        <h3 className="font-editorial text-3xl uppercase mb-6">
                          {lang === 'zh' ? '品牌故事' : 'Our Story'}
                        </h3>
                        <p className="text-lg font-light leading-relaxed text-brand-gray">
                          {lang === 'zh' ? 
                            'CAMG WOOD 創立於高雄，源於對木頭原始美感的熱愛。在快節奏的時代，我們選擇慢下來，用雙手感應木材的溫度，用時間淬煉每一道線條。每一件作品都承載著森林的記憶與職人的堅持。' :
                            'Founded in Kaohsiung, CAMG WOOD was born from a passion for the raw beauty of timber. In a fast-paced world, we choose to slow down, feeling the temperature of the wood and refining every line with time.'
                          }
                        </p>
                      </motion.div>
                    </div>

                    <div className="relative aspect-[3/4] overflow-hidden group">
                      <motion.img 
                        initial={{ scale: 1.2 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={homeImages.mission_img} 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        alt="Woodworking Studio"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-brand-black/10 group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                  </div>
                </section>

                {/* Navigation Links - Awwwards Style */}
                <section id="navigation" className="pb-24 md:pb-48 px-6 md:px-12 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-black border border-brand-black">
                    <div 
                      className="group relative h-[400px] md:h-[600px] bg-brand-white overflow-hidden cursor-pointer"
                      onClick={() => setView('shop')}
                    >
                      <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                        <span className="font-mono text-xs uppercase tracking-widest opacity-40">01 / Archives</span>
                        <h3 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                          {lang === 'zh' ? '探索作品集' : 'Collection'}
                        </h3>
                        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                          <span>View All</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={homeImages.nav_shop_img} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        alt="Shop"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div 
                      className="group relative h-[400px] md:h-[600px] bg-brand-white overflow-hidden cursor-pointer"
                      onClick={() => setView('wood')}
                    >
                      <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                        <span className="font-mono text-xs uppercase tracking-widest opacity-40">02 / Materials</span>
                        <h3 className="font-editorial text-6xl md:text-8xl uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                          {lang === 'zh' ? '材料指南' : 'Materials'}
                        </h3>
                        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={homeImages.nav_wood_img} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        alt="Wood"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </section>

                <footer className="px-6 md:px-12 pb-12 font-mono text-[10px] md:text-xs flex flex-col md:flex-row justify-between items-center gap-8 text-brand-darkgray border-t border-brand-black/10 pt-12">
                  <div className="flex gap-8 uppercase tracking-widest">
                    <a href="https://www.instagram.com/cang_wood_2026?igsh=NnJ1bWxvdHZlcjBu" target="_blank" rel="noopener noreferrer" className="hover-underline flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                    <a href="https://lin.ee/FUUvJlG" target="_blank" rel="noopener noreferrer" className="hover-underline flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Line Official
                    </a>
                  </div>
                  <div className="flex items-center gap-12">
                    <span className="opacity-40">© 2024 CAMG WOOD STUDIO</span>
                    <button onClick={() => setIsAdminOpen(true)} className="hover-underline uppercase tracking-widest">
                      {t.admin_login}
                    </button>
                  </div>
                </footer>
              </motion.div>
            )}

            {view === 'shop' && (
              <motion.div 
                key="shop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 pb-48 px-6 md:px-12"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-brand-black pb-12">
                    <div>
                      <h2 className="font-editorial text-6xl md:text-[8vw] uppercase tracking-tighter leading-none mb-8">{t.shop_title}</h2>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => setActiveCategory('all')}
                          className={`px-6 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border border-brand-black transition-all ${activeCategory === 'all' ? 'bg-brand-black text-brand-white shadow-xl' : 'hover:bg-brand-black hover:text-brand-white'}`}
                        >
                          {t.cat_all}
                        </button>
                        {categories.map(cat => {
                          const isSub = !!cat.parentId;
                          return (
                            <button 
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className={`px-6 py-2 font-mono text-[10px] uppercase tracking-[0.2em] border border-brand-black transition-all ${activeCategory === cat.id ? 'bg-brand-black text-brand-white shadow-xl' : 'hover:bg-brand-black hover:text-brand-white'} ${isSub ? 'opacity-70' : ''}`}
                            >
                              {isSub ? '└ ' : ''}{lang === 'zh' ? cat.name_zh : cat.name_en}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-darkgray/40 mt-12 md:mt-0 flex flex-col items-end">
                      <span>Archives — 01</span>
                      <span>Selected Works</span>
                    </div>
                  </div>
                  
                  <div className="columns-1 md:columns-2 gap-12 md:gap-24 space-y-24">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="break-inside-avoid">
                        <ProductCard 
                          product={product} 
                          lang={lang} 
                          onClick={() => setSelectedProduct(product)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'wood' && (
              <motion.div 
                key="wood"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 pb-48 px-6 md:px-12"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-24 border-b border-brand-black pb-12">
                    <h2 className="font-editorial text-6xl md:text-[8vw] uppercase tracking-tighter leading-none">{t.wood_guide_title}</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-32">
                    {woods.map(wood => (
                      <WoodCard key={wood.id} wood={wood} lang={lang} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ProductModal 
            product={selectedProduct} 
            isOpen={!!selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            lang={lang}
            onCheckout={() => selectedProduct && handleCheckoutLine(selectedProduct)}
            onAddToCart={() => selectedProduct && addToCart(selectedProduct)}
          />

          <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCartCheckout}
            lang={lang}
          />

          {confirmedOrder && (
            <OrderConfirmationModal 
              isOpen={!!confirmedOrder}
              onClose={() => setConfirmedOrder(null)}
              orderId={confirmedOrder.orderId}
              product={confirmedOrder.product}
              lang={lang}
              onConfirm={handleFinalConfirm}
            />
          )}

          <AdminPanel 
            isOpen={isAdminOpen} 
            onClose={() => setIsAdminOpen(false)} 
            products={products}
            categories={categories}
            woods={woods}
            i18nData={i18nData}
            homeImages={homeImages}
            orders={orders}
            viewCount={viewCount}
            onUpdateProducts={setProducts}
            onUpdateWoods={setWoods}
            onUpdateCategories={setCategories}
            onUpdateI18n={setI18nData}
            onUpdateHomeImages={setHomeImages}
            onUpdateOrders={setOrders}
          />
        </motion.div>
      )}
    </div>
  );
}

