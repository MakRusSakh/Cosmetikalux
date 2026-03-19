#!/usr/bin/env python3
"""Build script for CosmetikaLux landing page prototype."""

html = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CosmetikaLux — Корейская косметика премиум-класса</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
<style>
/* ===== RESET & TOKENS ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--bg-primary:#FDFBF9;--bg-secondary:#F7F3EF;--bg-tertiary:#FFF8F5;--bg-surface:#FFFFFF;
--accent-primary:#C8A2C8;--accent-rose:#E8C4C4;--accent-gold:#C9A96E;--accent-light:#F0E4F0;
--text-primary:#1A1A1A;--text-secondary:#4A4A4A;--text-tertiary:#8A8A8A;
--border-light:#F0EBE6;--border-medium:#E0D8D0;
--gradient-hero:linear-gradient(135deg,#FFF8F5 0%,#F0E4F0 50%,#FAF5EB 100%);
--gradient-promo:linear-gradient(135deg,#FDF2F2 0%,#F0E4F0 100%);
--gradient-cta:linear-gradient(135deg,#C8A2C8 0%,#E8C4C4 100%);
--gradient-premium:linear-gradient(180deg,#FDFBF9 0%,#FAF5EB 100%);
--shadow-sm:0 1px 3px rgba(26,26,26,0.04);
--shadow-md:0 4px 12px rgba(26,26,26,0.06);
--shadow-lg:0 12px 32px rgba(26,26,26,0.08);
--shadow-glow:0 0 24px rgba(200,162,200,0.20);
--radius-sm:6px;--radius-md:12px;--radius-lg:20px;--radius-xl:32px;--radius-full:9999px;
--font:'Playfair Display',Georgia,'Times New Roman',serif;
}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--font);font-size:16px;line-height:1.625;color:var(--text-primary);background:var(--bg-primary);overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:var(--font);cursor:pointer;border:none;background:none}
ul{list-style:none}
.container{max-width:1280px;margin:0 auto;padding:0 16px}

/* ===== TYPOGRAPHY ===== */
.h1-hero{font-size:36px;line-height:42px;font-weight:700}
.h2-section{font-size:28px;line-height:34px;font-weight:700}
.btn-text{font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em}
.badge-text{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}

/* ===== BUTTONS ===== */
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;background:var(--gradient-cta);color:#fff;border-radius:var(--radius-full);font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;transition:all .3s ease;min-height:48px;border:none;cursor:pointer}
.btn-primary:hover{transform:translateY(-2px);box-shadow:var(--shadow-glow)}
.btn-secondary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;background:transparent;color:var(--text-primary);border:1.5px solid var(--border-medium);border-radius:var(--radius-full);font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;transition:all .3s ease;min-height:48px;cursor:pointer}
.btn-secondary:hover{border-color:var(--accent-primary);color:var(--accent-primary);transform:translateY(-2px)}
.btn-cart{display:flex;align-items:center;justify-content:center;width:100%;padding:12px 16px;background:var(--gradient-cta);color:#fff;border-radius:var(--radius-full);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;transition:all .3s ease;min-height:44px;border:none;cursor:pointer}
.btn-cart:hover{transform:translateY(-1px);box-shadow:var(--shadow-glow)}

/* ===== GOLD LINE ===== */
.gold-line{display:block;width:48px;height:2px;background:var(--accent-gold);margin-top:12px}

/* ===== SCROLL REVEAL ===== */
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

/* ===== 0. ANNOUNCEMENT BAR ===== */
.announcement{background:var(--accent-primary);color:#fff;height:32px;display:flex;align-items:center;overflow:hidden;position:relative;z-index:1001}
.announcement.hidden{display:none}
.marquee-wrap{flex:1;overflow:hidden;position:relative}
.marquee-track{display:flex;gap:48px;animation:marquee 25s linear infinite;white-space:nowrap}
.marquee-track span{font-size:12px;font-weight:500;letter-spacing:0.02em;flex-shrink:0}
.announcement .close-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;flex-shrink:0;cursor:pointer;background:none;border:none;min-width:44px;min-height:44px}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ===== 1. HEADER ===== */
.header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);height:56px;display:flex;align-items:center;border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
.header.scrolled{border-bottom-color:var(--border-light);box-shadow:var(--shadow-sm)}
.header .container{display:flex;align-items:center;justify-content:space-between;width:100%}
.logo{font-size:24px;font-weight:700;letter-spacing:-0.01em}
.logo .lux{color:var(--accent-primary)}
.nav-desktop{display:none;gap:32px}
.nav-desktop a{font-size:14px;font-weight:500;letter-spacing:0.02em;color:var(--text-secondary);transition:color .2s}
.nav-desktop a:hover,.nav-desktop a.accent{color:var(--accent-primary)}
.header-icons{display:flex;align-items:center;gap:4px}
.icon-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-full);transition:background .2s;position:relative;color:var(--text-primary)}
.icon-btn:hover{background:var(--accent-light)}
.icon-btn svg{width:22px;height:22px;stroke:currentColor;stroke-width:1.5;fill:none}
.cart-badge{position:absolute;top:6px;right:6px;width:16px;height:16px;background:var(--accent-primary);color:#fff;font-size:10px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center}
.burger{display:flex}
.search-hide{display:none}
.wishlist-hide{display:none}

/* Mobile Menu */
.mobile-menu{position:fixed;top:0;left:-100%;width:100%;height:100dvh;background:var(--bg-surface);z-index:2000;transition:left .35s ease;display:flex;flex-direction:column;padding:24px}
.mobile-menu.open{left:0}
.mobile-menu-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px}
.mobile-menu nav a{display:block;font-size:24px;font-weight:600;padding:16px 0;border-bottom:1px solid var(--border-light);color:var(--text-primary)}
.mobile-menu nav a.accent{color:var(--accent-primary)}

