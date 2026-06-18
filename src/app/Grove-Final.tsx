import { useState, useEffect, useMemo } from "react";

var G={bg0:"#0B110E",bg1:"#111A15",bg2:"#172119",ln:"#243328",f1:"#1B4332",f2:"#2D6A4F",f3:"#40916C",s1:"#52796F",s2:"#74B89A",s3:"#95D5B2",s4:"#D8F3DC",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",red:"#D95B5B",warn:"#E8A840"};

function Leaf(p){var s=p.size||28;return <svg width={s} height={s} viewBox="0 0 100 100"><ellipse cx="40" cy="44" rx="21" ry="30" fill={G.s3} opacity=".88" transform="rotate(-15 40 44)"/><ellipse cx="58" cy="47" rx="17" ry="26" fill={G.f2} opacity=".8" transform="rotate(10 58 47)"/><line x1="50" y1="70" x2="50" y2="90" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round"/></svg>}

function Ring(p){var _a=useState(0),a=_a[0],setA=_a[1];useEffect(function(){var f,s;var t=function(ts){if(!s)s=ts;var pr=Math.min(1,(ts-s)/1200);setA((1-Math.pow(1-pr,3))*p.score);if(pr<1)f=requestAnimationFrame(t)};f=requestAnimationFrame(t);return function(){cancelAnimationFrame(f)}},[p.score]);var sz=150,r=66,cx=sz/2,cy=sz/2,ci=2*Math.PI*r,o=ci*(1-a/100);return <svg width={sz} height={sz} style={{filter:"drop-shadow(0 0 16px "+G.s3+"22)"}}><circle cx={cx} cy={cy} r={r} fill="none" stroke={G.ln} strokeWidth="8"/><circle cx={cx} cy={cy} r={r} fill="none" stroke={G.s3} strokeWidth="8" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={o} transform={"rotate(-90 "+cx+" "+cy+")"}/><text x={cx} y={cy-4} textAnchor="middle" fill={G.t1} fontSize="32" fontWeight="700">{Math.round(a)}</text><text x={cx} y={cy+14} textAnchor="middle" fill={G.t3} fontSize="9" fontWeight="600">GARDEN HEALTH</text></svg>}

function Chip(p){var c=p.color||G.s3;return <button onClick={p.onClick} style={{background:p.on?c+"18":"transparent",border:"1px solid "+(p.on?c+"66":G.ln),color:p.on?c:G.t3,borderRadius:99,padding:p.sm?"4px 10px":"5px 13px",fontSize:p.sm?10:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{p.children}</button>}
function Card(p){return <div onClick={p.onClick} style={Object.assign({background:G.bg1,borderRadius:14,border:"1px solid "+G.ln,padding:13,cursor:p.onClick?"pointer":"default"},p.style||{})}>{p.children}</div>}

var ZONES=["3a","3b","4a","4b","5a","5b","6a","6b","7a","7b","8a","8b","9a","9b","10a","10b","11a","11b","12a","12b","13a","13b"];
var SHAPES=[{id:"rect",n:"2\u00D78 Rectangle",w:8,h:2},{id:"square",n:"4\u00D74 Square",w:4,h:4},{id:"long",n:"1\u00D78 Narrow",w:8,h:1},{id:"wide",n:"4\u00D72 Wide",w:4,h:2},{id:"large",n:"3\u00D76 Large",w:6,h:3},{id:"container",n:"Container",w:3,h:3},{id:"lbed",n:"2\u00D74 Small",w:4,h:2},{id:"mega",n:"2\u00D710 Long",w:10,h:2}];

var P=[
{id:1,n:"Genovese Basil",e:"\u{1F33F}",cat:"herb",bed:"Bed 3",stg:"Vegetative",tip:"Pinch flowers immediately.",h:["Anti-inflammatory oils","Antibacterial eugenol","Vitamin K"],m:["Digestive aid (traditional)","Antibacterial (emerging)"],comp:["Tomato","Pepper"],avoid:["Sage","Rosemary"],cul:"Pesto, caprese, Thai",flav:"Sweet, peppery"},
{id:2,n:"Rosemary",e:"\u{1F331}",cat:"herb",bed:"Herb Bed",stg:"Perennial",tip:"Unkillable with drainage.",h:["Rosmarinic acid","Memory support","Antimicrobial"],m:["Memory (emerging)","Hair growth (emerging)","Anti-inflammatory (well-studied)"],comp:["Sage","Thyme","Lavender"],avoid:["Basil","Mint"],cul:"Roasted meats, focaccia",flav:"Piney, peppery"},
{id:3,n:"Cilantro",e:"\u{1F33F}",cat:"herb",bed:"Bed 10",stg:"Vegetative",tip:"Fall/winter only in 9b.",h:["Heavy-metal chelation","Vitamins A, C, K"],m:["Heavy metal detox (emerging)"],comp:["Tomato","Spinach"],avoid:["Fennel"],cul:"Salsa, guac, pho",flav:"Bright, citrusy"},
{id:4,n:"Thyme",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",tip:"Groundcover that deters slugs.",h:["Thymol antiseptic","Vitamin C","Iron"],m:["Respiratory (well-studied)","Antibacterial (well-studied)"],comp:["Rosemary","Strawberry"],avoid:["Basil"],cul:"Soups, roasted chicken",flav:"Earthy, floral"},
{id:5,n:"Oregano",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",tip:"Edible groundcover.",h:["Highest antioxidant herb","Carvacrol"],m:["Antimicrobial (well-studied)","Cold/flu oil (emerging)"],comp:["Tomato","Pepper"],avoid:["Mint"],cul:"Pizza, pasta",flav:"Warm, aromatic"},
{id:6,n:"Spearmint",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",tip:"ALWAYS container.",h:["Menthol digestion","Vitamin A"],m:["IBS relief (FDA)","Headache (well-studied)"],comp:[],avoid:["In-ground"],cul:"Mojitos, tea",flav:"Cool, refreshing"},
{id:7,n:"Lavender",e:"\u{1F49C}",cat:"herb",bed:"Border",stg:"Perennial",tip:"Spanish type for 9b heat.",h:["Linalool calming","Anti-inflammatory"],m:["Anxiety & sleep (well-studied)","Wound healing (emerging)"],comp:["Rosemary","Sage","Citrus"],avoid:["Mint"],cul:"Honey, shortbread",flav:"Floral, sweet"},
{id:8,n:"Sage",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",tip:"Drought-lover.",h:["Rosmarinic acid","Vitamin K"],m:["Memory Alzheimer's (well-studied)","Hot flashes (emerging)"],comp:["Rosemary","Thyme"],avoid:["Basil"],cul:"Brown butter pasta",flav:"Earthy"},
{id:9,n:"Parsley",e:"\u{1F33F}",cat:"herb",bed:"Bed 5",stg:"Vegetative",tip:"Highest vitamin K of any food.",h:["Extreme vitamin K","Vitamin C","Iron"],m:["Anti-cancer apigenin (emerging)"],comp:["Tomato","Carrot"],avoid:["Lettuce"],cul:"Tabbouleh, chimichurri",flav:"Fresh, peppery"},
{id:10,n:"Chives",e:"\u{1F33F}",cat:"herb",bed:"Edges",stg:"Perennial",tip:"Edible flowers. Deters aphids.",h:["Allicin","Vitamin K"],m:["Pest deterrent (well-studied)"],comp:["Carrot","Rose"],avoid:["Bean"],cul:"Potatoes, eggs",flav:"Mild onion"},
{id:11,n:"Lemongrass",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Vegetative",tip:"Store stalks root in water.",h:["Citral anti-inflammatory"],m:["Mosquito repellent (well-studied)"],comp:["Citrus"],avoid:[],cul:"Thai soups, tea",flav:"Bright citrus"},
{id:12,n:"Dill",e:"\u{1F33F}",cat:"herb",bed:"Bed 6",stg:"Flowering",tip:"Flowers attract beneficial wasps.",h:["Vitamin A & C"],m:["Digestive (traditional)"],comp:["Lettuce","Cucumber"],avoid:["Carrot","Tomato"],cul:"Pickles, salmon",flav:"Anise-like"},
{id:13,n:"Sungold Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 3",stg:"Fruiting",tip:"Shade cloth above 95F.",h:["Highest lycopene cherry","Vitamin C","Beta-carotene"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel","Kale"],cul:"Fresh, roasted",flav:"Intensely sweet"},
{id:14,n:"Cherokee Purple",e:"\u{1F345}",cat:"fruiting",bed:"Bed 2",stg:"Fruiting",tip:"Dark skin sunscalds \u2014 shade cloth.",h:["Anthocyanins","Lycopene"],m:["Higher antioxidant (emerging)"],comp:["Basil"],avoid:["Fennel"],cul:"Burgers, caprese",flav:"Smoky, umami"},
{id:15,n:"Shishito Pepper",e:"\u{1F336}",cat:"fruiting",bed:"Bed 4",stg:"Fruiting",tip:"Pick green. More you pick, more it gives.",h:["2x daily vitamin C","Capsaicin"],m:["Vitamin C (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Blistered, tempura",flav:"Mild, 1/10 spicy"},
{id:16,n:"Zucchini",e:"\u{1F952}",cat:"fruiting",bed:"Bed 5",stg:"Fruiting",tip:"Pick 6\u20138in. Check DAILY.",h:["Vitamin C","Potassium","Lutein"],m:["Blood sugar (emerging)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Spiralized, blossoms",flav:"Mild, sweet"},
{id:17,n:"Cucumber",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Fruiting",tip:"Trellis vertically.",h:["96% water","Vitamin K"],m:["Hydration (well-studied)"],comp:["Bean","Dill"],avoid:["Sage"],cul:"Pickles, tzatziki",flav:"Cool, crisp"},
{id:18,n:"Eggplant",e:"\u{1F346}",cat:"fruiting",bed:"Bed 8",stg:"Fruiting",tip:"Japanese Ichiban for 9b.",h:["Nasunin brain antioxidant"],m:["Brain health (emerging)"],comp:["Bean","Pepper"],avoid:["Fennel"],cul:"Baba ganoush",flav:"Creamy cooked"},
{id:19,n:"Romaine Lettuce",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",tip:"Cut-and-come-again.",h:["Vitamin K","Folate","95% water"],m:["Mild sedative (traditional)"],comp:["Carrot","Radish"],avoid:["Celery"],cul:"Caesar, wraps",flav:"Crisp, mild"},
{id:20,n:"Lacinato Kale",e:"\u{1F957}",cat:"brassica",bed:"Bed 9",stg:"Harvest",tip:"Sweetens after cool nights.",h:["7x daily vitamin K","Sulforaphane","Best plant calcium"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Garlic"],avoid:["Strawberry"],cul:"Chips, massaged salads",flav:"Nutty, sweet"},
{id:21,n:"Rainbow Chard",e:"\u{1F308}",cat:"leafy",bed:"Bed 12",stg:"Vegetative",tip:"Handles 9b summers.",h:["Very high vitamin K","Betalains"],m:["Blood sugar (emerging)"],comp:["Bean","Onion"],avoid:["Cucumber"],cul:"Saut\u00E9ed, bowls",flav:"Earthy"},
{id:22,n:"Spinach",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",tip:"Cool season only in 9b.",h:["Iron + C","Lutein","Nitrates"],m:["Eye health (well-studied)","Athletic (well-studied)"],comp:["Strawberry","Pea"],avoid:["Beet"],cul:"Salads, spanakopita",flav:"Mild, sweet"},
{id:23,n:"Nantes Carrot",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Vegetative",tip:"17in Vegos = perfect depth.",h:["Extreme beta-carotene","Lutein","Fiber"],m:["Eye health (well-studied)","Gut pectin (well-studied)"],comp:["Lettuce","Onion","Rosemary"],avoid:["Dill"],cul:"Raw, roasted, juicing",flav:"Sweet, coreless"},
{id:24,n:"Garlic",e:"\u{1F9C4}",cat:"allium",bed:"Bed 9",stg:"Vegetative",tip:"Plant Oct\u2013Nov. Stores 6+ months.",h:["Allicin","Heart health","Prebiotic"],m:["Cardiovascular (well-studied)","Immune cold -70% (well-studied)","Antimicrobial (well-studied)"],comp:["Tomato","Brassicas"],avoid:["Bean"],cul:"Everything",flav:"Raw=sharp, roasted=sweet"},
{id:25,n:"Meyer Lemon",e:"\u{1F34B}",cat:"citrus",bed:"Tree Row",stg:"Vegetative",tip:"Feed Feb/May/Aug.",h:["Very high vitamin C","Flavonoids","D-limonene"],m:["Immune (well-studied)","Digestive (traditional)"],comp:["Lavender","Nasturtium"],avoid:[],cul:"Juice, zest, curd",flav:"Sweet, floral"},
{id:26,n:"Navel Orange",e:"\u{1F34A}",cat:"citrus",bed:"Tree Row",stg:"Vegetative",tip:"Classic SoCal backyard.",h:["130% daily vitamin C","Hesperidin"],m:["Cardiovascular (well-studied)"],comp:["Lavender"],avoid:[],cul:"Fresh, juice",flav:"Sweet, balanced"},
{id:27,n:"Babcock Peach",e:"\u{1F351}",cat:"stone",bed:"Tree Row",stg:"Fruiting",tip:"Copper Dec+Jan for leaf curl.",h:["Chlorogenic acid","Vitamins A & C"],m:["Digestive (traditional)"],comp:["Garlic","Chives"],avoid:["Tomato"],cul:"Fresh, pies",flav:"Honey-sweet"},
{id:28,n:"Albion Strawberry",e:"\u{1F353}",cat:"berry",bed:"Bed 7",stg:"Fruiting",tip:"Crown above soil. Pinch first flowers.",h:["150% daily C","Anthocyanins","Heart-healthy"],m:["Anti-inflammatory (well-studied)","Cardiovascular (well-studied)"],comp:["Lettuce","Borage","Thyme"],avoid:["Brassicas"],cul:"Fresh, shortcake",flav:"Firm, sweet"},
{id:29,n:"Blueberry",e:"\u{1FAD0}",cat:"berry",bed:"Container",stg:"Fruiting",tip:"ACIDIC pH 4.5\u20135.5.",h:["Highest antioxidant fruit","Memory","Lowers BP"],m:["Brain health (well-studied)","Cardiovascular (well-studied)"],comp:["Other blueberries"],avoid:["Alkaline plants"],cul:"Fresh, smoothies",flav:"Sweet, tangy"},
{id:30,n:"Fig",e:"\u{1FAD2}",cat:"berry",bed:"Tree Row",stg:"Fruiting",tip:"Thrives on neglect. Two crops/yr.",h:["Highest fiber fruit","Best fruit calcium"],m:["Digestive (well-studied)"],comp:["Comfrey"],avoid:[],cul:"Fresh, jam, dried",flav:"Honey-sweet"},
{id:31,n:"Marigold",e:"\u{1F33C}",cat:"flower",bed:"Edges",stg:"Flowering",tip:"Living pest barrier.",h:["Lutein eye health","Nematode-suppressing"],m:["Eye lutein (well-studied)","Nematode (well-studied)"],comp:["Tomato","Everything"],avoid:[],cul:"Edible petals",flav:"Citrusy"},
{id:32,n:"Nasturtium",e:"\u{1F9E1}",cat:"flower",bed:"Edges",stg:"Flowering",tip:"Trap crop. All parts edible.",h:["Very high vitamin C","Glucosinolates"],m:["Antibiotic (emerging)"],comp:["Tomato","Cucumber"],avoid:[],cul:"Salads, pickled seeds",flav:"Peppery"},
{id:33,n:"Borage",e:"\u{1F499}",cat:"flower",bed:"Near berries",stg:"Flowering",tip:"Blue stars taste like cucumber.",h:["GLA anti-inflammatory"],m:["Skin eczema GLA (well-studied)"],comp:["Strawberry","Tomato"],avoid:[],cul:"Cocktails, ice cubes",flav:"Light cucumber"},
];

var PESTS=[{n:"Aphids",e:"\u{1F41B}",s:"Moderate",pk:"Spring/Fall",pl:"Kale, pepper, citrus",fix:"Water blast \u2192 soap \u2192 ladybugs",note:"Worst Mar\u2013May, Oct\u2013Nov."},{n:"Spider Mites",e:"\u{1F577}",s:"Serious",pk:"Summer",pl:"Strawberry, tomato",fix:"Blast undersides 2\u20133d. Soap evening.",note:"#1 summer pest. Start June."},{n:"Whitefly",e:"\u{1F99F}",s:"Moderate",pk:"Summer\u2013Fall",pl:"Tomato, pepper",fix:"Sticky traps + soap + neem.",note:"Transmits TYLCV."},{n:"Cabbage Worm",e:"\u{1F41B}",s:"Serious",pk:"Fall\u2013Spring",pl:"Kale, broccoli",fix:"BT spray. Row cover.",note:"Brassica tax."},{n:"Slugs",e:"\u{1F40C}",s:"Moderate",pk:"Winter\u2013Spring",pl:"Lettuce, strawberry",fix:"Iron phosphate. Copper tape.",note:"Copper on Vego rims."},{n:"Powdery Mildew",e:"\u{1F344}",s:"Moderate",pk:"Fall",pl:"Squash, cucumber",fix:"Potassium bicarbonate.",note:"Sep\u2013Oct on cucurbits."},{n:"Peach Leaf Curl",e:"\u{1F344}",s:"Serious",pk:"Spring",pl:"Peach, nectarine",fix:"Copper Dec + Jan only.",note:"Mark your calendar."}];

var CAL=[{m:1,i:["\u2702 Finish dormant pruning","\u{1F9EA} Copper spray leaf curl","\u{1F331} Start tomato seeds","\u{1F955} Harvest cool roots","\u{1F4CB} Order spring seeds"]},{m:2,i:["\u{1F345} Transplant tomatoes late Feb","\u{1F33F} First citrus feed","\u{1F331} Start peppers indoors","\u2702 Last pruning window","\u{1F9EA} Soil test beds"]},{m:3,i:["\u{1F331} Sow beans, squash, basil","\u{1F33C} Plant marigold borders","\u{1F33F} Feed at transplant","\u{1F41B} Scout aphids","\u{1F33B} Sow sunflowers"]},{m:4,i:["\u{1F331} Everything in ground","\u{1F33F} Low-N feed at flower","\u{1F4A7} Increase water","\u{1F353} Strawberries fruiting","\u{1F41B} Watch aphid buildup"]},{m:5,i:["\u{1F33F} Second citrus feed","\u{1F345} First tomatoes!","\u{1F351} Stone fruit growing","\u{1F4A7} Deep water trees","\u{1F99F} Watch whitefly"]},{m:6,i:["\u{1F345} Peak harvest!","\u{1F351} Stone fruit harvest","\u{1F4A7} Mulch everything","\u2600 Shade cloth up","\u{1F577} Mite season starts"]},{m:7,i:["\u{1F525} Heat management","\u{1F345} Keep harvesting","\u{1F577} Spider mite PEAK","\u{1F351} Peach & plum","\u{1FAD0} Last blueberries"]},{m:8,i:["\u{1F33F} Third citrus feed","\u{1F331} Fall tomato sow","\u{1F331} Start brassica seeds","\u{1F4A7} 2x daily containers","\u{1F525} Heat wave prep"]},{m:9,i:["\u{1F331} Transplant kale, chard","\u{1F955} Sow carrots, lettuce","\u{1F33F} Sow arugula, radish","\u{1F345} Pull spent summer","\u{1F33C} Fall marigolds"]},{m:10,i:["\u{1F353} Plant strawberries","\u{1F9C4} Plant garlic","\u{1F331} Cool-season greens","\u{1F957} Greens thriving","\u{1F33F} Feed fall crops"]},{m:11,i:["\u{1FAD0} Plant blueberries","\u{1F34B} Citrus begins!","\u{1F96C} Cool-season full","\u{1F331} Last lettuce sow","\u{1F342} Mulch beds"]},{m:12,i:["\u2702 Dormant pruning","\u{1F9EA} Copper spray","\u{1F34B} Peak citrus!","\u{1F96C} Harvest greens","\u{1F4CB} Plan next year"]}];

var TASKS=[{id:1,t:"Water Bed 7 \u2014 strawberries",c:"\u{1F4A7}",p:"urgent",d:false},{id:2,t:"Feed citrus \u2014 Aug window",c:"\u{1F33F}",p:"high",d:false},{id:3,t:"Check spider mites",c:"\u{1F41B}",p:"high",d:false},{id:4,t:"Harvest kale",c:"\u{1F96C}",p:"medium",d:false},{id:5,t:"Deep water lemon",c:"\u{1F4A7}",p:"medium",d:false},{id:6,t:"Shade cloth (103\u00B0F Fri)",c:"\u2600",p:"high",d:false},{id:7,t:"Recheck pH Bed 7",c:"\u{1F9EA}",p:"medium",d:false}];
var FC=[{d:"Today",h:94,i:"\u2600\uFE0F"},{d:"Thu",h:99,i:"\u{1F525}"},{d:"Fri",h:103,i:"\u{1F525}"},{d:"Sat",h:97,i:"\u2600\uFE0F"},{d:"Sun",h:90,i:"\u26C5"},{d:"Mon",h:88,i:"\u26C5"}];
var COACH={"What should I plant now?":"August in 9b: start brassica seeds for Sep. Direct-sow late bush beans. Wait on lettuce until nights < 75\u00B0F.","When to fertilize citrus?":"Now! August = final feed (Feb/May/Aug). High-N citrus formula with iron, zinc, manganese.","What to plant after tomatoes?":"Rotate families. Bush beans or Sep sow kale, carrots, lettuce. Never follow with peppers.","How to fix spider mites?":"Blast undersides 2\u20133 days. Soap evening. Serious: predatory mites. Prevention: mist foliage.","Most medicinal plants?":"Rosemary (memory), Garlic (heart, immune), Sage (memory), Lavender (sleep), Mint (IBS). Blueberry = brain."};
var PAIRS={"Tomato+Basil":"great","Tomato+Marigold":"great","Tomato+Carrot":"good","Tomato+Fennel":"bad","Basil+Pepper":"great","Basil+Sage":"bad","Lettuce+Carrot":"great","Kale+Garlic":"great","Kale+Strawberry":"bad","Carrot+Rosemary":"great","Carrot+Dill":"bad","Strawberry+Borage":"great","Bean+Corn":"great","Bean+Onion":"bad","Rosemary+Sage":"great","Rosemary+Mint":"bad","Cucumber+Bean":"great","Cucumber+Sage":"bad","Garlic+Tomato":"great","Nasturtium+Squash":"great","Pepper+Fennel":"bad","Marigold+Pepper":"great"};
var CL=Object.keys(PAIRS).join("+").split("+").filter(function(v,i,a){return a.indexOf(v)===i}).sort();
function ckp(a,b){return PAIRS[a+"+"+b]||PAIRS[b+"+"+a]||null}
var MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var PC={urgent:G.red,high:G.c2,medium:G.s3,low:G.t4};
var CATS={all:"All",herb:"Herbs",fruiting:"Fruiting",leafy:"Leafy",brassica:"Brassica",root:"Root",allium:"Allium",citrus:"Citrus",stone:"Stone",berry:"Berry",flower:"Flower"};
var SYM=["Yellowing","Curling","Brown spots","Holes","Webbing","Sticky","White powder","Wilting"];
var DDB={"yellow":{p:"Magnesium Deficiency",c:74,a:["Epsom salt 1 tbsp/gal AM","Let top inch dry","Recheck 7 days"]},"curl":{p:"Heat Stress",c:68,a:["Deep water evening","Shade cloth 30%","Mulch 3\u20134in"]},"hole":{p:"Cabbage Worm",c:82,a:["BT spray","Hand-pick AM","Row cover"]},"web":{p:"Spider Mites",c:85,a:["Blast undersides 2\u20133d","Soap evening","Predatory mites"]},"stick":{p:"Aphids",c:79,a:["Water blast","Ladybugs dusk","Control ants"]},"powder":{p:"Powdery Mildew",c:88,a:["Potassium bicarb weekly","Remove leaves","Airflow"]},"brown":{p:"Bacterial Spot",c:61,a:["Remove leaves","Switch to drip","Copper spray"]},"wilt":{p:"Root Stress",c:65,a:["Deep soak now","Check 4in depth","Add mulch"]}};
var PP=[{e:"\u{1F345}",n:"Tomato",s:4},{e:"\u{1F336}",n:"Pepper",s:2},{e:"\u{1F952}",n:"Zucchini",s:4},{e:"\u{1F96C}",n:"Lettuce",s:1},{e:"\u{1F957}",n:"Kale",s:2},{e:"\u{1F955}",n:"Carrot",s:1},{e:"\u{1F33F}",n:"Basil",s:1},{e:"\u{1F353}",n:"Strawberry",s:1},{e:"\u{1F33C}",n:"Marigold",s:1},{e:"\u{1F9E1}",n:"Nasturtium",s:1},{e:"\u{1F7E3}",n:"Beet",s:1},{e:"\u{1F534}",n:"Radish",s:1},{e:"\u{1F346}",n:"Eggplant",s:4},{e:"\u{1F952}",n:"Cucumber",s:2},{e:"\u{1F33F}",n:"Cilantro",s:1},{e:"\u{1F9C5}",n:"Onion",s:1},{e:"\u{1F33F}",n:"Dill",s:1},{e:"\u{1F96C}",n:"Spinach",s:1},{e:"\u{1F33F}",n:"Arugula",s:1},{e:"\u{1F308}",n:"Chard",s:1},{e:"\u{1F33F}",n:"Thyme",s:1},{e:"\u{1F33F}",n:"Oregano",s:1},{e:"\u{1F33F}",n:"Parsley",s:1},{e:"\u{1F33B}",n:"Sunflower",s:4},{e:"\u{1F499}",n:"Borage",s:1},{e:"\u{1F9C4}",n:"Garlic",s:1}];

export default function Grove(){
  var st=function(init){return useState(init)};
  var _t=st("home"),tab=_t[0],setTab=_t[1]; var _tk=st(TASKS),tasks=_tk[0],setTasks=_tk[1];
  var _s=st(null),sel=_s[0],setSel=_s[1]; var _sb=st("plants"),sub=_sb[0],setSub=_sb[1];
  var _f=st("all"),fil=_f[0],setFil=_f[1]; var _ca=st(""),compA=_ca[0],setCA=_ca[1];
  var _cb=st(""),compB=_cb[0],setCB=_cb[1]; var _cq=st(null),cQ=_cq[0],setCQ=_cq[1];
  var _cx=st(""),cTx=_cx[0],setCTx=_cx[1]; var _ty=st(false),typing=_ty[0],setTyping=_ty[1];
  var _md=st(false),med=_md[0],setMed=_md[1]; var _cm=st(8),calM=_cm[0],setCalM=_cm[1];
  var _sr=st(""),srch=_sr[0],setSrch=_sr[1];
  var _dm=st(null),dM=_dm[0],setDM=_dm[1]; var _dp=st(""),dP=_dp[0],setDP=_dp[1];
  var _ds=st(""),dS=_ds[0],setDS=_ds[1]; var _dr=st(null),dR=_dr[0],setDR=_dr[1];
  var _dph=st(null),dPh=_dph[0],setDPh=_dph[1];
  var _eb=st(null),eB=_eb[0],setEB=_eb[1]; var _pl=st(null),pal=_pl[0],setPal=_pl[1];
  var _gr=st(function(){var o={};for(var i=0;i<14;i++)o[i]=Array(16).fill(null);return o}),grids=_gr[0],setGrids=_gr[1];
  var _z=st("9b"),zone=_z[0],setZone=_z[1]; var _set=st(false),showSet=_set[0],setShowSet=_set[1];
  var _lg=st(null),logM=_lg[0],setLogM=_lg[1]; // 'water'|'feed'|'ph'
  var _ph=st([{d:"Jul 10",inp:6.4,run:6.2},{d:"Jul 14",inp:6.5,run:5.9},{d:"Jul 18",inp:6.3,run:6.1}]),phLogs=_ph[0],setPhLogs=_ph[1];
  var _cp=st(false),showAdd=_cp[0],setShowAdd=_cp[1];
  var _cpn=st(""),cpName=_cpn[0],setCpn=_cpn[1]; var _cpe=st("\u{1F331}"),cpEmoji=_cpe[0],setCpe=_cpe[1];
  var _cps=st([]),customP=_cps[0],setCustomP=_cps[1];
  var _bs=st({}),bedShapes=_bs[0],setBedShapes=_bs[1];

  var allP=P.concat(customP);
  var score=Math.round((tasks.filter(function(t){return t.d}).length/tasks.length)*20+71);
  var ask=function(q){setDM(null);setCQ(q);setTyping(true);setCTx("");var a=COACH[q]||"Tell me more.";var i=0;var iv=setInterval(function(){i+=3;if(i>=a.length){setCTx(a);setTyping(false);clearInterval(iv)}else setCTx(a.slice(0,i))},12)};
  var diag=function(){setDM("load");setTimeout(function(){var k=Object.keys(DDB).find(function(k){return dS.toLowerCase().indexOf(k)>=0})||"yellow";setDR(DDB[k]);setDM("result")},1800)};
  var place=function(bi,ci){if(!pal)return;setGrids(function(g){var ng=Object.assign({},g);var a=g[bi].slice();if(a[ci]&&a[ci].n===pal.n)a[ci]=null;else for(var j=ci;j<Math.min(ci+pal.s,16);j++)a[j]=Object.assign({},pal);ng[bi]=a;return ng})};
  var bW=function(bi){var ns=[];grids[bi].forEach(function(c){if(c&&ns.indexOf(c.n)<0)ns.push(c.n)});var b=[];for(var i=0;i<ns.length;i++)for(var j=i+1;j<ns.length;j++)if(ckp(ns[i],ns[j])==="bad")b.push(ns[i]+" + "+ns[j]);return b};
  var filt=useMemo(function(){if(srch){var q=srch.toLowerCase();return allP.filter(function(p){return p.n.toLowerCase().indexOf(q)>=0||p.h.some(function(x){return x.toLowerCase().indexOf(q)>=0})})}return fil==="all"?allP:allP.filter(function(p){return p.cat===fil})},[fil,srch,customP]);
  var inp={background:G.bg0,color:G.t1,border:"1px solid "+G.ln,borderRadius:10,padding:"8px 12px",fontSize:12,width:"100%",boxSizing:"border-box"};

  return <div style={{background:G.bg0,color:G.t1,fontFamily:"-apple-system,Inter,system-ui,sans-serif",minHeight:"100vh",maxWidth:430,margin:"0 auto"}}>
    {/* HEADER */}
    <div style={{padding:"11px 16px 9px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+G.ln}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}><Leaf size={24}/><span style={{fontSize:16,fontWeight:700}}>grove</span></div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:9,color:G.s2,fontWeight:600,border:"1px solid "+G.s2+"44",borderRadius:99,padding:"2px 8px"}}>{zone.toUpperCase()}</span>
        <span style={{fontSize:13}}>{FC[0].i}</span><span style={{fontSize:12,fontWeight:600}}>{FC[0].h+"\u00B0"}</span>
        <button onClick={function(){setShowSet(!showSet)}} style={{background:"none",border:"none",color:G.t3,fontSize:16,cursor:"pointer"}}>{"\u2699"}</button>
      </div>
    </div>

    {/* SETTINGS PANEL */}
    {showSet&&<div style={{padding:"12px 16px",borderBottom:"1px solid "+G.ln,background:G.bg2}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Settings</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{color:G.t3,fontSize:11}}>Zone:</span><select value={zone} onChange={function(e){setZone(e.target.value)}} style={Object.assign({},inp,{width:"auto",flex:1})}>{ZONES.map(function(z){return <option key={z} value={z}>{z.toUpperCase()}</option>})}</select></div>
      <div style={{color:G.t4,fontSize:10}}>Calendar & coach adapt to your zone. Currently optimized for 9b.</div>
    </div>}

    {/* QUICK LOG MODAL */}
    {logM&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.7)",zIndex:99,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(){setLogM(null)}}>
      <div onClick={function(e){e.stopPropagation()}} style={{background:G.bg2,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>{logM==="water"?"\u{1F4A7} Log Watering":logM==="feed"?"\u{1F33F} Log Feeding":"\u{1F9EA} Log pH/EC"}</div>
        {logM==="ph"?<div>
          <div style={{display:"flex",gap:8,marginBottom:8}}><div style={{flex:1}}><div style={{color:G.t3,fontSize:10,marginBottom:4}}>Input pH</div><input placeholder="6.5" style={inp}/></div><div style={{flex:1}}><div style={{color:G.t3,fontSize:10,marginBottom:4}}>Runoff pH</div><input placeholder="6.2" style={inp}/></div></div>
          <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><div style={{color:G.t3,fontSize:10,marginBottom:4}}>EC (mS/cm)</div><input placeholder="1.8" style={inp}/></div><div style={{flex:1}}><div style={{color:G.t3,fontSize:10,marginBottom:4}}>PPM</div><input placeholder="900" style={inp}/></div></div>
        </div>:<div style={{marginBottom:12}}>
          <div style={{color:G.t3,fontSize:10,marginBottom:4}}>{logM==="water"?"Amount":"Product"}</div>
          <input placeholder={logM==="water"?"2 gallons":"Fish emulsion 5-1-1"} style={inp}/>
        </div>}
        <div style={{color:G.t3,fontSize:10,marginBottom:4}}>Bed / Plant</div>
        <select style={Object.assign({},inp,{marginBottom:12})}><option>All beds</option>{Array.from({length:14},function(_,i){return <option key={i}>{"Bed "+(i+1)}</option>})}</select>
        <button onClick={function(){setLogM(null)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:10,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Log it</button>
      </div>
    </div>}

    <div style={{padding:"12px 14px 90px",overflow:"auto"}}>

    {/* HOME */}
    {tab==="home"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,paddingTop:4}}>
        <Ring score={score}/>
        <div><div style={{color:G.c2,fontSize:22,fontWeight:700}}>12</div><div style={{color:G.t4,fontSize:9}}>DAY STREAK</div><div style={{color:G.s3,fontSize:12,fontWeight:600,marginTop:4}}>{score>=80?"Thriving":"Good"}</div></div>
      </div>
      {/* Quick log buttons */}
      <div style={{display:"flex",gap:6}}>{[{l:"Water",i:"\u{1F4A7}",k:"water"},{l:"Feed",i:"\u{1F33F}",k:"feed"},{l:"pH/EC",i:"\u{1F9EA}",k:"ph"},{l:"Harvest",i:"\u{1F345}",k:"harvest"}].map(function(b){return <Card key={b.k} onClick={function(){setLogM(b.k==="harvest"?null:b.k)}} style={{flex:1,textAlign:"center",padding:"8px 4px",borderColor:G.f2+"33"}}><div style={{fontSize:16}}>{b.i}</div><div style={{color:G.t3,fontSize:9,marginTop:2}}>{b.l}</div></Card>})}</div>
      {/* Weather alert */}
      <Card style={{borderColor:G.warn+"33",background:G.warn+"06",padding:10}}><div style={{color:G.warn,fontSize:11,fontWeight:600}}>Heat wave Thu\u2013Fri</div><div style={{color:G.t2,fontSize:10}}>Extra evening water full-sun beds.</div></Card>
      {/* Forecast */}
      <div style={{display:"flex",gap:4,overflow:"auto"}}>{FC.map(function(d,i){return <div key={i} style={{textAlign:"center",padding:"5px 7px",borderRadius:10,minWidth:44,background:i===0?G.f2+"22":"transparent",border:"1px solid "+(i===0?G.f2+"55":G.ln)}}><div style={{fontSize:9,color:G.t4}}>{d.d}</div><div style={{fontSize:15,margin:"2px 0"}}>{d.i}</div><div style={{fontSize:12,color:d.h>=95?G.c2:G.t1,fontWeight:600}}>{d.h+"\u00B0"}</div></div>})}</div>
      {/* Irrigation */}
      <Card style={{borderColor:G.f2+"33",background:G.f2+"08",padding:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:G.s3,fontSize:11,fontWeight:600}}>{"\u{1F4A7}"} Irrigation Controller</div><div style={{color:G.t3,fontSize:10}}>Rachio \u00B7 2 zones \u00B7 connected</div></div><div style={{background:G.s3+"22",borderRadius:99,padding:"3px 10px"}}><span style={{color:G.s3,fontSize:10,fontWeight:600}}>{"\u2022"} Online</span></div></div>
        <div style={{display:"flex",gap:6,marginTop:8}}><div style={{flex:1,background:G.bg0,borderRadius:8,padding:"5px 7px"}}><div style={{color:G.t3,fontSize:9}}>Zone 1 (1\u20137)</div><div style={{color:G.t1,fontSize:10,fontWeight:600}}>19:00 \u00B7 22 min</div></div><div style={{flex:1,background:G.bg0,borderRadius:8,padding:"5px 7px"}}><div style={{color:G.t3,fontSize:9}}>Zone 2 (8\u201314)</div><div style={{color:G.t1,fontSize:10,fontWeight:600}}>19:25 \u00B7 18 min</div></div></div>
        <div style={{color:G.t4,fontSize:9,marginTop:8}}>Supported: Rachio \u00B7 Orbit B-hyve \u00B7 RainMachine \u00B7 OpenSprinkler \u00B7 Netro</div>
      </Card>
      {/* pH mini */}
      <Card style={{padding:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>{"\u{1F9EA}"} pH Trend</span><button onClick={function(){setLogM("ph")}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:8,color:G.s3,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>+ Log</button></div>
        <div style={{display:"flex",gap:4,alignItems:"flex-end",height:40}}>{phLogs.map(function(l,i){var h=Math.max(10,((l.run-5)*40));return <div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:h,background:l.run>=5.8&&l.run<=6.8?G.s3+"44":G.warn+"44",borderRadius:4,marginBottom:2}}/><div style={{color:G.t4,fontSize:8}}>{l.run}</div></div>})}</div>
      </Card>
      {/* Tasks */}
      <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Today</span><span style={{color:G.t4,fontSize:10}}>{tasks.filter(function(t){return t.d}).length}/{tasks.length}</span></div>
      {tasks.map(function(t){return <Card key={t.id} onClick={function(){setTasks(function(ts){return ts.map(function(x){return x.id===t.id?Object.assign({},x,{d:!x.d}):x})})}} style={{opacity:t.d?0.35:1,borderColor:t.d?G.ln:PC[t.p]+"33",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:4}}>
        <div style={{width:18,height:18,borderRadius:99,border:"2px solid "+(t.d?G.s3:PC[t.p]),background:t.d?G.s3:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.d&&<span style={{color:G.bg0,fontSize:10,fontWeight:700}}>{"\u2713"}</span>}</div>
        <div><div style={{color:t.d?G.t4:G.t1,fontSize:11,textDecoration:t.d?"line-through":"none"}}>{t.c+" "+t.t}</div></div>
      </Card>})}</div>
      <div style={{display:"flex",gap:6}}>{[{l:"Plants",v:allP.length,i:"\u{1F331}"},{l:"Harvests",v:38,i:"\u{1F345}"},{l:"Beds",v:14,i:"\u{1F3D7}"}].map(function(s,i){return <Card key={i} style={{flex:1,textAlign:"center",padding:"7px 4px"}}><div style={{fontSize:14}}>{s.i}</div><div style={{fontSize:14,fontWeight:700,marginTop:1}}>{s.v}</div><div style={{color:G.t4,fontSize:8}}>{s.l}</div></Card>})}</div>
    </div>}

    {/* GARDEN */}
    {tab==="garden"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {eB!==null?<div>
        <button onClick={function(){setEB(null);setPal(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:6}}>{"\u2190 All beds"}</button>
        <div style={{fontSize:14,fontWeight:600}}>{"Bed "+(eB+1)} <span style={{color:G.t3,fontSize:11,fontWeight:400}}>{(bedShapes[eB]||SHAPES[0]).n+" \u00B7 "+(eB<9?"\u2600 full":"\u26C5 shade")}</span></div>
        {/* Shape picker */}
        <div style={{display:"flex",gap:4,margin:"6px 0"}}>{SHAPES.map(function(sh){var cur=bedShapes[eB]||SHAPES[0];return <Chip key={sh.id} on={cur.id===sh.id} color={G.f3} onClick={function(){var ns=Object.assign({},bedShapes);ns[eB]=sh;setBedShapes(ns)}} sm>{sh.n}</Chip>})}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat("+((bedShapes[eB]||SHAPES[0]).w)+",1fr)",gap:3,marginBottom:8}}>{grids[eB].slice(0,(bedShapes[eB]||SHAPES[0]).w*(bedShapes[eB]||SHAPES[0]).h).map(function(c,ci){return <div key={ci} onClick={function(){place(eB,ci)}} style={{aspectRatio:"1",borderRadius:7,border:"1.5px solid "+(c?G.s3+"44":pal?G.c2+"33":G.ln),background:c?G.f2+"15":pal?G.c2+"06":G.bg2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:c?16:10,cursor:"pointer"}}>{c?c.e:""}</div>})}</div>
        {bW(eB).length>0&&<Card style={{borderColor:G.red+"33",background:G.red+"06",padding:7,marginBottom:6}}><div style={{color:G.red,fontSize:10,fontWeight:600}}>{"\u26A0 Conflicts"}</div>{bW(eB).map(function(w,i){return <div key={i} style={{color:G.t2,fontSize:10}}>{"\u274C "+w}</div>})}</Card>}
        <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{pal?"Tap cells for "+pal.e+" "+pal.n:"Select plant:"}</div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{PP.map(function(p,i){return <button key={i} onClick={function(){setPal(pal&&pal.n===p.n?null:p)}} style={{background:pal&&pal.n===p.n?G.c2+"18":"transparent",border:"1px solid "+(pal&&pal.n===p.n?G.c2+"55":G.ln),borderRadius:8,padding:"3px 7px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{p.e}</span>{p.n}</button>})}</div>
      </div>:<>
        <div style={{fontSize:14,fontWeight:600}}>14 Vego Beds \u00B7 Pearl White</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{Array.from({length:14},function(_,i){
          var f=grids[i].filter(Boolean).length;var planted=[];grids[i].forEach(function(c){if(c&&planted.indexOf(c.e)<0)planted.push(c.e)});
          return <Card key={i} onClick={function(){setEB(i)}} style={{padding:"7px 9px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{"Bed "+(i+1)}</span><span style={{fontSize:8,color:G.t4}}>{f?f+"/16":"empty"}</span></div>
            <div style={{fontSize:9,color:G.t3,marginTop:1}}>{(bedShapes[i]||SHAPES[0]).n+" \u00B7 "+(i<9?"\u2600":"\u26C5")}</div>
            <div style={{marginTop:3,display:"flex",gap:2}}>{planted.map(function(e,j){return <span key={j} style={{fontSize:13}}>{e}</span>})}{!f&&<span style={{fontSize:9,color:G.s2}}>+ tap to plan</span>}</div>
          </Card>})}</div>
        <div style={{fontSize:12,fontWeight:600,marginTop:4}}>Trees & Containers</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{allP.filter(function(p){return p.bed.indexOf("Bed")!==0}).map(function(p){return <Card key={p.id} onClick={function(){setSel(p);setTab("library")}} style={{padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{p.e}</span><div><div style={{fontSize:10,fontWeight:500}}>{p.n}</div><div style={{color:G.t4,fontSize:8}}>{p.bed}</div></div></Card>})}</div>
      </>}
    </div>}

    {/* LIBRARY */}
    {tab==="library"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {sel?<div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={function(){setSel(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 Back"}</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:34}}>{sel.e}</span><div><div style={{fontSize:15,fontWeight:700}}>{sel.n}</div><div style={{color:G.t3,fontSize:11}}>{sel.bed+" \u00B7 "+sel.stg}</div></div></div>
        <Card style={{background:G.f2+"10",borderColor:G.f2+"22",padding:10}}><div style={{color:G.s3,fontSize:10,fontWeight:600,marginBottom:3}}>9B TIP</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{sel.tip}</div></Card>
        <div style={{display:"flex",gap:5}}><Chip on={!med} color={G.s3} onClick={function(){setMed(false)}}>Health</Chip><Chip on={med} color={G.c2} onClick={function(){setMed(true)}}>Medicinal</Chip></div>
        <Card>{(med?sel.m:sel.h).map(function(x,i,a){return <div key={i} style={{display:"flex",gap:5,marginBottom:i<a.length-1?6:0}}><span style={{color:med?G.c2:G.s3,fontSize:11}}>{med?"\u2695":"+"}</span><span style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{x}</span></div>})}</Card>
        <Card><div style={{fontSize:11,fontWeight:600,marginBottom:3}}>Culinary</div><div style={{color:G.t2,fontSize:11}}>{sel.cul}</div><div style={{color:G.t3,fontSize:10,marginTop:3}}>{sel.flav}</div></Card>
        <div style={{fontSize:12,fontWeight:600}}>Companions</div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{sel.comp.map(function(c,i){return <Chip key={i} color={G.s3} on sm>{"\u2705 "+c}</Chip>})}{sel.avoid.map(function(c,i){return <Chip key={i} color={G.red} on sm>{"\u274C "+c}</Chip>})}</div>
      </div>:<>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Chip on={sub==="plants"} color={G.s3} onClick={function(){setSub("plants")}}>{"Plants ("+allP.length+")"}</Chip><Chip on={sub==="pests"} color={G.c2} onClick={function(){setSub("pests")}}>Pests</Chip><Chip on={sub==="comp"} color={G.f3} onClick={function(){setSub("comp")}}>Match</Chip><Chip on={sub==="ph"} color={G.warn} onClick={function(){setSub("ph")}}>pH/EC</Chip></div>
        {sub==="plants"&&<>
          <div style={{display:"flex",gap:6}}><input value={srch} onChange={function(e){setSrch(e.target.value)}} placeholder="Search plants, benefits..." style={Object.assign({},inp,{flex:1})}/><button onClick={function(){setShowAdd(true)}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:"0 14px",fontSize:18,cursor:"pointer",flexShrink:0}}>+</button></div>
          {showAdd&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>Add Custom Plant</div><div style={{display:"flex",gap:6,marginBottom:6}}><input value={cpEmoji} onChange={function(e){setCpe(e.target.value)}} style={Object.assign({},inp,{width:50,textAlign:"center",flex:"none"})}/><input value={cpName} onChange={function(e){setCpn(e.target.value)}} placeholder="Plant name" style={inp}/></div><select style={Object.assign({},inp,{marginBottom:6})} id="cpcat"><option value="herb">Herb</option><option value="fruiting">Fruiting</option><option value="leafy">Leafy</option><option value="root">Root</option><option value="flower">Flower</option><option value="berry">Berry</option><option value="citrus">Citrus</option></select><div style={{display:"flex",gap:6}}><button onClick={function(){if(cpName){setCustomP(function(c){return c.concat([{id:100+c.length,n:cpName,e:cpEmoji,cat:document.getElementById("cpcat").value,bed:"Custom",stg:"New",tip:"Custom plant",h:["User-added plant"],m:["No data yet"],comp:[],avoid:[],cul:"",flav:""}])});setCpn("");setShowAdd(false)}}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"8px 0",flex:1,fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button><button onClick={function(){setShowAdd(false)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,padding:"8px 0",flex:1,fontSize:12,color:G.t3,cursor:"pointer"}}>Cancel</button></div></Card>}
          <div style={{display:"flex",gap:3,overflow:"auto"}}>{Object.keys(CATS).map(function(c){return <Chip key={c} on={fil===c&&!srch} color={G.s3} onClick={function(){setFil(c);setSrch("")}} sm>{CATS[c]}</Chip>})}</div>
          {filt.map(function(p){return <Card key={p.id} onClick={function(){setSel(p);setMed(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:3}}>
            <span style={{fontSize:20}}>{p.e}</span>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600}}>{p.n}</div><div style={{color:G.t4,fontSize:9}}>{p.bed}</div><div style={{color:G.s1,fontSize:9,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.h[0]}</div></div>
            <span style={{color:G.t4}}>{"\u203A"}</span>
          </Card>})}
        </>}
        {sub==="pests"&&PESTS.map(function(p,i){return <Card key={i} style={{marginBottom:4,padding:10}}>
          <div style={{display:"flex",gap:6,marginBottom:4}}><span style={{fontSize:16}}>{p.e}</span><div><div style={{fontSize:12,fontWeight:600}}>{p.n}</div><div style={{color:G.t4,fontSize:9}}>{p.s+" \u00B7 "+p.pk}</div></div></div>
          <div style={{color:G.t2,fontSize:10,marginBottom:2}}>{"Affects: "+p.pl}</div>
          <div style={{color:G.s3,fontSize:10,fontWeight:600}}>Treatment</div><div style={{color:G.t2,fontSize:10}}>{p.fix}</div>
          <div style={{background:G.f2+"0C",borderRadius:7,padding:"4px 8px",marginTop:4}}><div style={{color:G.s2,fontSize:9,fontWeight:600}}>9B</div><div style={{color:G.t2,fontSize:10}}>{p.note}</div></div>
        </Card>})}
        {sub==="comp"&&<Card><div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Companion Checker</div><div style={{display:"flex",gap:5,alignItems:"center"}}><select value={compA} onChange={function(e){setCA(e.target.value)}} style={Object.assign({},inp,{flex:1,width:"auto"})}><option value="">Plant A</option>{CL.map(function(p){return <option key={p}>{p}</option>})}</select><span style={{color:G.t4}}>+</span><select value={compB} onChange={function(e){setCB(e.target.value)}} style={Object.assign({},inp,{flex:1,width:"auto"})}><option value="">Plant B</option>{CL.map(function(p){return <option key={p}>{p}</option>})}</select></div>{compA&&compB&&(function(){var r=ckp(compA,compB);var cl=r==="great"?G.s3:r==="bad"?G.red:G.t4;return <div style={{marginTop:8,padding:"8px 10px",borderRadius:9,background:cl+"12",border:"1px solid "+cl+"33",color:cl,fontSize:12,fontWeight:600}}>{r==="great"?"Great together!":r==="bad"?"Avoid this combo":"Likely neutral"}</div>})()}</Card>}
        {sub==="ph"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:600}}>pH/EC Log</span><button onClick={function(){setLogM("ph")}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Log Reading</button></div>
          <Card><div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Recent Readings</div>{phLogs.map(function(l,i){var ok=l.run>=5.8&&l.run<=6.8;return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:6,borderBottom:i<phLogs.length-1?"1px solid "+G.ln+"44":"none"}}><span style={{color:G.t3,fontSize:10}}>{l.d}</span><div style={{display:"flex",gap:12}}><span style={{fontSize:10,color:G.t2}}>{"In: "+l.inp}</span><span style={{fontSize:10,color:ok?G.s3:G.warn,fontWeight:600}}>{"Run: "+l.run}</span></div><span style={{fontSize:10,color:ok?G.s3:G.warn}}>{ok?"\u2705":"\u26A0"}</span></div>})}</Card>
          <Card><div style={{fontSize:11,fontWeight:600,marginBottom:6}}>pH Targets by Plant</div>
            {[{n:"Most vegetables",r:"6.0\u20137.0",c:G.s3},{n:"Tomatoes & peppers",r:"6.0\u20136.8",c:G.s3},{n:"Blueberries",r:"4.5\u20135.5",c:G.c2},{n:"Citrus",r:"6.0\u20137.0",c:G.s3},{n:"Strawberries",r:"5.5\u20136.5",c:G.s2},{n:"Herbs (most)",r:"6.0\u20137.0",c:G.s3},{n:"Garlic & onions",r:"6.0\u20137.0",c:G.s3},{n:"Eggplant",r:"5.5\u20136.5",c:G.s2},{n:"Kale & brassicas",r:"6.0\u20137.5",c:G.s3}].map(function(t,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{color:G.t2,fontSize:10}}>{t.n}</span><span style={{color:t.c,fontSize:10,fontWeight:600}}>{t.r}</span></div>})}
          </Card>
          <Card style={{background:G.warn+"08",borderColor:G.warn+"22",padding:10}}><div style={{color:G.warn,fontSize:10,fontWeight:600}}>pH ALERT</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>Last runoff 5.9 in Bed 7 \u2014 check strawberries (target 5.5\u20136.5, OK) and blueberries (need 4.5\u20135.5, too HIGH). Amend blueberry containers with sulfur.</div></Card>
          <Card style={{background:G.f2+"0A",padding:10}}><div style={{color:G.s2,fontSize:10,fontWeight:600}}>PRO TIPS</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>SoCal tap water is alkaline (pH 7.5\u20138.5). This raises soil pH over time. Acidify with 1 tsp white vinegar per gallon for acid-lovers. Test monthly. Raised beds with fast-draining mix lose amendments faster \u2014 recheck after heavy watering.</div></Card>
        </div>}
      </>}
    </div>}

    {/* CALENDAR */}
    {tab==="calendar"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{fontSize:14,fontWeight:600}}>{"Zone "+zone.toUpperCase()+" Calendar"}</div>
      <div style={{display:"flex",gap:3,overflow:"auto"}}>{MO.map(function(m,i){return <Chip key={i} on={calM===i+1} color={G.s3} onClick={function(){setCalM(i+1)}} sm>{m}</Chip>})}</div>
      <div style={{color:G.s3,fontSize:16,fontWeight:700,marginTop:2}}>{MO[calM-1]}</div>
      <div style={{color:G.t3,fontSize:10}}>{(calM>=3&&calM<=5?"Spring":calM>=6&&calM<=8?"Summer":calM>=9&&calM<=11?"Fall":"Winter")+" \u00B7 Zone "+zone.toUpperCase()}</div>
      <Card>{CAL[calM-1].i.map(function(x,i,a){return <div key={i} style={{color:G.t2,fontSize:12,lineHeight:1.8,borderBottom:i<a.length-1?"1px solid "+G.ln+"33":"none",paddingBottom:4,marginBottom:4}}>{x}</div>})}</Card>
      <Card style={{background:G.f2+"0A",borderColor:G.f2+"22",padding:10}}><div style={{color:G.s2,fontSize:10,fontWeight:600}}>PRO TIP</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{calM===8?"This is your last citrus feed. Don\u2019t skip it \u2014 it fuels the winter harvest.":calM===12||calM===1?"Two copper sprays (Dec+Jan) are the single most important stone fruit task.":calM===7?"Spider mites thrive in hot, dry conditions. Mist foliage preventively.":calM===9?"September is 9b\u2019s second spring. Everything sown now produces through winter.":"Check the seasonal guide above for this month\u2019s priorities."}</div></Card>
    </div>}

    {/* COACH */}
    {tab==="coach"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:32,height:32,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center"}}><Leaf size={18}/></div><div><div style={{fontSize:13,fontWeight:600}}>grove coach</div><div style={{color:G.t4,fontSize:9}}>{"Zone "+zone.toUpperCase()+" \u00B7 "+allP.length+" plants"}</div></div></div>

      {dM==="pick"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>Which plant?</div><select value={dP} onChange={function(e){setDP(e.target.value)}} style={Object.assign({},inp,{marginBottom:6})}><option value="">Select...</option>{allP.map(function(p){return <option key={p.id} value={p.n}>{p.n}</option>})}</select>{dP&&<button onClick={function(){setDM("sym")}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Next</button>}</Card>}

      {dM==="sym"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>{dP}</div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>{SYM.map(function(s,i){return <Chip key={i} on={dS===s} color={G.c2} onClick={function(){setDS(s)}} sm>{s}</Chip>})}</div>
        <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,border:"2px dashed "+(dPh?G.s3:G.ln),borderRadius:10,cursor:"pointer",marginBottom:8,background:dPh?G.s3+"08":"transparent"}}>{dPh?<><span>{"\u2705"}</span><span style={{color:G.s3,fontSize:11}}>Photo added</span></>:<><span>{"\u{1F4F7}"}</span><span style={{color:G.t4,fontSize:11}}>Drop photo here</span></>}<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0])setDPh(URL.createObjectURL(e.target.files[0]))}}/></label>
        {dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:10,maxHeight:120,objectFit:"cover",marginBottom:8}}/>}
        {dS&&<button onClick={diag} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Analyze</button>}
      </Card>}

      {dM==="load"&&<Card style={{textAlign:"center",padding:24}}><div style={{fontSize:24}}>{"\u{1F50D}"}</div><div style={{color:G.s3,fontSize:12,fontWeight:600,marginTop:6}}>Analyzing...</div></Card>}

      {dM==="result"&&dR&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:12,maxHeight:110,objectFit:"cover"}}/>}
        <Card style={{borderColor:G.c2+"33"}}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{dR.p}</div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,borderRadius:99,background:G.ln,overflow:"hidden"}}><div style={{height:"100%",width:dR.c+"%",borderRadius:99,background:G.s3}}/></div><span style={{color:G.t2,fontSize:11,fontWeight:600}}>{dR.c+"%"}</span></div></Card>
        <Card><div style={{color:G.s3,fontSize:11,fontWeight:600,marginBottom:5}}>Actions</div>{dR.a.map(function(a,i){return <div key={i} style={{color:G.t2,fontSize:11,marginBottom:5,paddingLeft:8,borderLeft:"2px solid "+G.s3+"33"}}>{(i+1)+". "+a}</div>})}</Card>
        <button onClick={function(){setDM(null);setDP("");setDS("");setDR(null);setDPh(null)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:7,fontSize:11,cursor:"pointer"}}>New diagnosis</button>
      </div>}

      {!dM&&!cQ&&<div style={{display:"flex",flexDirection:"column",gap:5}}>
        <Card onClick={function(){setDM("pick")}} style={{borderColor:G.c2+"33",background:G.c2+"06",display:"flex",alignItems:"center",gap:8,padding:"11px 12px"}}><span style={{fontSize:20}}>{"\u{1F4F7}"}</span><div><div style={{color:G.c2,fontSize:12,fontWeight:600}}>Diagnose a plant</div><div style={{color:G.t3,fontSize:10}}>Photo \u00B7 symptoms \u00B7 treatment</div></div></Card>
        <div style={{color:G.t3,fontSize:10,marginTop:2}}>Or ask:</div>
        {Object.keys(COACH).map(function(q,i){return <Card key={i} onClick={function(){ask(q)}} style={{padding:"8px 10px",borderColor:G.f2+"22",display:"flex",alignItems:"center",gap:6}}><span style={{color:G.s3,fontSize:11}}>{"\u2192"}</span><span style={{fontSize:11}}>{q}</span></Card>})}
      </div>}
      {!dM&&cQ&&<>
        <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:G.f2,borderRadius:"12px 12px 3px 12px",padding:"7px 10px",fontSize:11,maxWidth:"82%"}}>{cQ}</div></div>
        <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Leaf size={12}/></div><div style={{background:G.bg1,border:"1px solid "+G.ln,borderRadius:"3px 12px 12px 12px",padding:"8px 10px",fontSize:11,color:G.t2,lineHeight:1.6,maxWidth:"85%"}}>{cTx}{typing&&<span style={{color:G.s3}}>{"\u2588"}</span>}</div></div>
        {!typing&&<button onClick={function(){setCQ(null);setCTx("")}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:"5px 12px",fontSize:11,cursor:"pointer",alignSelf:"flex-start"}}>{"\u2190 New question"}</button>}
      </>}
    </div>}

    </div>

    {/* TAB BAR */}
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:G.bg0+"F2",backdropFilter:"blur(24px)",borderTop:"1px solid "+G.ln,display:"flex",justifyContent:"space-around",padding:"5px 0 16px"}}>
      {[{id:"home",l:"Home",i:"\u{1F3E1}"},{id:"garden",l:"Garden",i:"\u{1F331}"},{id:"library",l:"Library",i:"\u{1F4DA}"},{id:"calendar",l:"Cal",i:"\u{1F4C5}"},{id:"coach",l:"Coach",i:"\u{1F916}"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id);if(t.id!=="library")setSel(null)}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"3px 8px"}}><span style={{fontSize:17,filter:tab===t.id?"none":"grayscale(1) opacity(.35)"}}>{t.i}</span><span style={{fontSize:8,fontWeight:600,color:tab===t.id?G.s3:G.t4}}>{t.l}</span></button>})}
    </div>
  </div>;
}
