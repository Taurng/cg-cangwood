import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Edit2, Package, TreeDeciduous, CheckCircle2, AlertCircle, ChevronUp, ChevronDown, Image as ImageIcon, LayoutDashboard, Layers, Type, BarChart3, ShoppingCart, UploadCloud, Loader2 } from 'lucide-react';
import { Product, Category, Wood, Language, Order } from '../types';
import { I18N } from '../constants';
import { saveToGitHub } from '../services/github';

type Notification = {
  message: string;
  type: 'success' | 'error';
};

type AdminPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  woods: Wood[];
  i18nData: typeof I18N;
  homeImages: {
    hero_bg: string;
    hero_main: string;
    mission_img: string;
    nav_shop_img: string;
    nav_wood_img: string;
  };
  orders: Order[];
  viewCount: number;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateWoods: (woods: Wood[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateI18n: (i18n: typeof I18N) => void;
  onUpdateHomeImages: (images: AdminPanelProps['homeImages']) => void;
  onUpdateOrders: (orders: Order[]) => void;
};

export function AdminPanel({ 
  isOpen, 
  onClose, 
  products, 
  categories, 
  woods, 
  i18nData,
  homeImages,
  orders,
  viewCount,
  onUpdateProducts, 
  onUpdateWoods, 
  onUpdateCategories,
  onUpdateI18n,
  onUpdateHomeImages,
  onUpdateOrders
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'woods' | 'categories' | 'content' | 'analytics' | 'orders' | 'images'>('products');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingWood, setEditingWood] = useState<Partial<Wood> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingContent, setEditingContent] = useState<typeof I18N | null>(null);
  const [editingHomeImages, setEditingHomeImages] = useState<AdminPanelProps['homeImages'] | null>(null);

  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('camg_github_token') || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const contentTheme = "hero"; // placeholder fixing unused var issue
  const setContentTheme = (t: string) => {};

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = () => {
    if (password === "0045") {
      setIsLoggedIn(true);
      showNotification("Login successful", "success");
    } else {
      showNotification("Invalid password", "error");
    }
  };

  const handleDeleteProduct = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      onConfirm: () => {
        onUpdateProducts(products.filter(p => p.id !== id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        showNotification("Product deleted");
      }
    });
  };

  const handleDeleteWood = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Wood",
      message: "Are you sure you want to delete this wood type?",
      onConfirm: () => {
        onUpdateWoods(woods.filter(w => w.id !== id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        showNotification("Wood type deleted");
      }
    });
  };

  const handleDeleteCategory = (id: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    const hasChildren = categories.some(c => c.parentId === id);

    if (hasProducts || hasChildren) {
      showNotification("Cannot delete category with products or subcategories", "error");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      onConfirm: () => {
        onUpdateCategories(categories.filter(c => c.id !== id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        showNotification("Category deleted");
      }
    });
  };

  const moveItem = (type: 'products' | 'woods' | 'categories', index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (type === 'products') {
      const list = [...products];
      if (newIndex < 0 || newIndex >= list.length) return;
      const [removed] = list.splice(index, 1);
      list.splice(newIndex, 0, removed);
      onUpdateProducts(list);
    } else if (type === 'woods') {
      const list = [...woods];
      if (newIndex < 0 || newIndex >= list.length) return;
      const [removed] = list.splice(index, 1);
      list.splice(newIndex, 0, removed);
      onUpdateWoods(list);
    } else {
      const list = [...categories];
      if (newIndex < 0 || newIndex >= list.length) return;
      const [removed] = list.splice(index, 1);
      list.splice(newIndex, 0, removed);
      onUpdateCategories(list);
    }
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    
    let newProducts;
    if (editingProduct.id) {
      newProducts = products.map(p => p.id === editingProduct.id ? editingProduct as Product : p);
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      newProducts = [...products, { ...editingProduct, id: newId } as Product];
    }
    
    onUpdateProducts(newProducts);
    setEditingProduct(null);
    showNotification("Product saved");
  };

  const saveWood = () => {
    if (!editingWood) return;
    
    let newWoods;
    if (editingWood.id) {
      newWoods = woods.map(w => w.id === editingWood.id ? editingWood as Wood : w);
    } else {
      const newId = Math.max(0, ...woods.map(w => w.id)) + 1;
      newWoods = [...woods, { ...editingWood, id: newId } as Wood];
    }
    
    onUpdateWoods(newWoods);
    setEditingWood(null);
    showNotification("Wood saved");
  };

  const saveCategory = () => {
    if (!editingCategory || !editingCategory.id) return;
    
    let newCategories;
    const exists = categories.find(c => c.id === editingCategory.id);
    if (exists) {
      newCategories = categories.map(c => c.id === editingCategory.id ? editingCategory as Category : c);
    } else {
      newCategories = [...categories, editingCategory as Category];
    }
    
    onUpdateCategories(newCategories);
    setEditingCategory(null);
    showNotification("Category saved");
  };

  const saveContent = () => {
    if (!editingContent) return;
    onUpdateI18n(editingContent);
    showNotification("Website content saved");
  };

  const saveHomeImages = () => {
    if (!editingHomeImages) return;
    onUpdateHomeImages(editingHomeImages);
    showNotification("Home images updated");
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    onUpdateOrders(newOrders);
    showNotification("Order status updated");
  };

  const handlePublish = async () => {
    if (!githubToken) {
      showNotification("Please enter a GitHub Personal Access Token", "error");
      return;
    }
    
    setIsPublishing(true);
    localStorage.setItem('camg_github_token', githubToken);
    
    try {
      const payload = {
        products,
        woods,
        categories,
        i18nData,
        homeImages
      };
      // User info assumed from request: Taurng/cg-cangwood
      await saveToGitHub(payload, githubToken, 'Taurng', 'cg-cangwood');
      showNotification("Successfully published to live site (takes 1-2 mins to reflect)");
      setShowPublishDialog(false);
    } catch (err: any) {
      showNotification(err.message || 'Failed to publish to GitHub', "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const contentThemes = [
    { id: 'hero', name: 'Hero / Landing', keys: ['hero_title', 'subtitle', 'btn_shop_now', 'btn_enter_studio'] },
    { id: 'shop', name: 'Shop / Products', keys: ['shop_title', 'desc_shop', 'btn_enter_shop', 'cat_all', 'col_name', 'col_type', 'col_avail', 'stock_instock', 'stock_custom'] },
    { id: 'wood', name: 'Wood Guide', keys: ['wood_guide_title', 'desc_wood', 'btn_enter_wood'] },
    { id: 'about', name: 'About / Mission', keys: ['brand_mission_title', 'brand_mission_desc', 'brand_story_title', 'brand_story_desc'] },
    { id: 'nav', name: 'Navigation / Footer', keys: ['nav_mail', 'nav_ig', 'nav_line', 'nav_shop', 'nav_wood', 'status', 'location', 'admin_login'] },
    { id: 'ai', name: 'AI / Modal / Login', keys: ['btn_ai', 'modal_material', 'modal_delivery', 'btn_custom', 'btn_back_home', 'login_title', 'login_btn'] },
  ];

  const getHierarchicalName = (catId: string): string => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return "";
    if (cat.parentId) {
      return `${getHierarchicalName(cat.parentId)} > ${cat.name_zh}`;
    }
    return cat.name_zh;
  };

  const getSortedCategories = () => {
    const sorted: Category[] = [];
    const addChildren = (parentId?: string, level = 0) => {
      categories
        .filter(c => c.parentId === parentId)
        .forEach(c => {
          sorted.push({ ...c, name_zh: "  ".repeat(level) + (level > 0 ? "└ " : "") + c.name_zh });
          addChildren(c.id, level + 1);
        });
    };
    addChildren();
    return sorted;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-brand-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 shadow-2xl flex items-center gap-3 font-mono text-xs uppercase tracking-widest border border-brand-black ${
              notification.type === 'success' ? 'bg-brand-white text-green-600' : 'bg-brand-white text-red-600'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-brand-white p-8 max-w-sm w-full relative z-[301] border border-brand-black shadow-2xl"
            >
              <h4 className="font-editorial text-2xl uppercase mb-4">{confirmDialog.title}</h4>
              <p className="text-sm text-brand-darkgray mb-8 font-mono leading-relaxed">
                {confirmDialog.message}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 border border-brand-black py-3 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 bg-red-600 text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Publish to GitHub Dialog */}
      <AnimatePresence>
        {showPublishDialog && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
              onClick={() => setShowPublishDialog(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-brand-white p-8 max-w-sm w-full relative z-[301] border border-brand-black shadow-2xl"
            >
              <h4 className="font-editorial text-2xl uppercase mb-4">Publish 部署至網站</h4>
              <p className="text-sm text-brand-darkgray mb-6 font-mono leading-relaxed">
                發布後所有的改動將會生效在公開的網頁上（約需等候 1-2 分鐘）。請輸入您的 GitHub Personal Access Token：
              </p>
              <input 
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={e => setGithubToken(e.target.value)}
                className="w-full p-3 mb-8 border border-brand-black outline-none font-mono text-xs bg-gray-50/30"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPublishDialog(false)}
                  className="flex-1 border border-brand-black py-3 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex-1 bg-green-600 text-white py-3 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {isPublishing ? 'Publishing...' : 'Deploy'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-white w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative z-[201] border border-brand-black"
      >
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h2 className="font-editorial text-4xl uppercase mb-8">Admin Login</h2>
            <div className="w-full max-w-xs space-y-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Password"
                className="w-full p-3 border border-brand-black outline-none font-mono text-sm"
              />
              <button 
                onClick={handleLogin}
                className="w-full bg-brand-black text-brand-white py-3 font-mono text-sm uppercase tracking-widest"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-brand-black flex justify-between items-center bg-brand-black text-brand-white">
              <div className="flex gap-8">
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'products' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <Package className="w-4 h-4" /> Products
                </button>
                <button 
                  onClick={() => setActiveTab('categories')}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'categories' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <Layers className="w-4 h-4" /> Categories
                </button>
                <button 
                  onClick={() => setActiveTab('woods')}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'woods' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <TreeDeciduous className="w-4 h-4" /> Woods
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('content');
                    setEditingContent(i18nData);
                  }}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'content' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <Type className="w-4 h-4" /> Content
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'orders' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <ShoppingCart className="w-4 h-4" /> Orders
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'analytics' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <BarChart3 className="w-4 h-4" /> Analytics
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('images');
                    setEditingHomeImages(homeImages);
                  }}
                  className={`font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity ${activeTab === 'images' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <ImageIcon className="w-4 h-4" /> Images
                </button>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowPublishDialog(true)}
                  className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 bg-white text-brand-black px-4 py-2 hover:bg-gray-200 transition-colors shadow"
                >
                  <UploadCloud className="w-4 h-4" /> Publish to API
                </button>
                <button onClick={onClose} className="hover:rotate-90 transition-transform">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* List Sidebar */}
              <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-brand-black overflow-y-auto p-4 md:p-6 bg-gray-50/50 ${
                (editingProduct || editingWood || editingCategory || activeTab === 'content' || activeTab === 'analytics' || activeTab === 'orders' || activeTab === 'images') ? 'hidden md:block' : 'block'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-editorial text-xl uppercase tracking-tight">{activeTab}</h3>
                  {activeTab !== 'content' && activeTab !== 'analytics' && activeTab !== 'orders' && activeTab !== 'images' && (
                    <button 
                      onClick={() => {
                        if (activeTab === 'products') setEditingProduct({ images: [], stock: 'instock' });
                        else if (activeTab === 'woods') setEditingWood({});
                        else setEditingCategory({});
                      }}
                      className="bg-brand-black text-brand-white p-2 hover:bg-brand-darkgray transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {activeTab === 'content' ? (
                    contentThemes.map((theme) => (
                      <div 
                        key={theme.id}
                        className={`p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                          contentTheme === theme.id 
                          ? 'bg-brand-black text-brand-white border-brand-black shadow-md translate-x-1' 
                          : 'bg-brand-white hover:bg-white hover:border-brand-black border-transparent'
                        }`}
                        onClick={() => setContentTheme(theme.id)}
                      >
                        <p className="font-mono text-[10px] uppercase truncate font-medium">{theme.name}</p>
                      </div>
                    ))
                  ) : activeTab === 'analytics' || activeTab === 'orders' || activeTab === 'images' ? (
                    <div className="p-4 bg-white border border-brand-black/5 font-mono text-[10px] uppercase tracking-widest text-brand-gray">
                      Select an item from the main view
                    </div>
                  ) : (
                    (activeTab === 'products' ? products : activeTab === 'woods' ? woods : categories).map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`p-3 border transition-all cursor-pointer flex items-center gap-3 group ${
                          (activeTab === 'products' ? editingProduct?.id === item.id : activeTab === 'woods' ? editingWood?.id === item.id : editingCategory?.id === item.id) 
                          ? 'bg-brand-black text-brand-white border-brand-black shadow-md translate-x-1' 
                          : 'bg-brand-white hover:bg-white hover:border-brand-black border-transparent'
                        }`}
                        onClick={() => {
                          if (activeTab === 'products') setEditingProduct(item as Product);
                          else if (activeTab === 'woods') setEditingWood(item as Wood);
                          else setEditingCategory(item as Category);
                        }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveItem(activeTab, index, 'up'); }}
                            className="opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-all p-0.5"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveItem(activeTab, index, 'down'); }}
                            className="opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-all p-0.5"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[10px] uppercase truncate font-medium">
                            {activeTab === 'products' ? (item as Product).name_zh : activeTab === 'woods' ? (item as Wood).name_zh : (item as Category).name_zh}
                          </p>
                          {activeTab === 'categories' && (item as Category).parentId && (
                            <p className="font-mono text-[8px] opacity-50 truncate">
                              Parent: {(item as Category).parentId}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (activeTab === 'products') handleDeleteProduct(item.id as number); 
                            else if (activeTab === 'woods') handleDeleteWood(item.id as number);
                            else handleDeleteCategory(item.id as string);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Edit Form */}
              <div className={`flex-1 overflow-y-auto bg-brand-white ${
                !(editingProduct || editingWood || editingCategory || activeTab === 'content' || activeTab === 'analytics' || activeTab === 'orders' || activeTab === 'images') ? 'hidden md:flex' : 'flex'
              } flex-col`}>
                {(editingProduct || editingWood || editingCategory || activeTab === 'content' || activeTab === 'analytics' || activeTab === 'orders' || activeTab === 'images') && (
                  <div className="md:hidden p-4 border-b border-brand-black/10 bg-gray-50">
                    <button 
                      onClick={() => { setEditingProduct(null); setEditingWood(null); setEditingCategory(null); }}
                      className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2"
                    >
                      <X className="w-3 h-3" /> Back to list
                    </button>
                  </div>
                )}

                <div className="p-6 md:p-10">
                  {activeTab === 'products' && editingProduct ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">
                          {editingProduct.id ? 'Edit Product' : 'New Product'}
                        </h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Product Details</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (ZH)</label>
                          <input 
                            value={editingProduct.name_zh || ""}
                            onChange={e => setEditingProduct({...editingProduct, name_zh: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs transition-colors bg-gray-50/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (EN)</label>
                          <input 
                            value={editingProduct.name_en || ""}
                            onChange={e => setEditingProduct({...editingProduct, name_en: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs transition-colors bg-gray-50/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Category</label>
                          <select 
                            value={editingProduct.categoryId || ""}
                            onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          >
                            <option value="">Select Category</option>
                            {getSortedCategories().map(c => (
                              <option key={c.id} value={c.id}>{c.name_zh}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Price (NT$)</label>
                          <input 
                            type="number"
                            value={editingProduct.price || 0}
                            onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Wood Type (ZH)</label>
                          <input 
                            value={editingProduct.type_zh || ""}
                            onChange={e => setEditingProduct({...editingProduct, type_zh: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Wood Type (EN)</label>
                          <input 
                            value={editingProduct.type_en || ""}
                            onChange={e => setEditingProduct({...editingProduct, type_en: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Stock Status</label>
                        <div className="flex gap-2">
                          {['instock', 'custom'].map(s => (
                            <button 
                              key={s}
                              onClick={() => setEditingProduct({...editingProduct, stock: s as any})}
                              className={`flex-1 py-3 border font-mono text-[10px] uppercase tracking-widest transition-all ${
                                editingProduct.stock === s 
                                ? 'bg-brand-black text-brand-white border-brand-black shadow-md' 
                                : 'bg-white border-brand-black/10 hover:border-brand-black text-brand-darkgray'
                              }`}
                            >
                              {s === 'instock' ? 'In Stock' : 'Made to Order'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Description (ZH)</label>
                        <textarea 
                          value={editingProduct.desc_zh || ""}
                          onChange={e => setEditingProduct({...editingProduct, desc_zh: e.target.value})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-32 resize-none bg-gray-50/30 transition-colors leading-relaxed"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Description (EN)</label>
                        <textarea 
                          value={editingProduct.desc_en || ""}
                          onChange={e => setEditingProduct({...editingProduct, desc_en: e.target.value})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-32 resize-none bg-gray-50/30 transition-colors leading-relaxed"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Images (URLs)</label>
                          <button 
                            onClick={() => setEditingProduct({...editingProduct, images: [...(editingProduct.images || []), ""]})}
                            className="text-brand-black hover:text-blue-500 transition-colors p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(editingProduct.images || []).map((img, i) => (
                            <div key={i} className="flex gap-2 group/img">
                              <div className="flex-1 relative">
                                <input 
                                  value={img}
                                  onChange={e => {
                                    const newImgs = [...(editingProduct.images || [])];
                                    newImgs[i] = e.target.value;
                                    setEditingProduct({...editingProduct, images: newImgs});
                                  }}
                                  placeholder="https://..."
                                  className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-[10px] bg-gray-50/30 transition-colors"
                                />
                                {img && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <img src={img} className="w-6 h-6 object-cover border border-brand-black/10" alt="" referrerPolicy="no-referrer" />
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  const newImgs = (editingProduct.images || []).filter((_, idx) => idx !== i);
                                  setEditingProduct({...editingProduct, images: newImgs});
                                }}
                                className="p-3 text-red-500 hover:bg-red-50 transition-colors border border-brand-black/10 hover:border-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setEditingProduct(null)}
                          className="flex-1 border border-brand-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors order-2 sm:order-1"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={saveProduct}
                          className="flex-1 bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-brand-darkgray transition-all shadow-lg hover:shadow-xl order-1 sm:order-2"
                        >
                          Save Product
                        </button>
                      </div>
                    </div>
                  ) : activeTab === 'categories' && editingCategory ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">
                          {editingCategory.id ? 'Edit Category' : 'New Category'}
                        </h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Category Config</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Category ID (Unique)</label>
                        <input 
                          value={editingCategory.id || ""}
                          onChange={e => setEditingCategory({...editingCategory, id: e.target.value})}
                          disabled={!!categories.find(c => c.id === editingCategory.id)}
                          placeholder="cat_example"
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs disabled:bg-gray-100 transition-colors bg-gray-50/30"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (ZH)</label>
                          <input 
                            value={editingCategory.name_zh || ""}
                            onChange={e => setEditingCategory({...editingCategory, name_zh: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (EN)</label>
                          <input 
                            value={editingCategory.name_en || ""}
                            onChange={e => setEditingCategory({...editingCategory, name_en: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Parent Category</label>
                        <select 
                          value={editingCategory.parentId || ""}
                          onChange={e => setEditingCategory({...editingCategory, parentId: e.target.value || undefined})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                        >
                          <option value="">None (Root)</option>
                          {categories
                            .filter(c => c.id !== editingCategory.id)
                            .map(c => (
                              <option key={c.id} value={c.id}>{c.name_zh}</option>
                            ))}
                        </select>
                      </div>

                      <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setEditingCategory(null)}
                          className="flex-1 border border-brand-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors order-2 sm:order-1"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={saveCategory}
                          className="flex-1 bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-brand-darkgray transition-all shadow-lg order-1 sm:order-2"
                        >
                          Save Category
                        </button>
                      </div>
                    </div>
                  ) : activeTab === 'woods' && editingWood ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">
                          {editingWood.id ? 'Edit Wood Type' : 'New Wood Type'}
                        </h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Material Guide</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (ZH)</label>
                          <input 
                            value={editingWood.name_zh || ""}
                            onChange={e => setEditingWood({...editingWood, name_zh: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Name (EN)</label>
                          <input 
                            value={editingWood.name || ""}
                            onChange={e => setEditingWood({...editingWood, name: e.target.value})}
                            className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Image URL</label>
                        <input 
                          value={editingWood.img || ""}
                          onChange={e => setEditingWood({...editingWood, img: e.target.value})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Description (ZH)</label>
                        <textarea 
                          value={editingWood.desc_zh || ""}
                          onChange={e => setEditingWood({...editingWood, desc_zh: e.target.value})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-40 resize-none bg-gray-50/30 transition-colors leading-relaxed"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">Description (EN)</label>
                        <textarea 
                          value={editingWood.desc_en || ""}
                          onChange={e => setEditingWood({...editingWood, desc_en: e.target.value})}
                          className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-40 resize-none bg-gray-50/30 transition-colors leading-relaxed"
                        />
                      </div>

                      <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setEditingWood(null)}
                          className="flex-1 border border-brand-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors order-2 sm:order-1"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={saveWood}
                          className="flex-1 bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-brand-darkgray transition-all shadow-lg order-1 sm:order-2"
                        >
                          Save Wood
                        </button>
                      </div>
                    </div>
                  ) : activeTab === 'content' && editingContent ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">
                          Edit {contentThemes.find(t => t.id === contentTheme)?.name}
                        </h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Website Strings</span>
                      </div>

                      {contentThemes.find(t => t.id === contentTheme)?.keys.map((key) => (
                        <div key={key} className="space-y-4 p-4 border border-brand-black/5 bg-gray-50/30">
                          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-brand-black">{key}</p>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <label className="font-mono text-[8px] uppercase text-brand-gray">Chinese (ZH)</label>
                              {key.includes('desc') || key.includes('title') ? (
                                <textarea 
                                  value={(editingContent.zh as any)[key] || ""}
                                  onChange={e => {
                                    const newContent = { ...editingContent };
                                    (newContent.zh as any)[key] = e.target.value;
                                    setEditingContent(newContent);
                                  }}
                                  className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-24 resize-none bg-white transition-colors"
                                />
                              ) : (
                                <input 
                                  value={(editingContent.zh as any)[key] || ""}
                                  onChange={e => {
                                    const newContent = { ...editingContent };
                                    (newContent.zh as any)[key] = e.target.value;
                                    setEditingContent(newContent);
                                  }}
                                  className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-white transition-colors"
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="font-mono text-[8px] uppercase text-brand-gray">English (EN)</label>
                              {key.includes('desc') || key.includes('title') ? (
                                <textarea 
                                  value={(editingContent.en as any)[key] || ""}
                                  onChange={e => {
                                    const newContent = { ...editingContent };
                                    (newContent.en as any)[key] = e.target.value;
                                    setEditingContent(newContent);
                                  }}
                                  className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs h-24 resize-none bg-white transition-colors"
                                />
                              ) : (
                                <input 
                                  value={(editingContent.en as any)[key] || ""}
                                  onChange={e => {
                                    const newContent = { ...editingContent };
                                    (newContent.en as any)[key] = e.target.value;
                                    setEditingContent(newContent);
                                  }}
                                  className="w-full p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-white transition-colors"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-10">
                        <button 
                          onClick={saveContent}
                          className="w-full bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-brand-darkgray transition-all shadow-lg"
                        >
                          Save All Content Changes
                        </button>
                      </div>
                    </div>
                  ) : activeTab === 'analytics' ? (
                    <div className="max-w-4xl mx-auto space-y-12">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">Analytics Dashboard</h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Real-time Data</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-brand-black bg-gray-50 space-y-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">Total Views</p>
                          <p className="font-editorial text-5xl">{viewCount.toLocaleString()}</p>
                        </div>
                        <div className="p-8 border border-brand-black bg-gray-50 space-y-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">Total Orders</p>
                          <p className="font-editorial text-5xl">{orders.length}</p>
                        </div>
                        <div className="p-8 border border-brand-black bg-gray-50 space-y-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-gray">Total Revenue</p>
                          <p className="font-editorial text-4xl">NT$ {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h5 className="font-mono text-xs uppercase tracking-widest font-bold">Recent Activity</h5>
                        <div className="border border-brand-black/10 divide-y divide-brand-black/10">
                          {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="p-4 flex justify-between items-center font-mono text-[10px]">
                              <span>New Order: {order.id}</span>
                              <span className="text-brand-gray">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : activeTab === 'orders' ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">Order Management</h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">{orders.length} Orders</span>
                      </div>

                      <div className="space-y-4">
                        {orders.length === 0 ? (
                          <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-brand-gray opacity-40">
                            No orders found
                          </div>
                        ) : (
                          orders.map(order => (
                            <div key={order.id} className="border border-brand-black p-6 space-y-6 bg-gray-50/30">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="font-mono text-xs font-bold uppercase">{order.id}</p>
                                  <p className="font-mono text-[8px] text-brand-gray uppercase">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <select 
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                  className="font-mono text-[8px] uppercase border border-brand-black/20 p-2 bg-white outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between font-mono text-[10px] uppercase">
                                    <span>{item.product.name_zh} x {item.quantity}</span>
                                    <span>NT$ {(item.product.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-4 border-t border-brand-black/10 flex justify-between items-center">
                                <div className="space-y-1">
                                  <p className="font-mono text-[8px] uppercase text-brand-gray">Payment: {order.paymentMethod}</p>
                                  <p className="font-mono text-[8px] uppercase text-brand-gray">Customer: {order.customerName}</p>
                                </div>
                                <p className="font-mono text-sm font-bold">NT$ {order.total.toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : activeTab === 'images' && editingHomeImages ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      <div className="flex justify-between items-end border-b border-brand-black pb-4">
                        <h4 className="font-editorial text-2xl uppercase tracking-tight">Home Page Images</h4>
                        <span className="font-mono text-[10px] text-brand-darkgray/40 uppercase">Visual Assets</span>
                      </div>

                      <div className="space-y-6">
                        {Object.entries(editingHomeImages).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <label className="font-mono text-[10px] uppercase text-brand-darkgray font-semibold tracking-wider">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <div className="flex gap-4">
                              <input 
                                value={value}
                                onChange={e => setEditingHomeImages({...editingHomeImages, [key]: e.target.value})}
                                className="flex-1 p-3 border border-brand-black/20 focus:border-brand-black outline-none font-mono text-xs bg-gray-50/30 transition-colors"
                              />
                              {value && (
                                <div className="w-12 h-12 border border-brand-black/10 overflow-hidden flex-shrink-0">
                                  <img src={value} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-10">
                        <button 
                          onClick={saveHomeImages}
                          className="w-full bg-brand-black text-brand-white py-4 font-mono text-xs uppercase tracking-widest hover:bg-brand-darkgray transition-all shadow-lg"
                        >
                          Update All Home Images
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-brand-darkgray space-y-6 opacity-40">
                      <LayoutDashboard className="w-16 h-16" />
                      <div className="text-center space-y-2">
                        <p className="font-editorial text-2xl uppercase tracking-widest">Workspace</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Select an item to begin editing</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
