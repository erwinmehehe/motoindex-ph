const css = String.raw`
.helmet-hub-page .product-grid.hub-product-rail{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:unset!important;grid-auto-rows:auto!important;gap:14px!important;width:100%!important;max-width:100%!important;overflow:visible!important;padding:0!important}
.helmet-hub-page .product-grid.hub-product-rail>.product-card-shell{grid-column:auto!important;grid-row:auto!important;place-self:stretch!important;align-self:stretch!important;justify-self:stretch!important;display:flex!important;min-width:0!important;width:auto!important;max-width:none!important;flex-direction:column!important;border-right:0!important}
.helmet-hub-page .product-grid.hub-product-rail>.product-card-shell>.product-card{flex:1 1 auto!important;width:100%!important;min-width:0!important;max-width:none!important}
.helmet-hub-page .product-grid.hub-product-rail .affiliate-card-action{width:100%!important;min-width:0!important}
@media(max-width:900px){.helmet-hub-page .product-grid.hub-product-rail{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:620px){.helmet-hub-page .product-grid.hub-product-rail{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}.helmet-hub-page .product-grid.hub-product-rail>.product-card-shell{width:100%!important}}
`;
export function HelmetGridRepairStyle(){return <style dangerouslySetInnerHTML={{__html:css}}/>;}
