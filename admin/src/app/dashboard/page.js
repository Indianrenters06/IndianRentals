"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users, CurrencyInr, Package, TrendUp, TrendDown,
  ChartLineUp, DotsThreeVertical, DownloadSimple,
  Bell, ShieldCheck, ArrowRight, CheckCircle, Clock
} from "@phosphor-icons/react";
import { downloadPDFInvoice } from "@/utils/pdfInvoice";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton
} from "@heroui/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

/* ────────────────────────────────────────────────────────────────────────────
   Design tokens for this screen.

   Every surface, ink role and radius is named once here. The old dashboard set
   these ad-hoc per card, which is why the same semantic (say "muted label")
   appeared as slate-100, -200, -300 and -400 in four different places and the
   screen read as noisy. One definition per role keeps the rhythm consistent.
   ──────────────────────────────────────────────────────────────────────────── */

const SURFACE =
  "bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl";

const INK = {
  primary: "text-slate-900 dark:text-slate-50",
  secondary: "text-slate-600 dark:text-slate-400",
  muted: "text-slate-500 dark:text-slate-500",
  faint: "text-slate-400 dark:text-slate-600",
};

// Type scale — four sizes, used strictly by role.
const TYPE = {
  pageTitle: "text-[26px] leading-tight font-semibold tracking-tight",
  figure: "text-[30px] leading-none font-semibold tracking-tight",   // proportional, not tabular
  panelTitle: "text-[15px] leading-tight font-semibold",
  body: "text-[13px] leading-normal",
};

/* ── Charts read colour from live design tokens rather than pinning a hex.
   globals.css remaps the indigo-* scale to the IndianRenters saffron and
   Settings → Branding can repoint it at runtime, so a hardcoded colour silently
   drifts off-brand. The observer re-reads on theme and branding changes. */
const CHART_FALLBACK = {
  brand: "#f08c00",
  tick: "#64748b",
  grid: "rgba(100,116,139,0.16)",
  tooltipBg: "rgba(15,23,42,0.92)",
  chartFont: "inherit",
};