/* ===== 2. HERO ===== */
.hero{background:var(--gradient-hero);position:relative;overflow:hidden;padding:48px 0 40px}
.hero::before{content:'';position:absolute;top:-20%;right:-10%;width:60%;height:60%;border-radius:50%;background:radial-gradient(circle,rgba(200,162,200,0.12) 0%,transparent 70%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-15%;left:-5%;width:50%;height:50%;border-radius:50%;background:radial-gradient(circle,rgba(232,196,196,0.10) 0%,transparent 70%);pointer-events:none}
.hero .container{position:relative;z-index:1}
.hero-grid{display:flex;flex-direction:column-reverse;gap:32px}
.hero-text{text-align:center}
.hero-text .h1-hero{margin-bottom:16px}
.hero-subtitle{font-size:16px;font-style:italic;color:var(--text-secondary);margin-bottom:32px;max-width:440px;margin-left:auto;margin-right:auto}
.hero-ctas{display:flex;flex-direction:column;gap:12px;align-items:center}
.hero-image{display:flex;justify-content:center}
.hero-img-placeholder{width:100%;max-width:340px;aspect-ratio:3/4;border-radius:var(--radius-xl);background:linear-gradient(135deg,var(--accent-light) 0%,var(--accent-rose) 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;position:relative;overflow:hidden}
.hero-img-placeholder .hero-emoji{font-size:80px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.08))}
.hero-img-placeholder .hero-deco{font-size:32px;opacity:.5}

/* Floating petals */
.petal{position:absolute;font-size:20px;opacity:.3;animation:float-petal 8s ease-in-out infinite}
.petal:nth-child(1){top:10%;left:5%;animation-delay:0s}
.petal:nth-child(2){top:30%;right:8%;animation-delay:2s;font-size:16px}
.petal:nth-child(3){bottom:20%;left:12%;animation-delay:4s;font-size:24px}
@keyframes float-petal{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(15deg)}}

/* Hero entrance */
.hero-text{animation:fadeInUp .8s ease both;animation-delay:.2s}
.hero-image{animation:fadeIn 1s ease both;animation-delay:.4s}
@keyframes fadeInUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

/* ===== 3. TRUST BAR ===== */
.trust{background:var(--bg-secondary);padding:24px 0}
.trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.trust-item{display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 8px;gap:8px}
.trust-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.trust-icon svg{width:28px;height:28px;stroke:var(--accent-primary);stroke-width:1.5;fill:none}
.trust-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-primary)}
.trust-desc{font-size:12px;color:var(--text-tertiary);line-height:1.4}

