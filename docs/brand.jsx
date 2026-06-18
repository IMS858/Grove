import { useState } from "react";

const C = {
  bg:"#0F1214",card:"#181D22",border:"#2A3238",
  forest:"#1B4332",fMid:"#2D6A4F",fLt:"#40916C",
  sage:"#95D5B2",sageLt:"#D8F3DC",
  citrus:"#FF8C42",
  white:"#F0EDE8",tDim:"#7A838B",tMid:"#A8B0B8",
};

// ─── LOGO 1: GROVE (recommended) ────────────────────
// Concept: Minimal leaf pair forming a "G" negative space.
// Clean enough for an app icon, distinctive at any size.
function GroveMark({size=64,color=C.sage}){
  const s=size,cx=s/2,cy=s/2,r=s*.38;
  return(
    <svg width={s} height={s} viewBox="0 0 100 100">
      {/* Two overlapping leaves forming abstract G shape */}
      <ellipse cx="42" cy="45" rx="22" ry="32" fill={color} opacity="0.9" transform="rotate(-15 42 45)"/>
      <ellipse cx="58" cy="48" rx="18" ry="28" fill={C.fMid} opacity="0.85" transform="rotate(10 58 48)"/>
      {/* Stem */}
      <line x1="50" y1="72" x2="50" y2="92" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      {/* Subtle vein on main leaf */}
      <line x1="42" y1="25" x2="42" y2="60" stroke={C.forest} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

function GroveIcon({size=120}){
  return(
    <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(135deg, ${C.forest} 0%, ${C.fMid} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${C.forest}66`}}>
      <GroveMark size={size*.7} color={C.sage}/>
    </div>
  );
}

function GroveWordmark({size=28}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:size*.35}}>
      <GroveMark size={size*1.4} color={C.sage}/>
      <span style={{fontSize:size,fontWeight:700,letterSpacing:"-0.5px",color:C.white}}>grove</span>
    </div>
  );
}

// ─── LOGO 2: TEND ────────────────────────────────────
// Concept: A single leaf with a gentle curve — the act of tending.
function TendMark({size=64,color=C.sage}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M50 12 C30 12, 15 35, 18 58 C21 78, 38 90, 50 92 C62 90, 79 78, 82 58 C85 35, 70 12, 50 12Z" fill={color} opacity="0.9"/>
      <path d="M50 28 Q48 55, 50 80" stroke={C.forest} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 45 Q38 38, 30 42" stroke={C.forest} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25"/>
      <path d="M50 55 Q62 48, 68 52" stroke={C.forest} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

function TendIcon({size=120}){
  return(
    <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(145deg, ${C.forest} 0%, #1a3a2e 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${C.forest}66`}}>
      <TendMark size={size*.65} color={C.sage}/>
    </div>
  );
}

// ─── LOGO 3: YIELD ───────────────────────────────────
// Concept: Upward arrow made of a leaf — growth + outcome.
function YieldMark({size=64,color=C.sage}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M50 8 L30 40 L42 36 L42 88 L58 88 L58 36 L70 40 Z" fill={color} opacity="0.9"/>
      {/* Small fruit/dot at the peak */}
      <circle cx="50" cy="14" r="5" fill={C.citrus} opacity="0.9"/>
    </svg>
  );
}

function YieldIcon({size=120}){
  return(
    <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(135deg, ${C.forest} 0%, ${C.fMid} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${C.forest}66`}}>
      <YieldMark size={size*.6} color={C.sage}/>
    </div>
  );
}

// ─── LOGO 4: 9B (refined original) ──────────────────
// Concept: The "9" with a leaf growing from the tail.
function NineBMark({size=64}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* The 9 */}
      <text x="22" y="72" fontSize="62" fontWeight="800" fill={C.sage} fontFamily="-apple-system,Inter,system-ui,sans-serif">9</text>
      {/* Leaf growing from the 9's tail */}
      <ellipse cx="62" cy="30" rx="12" ry="20" fill={C.sage} opacity="0.7" transform="rotate(25 62 30)"/>
      <line x1="58" y1="42" x2="55" y2="55" stroke={C.fMid} strokeWidth="2" strokeLinecap="round"/>
      {/* B */}
      <text x="60" y="72" fontSize="30" fontWeight="700" fill={C.fLt} fontFamily="-apple-system,Inter,system-ui,sans-serif">B</text>
    </svg>
  );
}

function NineBIcon({size=120}){
  return(
    <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(135deg, ${C.forest} 0%, #162e24 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${C.forest}66`}}>
      <NineBMark size={size*.75}/>
    </div>
  );
}

// ─── LOGO 5: CANOPY ─────────────────────────────────
// Concept: Abstract tree canopy from above — concentric organic rings.
function CanopyMark({size=64,color=C.sage}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="46" r="32" fill={color} opacity="0.25"/>
      <circle cx="50" cy="44" r="22" fill={color} opacity="0.45"/>
      <circle cx="50" cy="42" r="13" fill={color} opacity="0.8"/>
      <circle cx="50" cy="40" r="5" fill={C.sageLt}/>
      {/* Trunk */}
      <rect x="48" y="74" width="4" height="18" rx="2" fill={C.fMid}/>
    </svg>
  );
}

