const css = String.raw`
.recommendation-detail-scope{background:linear-gradient(180deg,#fff 0%,#f8fafc 46%,#fff 100%);color:#101828}
.recommendation-detail-scope>.page.shell{width:min(1180px,calc(100% - 40px));padding:34px 0 80px}
.recommendation-detail-scope .breadcrumbs{margin-bottom:24px}
.recommendation-detail-scope .guide-page-head{max-width:900px;margin:0 0 24px;padding:18px 0 0}
.recommendation-detail-scope .guide-kicker{display:block;margin-bottom:10px;color:#444CE7;font-size:10px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}
.recommendation-detail-scope .guide-page-head h1{max-width:900px;margin:0;font-family:var(--font-jakarta),var(--font-inter),sans-serif;font-size:clamp(42px,5vw,64px);font-weight:800;line-height:.98;letter-spacing:-.052em;text-wrap:balance}
.recommendation-detail-scope .guide-direct-answer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;margin:24px 0 34px;padding:24px 26px;border:1px solid rgba(148,163,184,.18);border-radius:20px;background:#fff;box-shadow:0 12px 34px rgba(15,23,42,.045)}
.recommendation-detail-scope .guide-direct-answer p{max-width:780px;margin:0;color:#475467;font-size:15px;line-height:1.65}
.recommendation-detail-scope .guide-direct-answer strong{max-width:220px;color:#3038bd;font-size:12px;line-height:1.4;text-align:right}
.recommendation-detail-scope .guide-quick-picks{margin:0 0 42px;padding:28px 0;border-top:1px solid rgba(148,163,184,.18);border-bottom:1px solid rgba(148,163,184,.18)}
.recommendation-detail-scope .section-head.compact{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin:0 0 18px}
.recommendation-detail-scope .section-head.compact>div{max-width:760px}
.recommendation-detail-scope .section-head.compact h2{margin:0;font-family:var(--font-jakarta),var(--font-inter),sans-serif;font-size:clamp(28px,3vw,38px);line-height:1.03;letter-spacing:-.04em}
.recommendation-detail-scope .section-head.compact p{max-width:720px;margin:9px 0 0;color:#667085;font-size:12px;line-height:1.55}
.recommendation-detail-scope .guide-pick-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.recommendation-detail-scope .guide-pick-grid>a{display:flex;min-width:0;min-height:128px;flex-direction:column;padding:17px;border:1px solid rgba(148,163,184,.18);border-radius:16px;background:#fff;color:#101828}
.recommendation-detail-scope .guide-pick-grid>a:hover{border-color:rgba(68,76,231,.28);background:#fafbff}
.recommendation-detail-scope .guide-pick-grid span{color:#444CE7;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.08em}
.recommendation-detail-scope .guide-pick-grid strong{margin-top:8px;font-size:16px;line-height:1.2;letter-spacing:-.02em}
.recommendation-detail-scope .guide-pick-grid small{margin-top:auto;padding-top:12px;color:#667085;font-size:10px;line-height:1.4}
.recommendation-detail-scope .guide-table-wrap{width:100%;margin:0 0 44px;overflow:auto;border:1px solid rgba(148,163,184,.2);border-radius:18px;background:#fff;-webkit-overflow-scrolling:touch}
.recommendation-detail-scope .guide-comparison-table{width:100%;min-width:980px;border-collapse:collapse}
.recommendation-detail-scope .guide-comparison-table th,.recommendation-detail-scope .guide-comparison-table td{padding:14px 15px;border-bottom:1px solid rgba(148,163,184,.14);color:#475467;font-size:11px;line-height:1.45;text-align:left;vertical-align:top}
.recommendation-detail-scope .guide-comparison-table thead th{position:sticky;top:0;z-index:1;background:#f8fafc;color:#667085;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.06em}
.recommendation-detail-scope .guide-comparison-table tbody th{min-width:190px;color:#101828;font-size:12px;font-weight:800}
.recommendation-detail-scope .guide-comparison-table tbody th a{color:#101828}
.recommendation-detail-scope .guide-order-cell{width:54px;color:#98a2b3!important;font-weight:850}
.recommendation-detail-scope .guide-why-cell{min-width:260px}
.recommendation-detail-scope .guide-method{margin:0 0 48px;padding:28px;border:1px solid rgba(148,163,184,.18);border-radius:22px;background:#101828;color:#fff}
.recommendation-detail-scope .guide-method>div:first-child{max-width:820px}
.recommendation-detail-scope .guide-method>div:first-child>span{display:block;color:#a5b4fc;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.1em}
.recommendation-detail-scope .guide-method h2{margin:7px 0 10px;font-size:clamp(27px,3vw,38px);letter-spacing:-.04em}
.recommendation-detail-scope .guide-method>div:first-child>p{margin:0;color:#cbd5e1;font-size:12px;line-height:1.6}
.recommendation-detail-scope .guide-method-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:24px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.1)}
.recommendation-detail-scope .guide-method-grid>div{min-width:0;padding:18px;background:#101828}
.recommendation-detail-scope .guide-method-grid strong{display:block;margin-bottom:9px;color:#fff;font-size:11px}
.recommendation-detail-scope .guide-method-grid p,.recommendation-detail-scope .guide-method-grid li{color:#aeb8c5;font-size:10px;line-height:1.5}
.recommendation-detail-scope .guide-method-grid ul{margin:0;padding-left:16px;display:grid;gap:6px}
.recommendation-detail-scope .guide-model-analysis-list{display:grid;gap:0;margin:0 0 48px;border-top:1px solid rgba(148,163,184,.18)}
.recommendation-detail-scope .guide-model-analysis{display:grid;grid-template-columns:190px minmax(0,1fr);gap:24px;padding:26px 0;border-bottom:1px solid rgba(148,163,184,.18);background:transparent}
.recommendation-detail-scope .guide-model-media-wrap{position:relative;min-width:0}
.recommendation-detail-scope .guide-model-position{display:inline-flex;margin-bottom:8px;color:#444CE7;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.08em}
.recommendation-detail-scope .guide-model-media{display:block;width:100%;height:150px;overflow:hidden;border:1px solid rgba(148,163,184,.14);border-radius:14px;background:#f8fafc}
.recommendation-detail-scope .guide-model-media img{width:100%!important;height:100%!important;padding:10px!important;object-fit:contain!important}
.recommendation-detail-scope .guide-model-fallback{height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:14px;color:#667085;background:#f8fafc}
.recommendation-detail-scope .guide-model-copy{min-width:0}
.recommendation-detail-scope .guide-model-heading{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}
.recommendation-detail-scope .guide-model-type{color:#667085;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
.recommendation-detail-scope .guide-model-heading h3{margin:4px 0 4px;font-size:26px;line-height:1.05;letter-spacing:-.04em}
.recommendation-detail-scope .guide-model-heading h3 a{color:#101828}
.recommendation-detail-scope .guide-model-heading p{margin:0;color:#98a2b3;font-size:10px}
.recommendation-detail-scope .guide-model-price{flex:0 0 auto;text-align:right}
.recommendation-detail-scope .guide-model-price small{display:block;color:#98a2b3;font-size:8px;text-transform:uppercase}
.recommendation-detail-scope .guide-model-price strong{display:block;margin-top:4px;font-size:15px}
.recommendation-detail-scope .guide-model-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;margin-top:18px;border-top:1px solid rgba(148,163,184,.16);border-bottom:1px solid rgba(148,163,184,.16)}
.recommendation-detail-scope .guide-model-kpis>span{min-width:0;padding:12px 10px;border-right:1px solid rgba(148,163,184,.14)}
.recommendation-detail-scope .guide-model-kpis>span:last-child{border-right:0}
.recommendation-detail-scope .guide-model-kpis small{display:block;color:#98a2b3;font-size:8px;text-transform:uppercase}
.recommendation-detail-scope .guide-model-kpis b{display:block;margin-top:4px;font-size:11px;overflow-wrap:anywhere}
.recommendation-detail-scope .guide-model-editorial{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:17px}
.recommendation-detail-scope .guide-model-editorial section{min-width:0}
.recommendation-detail-scope .guide-model-editorial strong{display:block;margin-bottom:5px;color:#344054;font-size:10px}
.recommendation-detail-scope .guide-model-editorial p{margin:0;color:#667085;font-size:10px;line-height:1.5}
.recommendation-detail-scope .guide-model-actions{display:flex;flex-wrap:wrap;gap:16px;margin-top:15px}
.recommendation-detail-scope .guide-model-actions a{color:#444CE7;font-size:10px;font-weight:850}
.recommendation-detail-scope .guide-topic-grid,.recommendation-detail-scope .guide-decision-grid,.recommendation-detail-scope .guide-related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 46px}
.recommendation-detail-scope .guide-topic-grid>article,.recommendation-detail-scope .guide-decision-grid>article,.recommendation-detail-scope .guide-related-grid>a{min-width:0;padding:20px;border:1px solid rgba(148,163,184,.18);border-radius:17px;background:#fff}
.recommendation-detail-scope .guide-topic-grid h2,.recommendation-detail-scope .guide-decision-grid h3{margin:0 0 8px;font-size:18px;line-height:1.15;letter-spacing:-.03em}
.recommendation-detail-scope .guide-topic-grid p,.recommendation-detail-scope .guide-decision-grid p{margin:0;color:#667085;font-size:11px;line-height:1.55}
.recommendation-detail-scope .guide-decision-section{margin-top:4px}
.recommendation-detail-scope .guide-decision-grid>article{display:flex;min-height:180px;flex-direction:column}
.recommendation-detail-scope .guide-decision-grid>article>span{color:#444CE7;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.06em}
.recommendation-detail-scope .guide-decision-grid h3{margin-top:10px}
.recommendation-detail-scope .guide-decision-grid a{margin-top:auto;padding-top:14px;color:#444CE7;font-size:10px;font-weight:850}
.recommendation-detail-scope .guide-related-grid>a{display:flex;min-height:125px;flex-direction:column;color:#101828}
.recommendation-detail-scope .guide-related-grid strong{font-size:14px;line-height:1.25}
.recommendation-detail-scope .guide-related-grid small{margin-top:auto;padding-top:12px;color:#667085;font-size:10px;line-height:1.45}
.recommendation-detail-scope .guide-caveat{margin:28px 0 42px;padding:22px;border:1px solid #fde68a;border-radius:17px;background:#fffbeb}
.recommendation-detail-scope .guide-caveat h2{margin:0 0 10px;font-size:20px}
.recommendation-detail-scope .guide-caveat ul{margin:0;padding-left:18px;display:grid;gap:7px;color:#665c3b;font-size:11px;line-height:1.5}
@media(max-width:980px){.recommendation-detail-scope .guide-pick-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.recommendation-detail-scope .guide-method-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.recommendation-detail-scope .guide-model-analysis{grid-template-columns:150px minmax(0,1fr)}.recommendation-detail-scope .guide-model-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.recommendation-detail-scope .guide-model-kpis>span:nth-child(3){border-right:0}.recommendation-detail-scope .guide-topic-grid,.recommendation-detail-scope .guide-decision-grid,.recommendation-detail-scope .guide-related-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.recommendation-detail-scope>.page.shell{width:min(100% - 24px,1180px);padding-top:22px}.recommendation-detail-scope .guide-page-head h1{font-size:clamp(36px,10vw,48px)}.recommendation-detail-scope .guide-direct-answer{grid-template-columns:1fr;gap:10px;padding:19px}.recommendation-detail-scope .guide-direct-answer strong{max-width:none;text-align:left}.recommendation-detail-scope .section-head.compact{display:block}.recommendation-detail-scope .guide-pick-grid{grid-template-columns:1fr}.recommendation-detail-scope .guide-table-wrap{margin-inline:0;border-radius:14px}.recommendation-detail-scope .guide-method{padding:20px;border-radius:18px}.recommendation-detail-scope .guide-method-grid{grid-template-columns:1fr}.recommendation-detail-scope .guide-model-analysis{grid-template-columns:1fr;gap:14px;padding:22px 0}.recommendation-detail-scope .guide-model-media{width:100%;height:210px}.recommendation-detail-scope .guide-model-heading{display:block}.recommendation-detail-scope .guide-model-price{margin-top:10px;text-align:left}.recommendation-detail-scope .guide-model-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.recommendation-detail-scope .guide-model-kpis>span,.recommendation-detail-scope .guide-model-kpis>span:nth-child(3){border-right:1px solid rgba(148,163,184,.14)}.recommendation-detail-scope .guide-model-kpis>span:nth-child(even){border-right:0}.recommendation-detail-scope .guide-model-editorial{grid-template-columns:1fr;gap:12px}.recommendation-detail-scope .guide-topic-grid,.recommendation-detail-scope .guide-decision-grid,.recommendation-detail-scope .guide-related-grid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.recommendation-detail-scope a{transition:none!important}}
`;
export function RecommendationDetailStyle(){return <style dangerouslySetInnerHTML={{__html:css}}/>;}