/* ===== 4. SKIN CONCERNS ===== */
.concerns{padding:56px 0}
.section-header{margin-bottom:32px}
.section-header-row{display:flex;align-items:baseline;justify-content:space-between}
.section-link{font-size:14px;font-weight:500;color:var(--accent-primary);white-space:nowrap;transition:opacity .2s}
.section-link:hover{opacity:.7}
.concerns-scroll{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:16px;scrollbar-width:none}
.concerns-scroll::-webkit-scrollbar{display:none}
.concern-card{flex:0 0 180px;aspect-ratio:3/4;border-radius:var(--radius-md);overflow:hidden;position:relative;scroll-snap-align:start;cursor:pointer;transition:transform .3s}
.concern-card:hover{transform:scale(1.03)}
.concern-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.concern-bg .emoji{font-size:56px}
.concern-overlay{position:absolute;bottom:0;left:0;right:0;padding:16px 12px;background:linear-gradient(transparent,rgba(0,0,0,0.45));color:#fff}
.concern-name{font-size:15px;font-weight:600}
.concern-count{font-size:12px;opacity:.85}
.concern-pills{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap}
.concern-pill{padding:8px 20px;border-radius:var(--radius-full);border:1px solid var(--border-medium);font-size:13px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .2s;white-space:nowrap}
.concern-pill:hover{border-color:var(--accent-primary);color:var(--accent-primary)}
.scroll-dots{display:flex;justify-content:center;gap:6px;margin-top:8px}
.scroll-dot{width:6px;height:6px;border-radius:50%;background:var(--border-medium)}
.scroll-dot.active{background:var(--accent-primary);width:18px;border-radius:3px}

/* ===== 5. BESTSELLERS & 7. NEW ARRIVALS ===== */
.products-section{padding:56px 0}
.products-section.alt-bg{background:var(--bg-secondary)}
.products-scroll{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:8px;scrollbar-width:none}
.products-scroll::-webkit-scrollbar{display:none}
.product-card{flex:0 0 calc(50% - 8px);scroll-snap-align:start;background:var(--bg-surface);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);overflow:hidden;transition:transform .3s,box-shadow .3s;display:flex;flex-direction:column;will-change:transform}
.product-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.product-img{aspect-ratio:1;position:relative;overflow:hidden}
.product-img-bg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px}
.product-badge{position:absolute;top:8px;left:8px;padding:4px 10px;border-radius:var(--radius-sm);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em}
.badge-gold{background:linear-gradient(135deg,#C9A96E,#DFC088);color:#fff}
.badge-red{background:#D94F4F;color:#fff}
.badge-lavender{background:var(--accent-primary);color:#fff}
.product-wishlist{position:absolute;top:8px;right:8px;width:36px;height:36px;background:rgba(255,255,255,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;border:none}
.product-wishlist:hover{background:#fff}
.product-wishlist svg{width:18px;height:18px;stroke:var(--text-tertiary);stroke-width:1.5;fill:none}
.product-info{padding:12px;display:flex;flex-direction:column;gap:4px;flex:1}
.product-brand{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary)}
.product-name{font-size:14px;font-weight:500;color:var(--text-primary);line-height:1.35}
.product-stars{display:flex;align-items:center;gap:4px;font-size:13px;color:var(--accent-gold)}
.product-stars .count{color:var(--text-tertiary);font-size:12px}
.product-price-row{display:flex;align-items:baseline;gap:8px;margin-top:auto;padding-top:4px}
.product-price{font-size:17px;font-weight:700;color:var(--text-primary)}
.product-old-price{font-size:13px;color:var(--text-tertiary);text-decoration:line-through}
.product-card .btn-cart{margin-top:8px}

/* СКОРО overlay */
.soon-overlay{position:absolute;inset:0;background:rgba(253,251,249,0.75);backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:2}
.soon-overlay span{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary)}

/* ===== 6. PROMO BANNER ===== */
.promo{padding:40px 0}
.promo-inner{background:var(--gradient-promo);border-radius:var(--radius-lg);padding:32px 24px;overflow:hidden;position:relative}
.promo-content{position:relative;z-index:1}
.promo-title{font-size:24px;font-weight:700;line-height:1.25;margin-bottom:20px}
.countdown{display:flex;gap:10px;margin-bottom:20px}
.countdown-box{background:var(--bg-surface);border-radius:var(--radius-sm);padding:10px 12px;text-align:center;min-width:56px;box-shadow:var(--shadow-sm)}
.countdown-num{font-size:22px;font-weight:700;color:var(--accent-primary);display:block}
.countdown-label{font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.04em}
.promo-code{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1.5px dashed var(--accent-primary);border-radius:var(--radius-sm);font-size:14px;font-weight:600;color:var(--accent-primary);margin-top:16px;background:rgba(255,255,255,0.5)}
.promo-image{display:none}

/* ===== 8. INGREDIENT SPOTLIGHT ===== */
.ingredient{padding:56px 0;background:var(--gradient-premium)}
.ingredient-main{display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px;margin-bottom:40px}
.ingredient-circle{width:160px;height:160px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:64px;flex-shrink:0;box-shadow:var(--shadow-glow)}
.ingredient-name{font-size:20px;font-weight:700;margin-bottom:8px}
.ingredient-desc{font-size:15px;color:var(--text-secondary);line-height:1.6;max-width:480px}
.ingredient-link{font-size:14px;font-weight:500;color:var(--accent-primary);margin-top:4px;display:inline-block;transition:opacity .2s}
.ingredient-link:hover{opacity:.7}
.ingredient-minis{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.ingredient-mini{display:flex;align-items:center;gap:12px;padding:16px;background:var(--bg-surface);border-radius:var(--radius-md);box-shadow:var(--shadow-sm);cursor:pointer;transition:transform .2s,box-shadow .2s}
.ingredient-mini:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
.ingredient-mini .emoji{font-size:28px;flex-shrink:0}
.ingredient-mini .info{text-align:left}
.ingredient-mini .name{font-size:14px;font-weight:600}
.ingredient-mini .cnt{font-size:12px;color:var(--text-tertiary)}

/* ===== 9. REVIEWS ===== */
.reviews{padding:56px 0;background:var(--bg-secondary)}
.reviews-scroll{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:8px;scrollbar-width:none}
.reviews-scroll::-webkit-scrollbar{display:none}
.review-card{flex:0 0 85%;scroll-snap-align:start;background:var(--bg-surface);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:12px}
.review-stars{color:var(--accent-gold);font-size:16px;letter-spacing:2px}
.review-text{font-size:15px;font-style:italic;line-height:1.6;color:var(--text-primary);flex:1}
.review-author{font-size:13px;font-weight:600;color:var(--text-secondary)}
.review-loc{font-size:12px;color:var(--text-tertiary)}
.review-product{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--accent-primary);margin-top:4px}
.reviews-summary{display:flex;justify-content:center;margin-top:28px}
.reviews-summary-pill{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:var(--bg-surface);border-radius:var(--radius-full);box-shadow:var(--shadow-sm);font-size:14px;font-weight:500;color:var(--text-secondary)}
.reviews-summary-pill .star{color:var(--accent-gold)}

/* ===== 10. BRANDS ===== */
.brands{padding:56px 0}
.brands-marquee{overflow:hidden;position:relative;margin:32px 0 24px}
.brands-marquee::before,.brands-marquee::after{content:'';position:absolute;top:0;bottom:0;width:60px;z-index:1;pointer-events:none}
.brands-marquee::before{left:0;background:linear-gradient(to right,var(--bg-primary),transparent)}
.brands-marquee::after{right:0;background:linear-gradient(to left,var(--bg-primary),transparent)}
.brands-track{display:flex;gap:40px;animation:brands-scroll 30s linear infinite;white-space:nowrap}
.brands-track span{font-size:15px;font-weight:500;color:var(--text-tertiary);letter-spacing:0.02em;flex-shrink:0}
@keyframes brands-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.brands-link{text-align:center}

/* ===== 11. SUBSCRIBE ===== */
.subscribe{padding:56px 0;background:var(--bg-tertiary);position:relative;overflow:hidden}
.subscribe::before{content:'';position:absolute;top:-30%;right:-15%;width:50%;height:80%;border-radius:50%;background:radial-gradient(circle,rgba(200,162,200,0.08) 0%,transparent 70%);pointer-events:none}
.subscribe .container{position:relative;z-index:1;text-align:center}
.subscribe-subtitle{font-size:15px;color:var(--text-secondary);margin-top:12px;margin-bottom:28px;max-width:420px;margin-left:auto;margin-right:auto}
.subscribe-form{display:flex;flex-direction:column;gap:12px;max-width:480px;margin:0 auto 16px}
.subscribe-input{padding:14px 20px;border:1.5px solid var(--border-medium);border-radius:var(--radius-full);font-size:15px;font-family:var(--font);outline:none;transition:border-color .2s;width:100%;min-height:48px}
.subscribe-input:focus{border-color:var(--accent-primary)}
.subscribe-bonus{font-size:14px;color:var(--text-secondary);margin-bottom:8px}
.subscribe-legal{font-size:12px;color:var(--text-tertiary);max-width:400px;margin:0 auto}

/* ===== 12. FOOTER ===== */
.footer{background:var(--text-primary);color:rgba(255,255,255,0.7);padding:48px 0 24px}
.footer-grid{display:flex;flex-direction:column;gap:32px}
.footer-brand .logo{color:#fff;font-size:22px;margin-bottom:8px;display:block}
.footer-brand .logo .lux{color:var(--accent-primary)}
.footer-brand p{font-size:13px;line-height:1.5;margin-bottom:16px}
.footer-socials{display:flex;gap:12px}
.footer-socials a{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:rgba(255,255,255,0.6);transition:all .2s}
.footer-socials a:hover{border-color:var(--accent-primary);color:var(--accent-primary)}
.footer-col h4{font-size:14px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
.footer-col h4 .arrow{transition:transform .3s;font-size:12px}
.footer-col.open h4 .arrow{transform:rotate(180deg)}
.footer-col ul{display:none;flex-direction:column;gap:10px}
.footer-col.open ul{display:flex}
.footer-col ul a{font-size:13px;transition:color .2s}
.footer-col ul a:hover{color:var(--accent-primary)}
.footer-divider{height:1px;background:rgba(255,255,255,0.1);margin:32px 0 20px}
.footer-badges{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:16px}
.footer-badge{padding:6px 14px;border:1px solid rgba(255,255,255,0.15);border-radius:var(--radius-sm);font-size:12px;font-weight:500;color:rgba(255,255,255,0.5)}
.footer-bottom{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4)}
.footer-bottom-links{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.footer-bottom-links a{font-size:12px;color:rgba(255,255,255,0.4);transition:color .2s}
.footer-bottom-links a:hover{color:rgba(255,255,255,0.7)}

/* ===== 13. BACK TO TOP ===== */
.back-to-top{position:fixed;bottom:24px;right:24px;width:48px;height:48px;border-radius:50%;background:var(--gradient-cta);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md);cursor:pointer;border:none;z-index:999;opacity:0;visibility:hidden;transform:translateY(12px);transition:all .3s ease}
.back-to-top.visible{opacity:1;visibility:visible;transform:translateY(0)}
.back-to-top:hover{box-shadow:var(--shadow-glow);transform:translateY(-2px)}
.back-to-top svg{width:22px;height:22px;stroke:#fff;stroke-width:2;fill:none}

/* ==============================
   TABLET (640px+)
   ============================== */
@media(min-width:640px){
.container{padding:0 24px}
.announcement{height:36px}
.announcement .marquee-track span{font-size:13px}
.hero{padding:64px 0 56px}
.hero-ctas{flex-direction:row;justify-content:center}
.product-card{flex:0 0 calc(33.333% - 12px)}
.review-card{flex:0 0 48%}
.subscribe-form{flex-direction:row}
.subscribe-input{flex:1}
.promo-inner{padding:40px 32px}
.promo-title{font-size:28px}
.footer-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
.footer-col ul{display:flex}
.footer-col h4 .arrow{display:none}
.footer-col h4{cursor:default}
}

/* ==============================
   DESKTOP (1024px+)
   ============================== */
@media(min-width:1024px){
.container{padding:0 80px}
.h1-hero{font-size:64px;line-height:72px}
.h2-section{font-size:48px;line-height:56px}
.header{height:72px}
.burger{display:none}
.search-hide{display:flex}
.wishlist-hide{display:flex}
.nav-desktop{display:flex}
.hero{min-height:85vh;display:flex;align-items:center;padding:0}
.hero-grid{flex-direction:row;align-items:center;gap:64px}
.hero-text{flex:1;text-align:left}
.hero-subtitle{margin-left:0}
.hero-ctas{justify-content:flex-start}
.hero-image{flex:0 0 42%}
.hero-img-placeholder{max-width:100%}
.trust-grid{grid-template-columns:repeat(4,1fr);gap:0}
.trust-item{border-right:1px solid var(--border-light)}
.trust-item:last-child{border-right:none}
.concerns-scroll{display:grid;grid-template-columns:repeat(5,1fr);overflow:visible}
.concern-card{flex:auto}
.scroll-dots{display:none}
.products-scroll{display:grid;grid-template-columns:repeat(4,1fr);overflow:visible}
.product-card{flex:auto}
.promo-inner{display:flex;align-items:center;gap:48px;padding:48px 56px}
.promo-content{flex:1}
.promo-image{display:flex;align-items:center;justify-content:center;flex:0 0 280px;aspect-ratio:1;border-radius:var(--radius-lg);background:linear-gradient(135deg,var(--accent-light),var(--accent-rose));font-size:80px}
.promo-title{font-size:32px}
.ingredient-main{flex-direction:row;text-align:left;gap:40px}
.ingredient-circle{width:200px;height:200px;font-size:72px}
.ingredient-minis{grid-template-columns:repeat(4,1fr)}
.reviews-scroll{display:grid;grid-template-columns:repeat(3,1fr);overflow:visible}
.review-card{flex:auto}
.footer-grid{grid-template-columns:1.5fr 1fr 1fr 1.2fr}
}

@media(min-width:1280px){
.container{max-width:1280px;padding:0 80px;margin:0 auto}
}
</style>
</head>
<body>

<!-- ========== 0. ANNOUNCEMENT BAR ========== -->
<div class="announcement" id="announcement">
  <div class="marquee-wrap">
    <div class="marquee-track">
      <span>Бесплатная доставка от 3&nbsp;000&#8381;</span>
      <span>Скидка 10% на первый заказ: ПРИВЕТ10</span>
      <span>Бесплатный пробник к каждому заказу</span>
      <span>Бесплатная доставка от 3&nbsp;000&#8381;</span>
      <span>Скидка 10% на первый заказ: ПРИВЕТ10</span>
      <span>Бесплатный пробник к каждому заказу</span>
    </div>
  </div>
  <button class="close-btn" onclick="document.getElementById('announcement').classList.add('hidden')" aria-label="Закрыть">&times;</button>
</div>

<!-- ========== 1. HEADER ========== -->
<header class="header" id="header">
  <div class="container">
    <button class="icon-btn burger" id="burger-btn" aria-label="Меню">
      <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <a href="#" class="logo">Cosmetika<span class="lux">Lux</span></a>
    <nav class="nav-desktop">
      <a href="#">Каталог</a>
      <a href="#">Бренды</a>
      <a href="#">Новинки</a>
      <a href="#" class="accent">Акции</a>
    </nav>
    <div class="header-icons">
      <button class="icon-btn search-hide" aria-label="Поиск">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <button class="icon-btn wishlist-hide" aria-label="Избранное">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <button class="icon-btn" aria-label="Корзина">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span class="cart-badge">2</span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobile-menu">
  <div class="mobile-menu-header">
    <span class="logo">Cosmetika<span class="lux">Lux</span></span>
    <button class="icon-btn" id="close-menu" aria-label="Закрыть">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <nav>
    <a href="#">Каталог</a>
    <a href="#">Бренды</a>
    <a href="#">Новинки</a>
    <a href="#" class="accent">Акции</a>
    <a href="#">Доставка</a>
    <a href="#">О нас</a>
  </nav>
</div>

<!-- ========== 2. HERO ========== -->
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-text">
        <h1 class="h1-hero">Секреты безупречной кожи</h1>
        <p class="hero-subtitle">Оригинальная корейская косметика с доставкой по всей России</p>
        <div class="hero-ctas">
          <a href="#" class="btn-primary btn-text">Перейти в каталог</a>
          <a href="#" class="btn-secondary btn-text">&#10024; Подобрать уход</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-img-placeholder">
          <span class="petal">&#127800;</span>
          <span class="petal">&#127804;</span>
          <span class="petal">&#127801;</span>
          <span class="hero-emoji">&#129507;</span>
          <span class="hero-deco">&#127804; &#10024; &#127800;</span>
          <svg width="120" height="120" viewBox="0 0 120 120" style="opacity:.18;position:absolute;bottom:12%;right:10%">
            <path d="M60 10 C70 30, 90 40, 110 60 C90 80, 70 90, 60 110 C50 90, 30 80, 10 60 C30 40, 50 30, 60 10Z" fill="none" stroke="#C8A2C8" stroke-width="1.5"/>
          </svg>
          <svg width="80" height="80" viewBox="0 0 80 80" style="opacity:.15;position:absolute;top:15%;left:8%">
            <circle cx="40" cy="40" r="30" fill="none" stroke="#E8C4C4" stroke-width="1"/>
            <path d="M40 15 C48 28, 55 35, 68 40 C55 45, 48 52, 40 65 C32 52, 25 45, 12 40 C25 35, 32 28, 40 15Z" fill="none" stroke="#E8C4C4" stroke-width="1"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 3. TRUST BAR ========== -->
<section class="trust reveal">
  <div class="container">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-icon">
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <span class="trust-label">Оригинал</span>
        <span class="trust-desc">100% подлинность</span>
      </div>
      <div class="trust-item">
        <div class="trust-icon">
          <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <span class="trust-label">Доставка</span>
        <span class="trust-desc">По всей России за 2-5 дней</span>
      </div>
      <div class="trust-item">
        <div class="trust-icon">
          <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </div>
        <span class="trust-label">Возврат</span>
        <span class="trust-desc">14 дней без вопросов</span>
      </div>
      <div class="trust-item">
        <div class="trust-icon">
          <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <span class="trust-label">Оплата</span>
        <span class="trust-desc">Безопасная Mir / СБП</span>
      </div>
    </div>
  </div>
</section>

<!-- ========== 4. SKIN CONCERNS ========== -->
<section class="concerns reveal">
  <div class="container">
    <div class="section-header">
      <h2 class="h2-section">Подберём уход под вашу задачу</h2>
      <span class="gold-line"></span>
    </div>
    <div class="concerns-scroll">
      <div class="concern-card">
        <div class="concern-bg" style="background:linear-gradient(135deg,#E8F4F8,#d4ecf2)"><span class="emoji">&#128167;</span></div>
        <div class="concern-overlay"><div class="concern-name">Увлажнение</div><div class="concern-count">47 средств</div></div>
      </div>
      <div class="concern-card">
        <div class="concern-bg" style="background:linear-gradient(135deg,#F0E4F0,#e4d4e4)"><span class="emoji">&#129524;</span></div>
        <div class="concern-overlay"><div class="concern-name">Против акне</div><div class="concern-count">32 средства</div></div>
      </div>
      <div class="concern-card">
        <div class="concern-bg" style="background:linear-gradient(135deg,#FAF5EB,#f0e8d6)"><span class="emoji">&#10024;</span></div>
        <div class="concern-overlay"><div class="concern-name">Anti-age</div><div class="concern-count">28 средств</div></div>
      </div>
      <div class="concern-card">
        <div class="concern-bg" style="background:linear-gradient(135deg,#F0EBE6,#e4ddd4)"><span class="emoji">&#129531;</span></div>
        <div class="concern-overlay"><div class="concern-name">Чистота пор</div><div class="concern-count">35 средств</div></div>
      </div>
      <div class="concern-card">
        <div class="concern-bg" style="background:linear-gradient(135deg,#FFF8F5,#ffeee6)"><span class="emoji">&#9728;&#65039;</span></div>
        <div class="concern-overlay"><div class="concern-name">SPF-защита</div><div class="concern-count">19 средств</div></div>
      </div>
    </div>
    <div class="scroll-dots">
      <span class="scroll-dot active"></span><span class="scroll-dot"></span><span class="scroll-dot"></span><span class="scroll-dot"></span><span class="scroll-dot"></span>
    </div>
    <div class="concern-pills">
      <span class="concern-pill">Пигментация</span>
      <span class="concern-pill">Чувствительность</span>
      <span class="concern-pill">Все проблемы &rarr;</span>
    </div>
  </div>
</section>

<!-- ========== 5. BESTSELLERS ========== -->
<section class="products-section reveal">
  <div class="container">
    <div class="section-header">
      <div class="section-header-row">
        <div><h2 class="h2-section">Хиты продаж</h2><span class="gold-line"></span></div>
        <a href="#" class="section-link">Все хиты &rarr;</a>
      </div>
    </div>
    <div class="products-scroll">
      <!-- Card 1: COSRX -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#FAF5EB,#F0E4F0)">&#129522;</div>
          <span class="product-badge badge-gold">Хит #1</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">COSRX</span>
          <span class="product-name">Snail Mucin 96 Essence</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">(89)</span></span>
          <div class="product-price-row"><span class="product-price">1 900&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- Card 2: Sulwhasoo -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#FFF8F5,#FAF5EB)">&#129476;</div>
          <span class="product-badge badge-red">-9%</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Sulwhasoo</span>
          <span class="product-name">Essential Comfort Cream</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9734; <span class="count">(42)</span></span>
          <div class="product-price-row"><span class="product-price">6 800&#8381;</span><span class="product-old-price">7 500&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- Card 3: MISSHA -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#F0E4F0,#E8F4F8)">&#129514;</div>
          <span class="product-badge badge-gold">Хит #3</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">MISSHA</span>
          <span class="product-name">Time Revolution Essence</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">(67)</span></span>
          <div class="product-price-row"><span class="product-price">2 400&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- Card 4: Some By Mi -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#E8F4F8,#F0E4F0)">&#129523;</div>
          <span class="product-badge badge-lavender">Новинка</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Some By Mi</span>
          <span class="product-name">Miracle Toner</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9734; <span class="count">(31)</span></span>
          <div class="product-price-row"><span class="product-price">1 650&#8381;</span><span class="product-old-price">2 100&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 6. PROMO BANNER ========== -->
<section class="promo reveal">
  <div class="container">
    <div class="promo-inner">
      <div class="promo-content">
        <h2 class="promo-title">Весенняя забота о&nbsp;коже&nbsp;&mdash; до&nbsp;30%</h2>
        <div class="countdown" id="countdown">
          <div class="countdown-box"><span class="countdown-num" id="cd-days">02</span><span class="countdown-label">дней</span></div>
          <div class="countdown-box"><span class="countdown-num" id="cd-hours">14</span><span class="countdown-label">часов</span></div>
          <div class="countdown-box"><span class="countdown-num" id="cd-mins">00</span><span class="countdown-label">минут</span></div>
          <div class="countdown-box"><span class="countdown-num" id="cd-secs">00</span><span class="countdown-label">секунд</span></div>
        </div>
        <a href="#" class="btn-primary btn-text" style="background:#800080;color:#fff">Смотреть акции</a>
        <div class="promo-code">Промокод: <strong>ВЕСНА30</strong></div>
      </div>
      <div class="promo-image">&#127800;</div>
    </div>
  </div>
</section>

<!-- ========== 7. NEW ARRIVALS ========== -->
<section class="products-section alt-bg reveal">
  <div class="container">
    <div class="section-header">
      <div class="section-header-row">
        <div><h2 class="h2-section">Только что из Кореи</h2><span class="gold-line"></span></div>
        <a href="#" class="section-link">Все новинки &rarr;</a>
      </div>
    </div>
    <div class="products-scroll">
      <!-- New 1: Medicube -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#F0E4F0,#FFF8F5)">&#129516;</div>
          <span class="product-badge badge-lavender">Новинка</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Medicube</span>
          <span class="product-name">Zero Pore Pad 2.0</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">(12)</span></span>
          <div class="product-price-row"><span class="product-price">2 200&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- New 2: Hera -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#FAF5EB,#F0E4F0)">&#128132;</div>
          <span class="product-badge badge-lavender">Новинка</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Hera</span>
          <span class="product-name">UV Mist Cushion</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9734; <span class="count">(8)</span></span>
          <div class="product-price-row"><span class="product-price">4 100&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- New 3: Dr.Jart+ -->
      <div class="product-card">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#E8F4F8,#FAF5EB)">&#129507;</div>
          <span class="product-badge badge-lavender">Новинка</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Dr.Jart+</span>
          <span class="product-name">Ceramidin Cream</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">(54)</span></span>
          <div class="product-price-row"><span class="product-price">3 800&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
      </div>
      <!-- New 4: Laneige (СКОРО) -->
      <div class="product-card" style="position:relative">
        <div class="product-img">
          <div class="product-img-bg" style="background:linear-gradient(135deg,#FFF8F5,#F0E4F0)">&#128139;</div>
          <span class="product-badge badge-red">-25%</span>
          <button class="product-wishlist" aria-label="В избранное"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="product-info">
          <span class="product-brand">Laneige</span>
          <span class="product-name">Lip Sleeping Mask</span>
          <span class="product-stars">&#9733;&#9733;&#9733;&#9733;&#9733; <span class="count">(126)</span></span>
          <div class="product-price-row"><span class="product-price">1 350&#8381;</span><span class="product-old-price">1 800&#8381;</span></div>
          <button class="btn-cart btn-text">В корзину</button>
        </div>
        <div class="soon-overlay">
          <span>Скоро</span>
          <button class="btn-secondary btn-text" style="padding:10px 24px;font-size:13px">Узнать первой</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 8. INGREDIENT SPOTLIGHT ========== -->
<section class="ingredient reveal">
  <div class="container">
    <div class="section-header" style="text-align:center">
      <h2 class="h2-section">Ингредиент месяца</h2>
      <span class="gold-line" style="margin:12px auto 0"></span>
    </div>
    <div class="ingredient-main" style="margin-top:32px">
      <div class="ingredient-circle">&#129514;</div>
      <div>
        <div class="ingredient-name">Ниацинамид (Vitamin B3)</div>
        <p class="ingredient-desc">Осветляет пигментацию, сужает поры, укрепляет защитный барьер кожи. Концентрация от 2% до 10%. Подходит всем типам кожи.</p>
        <a href="#" class="ingredient-link">12 средств с ниацинамидом &rarr;</a>
      </div>
    </div>
    <div class="ingredient-minis">
      <div class="ingredient-mini"><span class="emoji">&#128012;</span><div class="info"><div class="name">Муцин улитки</div><div class="cnt">8 средств</div></div></div>
      <div class="ingredient-mini"><span class="emoji">&#128300;</span><div class="info"><div class="name">Ретинол</div><div class="cnt">5 средств</div></div></div>
      <div class="ingredient-mini"><span class="emoji">&#127807;</span><div class="info"><div class="name">Центелла азиатика</div><div class="cnt">14 средств</div></div></div>
      <div class="ingredient-mini"><span class="emoji">&#128167;</span><div class="info"><div class="name">Гиалуроновая кислота</div><div class="cnt">11 средств</div></div></div>
    </div>
  </div>
</section>

<!-- ========== 9. REVIEWS ========== -->
<section class="reviews reveal">
  <div class="container">
    <div class="section-header" style="text-align:center">
      <h2 class="h2-section">Что говорят наши покупатели</h2>
      <span class="gold-line" style="margin:12px auto 0"></span>
    </div>
    <div class="reviews-scroll" style="margin-top:32px">
      <div class="review-card">
        <div class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="review-text">&laquo;Кожа стала гладкой за 2 недели! COSRX Snail Mucin &mdash; моя находка года.&raquo;</p>
        <div class="review-author">Мария, 32 года</div>
        <div class="review-loc">Южно-Сахалинск</div>
        <div class="review-product">COSRX Snail Mucin</div>
      </div>
      <div class="review-card">
        <div class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="review-text">&laquo;Заказываю уже третий раз. Доставка до Хабаровска за 4 дня. Всё оригинал.&raquo;</p>
        <div class="review-author">Елена, 41 год</div>
        <div class="review-loc">Хабаровск</div>
        <div class="review-product">Sulwhasoo набор</div>
      </div>
      <div class="review-card">
        <div class="review-stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
        <p class="review-text">&laquo;Отличный тонер, кожа стала ровнее. Единственное &mdash; хотелось бы больше объём.&raquo;</p>
        <div class="review-author">Анна, 28 лет</div>
        <div class="review-loc">Москва</div>
        <div class="review-product">Some By Mi Toner</div>
      </div>
    </div>
    <div class="reviews-summary">
      <div class="reviews-summary-pill"><span class="star">&#9733;</span> 4.8 &middot; 237 отзывов &middot; 98% рекомендуют</div>
    </div>
  </div>
</section>

<!-- ========== 10. BRANDS ========== -->
<section class="brands reveal">
  <div class="container">
    <div class="section-header" style="text-align:center">
      <h2 class="h2-section">Наши бренды</h2>
      <span class="gold-line" style="margin:12px auto 0"></span>
    </div>
    <div class="brands-marquee">
      <div class="brands-track">
        <span>Sulwhasoo</span><span>&middot;</span>
        <span>The History of Whoo</span><span>&middot;</span>
        <span>COSRX</span><span>&middot;</span>
        <span>Missha</span><span>&middot;</span>
        <span>Medicube</span><span>&middot;</span>
        <span>Laneige</span><span>&middot;</span>
        <span>Innisfree</span><span>&middot;</span>
        <span>Etude</span><span>&middot;</span>
        <span>Some By Mi</span><span>&middot;</span>
        <span>Dr.Jart+</span><span>&middot;</span>
        <span>Hera</span><span>&middot;</span>
        <span>IOPE</span><span>&middot;</span>
        <span>AHC</span><span>&middot;</span>
        <span>Klairs</span><span>&middot;</span>
        <span>Beauty of Joseon</span><span>&middot;</span>
        <span>Sulwhasoo</span><span>&middot;</span>
        <span>The History of Whoo</span><span>&middot;</span>
        <span>COSRX</span><span>&middot;</span>
        <span>Missha</span><span>&middot;</span>
        <span>Medicube</span><span>&middot;</span>
        <span>Laneige</span><span>&middot;</span>
        <span>Innisfree</span><span>&middot;</span>
        <span>Etude</span><span>&middot;</span>
        <span>Some By Mi</span><span>&middot;</span>
        <span>Dr.Jart+</span><span>&middot;</span>
        <span>Hera</span><span>&middot;</span>
        <span>IOPE</span><span>&middot;</span>
        <span>AHC</span><span>&middot;</span>
        <span>Klairs</span><span>&middot;</span>
        <span>Beauty of Joseon</span>
      </div>
    </div>
    <div class="brands-link"><a href="#" class="section-link">Все бренды &rarr;</a></div>
  </div>
</section>

<!-- ========== 11. SUBSCRIBE ========== -->
<section class="subscribe reveal">
  <div class="container">
    <h2 class="h2-section">Будьте в курсе K-beauty трендов</h2>
    <p class="subscribe-subtitle">Новинки, секреты ухода и скидки &mdash; раз в неделю в вашей почте</p>
    <form class="subscribe-form" onsubmit="event.preventDefault();this.querySelector('button').textContent='Готово!'">
      <input type="email" class="subscribe-input" placeholder="Ваш email" required>
      <button type="submit" class="btn-primary btn-text">Подписаться</button>
    </form>
    <p class="subscribe-bonus">&#127873; Скидка 10% на первый заказ при подписке</p>
    <p class="subscribe-legal">Нажимая &laquo;Подписаться&raquo;, вы соглашаетесь с политикой конфиденциальности</p>
  </div>
</section>

<!-- ========== 12. FOOTER ========== -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="logo">Cosmetika<span class="lux">Lux</span></span>
        <p>Корейская косметика премиум-класса.<br>г.&nbsp;Южно-Сахалинск</p>
        <div class="footer-socials">
          <a href="#" aria-label="Telegram">TG</a>
          <a href="#" aria-label="WhatsApp">WA</a>
          <a href="#" aria-label="VK">VK</a>
        </div>
      </div>
      <div class="footer-col" onclick="this.classList.toggle('open')">
        <h4>Каталог <span class="arrow">&#9662;</span></h4>
        <ul>
          <li><a href="#">По проблемам</a></li>
          <li><a href="#">Уход за лицом</a></li>
          <li><a href="#">Макияж</a></li>
          <li><a href="#">Наборы</a></li>
          <li><a href="#">Бренды</a></li>
          <li><a href="#">Новинки</a></li>
          <li><a href="#">Акции</a></li>
        </ul>
      </div>
      <div class="footer-col" onclick="this.classList.toggle('open')">
        <h4>Помощь <span class="arrow">&#9662;</span></h4>
        <ul>
          <li><a href="#">Доставка</a></li>
          <li><a href="#">Оплата</a></li>
          <li><a href="#">Возврат</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Бонусы</a></li>
          <li><a href="#">О магазине</a></li>
        </ul>
      </div>
      <div class="footer-col" onclick="this.classList.toggle('open')">
        <h4>Контакты <span class="arrow">&#9662;</span></h4>
        <ul>
          <li><a href="tel:+7XXX">+7 (XXX) XXX-XX-XX</a></li>
          <li><a href="mailto:info@cosmetikalux.ru">info@cosmetikalux.ru</a></li>
          <li><a href="#">Telegram</a></li>
          <li><a href="#">WhatsApp</a></li>
          <li>г. Южно-Сахалинск</li>
        </ul>
      </div>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-badges">
      <span class="footer-badge">Mir</span>
      <span class="footer-badge">Visa</span>
      <span class="footer-badge">MC</span>
      <span class="footer-badge">СБП</span>
      <span class="footer-badge">ЮKassa</span>
      <span class="footer-badge">СДЭК</span>
      <span class="footer-badge">Почта России</span>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 CosmetikaLux. Все права защищены.</span>
      <div class="footer-bottom-links">
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Условия использования</a>
        <a href="#">Публичная оферта</a>
      </div>
    </div>
  </div>
</footer>

<!-- ========== 13. BACK TO TOP ========== -->
<button class="back-to-top" id="back-to-top" aria-label="Наверх" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<!-- ========== JAVASCRIPT ========== -->
<script>
/* 1. Header shadow on scroll + back-to-top visibility */
const header = document.getElementById('header');
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', function() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  btt.classList.toggle('visible', window.scrollY > 300);
}, {passive: true});

/* 2. Mobile menu toggle */
document.getElementById('burger-btn').addEventListener('click', function() {
  document.getElementById('mobile-menu').classList.add('open');
});
document.getElementById('close-menu').addEventListener('click', function() {
  document.getElementById('mobile-menu').classList.remove('open');
});
/* Close menu on link click */
document.querySelectorAll('#mobile-menu nav a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.remove('open');
  });
});

/* 3. Scroll reveal (IntersectionObserver) */
var reveals = document.querySelectorAll('.reveal');
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});
reveals.forEach(function(el) { observer.observe(el); });

/* 4. Countdown timer (2 days 14 hours from page load) */
(function() {
  var endTime = Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;
  function pad(n) { return String(n).padStart(2, '0'); }
  function updateCountdown() {
    var diff = Math.max(0, endTime - Date.now());
    var totalSecs = Math.floor(diff / 1000);
    var days = Math.floor(totalSecs / 86400);
    var hours = Math.floor((totalSecs % 86400) / 3600);
    var mins = Math.floor((totalSecs % 3600) / 60);
    var secs = totalSecs % 60;
    document.getElementById('cd-days').textContent = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent = pad(mins);
    document.getElementById('cd-secs').textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* 5. Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href && href.length > 1) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth'});
      }
    }
  });
});
</script>
</body>
</html>"""

import pathlib
out = pathlib.Path("/home/user/Cosmetikalux/prototype/index.html")
out.write_text(html, encoding="utf-8")
print(f"Generated {out} ({len(html):,} bytes)")
