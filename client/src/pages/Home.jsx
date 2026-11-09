import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, CalendarClock, KeyRound, PenLine, QrCode, Zap,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { LogoMark } from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: Zap,           title: 'Fast redirects',   body: 'Short codes resolve with a single indexed lookup. Click data is written after the redirect, so visitors never wait on it.' },
  { icon: BarChart3,     title: 'Click analytics',  body: 'Daily clicks, devices, browsers, operating systems and referrers for every link.' },
  { icon: PenLine,       title: 'Custom aliases',   body: 'Pick a readable slug like /launch instead of a random code.' },
  { icon: CalendarClock, title: 'Expiry dates',     body: 'Links stop redirecting at the time you set. Useful for campaigns and one-off shares.' },
  { icon: QrCode,        title: 'QR codes',         body: 'Generate and download a QR code for any link, ready for print.' },
  { icon: KeyRound,      title: 'Private by default', body: 'JWT auth, per-user links, rate limiting and hardened HTTP headers.' },
];

const PREVIEW = [
  { code: 'launch',  dest: 'github.com/acme/release-notes/v2',      clicks: 1284 },
  { code: 'q4-deck', dest: 'docs.google.com/presentation/d/1x9…',   clicks: 412 },
  { code: 'Xk9pQ2r', dest: 'example.com/blog/how-we-cut-latency',   clicks: 97 },
];

// Two weeks of made-up daily clicks for the preview sparkline.
const SPARK = [12, 18, 15, 22, 30, 26, 41, 38, 35, 52, 48, 61, 57, 70];

const Sparkline = () => {
  const w = 280, h = 64, max = Math.max(...SPARK);
  const pts = SPARK.map((v, i) => [(i / (SPARK.length - 1)) * w, h - (v / max) * (h - 6) - 3]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${line} L${w},${h} L0,${h} Z`} className="fill-accent/10" />
      <path d={line} fill="none" className="stroke-accent" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const ProductPreview = () => (
  <div className="card shadow-pop overflow-hidden text-left" aria-hidden="true">
    <div className="flex items-center gap-1.5 px-4 h-10 border-b border-line bg-subtle/50">
      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
      <span className="ml-3 font-mono text-2xs text-faint">tinygate.tech/dashboard</span>
    </div>
    <div className="p-4 border-b border-line">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-2xs text-muted">Clicks · last 14 days</p>
          <p className="text-xl font-semibold tabular-nums mt-0.5">1,793</p>
        </div>
        <span className="text-2xs font-medium text-success tabular-nums">+38%</span>
      </div>
      <div className="mt-2"><Sparkline /></div>
    </div>
    <ul>
      {PREVIEW.map((r) => (
        <li key={r.code} className="flex items-center gap-3 px-4 py-2.5 border-t border-line first:border-t-0">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[13px] font-medium truncate">tinygate.tech/{r.code}</p>
            <p className="text-2xs text-muted truncate">{r.dest}</p>
          </div>
          <span className="text-[13px] tabular-nums">{r.clicks.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
          <div>
            <p className="eyebrow">URL shortener · analytics</p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-fg">
              Short links, with the numbers behind them.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              TinyGate turns long URLs into short, shareable links and shows you who clicked,
              when, and from what device.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary btn-lg">
                  Open dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary btn-lg">
                    Create an account <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="btn-secondary btn-lg">Sign in</Link>
                </>
              )}
            </div>
          </div>
          <ProductPreview />
        </section>

        {/* Features */}
        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
              <p className="text-muted mt-2">
                The essentials for sharing links and understanding how they perform. Nothing more.
              </p>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <div className="w-8 h-8 rounded-md border border-line bg-canvas flex items-center justify-center">
                    <Icon className="w-4 h-4 text-fg" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-fg">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
              <p className="text-muted mt-2">Three steps, about ten seconds.</p>
            </div>
            <ol className="lg:col-span-2 grid sm:grid-cols-3 gap-6">
              {[
                ['Paste', 'Drop in any http or https URL. Optionally set an alias and expiry.'],
                ['Share', 'Copy the short link or download its QR code.'],
                ['Measure', 'Every click is logged with device, browser, OS and referrer.'],
              ].map(([t, b], i) => (
                <li key={t} className="border-t border-line-strong pt-4">
                  <span className="font-mono text-2xs text-faint">0{i + 1}</span>
                  <h3 className="mt-2 text-sm font-medium">{t}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-[13px] text-muted">
          <div className="flex items-center gap-2">
            <LogoMark className="w-4 h-4" />
            <span>© {new Date().getFullYear()} TinyGate</span>
          </div>
          <a href="https://github.com/AkshatRaj2004" target="_blank" rel="noreferrer" className="hover:text-fg transition-colors">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
