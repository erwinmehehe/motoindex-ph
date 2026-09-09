export type ModelGearGuide = {
  modelId: string;
  helmetIds: string[];
  intro: string;
};

export const modelGearGuides: ModelGearGuide[] = [
  { modelId:"yamaha-nmax-v3", helmetIds:["kyt-d-city","kyt-r1r","evo-vxr-8000"], intro:"For an NMAX commuter or longer-ride setup, start with road helmets that balance full-face or modular coverage, visor practicality and everyday comfort. Helmet fit is rider-specific, not motorcycle-specific." },
  { modelId:"honda-adv-160", helmetIds:["kyt-r1r","kyt-d-city","spyder-recon-2"], intro:"ADV160 riders often mix commuting and longer road use, so this shortlist emphasizes road helmets with practical visor and ventilation features. Choose the helmet by head fit and certification, not by matching the motorcycle brand." },
  { modelId:"yamaha-aerox-v3", helmetIds:["kyt-tt-course","kyt-r1r","spyder-fury-rapid-s8"], intro:"Aerox V3 riders comparing sport-oriented road helmets should still prioritize fit, certification evidence, visor quality and daily comfort before graphics or styling." },
  { modelId:"honda-click-160", helmetIds:["kyt-d-city","evo-m2","spyder-fury-rapid-s8"], intro:"For Click 160 city use, these verified road-helmet records give a practical starting point across price, full-face coverage and visor features." },
  { modelId:"honda-pcx-160", helmetIds:["kyt-d-city","evo-vxr-8000","spyder-neo-icon"], intro:"PCX160 gear shopping often centers on daily comfort and storage. These helmet options are a starting shortlist, while top-box and tire cards below use model-specific fitment or size evidence where available." },
  { modelId:"yamaha-fazzio", helmetIds:["evo-m2","spyder-neo-icon","kyt-d-city"], intro:"For Fazzio commuting, compare compact road-helmet options by fit, visor setup, certification evidence and price instead of choosing only by retro styling." }
];

export function getModelGearGuide(modelId:string){
  return modelGearGuides.find(guide=>guide.modelId===modelId);
}
