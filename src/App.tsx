import React, { useState } from 'react';
import {
  INITIAL_MEDICINES,
  INITIAL_ORDERS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
} from './data/initialData';
import {
  CartItem,
  Medicine,
  Order,
  OrderStatus,
  Prescription,
  PrescriptionStatus,
  Review,
  User,
  UserRole,
} from './types/pharmacy';
import { Navbar } from './components/Navbar';
import { StockAlertBanner } from './components/StockAlertBanner';
import { MedicineCatalog } from './components/customer/MedicineCatalog';
import { CartCheckout } from './components/customer/CartCheckout';
import { PrescriptionUpload } from './components/customer/PrescriptionUpload';
import { OrderTracking } from './components/customer/OrderTracking';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StockListManagement } from './components/admin/StockListManagement';
import { PrescriptionVerification } from './components/admin/PrescriptionVerification';
import { OrderProcessing } from './components/admin/OrderProcessing';
import { SpringBootExplorer } from './components/codebase/SpringBootExplorer';

export default function App() {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Customer by default
  const [activeTab, setActiveTab] = useState<string>('catalog');

  // Enterprise Domain State
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Inventory Filter state
  const [inventoryFilter, setInventoryFilter] = useState<'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Counts for alerts
  const lowStockCount = medicines.filter((m) => m.stock > 0 && m.stock < 10).length;
  const emptyStockCount = medicines.filter((m) => m.stock === 0).length;

  // Role Switcher
  const handleSwitchUser = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    if (role === 'ROLE_ADMIN') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('catalog');
    }
  };

  // Cart Handlers
  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.stock === 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        if (existing.quantity >= medicine.stock) {
          return prev;
        }
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (medicineId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === medicineId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.medicine.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (medicineId: number) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  // Checkout & Order Placement (Transactional Stock Deduction)
  const handlePlaceOrder = (shippingAddress: string) => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);
    const tax = total * 0.05;
    const shipping = total > 50 ? 0 : 4.99;
    const finalAmount = Math.round((total + tax + shipping) * 100) / 100;

    const newOrder: Order = {
      id: 5000 + orders.length + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      items: cart.map((item) => ({
        medicineId: item.medicine.id,
        medicineName: item.medicine.name,
        price: item.medicine.price,
        quantity: item.quantity,
      })),
      totalAmount: finalAmount,
      status: 'PLACED',
      paymentId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      shippingAddress,
    };

    // Deduct stock in real-time
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        const cartMatch = cart.find((c) => c.medicine.id === med.id);
        if (cartMatch) {
          const newStock = Math.max(0, med.stock - cartMatch.quantity);
          return { ...med, stock: newStock };
        }
        return med;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  // Inventory Restock Action
  const handleRestock = (medicineId: number, additionalUnits: number) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          return { ...med, stock: med.stock + additionalUnits };
        }
        return med;
      })
    );
  };

  // Save / Add Medicine
  const handleSaveMedicine = (medicine: Medicine) => {
    setMedicines((prev) => {
      const exists = prev.some((m) => m.id === medicine.id);
      if (exists) {
        return prev.map((m) => (m.id === medicine.id ? medicine : m));
      }
      return [medicine, ...prev];
    });
  };

  // Delete Medicine
  const handleDeleteMedicine = (medicineId: number) => {
    setMedicines((prev) => prev.filter((m) => m.id !== medicineId));
  };

  // Upload Prescription
  const handleUploadPrescription = (data: {
    doctorName: string;
    dosage: string;
    medicineName: string;
    filePath: string;
  }) => {
    const newRx: Prescription = {
      id: 100 + prescriptions.length + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      doctorName: data.doctorName,
      status: 'PENDING',
      dosage: data.dosage,
      date: new Date().toISOString().substring(0, 10),
      filePath: data.filePath,
      medicineName: data.medicineName,
    };
    setPrescriptions((prev) => [newRx, ...prev]);
  };

  // Verify Prescription (Admin)
  const handleVerifyPrescription = (
    id: number,
    status: PrescriptionStatus,
    remarks: string
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status, notes: remarks } : rx))
    );
  };

  // Order Status update (Admin)
  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  // Add Review
  const handleAddReview = (medicineId: number, rating: number, comment: string) => {
    const newRev: Review = {
      id: 200 + reviews.length + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      medicineId,
      rating,
      comment,
      reviewDate: new Date().toISOString().substring(0, 10),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Real-time Inventory Alert Banner for Empty & Low Stock items */}
      <StockAlertBanner
        medicines={medicines}
        onNavigateToStockList={() => {
          setInventoryFilter('ALL');
          setActiveTab('admin-inventory');
          setCurrentUser(INITIAL_USERS[1]); // switch to admin to inspect
        }}
        isAdmin={currentUser.role === 'ROLE_ADMIN'}
      />

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        lowStockCount={lowStockCount}
        emptyStockCount={emptyStockCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* CUSTOMER VIEWS */}
        {activeTab === 'catalog' && (
          <MedicineCatalog
            medicines={medicines}
            reviews={reviews}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
            onOpenPrescriptionTab={() => setActiveTab('prescriptions')}
          />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionUpload
            prescriptions={prescriptions}
            currentUser={currentUser}
            onUploadPrescription={handleUploadPrescription}
          />
        )}

        {activeTab === 'orders' && (
          <OrderTracking
            orders={orders.filter((o) => o.userId === currentUser.id)}
            onBrowseCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* ADMIN VIEWS */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            medicines={medicines}
            orders={orders}
            prescriptions={prescriptions}
            onNavigateToTab={setActiveTab}
            onFilterInventory={setInventoryFilter}
          />
        )}

        {activeTab === 'admin-inventory' && (
          <StockListManagement
            medicines={medicines}
            onRestock={handleRestock}
            onSaveMedicine={handleSaveMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            initialFilter={inventoryFilter}
          />
        )}

        {activeTab === 'admin-prescriptions' && (
          <PrescriptionVerification
            prescriptions={prescriptions}
            onVerifyPrescription={handleVerifyPrescription}
          />
        )}

        {activeTab === 'admin-orders' && (
          <OrderProcessing
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* JAVA ENTERPRISE CODEBASE & POM.XML EXPLORER */}
        {activeTab === 'code-explorer' && <SpringBootExplorer />}
      </main>

      {/* Cart & Checkout Slide-Over */}
      <CartCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        userAddress={currentUser.address}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Medicine Information & Management System</span>
            <span>&bull;</span>
            <span>Spring Boot 3 + Spring Data JPA + Security 6</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>H2 In-Memory / MySQL</span>
            <span>Hibernate ORM</span>
            <span>Thymeleaf & Bootstrap 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
