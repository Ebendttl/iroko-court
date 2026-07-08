-- Seed data for Iroko Court Limited

-- 1. SEED ORGANIZATIONS
insert into public.organizations (id, name, logo_url, branding_color)
values (
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 
    'Iroko Court Limited', 
    '/images/iroko-logo.svg', 
    '#0F3D2E'
) on conflict (id) do nothing;

-- 2. SEED BUSINESS UNITS
insert into public.business_units (id, org_id, key, display_name, slug, icon, color, is_active)
values 
(
    'a1111111-1111-1111-1111-111111111111',
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'the_hall',
    'The Hall',
    'the-hall',
    'sparkles',
    '#C89B3C',
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'the_table',
    'The Table',
    'the-table',
    'utensils',
    '#B85C38',
    true
),
(
    'c3333333-3333-3333-3333-333333333333',
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'the_press',
    'The Press',
    'the-press',
    'shirt',
    '#4A6FA5',
    true
)
on conflict (id) do nothing;

-- 3. SEED PERMISSIONS
insert into public.permissions (id, code, description)
values
(gen_random_uuid(), 'view_financial_data', 'Allows viewing of ledger and reports'),
(gen_random_uuid(), 'manage_financial_data', 'Allows recording and updating transactions'),
(gen_random_uuid(), 'export_reports', 'Allows exporting PDF, Excel, and CSV reports'),
(gen_random_uuid(), 'manage_users', 'Allows managing staff profiles and roles'),
(gen_random_uuid(), 'manage_business_units', 'Allows editing business unit configurations'),
(gen_random_uuid(), 'set_budgets', 'Allows setting and editing budgets'),
(gen_random_uuid(), 'approve_expenses', 'Allows approving unit managers expenses'),
(gen_random_uuid(), 'view_all_units', 'Allows full cross-unit financial visibility')
on conflict (code) do nothing;

