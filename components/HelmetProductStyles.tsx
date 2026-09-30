export function HelmetProductStyles() {
  return <style>{`
.helmet-product-page{max-width:1120px;padding-top:36px}
.helmet-product-page .breadcrumbs{margin-bottom:16px}
.helmet-product-page .product-detail-hero{grid-template-columns:1fr 1fr;gap:52px;padding:14px 0 40px}
.helmet-product-page .product-detail-media>.entity-media{height:500px;border-color:var(--mi-color-line-soft);border-radius:var(--mi-radius-2xl);background:var(--mi-color-surface)}
.helmet-product-page .product-detail-media>.entity-media img{padding:32px}
.helmet-product-page .product-detail-summary h1{font-size:clamp(40px,4.5vw,62px);line-height:.96}
.helmet-product-page .product-detail-description p{max-width:54ch;font-size:14px;line-height:1.65}
.helmet-product-page .product-detail-price-block{display:grid;gap:3px;margin:24px 0 12px}
.helmet-product-page .product-detail-price-block small{color:var(--mi-color-slate-500);font-size:10px}
.helmet-product-page .product-detail-action{margin-bottom:16px}
.helmet-product-page .helmet-hero-cta{display:inline-flex;min-height:44px;align-items:center;padding:0 18px;border-radius:var(--mi-radius-sm);background:var(--mi-color-primary);color:var(--mi-color-surface);font-size:12px;font-weight:850}
.helmet-product-page .product-fact{background:var(--mi-color-surface-subtle)}
.helmet-product-page .product-entity-nav{position:sticky;top:72px;z-index:20;margin:0 0 6px;padding:9px 0;background:var(--mi-color-surface);border-bottom:1px solid var(--mi-color-line)}
.helmet-product-page .product-entity-nav a{min-height:34px;padding:0 11px;border-radius:var(--mi-radius-pill)}
.helmet-product-page .product-entity-section{padding:56px 0;border-top:1px solid var(--mi-color-line-soft)}
.helmet-product-page .helmet-price-overview{display:grid;grid-template-columns:.8fr 1.2fr;gap:12px;margin-bottom:16px}
.helmet-product-page .helmet-price-primary,.helmet-product-page .helmet-price-meta article,.helmet-product-page .helmet-sizing-panel>div,.helmet-product-page .helmet-fit-note,.helmet-product-page .helmet-visor-card{border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-lg);background:var(--mi-color-surface)}
.helmet-product-page .helmet-price-primary{display:flex;flex-direction:column;justify-content:center;padding:22px}
.helmet-product-page :is(.helmet-price-primary,.helmet-price-meta,.helmet-visor-card) span,.helmet-product-page .helmet-panel-label{color:var(--mi-color-slate-500);font-size:9px;font-weight:850;text-transform:uppercase}
.helmet-product-page .helmet-price-primary strong{margin:6px 0;color:var(--mi-color-primary);font-size:34px}
.helmet-product-page :is(.helmet-price-primary,.helmet-price-meta,.helmet-visor-card) small{color:var(--mi-color-slate-500);font-size:10px}
.helmet-product-page .helmet-price-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.helmet-product-page .helmet-price-meta article{padding:17px}
.helmet-product-page .helmet-price-meta strong{display:block;margin:6px 0;font-size:14px}
.helmet-product-page .commerce-price-comparison{margin-top:14px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-lg);background:var(--mi-color-surface);overflow:hidden}
.helmet-product-page .commerce-price-head,.helmet-product-page .commerce-disclosure{padding:16px 20px}
.helmet-product-page .commerce-offer-row{display:grid;grid-template-columns:1.3fr .7fr .8fr auto;gap:14px;align-items:center;padding:15px 20px;border-top:1px solid var(--mi-color-line-soft)}
.helmet-product-page .commerce-offer-row small{display:block;color:var(--mi-color-slate-500);font-size:9px}
.helmet-product-page .helmet-spec-table{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;border-top:0}
.helmet-product-page .helmet-spec-table>div{grid-template-columns:130px 1fr;min-height:54px;padding:13px 0}
.helmet-product-page .helmet-sizing-panel{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}
.helmet-product-page .helmet-sizing-panel>div,.helmet-product-page .helmet-fit-note{padding:20px}
.helmet-product-page .helmet-panel-label{display:block;margin-bottom:12px}
.helmet-product-page .size-chips{display:flex;flex-wrap:wrap;gap:8px;border:0}
.helmet-product-page .size-chips span{min-width:48px;padding:9px 13px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-pill);background:var(--mi-color-surface-subtle);text-align:center;font-weight:850}
.helmet-product-page .helmet-fit-note p,.helmet-product-page .helmet-inline-note{margin:7px 0 0;color:var(--mi-color-slate-500);font-size:12px;line-height:1.55}
.helmet-product-page .helmet-visor-card{display:grid;grid-template-columns:repeat(3,1fr);padding:0;overflow:hidden}
.helmet-product-page .helmet-visor-card>div{padding:18px;border-right:1px solid var(--mi-color-line-soft)}
.helmet-product-page .helmet-visor-card>div:last-child{border-right:0}
.helmet-product-page .helmet-visor-card strong{display:block;margin-top:5px;font-size:14px}
.helmet-product-page .product-editorial{gap:10px;border:0}
.helmet-product-page .product-editorial>article{border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-lg);background:var(--mi-color-surface);padding:20px}
.helmet-product-page .product-editorial>article:last-child{border-right:1px solid var(--mi-color-line)}
@media(max-width:900px){
  .helmet-product-page .product-detail-hero{grid-template-columns:1fr;gap:22px}
  .helmet-product-page .product-detail-media>.entity-media{height:380px}
  .helmet-product-page .helmet-price-overview,.helmet-product-page .helmet-sizing-panel,.helmet-product-page .helmet-spec-table{grid-template-columns:1fr}
  .helmet-product-page .commerce-offer-row{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .helmet-product-page{padding-top:26px}
  .helmet-product-page .product-detail-hero{padding:6px 0 28px}
  .helmet-product-page .product-detail-media>.entity-media{height:290px}
  .helmet-product-page .product-detail-media>.entity-media img{padding:18px}
  .helmet-product-page .product-detail-summary h1{font-size:clamp(36px,11vw,46px)}
  .helmet-product-page .product-entity-nav{top:62px;margin-inline:calc((100vw - 100%)/-2);padding-inline:12px}
  .helmet-product-page .product-entity-section{padding:42px 0}
  .helmet-product-page .helmet-price-meta,.helmet-product-page .helmet-visor-card{grid-template-columns:1fr}
  .helmet-product-page .commerce-offer-row{grid-template-columns:1fr;gap:8px;padding:14px 17px}
  .helmet-product-page .helmet-visor-card>div{padding:16px 17px;border-right:0;border-bottom:1px solid var(--mi-color-line-soft)}
  .helmet-product-page .helmet-visor-card>div:last-child{border-bottom:0}
  .helmet-product-page .product-editorial>article{padding:18px}
}
  `}</style>;
}