function useChartTheme() {
  const [theme, setTheme] = useState(CHART_FALLBACK);

  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const isDark = root.classList.contains("dark");
      setTheme({
        brand:
          cs.getPropertyValue("--color-indigo-500").trim() ||
          cs.getPropertyValue("--accent").trim() ||
          CHART_FALLBACK.brand,
        // Axis furniture stays recessive and follows the surface it sits on.
        tick: isDark ? "#94a3b8" : "#64748b",
        grid: isDark ? "rgba(148,163,184,0.14)" : "rgba(100,116,139,0.16)",
        tooltipBg: isDark ? "rgba(2,6,23,0.94)" : "rgba(15,23,42,0.92)",
        chartFont: getComputedStyle(document.body).fontFamily || "inherit",
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

// Chart.js gradient stops need rgba(), but the brand arrives as a hex token.
function withAlpha(color, alpha) {
  const m = /^#?([a-f\d]{6})$/i.exec(String(color).trim());
  const n = parseInt(m ? m[1] : CHART_FALLBACK.brand.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* ── Number that counts up once it scrolls into view. Skipped entirely when the
   viewer prefers reduced motion — the value appears immediately instead. */
function CountUp({ value = 0, prefix = "", duration = 1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const to = Number(value) || 0;
    if (reduceMotion || !inView) {
      if (reduceMotion) setDisplay(to);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setDisplay(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display).toLocaleString("en-IN")}
    </span>
  );
}

/* ── A single entrance motion, used everywhere. The previous screen mixed spring
   stagger, scale-in, slide-in and hover sheen; settling on one quiet fade-up is
   what makes the page read as composed rather than animated. */
const riseIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function Panel({ title, subtitle, action, children, className = "", bodyClassName = "" }) {
  return (
    <motion.section variants={riseIn} className={`${SURFACE} flex flex-col ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <h2 className={`${TYPE.panelTitle} ${INK.primary}`}>{title}</h2>
            {subtitle && <p className={`${TYPE.body} mt-1 ${INK.muted}`}>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}

// Percentage change, shown only when there is a real baseline to compare against.
function Delta({ current, previous }) {
  if (!previous) return null;
  const pct = ((current - previous) / previous) * 100;
  if (!isFinite(pct)) return null;
  const up = pct >= 0;
  const Icon = up ? TrendUp : TrendDown;
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
      }`}
    >
      <Icon weight="bold" className="w-3.5 h-3.5" />
      {Math.abs(pct) >= 100 ? Math.round(Math.abs(pct)) : Math.abs(pct).toFixed(1)}%
    </span>
  );
}

/* ── Stat tile. Label first, figure dominant, context underneath. The old tile
   led with a 44px saturated icon chip, which drew the eye to decoration rather
   than the number; the icon is now a small recessive marker. */
function StatTile({ label, value, prefix, icon: Icon, hint, delta, onPress }) {
  return (
    <motion.button
      variants={riseIn}
      type="button"
      onClick={onPress}
      className={`${SURFACE} p-5 text-left w-full flex flex-col gap-3.5
                  transition-colors duration-200
                  hover:border-slate-300 dark:hover:border-slate-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`${TYPE.body} font-medium ${INK.secondary}`}>{label}</span>
        <Icon className={`w-4 h-4 shrink-0 ${INK.faint}`} weight="bold" />
      </div>
      <div className={`${TYPE.figure} ${INK.primary}`}>
        <CountUp value={value} prefix={prefix} />
      </div>
      <div className={`${TYPE.body} flex items-center gap-2 min-h-[18px]`}>
        {delta}
        <span className={`${INK.muted} truncate`}>{hint}</span>
      </div>
    </motion.button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto w-full pb-10 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl hidden sm:block" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${SURFACE} p-5 space-y-3.5`}>
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${SURFACE} lg:col-span-2 p-5 space-y-4`}>
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-[248px] w-full rounded-xl" />
        </div>
        <div className={`${SURFACE} p-5 space-y-4`}>
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <div className="space-y-3.5">
            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-7 w-full rounded" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${SURFACE} lg:col-span-2 p-5 space-y-3`}>
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-lg" />)}
        </div>
        <div className={`${SURFACE} p-5 space-y-3`}>
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      </div>
    </div>
  );
}

// Lifecycle order, mirroring the Rental schema's status enum.
const STATUS_ORDER = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Active', 'Returned', 'Cancelled'];

const STATUS_CHIP_COLOR = {
  Pending: 'warning', Approved: 'primary', Shipped: 'secondary',
  Delivered: 'success', Active: 'success', Returned: 'default',
  Cancelled: 'danger',
};

const RANGE_CONFIG = {
  '1M': { unit: 'day', count: 30, label: 'last 30 days' },
  '3M': { unit: 'week', count: 12, label: 'last 12 weeks' },
  '6M': { unit: 'month', count: 6, label: 'last 6 months' },
  '1Y': { unit: 'month', count: 12, label: 'last 12 months' },
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'date', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [chartRange, setChartRange] = useState('1M');
  const router = useRouter();
  const rowsPerPage = 5;

  const { brand, tick, grid, tooltipBg, chartFont } = useChartTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedInfo = localStorage.getItem("adminInfo");
      if (storedInfo) {
        try {
          const parsed = JSON.parse(storedInfo);
          setAdminName(parsed.user?.name || parsed.name || "Admin");
        } catch (e) { }
      }
    }
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          router.push("/");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/stats`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        setDashboardData(await res.json());
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [router]);

  /* ── Revenue: real paid revenue per day, bucketed into the selected range.
     An empty bucket means nothing was earned then, not missing data. */
  const revenueByDay = dashboardData?.revenueByDay || [];

  const dayTotal = (fromDaysAgo, toDaysAgo) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const from = new Date(today); from.setDate(today.getDate() - fromDaysAgo);
    const to = new Date(today); to.setDate(today.getDate() - toDaysAgo);
    return revenueByDay.reduce((sum, { date, total }) => {
      const [y, m, d] = String(date).split('-').map(Number);
      const t = new Date(y, m - 1, d).getTime();
      return t >= from.getTime() && t < to.getTime() ? sum + (Number(total) || 0) : sum;
    }, 0);
  };
  const revenueLast30 = dayTotal(29, -1);
  const revenuePrev30 = dayTotal(59, 29);

  const buildRevenueSeries = (range) => {
    const { unit, count } = RANGE_CONFIG[range] || RANGE_CONFIG['1M'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buckets = [];
    if (unit === 'month') {
      for (let i = count - 1; i >= 0; i--) {
        const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
        buckets.push({ start, end, label: start.toLocaleDateString('en-IN', { month: 'short' }), total: 0 });
      }
    } else {
      const step = unit === 'week' ? 7 : 1;
      for (let i = count - 1; i >= 0; i--) {
        const start = new Date(today);
        start.setDate(today.getDate() - i * step - (step - 1));
        const end = new Date(today);
        end.setDate(today.getDate() - i * step + 1);
        buckets.push({
          start, end,
          label: start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          total: 0,
        });
      }
    }

    revenueByDay.forEach(({ date, total }) => {
      const [y, m, d] = String(date).split('-').map(Number);
      const t = new Date(y, m - 1, d).getTime();
      const bucket = buckets.find((b) => t >= b.start.getTime() && t < b.end.getTime());
      if (bucket) bucket.total += Number(total) || 0;
    });

    return { labels: buckets.map((b) => b.label), data: buckets.map((b) => Math.round(b.total)) };
  };

  const revenueSeries = buildRevenueSeries(chartRange);
  const rangeTotal = revenueSeries.data.reduce((a, b) => a + b, 0);

  const revenueChartData = {
    labels: revenueSeries.labels,
    datasets: [{
      label: 'Revenue',
      data: revenueSeries.data,
      borderColor: brand,
      backgroundColor: (ctx) => {
        const { ctx: c, chartArea } = ctx.chart;
        if (!chartArea) return withAlpha(brand, 0.1);
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, withAlpha(brand, 0.22));
        g.addColorStop(1, withAlpha(brand, 0));
        return g;
      },
      fill: true,
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHitRadius: 24,          // generous hit target, not a pinpoint
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: brand,
      pointHoverBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },   // single series — the panel title names it
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: '#fff',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { family: chartFont, size: 12 },
        bodyFont: { family: chartFont, size: 13, weight: '600' },
        callbacks: { label: (ctx) => `₹${Number(ctx.parsed.y || 0).toLocaleString('en-IN')}` },
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: grid, tickLength: 0 },
        ticks: {
          color: tick,
          font: { family: chartFont, size: 12 },
          maxTicksLimit: 5,
          padding: 8,
          callback: (v) => (v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : `₹${v}`),
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: tick,
          font: { family: chartFont, size: 12 },
          maxTicksLimit: 7,
          maxRotation: 0,
          padding: 4,
        },
        border: { display: false }
      }
    },
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 700, easing: 'easeOutQuart' },
  };

  /* ── Order pipeline across ALL orders. One series, so one colour: the stage
     name carries identity and bar length carries magnitude. */
  const statusCounts = dashboardData?.rentalsByStatus || {};
  const pipelineTotal = STATUS_ORDER.reduce((sum, s) => sum + (statusCounts[s] || 0), 0);
  const pipelineMax = Math.max(1, ...STATUS_ORDER.map((s) => statusCounts[s] || 0));

  const recentRentals = dashboardData?.recentRentals?.map((rental) => {
    const items = rental.orderItems || [];
    return {
      id: `RNT-${rental._id.toString().slice(-4).toUpperCase()}`,
      user: rental.user?.name || "Deleted user",
      item: items.length
        ? `${items[0].name}${items.length > 1 ? ` +${items.length - 1} more` : ""}`
        : "—",
      amount: `₹${parseFloat(rental.totalPrice || 0).toLocaleString("en-IN")}`,
      status: rental.status,
      date: new Date(rental.createdAt).toLocaleDateString("en-IN", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      }),
      _raw: rental
    };
  }) || [];

  const sortedRentals = [...recentRentals].sort((a, b) => {
    const col = sortDescriptor.column;
    let aVal, bVal;
    if (col === 'amount') {
      aVal = parseFloat((a.amount || '').replace(/[₹,]/g, ''));
      bVal = parseFloat((b.amount || '').replace(/[₹,]/g, ''));
    } else if (col === 'date') {
      aVal = new Date(a._raw?.createdAt || 0).getTime();
      bVal = new Date(b._raw?.createdAt || 0).getTime();
    } else {
      aVal = (a[col] || '').toLowerCase();
      bVal = (b[col] || '').toLowerCase();
    }
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRentals.length / rowsPerPage));
  const paginatedRentals = sortedRentals.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const notifications = dashboardData?.recentNotifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const pendingKYC = dashboardData?.pendingKYC || 0;
  const totalUsers = dashboardData?.totalUsers || 0;

  const renderStatusChip = (status) => {
    if (!status) return <Chip size="sm" variant="flat">Unknown</Chip>;
    const icon = status === 'Pending'
      ? <Clock weight="bold" className="ml-1" />
      : (status === 'Active' || status === 'Delivered')
        ? <CheckCircle weight="bold" className="ml-1" />
        : undefined;
    return (
      <Chip size="sm" color={STATUS_CHIP_COLOR[status] || 'default'} variant="flat" startContent={icon}>
        {status}
      </Chip>
    );
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      className="max-w-[1400px] mx-auto w-full pb-10 space-y-6"
    >
      {/* ── Header. A single primary action; the old screen had two competing
             filled buttons at different heights. */}
      <motion.header variants={riseIn} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className={`${TYPE.pageTitle} ${INK.primary}`}>
            Welcome back, {adminName}
          </h1>
          <p className={`text-sm mt-1.5 ${INK.muted}`}>
            Here&apos;s what&apos;s happening with your rental business today.
          </p>
        </div>
        <Button
          variant="bordered"
          className={`rounded-xl h-10 px-4 font-medium shrink-0 border-slate-300 dark:border-slate-700 ${INK.secondary}
                      hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 dark:hover:text-indigo-400
                      transition-colors`}
          startContent={<DownloadSimple className="w-4 h-4" />}
          onPress={() => router.push('/dashboard/reports/revenue')}
        >
          Reports
        </Button>
      </motion.header>

      {/* ── Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Revenue"
          value={parseFloat(dashboardData?.totalRevenue || 0)}
          prefix="₹"
          icon={CurrencyInr}
          delta={<Delta current={revenueLast30} previous={revenuePrev30} />}
          hint={`₹${revenueLast30.toLocaleString('en-IN')} in 30d`}
          onPress={() => router.push('/dashboard/reports/revenue')}
        />
        <StatTile
          label="Total Orders"
          value={dashboardData?.totalRentals || 0}
          icon={Package}
          delta={<Delta current={dashboardData?.ordersLast30 || 0} previous={dashboardData?.ordersPrev30 || 0} />}
          hint={`${dashboardData?.ordersLast30 || 0} in 30d`}
          onPress={() => router.push('/dashboard/orders')}
        />
        <StatTile
          label="Active Users"
          value={dashboardData?.activeNow || 0}
          icon={Users}
          hint={`of ${totalUsers.toLocaleString('en-IN')} registered · last 24h`}
          onPress={() => router.push('/dashboard/customers')}
        />
        <StatTile
          label="Pending KYC"
          value={pendingKYC}
          icon={ShieldCheck}
          hint={pendingKYC ? "awaiting review" : "all clear"}
          onPress={() => router.push('/dashboard/kyc/pending')}
        />
      </div>

      {/* ── Revenue + pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2"
          title="Revenue"
          subtitle={`Paid revenue, ${RANGE_CONFIG[chartRange].label}`}
          action={
            <div
              role="group"
              aria-label="Chart range"
              className="flex items-center gap-0.5 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800/70 shrink-0"
            >
              {Object.keys(RANGE_CONFIG).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  aria-pressed={chartRange === r}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    chartRange === r
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : `${INK.muted} hover:text-slate-700 dark:hover:text-slate-300`
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          }
          bodyClassName="px-5 pb-5"
        >
          <div className="flex items-baseline gap-2.5 mb-5">
            <span className={`${TYPE.figure} ${INK.primary}`}>
              <CountUp key={chartRange} value={rangeTotal} prefix="₹" />
            </span>
            {chartRange === '1M' && <Delta current={revenueLast30} previous={revenuePrev30} />}
          </div>
          {/* Height covers plot + axis band so the card never gets a nested scroll. */}
          <div className="h-[248px] w-full">
            {revenueByDay.length > 0 ? (
              <Line data={revenueChartData} options={chartOptions} />
            ) : (
              <div className={`h-full flex flex-col items-center justify-center gap-2 ${INK.faint}`}>
                <ChartLineUp className="w-7 h-7 opacity-40" weight="bold" />
                <p className="text-sm">No paid orders yet</p>
                <p className="text-xs">Revenue appears here once an order is paid.</p>
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title="Order Pipeline"
          subtitle="Orders at each stage, all time"
          bodyClassName="px-5 pb-5"
        >
          <div className="flex items-baseline gap-2 mb-5">
            <span className={`${TYPE.figure} ${INK.primary}`}>
              <CountUp value={pipelineTotal} />
            </span>
            <span className={`${TYPE.body} ${INK.muted}`}>orders</span>
          </div>

          {pipelineTotal > 0 ? (
            <ul className="space-y-3.5">
              {STATUS_ORDER.map((label) => {
                const val = statusCounts[label] || 0;
                const pct = Math.round((val / pipelineTotal) * 100);
                return (
                  <li key={label}>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className={`${TYPE.body} truncate ${val ? INK.secondary : INK.faint}`}>
                        {label}
                      </span>
                      <span className="flex items-baseline gap-2 shrink-0">
                        <span className={`${TYPE.body} font-semibold tabular-nums ${val ? INK.primary : INK.faint}`}>
                          {val}
                        </span>
                        <span className={`text-[11px] tabular-nums w-8 text-right ${INK.faint}`}>{pct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: brand }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(val / pipelineMax) * 100}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={`flex flex-col items-center justify-center py-12 gap-2 ${INK.faint}`}>
              <Package className="w-7 h-7 opacity-40" weight="bold" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </Panel>
      </div>

      {/* ── Recent rentals + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2 overflow-hidden"
          title="Recent Rentals"
          subtitle="Latest activity across all your customers"
          action={
            <Button
              size="sm"
              variant="light"
              endContent={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-medium text-indigo-600 dark:text-indigo-400 shrink-0"
              onPress={() => router.push("/dashboard/orders")}
            >
              View all
            </Button>
          }
        >
          {/* Wide table scrolls inside its own card rather than pushing the page sideways. */}
          <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Recent rentals"
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => { setSortDescriptor(d); setCurrentPage(1); }}
            classNames={{
              // Hairline dividers only — no grey header bands competing with the card.
              th: `bg-transparent ${INK.faint} font-medium uppercase text-[11px] tracking-wider
                   h-9 border-b border-slate-200 dark:border-slate-800 cursor-pointer select-none`,
              td: "py-3.5 border-b border-slate-100 dark:border-slate-800/60",
              tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group",
            }}
          >
            <TableHeader>
              <TableColumn key="user" allowsSorting>Customer</TableColumn>
              <TableColumn key="item">Product</TableColumn>
              <TableColumn key="status" allowsSorting>Status</TableColumn>
              <TableColumn key="date" allowsSorting>Date</TableColumn>
              <TableColumn key="amount" allowsSorting>Amount</TableColumn>
              <TableColumn key="actions" align="center"><span className="sr-only">Actions</span></TableColumn>
            </TableHeader>
            <TableBody
              items={paginatedRentals}
              emptyContent={
                <div className={`py-10 text-sm ${INK.muted}`}>No rentals yet</div>
              }
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={item.user} size="sm" className="shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${INK.primary}`}>{item.user}</span>
                        <span className={`text-xs font-mono ${INK.faint}`}>{item.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${INK.secondary}`}>{item.item}</span>
                  </TableCell>
                  <TableCell>{renderStatusChip(item.status)}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${INK.muted}`}>{item.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold tabular-nums ${INK.primary}`}>{item.amount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            aria-label={`Actions for ${item.id}`}
                            className={INK.faint}
                          >
                            <DotsThreeVertical weight="bold" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Order actions" variant="flat">
                          <DropdownItem key="view" onPress={() => router.push('/dashboard/orders')}>
                            Manage order
                          </DropdownItem>
                          <DropdownItem key="invoice" onPress={() => downloadPDFInvoice(item._raw)}>
                            Download invoice
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-5 py-3.5">
            <span className={`${TYPE.body} ${INK.muted}`}>
              {sortedRentals.length === 0
                ? 'No entries'
                : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, sortedRentals.length)} of ${sortedRentals.length}`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button size="sm" variant="light" isDisabled={currentPage === 1}
                  onPress={() => setCurrentPage((p) => p - 1)} className={INK.secondary}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'flat' : 'light'}
                    onPress={() => setCurrentPage(page)}
                    className={currentPage === page
                      ? 'min-w-8 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : `min-w-8 ${INK.muted}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button size="sm" variant="light" isDisabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((p) => p + 1)} className={INK.secondary}>
                  Next
                </Button>
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title="Activity"
          subtitle={unreadCount ? `${unreadCount} unread` : "All caught up"}
          action={
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
              <Bell className={`w-4 h-4 ${INK.secondary}`} weight="bold" />
            </div>
          }
          className="overflow-hidden"
        >
          <div className="px-2 flex-1 max-h-[320px] overflow-y-auto">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((note, i) => (
                  <li
                    key={i}
                    className="flex gap-3 items-start px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span
                      className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                        note.type === 'order' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : note.type === 'kyc' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-500/10 text-slate-500'
                      }`}
                    >
                      {note.type === 'order' ? <Package className="w-3.5 h-3.5" weight="bold" />
                        : note.type === 'kyc' ? <ShieldCheck className="w-3.5 h-3.5" weight="bold" />
                        : <Bell className="w-3.5 h-3.5" weight="bold" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-1 ${INK.primary}`}>{note.title}</p>
                      <p className={`text-[13px] line-clamp-1 ${INK.muted}`}>{note.message}</p>
                      <p className={`text-[11px] mt-1 ${INK.faint}`}>
                        {(() => {
                          const d = new Date(note.createdAt);
                          const isToday = d.toDateString() === new Date().toDateString();
                          const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return isToday ? time : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`;
                        })()}
                      </p>
                    </div>
                    {!note.isRead && (
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" aria-label="Unread" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`flex flex-col items-center justify-center py-14 gap-2 ${INK.faint}`}>
                <CheckCircle className="w-7 h-7 opacity-40" weight="bold" />
                <p className="text-sm">All systems clear</p>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className={`${TYPE.body} ${INK.secondary}`}>Pending KYC approvals</span>
                <span className={`${TYPE.body} font-semibold tabular-nums ${INK.primary}`}>{pendingKYC}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${totalUsers ? Math.min(100, (pendingKYC / totalUsers) * 100) : 0}%` }}
                />
              </div>
            </div>
            <Button
              size="sm"
              variant="flat"
              className="w-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              onPress={() => router.push("/dashboard/notifications")}
            >
              View all activity
            </Button>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