-- 4. SEED ROLES
insert into public.roles (id, org_id, name, is_system_role)
values
('e1111111-1111-1111-1111-111111111111', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Owner', true),
('e2222222-2222-2222-2222-222222222222', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Admin', true),
('e3333333-3333-3333-3333-333333333333', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Unit Manager', true),
('e4444444-4444-4444-4444-444444444444', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Finance Viewer', true),
('e5555555-5555-5555-5555-555555555555', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Report Generator', true),
('e6666666-6666-6666-6666-666666666666', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'Staff', true)
on conflict (id) do nothing;

-- 5. JOIN ROLE PERMISSIONS
-- Owner & Admin get all permissions
insert into public.role_permissions (role_id, permission_id)
select 'e1111111-1111-1111-1111-111111111111', id from public.permissions
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select 'e2222222-2222-2222-2222-222222222222', id from public.permissions
on conflict do nothing;

-- Unit Manager permissions
insert into public.role_permissions (role_id, permission_id)
select 'e3333333-3333-3333-3333-333333333333', id from public.permissions 
where code in ('view_financial_data', 'manage_financial_data', 'export_reports', 'set_budgets')
on conflict do nothing;

-- Finance Viewer permissions
insert into public.role_permissions (role_id, permission_id)
select 'e4444444-4444-4444-4444-444444444444', id from public.permissions 
where code in ('view_financial_data', 'export_reports', 'view_all_units')
on conflict do nothing;

-- Report Generator permissions
insert into public.role_permissions (role_id, permission_id)
select 'e5555555-5555-5555-5555-555555555555', id from public.permissions 
where code in ('view_financial_data', 'export_reports')
on conflict do nothing;

-- 6. SEED DEFAULT CATEGORIES FOR BUSINESS UNITS
-- The Hall Categories
insert into public.categories (id, org_id, business_unit_id, name, type)
values
('f1111111-1111-1111-1111-111111111111', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'a1111111-1111-1111-1111-111111111111', 'Event Bookings Revenue', 'income'),
('f1111111-1111-1111-1111-111111111112', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'a1111111-1111-1111-1111-111111111111', 'Hall Maintenance', 'expense'),
('f1111111-1111-1111-1111-111111111113', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'a1111111-1111-1111-1111-111111111111', 'Decorations & Audio Visual', 'expense'),
-- The Table Categories
('f2222222-2222-2222-2222-222222222221', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'b2222222-2222-2222-2222-222222222222', 'Eatery Sales Revenue', 'income'),
('f2222222-2222-2222-2222-222222222222', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'b2222222-2222-2222-2222-222222222222', 'Kitchen Raw Ingredients', 'expense'),
('f2222222-2222-2222-2222-222222222223', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'b2222222-2222-2222-2222-222222222222', 'Eatery Gas & Utilities', 'expense'),
-- The Press Categories
('f3333333-3333-3333-3333-333333333331', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'c3333333-3333-3333-3333-333333333333', 'Laundry Services Revenue', 'income'),
('f3333333-3333-3333-3333-333333333332', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'c3333333-3333-3333-3333-333333333333', 'Detergent & Softeners', 'expense'),
('f3333333-3333-3333-3333-333333333333', 'd3b07384-d113-4e4e-9824-74e1d1ee8a3e', 'c3333333-3333-3333-3333-333333333333', 'Laundry Logistics & Delivery', 'expense')
on conflict (id) do nothing;

-- 7. SEED EVENT PACKAGES
insert into public.event_packages (id, business_unit_id, name, hall_name, capacity, price_from, inclusions, image_url, is_active)
values
(
    '71111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Iroko Classic Wedding',
    'The Grand Ballroom',
    500,
    1200000.00,
    '["6 hours hall use", "Standard stage lighting & sound", "Tables and banquet chairs", "AC and power backup", "Dedicated security staff"]'::jsonb,
    '/images/hall-classic.jpg',
    true
),
(
    '71111111-1111-1111-1111-111111111112',
    'a1111111-1111-1111-1111-111111111111',
    'Royal Celebrations Package',
    'The Grand Ballroom',
    600,
    1800000.00,
    '["Full day hall use", "Premium sound & automated lighting system", "Red carpet walkway & media backdrop", "VIP holding rooms", "AC, diesel backup & cleaning team"]'::jsonb,
    '/images/hall-royal.jpg',
    true
),
(
    '71111111-1111-1111-1111-111111111113',
    'a1111111-1111-1111-1111-111111111111',
    'Corporate Executive Summit',
    'The Palm Conference Suite',
    150,
    750000.00,
    '["8 hours hall use", "HD projector & widescreen display", "Wireless microphones", "Boardroom setup & lounge seating", "High speed guest Wi-Fi", "AC & power backup"]'::jsonb,
    '/images/hall-corporate.jpg',
    true
)
on conflict (id) do nothing;

-- 8. SEED EVENT TERMS
insert into public.event_terms (id, business_unit_id, deposit_policy, cancellation_policy, damage_policy, inclusions_exclusions)
values (
    '81111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'A 50% non-refundable deposit is required to lock in the booking date. The remaining 50% balance must be settled at least 14 days prior to the event date.',
    'Cancellations made more than 30 days prior to the event will forfeit the initial deposit but no further fees will apply. Cancellations within 14 days will be charged 100% of the total quote.',
    'Clients are liable for any damages to the structure, sound equipment, AC, lighting, or furniture during the setup, event, and dismantle times. A refundable caution fee of 100,000 NGN is required.',
    'Price includes hall rental, backup generator, standard setup, and security. Excludes catering services, elaborate decoration, and event planners, which must be sourced independently.'
) on conflict (id) do nothing;

-- 9. SEED MENU ITEMS
insert into public.menu_items (id, business_unit_id, name, description, price, category, image_url, dietary_tags, is_featured, display_order, is_active)
values
(
    '92222222-2222-2222-2222-222222222221',
    'b2222222-2222-2222-2222-222222222222',
    'Iroko Signature Smoky Jollof',
    'Rich firewood-flavored Nigerian Jollof rice, served with sweet fried plantain (dodo), salad, and your choice of grilled chicken or peppered beef.',
    4500.00,
    'Main',
    '/images/food-jollof.jpg',
    '["Spicy", "Halal"]'::jsonb,
    true,
    1,
    true
),
(
    '92222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'Pounded Yam & Egusi Supreme',
    'Fluffy, house-pounded yam served with rich Egusi soup cooked with stockfish, dry fish, tripe (shaki), and assorted meats.',
    6000.00,
    'Main',
    '/images/food-egusi.jpg',
    '["Assorted", "Traditional"]'::jsonb,
    true,
    2,
    true
),
(
    '92222222-2222-2222-2222-222222222223',
    'b2222222-2222-2222-2222-222222222222',
    'Gidi Pepper Soup (Catfish)',
    'Freshly cooked catfish in a spicy, aromatic broth infused with traditional herbs (Utazi, Uziza) and spices. Served with a side of yam.',
    5500.00,
    'Starter',
    '/images/food-catfish.jpg',
    '["Spicy", "Gluten-Free"]'::jsonb,
    false,
    3,
    true
),
(
    '92222222-2222-2222-2222-222222222224',
    'b2222222-2222-2222-2222-222222222222',
    'Chapman Classic',
    'The quintessential Nigerian mocktail: a refreshing blend of Fanta, Sprite, Angostura bitters, grenadine syrup, and fresh cucumber/orange garnishes.',
    2500.00,
    'Drink',
    '/images/food-chapman.jpg',
    '["Sweet", "Non-Alcoholic"]'::jsonb,
    true,
    4,
    true
)
on conflict (id) do nothing;

-- 10. SEED LAUNDRY SERVICES
insert into public.laundry_services (id, business_unit_id, name, description, turnaround_time, price_from, display_order, is_active)
values
(
    '33333333-3333-3333-3333-333333333331',
    'c3333333-3333-3333-3333-333333333333',
    'Wash, Dry & Fold',
    'Standard laundry service for everyday garments, towels, and bed linens. Cleaned with premium detergents and professionally folded.',
    '24 Hours',
    1500.00,
    1,
    true
),
(
    '33333333-3333-3333-3333-333333333332',
    'c3333333-3333-3333-3333-333333333333',
    'Premium Dry Cleaning',
    'Expert care for native wear (agbadas, Senator suits), designer wear, suits, and delicate materials. Starch level customized to your taste.',
    '48 Hours',
    3500.00,
    2,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'Express Cleaning (Same-Day)',
    'Immediate turnaround service for last-minute business meetings, urgent native wears, or immediate trip preparations.',
    '6 Hours',
    5000.00,
    3,
    true
)
on conflict (id) do nothing;

-- 11. SEED TESTIMONIALS
insert into public.testimonials (id, business_unit_id, author_name, content, rating, image_url, is_active)
values
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'Chioma Nwachukwu',
    'We hosted our traditional wedding at The Hall. The cooling was fantastic, the power didn''t blink once, and the management made our planners feel right at home. 10/10!',
    5,
    '/images/user-chioma.jpg',
    true
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    'Femi Adesina',
    'The Smoky Jollof is literally the best in Ikeja. We order lunch from The Table every Friday, and the consistency is top-notch.',
    5,
    '/images/user-femi.jpg',
    true
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Tunde Bakare',
    'My Senator suits come back looking brand new every single time. They get the starch level exactly right, which is rare for laundry centers in Lagos.',
    4,
    '/images/user-tunde.jpg',
    true
)
on conflict do nothing;

-- 12. SEED COMING SOON UNITS
insert into public.coming_soon_units (id, name, description, icon, expected_launch_label, is_active, image_url)
values
(
    gen_random_uuid(),
    'The Yard',
    'Premium eco-friendly car wash and professional detailing, keeping your vehicle pristine while you dine at The Table.',
    'car',
    'Q3 2026',
    true,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'
),
(
    gen_random_uuid(),
    'The Stay',
    'Stylishly furnished boutique shortlet apartments for temporary stays, event guests, and business travelers.',
    'bed',
    'Q4 2026',
    true,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
),
(
    gen_random_uuid(),
    'The Corner',
    'A fully-stocked mini-mart offering daily essentials, snacks, beverages, and household goods at your convenience.',
    'shopping-bag',
    'Q1 2027',
    true,
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800'
)
on conflict do nothing;


-- 13. SEED DEALS & PROMOTIONS
insert into public.deals_promotions (id, title, discount_label, valid_from, valid_until, is_active)
values (
    gen_random_uuid(),
    'Friday Food Fest - Free Drinks with Every Meal',
    'FREE CHAPMAN',
    current_date,
    current_date + interval '6 months',
    true
),
(
    gen_random_uuid(),
    'Dry Cleaning Package - Wash 5 Suits, Get 1 Free',
    'BUY 5 GET 1 FREE',
    current_date,
    current_date + interval '3 months',
    true
)
on conflict do nothing;

-- 14. SEED SOME BASE TRANSACTIONS AND rollup DAILY SUMMARIES
-- (We seed directly to transactions; the trigger we wrote will update summaries automatically)
insert into public.transactions (org_id, business_unit_id, type, category_id, amount, currency, description, transaction_date, source)
values
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'b2222222-2222-2222-2222-222222222222',
    'income',
    'f2222222-2222-2222-2222-222222222221',
    120000.00,
    'NGN',
    'Eatery Cash Sales - Lunch hour rush',
    current_date - interval '2 days',
    'sale'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'b2222222-2222-2222-2222-222222222222',
    'expense',
    'f2222222-2222-2222-2222-222222222222',
    35000.00,
    'NGN',
    'Purchase of raw chicken and fresh vegetables',
    current_date - interval '2 days',
    'manual'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'c3333333-3333-3333-3333-333333333333',
    'income',
    'f3333333-3333-3333-3333-333333333331',
    45000.00,
    'NGN',
    'Dry Cleaning Bulk order payment',
    current_date - interval '1 day',
    'manual'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'c3333333-3333-3333-3333-333333333333',
    'expense',
    'f3333333-3333-3333-3333-333333333332',
    12000.00,
    'NGN',
    'Purchased 2 packs of premium washing detergent',
    current_date - interval '1 day',
    'manual'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'a1111111-1111-1111-1111-111111111111',
    'income',
    'f1111111-1111-1111-1111-111111111111',
    1200000.00,
    'NGN',
    'Corporate Executive Summit full payment - Access Bank',
    current_date,
    'booking'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'b2222222-2222-2222-2222-222222222222',
    'income',
    'f2222222-2222-2222-2222-222222222221',
    145000.00,
    'NGN',
    'Eatery Card Sales - Dinner rush',
    current_date,
    'sale'
),
(
    'd3b07384-d113-4e4e-9824-74e1d1ee8a3e',
    'a1111111-1111-1111-1111-111111111111',
    'expense',
    'f1111111-1111-1111-1111-111111111112',
    80000.00,
    'NGN',
    'Repair of central AC unit in Palm Suite',
    current_date,
    'manual'
)
on conflict do nothing;

-- 15. SEED SAMPLE LAUNDRY ORDERS (The Press dashboard data)
insert into public.laundry_orders (id, business_unit_id, customer_name, customer_contact, items_description, drop_off_date, pickup_date, status, amount_charged)
values
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Adebayo Okafor',
    '+234 803 456 7890',
    '2x Agbada sets, 1x Senator wear - premium starch & dry clean',
    current_date - interval '3 days',
    current_date + interval '1 day',
    'in_progress',
    18500.00
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Chioma Nwosu',
    '+234 805 234 5678',
    '3x Ankara dresses, 2x silk blouses - gentle wash & press',
    current_date - interval '2 days',
    current_date,
    'ready',
    12000.00
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Emeka Duru',
    '+234 812 345 6789',
    '5x dress shirts, 4x trousers, 2x suits - standard dry clean',
    current_date - interval '1 day',
    current_date + interval '2 days',
    'received',
    22000.00
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Funmilayo Balogun',
    '+234 701 234 5678',
    '1x Aso-oke full set, 2x lace fabric blouses - delicate hand press',
    current_date - interval '5 days',
    current_date - interval '1 day',
    'collected',
    35000.00
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'Tunde Adeleke',
    '+234 808 765 4321',
    '4x work trousers, 6x shirts - express 6-hour turnaround',
    current_date,
    current_date,
    'received',
    15500.00
)
on conflict do nothing;

-- 16. SEED SAMPLE EATERY DAILY SALES (The Table dashboard data)
insert into public.eatery_daily_sales (id, business_unit_id, sale_date, total_covers, total_revenue)
values
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '6 days',
    42,
    187500.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '5 days',
    38,
    156200.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '4 days',
    55,
    243000.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '3 days',
    61,
    298750.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '2 days',
    47,
    205000.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date - interval '1 day',
    73,
    342500.00
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    current_date,
    28,
    118000.00
)
on conflict do nothing;

-- 17. SEED SAMPLE EVENT BOOKINGS (The Hall dashboard data)
insert into public.event_bookings (id, business_unit_id, client_name, client_contact, event_date, hall_name, total_quoted, deposit_amount, status)
values
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'Oluwaseun & Adesola Fashola',
    '+234 802 345 6789',
    current_date + interval '14 days',
    'Palm Suite',
    4500000.00,
    1350000.00,
    'confirmed'
),
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'GTBank PLC - HR Division',
    '+234 1 448 0000',
    current_date + interval '7 days',
    'Iroko Grand Hall',
    2800000.00,
    840000.00,
    'confirmed'
),
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'Bola & Kemi Adeyemi',
    '+234 806 543 2109',
    current_date + interval '30 days',
    'Canopy Terrace',
    1800000.00,
    540000.00,
    'inquiry'
),
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'Access Bank Corporate Events',
    '+234 700 300 0000',
    current_date - interval '7 days',
    'Iroko Grand Hall',
    3200000.00,
    3200000.00,
    'completed'
)
on conflict do nothing;

