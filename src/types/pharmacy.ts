export type UserRole = 'ROLE_CUSTOMER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  address: string;
  phone: string;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  category: string;
  price: number;
  stock: number;
  expiryDate: string;
  uses: string;
  dosageInfo: string;
  sideEffects: string;
  requiresPrescription?: boolean;
}

export type PrescriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Prescription {
  id: number;
  userId: number;
  userName: string;
  doctorName: string;
  status: PrescriptionStatus;
  dosage: string;
  date: string;
  filePath: string;
  medicineName?: string;
  notes?: string;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface OrderItem {
  medicineId: number;
  medicineName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId: string;
  orderDate: string;
  shippingAddress: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  medicineId: number;
  rating: number; // 1-5
  comment: string;
  reviewDate: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface CodeFile {
  path: string;
  filename: string;
  language: 'java' | 'xml' | 'properties' | 'html' | 'sql' | 'markdown';
  category: 'Configuration' | 'Entities' | 'Repositories' | 'Services' | 'Controllers' | 'Security' | 'Thymeleaf Templates' | 'Database Scripts';
  description: string;
  content: string;
}
