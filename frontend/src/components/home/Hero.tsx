'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SOCIAL_PROOF_ITEMS = [
  { value: '۲۴۰۰+', label: 'مشتری راضی' },
  { value: '۱۲', label: 'سال تجربه' },
  { value: '۹۸٪', label: 'رضایت مشتری' },
  { value: '۴', label: 'شعبه فعال' },
];

const NAV_LINKS = [
  { label: 'خدمات', href: '/services' },
  { label: 'متخصصان', href: '/stylists' },
  { label: 'گالری', href: '/gallery' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس', href: '/contact' },
];

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);

  // Navbar glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Staggered entrance animation — no GSAP dependency
  useEffect(() => {
    const els = [
      overlayRef.current,
      titleRef.current,
      subtitleRef.current,
      ctaRef.current,
      socialProofRef.current,
    ];
    const delays = [0, 200, 420, 600, 820];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delays[i]}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delays[i]}ms`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
        }, 60);
      });
    });
  }, []);

  // Parallax background on scroll
  useEffect(() => {
    const bg = heroRef.current?.querySelector<HTMLDivElement>('.hero-bg');
    if (!bg) return;
    const onScroll = () => { bg.style.transform = `translateY(${window.scrollY * 0.35}px)`; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── NAVBAR ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[var(--color-bg)]/90 backdrop-blur-md shadow-[var(--shadow-sm)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-12">
          {/* Logo SVG */}
          <Link href="/" aria-label="پانتئون — صفحه اصلی" className="flex items-center gap-3 group">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"
              className="transition-transform duration-500 group-hover:rotate-12">
              <rect x="4" y="28" width="28" height="3" rx="1.5" fill="var(--color-primary)" />
              <rect x="4" y="6" width="28" height="3" rx="1.5" fill="var(--color-primary)" />
              {[7.5, 13.5, 19.5, 25.5].map((x) => (
                <rect key={x} x={x} y="9" width="3" height="19" rx="1.5" fill="var(--color-gold)" />
              ))}
            </svg>
            <span className="font-display text-[1.1rem] font-semibold tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-text)' }}>
              پانتئون
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-sm font-medium tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/account"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200">
              ورود
            </Link>
            <Link href="/booking" className="btn-primary">رزرو نوبت</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] p-2"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`block h-[1.5px] w-6 bg-[var(--color-text)] transition-all duration-300 ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-[var(--color-text)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-[var(--color-text)] transition-all duration-300 ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-border)]`}>
          <ul className="flex flex-col px-6 py-6 gap-5" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuOpen(false)}
                  className="block text-base font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-[var(--color-border)]">
              <Link href="/booking" onClick={() => setMenuOpen(false)}
                className="btn-primary w-full text-center block">
                رزرو نوبت
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef}
        className="relative min-h-[100dvh] overflow-hidden flex flex-col justify-end"
        aria-label="Hero — پانتئون لوکس سالن">
        
        {/* Parallax background */}
        <div className="hero-bg absolute inset-0 will-change-transform" style={{ top: '-10%', height: '120%' }}>
          {/* Cinematic dark overlay */}
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to top, rgba(42,36,32,0.92) 0%, rgba(42,36,32,0.55) 50%, rgba(42,36,32,0.15) 100%)',
          }} />
          {/* Cartier Red radial glow */}
          <div className="absolute inset-0 z-10 opacity-20" style={{
            background: 'radial-gradient(ellipse 60% 50% at 75% 35%, rgba(196,30,58,0.6) 0%, transparent 70%)',
          }} />
          {/* Base dark background — replace with next/image in production */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(135deg, #1a1510 0%, #2a1a18 40%, #1e1512 70%, #120d0b 100%)',
          }} />
          {/* Film grain texture */}
          <div className="absolute inset-0 z-20 opacity-[0.035] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-30 mx-auto w-full max-w-[1280px] px-6 pb-20 pt-40 md:px-12 md:pb-28">
          
          {/* Eyebrow */}
          <div ref={overlayRef} className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 bg-[var(--color-gold)]" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-gold)]">
              Luxury Beauty Maison · تهران
            </span>
          </div>

          {/* Headline */}
          <h1 ref={titleRef} className="font-display text-white"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 6.5rem)', lineHeight: '1.06', letterSpacing: '-0.02em' }}>
            زیبایی،{' '}
            <br />
            <em className="not-italic" style={{ color: 'var(--color-gold)' }}>
              با دقتی امضادار.
            </em>
          </h1>

          {/* Subheading */}
          <p ref={subtitleRef} className="mt-6 max-w-lg text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(245,239,224,0.72)' }}>
            رزرو یک تجربه شخصی، نه فقط یک نوبت. در پانتئون هر جزئیات با دقت
            انتخاب می‌شود تا شما در بهترین حال خود باشید.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/booking"
              className="inline-flex h-[52px] items-center gap-3 rounded-full bg-[var(--color-primary)] px-8 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[var(--color-primary-deep)] hover:shadow-lg hover:shadow-[rgba(196,30,58,0.35)] active:scale-[0.97]">
              رزرو نوبت
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/services"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-8 text-sm font-medium tracking-wide text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white active:scale-[0.97]">
              مشاهده خدمات
            </Link>
          </div>

          {/* Gold divider */}
          <div className="mt-16 h-px w-full max-w-[480px] md:mt-20"
            style={{ background: 'linear-gradient(to right, rgba(197,165,90,0.6), transparent)' }}
            aria-hidden="true" />

          {/* Social proof */}
          <div ref={socialProofRef}
            className="mt-8 grid grid-cols-2 gap-y-6 gap-x-10 md:flex md:items-center md:gap-16"
            role="list" aria-label="آمار پانتئون">
            {SOCIAL_PROOF_ITEMS.map((item) => (
              <div key={item.label} role="listitem" className="flex flex-col gap-1">
                <span className="font-display font-semibold text-white"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', lineHeight: '1' }}>
                  {item.value}
                </span>
                <span className="text-xs tracking-wide" style={{ color: 'rgba(245,239,224,0.55)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator — mobile */}
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden" aria-hidden="true">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">اسکرول</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent animate-[fadeDown_1.8s_ease-in-out_infinite]" />
        </div>
      </section>
    </>
  );
}