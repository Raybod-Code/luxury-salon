"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const NAV_LINKS = [
  { label: "Services",  href: "/services" },
  { label: "Stylists",  href: "/stylists" },
  { label: "Gallery",   href: "/gallery"  },
  { label: "Journal",   href: "/journal"  },
  { label: "About",     href: "/about"    },
];

export function Navbar() {
  const navRef     = useRef<HTMLElement>(null);
  const logoRef    = useRef<HTMLAnchorElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);

    // Scroll detection
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Intro animation
    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (menuOpen) {
      gsap.fromTo(menu,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
      const items = menu.querySelectorAll(".mobile-nav-item");
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "var(--nav-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--space-8)",
          transition: "background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease",
          background: scrolled ? "rgba(246, 241, 232, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border-light)" : "1px solid transparent",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          ref={logoRef}
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
            fontWeight: 400,
            letterSpacing: "0.25em",
            color: "var(--color-text)",
            textDecoration: "none",
            flexShrink: 0,
          }}
          data-cursor="HOME"
        >
          PANTHEON
        </Link>

        {/* Gold line separator */}
        <div style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, var(--color-gold) 0%, transparent 100%)",
          opacity: 0.3,
          margin: "0 var(--space-8)",
          maxWidth: 120,
        }} />

        {/* Desktop links */}
        <ul
          role="list"
          style={{
            display: "flex",
            gap: "var(--space-8)",
            alignItems: "center",
            listStyle: "none",
            flex: 1,
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--color-text-muted)"; }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginLeft: "auto" }}>
          <Link
            href="/booking"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-text-inverse)",
              backgroundColor: "var(--color-primary)",
              padding: "var(--space-3) var(--space-6)",
              textDecoration: "none",
              transition: "background 0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = "var(--color-primary-deep)"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = "var(--color-primary)"; }}
            data-cursor="BOOK"
          >
            Reserve
          </Link>

          {/* Mobile menu toggle */}
          <MagneticButton
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ padding: "var(--space-2)", color: "var(--color-text)" } as React.CSSProperties}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </MagneticButton>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && mounted && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--color-bg)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "var(--space-12) var(--space-8)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <ul role="list" style={{ listStyle: "none" }}>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="mobile-nav-item" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 300,
                    color: "var(--color-text)",
                    textDecoration: "none",
                    padding: "var(--space-6) 0",
                    transition: "color 0.2s, padding-left 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.color = "var(--color-primary)";
                    (e.currentTarget).style.paddingLeft = "var(--space-4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.color = "var(--color-text)";
                    (e.currentTarget).style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="btn-luxury"
            style={{ marginTop: "var(--space-12)", alignSelf: "flex-start" }}
          >
            <span>Reserve a Session</span>
          </Link>
        </div>
      )}

      {/* CSS برای hide/show desktop vs mobile */}
      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile   { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </>
  );
}