-- 18. SEED SAMPLE PUBLIC ENQUIRIES (Leads dashboard data)
insert into public.public_enquiries (id, business_unit_id, type, full_name, phone, email, message, status)
values
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'event_enquiry',
    'Ngozi Adichie-Obi',
    '+234 803 111 2222',
    'ngozi.adichie@email.com',
    'We are planning a traditional wedding ceremony for 350 guests in September. Please send packages and availability.',
    'new'
),
(
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333',
    'laundry_pickup',
    'Chukwuemeka Eze',
    '+234 815 444 5555',
    'emeka.eze@work.com',
    'I need express 6-hour dry cleaning for 3 suits before a board meeting tomorrow morning.',
    'contacted'
),
(
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222',
    'eatery_order',
    'Sade Okonkwo',
    '+234 706 777 8888',
    'sade.o@gmail.com',
    'Office lunch order for 12 people. Interested in Jollof rice, grilled chicken and suya platters.',
    'new'
),
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'event_enquiry',
    'Biodun Adetokunbo',
    '+234 809 333 4444',
    'biodun.a@company.ng',
    'Annual company dinner for approximately 200 staff. Date flexible between October and November.',
    'new'
),
(
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111',
    'event_enquiry',
    'Mrs. Folasade Martins',
    '+234 802 999 0000',
    'folasade.m@hotmail.com',
    'Engagement party for 80 guests. Looking for a classy intimate setting with full catering included.',
    'converted'
)
on conflict do nothing;
