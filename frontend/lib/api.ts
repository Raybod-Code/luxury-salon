import axios from "axios";

/* ── Base URL — mock در dev، real در prod ── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/* ── Auth interceptor ── */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("pantheon_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  image_url: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category_id: string;
  image_url: string;
  is_featured: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image_url: string;
  years_experience: number;
  rating: number;
  branch_id: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingPayload {
  branch_id: string;
  service_id: string;
  stylist_id: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  notes?: string;
}

export interface Booking {
  id: string;
  confirmation_code: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  service: Service;
  stylist: Stylist;
  branch: Branch;
  date: string;
  time: string;
  total_price: number;
}

/* ════════════════════════════════════════
   MOCK DATA (حذف شود وقتی بک‌اند آماده شد)
════════════════════════════════════════ */
export const MOCK_BRANCHES: Branch[] = [
  {
    id: "b1",
    name: "شعبه ولیعصر",
    address: "خیابان ولیعصر، پلاک ۱۲۴",
    city: "تهران",
    phone: "021-88001200",
    lat: 35.7219,
    lng: 51.3347,
    image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
  },
  {
    id: "b2",
    name: "شعبه الهیه",
    address: "خیابان فرشته، کوچه مهران",
    city: "تهران",
    phone: "021-22001300",
    lat: 35.7892,
    lng: 51.4124,
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
  },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Hair Ritual",
    description: "رنگ‌آمیزی تخصصی با تکنیک‌های اختصاصی PANTHEON",
    duration_minutes: 120,
    price: 3_800_000,
    category_id: "c1",
    image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
    is_featured: true,
  },
  {
    id: "s2",
    name: "Signature Facial",
    description: "پروتکل پوستی سفارشی با محصولات اختصاصی",
    duration_minutes: 90,
    price: 2_900_000,
    category_id: "c2",
    image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
    is_featured: true,
  },
  {
    id: "s3",
    name: "Bridal Atelier",
    description: "تجربه کامل عروس — از مشاوره تا روز مراسم",
    duration_minutes: 240,
    price: 12_000_000,
    category_id: "c3",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    is_featured: true,
  },
  {
    id: "s4",
    name: "Nail Couture",
    description: "طراحی ناخن هنری با تکنیک‌های اروپایی",
    duration_minutes: 75,
    price: 1_400_000,
    category_id: "c4",
    image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600",
    is_featured: true,
  },
];

export const MOCK_STYLISTS: Stylist[] = [
  {
    id: "st1",
    name: "لیلا محمدی",
    title: "Senior Hair Artist",
    bio: "۱۲ سال تجربه در سالن‌های لندن و پاریس",
    specialties: ["رنگ", "بالایاژ", "کراتین"],
    image_url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
    years_experience: 12,
    rating: 4.98,
    branch_id: "b1",
  },
  {
    id: "st2",
    name: "نیلوفر احمدی",
    title: "Skin & Brow Specialist",
    bio: "متخصص پوست و ابرو، فارغ‌التحصیل لندن",
    specialties: ["مراقبت پوست", "لمینت ابرو", "هایلایت"],
    image_url: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400",
    years_experience: 8,
    rating: 4.95,
    branch_id: "b1",
  },
  {
    id: "st3",
    name: "مهناز کریمی",
    title: "Bridal & Makeup Artist",
    bio: "هنرمند آرایش عروس با سابقه ۱۵ سال",
    specialties: ["عروس", "میکاپ", "ایرفوش"],
    image_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
    years_experience: 15,
    rating: 4.99,
    branch_id: "b2",
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: "t1",
    name: "سارا ح.",
    text: "وارد PANTHEON که می‌شوی، می‌فهمی معنای واقعی لوکس چیست. نه در حرف، در جزئیات.",
    service: "Hair Ritual",
    date: "اردیبهشت ۱۴۰۵",
    avatar: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=100",
  },
  {
    id: "t2",
    name: "ندا م.",
    text: "رزرو آسان، استایلیست فوق‌العاده، نتیجه‌ای که هنوز باورم نمی‌شود. برمی‌گردم.",
    service: "Signature Facial",
    date: "فروردین ۱۴۰۵",
    avatar: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=100",
  },
  {
    id: "t3",
    name: "رها ک.",
    text: "Bridal Atelier واقعاً یک تجربه curated بود. از مشاوره تا آخرین دقیقه مراسم.",
    service: "Bridal Atelier",
    date: "اسفند ۱۴۰۴",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100",
  },
];

/* ════════════════════════════════════════
   API FUNCTIONS
════════════════════════════════════════ */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getBranches(): Promise<Branch[]> {
  if (USE_MOCK) return MOCK_BRANCHES;
  const { data } = await api.get("/branches");
  return data;
}

export async function getServices(categoryId?: string): Promise<Service[]> {
  if (USE_MOCK) {
    return categoryId
      ? MOCK_SERVICES.filter((s) => s.category_id === categoryId)
      : MOCK_SERVICES;
  }
  const { data } = await api.get("/services", { params: { category_id: categoryId } });
  return data;
}

export async function getStylists(branchId?: string): Promise<Stylist[]> {
  if (USE_MOCK) {
    return branchId
      ? MOCK_STYLISTS.filter((s) => s.branch_id === branchId)
      : MOCK_STYLISTS;
  }
  const { data } = await api.get("/stylists", { params: { branch_id: branchId } });
  return data;
}

export async function getAvailableSlots(
  stylistId: string,
  date: string
): Promise<TimeSlot[]> {
  if (USE_MOCK) {
    const slots = ["10:00","10:30","11:00","11:30","13:00","14:00","15:30","16:00","17:00"];
    return slots.map((time, i) => ({ time, available: i !== 3 }));
  }
  const { data } = await api.get(`/stylists/${stylistId}/slots`, { params: { date } });
  return data;
}

export async function createBooking(payload: BookingPayload): Promise<Booking> {
  if (USE_MOCK) {
    return {
      id: "mock-booking-001",
      confirmation_code: "PTH-2026-001",
      status: "confirmed",
      service: MOCK_SERVICES.find((s) => s.id === payload.service_id)!,
      stylist: MOCK_STYLISTS.find((s) => s.id === payload.stylist_id)!,
      branch: MOCK_BRANCHES.find((b) => b.id === payload.branch_id)!,
      date: payload.date,
      time: payload.time,
      total_price: 3_800_000,
    };
  }
  const { data } = await api.post("/bookings", payload);
  return data;
}