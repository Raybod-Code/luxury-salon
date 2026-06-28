'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const BRAND_PILLARS = [
  {
    number: '۰۱',
    title: 'Prestige through Restraint',
    titleFa: 'اشرافیت در سکوت',
    body: 'لوکس بودن را با فضا، دقت و انتخاب‌گری نشان می‌دهیم — نه با شلوغی.',
  },
  {
    number: '۰۲',
    title: 'Control with Intimacy',
    titleFa: 'کنترل با صمیمیت',
    body: 'هر مشتری در کمترین زمان می‌داند چه خدمتی برایش مناسب است و چه کسی آن را انجام می‌دهد.',
  },
  {
    number: '۰۳',
    title: 'Beauty, Composed',
    titleFa: 'زیبایی با امضا',
    body: 'هر جزئیات — از انتخاب متخصص تا لحظه خداحافظی — با دقتی امضادار طراحی شده است.',
  },
];

export default function MaisonPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftEls: { el: HTMLElement; delay: number }[] = [
      { el: eyebrowRef.current!, delay: 0 },
      { el: headlineRef.current!, delay: 120 },
      { el: bodyRef.current!, delay: 260 },
      { el: pillarsRef.current!, delay: 400 },
      { el: ctaRef.current!, delay: 540 },
    ];
    const rightEl = rightColRef.current;

    const allEls = [
      ...leftEls.map(({ el }) => el),
      rightEl,
    ].filter(Boolean) as HTMLElement[];

    // Set initial hidden state
    leftEls.forEach(({ el }) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'none';
    });
    if (rightEl) {
      rightEl.style.opacity = '0';
      rightEl.style.transform = 'translateX(32px)';
      rightEl.style.transition = 'none';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          // Animate left column items with stagger
          leftEls.forEach(({ el, delay }) => {
            if (!el) return;
            el.style.transition = `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            });
          });

          // Animate right column with slight x offset
          if (rightEl) {
            rightEl.style.transition = 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 180ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) 180ms';
            requestAnimationFrame(() => {
              rightEl.style.opacity = '1';
              rightEl.style.transform = 'translateX(0)';
            });
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="فلسفه مزون پانتئون"
      className="relative overflow-hidden"
      style={{ background: 'var(--color-surface)' }}
    >
      {/* Subtle top border line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-border), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Background gold glow — right side */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 85% 50%, rgba(197,165,90,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-0 px-6 py-24 md:grid-cols-2 md:gap-20 md:px-12 md:py-32 lg:py-40">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center">

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="mb-8 flex items-center gap-3">
            <div
              className="h-px w-10 shrink-0"
              style={{ background: 'var(--color-gold)' }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-medium uppercase tracking-[0.25em]"
              style={{ color: 'var(--color-gold)' }}
            >
              Maison Philosophy · فلسفه برند
            </span>
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-display"
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 4rem)',
              lineHeight: '1.08',
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
            }}
          >
            یک سالن نیست.{' '}
            <br />
            <em
              className="not-italic"
              style={{ color: 'var(--color-primary)' }}
            >
              یک تجربه curated است.
            </em>
          </h2>

          {/* Body */}
          <p
            ref={bodyRef}
            className="mt-7 leading-relaxed"
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-muted)',
              maxWidth: '46ch',
            }}
          >
            پانتئون با این ایده پایه‌گذاری شد که زیبایی واقعی از دقت متولد
            می‌شود — نه از سرعت. هر رزرو، هر مشاوره، هر لحظه در مزون ما با
            قصد و آگاهی طراحی شده است.
          </p>

          {/* Brand Pillars */}
          <div
            ref={pillarsRef}
            className="mt-12 flex flex-col"
            role="list"
            aria-label="اصول برند پانتئون"
          >
            {BRAND_PILLARS.map((pillar, i) => (
              <div
                key={pillar.number}
                role="listitem"
                className={`flex gap-6 py-7 ${
                  i < BRAND_PILLARS.length - 1
                    ? 'border-b'
                    : ''
                }`}
                style={
                  i < BRAND_PILLARS.length - 1
                    ? { borderColor: 'var(--color-border)' }
                    : {}
                }
              >
                {/* Number */}
                <span
                  className="shrink-0 font-display font-semibold leading-none select-none"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'var(--color-gold)',
                    opacity: 0.55,
                    letterSpacing: '0.04em',
                  }}
                  aria-hidden="true"
                >
                  {pillar.number}
                </span>

                {/* Text */}
                <div className="flex flex-col gap-1">
                  <h3
                    className="font-display font-semibold leading-tight"
                    style={{
                      fontSize: 'var(--text-lg)',
                      color: 'var(--color-text)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {pillar.titleFa}
                  </h3>
                  <p
                    className="mt-1 leading-relaxed"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-10">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide transition-colors duration-300"
              style={{ color: 'var(--color-primary)' }}
            >
              بیشتر درباره پانتئون بدانید
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-[-4px]"
              >
                <path
                  d="M13 8H3M7 4l-4 4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Cinematic Visual ── */}
        <div
          ref={rightColRef}
          className="relative mt-14 md:mt-0"
          aria-hidden="true"
        >
          {/* Main image frame */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 'var(--radius-xl)',
              aspectRatio: '3 / 4',
              background: 'linear-gradient(160deg, #1e1512 0%, #2a1a18 45%, #120d0b 100%)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Cinematic overlay gradient */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  'linear-gradient(to top, rgba(42,36,32,0.72) 0%, rgba(42,36,32,0.1) 55%, transparent 100%)',
              }}
            />

            {/* Cartier Red side accent */}
            <div
              className="absolute inset-y-0 left-0 z-10 w-1"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, var(--color-primary), transparent)',
                opacity: 0.7,
              }}
            />

            {/* Film grain overlay */}
            <div
              className="absolute inset-0 z-20 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Gold decorative lines — top right */}
            <svg
              className="absolute right-6 top-6 z-20"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="48" y2="0" stroke="rgba(197,165,90,0.5)" strokeWidth="0.75" />
              <line x1="48" y1="0" x2="48" y2="48" stroke="rgba(197,165,90,0.5)" strokeWidth="0.75" />
            </svg>

            {/* Brand statement — bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 z-30 p-8">
              <div className="mb-3 h-px w-8" style={{ background: 'var(--color-gold)' }} />
              <p
                className="font-display italic leading-snug text-white"
                style={{
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                «Beauty, composed with precision.»
              </p>
              <p
                className="mt-2 text-xs uppercase tracking-[0.2em]"
                style={{ color: 'rgba(245,239,224,0.5)' }}
              >
                Pantheon Maison · Since 2012
              </p>
            </div>
          </div>

          {/* Floating accent card — bottom left breakout */}
          <div
            className="absolute -bottom-6 -left-6 z-40 hidden md:block"
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              minWidth: '180px',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Star icon */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'rgba(197,165,90,0.12)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 2 .7-4.1L2 5.3l4.2-.7L8 1z"
                    fill="var(--color-gold)"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="font-display font-semibold leading-none"
                  style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}
                >
                  ۴.۹
                </p>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  از ۲۴۰۰+ نظر
                </p>
              </div>
            </div>
          </div>

          {/* Gold ring decorator — top left */}
          <div
            className="pointer-events-none absolute -left-4 -top-4 hidden h-24 w-24 rounded-full border md:block"
            style={{ borderColor: 'rgba(197,165,90,0.2)', borderWidth: '1px' }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Subtle bottom border */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-border), transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
