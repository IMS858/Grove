import { useState, useEffect } from "react";

const C = {
  bg:"#0F1214",card:"#181D22",card2:"#1E2429",border:"#2A3238",
  forest:"#1B4332",fMid:"#2D6A4F",fLt:"#40916C",
  sage:"#95D5B2",sageDim:"#52796F",
  citrus:"#FF8C42",citDim:"#CC6F35",
  white:"#F0EDE8",tDim:"#7A838B",tMid:"#A8B0B8",
  danger:"#E5484D",warn:"#F4A62A",
};

function AnimNum({n,pre="",suf="",dur=1200}){
  const[v,setV]=useState(0);
  useEffect(()=>{let s,f;const t=(ts)=>{if(!s)s=ts;const p=Math.min(1,(ts-s)/dur);setV(Math.round((1-Math.pow(1-p,3))*n));if(p<1)f=requestAnimationFrame(t);};f=requestAnimationFrame(t);return()=>cancelAnimationFrame(f);},[n]);
  return <>{pre}{v.toLocaleString()}{suf}</>;
}

function Bar({label,val,max,color=C.sage}){
  const[w,setW]=useState(0);
  useEffect(()=>{setTimeout(()=>setW((val/max)*100),300);},[val]);
  return(<div style={{marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
      <span style={{color:C.tMid,fontSize:12}}>{label}</span>
      <span style={{color,fontSize:12,fontWeight:600}}>{val}%</span>
    </div>
    <div style={{height:6,borderRadius:99,background:C.border}}>
      <div style={{height:"100%",width:`${w}%`,borderRadius:99,background:color,transition:"width 1.2s cubic-bezier(.22,1,.36,1)"}}/>
    </div>
  </div>);
}

function Section({children,id}){
  return <section id={id} style={{padding:"48px 20px",borderBottom:`1px solid ${C.border}22`}}>{children}</section>;
}
function H2({children,sub}){
  return(<div style={{marginBottom:24}}>
    <h2 style={{color:C.white,fontSize:22,fontWeight:700,margin:0,lineHeight:1.3}}>{children}</h2>
    {sub&&<p style={{color:C.tDim,fontSize:13,margin:"6px 0 0",lineHeight:1.5}}>{sub}</p>}
  </div>);
}
function Stat({value,label,color=C.sage,small}){
  return(<div style={{textAlign:"center",flex:1}}>
    <div style={{color,fontSize:small?24:32,fontWeight:700,lineHeight:1}}>{value}</div>
    <div style={{color:C.tDim,fontSize:11,marginTop:4}}>{label}</div>
  </div>);
}
function Card({children,style}){
  return <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:20,...style}}>{children}</div>;
}

const SLIDES = ["hero","problem","solution","market","competition","model","projections","moat","ask"];

