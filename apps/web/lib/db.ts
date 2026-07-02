import { 
  PublicEnquiryInput, 
  TransactionInput, 
  EventBookingInput, 
  EaterySaleInput, 
  LaundryOrderInput 
} from "@iroko-court/shared";

// Seed constants matching the SQL schema exactly
const ORG_ID = "d3b07384-d113-4e4e-9824-74e1d1ee8a3e";
const BU_HALL_ID = "a1111111-1111-1111-1111-111111111111";
const BU_TABLE_ID = "b2222222-2222-2222-2222-222222222222";
const BU_PRESS_ID = "c3333333-3333-3333-3333-333333333333";

const SEED_ORGANIZATIONS = [
  {
    id: ORG_ID,
    name: "Iroko Court Limited",
    logo_url: "/images/iroko-logo.svg",
    branding_color: "#0F3D2E",
    created_at: new Date().toISOString()
  }
];

const SEED_BUSINESS_UNITS = [
  {
    id: BU_HALL_ID,
    org_id: ORG_ID,
    key: "the_hall",
    display_name: "The Hall",
    slug: "the-hall",
    icon: "sparkles",
    color: "#C89B3C",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: BU_TABLE_ID,
    org_id: ORG_ID,
    key: "the_table",
    display_name: "The Table",
    slug: "the-table",
    icon: "utensils",
    color: "#B85C38",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: BU_PRESS_ID,
    org_id: ORG_ID,
    key: "the_press",
    display_name: "The Press",
    slug: "the-press",
    icon: "shirt",
    color: "#4A6FA5",
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const SEED_CATEGORIES = [
  { id: "f1111111-1111-1111-1111-111111111111", org_id: ORG_ID, business_unit_id: BU_HALL_ID, name: "Event Bookings Revenue", type: "income" },
  { id: "f1111111-1111-1111-1111-111111111112", org_id: ORG_ID, business_unit_id: BU_HALL_ID, name: "Hall Maintenance", type: "expense" },
  { id: "f1111111-1111-1111-1111-111111111113", org_id: ORG_ID, business_unit_id: BU_HALL_ID, name: "Decorations & Audio Visual", type: "expense" },
  
  { id: "f2222222-2222-2222-2222-222222222221", org_id: ORG_ID, business_unit_id: BU_TABLE_ID, name: "Eatery Sales Revenue", type: "income" },
  { id: "f2222222-2222-2222-2222-222222222222", org_id: ORG_ID, business_unit_id: BU_TABLE_ID, name: "Kitchen Raw Ingredients", type: "expense" },
  { id: "f2222222-2222-2222-2222-222222222223", org_id: ORG_ID, business_unit_id: BU_TABLE_ID, name: "Eatery Gas & Utilities", type: "expense" },
  
  { id: "f3333333-3333-3333-3333-333333333331", org_id: ORG_ID, business_unit_id: BU_PRESS_ID, name: "Laundry Services Revenue", type: "income" },
  { id: "f3333333-3333-3333-3333-333333333332", org_id: ORG_ID, business_unit_id: BU_PRESS_ID, name: "Detergent & Softeners", type: "expense" },
  { id: "f3333333-3333-3333-3333-333333333333", org_id: ORG_ID, business_unit_id: BU_PRESS_ID, name: "Laundry Logistics & Delivery", type: "expense" }
];

const SEED_EVENT_PACKAGES = [
  {
    id: "71111111-1111-1111-1111-111111111111",
    business_unit_id: BU_HALL_ID,
    name: "Iroko Classic Wedding",
    hall_name: "The Grand Ballroom",
    capacity: 500,
    price_from: 1200000.00,
    inclusions: ["6 hours hall use", "Standard stage lighting & sound", "Tables and banquet chairs", "AC and power backup", "Dedicated security staff"],
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    is_active: true
  },
  {
    id: "71111111-1111-1111-1111-111111111112",
    business_unit_id: BU_HALL_ID,
    name: "Royal Celebrations Package",
    hall_name: "The Grand Ballroom",
    capacity: 600,
    price_from: 1800000.00,
    inclusions: ["Full day hall use", "Premium sound & automated lighting system", "Red carpet walkway & media backdrop", "VIP holding rooms", "AC, diesel backup & cleaning team"],
    image_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    is_active: true
  },
  {
    id: "71111111-1111-1111-1111-111111111113",
    business_unit_id: BU_HALL_ID,
    name: "Corporate Executive Summit",
    hall_name: "The Palm Conference Suite",
    capacity: 150,
    price_from: 750000.00,
    inclusions: ["8 hours hall use", "HD projector & widescreen display", "Wireless microphones", "Boardroom setup & lounge seating", "High speed guest Wi-Fi", "AC & power backup"],
    image_url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    is_active: true
  }
];

const SEED_MENU_ITEMS = [
  {
    id: "92222222-2222-2222-2222-222222222221",
    business_unit_id: BU_TABLE_ID,
    name: "Iroko Signature Smoky Jollof",
    description: "Rich firewood-flavored Nigerian Jollof rice, served with sweet fried plantain (dodo), salad, and your choice of grilled chicken or peppered beef.",
    price: 4500.00,
    category: "Main",
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800",
    dietary_tags: ["Spicy", "Halal"],
    is_featured: true,
    display_order: 1,
    is_active: true
  },
  {
    id: "92222222-2222-2222-2222-222222222222",
    business_unit_id: BU_TABLE_ID,
    name: "Pounded Yam & Egusi Supreme",
    description: "Fluffy, house-pounded yam served with rich Egusi soup cooked with stockfish, dry fish, tripe (shaki), and assorted meats.",
    price: 6000.00,
    category: "Main",
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800",
    dietary_tags: ["Assorted", "Traditional"],
    is_featured: true,
    display_order: 2,
    is_active: true
  },
  {
    id: "92222222-2222-2222-2222-222222222223",
    business_unit_id: BU_TABLE_ID,
    name: "Gidi Pepper Soup (Catfish)",
    description: "Freshly cooked catfish in a spicy, aromatic broth infused with traditional herbs (Utazi, Uziza) and spices. Served with a side of yam.",
    price: 5500.00,
    category: "Starter",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    dietary_tags: ["Spicy", "Gluten-Free"],
    is_featured: false,
    display_order: 3,
    is_active: true
  },
  {
    id: "92222222-2222-2222-2222-222222222224",
    business_unit_id: BU_TABLE_ID,
    name: "Chapman Classic",
    description: "The quintessential Nigerian mocktail: a refreshing blend of Fanta, Sprite, Angostura bitters, grenadine syrup, and fresh cucumber/orange garnishes.",
    price: 2500.00,
    category: "Drink",
    image_url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    dietary_tags: ["Sweet", "Non-Alcoholic"],
    is_featured: true,
    display_order: 4,
    is_active: true
  }
];

const SEED_LAUNDRY_SERVICES = [
  {
    id: "33333333-3333-3333-3333-333333333331",
    business_unit_id: BU_PRESS_ID,
    name: "Wash, Dry & Fold",
    description: "Standard laundry service for everyday garments, towels, and bed linens. Cleaned with premium detergents and professionally folded.",
    turnaround_time: "24 Hours",
    price_from: 1500.00,
    display_order: 1,
    is_active: true
  },
  {
    id: "33333333-3333-3333-3333-333333333332",
    business_unit_id: BU_PRESS_ID,
    name: "Premium Dry Cleaning",
    description: "Expert care for native wear (agbadas, Senator suits), designer wear, suits, and delicate materials. Starch level customized to your taste.",
    turnaround_time: "48 Hours",
    price_from: 3500.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    business_unit_id: BU_PRESS_ID,
    name: "Express Cleaning (Same-Day)",
    description: "Immediate turnaround service for last-minute business meetings, urgent native wears, or immediate trip preparations.",
    turnaround_time: "6 Hours",
    price_from: 5000.00,
    display_order: 3,
    is_active: true
  }
];

const SEED_TESTIMONIALS = [
  {
    id: "t1",
    business_unit_id: BU_HALL_ID,
    author_name: "Chioma Nwachukwu",
    content: "We hosted our traditional wedding at The Hall. The cooling was fantastic, the power didn't blink once, and the management made our planners feel right at home. 10/10!",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200",
    is_active: true
  },
  {
    id: "t2",
    business_unit_id: BU_TABLE_ID,
    author_name: "Femi Adesina",
    content: "The Smoky Jollof is literally the best in Ikeja. We order lunch from The Table every Friday, and the consistency is top-notch.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    is_active: true
  },
  {
    id: "t3",
    business_unit_id: BU_PRESS_ID,
    author_name: "Tunde Bakare",
    content: "My Senator suits come back looking brand new every single time. They get the starch level exactly right, which is rare for laundry centers in Lagos.",
    rating: 4,
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    is_active: true
  }
];

const SEED_COMING_SOON_UNITS = [
  {
    id: "c1",
    name: "The Yard",
    description: "Premium eco-friendly car wash and professional detailing, keeping your vehicle pristine while you dine at The Table.",
    icon: "car",
    expected_launch_label: "Q3 2026",
    is_active: true
  },
  {
    id: "c2",
    name: "The Stay",
    description: "Stylishly furnished boutique shortlet apartments for temporary stays, event guests, and business travelers.",
    icon: "bed",
    expected_launch_label: "Q4 2026",
    is_active: true
  },
  {
    id: "c3",
    name: "The Corner",
    description: "A fully-stocked mini-mart offering daily essentials, snacks, beverages, and household goods at your convenience.",
    icon: "shopping-bag",
    expected_launch_label: "Q1 2027",
    is_active: true
  }
];

const SEED_DEALS = [
  {
    id: "d1",
    title: "Friday Food Fest - Free Drinks with Every Meal",
    discount_label: "FREE CHAPMAN",
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    is_active: true
  },
  {
    id: "d2",
    title: "Dry Cleaning Package - Wash 5 Suits, Get 1 Free",
    discount_label: "BUY 5 GET 1 FREE",
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    is_active: true
  }
];

const SEED_TRANSACTIONS = [
  {
    id: "tx1",
    org_id: ORG_ID,
    business_unit_id: BU_TABLE_ID,
    type: "income",
    category_id: "f2222222-2222-2222-2222-222222222221",
    amount: 120000.00,
    currency: "NGN",
    description: "Eatery Cash Sales - Lunch hour rush",
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    source: "sale",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "tx2",
    org_id: ORG_ID,
    business_unit_id: BU_TABLE_ID,
    type: "expense",
    category_id: "f2222222-2222-2222-2222-222222222222",
    amount: 35000.00,
    currency: "NGN",
    description: "Purchase of raw chicken and fresh vegetables",
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    source: "manual",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "tx3",
    org_id: ORG_ID,
    business_unit_id: BU_PRESS_ID,
    type: "income",
    category_id: "f3333333-3333-3333-3333-333333333331",
    amount: 45000.00,
    currency: "NGN",
    description: "Dry Cleaning Bulk order payment",
    transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    source: "manual",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "tx4",
    org_id: ORG_ID,
    business_unit_id: BU_PRESS_ID,
    type: "expense",
    category_id: "f3333333-3333-3333-3333-333333333332",
    amount: 12000.00,
    currency: "NGN",
    description: "Purchased 2 packs of premium washing detergent",
    transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    source: "manual",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "tx5",
    org_id: ORG_ID,
    business_unit_id: BU_HALL_ID,
    type: "income",
    category_id: "f1111111-1111-1111-1111-111111111111",
    amount: 1200000.00,
    currency: "NGN",
    description: "Corporate Executive Summit full payment - Access Bank",
    transaction_date: new Date().toISOString().split("T")[0],
    source: "booking",
    created_at: new Date().toISOString()
  },
  {
    id: "tx6",
    org_id: ORG_ID,
    business_unit_id: BU_TABLE_ID,
    type: "income",
    category_id: "f2222222-2222-2222-2222-222222222221",
    amount: 145000.00,
    currency: "NGN",
    description: "Eatery Card Sales - Dinner rush",
    transaction_date: new Date().toISOString().split("T")[0],
    source: "sale",
    created_at: new Date().toISOString()
  },
  {
    id: "tx7",
    org_id: ORG_ID,
    business_unit_id: BU_HALL_ID,
    type: "expense",
    category_id: "f1111111-1111-1111-1111-111111111112",
    amount: 80000.00,
    currency: "NGN",
    description: "Repair of central AC unit in Palm Suite",
    transaction_date: new Date().toISOString().split("T")[0],
    source: "manual",
    created_at: new Date().toISOString()
  }
];

const SEED_EVENT_BOOKINGS = [
  {
    id: "bkg1",
    business_unit_id: BU_HALL_ID,
    client_name: "Adekunle Gold Events",
    client_contact: "+234 809 111 2222",
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    package_id: "71111111-1111-1111-1111-111111111111",
    hall_name: "The Grand Ballroom",
    total_quoted: 1200000.00,
    deposit_amount: 600000.00,
    status: "confirmed",
    created_at: new Date().toISOString()
  },
  {
    id: "bkg2",
    business_unit_id: BU_HALL_ID,
    client_name: "Dr. Alabi 60th Birthday",
    client_contact: "+234 802 333 4444",
    event_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    package_id: "71111111-1111-1111-1111-111111111112",
    hall_name: "The Grand Ballroom",
    total_quoted: 1800000.00,
    deposit_amount: 1800000.00,
    status: "confirmed",
    created_at: new Date().toISOString()
  },
  {
    id: "bkg3",
    business_unit_id: BU_HALL_ID,
    client_name: "Flutterwave Tech Gala",
    client_contact: "events@flutterwave.com",
    event_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    package_id: "71111111-1111-1111-1111-111111111113",
    hall_name: "The Palm Conference Suite",
    total_quoted: 750000.00,
    deposit_amount: 750000.00,
    status: "completed",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_EATERY_DAILY_SALES = [
  {
    id: "sale1",
    business_unit_id: BU_TABLE_ID,
    sale_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    total_covers: 42,
    total_revenue: 120000.00,
    recorded_by: null,
    created_at: new Date().toISOString()
  },
  {
    id: "sale2",
    business_unit_id: BU_TABLE_ID,
    sale_date: new Date().toISOString().split("T")[0],
    total_covers: 55,
    total_revenue: 145000.00,
    recorded_by: null,
    created_at: new Date().toISOString()
  }
];

const SEED_LAUNDRY_ORDERS = [
  {
    id: "ord1",
    business_unit_id: BU_PRESS_ID,
    customer_name: "Chief Okon",
    customer_contact: "08123456789",
    items_description: "3 White Agbadas, 1 Senator Suit (Blue) - Heavy Starch",
    drop_off_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pickup_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "collected",
    amount_charged: 14000.00,
    created_at: new Date().toISOString()
  },
  {
    id: "ord2",
    business_unit_id: BU_PRESS_ID,
    customer_name: "Amara Peters",
    customer_contact: "09033332222",
    items_description: "5 Shirts, 2 Trousers, 1 Duvet",
    drop_off_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    pickup_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "in_progress",
    amount_charged: 9500.00,
    created_at: new Date().toISOString()
  }
];

const SEED_PUBLIC_ENQUIRIES = [
  {
    id: "enq1",
    business_unit_id: BU_HALL_ID,
    type: "event_enquiry",
    full_name: "Obinna Okafor",
    phone: "08034567890",
    email: "obinna@gmail.com",
    message: "Interested in the Iroko Classic Wedding package for November 2026. What dates are open?",
    status: "new",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "enq2",
    business_unit_id: BU_PRESS_ID,
    type: "laundry_pickup",
    full_name: "Yetunde Benson",
    phone: "07088889999",
    email: "yetunde@yahoo.com",
    message: "Need express pickup for dry cleaning. 4 Senator suits.",
    status: "new",
    created_at: new Date().toISOString()
  }
];

const SEED_BUDGETS = [
  {
    id: "bud1",
    org_id: ORG_ID,
    business_unit_id: BU_HALL_ID,
    name: "Q3 Operational Budget",
    start_date: "2026-07-01",
    end_date: "2026-09-30",
    created_at: new Date().toISOString(),
    limits: [
      { category_id: "f1111111-1111-1111-1111-111111111112", limit_amount: 300000.00 },
      { category_id: "f1111111-1111-1111-1111-111111111113", limit_amount: 150000.00 }
    ]
  },
  {
    id: "bud2",
    org_id: ORG_ID,
    business_unit_id: BU_TABLE_ID,
    name: "Eatery Expenses July",
    start_date: "2026-07-01",
    end_date: "2026-07-31",
    created_at: new Date().toISOString(),
    limits: [
      { category_id: "f2222222-2222-2222-2222-222222222222", limit_amount: 600000.00 },
      { category_id: "f2222222-2222-2222-2222-222222222223", limit_amount: 120000.00 }
    ]
  },
  {
    id: "bud3",
    org_id: ORG_ID,
    business_unit_id: BU_PRESS_ID,
    name: "Laundry Operations July",
    start_date: "2026-07-01",
    end_date: "2026-07-31",
    created_at: new Date().toISOString(),
    limits: [
      { category_id: "f3333333-3333-3333-3333-333333333332", limit_amount: 100000.00 },
      { category_id: "f3333333-3333-3333-3333-333333333333", limit_amount: 80000.00 }
    ]
  }
];

// Helper to check if window/localStorage is available
const isBrowser = () => typeof window !== "undefined";

// Safe local storage get and set
function getStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setStorage<T>(key: string, data: T): void {
  if (isBrowser()) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Database Initialization
export function initDb() {
  if (!isBrowser()) return;
  
  if (!localStorage.getItem("iroko_organizations")) {
    setStorage("iroko_organizations", SEED_ORGANIZATIONS);
    setStorage("iroko_business_units", SEED_BUSINESS_UNITS);
    setStorage("iroko_categories", SEED_CATEGORIES);
    setStorage("iroko_event_packages", SEED_EVENT_PACKAGES);
    setStorage("iroko_menu_items", SEED_MENU_ITEMS);
    setStorage("iroko_laundry_services", SEED_LAUNDRY_SERVICES);
    setStorage("iroko_testimonials", SEED_TESTIMONIALS);
    setStorage("iroko_coming_soon_units", SEED_COMING_SOON_UNITS);
    setStorage("iroko_deals", SEED_DEALS);
    setStorage("iroko_transactions", SEED_TRANSACTIONS);
    setStorage("iroko_event_bookings", SEED_EVENT_BOOKINGS);
    setStorage("iroko_eatery_daily_sales", SEED_EATERY_DAILY_SALES);
    setStorage("iroko_laundry_orders", SEED_LAUNDRY_ORDERS);
    setStorage("iroko_public_enquiries", SEED_PUBLIC_ENQUIRIES);
    setStorage("iroko_budgets", SEED_BUDGETS);
    
    // Recompute daily summaries rollups from seeded transactions
    recomputeRollups();
  }
}

// Recompute rollups for daily summaries
function recomputeRollups() {
  const transactions = getStorage<any[]>("iroko_transactions", []);
  const summariesMap: Record<string, { income: number; expense: number }> = {};
  
  transactions.forEach(tx => {
    const key = `${tx.business_unit_id}_${tx.transaction_date}`;
    if (!summariesMap[key]) {
      summariesMap[key] = { income: 0, expense: 0 };
    }
    if (tx.type === "income") {
      summariesMap[key].income += Number(tx.amount);
    } else {
      summariesMap[key].expense += Number(tx.amount);
    }
  });

  const dailySummaries = Object.entries(summariesMap).map(([compoundKey, totals]) => {
    const [business_unit_id, summary_date] = compoundKey.split("_");
    return {
      id: `ds_${business_unit_id}_${summary_date}`,
      org_id: ORG_ID,
      business_unit_id,
      summary_date,
      total_income: totals.income,
      total_expense: totals.expense,
      net_profit: totals.income - totals.expense,
      created_at: new Date().toISOString()
    };
  });
  
  setStorage("iroko_daily_summaries", dailySummaries);
}

// Trigger simulation helper: update summaries for a specific transaction operation
function applyTransactionToRollup(businessUnitId: string, date: string, type: "income" | "expense", amount: number, operation: "add" | "subtract") {
  const dailySummaries = getStorage<any[]>("iroko_daily_summaries", []);
  const key = `${businessUnitId}_${date}`;
  let summary = dailySummaries.find(s => s.business_unit_id === businessUnitId && s.summary_date === date);
  
  const factor = operation === "add" ? 1 : -1;
  const valueChange = amount * factor;

  if (!summary) {
    summary = {
      id: `ds_${businessUnitId}_${date}`,
      org_id: ORG_ID,
      business_unit_id: businessUnitId,
      summary_date: date,
      total_income: 0,
      total_expense: 0,
      net_profit: 0,
      created_at: new Date().toISOString()
    };
    dailySummaries.push(summary);
  }

  if (type === "income") {
    summary.total_income = Math.max(0, summary.total_income + valueChange);
  } else {
    summary.total_expense = Math.max(0, summary.total_expense + valueChange);
  }
  summary.net_profit = summary.total_income - summary.total_expense;

  setStorage("iroko_daily_summaries", dailySummaries);
}

// API Methods (Asynchronous to match network fetches)

export async function getOrganizations() {
  initDb();
  return getStorage<any[]>("iroko_organizations", []);
}

export async function getBusinessUnits() {
  initDb();
  return getStorage<any[]>("iroko_business_units", SEED_BUSINESS_UNITS);
}

export async function getCategories(businessUnitId?: string) {
  initDb();
  const all = getStorage<any[]>("iroko_categories", []);
  if (businessUnitId) {
    return all.filter(c => c.business_unit_id === businessUnitId);
  }
  return all;
}

export async function getTransactions(businessUnitId?: string) {
  initDb();
  const all = getStorage<any[]>("iroko_transactions", []);
  all.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  
  if (businessUnitId) {
    return all.filter(t => t.business_unit_id === businessUnitId);
  }
  return all;
}

export async function getBudgets(businessUnitId?: string) {
  initDb();
  const all = getStorage<any[]>("iroko_budgets", []);
  if (businessUnitId) {
    return all.filter(b => b.business_unit_id === businessUnitId);
  }
  return all;
}

export async function getDailySummaries(businessUnitId?: string) {
  initDb();
  const all = getStorage<any[]>("iroko_daily_summaries", []);
  all.sort((a, b) => new Date(b.summary_date).getTime() - new Date(a.summary_date).getTime());
  
  if (businessUnitId) {
    return all.filter(s => s.business_unit_id === businessUnitId);
  }
  return all;
}

export async function getEventPackages() {
  initDb();
  return getStorage<any[]>("iroko_event_packages", []);
}

export async function getEventBookings() {
  initDb();
  const bookings = getStorage<any[]>("iroko_event_bookings", []);
  bookings.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  return bookings;
}

export async function getMenuItems() {
  initDb();
  const items = getStorage<any[]>("iroko_menu_items", []);
  items.sort((a, b) => a.display_order - b.display_order);
  return items;
}

export async function getEateryDailySales() {
  initDb();
  const sales = getStorage<any[]>("iroko_eatery_daily_sales", []);
  sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime());
  return sales;
}

export async function getLaundryServices() {
  initDb();
  const services = getStorage<any[]>("iroko_laundry_services", []);
  services.sort((a, b) => a.display_order - b.display_order);
  return services;
}

export async function getLaundryOrders() {
  initDb();
  const orders = getStorage<any[]>("iroko_laundry_orders", []);
  orders.sort((a, b) => new Date(b.drop_off_date).getTime() - new Date(a.drop_off_date).getTime());
  return orders;
}

export async function getTestimonials(businessUnitId?: string) {
  initDb();
  const testimonials = getStorage<any[]>("iroko_testimonials", []);
  if (businessUnitId) {
    return testimonials.filter(t => t.business_unit_id === businessUnitId);
  }
  return testimonials;
}

export async function getComingSoonUnits() {
  initDb();
  return getStorage<any[]>("iroko_coming_soon_units", []);
}

export async function getDeals() {
  initDb();
  return getStorage<any[]>("iroko_deals", []);
}

export async function getPublicEnquiries() {
  initDb();
  const enquiries = getStorage<any[]>("iroko_public_enquiries", []);
  enquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return enquiries;
}

// Mutators (with trigger simulations)

export async function createPublicEnquiry(enquiry: PublicEnquiryInput) {
  initDb();
  const enquiries = getStorage<any[]>("iroko_public_enquiries", []);
  const newEnquiry = {
    ...enquiry,
    id: `enq_${Math.random().toString(36).substr(2, 9)}`,
    status: "new",
    created_at: new Date().toISOString()
  };
  enquiries.push(newEnquiry);
  setStorage("iroko_public_enquiries", enquiries);
  return newEnquiry;
}

export async function createTransaction(tx: TransactionInput) {
  initDb();
  const transactions = getStorage<any[]>("iroko_transactions", []);
  const newTx = {
    ...tx,
    id: tx.id || `tx_${Math.random().toString(36).substr(2, 9)}`,
    org_id: ORG_ID,
    created_at: new Date().toISOString()
  };
  transactions.push(newTx);
  setStorage("iroko_transactions", transactions);
  
  // Trigger simulation: update rollup
  applyTransactionToRollup(tx.business_unit_id, tx.transaction_date, tx.type, tx.amount, "add");
  
  return newTx;
}

export async function deleteTransaction(id: string) {
  initDb();
  const transactions = getStorage<any[]>("iroko_transactions", []);
  const tx = transactions.find(t => t.id === id);
  if (!tx) return false;

  const filtered = transactions.filter(t => t.id !== id);
  setStorage("iroko_transactions", filtered);
  
  // Trigger simulation: subtract from rollup
  applyTransactionToRollup(tx.business_unit_id, tx.transaction_date, tx.type, tx.amount, "subtract");
  
  return true;
}

export async function createEventBooking(booking: EventBookingInput) {
  initDb();
  const bookings = getStorage<any[]>("iroko_event_bookings", []);
  const newBooking = {
    ...booking,
    id: booking.id || `bkg_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  };
  bookings.push(newBooking);
  setStorage("iroko_event_bookings", bookings);
  
  // If completed initially (though unlikely for a new booking), sync to ledger
  if (booking.status === "completed") {
    await postBookingToLedger(newBooking);
  }
  
  return newBooking;
}

export async function updateEventBookingStatus(id: string, status: "inquiry" | "confirmed" | "completed" | "cancelled") {
  initDb();
  const bookings = getStorage<any[]>("iroko_event_bookings", []);
  const bookingIdx = bookings.findIndex(b => b.id === id);
  if (bookingIdx === -1) return false;
  
  const oldBooking = bookings[bookingIdx];
  const updatedBooking = { ...oldBooking, status };
  bookings[bookingIdx] = updatedBooking;
  setStorage("iroko_event_bookings", bookings);
  
  // Trigger simulation: completed event -> post income ledger transaction
  if (status === "completed" && oldBooking.status !== "completed") {
    await postBookingToLedger(updatedBooking);
  } else if (status !== "completed" && oldBooking.status === "completed") {
    // Delete corresponding transaction if downgraded from completed
    const transactions = getStorage<any[]>("iroko_transactions", []);
    const tx = transactions.find(t => t.source === "booking" && t.source_ref_id === id);
    if (tx) {
      await deleteTransaction(tx.id);
    }
  }
  
  return updatedBooking;
}

async function postBookingToLedger(booking: any) {
  const categories = await getCategories(BU_HALL_ID);
  let revenueCat = categories.find(c => c.name === "Event Bookings Revenue" && c.type === "income");
  if (!revenueCat) {
    // Fail-safe category lookup
    revenueCat = { id: "f1111111-1111-1111-1111-111111111111" };
  }
  
  await createTransaction({
    business_unit_id: BU_HALL_ID,
    type: "income",
    category_id: revenueCat.id,
    amount: booking.total_quoted,
    currency: "NGN",
    description: `Revenue from Completed Booking: ${booking.client_name}`,
    transaction_date: booking.event_date,
    source: "booking",
    source_ref_id: booking.id
  });
}

export async function createEaterySale(sale: EaterySaleInput) {
  initDb();
  const sales = getStorage<any[]>("iroko_eatery_daily_sales", []);
  const newSale = {
    ...sale,
    id: sale.id || `sale_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  };
  sales.push(newSale);
  setStorage("iroko_eatery_daily_sales", sales);
  
  // Trigger simulation: eatery sale -> ledger
  const categories = await getCategories(BU_TABLE_ID);
  let revenueCat = categories.find(c => c.name === "Eatery Sales Revenue" && c.type === "income");
  if (!revenueCat) {
    revenueCat = { id: "f2222222-2222-2222-2222-222222222221" };
  }
  
  await createTransaction({
    business_unit_id: BU_TABLE_ID,
    type: "income",
    category_id: revenueCat.id,
    amount: sale.total_revenue,
    currency: "NGN",
    description: `Eatery Daily Revenue - ${sale.sale_date}`,
    transaction_date: sale.sale_date,
    source: "sale",
    source_ref_id: newSale.id
  });
  
  return newSale;
}

export async function createLaundryOrder(order: LaundryOrderInput) {
  initDb();
  const orders = getStorage<any[]>("iroko_laundry_orders", []);
  const newOrder = {
    ...order,
    id: order.id || `ord_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  };
  orders.push(newOrder);
  setStorage("iroko_laundry_orders", orders);
  
  if (order.status === "collected") {
    await postLaundryOrderToLedger(newOrder);
  }
  
  return newOrder;
}

export async function updateLaundryOrderStatus(id: string, status: "received" | "in_progress" | "ready" | "collected") {
  initDb();
  const orders = getStorage<any[]>("iroko_laundry_orders", []);
  const orderIdx = orders.findIndex(o => o.id === id);
  if (orderIdx === -1) return false;
  
  const oldOrder = orders[orderIdx];
  const updatedOrder = { ...oldOrder, status };
  orders[orderIdx] = updatedOrder;
  setStorage("iroko_laundry_orders", orders);
  
  // Trigger simulation: completed laundry order -> ledger
  if (status === "collected" && oldOrder.status !== "collected") {
    await postLaundryOrderToLedger(updatedOrder);
  } else if (status !== "collected" && oldOrder.status === "collected") {
    // Delete corresponding transaction if downgraded from collected
    const transactions = getStorage<any[]>("iroko_transactions", []);
    const tx = transactions.find(t => t.source === "order" && t.source_ref_id === id);
    if (tx) {
      await deleteTransaction(tx.id);
    }
  }
  
  return updatedOrder;
}

async function postLaundryOrderToLedger(order: any) {
  const categories = await getCategories(BU_PRESS_ID);
  let revenueCat = categories.find(c => c.name === "Laundry Services Revenue" && c.type === "income");
  if (!revenueCat) {
    revenueCat = { id: "f3333333-3333-3333-3333-333333333331" };
  }
  
  await createTransaction({
    business_unit_id: BU_PRESS_ID,
    type: "income",
    category_id: revenueCat.id,
    amount: order.amount_charged,
    currency: "NGN",
    description: `Revenue from Laundry Order: ${order.customer_name}`,
    transaction_date: new Date().toISOString().split("T")[0],
    source: "order",
    source_ref_id: order.id
  });
}