function CanopyIcon({size=120}){
  return(
    <div style={{width:size,height:size,borderRadius:size*.22,background:`linear-gradient(135deg, ${C.forest} 0%, ${C.fMid} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${C.forest}66`}}>
      <CanopyMark size={size*.7} color={C.sage}/>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────
const OPTIONS = [
  {
    id:"grove", name:"Grove", tagline:"Your garden, running.",
    why:"One syllable. Evokes SoCal citrus groves, abundance, a curated collection. Premium feel (Arc, Linear, Notion energy). Grows beyond Zone 9b naturally — groves exist everywhere.",
    Icon:GroveIcon, Mark:GroveMark,
    wordmark:(s)=><div style={{display:"flex",alignItems:"center",gap:s*.3}}>
      <GroveMark size={s*1.2} color={C.sage}/>
      <span style={{fontSize:s,fontWeight:700,letterSpacing:"-0.5px",color:C.white,fontFamily:"-apple-system,Inter,system-ui,sans-serif"}}>grove</span>
    </div>,
  },
  {
    id:"tend", name:"Tend", tagline:"Grow smarter. Harvest more.",
    why:"A verb — you tend your garden. Intimate, caring, active. Four letters. Clean as it gets. The act of paying attention, which is exactly what the app does.",
    Icon:TendIcon, Mark:TendMark,
    wordmark:(s)=><div style={{display:"flex",alignItems:"center",gap:s*.3}}>
      <TendMark size={s*1.2} color={C.sage}/>
      <span style={{fontSize:s,fontWeight:700,letterSpacing:"1px",color:C.white,fontFamily:"-apple-system,Inter,system-ui,sans-serif"}}>tend</span>
    </div>,
  },
  {
    id:"canopy", name:"Canopy", tagline:"See your garden from above.",
    why:"The overhead view — exactly what the app gives you. A canopy protects, covers, and is the sign of a thriving garden. Two syllables, memorable, nature-tech crossover.",
    Icon:CanopyIcon, Mark:CanopyMark,
    wordmark:(s)=><div style={{display:"flex",alignItems:"center",gap:s*.3}}>
      <CanopyMark size={s*1.2} color={C.sage}/>
      <span style={{fontSize:s,fontWeight:600,letterSpacing:"0.5px",color:C.white,fontFamily:"-apple-system,Inter,system-ui,sans-serif"}}>canopy</span>
    </div>,
  },
  {
    id:"yield", name:"Yield", tagline:"Track everything. Harvest more.",
    why:"The outcome — what every gardener actually wants. Double meaning: harvest yield + return on effort. Five letters, strong, outcome-oriented. Speaks to the data-driven gardener.",
    Icon:YieldIcon, Mark:YieldMark,
    wordmark:(s)=><div style={{display:"flex",alignItems:"center",gap:s*.3}}>
      <YieldMark size={s*1.2} color={C.sage}/>
      <span style={{fontSize:s,fontWeight:700,letterSpacing:"1.5px",color:C.white,fontFamily:"-apple-system,Inter,system-ui,sans-serif",textTransform:"uppercase"}}>Yield</span>
    </div>,
  },
  {
    id:"9b", name:"9B GrowOS", tagline:"Grow smarter. Harvest more.",
    why:"The original — bold, technical, niche-first. Signals exactly who it's for. 'OS' conveys operating system. Risk: limits perceived scope if you expand beyond 9b. Could rebrand later.",
    Icon:NineBIcon, Mark:NineBMark,
    wordmark:(s)=><div style={{display:"flex",alignItems:"center",gap:s*.25}}>
      <NineBMark size={s*1.5}/>
      <div><span style={{fontSize:s,fontWeight:800,color:C.sage,fontFamily:"-apple-system,Inter,system-ui,sans-serif"}}>GrowOS</span></div>
    </div>,
  },
];

export default function BrandExplorer(){
  const[selected,setSelected]=useState("grove");
  const opt = OPTIONS.find(o=>o.id===selected);

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,'Inter',system-ui,sans-serif",maxWidth:430,margin:"0 auto"}}>

      {/* Header */}
      <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{color:C.white,fontSize:18,fontWeight:700}}>Brand Explorer</div>
        <div style={{color:C.tDim,fontSize:12,marginTop:4}}>Tap to compare · pick the one that feels right</div>
      </div>

      {/* Selector pills */}
      <div style={{display:"flex",gap:6,padding:"16px 16px 0",overflow:"auto"}}>
        {OPTIONS.map(o=>(
          <button key={o.id} onClick={()=>setSelected(o.id)} style={{
            background:selected===o.id?C.sage+"20":"transparent",
            border:`1px solid ${selected===o.id?C.sage:C.border}`,
            color:selected===o.id?C.sage:C.tMid,
            borderRadius:99,padding:"8px 16px",fontSize:13,fontWeight:600,
            cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s",
          }}>{o.name}</button>
        ))}
      </div>

      {opt && (
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:24}}>

          {/* App icon — hero */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,paddingTop:12}}>
            <opt.Icon size={140}/>
            <div style={{textAlign:"center"}}>
              <div style={{color:C.white,fontSize:26,fontWeight:800}}>{opt.name}</div>
              <div style={{color:C.citrus,fontSize:13,fontWeight:600,marginTop:4,letterSpacing:"1px"}}>{opt.tagline}</div>
            </div>
          </div>

          {/* Why this name */}
          <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:16}}>
            <div style={{color:C.sage,fontSize:12,fontWeight:600,marginBottom:6}}>Why this name</div>
            <div style={{color:C.tMid,fontSize:13,lineHeight:1.6}}>{opt.why}</div>
          </div>

          {/* Wordmark */}
          <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:24,display:"flex",justifyContent:"center"}}>
            {opt.wordmark(22)}
          </div>

          {/* Size tests */}
          <div>
            <div style={{color:C.tDim,fontSize:11,marginBottom:10}}>SIZE TEST — how it looks at every scale</div>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-around",background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:20}}>
              <div style={{textAlign:"center"}}>
                <opt.Icon size={28}/>
                <div style={{color:C.tDim,fontSize:9,marginTop:6}}>16pt tab bar</div>
              </div>
              <div style={{textAlign:"center"}}>
                <opt.Icon size={48}/>
                <div style={{color:C.tDim,fontSize:9,marginTop:6}}>Notification</div>
              </div>
              <div style={{textAlign:"center"}}>
                <opt.Icon size={72}/>
                <div style={{color:C.tDim,fontSize:9,marginTop:6}}>Home screen</div>
              </div>
              <div style={{textAlign:"center"}}>
                <opt.Icon size={100}/>
                <div style={{color:C.tDim,fontSize:9,marginTop:6}}>App Store</div>
              </div>
            </div>
          </div>

          {/* On dark and light */}
          <div>
            <div style={{color:C.tDim,fontSize:11,marginBottom:10}}>DARK / LIGHT</div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,background:C.bg,borderRadius:16,border:`1px solid ${C.border}`,padding:20,display:"flex",justifyContent:"center",alignItems:"center"}}>
                {opt.wordmark(16)}
              </div>
              <div style={{flex:1,background:"#FAF8F3",borderRadius:16,border:`1px solid #E4E6E2`,padding:20,display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{filter:"invert(0)"}}>
                  {OPTIONS.find(o=>o.id===selected)?.wordmark && (
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <opt.Mark size={24} color={C.forest}/>
                      <span style={{fontSize:16,fontWeight:700,color:C.forest,fontFamily:"-apple-system,Inter,system-ui,sans-serif"}}>
                        {opt.name.toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Splash mock */}
          <div>
            <div style={{color:C.tDim,fontSize:11,marginBottom:10}}>SPLASH SCREEN</div>
            <div style={{background:`linear-gradient(160deg, ${C.forest} 0%, #0d2118 100%)`,borderRadius:20,padding:"60px 20px",textAlign:"center"}}>
              <opt.Icon size={100}/>
              <div style={{color:C.white,fontSize:24,fontWeight:800,marginTop:16}}>{opt.name}</div>
              <div style={{color:C.sage,fontSize:12,fontWeight:500,marginTop:6,letterSpacing:"2px",textTransform:"uppercase"}}>{opt.tagline}</div>
            </div>
          </div>

          {/* App store listing mock */}
          <div>
            <div style={{color:C.tDim,fontSize:11,marginBottom:10}}>APP STORE LISTING</div>
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:16,display:"flex",gap:14,alignItems:"center"}}>
              <opt.Icon size={64}/>
              <div>
                <div style={{color:C.white,fontSize:15,fontWeight:700}}>{opt.name}</div>
                <div style={{color:C.tDim,fontSize:12}}>{opt.tagline}</div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}>
                  <span style={{color:C.citrus,fontSize:12}}>★★★★★</span>
                  <span style={{color:C.tDim,fontSize:10}}>4.8 · Lifestyle</span>
                </div>
                <div style={{display:"inline-block",marginTop:6,background:"#0A84FF",color:"white",fontSize:11,fontWeight:600,padding:"4px 14px",borderRadius:99}}>GET</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Bottom recommendation */}
      <div style={{padding:"12px 20px 40px",borderTop:`1px solid ${C.border}`}}>
        <div style={{background:C.sage+"10",border:`1px solid ${C.sage}33`,borderRadius:14,padding:16}}>
          <div style={{color:C.sage,fontSize:13,fontWeight:700,marginBottom:6}}>My recommendation: Grove</div>
          <div style={{color:C.tMid,fontSize:12,lineHeight:1.6}}>
            It's one syllable, universally understood, and carries the SoCal citrus-grove heritage without boxing you into Zone 9b. "Grove" scales from a niche garden app to a national platform without a rebrand. The leaf-pair mark works at every size from 16pt to billboard.
          </div>
          <div style={{color:C.tDim,fontSize:11,marginTop:8}}>
            Runner-up: Tend — if you want the more intimate, verb-as-brand feel (like Calm or Notion).
          </div>
        </div>
      </div>
    </div>
  );
}