export default function PMA(){
  const[activeNav,setActiveNav]=useState(0);

  return(<div style={{background:C.bg,color:C.white,fontFamily:"'Inter',-apple-system,system-ui,sans-serif",minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>

    {/* ─── HERO ─── */}
    <Section id="hero">
      <div style={{textAlign:"center",paddingTop:40,paddingBottom:20}}>
        <div style={{fontSize:42,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>
          <span style={{color:C.sage}}>9B</span> <span style={{color:C.white}}>GrowOS</span>
        </div>
        <p style={{color:C.citrus,fontSize:15,fontWeight:600,margin:"8px 0 0",letterSpacing:"2px",textTransform:"uppercase"}}>
          Grow Smarter. Harvest More.
        </p>
        <p style={{color:C.tMid,fontSize:14,lineHeight:1.6,margin:"20px auto 0",maxWidth:340}}>
          The garden operating system that tells you exactly what to do every day — and learns from every harvest.
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
          {["WHOOP for gardens","Strava for growing","Apple Health for plants"].map((t,i)=>
            <span key={i} style={{fontSize:11,padding:"5px 12px",borderRadius:99,border:`1px solid ${C.sage}33`,color:C.sage}}>{t}</span>
          )}
        </div>
      </div>
    </Section>

    {/* ─── PROBLEM ─── */}
    <Section id="problem">
      <H2 sub="55% of US households garden. None have an operating system.">The Problem</H2>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[
          {icon:"📅",title:"Planners plan — then disappear",desc:"Seedtime and GrowVeg tell you what to plant in March. They go silent when a 103°F heat wave lands in July."},
          {icon:"📸",title:"ID apps identify — then nothing",desc:"PlantIn tells you it's a tomato. It can't tell you it has magnesium deficiency, or what to do about it."},
          {icon:"📝",title:"Data lives in notebooks",desc:"Serious growers track pH, feeding, and yield — in spreadsheets no app reads, with no feedback loop."},
          {icon:"🌡️",title:"National advice is wrong here",desc:"Zone 9b has year-round growing, extreme heat, and almost no frost. The Old Farmer's Almanac doesn't know."},
        ].map((p,i)=><Card key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:16}}>
          <span style={{fontSize:24,flexShrink:0}}>{p.icon}</span>
          <div><div style={{color:C.white,fontSize:13,fontWeight:600}}>{p.title}</div>
          <div style={{color:C.tDim,fontSize:12,lineHeight:1.5,marginTop:4}}>{p.desc}</div></div>
        </Card>)}
      </div>
    </Section>

    {/* ─── SOLUTION ─── */}
    <Section id="solution">
      <H2 sub="One daily score. One task list. One coach. It closes the loop.">The Solution</H2>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[
          {icon:"🎯",n:"Daily Health Score",d:"A 0–100 number for your garden. Open the app, know where you stand."},
          {icon:"✅",n:"Reactive Task Engine",d:"Weather-aware, crop-specific tasks that change when conditions change. Not a static calendar."},
          {icon:"📷",n:"AI Photo Diagnostics",d:"Snap a sick leaf → get the problem, confidence %, causes, and treatment steps."},
          {icon:"🤖",n:"Zone 9B AI Coach",d:"Conversational, context-aware. Knows your plants, your zone, your month, your weather."},
          {icon:"📊",n:"Prosumer Tracking",d:"Water, feed, pH/EC/PPM, harvest yield — data in, insights out, season over season."},
          {icon:"💧",n:"AI Irrigation Control",d:"Weather + ET → per-zone drip runtimes. Supervised or autonomous. 5 controllers built."},
        ].map((f,i)=><div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<5?`1px solid ${C.border}22`:"none"}}>
          <span style={{fontSize:20,flexShrink:0,marginTop:2}}>{f.icon}</span>
          <div><div style={{color:C.white,fontSize:13,fontWeight:600}}>{f.n}</div>
          <div style={{color:C.tDim,fontSize:12,lineHeight:1.5,marginTop:2}}>{f.d}</div></div>
        </div>)}
      </div>
    </Section>

    {/* ─── MARKET ─── */}
    <Section id="market">
      <H2 sub="Home gardening is a $52B market growing 12% annually.">Market Size</H2>
      <div style={{display:"flex",gap:12,marginBottom:24}}>
        <Stat value={<AnimNum n={52} pre="$" suf="B"/>} label="US Home Garden Market" color={C.sage}/>
        <Stat value={<AnimNum n={55} suf="%"/>} label="US households that garden" color={C.citrus}/>
        <Stat value={<AnimNum n={14} suf="%"/>} label="Software CAGR" color={C.fLt}/>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{color:C.white,fontSize:13,fontWeight:600,marginBottom:12}}>Why now</div>
        {["Grocery inflation (+25% since 2020) → grow-your-own is economic","'Food as medicine' movement → demand for pesticide-free, nutrient-dense","Climate volatility → old almanac advice failing → need real-time tools"].map((r,i)=>
          <div key={i} style={{color:C.tMid,fontSize:12,lineHeight:1.6,marginBottom:6,paddingLeft:12,borderLeft:`2px solid ${C.sage}44`}}>{r}</div>
        )}
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
          <div><div style={{color:C.sage,fontSize:11,fontWeight:600}}>TAM</div><div style={{color:C.white,fontSize:18,fontWeight:700}}>$1.2B</div><div style={{color:C.tDim,fontSize:10}}>Global garden software</div></div>
          <div style={{width:1,background:C.border}}/>
          <div><div style={{color:C.citrus,fontSize:11,fontWeight:600}}>SAM</div><div style={{color:C.white,fontSize:18,fontWeight:700}}>$30M</div><div style={{color:C.tDim,fontSize:10}}>Warm-zone US gardeners</div></div>
          <div style={{width:1,background:C.border}}/>
          <div><div style={{color:C.fLt,fontSize:11,fontWeight:600}}>SOM Y1</div><div style={{color:C.white,fontSize:18,fontWeight:700}}>$180K</div><div style={{color:C.tDim,fontSize:10}}>3K paid subs (9b only)</div></div>
        </div>
      </Card>
    </Section>

    {/* ─── COMPETITION ─── */}
    <Section id="competition">
      <H2 sub="Nobody owns the reactive, outcome-driven layer.">Competitive Landscape</H2>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[
          {n:"Seedtime",what:"Calendar + planner",gap:"Static — no weather reactivity, no diagnostics, no yield tracking",us:"We react daily; they plan seasonally"},
          {n:"GrowVeg",what:"Bed layout + rotation",gap:"Desktop-era, no AI, no daily loop",us:"Mobile-first daily habit vs. seasonal tool"},
          {n:"Planta",what:"Houseplant reminders",gap:"Indoor-only, generic, no food gardens",us:"Outdoor food production system"},
          {n:"PlantIn",what:"Plant ID via photo",gap:"Identifies species, no garden management",us:"We diagnose problems in context + act"},
          {n:"Rachio/B-hyve",what:"Smart irrigation",gap:"Waters zones, not plants — no crop intelligence",us:"We become the brain on their valves"},
        ].map((c,i)=><Card key={i} style={{padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{color:C.white,fontSize:13,fontWeight:700}}>{c.n}</span>
            <span style={{color:C.tDim,fontSize:10}}>{c.what}</span>
          </div>
          <div style={{color:C.danger,fontSize:11,marginBottom:4}}>Gap: {c.gap}</div>
          <div style={{color:C.sage,fontSize:11}}>Our edge: {c.us}</div>
        </Card>)}
      </div>
      <Card style={{marginTop:16,background:C.fMid+"12",borderColor:C.fMid+"33"}}>
        <div style={{color:C.sage,fontSize:13,fontWeight:700,marginBottom:6}}>The positioning</div>
        <div style={{color:C.tMid,fontSize:13,lineHeight:1.6,fontStyle:"italic"}}>
          "Seedtime plans your season. 9B GrowOS runs your garden."
        </div>
      </Card>
    </Section>

    {/* ─── BUSINESS MODEL ─── */}
    <Section id="model">
      <H2 sub="Freemium subscription. AI costs bounded by tier caps.">Business Model</H2>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        <Card style={{flex:1,textAlign:"center",padding:16}}>
          <div style={{color:C.tDim,fontSize:11,fontWeight:600}}>FREE</div>
          <div style={{color:C.white,fontSize:20,fontWeight:700,margin:"6px 0"}}>$0</div>
          <div style={{color:C.tDim,fontSize:10,lineHeight:1.4}}>2 beds · 10 plants<br/>5 AI diagnoses/mo<br/>Basic tasks + weather</div>
        </Card>
        <Card style={{flex:1,textAlign:"center",padding:16,borderColor:C.citrus+"55",background:C.citrus+"08"}}>
          <div style={{color:C.citrus,fontSize:11,fontWeight:600}}>PRO</div>
          <div style={{color:C.white,fontSize:20,fontWeight:700,margin:"6px 0"}}>$7.99<span style={{fontSize:12,color:C.tDim}}>/mo</span></div>
          <div style={{color:C.tDim,fontSize:10,lineHeight:1.4}}>Unlimited everything<br/>Full analytics + AI<br/>Irrigation control</div>
        </Card>
        <Card style={{flex:1,textAlign:"center",padding:16,borderColor:C.sage+"44"}}>
          <div style={{color:C.sage,fontSize:11,fontWeight:600}}>ANNUAL</div>
          <div style={{color:C.white,fontSize:20,fontWeight:700,margin:"6px 0"}}>$49.99<span style={{fontSize:12,color:C.tDim}}>/yr</span></div>
          <div style={{color:C.tDim,fontSize:10,lineHeight:1.4}}>Same as Pro<br/>48% savings<br/>Best LTV anchor</div>
        </Card>
      </div>
      <div style={{color:C.white,fontSize:13,fontWeight:600,marginBottom:10}}>Unit economics (at scale)</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[{l:"Gross margin",v:"~90%",c:C.sage},{l:"LTV (Pro Annual)",v:"$85",c:C.sage},{l:"CAC (blended)",v:"$8",c:C.citrus},{l:"LTV:CAC",v:"10:1",c:C.sage},{l:"AI cost/user/mo",v:"$0.35",c:C.tMid},{l:"Payback",v:"<2 mo",c:C.fLt}].map((s,i)=>
          <div key={i} style={{flex:"0 0 calc(33% - 8px)",textAlign:"center",padding:"10px 0"}}>
            <div style={{color:s.c,fontSize:16,fontWeight:700}}>{s.v}</div>
            <div style={{color:C.tDim,fontSize:10}}>{s.l}</div>
          </div>
        )}
      </div>
    </Section>

    {/* ─── PROJECTIONS ─── */}
    <Section id="projections">
      <H2 sub="Conservative: SoCal-only Year 1, multi-zone Year 2.">Revenue Projections</H2>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
        {[
          {yr:"Year 1",rev:"$180K",subs:"3K",dl:"100K",color:C.tMid,w:15},
          {yr:"Year 2",rev:"$950K",subs:"15K",dl:"400K",color:C.citrus,w:50},
          {yr:"Year 3",rev:"$3.3M",subs:"50K",dl:"1.2M",color:C.sage,w:100},
        ].map((y,i)=><div key={i}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{color:C.white,fontSize:13,fontWeight:600}}>{y.yr}</span>
            <span style={{color:y.color,fontSize:16,fontWeight:700}}>{y.rev}</span>
          </div>
          <div style={{height:8,borderRadius:99,background:C.border,marginBottom:4}}>
            <div style={{height:"100%",width:`${y.w}%`,borderRadius:99,background:y.color,transition:"width 1s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:C.tDim,fontSize:10}}>{y.subs} paid subs</span>
            <span style={{color:C.tDim,fontSize:10}}>{y.dl} downloads</span>
          </div>
        </div>)}
      </div>
      <Card style={{background:C.sage+"10",borderColor:C.sage+"33"}}>
        <div style={{color:C.sage,fontSize:13,fontWeight:600,marginBottom:4}}>Breakeven: Early Year 3</div>
        <div style={{color:C.tMid,fontSize:12,lineHeight:1.5}}>
          At ~35K paid subscribers. Total pre-seed funding need: $800K–$1.2M to profitability.
        </div>
      </Card>
    </Section>

    {/* ─── MOAT ─── */}
    <Section id="moat">
      <H2 sub="Four reinforcing advantages competitors can't replicate.">The Moat</H2>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[
          {icon:"🔄",n:"Closed Feedback Loop",d:"We track inputs (water, feed, pH) AND outputs (yield, quality). The coach learns what actually works per user, per microclimate. Data network effect."},
          {icon:"🌡️",n:"Reactive Intelligence",d:"Weather→tasks in real time. Built reactive-first, not bolted onto a calendar. Structural advantage over planners."},
          {icon:"💧",n:"Hardware Integration",d:"AI irrigation control for 5 controllers — already built. Once connected, switching cost is very high."},
          {icon:"🔥",n:"Daily Habit",d:"Health score + streak + tasks = WHOOP-level daily engagement. Planners are opened seasonally; we're opened every morning."},
        ].map((m,i)=><Card key={i} style={{padding:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:20}}>{m.icon}</span>
            <span style={{color:C.white,fontSize:14,fontWeight:700}}>{m.n}</span>
          </div>
          <div style={{color:C.tMid,fontSize:12,lineHeight:1.6}}>{m.d}</div>
        </Card>)}
      </div>
    </Section>

    {/* ─── ASK ─── */}
    <Section id="ask">
      <H2>The Ask</H2>
      <Card style={{textAlign:"center",padding:28,borderColor:C.citrus+"44",background:C.citrus+"06"}}>
        <div style={{color:C.citrus,fontSize:13,fontWeight:600,letterSpacing:1,marginBottom:8}}>PRE-SEED</div>
        <div style={{color:C.white,fontSize:36,fontWeight:800}}>$800K–$1.2M</div>
        <div style={{color:C.tMid,fontSize:13,marginTop:8,lineHeight:1.6}}>
          12 months runway to 100K downloads, 3K paid subs, D30 ≥ 35%, and irrigation integration live.
        </div>
      </Card>
      <div style={{marginTop:20}}>
        <div style={{color:C.white,fontSize:13,fontWeight:600,marginBottom:10}}>Use of funds</div>
        <Bar label="Engineering (3 FTE)" val={45} max={100} color={C.sage}/>
        <Bar label="Marketing & launch" val={15} max={100} color={C.citrus}/>
        <Bar label="Infrastructure + AI" val={12} max={100} color={C.fLt}/>
        <Bar label="Content & horticulture" val={10} max={100} color={C.sage}/>
        <Bar label="Design" val={10} max={100} color={C.tMid}/>
        <Bar label="Buffer" val={8} max={100} color={C.tDim}/>
      </div>
      <div style={{marginTop:20}}>
        <div style={{color:C.white,fontSize:13,fontWeight:600,marginBottom:10}}>What's already built</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {["Task engine","AI diagnostics","Irrigation (5 controllers)","Health score","Yield analytics","Coach","43-plant encyclopedia","8-pest guide","Companion matrix","Bed planner","Succession planner","12-mo calendar","Full UI prototype","Database schema + RLS","Bootstrap ready"].map((t,i)=>
            <span key={i} style={{fontSize:10,padding:"4px 10px",borderRadius:99,background:C.sage+"15",border:`1px solid ${C.sage}33`,color:C.sage}}>{t}</span>
          )}
        </div>
      </div>
    </Section>

    {/* ─── FOOTER ─── */}
    <div style={{textAlign:"center",padding:"40px 20px 60px"}}>
      <div style={{fontSize:28,fontWeight:800}}>
        <span style={{color:C.sage}}>9B</span> <span style={{color:C.white}}>GrowOS</span>
      </div>
      <p style={{color:C.citrus,fontSize:12,letterSpacing:2,margin:"8px 0 0",textTransform:"uppercase"}}>
        Grow Smarter. Harvest More.
      </p>
      <p style={{color:C.tDim,fontSize:11,marginTop:16}}>
        The garden already wants an operating system. We're building it.
      </p>
    </div>
  </div>);
}
