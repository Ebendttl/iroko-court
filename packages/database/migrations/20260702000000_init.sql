-- Create extension for UUID generation if it doesn't exist
create extension if not exists "uuid-ossp";

-- 1. ORGANIZATIONS
create table if not exists public.organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    logo_url text,
    branding_color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on organizations
alter table public.organizations enable row level security;

-- 2. BUSINESS UNITS
create table if not exists public.business_units (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    key text not null unique,
    display_name text not null,
    slug text not null unique,
    icon text,
    color text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on business_units
alter table public.business_units enable row level security;

-- 3. PROFILES (Linked to Supabase Auth users)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    org_id uuid references public.organizations(id) on delete cascade,
    full_name text,
    phone text,
    avatar_url text,
    default_business_unit_id uuid references public.business_units(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- 4. ROLES
create table if not exists public.roles (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    is_system_role boolean default false not null,
    unique (org_id, name)
);

-- Enable RLS on roles
alter table public.roles enable row level security;

-- 5. PERMISSIONS
create table if not exists public.permissions (
    id uuid default gen_random_uuid() primary key,
    code text not null unique,
    description text
);

-- Enable RLS on permissions
alter table public.permissions enable row level security;

-- 6. ROLE PERMISSIONS
create table if not exists public.role_permissions (
    role_id uuid references public.roles(id) on delete cascade not null,
    permission_id uuid references public.permissions(id) on delete cascade not null,
    primary key (role_id, permission_id)
);

-- Enable RLS on role_permissions
alter table public.role_permissions enable row level security;

-- 7. USER ROLES
create table if not exists public.user_roles (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    role_id uuid references public.roles(id) on delete cascade not null,
    business_unit_id uuid references public.business_units(id) on delete set null,
    unique (user_id, role_id, business_unit_id)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- 8. CATEGORIES
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    business_unit_id uuid references public.business_units(id) on delete cascade,
    name text not null,
    type text not null check (type in ('income', 'expense')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on categories
alter table public.categories enable row level security;

-- 9. SUBCATEGORIES
create table if not exists public.subcategories (
    id uuid default gen_random_uuid() primary key,
    category_id uuid references public.categories(id) on delete cascade not null,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on subcategories
alter table public.subcategories enable row level security;

-- 10. TRANSACTIONS (Unified Ledger)
create table if not exists public.transactions (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    type text not null check (type in ('income', 'expense')),
    category_id uuid references public.categories(id) on delete set null,
    subcategory_id uuid references public.subcategories(id) on delete set null,
    amount numeric(12,2) not null check (amount > 0),
    currency text default 'NGN' not null,
    description text not null,
    transaction_date date not null default current_date,
    recorded_by uuid references public.profiles(id) on delete set null,
    source text not null check (source in ('manual', 'booking', 'order', 'sale')) default 'manual',
    source_ref_id uuid,
    attachment_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on transactions
alter table public.transactions enable row level security;

-- 11. BUDGETS
create table if not exists public.budgets (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    name text not null,
    start_date date not null,
    end_date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on budgets
alter table public.budgets enable row level security;

-- 12. BUDGET LINE ITEMS
create table if not exists public.budget_line_items (
    id uuid default gen_random_uuid() primary key,
    budget_id uuid references public.budgets(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete cascade not null,
    limit_amount numeric(12,2) not null check (limit_amount >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on budget_line_items
alter table public.budget_line_items enable row level security;

-- 13. DAILY SUMMARIES (Materialized rollup cache)
create table if not exists public.daily_summaries (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    summary_date date not null,
    total_income numeric(12,2) default 0.00 not null,
    total_expense numeric(12,2) default 0.00 not null,
    net_profit numeric(12,2) default 0.00 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (business_unit_id, summary_date)
);

-- Enable RLS on daily_summaries
alter table public.daily_summaries enable row level security;

-- 14. AUDIT LOGS
create table if not exists public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    org_id uuid references public.organizations(id) on delete cascade not null,
    actor_id uuid references public.profiles(id) on delete set null,
    table_name text not null,
    action text not null,
    before_data jsonb,
    after_data jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on audit_logs
alter table public.audit_logs enable row level security;

-- 15. NOTIFICATION PREFERENCES
create table if not exists public.notification_preferences (
    user_id uuid references public.profiles(id) on delete cascade primary key,
    email_notifications boolean default true not null,
    push_notifications boolean default true not null,
    daily_summary boolean default true not null
);

-- Enable RLS on notification_preferences
alter table public.notification_preferences enable row level security;

-- 16. DEVICE TOKENS
create table if not exists public.device_tokens (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    token text not null,
    platform text check (platform in ('web', 'ios', 'android')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, token)
);

-- Enable RLS on device_tokens
alter table public.device_tokens enable row level security;

-- 17. BRANCH: THE HALL (EVENT PACKAGES)
create table if not exists public.event_packages (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    name text not null,
    hall_name text not null,
    capacity integer not null,
    price_from numeric(12,2) not null,
    inclusions jsonb default '[]'::jsonb not null,
    image_url text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on event_packages
alter table public.event_packages enable row level security;

-- 18. BRANCH: THE HALL (EVENT BOOKINGS)
create table if not exists public.event_bookings (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    client_name text not null,
    client_contact text not null,
    event_date date not null,
    package_id uuid references public.event_packages(id) on delete set null,
    hall_name text not null,
    total_quoted numeric(12,2) not null check (total_quoted >= 0),
    deposit_amount numeric(12,2) not null check (deposit_amount >= 0),
    status text not null check (status in ('inquiry', 'confirmed', 'completed', 'cancelled')) default 'inquiry',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on event_bookings
alter table public.event_bookings enable row level security;

-- 19. BRANCH: THE HALL (EVENT TERMS)
create table if not exists public.event_terms (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    deposit_policy text not null,
    cancellation_policy text not null,
    damage_policy text not null,
    inclusions_exclusions text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on event_terms
alter table public.event_terms enable row level security;

-- 20. BRANCH: THE TABLE (MENU ITEMS)
create table if not exists public.menu_items (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    name text not null,
    description text not null,
    price numeric(12,2) not null check (price >= 0),
    category text not null check (category in ('Starter', 'Main', 'Drink', 'Dessert', 'Special')),
    image_url text,
    dietary_tags jsonb default '[]'::jsonb,
    is_featured boolean default false not null,
    display_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on menu_items
alter table public.menu_items enable row level security;

-- 21. BRANCH: THE TABLE (EATERY DAILY SALES)
create table if not exists public.eatery_daily_sales (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    sale_date date not null,
    total_covers integer default 0 not null,
    total_revenue numeric(12,2) not null check (total_revenue >= 0),
    recorded_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (business_unit_id, sale_date)
);

-- Enable RLS on eatery_daily_sales
alter table public.eatery_daily_sales enable row level security;

-- 22. BRANCH: THE PRESS (LAUNDRY SERVICES)
create table if not exists public.laundry_services (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    name text not null,
    description text,
    turnaround_time text not null,
    price_from numeric(12,2) not null check (price_from >= 0),
    display_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on laundry_services
alter table public.laundry_services enable row level security;

-- 23. BRANCH: THE PRESS (LAUNDRY ORDERS)
create table if not exists public.laundry_orders (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    customer_name text not null,
    customer_contact text not null,
    items_description text not null,
    drop_off_date date not null default current_date,
    pickup_date date,
    status text not null check (status in ('received', 'in_progress', 'ready', 'collected')) default 'received',
    amount_charged numeric(12,2) not null check (amount_charged >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on laundry_orders
alter table public.laundry_orders enable row level security;

-- 24. LEAVES: CMS CONTENT - PUBLIC SERVICES
create table if not exists public.public_services (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    title text not null,
    description text not null,
    image_url text,
    is_active boolean default true not null
);

-- Enable RLS on public_services
alter table public.public_services enable row level security;

-- 25. LEAVES: CMS CONTENT - TESTIMONIALS
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade,
    author_name text not null,
    content text not null,
    rating integer check (rating >= 1 and rating <= 5),
    image_url text,
    is_active boolean default true not null
);

-- Enable RLS on testimonials
alter table public.testimonials enable row level security;

-- 26. LEAVES: CMS CONTENT - GALLERY IMAGES
create table if not exists public.gallery_images (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade not null,
    image_url text not null,
    caption text,
    display_order integer default 0 not null,
    is_active boolean default true not null
);

-- Enable RLS on gallery_images
alter table public.gallery_images enable row level security;

-- 27. LEAVES: CMS CONTENT - DEALS PROMOTIONS
create table if not exists public.deals_promotions (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    discount_label text not null,
    valid_from date not null,
    valid_until date not null,
    is_active boolean default true not null
);

-- Enable RLS on deals_promotions
alter table public.deals_promotions enable row level security;

-- 28. LEAVES: CMS CONTENT - COMING SOON UNITS
create table if not exists public.coming_soon_units (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text not null,
    icon text,
    expected_launch_label text not null,
    is_active boolean default true not null
);

-- Enable RLS on coming_soon_units
alter table public.coming_soon_units enable row level security;

-- 29. LEAVES: BRIDGE - PUBLIC ENQUIRIES
create table if not exists public.public_enquiries (
    id uuid default gen_random_uuid() primary key,
    business_unit_id uuid references public.business_units(id) on delete cascade,
    type text not null check (type in ('event_enquiry', 'laundry_pickup', 'eatery_order', 'contact', 'notify_me')),
    full_name text not null,
    phone text not null,
    email text not null,
    message text,
    metadata jsonb default '{}'::jsonb not null,
    status text not null check (status in ('new', 'contacted', 'converted', 'closed')) default 'new',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on public_enquiries
alter table public.public_enquiries enable row level security;


-- =========================================================================
-- HELPER FUNCTIONS FOR SECURITY AND RLS POLICIES
-- =========================================================================

-- Function to check if a user is an Owner or Admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
declare
    role_name text;
begin
    select r.name into role_name
    from public.user_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.user_id = user_id and r.name in ('Owner', 'Admin')
    limit 1;
    
    return role_name is not null;
end;
$$ language plpgsql security definer;

-- Function to check if a user has a specific permission
create or replace function public.has_permission(user_id uuid, perm_code text)
returns boolean as $$
declare
    has_perm boolean;
begin
    -- Admin override
    if public.is_admin(user_id) then
        return true;
    end if;

    select exists (
        select 1
        from public.user_roles ur
        join public.role_permissions rp on ur.role_id = rp.role_id
        join public.permissions p on rp.permission_id = p.id
        where ur.user_id = user_id and p.code = perm_code
    ) into has_perm;

    return has_perm;
end;
$$ language plpgsql security definer;

-- Function to get the business units a user is assigned to
create or replace function public.get_user_business_units(user_id uuid)
returns table(business_unit_id uuid) as $$
begin
    -- If admin, return all business units
    if public.is_admin(user_id) then
        return query select id from public.business_units;
    else
        return query 
        select ur.business_unit_id 
        from public.user_roles ur 
        where ur.user_id = user_id and ur.business_unit_id is not null;
    end if;
end;
$$ language plpgsql security definer;


-- =========================================================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================================================

-- Organizations Policies
create policy "Users can view their own organization" on public.organizations
    for select using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid() and profiles.org_id = organizations.id
        )
    );

create policy "Admins can manage organization" on public.organizations
    for all using (public.is_admin(auth.uid()));

-- Business Units Policies
create policy "Anyone can select active business units" on public.business_units
    for select using (is_active = true);

create policy "Staff can view all business units in their organization" on public.business_units
    for select using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid() and profiles.org_id = business_units.org_id
        )
    );

create policy "Admins can manage business units" on public.business_units
    for all using (public.is_admin(auth.uid()));

-- Profiles Policies
create policy "Users can view and update their own profiles" on public.profiles
    for all using (id = auth.uid());

create policy "Admins can manage all profiles" on public.profiles
    for all using (public.is_admin(auth.uid()));

-- Roles & Permissions Policies
create policy "Admins can manage roles" on public.roles
    for all using (public.is_admin(auth.uid()));

create policy "Authenticated users can select roles" on public.roles
    for select to authenticated using (true);

create policy "Admins can manage permissions" on public.permissions
    for all using (public.is_admin(auth.uid()));

create policy "Authenticated users can select permissions" on public.permissions
    for select to authenticated using (true);

create policy "Admins can manage role_permissions" on public.role_permissions
    for all using (public.is_admin(auth.uid()));

create policy "Authenticated users can view role_permissions" on public.role_permissions
    for select to authenticated using (true);

create policy "Admins can manage user_roles" on public.user_roles
    for all using (public.is_admin(auth.uid()));

create policy "Users can view their own roles" on public.user_roles
    for select using (user_id = auth.uid());

-- Categories and Subcategories Policies
create policy "Authenticated users can view categories" on public.categories
    for select to authenticated using (true);

create policy "Admins can manage categories" on public.categories
    for all using (public.is_admin(auth.uid()));

create policy "Managers can manage categories for their unit" on public.categories
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Authenticated users can view subcategories" on public.subcategories
    for select to authenticated using (true);

create policy "Admins can manage subcategories" on public.subcategories
    for all using (public.is_admin(auth.uid()));

-- Transactions Policies (Ledger)
create policy "Admins can view and manage all transactions" on public.transactions
    for all using (public.is_admin(auth.uid()));

create policy "Unit Managers can view transactions for assigned units" on public.transactions
    for select using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
        and public.has_permission(auth.uid(), 'view_financial_data')
    );

create policy "Unit Managers can insert transactions for assigned units" on public.transactions
    for insert with check (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
        and public.has_permission(auth.uid(), 'manage_financial_data')
    );

create policy "Unit Managers can update transactions for assigned units" on public.transactions
    for update using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
        and public.has_permission(auth.uid(), 'manage_financial_data')
    );

-- Budgets and Budget Line Items Policies
create policy "Admins can manage budgets" on public.budgets
    for all using (public.is_admin(auth.uid()));

create policy "Managers can view budgets for assigned units" on public.budgets
    for select using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Managers can manage budgets for assigned units" on public.budgets
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
        and public.has_permission(auth.uid(), 'set_budgets')
    );

create policy "Admins can manage budget line items" on public.budget_line_items
    for all using (public.is_admin(auth.uid()));

create policy "Managers can view budget line items for assigned units" on public.budget_line_items
    for select using (
        exists (
            select 1 from public.budgets b
            where b.id = budget_line_items.budget_id
            and b.business_unit_id in (select public.get_user_business_units(auth.uid()))
        )
    );

create policy "Managers can edit budget line items for assigned units" on public.budget_line_items
    for all using (
        exists (
            select 1 from public.budgets b
            where b.id = budget_line_items.budget_id
            and b.business_unit_id in (select public.get_user_business_units(auth.uid()))
            and public.has_permission(auth.uid(), 'set_budgets')
        )
    );

-- Daily Summaries Policies
create policy "Admins can view all summaries" on public.daily_summaries
    for select using (public.is_admin(auth.uid()));

create policy "Managers can view summaries for assigned units" on public.daily_summaries
    for select using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

-- Audit Logs Policies
create policy "Admins can view audit logs" on public.audit_logs
    for select using (public.is_admin(auth.uid()));

-- Notification Preferences and Device Tokens Policies
create policy "Users can manage their own notification preferences" on public.notification_preferences
    for all using (user_id = auth.uid());

create policy "Users can manage their own device tokens" on public.device_tokens
    for all using (user_id = auth.uid());

-- Public CMS Content Tables Policies
create policy "Anyone can select active public services" on public.public_services
    for select using (is_active = true);

create policy "Managers/Admins can edit public services" on public.public_services
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can select active testimonials" on public.testimonials
    for select using (is_active = true);

create policy "Managers/Admins can edit testimonials" on public.testimonials
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id is null or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can select active gallery images" on public.gallery_images
    for select using (is_active = true);

create policy "Managers/Admins can edit gallery images" on public.gallery_images
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can select active deals and promotions" on public.deals_promotions
    for select using (is_active = true);

create policy "Admins/Managers can edit deals and promotions" on public.deals_promotions
    for all using (public.has_permission(auth.uid(), 'manage_business_units'));

create policy "Anyone can select active coming soon units" on public.coming_soon_units
    for select using (is_active = true);

create policy "Admins can manage coming soon units" on public.coming_soon_units
    for all using (public.is_admin(auth.uid()));

-- Public Enquiries Policies
create policy "Anyone can insert public enquiries" on public.public_enquiries
    for insert with check (true);

create policy "Admins can manage all enquiries" on public.public_enquiries
    for all using (public.is_admin(auth.uid()));

create policy "Managers can view/manage enquiries for their business unit" on public.public_enquiries
    for all using (
        business_unit_id is null or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

-- Branch Specific Operational Tables Policies
create policy "Anyone can view active event packages" on public.event_packages
    for select using (is_active = true);

create policy "Managers can manage event packages for assigned units" on public.event_packages
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Managers/Admins can manage event bookings" on public.event_bookings
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can view event terms" on public.event_terms
    for select using (true);

create policy "Managers can manage event terms for their units" on public.event_terms
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can view active menu items" on public.menu_items
    for select using (is_active = true);

create policy "Managers can manage menu items for their units" on public.menu_items
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Managers/Admins can manage eatery daily sales" on public.eatery_daily_sales
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Anyone can view active laundry services" on public.laundry_services
    for select using (is_active = true);

create policy "Managers can manage laundry services for their units" on public.laundry_services
    for all using (
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );

create policy "Managers/Admins can manage laundry orders" on public.laundry_orders
    for all using (
        public.is_admin(auth.uid()) or
        business_unit_id in (select public.get_user_business_units(auth.uid()))
    );


-- =========================================================================
-- DATABASE TRIGGERS FOR AUTO-POSTING TO THE LEDGER
-- =========================================================================

-- Trigger function for Event Bookings -> Ledger
create or replace function public.trg_sync_event_booking_to_ledger()
returns trigger as $$
declare
    v_org_id uuid;
    v_category_id uuid;
begin
    -- Get organization ID
    select org_id into v_org_id from public.business_units where id = NEW.business_unit_id;

    -- Ensure category exists for event revenue
    select id into v_category_id 
    from public.categories 
    where business_unit_id = NEW.business_unit_id and name = 'Event Bookings Revenue' and type = 'income'
    limit 1;

    if v_category_id is null then
        insert into public.categories (org_id, business_unit_id, name, type)
        values (v_org_id, NEW.business_unit_id, 'Event Bookings Revenue', 'income')
        returning id into v_category_id;
    end if;

    -- If booking goes to 'completed', insert a transaction
    if NEW.status = 'completed' and (OLD.status is null or OLD.status != 'completed') then
        insert into public.transactions (
            org_id, business_unit_id, type, category_id, amount, currency, 
            description, transaction_date, source, source_ref_id
        ) values (
            v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.total_quoted, 'NGN',
            'Revenue from Completed Booking: ' || NEW.client_name, NEW.event_date, 'booking', NEW.id
        );
    -- If it was completed but got changed back/cancelled, remove the transaction
    elsif NEW.status != 'completed' and OLD.status = 'completed' then
        delete from public.transactions 
        where source = 'booking' and source_ref_id = NEW.id;
    end if;

    return NEW;
end;
$$ language plpgsql security definer;

create trigger sync_event_booking_to_ledger_trigger
after insert or update of status on public.event_bookings
for each row execute function public.trg_sync_event_booking_to_ledger();


-- Trigger function for Laundry Orders -> Ledger
create or replace function public.trg_sync_laundry_order_to_ledger()
returns trigger as $$
declare
    v_org_id uuid;
    v_category_id uuid;
begin
    -- Get organization ID
    select org_id into v_org_id from public.business_units where id = NEW.business_unit_id;

    -- Ensure category exists for laundry revenue
    select id into v_category_id 
    from public.categories 
    where business_unit_id = NEW.business_unit_id and name = 'Laundry Services Revenue' and type = 'income'
    limit 1;

    if v_category_id is null then
        insert into public.categories (org_id, business_unit_id, name, type)
        values (v_org_id, NEW.business_unit_id, 'Laundry Services Revenue', 'income')
        returning id into v_category_id;
    end if;

    -- If order goes to 'collected', insert a transaction
    if NEW.status = 'collected' and (OLD.status is null or OLD.status != 'collected') then
        insert into public.transactions (
            org_id, business_unit_id, type, category_id, amount, currency, 
            description, transaction_date, source, source_ref_id
        ) values (
            v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.amount_charged, 'NGN',
            'Revenue from Laundry Order: ' || NEW.customer_name, current_date, 'order', NEW.id
        );
    -- If it was collected but got changed back, remove the transaction
    elsif NEW.status != 'collected' and OLD.status = 'collected' then
        delete from public.transactions 
        where source = 'order' and source_ref_id = NEW.id;
    end if;

    return NEW;
end;
$$ language plpgsql security definer;

create trigger sync_laundry_order_to_ledger_trigger
after insert or update of status on public.laundry_orders
for each row execute function public.trg_sync_laundry_order_to_ledger();


-- Trigger function for Eatery Daily Sales -> Ledger
create or replace function public.trg_sync_eatery_sales_to_ledger()
returns trigger as $$
declare
    v_org_id uuid;
    v_category_id uuid;
begin
    -- Get organization ID
    select org_id into v_org_id from public.business_units where id = NEW.business_unit_id;

    -- Ensure category exists for eatery revenue
    select id into v_category_id 
    from public.categories 
    where business_unit_id = NEW.business_unit_id and name = 'Eatery Sales Revenue' and type = 'income'
    limit 1;

    if v_category_id is null then
        insert into public.categories (org_id, business_unit_id, name, type)
        values (v_org_id, NEW.business_unit_id, 'Eatery Sales Revenue', 'income')
        returning id into v_category_id;
    end if;

    if TG_OP = 'INSERT' then
        insert into public.transactions (
            org_id, business_unit_id, type, category_id, amount, currency, 
            description, transaction_date, source, source_ref_id, recorded_by
        ) values (
            v_org_id, NEW.business_unit_id, 'income', v_category_id, NEW.total_revenue, 'NGN',
            'Eatery Daily Revenue - ' || NEW.sale_date::text, NEW.sale_date, 'sale', NEW.id, NEW.recorded_by
        );
    elsif TG_OP = 'UPDATE' then
        update public.transactions
        set amount = NEW.total_revenue,
            transaction_date = NEW.sale_date,
            description = 'Eatery Daily Revenue - ' || NEW.sale_date::text,
            recorded_by = NEW.recorded_by,
            updated_at = timezone('utc'::text, now())
        where source = 'sale' and source_ref_id = NEW.id;
    elsif TG_OP = 'DELETE' then
        delete from public.transactions 
        where source = 'sale' and source_ref_id = OLD.id;
    end if;

    return null;
end;
$$ language plpgsql security definer;

create trigger sync_eatery_sales_to_ledger_trigger
after insert or update or delete on public.eatery_daily_sales
for each row execute function public.trg_sync_eatery_sales_to_ledger();


-- =========================================================================
-- DATABASE TRIGGERS FOR DAILY SUMMARIES CACHING (REAL-TIME ROLLUP)
-- =========================================================================

create or replace function public.trg_update_daily_summaries_from_transaction()
returns trigger as $$
declare
    v_org_id uuid;
    v_bu_id uuid;
    v_date date;
    v_income_diff numeric(12,2) := 0.00;
    v_expense_diff numeric(12,2) := 0.00;
begin
    -- Determine which row we are getting values from
    if TG_OP = 'INSERT' then
        v_org_id := NEW.org_id;
        v_bu_id := NEW.business_unit_id;
        v_date := NEW.transaction_date;
        if NEW.type = 'income' then
            v_income_diff := NEW.amount;
        else
            v_expense_diff := NEW.amount;
        end if;
    elsif TG_OP = 'UPDATE' then
        v_org_id := NEW.org_id;
        v_bu_id := NEW.business_unit_id;
        v_date := NEW.transaction_date;
        
        -- Handle case where date or business unit changed (complex logic: subtract old, add new)
        if OLD.transaction_date != NEW.transaction_date or OLD.business_unit_id != NEW.business_unit_id then
            -- Subtract OLD amount from old summary date
            if OLD.type = 'income' then
                insert into public.daily_summaries (org_id, business_unit_id, summary_date, total_income, total_expense, net_profit)
                values (OLD.org_id, OLD.business_unit_id, OLD.transaction_date, 0.00, 0.00, 0.00)
                on conflict (business_unit_id, summary_date)
                do update set 
                    total_income = daily_summaries.total_income - OLD.amount,
                    net_profit = daily_summaries.net_profit - OLD.amount;
            else
                insert into public.daily_summaries (org_id, business_unit_id, summary_date, total_income, total_expense, net_profit)
                values (OLD.org_id, OLD.business_unit_id, OLD.transaction_date, 0.00, 0.00, 0.00)
                on conflict (business_unit_id, summary_date)
                do update set 
                    total_expense = daily_summaries.total_expense - OLD.amount,
                    net_profit = daily_summaries.net_profit + OLD.amount;
            end if;
            
            -- Prepare NEW amount to be added to new date
            if NEW.type = 'income' then
                v_income_diff := NEW.amount;
            else
                v_expense_diff := NEW.amount;
            end if;
        else
            -- Date and BU are the same, just amount or type changed
            if OLD.type = 'income' then
                v_income_diff := v_income_diff - OLD.amount;
            else
                v_expense_diff := v_expense_diff - OLD.amount;
            end if;
            
            if NEW.type = 'income' then
                v_income_diff := v_income_diff + NEW.amount;
            else
                v_expense_diff := v_expense_diff + NEW.amount;
            end if;
        end if;
    elsif TG_OP = 'DELETE' then
        v_org_id := OLD.org_id;
        v_bu_id := OLD.business_unit_id;
        v_date := OLD.transaction_date;
        if OLD.type = 'income' then
            v_income_diff := -OLD.amount;
        else
            v_expense_diff := -OLD.amount;
        end if;
    end if;

    -- Upsert the rollup entry
    insert into public.daily_summaries (
        org_id, business_unit_id, summary_date, total_income, total_expense, net_profit
    ) values (
        v_org_id, v_bu_id, v_date, 
        greatest(0.00, v_income_diff), 
        greatest(0.00, v_expense_diff), 
        (v_income_diff - v_expense_diff)
    )
    on conflict (business_unit_id, summary_date)
    do update set
        total_income = greatest(0.00, daily_summaries.total_income + v_income_diff),
        total_expense = greatest(0.00, daily_summaries.total_expense + v_expense_diff),
        net_profit = daily_summaries.net_profit + (v_income_diff - v_expense_diff);

    return null;
end;
$$ language plpgsql security definer;

create trigger update_daily_summaries_from_transaction_trigger
after insert or update or delete on public.transactions
for each row execute function public.trg_update_daily_summaries_from_transaction();
