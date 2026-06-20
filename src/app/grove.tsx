import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import dynamic from "next/dynamic";
// 3D yard view is client-only (Three.js) - load without SSR
var Yard3D = dynamic(function(){return import("./yard3d")},{ssr:false,loading:function(){return <div style={{height:380,borderRadius:16,border:"1px solid #243328",display:"flex",alignItems:"center",justifyContent:"center",color:"#7A8C78",fontSize:12}}>Loading 3D view…</div>}});



var G={bg0:"#0B110E",bg1:"#111A15",bg2:"#172119",ln:"#243328",ln2:"#2E4035",f1:"#1B4332",f2:"#2D6A4F",f3:"#40916C",s1:"#52796F",s2:"#74B89A",s3:"#95D5B2",s4:"#D8F3DC",c2:"#FF8C42",c3:"#FFB380",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",red:"#D95B5B",warn:"#E8A840",blue:"#5B9BD9"};

function Leaf(p){var s=p.size||28;return <svg width={s} height={s} viewBox="0 0 100 100"><ellipse cx="40" cy="44" rx="21" ry="30" fill={G.s3} opacity=".88" transform="rotate(-15 40 44)"/><ellipse cx="58" cy="47" rx="17" ry="26" fill={G.f2} opacity=".8" transform="rotate(10 58 47)"/><line x1="50" y1="70" x2="50" y2="90" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round"/></svg>}

function Ring(p){var _a=useState(0),a=_a[0],setA=_a[1];useEffect(function(){var f,s;var t=function(ts){if(!s)s=ts;var pr=Math.min(1,(ts-s)/1200);setA((1-Math.pow(1-pr,3))*p.score);if(pr<1)f=requestAnimationFrame(t)};f=requestAnimationFrame(t);return function(){cancelAnimationFrame(f)}},[p.score]);var sz=150,r=66,cx=sz/2,cy=sz/2,ci=2*Math.PI*r,o=ci*(1-a/100);return <svg width={sz} height={sz} style={{filter:"drop-shadow(0 0 16px "+G.s3+"22)"}}><circle cx={cx} cy={cy} r={r} fill="none" stroke={G.ln} strokeWidth="8"/><circle cx={cx} cy={cy} r={r} fill="none" stroke={G.s3} strokeWidth="8" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={o} transform={"rotate(-90 "+cx+" "+cy+")"}/><text x={cx} y={cy-4} textAnchor="middle" fill={G.t1} fontSize="32" fontWeight="700">{Math.round(a)}</text><text x={cx} y={cy+14} textAnchor="middle" fill={G.t3} fontSize="9" fontWeight="600">GARDEN HEALTH</text></svg>}

function Chip(p){var c=p.color||G.s3;return <button onClick={p.onClick} style={{background:p.on?c+"18":"transparent",border:"1px solid "+(p.on?c+"66":G.ln),color:p.on?c:G.t3,borderRadius:99,padding:p.sm?"4px 10px":"5px 13px",fontSize:p.sm?10:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{p.children}</button>}
function Card(p){return <div onClick={p.onClick} style={Object.assign({background:G.bg1,borderRadius:14,border:"1px solid "+G.ln,padding:13,cursor:p.onClick?"pointer":"default"},p.style||{})}>{p.children}</div>}

// ─── PLANTS (with daysToHarvest for calendar) ───
var P=[
{id:1,n:"Genovese Basil",e:"\u{1F33F}",cat:"herb",bed:"Bed 3",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Pinch flowers immediately.",h:["Anti-inflammatory oils","Antibacterial eugenol","Vitamin K"],m:["Digestive aid (traditional)","Antibacterial (emerging)"],comp:["Tomato","Pepper"],avoid:["Sage","Rosemary"],cul:"Pesto, caprese, Thai",flav:"Sweet, peppery"},
{id:2,n:"Rosemary",e:"\u{1F331}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:0,ph:"6.0-7.5",tip:"Unkillable with drainage.",h:["Rosmarinic acid","Memory support","Antimicrobial"],m:["Memory (emerging)","Hair growth (emerging)","Anti-inflammatory (well-studied)"],comp:["Sage","Thyme","Lavender"],avoid:["Basil","Mint"],cul:"Roasted meats, focaccia",flav:"Piney, peppery"},
{id:3,n:"Cilantro",e:"\u{1F33F}",cat:"herb",bed:"Bed 10",stg:"Vegetative",dth:45,ph:"6.2-6.8",tip:"Fall/winter only in 9b.",h:["Heavy-metal chelation","Vitamins A, C, K"],m:["Heavy metal detox (emerging)"],comp:["Tomato","Spinach"],avoid:["Fennel"],cul:"Salsa, guac, pho",flav:"Bright, citrusy"},
{id:4,n:"Thyme",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:0,ph:"6.0-8.0",tip:"Groundcover that deters slugs.",h:["Thymol antiseptic","Vitamin C","Iron"],m:["Respiratory (well-studied)","Antibacterial (well-studied)"],comp:["Rosemary","Strawberry"],avoid:["Basil"],cul:"Soups, roasted chicken",flav:"Earthy, floral"},
{id:5,n:"Oregano",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:0,ph:"6.0-8.0",tip:"Edible groundcover.",h:["Highest antioxidant herb","Carvacrol"],m:["Antimicrobial (well-studied)","Cold/flu oil (emerging)"],comp:["Tomato","Pepper"],avoid:["Mint"],cul:"Pizza, pasta",flav:"Warm, aromatic"},
{id:6,n:"Spearmint",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:0,ph:"6.0-7.0",tip:"ALWAYS container.",h:["Menthol digestion","Vitamin A"],m:["IBS relief (FDA)","Headache (well-studied)"],comp:[],avoid:["In-ground"],cul:"Mojitos, tea",flav:"Cool, refreshing"},
{id:7,n:"Lavender",e:"\u{1F49C}",cat:"herb",bed:"Border",stg:"Perennial",dth:0,ph:"6.5-7.5",tip:"Spanish type for 9b heat.",h:["Linalool calming","Anti-inflammatory"],m:["Anxiety & sleep (well-studied)","Wound healing (emerging)"],comp:["Rosemary","Sage","Citrus"],avoid:["Mint"],cul:"Honey, shortbread",flav:"Floral, sweet"},
{id:8,n:"Sage",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:0,ph:"6.0-7.0",tip:"Drought-lover.",h:["Rosmarinic acid","Vitamin K"],m:["Memory Alzheimer's (well-studied)","Hot flashes (emerging)"],comp:["Rosemary","Thyme"],avoid:["Basil"],cul:"Brown butter pasta",flav:"Earthy"},
{id:9,n:"Parsley",e:"\u{1F33F}",cat:"herb",bed:"Bed 5",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Highest vitamin K of any food.",h:["Extreme vitamin K","Vitamin C","Iron"],m:["Anti-cancer apigenin (emerging)"],comp:["Tomato","Carrot"],avoid:["Lettuce"],cul:"Tabbouleh, chimichurri",flav:"Fresh, peppery"},
{id:10,n:"Chives",e:"\u{1F33F}",cat:"herb",bed:"Edges",stg:"Perennial",dth:80,ph:"6.0-7.0",tip:"Edible flowers. Deters aphids.",h:["Allicin","Vitamin K"],m:["Pest deterrent (well-studied)"],comp:["Carrot","Rose"],avoid:["Bean"],cul:"Potatoes, eggs",flav:"Mild onion"},
{id:11,n:"Lemongrass",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Store stalks root in water.",h:["Citral anti-inflammatory"],m:["Mosquito repellent (well-studied)"],comp:["Citrus"],avoid:[],cul:"Thai soups, tea",flav:"Bright citrus"},
{id:12,n:"Dill",e:"\u{1F33F}",cat:"herb",bed:"Bed 6",stg:"Flowering",dth:60,ph:"6.0-7.0",tip:"Flowers attract beneficial wasps.",h:["Vitamin A & C"],m:["Digestive (traditional)"],comp:["Lettuce","Cucumber"],avoid:["Carrot","Tomato"],cul:"Pickles, salmon",flav:"Anise-like"},
{id:13,n:"Sungold Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 3",stg:"Fruiting",dth:65,ph:"6.0-6.8",tip:"Shade cloth above 95F.",h:["Highest lycopene cherry","Vitamin C","Beta-carotene"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel","Kale"],cul:"Fresh, roasted",flav:"Intensely sweet"},
{id:14,n:"Cherokee Purple",e:"\u{1F345}",cat:"fruiting",bed:"Bed 2",stg:"Fruiting",dth:80,ph:"6.0-6.8",tip:"Dark skin sunscalds - shade cloth.",h:["Anthocyanins","Lycopene"],m:["Higher antioxidant (emerging)"],comp:["Basil"],avoid:["Fennel"],cul:"Burgers, caprese",flav:"Smoky, umami"},
{id:15,n:"Shishito Pepper",e:"\u{1F336}",cat:"fruiting",bed:"Bed 4",stg:"Fruiting",dth:60,ph:"6.0-6.8",tip:"Pick green. More you pick, more it gives.",h:["2x daily vitamin C","Capsaicin"],m:["Vitamin C (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Blistered, tempura",flav:"Mild, 1/10 spicy"},
{id:16,n:"Jalapeno",e:"\u{1F336}",cat:"fruiting",bed:"Bed 4",stg:"Fruiting",dth:70,ph:"6.0-6.8",tip:"Corking = more heat. Loves 9b.",h:["Capsaicin pain & metabolism","Vitamin C"],m:["Topical pain (FDA)","Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Salsa, poppers",flav:"Grassy heat"},
{id:17,n:"Zucchini",e:"\u{1F952}",cat:"fruiting",bed:"Bed 5",stg:"Fruiting",dth:50,ph:"6.0-7.5",tip:"Pick 6-8in. Check DAILY.",h:["Vitamin C & B6","Potassium","Lutein"],m:["Blood sugar (emerging)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Spiralized, grilled",flav:"Mild, sweet"},
{id:18,n:"Cucumber",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Fruiting",dth:55,ph:"6.0-7.0",tip:"Trellis vertically.",h:["96% water","Vitamin K"],m:["Hydration (well-studied)"],comp:["Bean","Dill"],avoid:["Sage"],cul:"Salads, pickles",flav:"Cool, crisp"},
{id:19,n:"Eggplant",e:"\u{1F346}",cat:"fruiting",bed:"Bed 8",stg:"Fruiting",dth:75,ph:"5.5-6.5",tip:"Japanese Ichiban for 9b heat.",h:["Nasunin brain antioxidant"],m:["Brain health (emerging)"],comp:["Bean","Pepper"],avoid:["Fennel"],cul:"Baba ganoush",flav:"Creamy cooked"},
{id:20,n:"Romaine Lettuce",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Cut-and-come-again.",h:["Vitamin K","Folate","95% water"],m:["Mild sedative (traditional)"],comp:["Carrot","Radish"],avoid:["Celery"],cul:"Caesar, wraps",flav:"Crisp, mild"},
{id:21,n:"Lacinato Kale",e:"\u{1F957}",cat:"brassica",bed:"Bed 9",stg:"Harvest",dth:60,ph:"6.0-7.5",tip:"Sweetens after cool nights.",h:["7x daily vitamin K","Sulforaphane","Best plant calcium"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Garlic"],avoid:["Strawberry"],cul:"Chips, salads",flav:"Nutty, sweet"},
{id:22,n:"Rainbow Chard",e:"\u{1F308}",cat:"leafy",bed:"Bed 12",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Handles 9b summers.",h:["Very high vitamin K","Betalains"],m:["Blood sugar (emerging)"],comp:["Bean","Onion"],avoid:["Cucumber"],cul:"Sauteed, bowls",flav:"Earthy"},
{id:23,n:"Spinach",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:45,ph:"6.5-7.5",tip:"Cool season only in 9b.",h:["Iron + C","Lutein","Nitrates"],m:["Eye health (well-studied)","Athletic (well-studied)"],comp:["Strawberry","Pea"],avoid:["Beet"],cul:"Salads, spanakopita",flav:"Mild, sweet"},
{id:24,n:"Arugula",e:"\u{1F33F}",cat:"leafy",bed:"Bed 14",stg:"Vegetative",dth:30,ph:"6.0-7.0",tip:"Seed to salad 21 days.",h:["Glucosinolates","Vitamin K"],m:["Cancer-protective (well-studied)"],comp:["Carrot","Onion"],avoid:["Strawberry"],cul:"Pizza, pesto",flav:"Peppery, nutty"},
{id:25,n:"Nantes Carrot",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:70,ph:"6.0-6.8",tip:"17in Vegos = perfect depth.",h:["Extreme beta-carotene","Lutein","Fiber"],m:["Eye health (well-studied)","Gut pectin (well-studied)"],comp:["Lettuce","Onion","Rosemary"],avoid:["Dill"],cul:"Raw, roasted, juicing",flav:"Sweet, coreless"},
{id:26,n:"Chioggia Beet",e:"\u{1F7E3}",cat:"root",bed:"Bed 12",stg:"Vegetative",dth:55,ph:"6.0-7.5",tip:"Soak seeds 12hr. Eat greens too.",h:["Betalain antioxidant","Nitrates","Folate"],m:["Athletic endurance (well-studied)","Blood pressure (well-studied)"],comp:["Onion","Lettuce"],avoid:["Pole bean"],cul:"Roasted, borscht",flav:"Sweet, earthy"},
{id:27,n:"French Radish",e:"\u{1F534}",cat:"root",bed:"Bed 14",stg:"Ready",dth:25,ph:"6.0-7.0",tip:"21 days seed to table.",h:["Vitamin C","Isothiocyanates"],m:["Digestive stimulant (traditional)"],comp:["Carrot","Lettuce"],avoid:[],cul:"Butter + salt, salads",flav:"Crisp, peppery"},
{id:28,n:"Softneck Garlic",e:"\u{1F9C4}",cat:"allium",bed:"Bed 9",stg:"Vegetative",dth:240,ph:"6.0-7.0",tip:"Plant Oct-Nov. Stores 6+ months.",h:["Allicin","Heart health","Prebiotic"],m:["Cardiovascular (well-studied)","Immune (well-studied)","Antimicrobial (well-studied)"],comp:["Tomato","Brassicas"],avoid:["Bean"],cul:"Everything",flav:"Sharp raw, sweet roasted"},
{id:29,n:"Green Onion",e:"\u{1F9C5}",cat:"allium",bed:"Edges",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Regrows from root end.",h:["Vitamin K & C","Quercetin"],m:["Mild antimicrobial (traditional)"],comp:["Carrot","Lettuce"],avoid:["Bean"],cul:"Stir-fry, garnish",flav:"Mild onion"},
];

// ─── FRUIT TREES (full ecosystem - Priority 5) ───
var TREES=[
{id:50,n:"Improved Meyer Lemon",e:"\u{1F34B}",cat:"citrus",chill:0,pol:"Self-fertile",space:"8-12 ft",dth:240,ph:"6.0-7.0",tip:"Feed Feb/May/Aug. Mulch to drip line, 6in from trunk. Most cold-hardy citrus.",h:["Very high vitamin C","Flavonoids vascular","D-limonene peel"],m:["Immune (well-studied)","Digestive (traditional)","GERD d-limonene (emerging)"],comp:["Lavender","Nasturtium"],avoid:["Lawn grass"],cul:"Juice, zest, preserved, curd",flav:"Sweeter, floral, edible peel",harv:"Nov-Mar"},
{id:51,n:"Washington Navel Orange",e:"\u{1F34A}",cat:"citrus",chill:0,pol:"Self-fertile",space:"12-15 ft",dth:270,ph:"6.0-7.0",tip:"Classic SoCal backyard. Thin fruit if tree overproduces for bigger, sweeter fruit.",h:["130% daily vitamin C","Hesperidin BP","Folate"],m:["Cardiovascular (well-studied)","Cancer prevention limonoids (emerging)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Fresh, juice, marmalade",flav:"Sweet, seedless. Dec-Mar.",harv:"Dec-Mar"},
{id:52,n:"Bearss Lime",e:"\u{1F7E2}",cat:"citrus",chill:0,pol:"Self-fertile",space:"10-15 ft",dth:300,ph:"6.0-7.0",tip:"Thornless, seedless Persian lime. More cold-tolerant than Key lime. Fruits year-round.",h:["Very high vitamin C","Flavonoids"],m:["Immune (well-studied)","Digestive (traditional)"],comp:["Basil","Lemongrass"],avoid:["Lawn grass"],cul:"Margaritas, ceviche, Thai",flav:"Bright, tart, aromatic",harv:"Year-round"},
{id:53,n:"Babcock Peach",e:"\u{1F351}",cat:"stone",chill:250,pol:"Self-fertile",space:"12-15 ft",dth:120,ph:"6.0-7.0",tip:"DORMANT COPPER SPRAY Dec + Jan = non-negotiable for leaf curl. Thin fruit to 6-8in apart. Low-chill, perfect for 9b.",h:["Chlorogenic acid","Vitamins A & C","Potassium"],m:["Digestive peach leaf tea (traditional)","Skin kernel oil (traditional)"],comp:["Garlic","Chives","Nasturtium"],avoid:["Tomato near roots"],cul:"Fresh, grilled, pies, preserves",flav:"White, honey-sweet, melt-in-mouth",harv:"Jun-Jul"},
{id:54,n:"Santa Rosa Plum",e:"\u{1F7E3}",cat:"stone",chill:300,pol:"Self-fertile",space:"12-15 ft",dth:140,ph:"6.0-7.0",tip:"Low-chill 300hr - perfect 9b. Self-fertile but bigger crop with a pollinator. Bred in Santa Rosa CA by Luther Burbank.",h:["Anthocyanins","Sorbitol digestive","Vitamin K"],m:["Digestive regularity (well-studied)","Bone density dried plums (well-studied)"],comp:["Garlic","Chives"],avoid:["Peach too close"],cul:"Fresh, jam, wine, dried",flav:"Sweet-tart, juicy, deep red",harv:"Jun-Jul"},
{id:55,n:"Blenheim Apricot",e:"\u{1F7E0}",cat:"stone",chill:400,pol:"Self-fertile",space:"15-20 ft",dth:120,ph:"6.0-7.0",tip:"THE iconic California apricot. Low-chill 400hr. Thin aggressively - unthinned Blenheims are small and bland. Fresh window is only 2 weeks!",h:["Highest beta-carotene stone fruit","Vitamin A & C","Catechins"],m:["Eye health (well-studied)","Skin kernel oil (traditional)"],comp:["Garlic","Chives","Tansy"],avoid:["Peach proximity"],cul:"Fresh, dried, jam, leather",flav:"Intensely aromatic, sweet-tart, floral",harv:"Jun-Jul"},
{id:56,n:"Hass Avocado",e:"\u{1F951}",cat:"tree",chill:0,pol:"A-type (self+B)",space:"15-20 ft",dth:365,ph:"6.0-6.5",tip:"Plant on a MOUND - avocados die in wet feet. Protect young trees below 32F. Fruit holds on tree for months. Type A flower - pairs with Type B (Fuerte) for max yield.",h:["Healthy monounsaturated fats","Potassium higher than banana","Fiber","Vitamin K & E"],m:["Heart health - lowers LDL (well-studied)","Nutrient absorption boost (well-studied)"],comp:["Comfrey","Nasturtium"],avoid:["Lawn grass","Wet soil"],cul:"Guac, toast, salads, smoothies",flav:"Rich, buttery, nutty",harv:"Feb-Sep"},
{id:57,n:"Wonderful Pomegranate",e:"\u{1F33A}",cat:"tree",chill:150,pol:"Self-fertile",space:"12-18 ft",dth:180,ph:"5.5-7.0",tip:"Thrives in 9b heat - loves hot dry summers. Very drought-tolerant once established. Split fruit = inconsistent water. Deep water weekly.",h:["Punicalagins - potent antioxidant","Vitamin C & K","Anti-inflammatory"],m:["Cardiovascular - lowers BP (well-studied)","Anti-cancer punicalagins (emerging)","Memory (emerging)"],comp:["Herbs","Legumes"],avoid:["Heavy shade"],cul:"Fresh arils, juice, molasses, salads",flav:"Sweet-tart, juicy jewel-like arils",harv:"Sep-Nov"},
{id:58,n:"Fuyu Persimmon",e:"\u{1F36F}",cat:"tree",chill:200,pol:"Self-fertile",space:"15-20 ft",dth:210,ph:"6.0-7.0",tip:"Non-astringent - eat firm like an apple. Gorgeous fall foliage. Very low-maintenance, few pests. Holds fruit into winter after leaves drop.",h:["Vitamin A & C","Fiber","Manganese","Antioxidant tannins"],m:["Digestive fiber (well-studied)","Anti-inflammatory (emerging)"],comp:["Low groundcover"],avoid:["Wet soil"],cul:"Fresh, salads, baking, dried",flav:"Sweet, crisp, honey-cinnamon",harv:"Oct-Dec"},
{id:59,n:"Anna Apple",e:"\u{1F34E}",cat:"tree",chill:200,pol:"Needs pollinator",space:"12-15 ft",dth:150,ph:"6.0-7.0",tip:"Low-chill apple that actually fruits in 9b! Needs a pollinator - pair with Dorsett Golden (blooms same time). Can fruit twice a year in mild winters.",h:["Fiber pectin","Vitamin C","Quercetin antioxidant"],m:["Gut health pectin (well-studied)","Cholesterol (well-studied)"],comp:["Chives","Nasturtium","Comfrey"],avoid:["Walnut"],cul:"Fresh, pie, sauce, cider",flav:"Crisp, sweet-tart, like Red Delicious",harv:"Jun-Jul & Oct"},
{id:60,n:"Black Mission Fig",e:"\u{1FAD2}",cat:"tree",chill:100,pol:"Self-fertile",space:"15-25 ft",dth:120,ph:"6.0-6.5",tip:"Thrives on neglect in 9b. Two crops: breba (spring, old wood) + main (summer/fall, new growth). Prune lightly. Can be kept small in a container.",h:["Highest fiber fruit","Best fruit calcium","Potassium","Polyphenols"],m:["Digestive fig syrup (well-studied)","Blood sugar leaves (emerging)","Bone calcium (emerging)"],comp:["Comfrey","Nasturtium","Rue"],avoid:[],cul:"Fresh with ricotta, jam, dried, prosciutto",flav:"Honey-sweet, jammy, complex",harv:"Jun-Oct"},
{id:61,n:"Sunshine Blue Blueberry",e:"\u{1FAD0}",cat:"berry",chill:150,pol:"Self-fertile",space:"3-4 ft",dth:90,ph:"4.5-5.5",tip:"ACIDIC SOIL NON-NEGOTIABLE pH 4.5-5.5. Best in containers in 9b so you control soil. Acidify SoCal alkaline tap with sulfur or vinegar. Southern highbush, low-chill.",h:["Highest antioxidant common fruit","Anthocyanins memory","Lowers BP"],m:["Brain health memory (well-studied)","Cardiovascular (2019 trial)","Insulin sensitivity (emerging)"],comp:["Azalea","Rhododendron"],avoid:["Alkaline plants","Walnut"],cul:"Fresh, smoothies, muffins, pie",flav:"Sweet, tangy, aromatic, intense",harv:"May-Jul"},
{id:62,n:"Triple Crown Blackberry",e:"\u{1FAD0}",cat:"berry",chill:0,pol:"Self-fertile",space:"4-6 ft",dth:120,ph:"5.5-6.5",tip:"THORNLESS! Train on a trellis or wire. Tip-prune primocanes at 5ft to force fruiting laterals. Fruits on second-year canes (floricanes). Huge yields.",h:["Very high vitamin C & K","Anthocyanins","Highest fiber fruit"],m:["Cognitive support (emerging)","Anti-inflammatory (emerging)"],comp:["Tansy","Garlic"],avoid:["Nightshades"],cul:"Fresh, cobbler, jam, wine",flav:"Sweet-tart, complex, winey",harv:"Jun-Aug"},
];


// ─── EXPANDED PLANT DATABASE (toward 150+) ───
// sow = indoor seed-start month range (9b), tp = transplant/direct-sow month range (9b)
var P2=[
// MORE HERBS
{id:101,n:"Italian Parsley",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Slow to germinate - soak seeds overnight.",h:["Vitamin K","Vitamin C","Folate"],m:["Diuretic (traditional)"],comp:["Tomato","Carrot"],avoid:["Lettuce"],cul:"Tabbouleh, sauces",flav:"Fresh, peppery",sow:"Feb-Mar",tp:"Mar-Apr & Sep"},
{id:102,n:"Fennel",e:"\u{1F33F}",cat:"herb",bed:"Border",stg:"Vegetative",dth:80,ph:"6.0-7.0",tip:"Keep away from most veg - it inhibits growth. Attracts beneficials when flowering.",h:["Anethole","Vitamin C","Fiber"],m:["Digestive (well-studied)","Colic (traditional)"],comp:["Dill"],avoid:["Tomato","Bean","Most veg"],cul:"Salads, roasted, sausage",flav:"Anise, sweet",sow:"",tp:"Mar-Apr & Sep-Oct"},
{id:103,n:"Tarragon",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"French tarragon must be from cuttings, not seed.",h:["Antioxidants","Vitamin A"],m:["Digestive (traditional)","Sleep (emerging)"],comp:["Most veg"],avoid:[],cul:"Bearnaise, chicken, fish",flav:"Anise, delicate",sow:"",tp:"Mar-Apr"},
{id:104,n:"Marjoram",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Perennial",dth:80,ph:"6.0-8.0",tip:"Sweeter, milder cousin of oregano.",h:["Antioxidants","Vitamin K"],m:["Digestive (traditional)","Anti-inflammatory (emerging)"],comp:["Tomato","Pepper"],avoid:[],cul:"Soups, meats, herb blends",flav:"Sweet, citrusy",sow:"Feb-Mar",tp:"Apr"},
{id:105,n:"Lemon Balm",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:70,ph:"6.0-7.5",tip:"Spreads like mint - container it. Calming tea.",h:["Rosmarinic acid","Antioxidants"],m:["Anxiety & sleep (well-studied)","Antiviral cold sores (emerging)"],comp:["Most veg"],avoid:[],cul:"Tea, desserts, fish",flav:"Lemony, mild mint",sow:"Feb-Mar",tp:"Apr"},
{id:106,n:"Catnip",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:75,ph:"6.0-7.5",tip:"Cats love it; so do pollinators. Repels some pests.",h:["Nepetalactone","Antioxidants"],m:["Calming tea (traditional)","Mosquito repellent (emerging)"],comp:["Eggplant","Pumpkin"],avoid:[],cul:"Tea",flav:"Minty, grassy",sow:"Feb-Mar",tp:"Apr"},
{id:107,n:"Stevia",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:90,ph:"6.5-7.5",tip:"Natural sweetener - leaves 30x sweeter than sugar.",h:["Zero-calorie sweetener","Steviol glycosides"],m:["Blood sugar (emerging)"],comp:[],avoid:[],cul:"Sweetener, tea",flav:"Intensely sweet",sow:"Feb-Mar",tp:"Apr-May"},
{id:108,n:"Borage",e:"\u{1F33C}",cat:"herb",bed:"Border",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Edible blue flowers. Magnet for bees. Great with strawberries.",h:["Omega-6 GLA","Vitamin C"],m:["Anti-inflammatory (emerging)","Skin (traditional)"],comp:["Strawberry","Tomato","Squash"],avoid:[],cul:"Flowers in salad, cucumber flavor",flav:"Cucumber-like",sow:"",tp:"Mar-Apr"},
{id:109,n:"Chamomile",e:"\u{1F33C}",cat:"herb",bed:"Border",stg:"Vegetative",dth:60,ph:"5.6-7.5",tip:"Tea flowers. Self-seeds happily.",h:["Apigenin","Antioxidants"],m:["Sleep & anxiety (well-studied)","Digestive (well-studied)"],comp:["Cabbage","Onion"],avoid:[],cul:"Tea",flav:"Apple, floral",sow:"Feb-Mar",tp:"Mar-Apr"},
{id:110,n:"Summer Savory",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Classic with beans - aids digestion.",h:["Antioxidants","Antimicrobial"],m:["Digestive (traditional)"],comp:["Bean","Onion"],avoid:[],cul:"Beans, meats, herb blends",flav:"Peppery, thyme-like",sow:"Feb-Mar",tp:"Apr"},
// MORE FRUITING VEG
{id:111,n:"Beefsteak Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:85,ph:"6.0-6.8",tip:"Big slicers need staking and shade above 95F.",h:["Lycopene","Vitamin C"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel"],cul:"Sandwiches, slicing",flav:"Rich, meaty",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:112,n:"Roma Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Paste tomato - meaty, few seeds. Great for sauce.",h:["Lycopene","Low moisture"],m:["Cardiovascular (well-studied)"],comp:["Basil","Carrot"],avoid:["Fennel"],cul:"Sauce, paste, canning",flav:"Dense, low-acid",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:113,n:"Bell Pepper",e:"\u{1FAD1}",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Let ripen to red/yellow for sweetness & more vitamin C.",h:["2-3x daily vitamin C","Beta-carotene"],m:["Eye health (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Raw, roasted, stuffed",flav:"Sweet, crisp",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:114,n:"Serrano Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Hotter than jalapeno. Thrives in 9b heat.",h:["Capsaicin","Vitamin C"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Salsa, hot sauce",flav:"Bright, hot",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:115,n:"Habanero",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:90,ph:"6.0-6.8",tip:"Very hot, fruity. Loves long hot 9b summers.",h:["High capsaicin","Vitamin C"],m:["Metabolism (well-studied)","Pain topical (FDA)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Hot sauce, salsa",flav:"Fruity, fiery",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:116,n:"Tomatillo",e:"\u{1F7E2}",cat:"fruiting",bed:"Bed 2",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Plant at least TWO - they need cross-pollination.",h:["Vitamin C","Antioxidant withanolides"],m:["Antibacterial (emerging)"],comp:["Pepper","Basil"],avoid:["Fennel"],cul:"Salsa verde, stews",flav:"Tart, citrusy",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:117,n:"Pumpkin",e:"\u{1F383}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:110,ph:"6.0-7.0",tip:"Needs lots of room - vines sprawl 10+ ft.",h:["Beta-carotene","Fiber","Potassium"],m:["Eye health (well-studied)","Prostate seeds (emerging)"],comp:["Corn","Bean","Nasturtium"],avoid:["Potato"],cul:"Pie, roasted, soup",flav:"Sweet, earthy",sow:"",tp:"Apr-Jun"},
{id:118,n:"Winter Squash",e:"\u{1F360}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:95,ph:"6.0-7.0",tip:"Butternut, acorn, kabocha. Cure before storing.",h:["Beta-carotene","Vitamin C","Potassium"],m:["Eye health (well-studied)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Roasted, soup",flav:"Sweet, nutty",sow:"",tp:"Apr-Jun"},
{id:119,n:"Pattypan Squash",e:"\u{1F952}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:50,ph:"6.0-7.5",tip:"Scallop-shaped summer squash. Pick small.",h:["Vitamin C","Manganese"],m:["Blood sugar (emerging)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Grilled, stuffed",flav:"Mild, buttery",sow:"",tp:"Apr-Jul"},
{id:120,n:"Okra",e:"\u{1F33F}",cat:"fruiting",bed:"Bed 8",stg:"Vegetative",dth:60,ph:"6.5-7.0",tip:"LOVES 9b heat. Pick pods small (3in) or they get woody.",h:["Fiber","Vitamin C","Folate"],m:["Blood sugar (emerging)"],comp:["Pepper","Basil"],avoid:[],cul:"Gumbo, fried, roasted",flav:"Grassy, mild",sow:"Mar-Apr",tp:"May-Jun"},
{id:121,n:"Armenian Cucumber",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Heat-tolerant, never bitter. Actually a melon. Great for 9b.",h:["Hydrating","Vitamin K"],m:["Hydration (well-studied)"],comp:["Bean","Dill"],avoid:["Sage"],cul:"Salads, fresh",flav:"Cool, sweet",sow:"",tp:"Apr-Jun"},
{id:122,n:"Cantaloupe",e:"\u{1F348}",cat:"fruiting",bed:"Bed 7",stg:"Vegetative",dth:85,ph:"6.0-6.8",tip:"Needs heat & space. Slips from vine when ripe.",h:["Beta-carotene","Vitamin C","Potassium"],m:["Eye health (well-studied)"],comp:["Corn","Nasturtium"],avoid:["Potato"],cul:"Fresh, smoothies",flav:"Sweet, musky",sow:"Mar-Apr",tp:"May-Jun"},
{id:123,n:"Watermelon",e:"\u{1F349}",cat:"fruiting",bed:"Bed 7",stg:"Vegetative",dth:90,ph:"6.0-6.8",tip:"Heat-lover. Thump test: hollow = ripe. Needs space.",h:["Lycopene","Citrulline","Hydrating"],m:["Cardiovascular (emerging)","Athletic recovery (emerging)"],comp:["Corn","Nasturtium"],avoid:["Potato"],cul:"Fresh, agua fresca",flav:"Sweet, juicy",sow:"Mar-Apr",tp:"May-Jun"},
{id:124,n:"Ground Cherry",e:"\u{1F7E0}",cat:"fruiting",bed:"Bed 2",stg:"Vegetative",dth:70,ph:"6.0-6.8",tip:"Husked fruit, like a sweet tomatillo. Self-seeds.",h:["Vitamin C","Beta-carotene"],m:["Antioxidant (emerging)"],comp:["Pepper"],avoid:["Fennel"],cul:"Fresh, jam, pies",flav:"Sweet, tropical",sow:"Jan-Feb",tp:"Mar-Apr"},
// MORE LEAFY / GREENS
{id:125,n:"Butterhead Lettuce",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Tender buttery heads. Bolts in heat - cool season.",h:["Vitamin K","Folate","Vitamin A"],m:["Hydration (well-studied)"],comp:["Carrot","Radish"],avoid:["Celery"],cul:"Wraps, salads",flav:"Buttery, soft",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:126,n:"Oakleaf Lettuce",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:50,ph:"6.0-7.0",tip:"Loose-leaf, slow to bolt. Cut-and-come-again.",h:["Vitamin A","Vitamin K"],m:["Hydration (well-studied)"],comp:["Carrot","Radish"],avoid:["Celery"],cul:"Salads",flav:"Mild, nutty",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:127,n:"Mustard Greens",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:45,ph:"6.0-7.5",tip:"Spicy greens, fast. Cool season in 9b.",h:["Vitamin K","Vitamin A","Glucosinolates"],m:["Anti-inflammatory (well-studied)"],comp:["Most veg"],avoid:[],cul:"Sauteed, braised",flav:"Peppery, sharp",sow:"",tp:"Sep-Feb"},
{id:128,n:"Bok Choy",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:50,ph:"6.0-7.5",tip:"Asian green, quick. Cool season. Pick whole or leaf.",h:["Vitamin A & C","Calcium"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Carrot"],avoid:[],cul:"Stir-fry, soups",flav:"Mild, crisp",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:129,n:"Collard Greens",e:"\u{1F957}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Heat AND cold tolerant - one of the most forgiving greens.",h:["Vitamin K","Calcium","Fiber"],m:["Anti-inflammatory (well-studied)","Cholesterol (emerging)"],comp:["Onion","Dill"],avoid:["Strawberry"],cul:"Braised, soups",flav:"Earthy, hearty",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:130,n:"Endive",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:65,ph:"6.0-6.8",tip:"Slightly bitter. Blanch center for milder flavor.",h:["Vitamin K","Folate","Fiber"],m:["Digestive (traditional)"],comp:["Carrot"],avoid:[],cul:"Salads, braised",flav:"Bitter, crisp",sow:"Aug-Sep",tp:"Sep-Oct"},
{id:131,n:"Watercress",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Vegetative",dth:50,ph:"6.5-7.5",tip:"Needs constant moisture. Peppery superfood.",h:["Vitamin K","Vitamin C","Antioxidants"],m:["Anti-cancer (emerging)","Antioxidant (well-studied)"],comp:[],avoid:[],cul:"Salads, soups",flav:"Peppery, fresh",sow:"",tp:"Sep-Mar"},
{id:132,n:"Radicchio",e:"\u{1F7E3}",cat:"leafy",bed:"Bed 12",stg:"Vegetative",dth:70,ph:"6.0-6.8",tip:"Italian chicory. Cool weather sweetens the bitterness.",h:["Antioxidants","Vitamin K"],m:["Digestive (traditional)"],comp:["Carrot"],avoid:[],cul:"Grilled, salads, risotto",flav:"Bitter, nutty",sow:"Jul-Aug",tp:"Aug-Sep"},
// MORE ROOT / TUBER
{id:133,n:"Detroit Beet",e:"\u{1F7E3}",cat:"root",bed:"Bed 12",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Classic round red beet. Eat the greens too.",h:["Nitrates","Folate","Betalains"],m:["Blood pressure (well-studied)","Athletic (well-studied)"],comp:["Onion","Lettuce"],avoid:["Pole bean"],cul:"Roasted, pickled",flav:"Sweet, earthy",sow:"",tp:"Sep-Feb & Mar"},
{id:134,n:"Watermelon Radish",e:"\u{1F534}",cat:"root",bed:"Bed 14",stg:"Vegetative",dth:65,ph:"6.0-7.0",tip:"Big mild radish, green outside, pink inside. Fall crop.",h:["Vitamin C","Antioxidants"],m:["Digestive (traditional)"],comp:["Carrot","Lettuce"],avoid:[],cul:"Raw, pickled, slaw",flav:"Mild, sweet",sow:"",tp:"Sep-Oct"},
{id:135,n:"Daikon Radish",e:"\u{1F533}",cat:"root",bed:"Bed 14",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Large Asian radish. Also a great soil-breaking cover crop.",h:["Vitamin C","Digestive enzymes"],m:["Digestive (traditional)","Respiratory (traditional)"],comp:["Carrot"],avoid:[],cul:"Pickled, soups, grated",flav:"Mild, crisp",sow:"",tp:"Aug-Oct"},
{id:136,n:"Turnip",e:"\u{1F7E3}",cat:"root",bed:"Bed 12",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Fast cool-season root. Greens are edible & nutritious.",h:["Vitamin C","Fiber","Glucosinolates"],m:["Anti-inflammatory (emerging)"],comp:["Pea"],avoid:["Potato"],cul:"Roasted, mashed",flav:"Peppery, sweet",sow:"",tp:"Sep-Feb"},
{id:137,n:"Rutabaga",e:"\u{1F7E0}",cat:"root",bed:"Bed 12",stg:"Vegetative",dth:90,ph:"6.0-6.8",tip:"Sweeter than turnip. Needs cool season to size up.",h:["Vitamin C","Potassium","Fiber"],m:["Antioxidant (emerging)"],comp:["Pea","Onion"],avoid:["Potato"],cul:"Mashed, roasted, stews",flav:"Sweet, earthy",sow:"",tp:"Aug-Sep"},
{id:138,n:"Sweet Potato",e:"\u{1F360}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:120,ph:"5.8-6.2",tip:"Plant slips after soil warms. Loves 9b heat. Vines as ground cover.",h:["Beta-carotene","Fiber","Vitamin C"],m:["Blood sugar (emerging)","Eye health (well-studied)"],comp:["Bean"],avoid:[],cul:"Roasted, fries, pie",flav:"Sweet, creamy",sow:"",tp:"May-Jun"},
{id:139,n:"Potato",e:"\u{1F954}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:100,ph:"5.0-6.0",tip:"Plant seed potatoes, hill as they grow. Acidic soil deters scab.",h:["Potassium","Vitamin C","Resistant starch"],m:["Blood pressure (emerging)"],comp:["Bean","Corn"],avoid:["Tomato","Squash"],cul:"Everything",flav:"Earthy, starchy",sow:"",tp:"Feb-Mar"},
{id:140,n:"Ginger",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Vegetative",dth:240,ph:"5.5-6.5",tip:"Plant rhizome pieces in warmth & part shade. Patience.",h:["Gingerol","Anti-inflammatory"],m:["Nausea (well-studied)","Anti-inflammatory (well-studied)","Digestive (well-studied)"],comp:[],avoid:[],cul:"Stir-fry, tea, baking",flav:"Spicy, warm",sow:"",tp:"Mar-Apr"},
{id:141,n:"Turmeric",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Vegetative",dth:240,ph:"5.5-6.5",tip:"Like ginger - warmth, part shade, patience. Harvest in fall.",h:["Curcumin","Antioxidant"],m:["Anti-inflammatory (well-studied)","Joint health (emerging)"],comp:[],avoid:[],cul:"Curry, golden milk",flav:"Earthy, bitter",sow:"",tp:"Mar-Apr"},
{id:142,n:"Kohlrabi",e:"\u{1F7E2}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:55,ph:"6.0-7.5",tip:"Alien-looking bulb. Crisp & sweet. Cool season.",h:["Vitamin C","Fiber","Potassium"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Beet"],avoid:["Tomato"],cul:"Raw, slaw, roasted",flav:"Sweet, like broccoli stem",sow:"Aug",tp:"Sep-Oct"},
// MORE LEGUMES / OTHER
{id:143,n:"Bush Bean",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"No trellis needed. Fixes nitrogen. Succession-sow.",h:["Protein","Fiber","Folate"],m:["Blood sugar (emerging)"],comp:["Corn","Squash","Carrot"],avoid:["Onion","Garlic"],cul:"Steamed, sauteed",flav:"Fresh, green",sow:"",tp:"Mar-Aug"},
{id:144,n:"Pole Bean",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:65,ph:"6.0-7.0",tip:"Needs a trellis - climbs 6+ ft. Higher yield than bush.",h:["Protein","Fiber","Folate"],m:["Blood sugar (emerging)"],comp:["Corn","Squash"],avoid:["Onion","Beet"],cul:"Steamed, stir-fry",flav:"Fresh, green",sow:"",tp:"Mar-Jul"},
{id:145,n:"Snap Pea",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Cool season - sow fall & late winter. Sweet edible pods.",h:["Vitamin C","Vitamin K","Protein"],m:["Antioxidant (emerging)"],comp:["Carrot","Radish"],avoid:["Onion","Garlic"],cul:"Raw, stir-fry",flav:"Sweet, crisp",sow:"",tp:"Sep-Oct & Jan-Feb"},
{id:146,n:"Snow Pea",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Flat edible pods. Cool season. Trellis the vines.",h:["Vitamin C","Vitamin K"],m:["Antioxidant (emerging)"],comp:["Carrot","Radish"],avoid:["Onion"],cul:"Stir-fry, salads",flav:"Sweet, delicate",sow:"",tp:"Sep-Oct & Jan-Feb"},
{id:147,n:"Fava Bean",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:85,ph:"6.0-7.0",tip:"Cool-season nitrogen fixer. Also a great cover crop.",h:["Protein","Folate","Fiber"],m:["Parkinson's L-dopa (emerging)"],comp:["Corn"],avoid:["Onion","Garlic"],cul:"Shelled, stews",flav:"Buttery, nutty",sow:"",tp:"Oct-Nov"},
{id:148,n:"Sweet Corn",e:"\u{1F33D}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Plant in blocks (not rows) for pollination. Heavy feeder.",h:["Fiber","Lutein","Folate"],m:["Eye health (well-studied)"],comp:["Bean","Squash"],avoid:["Tomato"],cul:"Grilled, boiled",flav:"Sweet, juicy",sow:"",tp:"Apr-Jun"},
{id:149,n:"Celery",e:"\u{1F33F}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Long season, thirsty. Cool weather. Blanch for milder stalks.",h:["Vitamin K","Antioxidants","Hydrating"],m:["Blood pressure (emerging)","Anti-inflammatory (emerging)"],comp:["Leek","Tomato"],avoid:["Carrot"],cul:"Soups, raw, stir-fry",flav:"Crisp, savory",sow:"Jul-Aug",tp:"Sep"},
{id:150,n:"Leek",e:"\u{1F9C5}",cat:"allium",bed:"Bed 9",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Hill soil around stems to blanch the white shaft. Long season.",h:["Vitamin K","Antioxidants","Prebiotic"],m:["Cardiovascular (emerging)"],comp:["Carrot","Celery"],avoid:["Bean","Pea"],cul:"Soups, braised",flav:"Mild, sweet onion",sow:"Aug-Sep",tp:"Oct-Nov"},
{id:151,n:"Shallot",e:"\u{1F9C5}",cat:"allium",bed:"Bed 9",stg:"Vegetative",dth:100,ph:"6.0-7.0",tip:"Plant sets in fall. Each bulb multiplies into a cluster.",h:["Antioxidants","Quercetin","Prebiotic"],m:["Cardiovascular (emerging)"],comp:["Carrot","Beet"],avoid:["Bean","Pea"],cul:"Sauces, vinaigrette",flav:"Delicate, sweet onion",sow:"",tp:"Oct-Nov"},
{id:152,n:"Artichoke",e:"\u{1F33F}",cat:"fruiting",bed:"Border",stg:"Perennial",dth:180,ph:"6.5-7.5",tip:"Perennial in 9b - comes back yearly. Big plant, give it room.",h:["Fiber","Antioxidants","Cynarin"],m:["Liver support (emerging)","Cholesterol (emerging)","Digestive (well-studied)"],comp:[],avoid:[],cul:"Steamed, grilled",flav:"Nutty, savory",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:153,n:"Asparagus",e:"\u{1F33F}",cat:"fruiting",bed:"Border",stg:"Perennial",dth:730,ph:"6.5-7.5",tip:"Plant crowns; wait 2-3 years for full harvest. Then 15+ years of spears.",h:["Folate","Vitamin K","Prebiotic inulin"],m:["Diuretic (traditional)","Antioxidant (well-studied)"],comp:["Tomato","Parsley"],avoid:["Onion","Garlic"],cul:"Roasted, grilled",flav:"Grassy, savory",sow:"",tp:"Jan-Feb"},
{id:154,n:"Rhubarb",e:"\u{1F33F}",cat:"fruiting",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-6.8",tip:"Struggles in 9b heat - give afternoon shade. Eat stalks only, leaves are toxic.",h:["Vitamin K","Fiber","Antioxidants"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Pies, compote, jam",flav:"Tart, tangy",sow:"",tp:"Jan-Feb"},
{id:155,n:"Sunflower",e:"\u{1F33B}",cat:"flower",bed:"Border",stg:"Vegetative",dth:80,ph:"6.0-7.5",tip:"Pollinator magnet. Edible seeds. Tall varieties make a summer screen.",h:["Vitamin E seeds","Healthy fats"],m:["Heart health seeds (well-studied)"],comp:["Cucumber","Corn"],avoid:["Potato"],cul:"Seeds roasted",flav:"Nutty seeds",sow:"",tp:"Mar-Jun"},
{id:156,n:"Marigold",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Vegetative",dth:50,ph:"6.0-7.5",tip:"Plant throughout beds - deters nematodes & many pests. Workhorse companion.",h:["Antioxidant lutein"],m:["Skin calendula type (traditional)"],comp:["Tomato","Pepper","Most veg"],avoid:[],cul:"Edible petals (some types)",flav:"Mild, peppery petals",sow:"Feb-Mar",tp:"Mar-May"},
{id:157,n:"Nasturtium",e:"\u{1F9E1}",cat:"flower",bed:"Border",stg:"Vegetative",dth:55,ph:"6.0-7.5",tip:"Edible leaves & flowers, peppery. Trap crop for aphids - lures them off your veg.",h:["Vitamin C","Antioxidants"],m:["Antimicrobial (traditional)"],comp:["Squash","Tomato","Cucumber"],avoid:[],cul:"Salads, peppery flowers",flav:"Peppery, like watercress",sow:"",tp:"Mar-May & Sep"},
{id:158,n:"Calendula",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Vegetative",dth:50,ph:"6.0-7.0",tip:"Pot marigold. Edible petals, medicinal salve. Self-seeds, blooms cool season.",h:["Antioxidant","Anti-inflammatory"],m:["Skin healing (well-studied)","Wound salve (traditional)"],comp:["Tomato","Most veg"],avoid:[],cul:"Petals in salad, rice color",flav:"Mild, saffron-like",sow:"Aug-Sep",tp:"Sep-Oct"},
{id:159,n:"Cosmos",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Vegetative",dth:65,ph:"6.0-7.5",tip:"Airy pollinator flower. Attracts hoverflies & lacewings that eat aphids.",h:["N/A ornamental"],m:["N/A"],comp:["Most veg"],avoid:[],cul:"Ornamental",flav:"N/A",sow:"Feb-Mar",tp:"Mar-May"},
{id:160,n:"Zinnia",e:"\u{1F33A}",cat:"flower",bed:"Border",stg:"Vegetative",dth:65,ph:"6.0-7.5",tip:"Heat-loving cut flower. Butterfly & bee magnet all summer in 9b.",h:["N/A ornamental"],m:["N/A"],comp:["Tomato","Most veg"],avoid:[],cul:"Ornamental",flav:"N/A",sow:"Mar-Apr",tp:"Apr-Jun"},
];

var P3=[
// More herbs & specialty
{id:161,n:"Genovese Basil (Purple)",e:"\u{1F33F}",cat:"herb",bed:"Bed 3",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Purple-leaf basil, same care as green. Pinch flowers.",h:["Anthocyanins","Antibacterial"],m:["Digestive (traditional)"],comp:["Tomato","Pepper"],avoid:["Sage"],cul:"Pesto, garnish",flav:"Sweet, clove-like",sow:"Mar-Apr",tp:"Apr-May"},
{id:162,n:"Thai Basil",e:"\u{1F33F}",cat:"herb",bed:"Bed 3",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Anise-flavored, holds up to heat & cooking better than sweet basil.",h:["Antioxidants","Essential oils"],m:["Digestive (traditional)"],comp:["Tomato","Pepper"],avoid:["Sage"],cul:"Pho, curry, stir-fry",flav:"Anise, spicy",sow:"Mar-Apr",tp:"Apr-May"},
{id:163,n:"Curry Leaf",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:365,ph:"6.0-7.0",tip:"Small tree, tender - protect from frost. Aromatic Indian cooking leaf.",h:["Antioxidants","Iron"],m:["Blood sugar (emerging)","Digestive (traditional)"],comp:[],avoid:[],cul:"Curries, dals, tempering",flav:"Citrusy, nutty",sow:"",tp:"Spring"},
{id:164,n:"Epazote",e:"\u{1F33F}",cat:"herb",bed:"Border",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Mexican herb, traditional with beans (reduces gas). Self-seeds aggressively.",h:["Antioxidants"],m:["Digestive (traditional)","Anti-parasitic (traditional)"],comp:["Bean"],avoid:[],cul:"Beans, quesadillas",flav:"Pungent, citrusy",sow:"",tp:"Mar-May"},
{id:165,n:"Shiso",e:"\u{1F33F}",cat:"herb",bed:"Bed 3",stg:"Vegetative",dth:70,ph:"5.5-6.5",tip:"Japanese perilla. Red or green. Self-seeds. Great in 9b.",h:["Antioxidants","Omega-3"],m:["Anti-inflammatory (emerging)","Allergy (emerging)"],comp:[],avoid:[],cul:"Sushi, wraps, pickles",flav:"Minty, cumin-like",sow:"Mar-Apr",tp:"Apr-May"},
// More fruiting / specialty
{id:166,n:"Sweet 100 Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:65,ph:"6.0-6.8",tip:"Huge yields of cherry tomatoes on long trusses. Stake well.",h:["Lycopene","Vitamin C"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel"],cul:"Snacking, salads",flav:"Very sweet",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:167,n:"San Marzano Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:80,ph:"6.0-6.8",tip:"The legendary sauce tomato. Long, meaty paste type.",h:["Lycopene","Low moisture"],m:["Cardiovascular (well-studied)"],comp:["Basil"],avoid:["Fennel"],cul:"Sauce, canning",flav:"Sweet, low-acid",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:168,n:"Anaheim Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Mild chile, great for roasting. Classic SoCal pepper.",h:["Vitamin C","Capsaicin"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Roasted, chiles rellenos",flav:"Mild, smoky",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:169,n:"Poblano Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Mild, dark green. Dried = ancho. Loves 9b heat.",h:["Vitamin C","Antioxidants"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Rellenos, mole, roasting",flav:"Mild, earthy",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:170,n:"Cayenne Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:80,ph:"6.0-6.8",tip:"Dry & grind for powder. Productive in heat.",h:["Capsaicin","Vitamin C"],m:["Metabolism (well-studied)","Pain topical (FDA)","Circulation (emerging)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Hot sauce, dried powder",flav:"Hot, sharp",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:171,n:"Crookneck Squash",e:"\u{1F952}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:50,ph:"6.0-7.5",tip:"Yellow summer squash. Pick small & often.",h:["Vitamin C","Manganese"],m:["Blood sugar (emerging)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Sauteed, grilled",flav:"Mild, buttery",sow:"",tp:"Apr-Jul"},
{id:172,n:"Spaghetti Squash",e:"\u{1F360}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:90,ph:"6.0-7.0",tip:"Flesh shreds into strands. Stores for months.",h:["Fiber","Vitamin C","Low-carb"],m:["Blood sugar (emerging)"],comp:["Corn","Bean"],avoid:["Potato"],cul:"Roasted as pasta sub",flav:"Mild, nutty",sow:"",tp:"Apr-Jun"},
{id:173,n:"Honeydew Melon",e:"\u{1F348}",cat:"fruiting",bed:"Bed 7",stg:"Vegetative",dth:85,ph:"6.0-6.8",tip:"Heat-lover. Ripe when blossom end softens & smells sweet.",h:["Vitamin C","Potassium"],m:["Hydration (well-studied)"],comp:["Corn","Nasturtium"],avoid:["Potato"],cul:"Fresh, smoothies",flav:"Sweet, mellow",sow:"Mar-Apr",tp:"May-Jun"},
{id:174,n:"Luffa Gourd",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Eat young like zucchini, or dry mature for sponges! Long season - 9b is ideal.",h:["Fiber","Vitamin C"],m:["N/A"],comp:["Corn"],avoid:["Potato"],cul:"Young: stir-fry. Mature: sponge",flav:"Mild like zucchini",sow:"Mar-Apr",tp:"May-Jun"},
// More leafy
{id:175,n:"Tatsoi",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:45,ph:"6.0-7.0",tip:"Spoon-shaped Asian green, cold-hardy. Mild mustard flavor.",h:["Vitamin A & C","Calcium"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Salads, stir-fry",flav:"Mild, mustardy",sow:"Aug-Sep",tp:"Sep-Jan"},
{id:176,n:"Mizuna",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:40,ph:"6.0-7.0",tip:"Feathery Japanese green. Fast, cut-and-come-again.",h:["Vitamin A & C","Folate"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Salads, stir-fry",flav:"Peppery, mild",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:177,n:"Escarole",e:"\u{1F96C}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:70,ph:"6.0-6.8",tip:"Broad-leaf chicory, milder than endive. Cool season.",h:["Vitamin K","Folate","Fiber"],m:["Digestive (traditional)"],comp:["Carrot"],avoid:[],cul:"Braised, soups, salads",flav:"Slightly bitter",sow:"Aug-Sep",tp:"Sep-Oct"},
{id:178,n:"Sorrel",e:"\u{1F33F}",cat:"leafy",bed:"Border",stg:"Perennial",dth:60,ph:"5.5-6.8",tip:"Perennial lemony green. Cut leaves as needed for years.",h:["Vitamin C","Antioxidants"],m:["Diuretic (traditional)"],comp:[],avoid:[],cul:"Soups, sauces, salads",flav:"Tart, lemony",sow:"Feb-Mar",tp:"Mar-Apr"},
{id:179,n:"New Zealand Spinach",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Heat-tolerant spinach substitute - thrives when real spinach bolts. Summer green for 9b.",h:["Vitamin A & C","Iron"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Cooked like spinach",flav:"Mild, succulent",sow:"Mar-Apr",tp:"Apr-Jun"},
{id:180,n:"Malabar Spinach",e:"\u{1F96C}",cat:"leafy",bed:"Bed 6",stg:"Vegetative",dth:70,ph:"6.0-7.0",tip:"Climbing heat-loving green. Thrives in 9b summer when others bolt. Trellis it.",h:["Vitamin A & C","Iron","Calcium"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Stir-fry, curries",flav:"Mild, juicy",sow:"Mar-Apr",tp:"May-Jun"},
// More roots & brassicas
{id:181,n:"Parsnip",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Long season. Sweetens after cool weather. Fresh seed only - it doesn't keep.",h:["Fiber","Vitamin C","Folate"],m:["Digestive (traditional)"],comp:["Pea","Radish"],avoid:["Carrot"],cul:"Roasted, mashed, soups",flav:"Sweet, nutty",sow:"",tp:"Aug-Sep"},
{id:182,n:"Celeriac",e:"\u{1F955}",cat:"root",bed:"Bed 12",stg:"Vegetative",dth:110,ph:"6.0-7.0",tip:"Celery root. Knobby but delicious. Long cool season.",h:["Vitamin K","Fiber","Phosphorus"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Mashed, soups, remoulade",flav:"Celery-nutty",sow:"Jul-Aug",tp:"Sep"},
{id:183,n:"Horseradish",e:"\u{1F33F}",cat:"root",bed:"Container",stg:"Perennial",dth:150,ph:"6.0-7.0",tip:"Aggressive spreader - container only! Dig roots in fall.",h:["Glucosinolates","Vitamin C"],m:["Sinus (traditional)","Antibacterial (emerging)"],comp:["Potato"],avoid:[],cul:"Grated condiment, sauces",flav:"Pungent, fiery",sow:"",tp:"Feb-Mar"},
{id:184,n:"Romanesco",e:"\u{1F966}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:80,ph:"6.0-7.0",tip:"Fractal lime-green heads. Like cauliflower. Cool season, needs steady moisture.",h:["Vitamin C & K","Fiber"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Beet"],avoid:["Strawberry"],cul:"Roasted, steamed",flav:"Nutty, sweet",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:185,n:"Brussels Sprouts",e:"\u{1F966}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:100,ph:"6.0-7.5",tip:"Long cool season. Sprouts sweeten after light frost. Patience required.",h:["Vitamin K & C","Sulforaphane"],m:["Anti-inflammatory (well-studied)","Cancer-protective (emerging)"],comp:["Onion","Dill"],avoid:["Strawberry"],cul:"Roasted, shredded",flav:"Nutty, sweet",sow:"Jun-Jul",tp:"Aug-Sep"},
// More legumes & misc
{id:186,n:"Lima Bean",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Heat-loving butterbean. Bush or pole types. Fixes nitrogen.",h:["Protein","Fiber","Iron"],m:["Blood sugar (emerging)"],comp:["Corn","Squash"],avoid:["Onion"],cul:"Succotash, stews",flav:"Buttery, starchy",sow:"",tp:"Apr-Jun"},
{id:187,n:"Black-Eyed Pea",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:70,ph:"5.8-7.0",tip:"Cowpea - thrives in heat & poor soil. Excellent nitrogen fixer & cover crop.",h:["Protein","Folate","Fiber"],m:["Blood sugar (emerging)"],comp:["Corn","Squash"],avoid:["Onion"],cul:"Hoppin' John, stews",flav:"Earthy, creamy",sow:"",tp:"Apr-Jun"},
{id:188,n:"Edamame",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:80,ph:"6.0-6.8",tip:"Soybeans for fresh eating. Pick pods plump but green.",h:["Complete protein","Folate","Fiber"],m:["Heart health (well-studied)","Bone (emerging)"],comp:["Corn"],avoid:["Onion","Garlic"],cul:"Steamed, salted",flav:"Buttery, nutty",sow:"",tp:"Apr-Jun"},
{id:189,n:"Peanut",e:"\u{1FAD8}",cat:"legume",bed:"Bed 10",stg:"Vegetative",dth:130,ph:"5.8-6.2",tip:"Pegs bury into soil to form nuts. Needs long hot 9b season & loose soil.",h:["Protein","Healthy fats","Niacin"],m:["Heart health (well-studied)"],comp:["Corn"],avoid:[],cul:"Roasted, boiled",flav:"Rich, nutty",sow:"",tp:"Apr-May"},
{id:190,n:"Chickpea",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:100,ph:"6.0-7.0",tip:"Garbanzo. Cool-season legume, drought-tolerant. Fixes nitrogen.",h:["Protein","Fiber","Folate"],m:["Blood sugar (well-studied)","Cholesterol (emerging)"],comp:[],avoid:["Garlic"],cul:"Hummus, curries, roasted",flav:"Nutty, creamy",sow:"",tp:"Feb-Mar"},
{id:191,n:"Strawberry (Everbearing)",e:"\u{1F353}",cat:"berry",bed:"Bed 7",stg:"Perennial",dth:120,ph:"5.5-6.5",tip:"Fruits spring & fall in 9b. Renew beds every 3 years. Mulch to keep fruit clean.",h:["Vitamin C","Antioxidants","Folate"],m:["Heart health (well-studied)","Antioxidant (well-studied)"],comp:["Borage","Spinach","Thyme"],avoid:["Brassicas"],cul:"Fresh, jam, desserts",flav:"Sweet, classic",sow:"",tp:"Oct-Nov & Feb"},
{id:192,n:"Cape Gooseberry",e:"\u{1F7E0}",cat:"berry",bed:"Border",stg:"Vegetative",dth:100,ph:"6.0-6.8",tip:"Husk-wrapped golden berries (physalis). Tender perennial in 9b.",h:["Vitamin C","Beta-carotene","Antioxidants"],m:["Anti-inflammatory (emerging)"],comp:[],avoid:[],cul:"Fresh, jam, dipped",flav:"Sweet-tart, tropical",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:193,n:"Goji Berry",e:"\u{1FAD0}",cat:"berry",bed:"Border",stg:"Perennial",dth:365,ph:"6.5-8.0",tip:"Hardy shrub, drought & heat tolerant. Tolerates alkaline SoCal soil.",h:["Antioxidants","Vitamin A","Zeaxanthin"],m:["Eye health (emerging)","Immune (emerging)"],comp:[],avoid:[],cul:"Dried, tea, smoothies",flav:"Sweet-tart",sow:"",tp:"Feb-Mar"},
{id:194,n:"Grape Vine",e:"\u{1F347}",cat:"tree",bed:"Border",stg:"Perennial",dth:730,ph:"5.5-7.0",tip:"Needs a sturdy trellis & winter pruning. Thrives in 9b heat. Table or wine types.",h:["Resveratrol","Antioxidants","Vitamin K"],m:["Cardiovascular (emerging)"],comp:[],avoid:[],cul:"Fresh, raisins, juice",flav:"Sweet, juicy",sow:"",tp:"Jan-Feb"},
{id:195,n:"Passion Fruit",e:"\u{1F7E3}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.5-7.5",tip:"Vigorous vine, needs strong support. Tender - protect from frost. Loves 9b.",h:["Vitamin C","Fiber","Antioxidants"],m:["Anxiety leaves (emerging)","Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, juice, desserts",flav:"Tart, tropical, aromatic",sow:"",tp:"Mar-Apr"},
{id:196,n:"Dragon Fruit",e:"\u{1F432}",cat:"tree",bed:"Container",stg:"Perennial",dth:365,ph:"6.0-7.0",tip:"Climbing cactus - needs a sturdy post. Thrives in 9b heat, protect below 32F. Stunning night blooms.",h:["Vitamin C","Antioxidants","Fiber"],m:["Antioxidant (emerging)","Blood sugar (emerging)"],comp:[],avoid:[],cul:"Fresh, smoothies",flav:"Mild, kiwi-like",sow:"",tp:"Spring"},
{id:197,n:"Guava",e:"\u{1F7E2}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-7.0",tip:"Tropical tree, does well in 9b with frost protection when young. Very productive.",h:["4x orange vitamin C","Fiber","Lycopene"],m:["Immune (well-studied)","Blood sugar leaves (emerging)"],comp:[],avoid:[],cul:"Fresh, juice, paste",flav:"Sweet, floral",sow:"",tp:"Spring"},
{id:198,n:"Loquat",e:"\u{1F7E0}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.0",tip:"Evergreen, very low-maintenance. Fruits in spring when little else does. Great 9b tree.",h:["Vitamin A","Potassium","Antioxidants"],m:["Respiratory leaves (traditional)"],comp:[],avoid:[],cul:"Fresh, jam, poached",flav:"Sweet-tart, apricot-like",sow:"",tp:"Winter"},
{id:199,n:"Kumquat",e:"\u{1F34A}",cat:"citrus",bed:"Container",stg:"Perennial",dth:300,ph:"6.0-7.0",tip:"Eat whole - sweet peel, tart flesh. Cold-hardiest citrus. Great in containers.",h:["Vitamin C","Fiber","Antioxidants"],m:["Immune (well-studied)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Fresh whole, marmalade, candied",flav:"Sweet peel, tart center",sow:"",tp:"Spring"},
{id:200,n:"Mandarin Orange",e:"\u{1F34A}",cat:"citrus",bed:"Border",stg:"Perennial",dth:270,ph:"6.0-7.0",tip:"Easy-peel, sweet. Satsuma types are cold-hardy & seedless. Perfect 9b citrus.",h:["Vitamin C","Beta-cryptoxanthin"],m:["Immune (well-studied)","Bone (emerging)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Fresh, segments",flav:"Sweet, fragrant",sow:"",tp:"Spring"},
];

var P4=[
{id:201,n:"Dinosaur Kale",e:"\u{1F957}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Same as Lacinato. Bumpy blue-green leaves, very cold-hardy.",h:["Vitamin K","Calcium","Sulforaphane"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Garlic"],avoid:["Strawberry"],cul:"Chips, salads, soups",flav:"Nutty, sweet",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:202,n:"Red Russian Kale",e:"\u{1F957}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:55,ph:"6.0-7.5",tip:"Tender, frilly purple-veined leaves. Sweetest kale raw.",h:["Vitamin K & C","Antioxidants"],m:["Anti-inflammatory (well-studied)"],comp:["Onion"],avoid:["Strawberry"],cul:"Salads, smoothies",flav:"Mild, sweet",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:203,n:"Purple Cauliflower",e:"\u{1F966}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Anthocyanin-rich. Cool season. Color fades if overcooked.",h:["Anthocyanins","Vitamin C"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Beet"],avoid:["Strawberry"],cul:"Roasted, raw",flav:"Mild, nutty",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:204,n:"Broccolini",e:"\u{1F966}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Tender stems, small heads, keeps producing side shoots. Cut-and-come-again.",h:["Vitamin C & K","Folate"],m:["Anti-inflammatory (well-studied)"],comp:["Onion","Dill"],avoid:["Strawberry"],cul:"Sauteed, roasted",flav:"Sweet, mild",sow:"Jul-Aug",tp:"Aug-Sep"},
{id:205,n:"Pak Choi (Baby)",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Vegetative",dth:40,ph:"6.0-7.5",tip:"Mini bok choy, harvest whole. Fast cool-season crop.",h:["Vitamin A & C","Calcium"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Stir-fry, grilled",flav:"Mild, juicy",sow:"Aug-Sep",tp:"Sep-Jan"},
{id:206,n:"Microgreens Mix",e:"\u{1F331}",cat:"leafy",bed:"Container",stg:"Vegetative",dth:14,ph:"6.0-7.0",tip:"Harvest at 1-2in, 7-14 days. Grow indoors year-round on a tray.",h:["Concentrated nutrients","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Garnish, salads, sandwiches",flav:"Varies by mix",sow:"Year-round",tp:"Year-round"},
{id:207,n:"Pea Shoots",e:"\u{1F331}",cat:"legume",bed:"Container",stg:"Vegetative",dth:21,ph:"6.0-7.0",tip:"Sweet tendrils & leaves, harvest young. Quick & easy.",h:["Vitamin C","Folate","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Salads, stir-fry",flav:"Sweet, pea-like",sow:"Year-round",tp:"Sep-Mar"},
{id:208,n:"Cucamelon",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Vegetative",dth:70,ph:"6.0-7.0",tip:"Grape-sized cukes that look like tiny watermelons. Heat-tolerant, vigorous vine.",h:["Vitamin C","Antioxidants"],m:["Hydration (well-studied)"],comp:["Bean"],avoid:[],cul:"Fresh, pickled",flav:"Cucumber-lime",sow:"Mar-Apr",tp:"May-Jun"},
{id:209,n:"Yard-Long Bean",e:"\u{1FAD8}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:80,ph:"6.0-7.0",tip:"Asian climbing bean, pods up to 18in! Loves 9b heat. Trellis it.",h:["Protein","Vitamin A","Folate"],m:["Blood sugar (emerging)"],comp:["Corn"],avoid:["Onion"],cul:"Stir-fry, curries",flav:"Dense, nutty",sow:"",tp:"May-Jun"},
{id:210,n:"Bitter Melon",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Vegetative",dth:90,ph:"6.0-6.8",tip:"Warty Asian gourd, very bitter. Thrives in 9b heat. Trellis the vine.",h:["Vitamin C","Antioxidants"],m:["Blood sugar (emerging)","Diabetes traditional (emerging)"],comp:[],avoid:[],cul:"Stir-fry, stuffed, curries",flav:"Intensely bitter",sow:"Mar-Apr",tp:"May-Jun"},
{id:211,n:"Sage (Pineapple)",e:"\u{1F33F}",cat:"herb",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"Red flowers loved by hummingbirds. Pineapple-scented leaves.",h:["Antioxidants"],m:["Calming tea (traditional)"],comp:["Rosemary"],avoid:["Cucumber"],cul:"Tea, garnish, desserts",flav:"Pineapple, sweet",sow:"",tp:"Mar-Apr"},
{id:212,n:"Garlic Chives",e:"\u{1F33F}",cat:"herb",bed:"Edges",stg:"Perennial",dth:80,ph:"6.0-7.0",tip:"Flat leaves, mild garlic flavor. White flowers attract pollinators.",h:["Allicin","Vitamin K"],m:["Antimicrobial (emerging)"],comp:["Carrot","Rose"],avoid:["Bean"],cul:"Stir-fry, dumplings, garnish",flav:"Mild garlic",sow:"Feb-Mar",tp:"Mar-Apr"},
];

// ─── ORCHARD: TREE VARIETY CATALOG (maxed out, low-chill 9b focus) ───
// Grouped by type; pick a variety to add to your orchard. Includes chill hours & notes.
var TREECAT=[
{type:"Peach",e:"\u{1F351}",v:[
  {n:"Eva's Pride",chill:"100-200",note:"Low-chill, heavy bearer, sweet yellow freestone. Perfect for SoCal."},
  {n:"Eva's Donut (Saturn)",chill:"200-300",note:"Flat donut peach, white sweet flesh, low-acid. Stunning flavor."},
  {n:"Babcock",chill:"250",note:"White, honey-sweet, melting flesh. SoCal classic."},
  {n:"Mid-Pride",chill:"250",note:"Yellow freestone, excellent flavor, very reliable in heat."},
  {n:"August Pride",chill:"250",note:"Late-season yellow freestone, ripens when others are done."},
  {n:"Tropic Snow",chill:"200",note:"White freestone, very low-chill, early ripening."},
  {n:"Florida Prince",chill:"150",note:"Very low-chill, early yellow peach for mild winters."},
  {n:"Donut White (Stark Saturn)",chill:"400",note:"Classic donut shape, sugary white flesh."},
]},
{type:"Nectarine",e:"\u{1F351}",v:[
  {n:"Double Delight",chill:"300",note:"Double-duty: gorgeous double-pink blooms + rich sweet fruit."},
  {n:"Snow Queen",chill:"250-300",note:"White freestone, juicy, melt-in-mouth. Low-chill star."},
  {n:"Panamint",chill:"250",note:"Yellow freestone, red skin, very heat-tolerant."},
  {n:"Arctic Star",chill:"300",note:"White, sub-acid, one of the best low-chill nectarines."},
  {n:"Goldmine",chill:"400",note:"Old California white-flesh heirloom, freestone, sweet."},
  {n:"Desert Delight",chill:"250",note:"Very low-chill, early, yellow freestone."},
]},
{type:"Apricot",e:"\u{1F7E0}",v:[
  {n:"Blenheim (Royal)",chill:"400",note:"THE iconic California apricot. Aromatic, sweet-tart. Thin aggressively."},
  {n:"Golden (Gold Kist)",chill:"300",note:"Early, low-chill, sweet golden fruit. Reliable producer."},
  {n:"Katy",chill:"200-300",note:"Very low-chill, mild sweet, heavy early crop."},
  {n:"Royal Rosa",chill:"300",note:"Disease-resistant, sweet, good for mild climates."},
  {n:"Tropic Gold",chill:"200",note:"Very low-chill, freestone, for warm winters."},
  {n:"Autumn Royal",chill:"350",note:"Rare late-season apricot, extends the harvest."},
]},
{type:"Plum",e:"\u{1F7E3}",v:[
  {n:"Santa Rosa",chill:"300",note:"Burbank classic, sweet-tart, juicy. Self-fertile. SoCal favorite."},
  {n:"Satsuma",chill:"300",note:"Blood plum, sweet red flesh, great for jam."},
  {n:"Methley",chill:"250",note:"Very low-chill, sweet, self-fertile, reliable."},
  {n:"Burgundy",chill:"250",note:"Deep red flesh, sweet, low-chill, small tree."},
  {n:"Beauty",chill:"250",note:"Early, low-chill, sweet-tart, self-fertile."},
  {n:"Green Gage",chill:"500",note:"Heirloom dessert plum, honey-sweet. Higher chill."},
]},
{type:"Pluot",e:"\u{1F7E3}",v:[
  {n:"Flavor King",chill:"400",note:"Plum-apricot cross, intensely sweet, fans rave about it."},
  {n:"Dapple Dandy (Dinosaur Egg)",chill:"400-500",note:"Mottled skin, sweet-tart, huge flavor."},
  {n:"Flavor Supreme",chill:"200-300",note:"Low-chill pluot, green-red skin, sweet."},
  {n:"Splash",chill:"400",note:"Small, super-sweet, orange flesh."},
]},
{type:"Apple",e:"\u{1F34E}",v:[
  {n:"Anna",chill:"200",note:"Low-chill, fruits in 9b! Needs pollinator (Dorsett). Can fruit twice."},
  {n:"Dorsett Golden",chill:"100",note:"Low-chill golden apple, great pollinator for Anna."},
  {n:"Fuji (Low-Chill)",chill:"300-400",note:"Crisp, sweet, stores well. Select low-chill strain."},
  {n:"Gala",chill:"300-500",note:"Sweet, crisp, popular. Low-chill strains available."},
  {n:"Pink Lady",chill:"300-400",note:"Sweet-tart, late, excellent keeper."},
  {n:"Beverly Hills",chill:"300",note:"Old LA backyard apple, low-chill, tangy-sweet."},
  {n:"Granny Smith",chill:"400",note:"Tart green classic, good in mild climates."},
]},
{type:"Pear",e:"\u{1F350}",v:[
  {n:"Hood",chill:"100-200",note:"Very low-chill, large sweet pear, needs pollinator."},
  {n:"Flordahome",chill:"150",note:"Low-chill, good pollinator for Hood."},
  {n:"Kieffer",chill:"300",note:"Vigorous, fire-blight resistant, good for canning."},
  {n:"Asian (20th Century)",chill:"300-400",note:"Crisp, juicy, apple-like Asian pear."},
  {n:"Bartlett",chill:"500",note:"Classic sweet pear, higher chill but worth it."},
]},
{type:"Citrus",e:"\u{1F34A}",v:[
  {n:"Improved Meyer Lemon",chill:"0",note:"Sweeter, floral, edible peel. Most cold-hardy. Feed Feb/May/Aug."},
  {n:"Washington Navel Orange",chill:"0",note:"Classic SoCal, sweet, seedless. Dec-Mar harvest."},
  {n:"Bearss Lime",chill:"0",note:"Thornless, seedless Persian lime. Year-round fruit."},
  {n:"Kumquat (Nagami)",chill:"0",note:"Eat whole - sweet peel, tart flesh. Container-friendly."},
  {n:"Satsuma Mandarin",chill:"0",note:"Easy-peel, seedless, cold-hardy, very sweet."},
  {n:"Eureka Lemon",chill:"0",note:"Classic grocery lemon, year-round, true tart."},
  {n:"Blood Orange (Moro)",chill:"0",note:"Crimson flesh, berry notes. Needs cool nights for color."},
  {n:"Ruby Red Grapefruit",chill:"0",note:"Sweet-tart pink flesh, loves heat."},
  {n:"Oroblanco",chill:"0",note:"Sweet seedless grapefruit hybrid, low-acid."},
  {n:"Tangelo (Minneola)",chill:"0",note:"Tangerine-grapefruit cross, bell-shaped, juicy."},
  {n:"Calamansi",chill:"0",note:"Filipino sour citrus, container star, very productive."},
  {n:"Buddha's Hand",chill:"0",note:"Fingered citron, fragrant zest, conversation piece."},
]},
{type:"Fig",e:"\u{1FAD2}",v:[
  {n:"Black Mission",chill:"100",note:"Honey-sweet, jammy, two crops. Thrives on neglect in 9b."},
  {n:"Brown Turkey",chill:"100",note:"Reliable, sweet, good for beginners. Heavy producer."},
  {n:"Kadota",chill:"100",note:"Green-skinned, amber flesh, great fresh or dried."},
  {n:"Violette de Bordeaux",chill:"100",note:"Compact, rich berry flavor, container-friendly."},
  {n:"Panache (Tiger)",chill:"100",note:"Striped skin, strawberry-jam flesh. Stunning."},
  {n:"Desert King",chill:"100",note:"Huge breba crop, sweet, reliable in dry climates."},
]},
{type:"Avocado",e:"\u{1F951}",v:[
  {n:"Hass",chill:"0",note:"The classic. Type A. Plant on a mound, protect young trees from frost."},
  {n:"Fuerte",chill:"0",note:"Type B - pairs with Hass for max yield. Buttery, cold-tolerant."},
  {n:"Bacon",chill:"0",note:"Cold-hardy (down to 25F), early, mild flavor."},
  {n:"Reed",chill:"0",note:"Large round fruit, summer harvest, rich flavor."},
  {n:"Pinkerton",chill:"0",note:"Long-neck, easy-peel, heavy early producer."},
  {n:"Mexicola Grande",chill:"0",note:"Very cold-hardy, small fruit with edible skin."},
]},
{type:"Persimmon",e:"\u{1F36F}",v:[
  {n:"Fuyu",chill:"200",note:"Non-astringent - eat firm like an apple. Gorgeous fall foliage."},
  {n:"Hachiya",chill:"200",note:"Astringent - must be jelly-soft ripe. Great for baking."},
  {n:"Chocolate",chill:"200",note:"Spicy-sweet brown-flesh, non-astringent when pollinated."},
  {n:"Jiro",chill:"200",note:"Non-astringent, flattened, sweet, reliable."},
]},
{type:"Pomegranate",e:"\u{1F33A}",v:[
  {n:"Wonderful",chill:"150",note:"The classic - large, sweet-tart, juicy arils. Loves 9b heat."},
  {n:"Eversweet",chill:"150",note:"Sweet, nearly seedless, light-colored juice that won't stain."},
  {n:"Angel Red",chill:"150",note:"Very early, soft seeds, abundant juice."},
  {n:"Parfianka",chill:"150",note:"Connoisseur favorite, sweet with wine notes, edible seeds."},
]},
{type:"Berry & Vine",e:"\u{1FAD0}",v:[
  {n:"Blueberry (Sunshine Blue)",chill:"150",note:"Low-chill southern highbush. NEEDS acidic soil pH 4.5-5.5 - grow in containers."},
  {n:"Blueberry (Misty)",chill:"150",note:"Low-chill, sweet, evergreen in mild winters."},
  {n:"Blackberry (Triple Crown)",chill:"0",note:"Thornless, huge yields, sweet. Trellis it."},
  {n:"Raspberry (Bababerry)",chill:"0",note:"Heat-tolerant raspberry bred for SoCal."},
  {n:"Grape (Flame Seedless)",chill:"100",note:"Crisp red table grape, vigorous, loves heat."},
  {n:"Grape (Thompson Seedless)",chill:"100",note:"Classic green table/raisin grape."},
  {n:"Passion Fruit",chill:"0",note:"Vigorous vine, tart-tropical fruit. Protect from frost."},
  {n:"Goji Berry",chill:"0",note:"Hardy, drought-tolerant, antioxidant superfruit."},
]},
{type:"Exotic",e:"\u{1F432}",v:[
  {n:"Loquat",chill:"100",note:"Evergreen, spring fruit, very low-maintenance. Great 9b tree."},
  {n:"Guava (Tropical)",chill:"0",note:"4x orange vitamin C. Frost-protect when young."},
  {n:"Dragon Fruit",chill:"0",note:"Climbing cactus, stunning night blooms. Needs a post."},
  {n:"Cherimoya",chill:"50",note:"Custard apple, sublime tropical flavor. Hand-pollinate."},
  {n:"Mulberry (Pakistan)",chill:"200",note:"Long sweet berries, fast-growing, very productive."},
  {n:"Jujube (Li)",chill:"100",note:"Chinese date, crisp-sweet, extremely heat & drought tough."},
  {n:"Feijoa (Pineapple Guava)",chill:"100",note:"Edible flowers + fruit, evergreen hedge, low-care."},
]},
];
// flatten for lookup
function findTreeVariety(typeName, varName){var t=TREECAT.find(function(x){return x.type===typeName});if(!t)return null;return t.v.find(function(v){return v.n===varName})}

// ─── LIBRARY EXPANSION P5 (toward 250+, rarer & Pro-tier depth) ───
var P5=[
// RARE/EXOTIC FRUIT (9b can grow these)
{id:213,n:"Yuzu",e:"\u{1F34B}",cat:"citrus",bed:"Container",stg:"Perennial",dth:300,ph:"6.0-7.0",tip:"Cold-hardiest aromatic citrus. Prized zest in Japanese cooking. Thorny but worth it.",h:["Vitamin C","Antioxidants"],m:["Immune (well-studied)","Circulation yuzu bath (traditional)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Zest, ponzu, marmalade",flav:"Tart, floral, grapefruit-mandarin",sow:"",tp:"Spring"},
{id:214,n:"Finger Lime",e:"\u{1F7E2}",cat:"citrus",bed:"Container",stg:"Perennial",dth:300,ph:"6.0-7.0",tip:"Australian native - 'citrus caviar.' Pearls burst like bubbles. Compact thorny shrub.",h:["Vitamin C","Antioxidants"],m:["Antioxidant (emerging)"],comp:["Lavender"],avoid:[],cul:"Garnish, seafood, cocktails",flav:"Tangy lime pearls",sow:"",tp:"Spring"},
{id:215,n:"Sapote (White)",e:"\u{1F7E2}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.5",tip:"Custard-like subtropical fruit. Thrives in SoCal. Can get large - prune to size.",h:["Vitamin C","Potassium"],m:["Sleep aid traditional (emerging)"],comp:[],avoid:[],cul:"Fresh, smoothies",flav:"Sweet, custard, pear-vanilla",sow:"",tp:"Spring"},
{id:216,n:"Black Sapote",e:"\u{1F7EB}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.5",tip:"'Chocolate pudding fruit' - flesh tastes like chocolate custard when ripe. Frost-tender.",h:["4x orange vitamin C","Potassium"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, desserts, mousse",flav:"Chocolate pudding",sow:"",tp:"Spring"},
{id:217,n:"Jaboticaba",e:"\u{1F7E3}",cat:"tree",bed:"Container",stg:"Perennial",dth:730,ph:"5.5-6.5",tip:"Bizarre & wonderful - grape-like fruit grows ON the trunk. Slow but long-lived.",h:["Antioxidants","Vitamin C"],m:["Anti-inflammatory (emerging)"],comp:[],avoid:[],cul:"Fresh, jelly, wine",flav:"Sweet grape-lychee",sow:"",tp:"Spring"},
{id:218,n:"Longan",e:"\u{1F7E4}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-6.5",tip:"'Dragon eye' - lychee relative, more heat & cold tolerant. Translucent sweet flesh.",h:["Vitamin C","Potassium"],m:["Calming traditional (emerging)"],comp:[],avoid:[],cul:"Fresh, dried, desserts",flav:"Sweet, musky, floral",sow:"",tp:"Spring"},
{id:219,n:"Lychee",e:"\u{1F534}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-6.5",tip:"Needs winter chill below 68F to flower. Mariola & Sweet Cliff do best in SoCal.",h:["Vitamin C","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, cocktails, sorbet",flav:"Floral, sweet, rose",sow:"",tp:"Spring"},
{id:220,n:"Mango",e:"\u{1F96D}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-7.5",tip:"Manila & Keitt fruit in warm SoCal pockets. Protect from frost. Full sun, well-drained.",h:["Vitamin A & C","Fiber"],m:["Digestive (emerging)","Eye health (well-studied)"],comp:[],avoid:[],cul:"Fresh, chutney, smoothies",flav:"Tropical, sweet, resinous",sow:"",tp:"Spring"},
{id:221,n:"Banana (Dwarf)",e:"\u{1F34C}",cat:"tree",bed:"Container",stg:"Perennial",dth:365,ph:"5.5-7.0",tip:"Dwarf Cavendish & Ice Cream fruit in 9b. Big tropical look. Protect from frost & wind.",h:["Potassium","Vitamin B6","Fiber"],m:["Heart health (well-studied)","Digestive (well-studied)"],comp:[],avoid:[],cul:"Fresh, baking, fried",flav:"Sweet, creamy",sow:"",tp:"Spring"},
{id:222,n:"Pineapple",e:"\u{1F34D}",cat:"fruiting",bed:"Container",stg:"Perennial",dth:540,ph:"5.5-6.5",tip:"Grow from a grocery-store top! Takes ~2 years. Loves heat, drought-tolerant.",h:["Bromelain","Vitamin C","Manganese"],m:["Anti-inflammatory bromelain (well-studied)","Digestive (well-studied)"],comp:[],avoid:[],cul:"Fresh, grilled, juice",flav:"Sweet-tart, tropical",sow:"",tp:"Spring"},
{id:223,n:"Surinam Cherry",e:"\u{1F534}",cat:"berry",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-7.0",tip:"Ribbed jewel-like fruit on an evergreen hedge. Very easy in 9b. Drought-tolerant.",h:["Vitamin C","Vitamin A","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, jam",flav:"Sweet-tart, resinous",sow:"",tp:"Spring"},
{id:224,n:"Natal Plum",e:"\u{1F534}",cat:"berry",bed:"Border",stg:"Perennial",dth:300,ph:"6.0-7.5",tip:"Carissa - thorny coastal hedge, salt & drought tough. Edible cranberry-like fruit.",h:["Vitamin C","Magnesium"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, jam, sauce",flav:"Sweet-tart, cranberry",sow:"",tp:"Spring"},
{id:225,n:"Mulberry (Dwarf Everbearing)",e:"\u{1FAD0}",cat:"tree",bed:"Container",stg:"Perennial",dth:365,ph:"5.5-7.0",tip:"Fruits months on end. Dwarf fits a container or small yard. Birds love it too.",h:["Iron","Vitamin C","Resveratrol"],m:["Blood sugar (emerging)","Antioxidant (well-studied)"],comp:[],avoid:[],cul:"Fresh, jam, pies",flav:"Sweet, berry, honey",sow:"",tp:"Winter"},
// UNUSUAL VEG & GREENS
{id:226,n:"Romanesco Zucchini",e:"\u{1F952}",cat:"fruiting",bed:"Bed 5",stg:"Vegetative",dth:55,ph:"6.0-7.5",tip:"Ribbed Italian heirloom zucchini - nutty, firm, gorgeous. Pick at 6-8in.",h:["Vitamin C","Potassium"],m:["Hydration (well-studied)"],comp:["Corn","Bean","Nasturtium"],avoid:["Potato"],cul:"Grilled, sauteed, pasta",flav:"Nutty, firm",sow:"",tp:"Apr-Jul"},
{id:227,n:"Cardoon",e:"\u{1F33F}",cat:"leafy",bed:"Border",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Artichoke relative grown for edible stalks. Architectural, silver, dramatic. Blanch stems.",h:["Fiber","Antioxidants","Potassium"],m:["Liver support (emerging)","Digestive (traditional)"],comp:[],avoid:[],cul:"Braised, gratin, fried",flav:"Artichoke-celery",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:228,n:"Tomatillo (Purple)",e:"\u{1F7E3}",cat:"fruiting",bed:"Bed 2",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Sweeter & more ornamental than green. Purple blush. Plant two for pollination.",h:["Vitamin C","Anthocyanins"],m:["Antibacterial (emerging)"],comp:["Pepper","Basil"],avoid:["Fennel"],cul:"Salsa, roasted, jam",flav:"Sweet-tart, fruity",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:229,n:"Achocha",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Vegetative",dth:75,ph:"6.0-7.0",tip:"Andean 'slipper gourd' - tastes like cucumber raw, bell pepper cooked. Vigorous vine.",h:["Fiber","Vitamin C"],m:["Cholesterol traditional (emerging)"],comp:["Corn"],avoid:[],cul:"Stir-fry, stuffed, raw",flav:"Cucumber-pepper",sow:"Mar-Apr",tp:"May-Jun"},
{id:230,n:"Chayote",e:"\u{1F952}",cat:"fruiting",bed:"Bed 6",stg:"Perennial",dth:150,ph:"6.0-7.0",tip:"Plant the whole sprouting fruit. One vine feeds a neighborhood. Perennial in 9b.",h:["Folate","Vitamin C","Fiber"],m:["Blood pressure (emerging)"],comp:[],avoid:[],cul:"Sauteed, soups, slaw",flav:"Mild, crisp, squash",sow:"",tp:"Mar-May"},
{id:231,n:"Oca",e:"\u{1F7E0}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:180,ph:"5.5-6.5",tip:"Andean tuber - tangy, colorful. Tubers form in fall as days shorten. Lemony when raw.",h:["Vitamin C","Fiber"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Roasted, raw, boiled",flav:"Tangy, lemony potato",sow:"",tp:"Mar-Apr"},
{id:232,n:"Yacon",e:"\u{1FADA}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:210,ph:"6.0-7.0",tip:"'Peruvian ground apple' - sweet, juicy, crisp tubers. Prebiotic. Big plant, fall harvest.",h:["Prebiotic FOS","Potassium","Low-cal"],m:["Blood sugar (emerging)","Gut health (emerging)"],comp:[],avoid:[],cul:"Raw, salads, syrup",flav:"Sweet, juicy, water chestnut",sow:"",tp:"Mar-Apr"},
{id:233,n:"Sunchoke",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Perennial",dth:130,ph:"5.8-7.0",tip:"Jerusalem artichoke - knobby tubers, tall sunflower tops. Spreads aggressively, container it!",h:["Inulin prebiotic","Iron","Potassium"],m:["Gut health (emerging)","Blood sugar (emerging)"],comp:[],avoid:[],cul:"Roasted, soups, raw",flav:"Nutty, sweet, water chestnut",sow:"",tp:"Feb-Mar"},
{id:234,n:"Crosne",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Vegetative",dth:180,ph:"6.0-7.0",tip:"Chinese artichoke - tiny spiral tubers, crunchy & sweet. Gourmet rarity. Fall harvest.",h:["Fiber","Antioxidants"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Sauteed, pickled, raw",flav:"Crisp, nutty, water chestnut",sow:"",tp:"Mar-Apr"},
{id:235,n:"Salsify",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Vegetative",dth:120,ph:"6.0-7.5",tip:"'Oyster plant' - long taproot with a delicate seafood-like flavor. Long cool season.",h:["Inulin","Fiber","Iron"],m:["Gut health (emerging)"],comp:[],avoid:[],cul:"Roasted, soups, gratin",flav:"Mild oyster, artichoke",sow:"",tp:"Sep-Oct"},
{id:236,n:"Scorzonera",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Black salsify - dark skin, white flesh, asparagus-like. Even more refined than salsify.",h:["Inulin","Fiber","Potassium"],m:["Gut health (emerging)"],comp:[],avoid:[],cul:"Boiled, roasted, creamed",flav:"Delicate, asparagus-oyster",sow:"",tp:"Sep-Oct"},
{id:237,n:"Skirret",e:"\u{1F955}",cat:"root",bed:"Bed 10",stg:"Perennial",dth:150,ph:"6.0-7.0",tip:"Sweet medieval root vegetable making a comeback. Clusters of sweet white roots.",h:["Fiber","Carbohydrates"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Roasted, boiled, fried",flav:"Sweet, carrot-parsnip",sow:"Feb-Mar",tp:"Mar-Apr"},
// MORE HERBS & MEDICINALS
{id:238,n:"Lemongrass",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Loves 9b heat. Cut stalks at the base. Divides easily. Mosquito-repelling cousin of citronella.",h:["Antioxidants","Citral"],m:["Digestive (traditional)","Anti-anxiety (emerging)","Antimicrobial (emerging)"],comp:[],avoid:[],cul:"Curry, soup, tea",flav:"Citrus, ginger",sow:"",tp:"Mar-May"},
{id:239,n:"Vietnamese Coriander",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:60,ph:"6.0-7.0",tip:"Rau ram - cilantro flavor without bolting, perfect for hot climates. Loves moisture.",h:["Antioxidants"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Pho, spring rolls, salads",flav:"Cilantro-citrus, peppery",sow:"",tp:"Mar-May"},
{id:240,n:"Cuban Oregano",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:70,ph:"6.0-7.0",tip:"Succulent, fuzzy leaves with intense oregano-thyme flavor. Thrives on neglect & heat.",h:["Antioxidants","Vitamin C"],m:["Respiratory (traditional)","Antimicrobial (emerging)"],comp:[],avoid:[],cul:"Meats, beans, marinades",flav:"Strong oregano-thyme",sow:"",tp:"Mar-May"},
{id:241,n:"Mexican Tarragon",e:"\u{1F33C}",cat:"herb",bed:"Border",stg:"Perennial",dth:80,ph:"6.0-7.5",tip:"Heat-proof tarragon substitute with edible marigold flowers. Reliable where French tarragon fails.",h:["Antioxidants"],m:["Digestive (traditional)"],comp:["Most veg"],avoid:[],cul:"Chicken, fish, tea",flav:"Anise, sweet",sow:"",tp:"Mar-Apr"},
{id:242,n:"Anise Hyssop",e:"\u{1F33C}",cat:"herb",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Pollinator superstar with licorice-mint leaves & purple flower spikes. Bees adore it.",h:["Antioxidants"],m:["Respiratory (traditional)","Digestive (traditional)"],comp:["Most veg"],avoid:[],cul:"Tea, baking, salads",flav:"Licorice, mint",sow:"Feb-Mar",tp:"Apr"},
{id:243,n:"Holy Basil (Tulsi)",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:75,ph:"6.0-7.5",tip:"Sacred adaptogenic basil. Spicy, clove-like. Thrives in 9b heat. Pinch flowers for leaves.",h:["Antioxidants","Adaptogens"],m:["Stress adaptogen (emerging)","Blood sugar (emerging)","Immune (emerging)"],comp:["Tomato"],avoid:[],cul:"Tea, stir-fry",flav:"Spicy, clove, peppery",sow:"Mar-Apr",tp:"Apr-May"},
{id:244,n:"Ashwagandha",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Vegetative",dth:180,ph:"7.0-8.0",tip:"Adaptogenic root herb that loves heat & poor soil. Harvest roots in fall. Tolerates 9b dry heat.",h:["Withanolides","Adaptogens"],m:["Stress & anxiety (emerging)","Sleep (emerging)"],comp:[],avoid:[],cul:"Root powder, tea",flav:"Bitter, earthy root",sow:"Feb-Mar",tp:"Apr-May"},
{id:245,n:"Roselle",e:"\u{1F33A}",cat:"herb",bed:"Bed 8",stg:"Vegetative",dth:120,ph:"6.0-7.0",tip:"Hibiscus sabdariffa - tart red calyces for tea & jam. Loves heat. Harvest calyces in fall.",h:["Vitamin C","Anthocyanins"],m:["Blood pressure (well-studied)","Antioxidant (well-studied)"],comp:[],avoid:[],cul:"Tea, jam, agua fresca",flav:"Tart, cranberry-citrus",sow:"Mar-Apr",tp:"May-Jun"},
{id:246,n:"Saffron Crocus",e:"\u{1F7E3}",cat:"herb",bed:"Container",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"The world's costliest spice - 3 red stigmas per fall flower. Plant corms in summer. Dry climate suits it.",h:["Crocin","Antioxidants"],m:["Mood (emerging)","Antioxidant (emerging)"],comp:[],avoid:[],cul:"Paella, rice, desserts",flav:"Floral, honey, earthy",sow:"",tp:"Aug-Sep"},
{id:247,n:"Cardamom",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:730,ph:"5.5-6.5",tip:"Ginger relative for warm shade. Pods take patience but the fragrance is unmatched. Keep moist.",h:["Antioxidants","Essential oils"],m:["Digestive (traditional)","Breath/oral (traditional)"],comp:[],avoid:[],cul:"Chai, curry, baking",flav:"Floral, citrus, spice",sow:"",tp:"Spring"},
{id:248,n:"Vanilla Orchid",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:1095,ph:"6.0-7.0",tip:"Climbing orchid for the truly patient. Needs warmth, humidity & hand-pollination. A passion project.",h:["Vanillin","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Baking, extract",flav:"Sweet, floral, creamy",sow:"",tp:"Spring"},
{id:249,n:"Stevia (Sweet Leaf)",e:"\u{1F33F}",cat:"herb",bed:"Container",stg:"Perennial",dth:90,ph:"6.5-7.5",tip:"30x sweeter than sugar, zero calories. Pinch often & bring in over winter. Loves sun.",h:["Steviol glycosides","Zero-cal"],m:["Blood sugar (emerging)"],comp:[],avoid:[],cul:"Sweetener, tea",flav:"Intensely sweet",sow:"Feb-Mar",tp:"Apr-May"},
// MORE FLOWERS / POLLINATOR / CUT
{id:250,n:"Dahlia",e:"\u{1F33A}",cat:"flower",bed:"Border",stg:"Perennial",dth:100,ph:"6.5-7.0",tip:"Spectacular cut flowers from tubers. Stake tall types. Dig & store tubers, or leave in ground in 9b.",h:["N/A ornamental"],m:["N/A"],comp:["Most veg"],avoid:[],cul:"Edible petals (mild)",flav:"Mild, water-chestnut tubers",sow:"",tp:"Mar-May"},
{id:251,n:"Ranunculus",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-6.8",tip:"Rose-like layered blooms from corms. Cool-season - plant in fall for spring. SoCal favorite.",h:["N/A ornamental"],m:["N/A"],comp:[],avoid:[],cul:"Ornamental only",flav:"N/A",sow:"",tp:"Oct-Nov"},
{id:252,n:"Sweet Pea (Flower)",e:"\u{1F338}",cat:"flower",bed:"Border",stg:"Vegetative",dth:90,ph:"7.0-7.5",tip:"Intensely fragrant climbing flowers. Cool season - sow fall/winter. NOT edible (ornamental only).",h:["N/A ornamental"],m:["N/A"],comp:[],avoid:[],cul:"Cut flowers (not edible)",flav:"N/A",sow:"Oct-Nov",tp:"Nov-Jan"},
{id:253,n:"Snapdragon",e:"\u{1F33A}",cat:"flower",bed:"Border",stg:"Vegetative",dth:90,ph:"6.2-7.0",tip:"Spiky cool-season cut flowers. Edible (mildly bitter) petals. Reseeds. Plant fall for winter-spring bloom.",h:["Antioxidants petals"],m:["N/A"],comp:["Most veg"],avoid:[],cul:"Edible petals, garnish",flav:"Mild, slightly bitter",sow:"Aug-Sep",tp:"Sep-Nov"},
{id:254,n:"Bee Balm",e:"\u{1F33A}",cat:"flower",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Monarda - shaggy red/purple blooms, hummingbird & bee magnet. Edible minty leaves & flowers.",h:["Antioxidants","Thymol"],m:["Digestive (traditional)","Antiseptic (traditional)"],comp:["Tomato"],avoid:[],cul:"Tea, salads, garnish",flav:"Minty, oregano, citrus",sow:"Feb-Mar",tp:"Apr"},
{id:255,n:"Yarrow",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"Tough drought-proof pollinator flower & beneficial-insect magnet. Medicinal. Ferny foliage.",h:["Antioxidants","Flavonoids"],m:["Wound healing (traditional)","Anti-inflammatory (emerging)"],comp:["Most veg"],avoid:[],cul:"Tea, bitters",flav:"Bitter, aromatic",sow:"Feb-Mar",tp:"Apr"},
{id:256,n:"Echinacea",e:"\u{1F33A}",cat:"flower",bed:"Border",stg:"Perennial",dth:120,ph:"6.0-7.0",tip:"Purple coneflower - immune-herb roots + pollinator blooms. Drought-tolerant once established.",h:["Antioxidants","Alkamides"],m:["Immune (emerging)","Cold duration (emerging)"],comp:["Most veg"],avoid:[],cul:"Tea, tincture",flav:"Earthy, tingly root",sow:"Feb-Mar",tp:"Apr"},
{id:257,n:"Feverfew",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Daisy-like medicinal that self-seeds freely. Traditional migraine herb. Pollinator-friendly.",h:["Parthenolide","Antioxidants"],m:["Migraine (emerging)","Anti-inflammatory (emerging)"],comp:[],avoid:[],cul:"Tea (bitter)",flav:"Bitter, citrus",sow:"Feb-Mar",tp:"Apr"},
{id:258,n:"Valerian",e:"\u{1F33C}",cat:"herb",bed:"Border",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Tall fragrant medicinal - roots are a classic sleep aid. Flowers draw pollinators. Cut back to control.",h:["Valerenic acid"],m:["Sleep & anxiety (emerging)"],comp:[],avoid:[],cul:"Tea, tincture (root)",flav:"Earthy, musky root",sow:"Feb-Mar",tp:"Apr"},
{id:259,n:"Lovage",e:"\u{1F33F}",cat:"herb",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Towering perennial that tastes like super-celery. One plant is plenty. Use leaves, stems & seeds.",h:["Vitamin C","Quercetin"],m:["Digestive (traditional)","Diuretic (traditional)"],comp:[],avoid:[],cul:"Soups, stocks, salads",flav:"Intense celery, anise",sow:"Feb-Mar",tp:"Apr"},
{id:260,n:"Chervil",e:"\u{1F33F}",cat:"herb",bed:"Herb Bed",stg:"Vegetative",dth:60,ph:"6.0-7.0",tip:"Delicate French 'fines herbes' with anise-parsley flavor. Cool season, part shade. Bolts in heat.",h:["Vitamin C","Antioxidants"],m:["Digestive (traditional)"],comp:["Lettuce","Radish"],avoid:[],cul:"Eggs, fish, sauces",flav:"Delicate anise-parsley",sow:"Sep-Oct",tp:"Oct & Feb"},
// MORE PEPPERS / TOMATOES / NIGHTSHADES (variety depth)
{id:261,n:"Padron Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Tapas pepper - mostly mild, ~1 in 10 surprises you with heat. Pick small & blister in oil.",h:["Vitamin C","Capsaicin"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Blistered, tapas",flav:"Grassy, mostly mild",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:262,n:"Shishito Pepper",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:70,ph:"6.0-6.8",tip:"Japanese blistering pepper, mild & wrinkly. Super productive. Pick green & often.",h:["Vitamin C","Antioxidants"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Blistered, grilled",flav:"Mild, smoky, grassy",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:263,n:"Aji Amarillo",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:100,ph:"6.0-6.8",tip:"Peruvian golden chili - fruity heat, the soul of Peruvian cooking. Loves long 9b summers.",h:["Capsaicin","Vitamin C"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Sauces, ceviche, stews",flav:"Fruity, sunny heat",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:264,n:"Pasilla / Ancho Chile",e:"\u{1F336}\uFE0F",cat:"fruiting",bed:"Bed 4",stg:"Vegetative",dth:80,ph:"6.0-6.8",tip:"Dried poblano - the backbone of mole. Mild, raisiny, smoky. Dry the fruits at season's end.",h:["Capsaicin","Antioxidants"],m:["Metabolism (well-studied)"],comp:["Tomato","Basil"],avoid:["Fennel"],cul:"Mole, sauces, dried",flav:"Mild, raisin, smoke",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:265,n:"Black Krim Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:80,ph:"6.0-6.8",tip:"Russian heirloom - dusky mahogany shoulders, rich smoky-sweet flavor. Loves heat.",h:["Lycopene","Vitamin C"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel"],cul:"Slicing, salads",flav:"Smoky, sweet, savory",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:266,n:"Green Zebra Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:75,ph:"6.0-6.8",tip:"Chartreuse with green stripes, tangy-sweet, ripe when slightly soft. Beautiful sliced.",h:["Lycopene","Vitamin C"],m:["Cardiovascular (well-studied)"],comp:["Basil"],avoid:["Fennel"],cul:"Salads, salsa verde",flav:"Tangy, zesty, sweet",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:267,n:"Sungold Tomato",e:"\u{1F345}",cat:"fruiting",bed:"Bed 1",stg:"Vegetative",dth:65,ph:"6.0-6.8",tip:"The candy of cherry tomatoes - tangerine-orange, explosively sweet. Crack-prone if over-watered.",h:["Lycopene","Beta-carotene"],m:["Cardiovascular (well-studied)"],comp:["Basil","Marigold"],avoid:["Fennel"],cul:"Snacking, salads",flav:"Intensely sweet-tangy",sow:"Jan-Feb",tp:"Mar-Apr"},
{id:268,n:"Cape Gooseberry (Goldenberry)",e:"\u{1F7E0}",cat:"berry",bed:"Border",stg:"Vegetative",dth:100,ph:"6.0-6.8",tip:"Husk-wrapped golden berries, sweet-tart & tropical. Self-seeds. Tender perennial in 9b.",h:["Vitamin C","Beta-carotene"],m:["Anti-inflammatory (emerging)"],comp:[],avoid:[],cul:"Fresh, jam, dipped",flav:"Sweet-tart, tropical",sow:"Jan-Feb",tp:"Mar-Apr"},
// MORE BRASSICAS / LEAFY DEPTH
{id:269,n:"Gai Lan (Chinese Broccoli)",e:"\u{1F966}",cat:"brassica",bed:"Bed 9",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Thick sweet stems & leaves, faster than broccoli. Cool season. Harvest before flowers open.",h:["Vitamin A & C","Calcium"],m:["Anti-inflammatory (well-studied)"],comp:["Onion"],avoid:["Strawberry"],cul:"Stir-fry, steamed, oyster sauce",flav:"Sweet, slightly bitter",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:270,n:"Choy Sum",e:"\u{1F96C}",cat:"brassica",bed:"Bed 13",stg:"Vegetative",dth:45,ph:"6.0-7.0",tip:"Flowering Chinese green, mild & quick. Eat stems, leaves & yellow flowers. Cut-and-come-again.",h:["Vitamin A & C","Folate"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Stir-fry, soups",flav:"Mild, sweet, mustardy",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:271,n:"Komatsuna",e:"\u{1F96C}",cat:"brassica",bed:"Bed 13",stg:"Vegetative",dth:40,ph:"6.0-7.5",tip:"Japanese mustard spinach - fast, hardy, mild. Heat AND cold tolerant, very forgiving.",h:["Vitamin A & C","Calcium"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Stir-fry, salads, soups",flav:"Mild, sweet mustard",sow:"",tp:"Sep-Mar"},
{id:272,n:"Yu Choy",e:"\u{1F96C}",cat:"brassica",bed:"Bed 13",stg:"Vegetative",dth:45,ph:"6.0-7.0",tip:"Tender oilseed-rape green, sweet & fast. Popular in Cantonese cooking. Quick succession crop.",h:["Vitamin A & C","Calcium"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Stir-fry, blanched",flav:"Sweet, mild",sow:"Aug-Sep",tp:"Sep-Feb"},
{id:273,n:"Agretti",e:"\u{1F33F}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:50,ph:"6.5-7.5",tip:"Italian 'monk's beard' - succulent grassy strands, faintly salty & mineral. Gourmet spring rarity.",h:["Vitamin A","Minerals","Chlorophyll"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Sauteed with garlic & lemon",flav:"Grassy, mineral, salty",sow:"Feb-Mar",tp:"Mar-Apr"},
{id:274,n:"Orach",e:"\u{1F7E3}",cat:"leafy",bed:"Bed 11",stg:"Vegetative",dth:50,ph:"6.0-7.5",tip:"'Mountain spinach' - heat-tolerant spinach alt in stunning magenta, green or gold. Slow to bolt.",h:["Vitamin A & C","Iron"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Salads, cooked like spinach",flav:"Mild, spinach, earthy",sow:"",tp:"Mar-May & Sep"},
{id:275,n:"Good King Henry",e:"\u{1F33F}",cat:"leafy",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Perennial spinach-like green AND asparagus-like spring shoots. Old-world, cut for years.",h:["Vitamin A & C","Iron"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Cooked greens, shoots",flav:"Earthy spinach",sow:"Feb-Mar",tp:"Apr"},
// HERBS continued / misc edibles
{id:276,n:"Society Garlic",e:"\u{1F33F}",cat:"allium",bed:"Border",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Ornamental + edible - garlicky leaves & pretty lavender flowers. Tough, drought-proof 9b border plant.",h:["Allicin compounds"],m:["Mild antimicrobial (traditional)"],comp:["Rose"],avoid:[],cul:"Garnish, mild garlic seasoning",flav:"Mild garlic-chive",sow:"",tp:"Spring"},
{id:277,n:"Egyptian Walking Onion",e:"\u{1F9C5}",cat:"allium",bed:"Edges",stg:"Perennial",dth:120,ph:"6.0-7.0",tip:"Forms top-bulblets that bend over & 'walk' to replant themselves. Perennial, endlessly self-renewing.",h:["Antioxidants","Quercetin"],m:["Cardiovascular (emerging)"],comp:["Carrot","Beet"],avoid:["Bean","Pea"],cul:"Scallion substitute, pickled",flav:"Sharp onion",sow:"",tp:"Aug-Oct"},
{id:278,n:"Welsh Onion",e:"\u{1F9C5}",cat:"allium",bed:"Edges",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Perennial bunching onion - never forms a bulb, just keeps giving scallions. Divide clumps.",h:["Vitamin K & C","Antioxidants"],m:["Cardiovascular (emerging)"],comp:["Carrot"],avoid:["Bean"],cul:"Scallions, stir-fry",flav:"Mild onion",sow:"Feb-Mar",tp:"Mar-Apr"},
{id:279,n:"Perpetual Spinach",e:"\u{1F96C}",cat:"leafy",bed:"Bed 13",stg:"Perennial",dth:55,ph:"6.0-7.0",tip:"A leaf-beet that crops like spinach for a year+ without bolting. The set-and-forget green.",h:["Vitamin A & K","Iron"],m:["Antioxidant (well-studied)"],comp:["Onion"],avoid:[],cul:"Cooked or raw like spinach",flav:"Mild, spinach-chard",sow:"Feb-Mar",tp:"Mar & Sep"},
{id:280,n:"Tree Collard",e:"\u{1F957}",cat:"brassica",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"Purple perennial collard that grows for YEARS into a small tree. Propagate from cuttings. 9b legend.",h:["Vitamin K & C","Calcium","Anthocyanins"],m:["Anti-inflammatory (well-studied)"],comp:["Onion"],avoid:["Strawberry"],cul:"Braised, sauteed, soups",flav:"Sweet, hearty collard",sow:"",tp:"Spring or Fall"},
{id:281,n:"Moringa",e:"\u{1F333}",cat:"tree",bed:"Border",stg:"Perennial",dth:240,ph:"6.0-7.5",tip:"'Miracle tree' - fast-growing, protein-rich edible leaves. Loves 9b heat. Cut back hard; regrows fast.",h:["Complete protein","Vitamin A & C","Calcium","Iron"],m:["Anti-inflammatory (emerging)","Blood sugar (emerging)","Nutrient-dense (well-studied)"],comp:[],avoid:[],cul:"Leaves in soups, stir-fry, powder",flav:"Spinach-horseradish",sow:"Mar-Apr",tp:"Apr-May"},
{id:282,n:"Katuk",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Perennial",dth:120,ph:"6.0-7.0",tip:"'Sweet leaf' tropical perennial green - one of the most nutritious leaves on earth. Frost-tender.",h:["Protein","Vitamin A & C","Calcium"],m:["Nutrient-dense (emerging)"],comp:[],avoid:[],cul:"Stir-fry, soups (cook well)",flav:"Nutty, pea-like, sweet",sow:"",tp:"Spring"},
{id:283,n:"Cranberry Hibiscus",e:"\u{1F33A}",cat:"leafy",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Stunning burgundy edible leaves with a lemony zing + edible flowers. Ornamental AND productive.",h:["Anthocyanins","Vitamin C"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Salads, tea, garnish",flav:"Tart, lemony, cranberry",sow:"Mar-Apr",tp:"May-Jun"},
{id:284,n:"Longevity Spinach",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Gynura - succulent perennial green eaten across Asia for wellness. Easy from cuttings, loves warmth.",h:["Antioxidants","Fiber"],m:["Blood sugar traditional (emerging)","Cholesterol (emerging)"],comp:[],avoid:[],cul:"Raw, stir-fry, smoothies",flav:"Mild, juicy, slightly piney",sow:"",tp:"Spring"},
{id:285,n:"Okinawa Spinach",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Perennial",dth:90,ph:"6.0-7.0",tip:"Purple-backed perennial green, nutty flavor, thrives in heat & humidity. Grows easily from cuttings.",h:["Antioxidants","Iron"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Stir-fry, tempura, salads",flav:"Nutty, faintly pine",sow:"",tp:"Spring"},
{id:286,n:"Sissoo Spinach",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Perennial",dth:75,ph:"6.0-7.0",tip:"Brazilian ground-cover spinach - crunchy, mild, no bitterness, thrives in 9b heat. Spreads as living mulch.",h:["Vitamin A & C","Iron","Calcium"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Raw, sauteed",flav:"Mild, crunchy, fresh",sow:"",tp:"Spring"},
{id:287,n:"Cassava",e:"\u{1FADA}",cat:"root",bed:"Border",stg:"Perennial",dth:300,ph:"5.5-6.5",tip:"Tropical starchy root (yuca). Drought-hardy, loves heat. MUST be cooked thoroughly. Harvest in 8-12 mo.",h:["Carbohydrates","Vitamin C"],m:["Energy staple (traditional)"],comp:[],avoid:[],cul:"Boiled, fried, flour (cook fully!)",flav:"Mild, starchy, nutty",sow:"",tp:"Mar-May"},
{id:288,n:"Taro",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Perennial",dth:240,ph:"5.5-6.5",tip:"Tropical corm grown in wet soil. Big elephant-ear leaves. MUST be cooked. Loves heat & moisture.",h:["Fiber","Potassium","Resistant starch"],m:["Gut health (emerging)","Blood sugar (emerging)"],comp:[],avoid:[],cul:"Boiled, poi, fried, chips (cook fully!)",flav:"Nutty, sweet, starchy",sow:"",tp:"Mar-May"},
{id:289,n:"Malanga",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Perennial",dth:270,ph:"5.5-6.5",tip:"Caribbean root similar to taro, nuttier & easier to digest. Warm, moist, frost-free. Cook fully.",h:["Fiber","Potassium","Iron"],m:["Digestive (emerging)"],comp:[],avoid:[],cul:"Boiled, fritters, soups",flav:"Earthy, nutty",sow:"",tp:"Mar-May"},
{id:290,n:"Arrowroot",e:"\u{1FADA}",cat:"root",bed:"Container",stg:"Perennial",dth:300,ph:"6.0-7.0",tip:"Tropical rhizome for natural starch/thickener. Easy & pest-free in warm wet soil. Harvest in fall.",h:["Easily-digested starch"],m:["Digestive soothing (traditional)"],comp:[],avoid:[],cul:"Starch/thickener, baking",flav:"Neutral, starchy",sow:"",tp:"Mar-May"},
// FINAL ROUND - more pollinator/companion & culinary
{id:291,n:"Borage (Blue Starflower)",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Vegetative",dth:55,ph:"6.0-7.0",tip:"Edible blue star flowers, cucumber-flavored. #1 bee plant. Companion to strawberries & tomatoes.",h:["Omega-6 GLA","Vitamin C"],m:["Anti-inflammatory (emerging)","Skin (traditional)"],comp:["Strawberry","Tomato","Squash"],avoid:[],cul:"Flowers in drinks & salads",flav:"Cool cucumber",sow:"",tp:"Mar-Apr & Sep"},
{id:292,n:"Phacelia",e:"\u{1F33C}",cat:"flower",bed:"Border",stg:"Vegetative",dth:60,ph:"6.0-7.5",tip:"Lacy purple 'bee's friend' - one of the best pollinator & cover crops. Fixes nothing but feeds everything.",h:["N/A ornamental/cover"],m:["N/A"],comp:["Most veg"],avoid:[],cul:"Ornamental/cover crop",flav:"N/A",sow:"",tp:"Sep-Mar"},
{id:293,n:"Crimson Clover",e:"\u{1F33A}",cat:"legume",bed:"Bed 8",stg:"Vegetative",dth:90,ph:"6.0-7.0",tip:"Gorgeous red cover crop that fixes nitrogen & feeds bees. Sow fall, turn under before planting.",h:["N/A cover crop"],m:["N/A"],comp:["Most veg"],avoid:[],cul:"Cover crop (edible flowers)",flav:"Mild, sweet flowers",sow:"",tp:"Sep-Oct"},
{id:294,n:"Buckwheat",e:"\u{1F33E}",cat:"flower",bed:"Bed 8",stg:"Vegetative",dth:75,ph:"5.5-7.0",tip:"Fastest cover crop & pollinator magnet - flowers in 4 weeks. Smothers weeds. Not a true grain.",h:["Rutin","Protein groats"],m:["Circulation rutin (emerging)"],comp:["Most veg"],avoid:[],cul:"Groats, flour, cover crop",flav:"Earthy, nutty groats",sow:"",tp:"Apr-Aug"},
{id:295,n:"Comfrey",e:"\u{1F33F}",cat:"herb",bed:"Border",stg:"Perennial",dth:120,ph:"6.0-7.5",tip:"Permaculture powerhouse - deep roots mine nutrients; leaves make free fertilizer 'tea' & mulch. Container Bocking-14 to control.",h:["Allantoin","Minerals"],m:["Topical wound/bruise (traditional)"],comp:["Fruit trees"],avoid:[],cul:"NOT for eating - fertilizer & topical only",flav:"N/A (external use)",sow:"",tp:"Spring or Fall"},
{id:296,n:"Nettle (Stinging)",e:"\u{1F33F}",cat:"leafy",bed:"Container",stg:"Perennial",dth:60,ph:"5.5-7.0",tip:"Wear gloves! Cooking removes the sting. Ultra-nutritious green + fertilizer tea + butterfly host. Container it.",h:["Iron","Vitamin A & C","Protein"],m:["Anti-inflammatory (emerging)","Allergy (emerging)","Joint (traditional)"],comp:[],avoid:[],cul:"Soups, tea, pesto (cooked)",flav:"Earthy, spinach-rich",sow:"Feb-Mar",tp:"Apr"},
{id:297,n:"Purslane",e:"\u{1F33F}",cat:"leafy",bed:"Edges",stg:"Vegetative",dth:50,ph:"5.5-7.5",tip:"That 'weed' is a superfood - highest plant omega-3s. Succulent, lemony, drought-proof. Self-seeds happily.",h:["Omega-3 ALA","Vitamin A & C","Magnesium"],m:["Heart health omega-3 (emerging)","Antioxidant (well-studied)"],comp:[],avoid:[],cul:"Salads, stir-fry, pickled",flav:"Lemony, succulent, crisp",sow:"",tp:"Apr-Aug"},
{id:298,n:"Miner's Lettuce",e:"\u{1F96C}",cat:"leafy",bed:"Edges",stg:"Vegetative",dth:45,ph:"6.0-7.0",tip:"California native winter salad green - mild, succulent, vitamin-C rich. Thrives in cool shade. Self-seeds.",h:["Vitamin C","Vitamin A","Iron"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Salads, raw",flav:"Mild, juicy, fresh",sow:"",tp:"Oct-Feb"},
{id:299,n:"Wood Sorrel",e:"\u{1F340}",cat:"leafy",bed:"Edges",stg:"Vegetative",dth:50,ph:"6.0-7.0",tip:"Clover-like tangy edible with heart-shaped leaves & yellow flowers. Bright lemony pop. Self-seeds.",h:["Vitamin C","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Garnish, salads (in moderation)",flav:"Tart, lemony",sow:"",tp:"Spring & Fall"},
{id:300,n:"Pineapple Sage",e:"\u{1F33A}",cat:"herb",bed:"Border",stg:"Perennial",dth:90,ph:"6.0-7.5",tip:"Brilliant red flowers hummingbirds can't resist, pineapple-scented leaves. Blooms into fall. Easy & showy.",h:["Antioxidants"],m:["Calming tea (traditional)","Mood (traditional)"],comp:["Rosemary"],avoid:[],cul:"Tea, desserts, garnish, drinks",flav:"Sweet pineapple-sage",sow:"",tp:"Mar-Apr"},
];

var P6=[
{id:301,n:"Strawberry Tree",e:"\u{1F353}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.5",tip:"Arbutus - Mediterranean evergreen with edible red fruit & bell flowers at once. Drought & coast tough.",h:["Vitamin C","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, jam, liqueur",flav:"Mild, sweet, slightly gritty",sow:"",tp:"Spring"},
{id:302,n:"Pineapple Guava (Feijoa)",e:"\u{1F7E2}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.0",tip:"Edible sweet flower petals in spring + aromatic fruit in fall. Evergreen hedge, drought-tolerant, 9b star.",h:["Vitamin C","Fiber","Antioxidants"],m:["Antioxidant (emerging)"],comp:[],avoid:[],cul:"Fresh, petals in salad, jam",flav:"Pineapple-mint-guava",sow:"",tp:"Spring"},
{id:303,n:"Olive",e:"\u{1FAD2}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-8.0",tip:"Mediterranean icon - thrives in heat & poor soil. Arbequina fruits young & self-fertile. Cure olives to eat.",h:["Healthy fats","Vitamin E","Polyphenols"],m:["Heart health (well-studied)","Anti-inflammatory (well-studied)"],comp:["Lavender","Rosemary"],avoid:[],cul:"Cured, oil",flav:"Rich, briny (cured)",sow:"",tp:"Spring"},
{id:304,n:"Carob",e:"\u{1FAD2}",cat:"tree",bed:"Border",stg:"Perennial",dth:730,ph:"6.0-8.0",tip:"Drought-proof Mediterranean tree - sweet pods are a chocolate substitute. Tough as nails once established.",h:["Fiber","Calcium","Antioxidants"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Pods ground to powder, syrup",flav:"Sweet, roasted, cocoa-like",sow:"",tp:"Spring"},
{id:305,n:"Pomelo",e:"\u{1F34A}",cat:"citrus",bed:"Border",stg:"Perennial",dth:300,ph:"6.0-7.0",tip:"Largest citrus - thick rind, sweet mild flesh, no bitterness. Loves SoCal heat. Chandler is excellent.",h:["Vitamin C","Potassium","Fiber"],m:["Immune (well-studied)","Heart health (emerging)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Fresh, segments, salads",flav:"Sweet, mild grapefruit",sow:"",tp:"Spring"},
{id:306,n:"Calamondin",e:"\u{1F34A}",cat:"citrus",bed:"Container",stg:"Perennial",dth:270,ph:"6.0-7.0",tip:"Ornamental + culinary - tiny tart fruit, glossy evergreen, year-round bloom & fruit. Ideal patio pot.",h:["Vitamin C","Antioxidants"],m:["Immune (well-studied)"],comp:[],avoid:[],cul:"Marmalade, juice, garnish",flav:"Tart, lime-orange",sow:"",tp:"Spring"},
{id:307,n:"Tangerine",e:"\u{1F34A}",cat:"citrus",bed:"Border",stg:"Perennial",dth:270,ph:"6.0-7.0",tip:"Sweet easy-peel winter citrus. Dancy & Pixie do beautifully in SoCal. Heavy fragrant bloom.",h:["Vitamin C","Beta-cryptoxanthin"],m:["Immune (well-studied)"],comp:["Lavender"],avoid:["Lawn grass"],cul:"Fresh, juice, segments",flav:"Sweet, bright, tangy",sow:"",tp:"Spring"},
{id:308,n:"Quince",e:"\u{1F7E1}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-7.0",tip:"Old-world fruit - hard & astringent raw, magical cooked (membrillo). Fragrant, low-chill, easy.",h:["Vitamin C","Fiber","Pectin"],m:["Digestive (traditional)"],comp:[],avoid:[],cul:"Membrillo, poached, jelly",flav:"Floral, honey, tart (cooked)",sow:"",tp:"Winter"},
{id:309,n:"Jujube",e:"\u{1F7E4}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"6.0-8.0",tip:"'Chinese date' - crisp apple-sweet fresh, chewy-date dried. Extremely heat, drought & cold tough. 9b dream tree.",h:["Vitamin C","Antioxidants"],m:["Sleep traditional (emerging)","Immune (emerging)"],comp:[],avoid:[],cul:"Fresh, dried, tea",flav:"Sweet apple (fresh), date (dried)",sow:"",tp:"Winter-Spring"},
{id:310,n:"White Mulberry",e:"\u{1FAD0}",cat:"tree",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-7.5",tip:"Honey-sweet pale berries, less staining than black. Fast shade tree, very heat-tolerant, feeds silkworms & you.",h:["Iron","Vitamin C","Resveratrol"],m:["Blood sugar (emerging)"],comp:[],avoid:[],cul:"Fresh, dried, jam",flav:"Honey-sweet, mild",sow:"",tp:"Winter"},
{id:311,n:"Elderberry",e:"\u{1FAD0}",cat:"berry",bed:"Border",stg:"Perennial",dth:365,ph:"5.5-7.0",tip:"Immune-syrup berries + frothy edible flowers (cordial). Fast, easy, pollinator-loved. COOK berries - raw are mildly toxic.",h:["Vitamin C","Anthocyanins"],m:["Immune & cold/flu (emerging)","Antiviral (emerging)"],comp:[],avoid:[],cul:"Syrup, cordial, wine (cook berries!)",flav:"Tart, musky, floral",sow:"",tp:"Winter-Spring"},
{id:312,n:"Currant (Red/Black)",e:"\u{1FAD0}",cat:"berry",bed:"Border",stg:"Perennial",dth:300,ph:"6.0-6.8",tip:"Tart jewel-like clusters for jam & syrup. Give afternoon shade in 9b heat. Pixwell & Crandall handle warmth.",h:["Vitamin C","Anthocyanins"],m:["Antioxidant (well-studied)","Immune (emerging)"],comp:[],avoid:[],cul:"Jam, syrup, baking",flav:"Tart, intense, berry",sow:"",tp:"Winter"},
];

var ALLPLANTS = P.concat(TREES).concat(P2).concat(P3).concat(P4).concat(P5).concat(P6);

// ─── PESTS (upgraded - Priority 4) ───
var PESTS=[
{n:"Aphids",e:"\u{1F41B}",type:"Sap-sucker",sev:"Moderate",pk:"Spring & Fall",pl:"Kale, pepper, citrus, lettuce, roses",
look:"Tiny (2-3mm) pear-shaped insects in dense clusters on new growth and leaf undersides. Green, black, or peach. Leave sticky honeydew + black sooty mold. Ants farm them.",
threshold:"A few aphids = fine, beneficials handle it. ACTION when: colonies cover new growth, leaves curl/yellow, or ants are actively farming. Sticky honeydew everywhere = past threshold.",
attract:"Ladybugs, lacewings, hoverflies, parasitic wasps all devour aphids. Plant sweet alyssum, dill, fennel, yarrow nearby to invite them.",
remove:"1) Strong water blast every 2-3 days (knocks them off, they can't climb back). 2) Insecticidal soap on undersides. 3) Release ladybugs at dusk. 4) Control ants with sticky barriers - they protect aphids.",
avoid:"Don't use broad-spectrum insecticides - they kill the ladybugs and lacewings that would solve this for free.",
note:"Worst in 9b spring (Mar-May) and fall (Oct-Nov). Summer heat naturally crashes their numbers."},
{n:"Spider Mites",e:"\u{1F577}\uFE0F",type:"Arachnid",sev:"Serious",pk:"Hot dry summer",pl:"Strawberry, tomato, pepper, bean, beans",
look:"Almost too small to see - look for fine silk webbing on leaf undersides and stippled (tiny yellow dots) leaves. Hold paper under a leaf and tap - moving dots = mites. Leaves bronze then crisp.",
threshold:"A little stippling on a couple leaves = monitor. ACTION when: webbing appears, stippling spreads across multiple leaves, or you see them moving. Webbing = infestation is established.",
attract:"Predatory mites (Phytoseiulus persimilis), ladybugs, lacewing larvae. Keeping humidity up and foliage misted discourages them.",
remove:"1) Blast leaf undersides with water every 2-3 days - they hate moisture. 2) Insecticidal soap or summer horticultural oil (EVENING only, never in sun). 3) Release predatory mites for serious cases.",
avoid:"Never use broad-spectrum insecticides - they kill mite predators and cause population explosions. Don't let plants get dusty/drought-stressed.",
note:"THE #1 summer pest for 9b raised beds. Your white Vego beds + dry air = start preventive misting in June."},
{n:"Tomato Hornworm",e:"\u{1F40D}",type:"Caterpillar",sev:"Serious",pk:"Summer",pl:"Tomato, pepper, eggplant",
look:"Huge (up to 4in) bright green caterpillar with white stripes and a horn on its rear. Eats entire leaves and leaves dark pellet droppings. Hard to spot - blends in perfectly.",
threshold:"Even ONE is worth removing - they eat voraciously and a single hornworm can defoliate a branch overnight. Look for droppings below, then hunt upward.",
attract:"Parasitic braconid wasps are the hero here. If you see a hornworm covered in white rice-like cocoons, LEAVE IT - those are wasp larvae that will hatch and kill more hornworms.",
remove:"1) Hand-pick (best method) - check at dusk with a UV flashlight, they glow. 2) BT spray (Bacillus thuringiensis) - harmless to everything but caterpillars. 3) Drop picked worms in soapy water.",
avoid:"Don't kill hornworms covered in white cocoons - those are doing your pest control for free.",
note:"Use a UV/blacklight at night - hornworms fluoresce bright green and become easy to spot."},
{n:"Whitefly",e:"\u{1F99F}",type:"Sap-sucker",sev:"Moderate",pk:"Summer & Fall",pl:"Tomato, pepper, squash, citrus",
look:"Tiny white moth-like insects that fly up in a cloud when you shake the plant. Cluster on leaf undersides. Sticky honeydew + sooty mold + yellowing leaves.",
threshold:"A few = monitor. ACTION when: shaking a plant releases a visible cloud, undersides are coated, or leaves yellow. They reproduce fast - don't wait.",
attract:"Encarsia formosa parasitic wasps, lacewings, ladybugs. Yellow sticky traps catch adults.",
remove:"1) Yellow sticky traps (they're drawn to yellow). 2) Insecticidal soap + neem on undersides, repeat weekly. 3) Vacuum them in early morning when sluggish. 4) Release Encarsia wasps.",
avoid:"Don't over-fertilize with nitrogen - soft lush growth attracts them.",
note:"Can transmit tomato yellow leaf curl virus (TYLCV). Pull stunted, curled, virus-looking tomatoes immediately."},
{n:"Cabbage Worm",e:"\u{1F41B}",type:"Caterpillar",sev:"Serious",pk:"Fall-Spring",pl:"Kale, broccoli, cauliflower, cabbage",
look:"Velvety green caterpillars matching leaf color. Ragged holes chewed through leaves, dark green frass (droppings). White butterflies fluttering around brassicas = they're laying eggs.",
threshold:"A few holes = tolerable. ACTION when: you see multiple caterpillars per plant, frass piling up, or white butterflies actively visiting. They multiply fast in cool season.",
attract:"Parasitic wasps, ground beetles. Dill, fennel, and yarrow flowers attract the wasps.",
remove:"1) BT spray weekly (the gold standard - harmless to all but caterpillars). 2) Floating row cover (best - blocks the butterflies from laying). 3) Hand-pick. 4) Squish eggs (yellow, on undersides).",
avoid:"Don't skip row cover if you grow brassicas in cool season - it's the easiest prevention.",
note:"You grow brassicas in cool season, which is exactly when these are active. BT every 7-10 days is your tax."},
{n:"Slugs & Snails",e:"\u{1F40C}",type:"Mollusk",sev:"Moderate",pk:"Winter & Spring (wet)",pl:"Lettuce, strawberry, basil, seedlings",
look:"Irregular ragged holes in leaves, silvery slime trails, seedlings vanishing overnight. Damage worse after rain. They hide under pots, boards, and mulch during the day.",
threshold:"A few holes = fine. ACTION when: seedlings disappear, slime trails are everywhere, or you lose transplants. They can wipe out a seedling bed in one night.",
attract:"Birds, ground beetles, ducks (if you have them), and toads all eat slugs. A toad habitat near beds helps a lot.",
remove:"1) Iron phosphate bait (Sluggo - pet & wildlife safe). 2) Copper tape on Vego bed rims (they won't cross it). 3) Beer traps. 4) Hand-pick at night with a headlamp. 5) Remove daytime hiding spots.",
avoid:"Avoid metaldehyde baits - toxic to pets and wildlife. Iron phosphate works just as well and is safe.",
note:"Copper tape on your white Vego top rails = a permanent barrier. Best one-time investment for 9b winters."},
{n:"Powdery Mildew",e:"\u{1F344}",type:"Fungal",sev:"Moderate",pk:"Fall & Spring",pl:"Squash, cucumber, melon, roses",
look:"White powdery coating on leaf surfaces, starts as spots then spreads to cover whole leaves. Leaves yellow, curl, and drop. Thrives in warm days + cool nights with poor airflow.",
threshold:"A few spots = treat early. ACTION immediately - it spreads fast. Once it covers leaves the plant's productivity tanks. Catch it at first spots for best results.",
attract:"N/A - this is a fungus, not a pest. Prevention is airflow and resistant varieties.",
remove:"1) Potassium bicarbonate spray (1 tbsp + 1 tbsp oil per gallon), weekly. 2) Milk spray (40% milk / 60% water) - actually works. 3) Remove affected leaves (trash, don't compost). 4) Neem as preventive.",
avoid:"Don't crowd plants or wet foliage in the evening. Don't compost infected leaves.",
note:"Arrives like clockwork Sep-Oct on cucurbits. Start preventive sprays in August before you see it."},
{n:"Peach Leaf Curl",e:"\u{1F344}",type:"Fungal",sev:"Serious",pk:"Spring (infects in cool wet)",pl:"Peach, nectarine",
look:"New leaves emerge thickened, puckered, and curled - red, pink, or yellow distorted blisters. Appears as leaves unfurl in spring. Severe cases defoliate the tree and ruin the crop.",
threshold:"Zero tolerance - there is NO cure once symptoms appear. The only control is prevention via dormant spray. If you see it, you missed the window; rake and trash fallen leaves and commit to spraying next dormancy.",
attract:"N/A - fungal disease. Control is timing, not predators.",
remove:"PREVENTION ONLY: Copper fungicide spray in DECEMBER and again in JANUARY (dormant season, before bud swell). Two applications. Once leaves emerge it's too late for the season.",
avoid:"Do not wait until you see symptoms - by then the crop is lost. The dormant spray window (Dec + Jan) is everything.",
note:"Every peach grower who skips the dormant spray learns this lesson exactly once. Set a calendar reminder for Dec + Jan."},
];

// ─── BENEFICIAL INSECTS (Priority 4 - attract good bugs) ───
var BENEFICIALS=[
{n:"Ladybugs",e:"\u{1F41E}",eats:"Aphids, mites, whitefly, scale",attract:"Dill, fennel, yarrow, dandelion, marigold. Release at dusk after watering so they stay.",note:"One ladybug eats 50+ aphids a day. Larvae (look like tiny alligators) eat even more."},
{n:"Lacewings",e:"\u{1F41B}",eats:"Aphids, mites, thrips, whitefly eggs",attract:"Cosmos, coreopsis, sweet alyssum, dill. Their larvae are voracious 'aphid lions'.",note:"The larvae are the real predators - they clear soft-bodied pests fast."},
{n:"Parasitic Wasps",e:"\u{1F41D}",eats:"Hornworms, cabbage worms, aphids",attract:"Tiny-flowered herbs: dill, fennel, cilantro left to flower, yarrow, alyssum.",note:"Harmless to humans (too small to sting). White cocoons on a hornworm = leave it alone."},
{n:"Hoverflies",e:"\u{1FAB0}",eats:"Aphids (larvae devour them)",attract:"Sweet alyssum, marigold, cosmos, herbs in bloom. Adults look like tiny bees.",note:"Also excellent pollinators. Plant alyssum throughout beds to keep them around."},
{n:"Predatory Mites",e:"\u{1F50D}",eats:"Spider mites",attract:"Sold commercially (Phytoseiulus persimilis). Release on affected plants.",note:"The go-to solution for a serious spider mite outbreak when sprays aren't enough."},
{n:"Praying Mantis",e:"\u{1F99F}",eats:"Almost any insect (good and bad)",attract:"Tall grasses, shrubs for egg cases. Buy egg cases and attach to branches.",note:"Generalist - eats pests but also beneficials. A sign of a balanced garden."},
];

// ─── ZONE CALENDAR (the month guide) ───
var CAL=[
{m:1,i:["\u2702\uFE0F Finish dormant pruning stone fruit","\u{1F9EA} First copper spray for peach leaf curl","\u{1F331} Start tomato/pepper seeds indoors","\u{1F955} Harvest cool-season roots","\u{1F4CB} Order seeds for spring"]},
{m:2,i:["\u{1F345} Transplant tomatoes late Feb","\u{1F33F} First citrus feed of the year","\u{1F331} Start peppers & eggplant","\u2702\uFE0F Last pruning window","\u{1F9EA} Soil test beds"]},
{m:3,i:["\u{1F331} Direct sow beans, squash, basil","\u{1F33C} Plant marigold & nasturtium borders","\u{1F33F} Feed fruiting veg at transplant","\u{1F41B} Scout aphids on new growth","\u{1F33B} Sow sunflowers"]},
{m:4,i:["\u{1F331} Everything in the ground","\u{1F33F} Switch tomatoes to low-N at flower","\u{1F4A7} Increase watering","\u{1F353} Strawberry harvest begins","\u{1F41B} Watch for aphids"]},
{m:5,i:["\u{1F33F} Second citrus feed","\u{1F345} First tomato harvest!","\u{1F351} Stone fruit developing","\u{1F4A7} Deep water fruit trees weekly","\u{1F99F} Watch for whitefly"]},
{m:6,i:["\u{1F345} Peak harvest - tomatoes, squash","\u{1F351} Stone fruit harvest begins!","\u{1F4A7} Water deeply, mulch everything","\u2600\uFE0F Deploy shade cloth","\u{1F577}\uFE0F Spider mite season starts"]},
{m:7,i:["\u{1F525} Heat management - shade + water","\u{1F345} Keep harvesting daily","\u{1F577}\uFE0F Spider mite PEAK","\u{1F351} Peach & plum harvest","\u{1FAD0} Last blueberry picks"]},
{m:8,i:["\u{1F33F} Third & final citrus feed","\u{1F331} Sow fall tomatoes & beans","\u{1F331} Start brassica seeds for Sep","\u{1F4A7} Containers may need 2x water","\u{1F525} Heat wave prep"]},
{m:9,i:["\u{1F331} Transplant kale, broccoli, chard","\u{1F955} Sow carrots, lettuce, beets","\u{1F33F} Sow arugula, radish, peas","\u{1F345} Pull spent summer crops","\u{1F33C} Fall marigold sowing"]},
{m:10,i:["\u{1F353} Plant bare-root strawberries","\u{1F9C4} Plant garlic cloves","\u{1F331} Sow cool-season greens","\u{1F957} Cool-season crops thriving","\u{1F33F} Feed fall transplants"]},
{m:11,i:["\u{1FAD0} Plant bare-root blueberries","\u{1F34B} Citrus harvest begins!","\u{1F96C} Full cool-season production","\u{1F331} Last lettuce/spinach sowings","\u{1F342} Mulch all beds"]},
{m:12,i:["\u2702\uFE0F Begin dormant pruning","\u{1F9EA} First copper spray leaf curl","\u{1F34B} Peak citrus season!","\u{1F96C} Harvest kale, chard, carrots","\u{1F4CB} Plan next year"]},
];

var TASKS=[];
var FC=[{d:"Today",h:94,i:"\u2600\uFE0F"},{d:"Thu",h:99,i:"\u{1F525}"},{d:"Fri",h:103,i:"\u{1F525}"},{d:"Sat",h:97,i:"\u2600\uFE0F"},{d:"Sun",h:90,i:"\u26C5"},{d:"Mon",h:88,i:"\u26C5"}];
var COACH={"What should I plant now?":"August in 9b: start brassica seeds for Sep. Direct-sow late bush beans. Wait on lettuce until nights < 75F. Great time to plan fall fruit tree planting too.","When to fertilize citrus?":"Now! August = final feed (Feb/May/Aug). High-N citrus formula with iron, zinc, manganese. Water deeply after.","What to plant after tomatoes?":"Rotate families. Bush beans (fix nitrogen), or Sep sow kale, carrots, lettuce. Never follow with peppers.","How to fix spider mites?":"Blast undersides 2-3 days. Soap evening. Serious: predatory mites. Prevention: mist foliage in heat.","Best fruit trees for 9b?":"Low-chill is key: Meyer lemon, navel orange, Babcock peach, Santa Rosa plum, Blenheim apricot, Hass avocado (on a mound!), Wonderful pomegranate, Fuyu persimmon, Anna apple, Black Mission fig. All thrive here.","Most medicinal plants?":"Rosemary (memory), Garlic (heart, immune), Sage (memory), Lavender (sleep), Mint (IBS). Pomegranate and blueberry for antioxidants."};
var PAIRS={"Tomato+Basil":"great","Tomato+Marigold":"great","Tomato+Carrot":"good","Tomato+Fennel":"bad","Tomato+Kale":"bad","Basil+Pepper":"great","Basil+Sage":"bad","Lettuce+Carrot":"great","Lettuce+Radish":"great","Kale+Garlic":"great","Kale+Strawberry":"bad","Carrot+Rosemary":"great","Carrot+Dill":"bad","Strawberry+Borage":"great","Bean+Corn":"great","Bean+Onion":"bad","Rosemary+Sage":"great","Rosemary+Mint":"bad","Cucumber+Bean":"great","Cucumber+Sage":"bad","Garlic+Tomato":"great","Nasturtium+Squash":"great","Pepper+Fennel":"bad"};
var CL=Object.keys(PAIRS).join("+").split("+").filter(function(v,i,a){return a.indexOf(v)===i}).sort();
function ckp(a,b){return PAIRS[a+"+"+b]||PAIRS[b+"+"+a]||null}
var MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var PC={urgent:G.red,high:G.c2,medium:G.s3,low:G.t4};
var CATS={all:"All",herb:"Herbs",fruiting:"Fruiting",leafy:"Leafy",brassica:"Brassica",root:"Root",legume:"Legume",allium:"Allium",citrus:"Citrus",stone:"Stone",tree:"Trees",berry:"Berry",flower:"Flower"};
var SYM=["Yellowing","Curling","Brown spots","Holes","Webbing","Sticky","White powder","Wilting"];
var DDB={"yellow":{p:"Magnesium Deficiency",c:74,a:["Epsom salt 1 tbsp/gal AM","Let top inch dry","Recheck 7 days"]},"curl":{p:"Heat Stress",c:68,a:["Deep water evening","Shade cloth 30%","Mulch 3-4in"]},"hole":{p:"Cabbage Worm",c:82,a:["BT spray","Hand-pick AM","Row cover"]},"web":{p:"Spider Mites",c:85,a:["Blast undersides 2-3d","Soap evening","Predatory mites"]},"stick":{p:"Aphids",c:79,a:["Water blast","Ladybugs dusk","Control ants"]},"powder":{p:"Powdery Mildew",c:88,a:["Potassium bicarb weekly","Remove leaves","Improve airflow"]},"brown":{p:"Bacterial Spot",c:61,a:["Remove leaves","Switch to drip","Copper spray"]},"wilt":{p:"Root Stress",c:65,a:["Deep soak now","Check 4in depth","Add mulch"]}};

// ─── BED SHAPES (Priority 2 - now with circular) ───
var SHAPES=[{id:"rect",n:"2\u00D78 Rectangle",w:8,h:2,round:false},{id:"square",n:"4\u00D74 Square",w:4,h:4,round:false},{id:"circle",n:"Round Vego",w:4,h:4,round:true},{id:"wide",n:"4\u00D72 Wide",w:4,h:2,round:false},{id:"long",n:"1\u00D78 Narrow",w:8,h:1,round:false},{id:"large",n:"3\u00D76 Large",w:6,h:3,round:false},{id:"container",n:"Container",w:3,h:3,round:false},{id:"mega",n:"2\u00D710 Long",w:10,h:2,round:false}];

// ─── PLANT PALETTE for bed planner ───
var PP=[{e:"\u{1F345}",n:"Tomato",s:4},{e:"\u{1F336}",n:"Pepper",s:2},{e:"\u{1F952}",n:"Zucchini",s:4},{e:"\u{1F96C}",n:"Lettuce",s:1},{e:"\u{1F957}",n:"Kale",s:2},{e:"\u{1F955}",n:"Carrot",s:1},{e:"\u{1F33F}",n:"Basil",s:1},{e:"\u{1F353}",n:"Strawberry",s:1},{e:"\u{1F33C}",n:"Marigold",s:1},{e:"\u{1F9E1}",n:"Nasturtium",s:1},{e:"\u{1F7E3}",n:"Beet",s:1},{e:"\u{1F534}",n:"Radish",s:1},{e:"\u{1F346}",n:"Eggplant",s:4},{e:"\u{1F952}",n:"Cucumber",s:2},{e:"\u{1F33F}",n:"Cilantro",s:1},{e:"\u{1F9C5}",n:"Onion",s:1},{e:"\u{1F33F}",n:"Dill",s:1},{e:"\u{1F96C}",n:"Spinach",s:1},{e:"\u{1F33F}",n:"Arugula",s:1},{e:"\u{1F308}",n:"Chard",s:1},{e:"\u{1F33F}",n:"Thyme",s:1},{e:"\u{1F33B}",n:"Sunflower",s:4},{e:"\u{1F9C4}",n:"Garlic",s:1}];
// ─── BED PLANNER: PLANT GROUPS WITH VARIETIES (maxed out) ───
// Each group: {n, e, s(default size), cat, v:[varieties]}. Tap group -> expand varieties. Or place generic.
var PG=[
{n:"Tomato",e:"\u{1F345}",s:4,cat:"fruiting",v:["Sungold","Sweet 100","Cherokee Purple","Beefsteak","Roma","San Marzano","Brandywine","Early Girl","Better Boy","Green Zebra","Black Krim","Yellow Pear","Celebrity","Mortgage Lifter","Mr. Stripey","Juliet","Big Boy","Amish Paste","Carbon","Pineapple"]},
{n:"Pepper",e:"\u{1F336}\uFE0F",s:2,cat:"fruiting",v:["Bell","Jalapeno","Serrano","Habanero","Shishito","Anaheim","Poblano","Cayenne","Ghost","Banana","Cubanelle","Thai Chili","Scotch Bonnet","Carolina Reaper","Hungarian Wax","Padron","Fresno","Tabasco","Pimento","Aji Amarillo"]},
{n:"Basil",e:"\u{1F33F}",s:1,cat:"herb",v:["Genovese","Thai","Sweet","Purple","Lemon","Lime","Cinnamon","Holy (Tulsi)","Greek","Lettuce Leaf","African Blue","Cardinal","Spicy Globe"]},
{n:"Sage",e:"\u{1F33F}",s:1,cat:"herb",v:["Common Garden","Pineapple","Purple","Tricolor","Berggarten","Golden","White","Clary","Mexican Bush","Cleveland"]},
{n:"Mint",e:"\u{1F33F}",s:1,cat:"herb",v:["Spearmint","Peppermint","Chocolate","Apple","Orange","Pineapple","Mojito","Ginger","Lavender","Banana"]},
{n:"Thyme",e:"\u{1F33F}",s:1,cat:"herb",v:["English","French","Lemon","Creeping","Caraway","Silver","Woolly","Orange","Elfin"]},
{n:"Oregano",e:"\u{1F33F}",s:1,cat:"herb",v:["Greek","Italian","Golden","Mexican","Syrian","Hot & Spicy","Cuban"]},
{n:"Rosemary",e:"\u{1F331}",s:1,cat:"herb",v:["Tuscan Blue","Arp","Prostrate","Spice Islands","Barbeque","Gorizia","Salem"]},
{n:"Lavender",e:"\u{1F49C}",s:1,cat:"herb",v:["English","Spanish","French","Grosso","Munstead","Hidcote","Provence","Phenomenal"]},
{n:"Lettuce",e:"\u{1F96C}",s:1,cat:"leafy",v:["Romaine","Butterhead","Oakleaf","Red Leaf","Green Leaf","Iceberg","Little Gem","Lollo Rossa","Bibb","Salanova","Speckled","Freckles"]},
{n:"Kale",e:"\u{1F957}",s:2,cat:"brassica",v:["Lacinato (Dino)","Curly","Red Russian","Redbor","Siberian","Premier","Scarlet","Dwarf Blue","Portuguese"]},
{n:"Chard",e:"\u{1F308}",s:1,cat:"leafy",v:["Rainbow","Bright Lights","Fordhook Giant","Ruby Red","Peppermint","Lucullus","Golden"]},
{n:"Spinach",e:"\u{1F96C}",s:1,cat:"leafy",v:["Bloomsdale","Space","Malabar","New Zealand","Tyee","Corvair","Red Kitten","Baby Leaf"]},
{n:"Arugula",e:"\u{1F33F}",s:1,cat:"leafy",v:["Wild","Astro","Roquette","Dragon's Tongue","Sylvetta"]},
{n:"Carrot",e:"\u{1F955}",s:1,cat:"root",v:["Nantes","Danvers","Imperator","Chantenay","Purple Dragon","Cosmic Purple","Rainbow","Atomic Red","Lunar White","Paris Market","Yellowstone","Scarlet Nantes"]},
{n:"Beet",e:"\u{1F7E3}",s:1,cat:"root",v:["Detroit Dark Red","Chioggia","Golden","Bull's Blood","Cylindra","White Albino","Avalanche","Red Ace"]},
{n:"Radish",e:"\u{1F534}",s:1,cat:"root",v:["French Breakfast","Cherry Belle","Watermelon","Daikon","Black Spanish","Easter Egg","White Icicle","Purple Plum","China Rose"]},
{n:"Onion",e:"\u{1F9C5}",s:1,cat:"allium",v:["Yellow Sweet","Red","White","Walla Walla","Vidalia","Cipollini","Bunching/Green","Egyptian Walking","Texas Sweet"]},
{n:"Garlic",e:"\u{1F9C4}",s:1,cat:"allium",v:["Softneck","Hardneck","Elephant","Music","German Red","Spanish Roja","Inchelium Red","Chesnok Red"]},
{n:"Cucumber",e:"\u{1F952}",s:2,cat:"fruiting",v:["Marketmore","Armenian","Lemon","Persian","Pickling","English","Suyo Long","Boston Pickling","Cucamelon","Bush"]},
{n:"Squash",e:"\u{1F952}",s:4,cat:"fruiting",v:["Zucchini","Yellow Crookneck","Pattypan","Butternut","Acorn","Spaghetti","Delicata","Kabocha","Hubbard","Pumpkin","Luffa"]},
{n:"Eggplant",e:"\u{1F346}",s:4,cat:"fruiting",v:["Black Beauty","Japanese (Ichiban)","Italian","Fairy Tale","Rosa Bianca","Thai","Graffiti","White","Chinese"]},
{n:"Bean",e:"\u{1FAD8}",s:1,cat:"legume",v:["Bush","Pole","Lima","Fava","Yard-Long","Black-Eyed Pea","Edamame","Scarlet Runner","Cranberry","Dragon Tongue","Romano"]},
{n:"Pea",e:"\u{1FAD8}",s:1,cat:"legume",v:["Sugar Snap","Snow","Shelling","English","Lincoln","Wando","Oregon Giant","Pea Shoots"]},
{n:"Strawberry",e:"\u{1F353}",s:1,cat:"berry",v:["Everbearing","June-bearing","Albion","Seascape","Chandler","Alpine","Tristar","Ozark Beauty"]},
{n:"Cilantro",e:"\u{1F33F}",s:1,cat:"herb",v:["Slow Bolt","Santo","Calypso","Leisure","Confetti","Culantro"]},
{n:"Parsley",e:"\u{1F33F}",s:1,cat:"herb",v:["Italian Flat-Leaf","Curly","Hamburg Root","Giant of Italy"]},
{n:"Dill",e:"\u{1F33F}",s:1,cat:"herb",v:["Bouquet","Fernleaf","Mammoth","Dukat","Long Island"]},
{n:"Chive",e:"\u{1F33F}",s:1,cat:"herb",v:["Common","Garlic","Giant Siberian"]},
{n:"Cabbage",e:"\u{1F966}",s:4,cat:"brassica",v:["Green","Red","Savoy","Napa","Bok Choy","Tatsoi","Early Jersey","January King"]},
{n:"Broccoli",e:"\u{1F966}",s:4,cat:"brassica",v:["Calabrese","Broccolini","Romanesco","Purple Sprouting","Di Cicco","Waltham"]},
{n:"Cauliflower",e:"\u{1F966}",s:4,cat:"brassica",v:["Snowball","Purple","Cheddar (Orange)","Romanesco","Graffiti","Green"]},
{n:"Melon",e:"\u{1F348}",s:4,cat:"fruiting",v:["Cantaloupe","Honeydew","Watermelon","Charentais","Galia","Crenshaw","Sugar Baby"]},
{n:"Corn",e:"\u{1F33D}",s:4,cat:"fruiting",v:["Sweet (Bicolor)","Silver Queen","Golden Bantam","Glass Gem","Popcorn","Painted Mountain"]},
{n:"Potato",e:"\u{1F954}",s:2,cat:"root",v:["Yukon Gold","Russet","Red Pontiac","Fingerling","Purple Majesty","Kennebec","German Butterball"]},
{n:"Marigold",e:"\u{1F33C}",s:1,cat:"flower",v:["French","African","Signet","Mexican","Lemon Gem"]},
{n:"Nasturtium",e:"\u{1F9E1}",s:1,cat:"flower",v:["Jewel","Empress of India","Alaska","Climbing","Whirlybird"]},
{n:"Sunflower",e:"\u{1F33B}",s:4,cat:"flower",v:["Mammoth","Teddy Bear","Autumn Beauty","Lemon Queen","Velvet Queen","Italian White"]},
{n:"Tomatillo",e:"\u{1F7E2}",s:2,cat:"fruiting",v:["Toma Verde","Purple","Pineapple","Grande Rio Verde"]},
{n:"Okra",e:"\u{1F33F}",s:2,cat:"fruiting",v:["Clemson Spineless","Burgundy","Emerald","Star of David","Jambalaya"]},
{n:"Leek",e:"\u{1F9C5}",s:1,cat:"allium",v:["American Flag","King Richard","Bandit","Giant Musselburgh"]},
{n:"Turnip",e:"\u{1F7E3}",s:1,cat:"root",v:["Purple Top","Hakurei","Golden Ball","Scarlet Queen"]},
{n:"Mustard",e:"\u{1F96C}",s:1,cat:"leafy",v:["Green Wave","Red Giant","Mizuna","Tatsoi","Florida Broadleaf","Osaka Purple"]},
{n:"Collard",e:"\u{1F957}",s:2,cat:"brassica",v:["Georgia","Vates","Champion","Morris Heading"]},
{n:"Celery",e:"\u{1F33F}",s:1,cat:"leafy",v:["Tall Utah","Tango","Golden Self-Blanching","Celeriac"]},
{n:"Fennel",e:"\u{1F33F}",s:1,cat:"herb",v:["Florence (Bulb)","Bronze","Sweet"]},
{n:"Ginger",e:"\u{1FADA}",s:1,cat:"root",v:["Common","Turmeric","Galangal"]},
{n:"Herbs (other)",e:"\u{1F33F}",s:1,cat:"herb",v:["Tarragon","Marjoram","Lemon Balm","Lemongrass","Stevia","Borage","Chamomile","Summer Savory","Catnip","Shiso","Epazote","Curry Leaf","Sorrel"]},
{n:"Flowers (other)",e:"\u{1F33C}",s:1,cat:"flower",v:["Calendula","Cosmos","Zinnia","Borage","Bachelor Button","Sweet Alyssum","Snapdragon","Pansy"]},
];


// ─── IRRIGATION CONTROLLERS (Priority 3) ───
var CONTROLLERS=[
{id:"rachio",n:"Rachio",e:"\u{1F4A7}",desc:"Smart Sprinkler Controller",zones:8,wifi:true},
{id:"bhyve",n:"Orbit B-hyve",e:"\u{1F4A6}",desc:"WiFi Timer & Controller",zones:8,wifi:true},
{id:"rainmachine",n:"RainMachine",e:"\u{1F327}\uFE0F",desc:"Forecast Sprinkler Controller",zones:12,wifi:true},
{id:"opensprinkler",n:"OpenSprinkler",e:"\u{1F6B0}",desc:"Open-Source Controller",zones:16,wifi:true},
{id:"netro",n:"Netro",e:"\u{1F33F}",desc:"Smart Whisperer",zones:6,wifi:true},
];

// ─── FEEDING AMENDMENTS (calculator data) ───
// rate = how to apply, perSqFt = base amount per square foot, strength tier
var AMENDMENTS=[
{id:"castings",n:"Worm Castings",e:"\u{1F41B}",tier:"Gentle",unit:"cups",perSqFt:0.5,
desc:"Mild, won't burn. Microbe-rich. Great for seedlings and topdressing anytime.",
how:"Topdress and scratch into the top inch, or mix into planting holes. Water in.",
freq:"Every 4-6 weeks during the growing season."},
{id:"compost",n:"Compost (Malibu/homemade)",e:"\u{1F33F}",tier:"Gentle",unit:"inches",perSqFt:0,
desc:"Builds soil structure and slow-release nutrition. Malibu Compost (biodynamic) is a SoCal favorite.",
how:"Spread a 1-2 inch layer over the bed and lightly work in the top few inches. Replenish between plantings.",
freq:"Topdress 1 inch at each new planting, plus a mid-season refresh."},
{id:"fishemulsion",n:"Fish Emulsion",e:"\u{1F41F}",tier:"Mild",unit:"tbsp/gal",perSqFt:0,
desc:"Fast-acting liquid nitrogen. Smelly but effective for leafy growth.",
how:"Dilute per label (usually 1-2 tbsp per gallon of water). Drench the soil, avoid foliage in sun.",
freq:"Every 2 weeks for heavy feeders during vegetative growth."},
{id:"allpurpose",n:"All-Purpose Granular (e.g. 4-4-4)",e:"\u{1F33E}",tier:"Medium",unit:"cups",perSqFt:0.25,
desc:"Balanced organic granular fertilizer. Steady feeding for most vegetables.",
how:"Broadcast evenly over the bed, scratch into the top inch, water thoroughly.",
freq:"Every 4-6 weeks, or at each new planting."},
{id:"tomatofeed",n:"Tomato/Veg Fertilizer (e.g. 3-4-6)",e:"\u{1F345}",tier:"Medium",unit:"cups",perSqFt:0.3,
desc:"Higher phosphorus & potassium for fruit and flower production. Lower N to avoid all-leaf-no-fruit.",
how:"Work into soil at transplant, then sidedress when flowering begins. Water in.",
freq:"At transplant, at first flower, then every 3-4 weeks while fruiting."},
{id:"citrusfeed",n:"Citrus & Fruit Tree Food",e:"\u{1F34A}",tier:"Strong",unit:"cups",perSqFt:0.4,
desc:"High-nitrogen with micronutrients (iron, zinc, manganese) citrus needs in 9b.",
how:"Spread under the canopy out to the drip line (NOT against the trunk), scratch in, water deeply.",
freq:"3x per year in 9b: February, May, and August."},
{id:"bloodmeal",n:"Blood Meal (12-0-0)",e:"\u{1FA78}",tier:"Strong",unit:"tbsp",perSqFt:1,
desc:"Concentrated fast nitrogen. Use sparingly - easy to over-apply and burn roots.",
how:"Light sprinkle, scratch in, water immediately. Don't let it touch stems.",
freq:"Once at planting for heavy leafy feeders, or as a nitrogen rescue."},
{id:"bonemeal",n:"Bone Meal (3-15-0)",e:"\u{1F9B4}",tier:"Medium",unit:"tbsp",perSqFt:1,
desc:"Slow-release phosphorus for root development, bulbs, and flowering.",
how:"Mix into the planting hole for transplants, bulbs, and root crops. Water in.",
freq:"Once at planting. Phosphorus is slow to move - place it near roots."},
];
// Quick lookup for tier color
var TIERC={Gentle:"#74B89A",Mild:"#95D5B2",Medium:"#E8A840",Strong:"#FF8C42"};

// ─── PER-CROP FEEDING SCHEDULES ───
// Each crop maps to feeding phases keyed off days-since-planting.
// phase: {at (days from plant, 0=at planting), amend (amendment id), label, note}
var FEEDPLANS=[
{type:"tomato",match:["tomato"],e:"\u{1F345}",n:"Tomatoes",
 phases:[
  {at:0,amend:"allpurpose",label:"At transplant",note:"Mix balanced granular into the planting hole. Don't overdo nitrogen yet."},
  {at:21,amend:"fishemulsion",label:"3 weeks - vegetative",note:"Light liquid feed to push leafy growth before flowering."},
  {at:45,amend:"tomatofeed",label:"First flowers",note:"Switch to lower-N, higher-P/K tomato food. Too much nitrogen now = leaves, not fruit."},
  {at:65,amend:"tomatofeed",label:"Fruiting",note:"Feed every 3-4 weeks while producing. Consistent water prevents blossom-end rot."},
 ]},
{type:"pepper",match:["pepper","jalapeno","shishito","chili"],e:"\u{1F336}\uFE0F",n:"Peppers",
 phases:[
  {at:0,amend:"allpurpose",label:"At transplant",note:"Balanced granular in the hole. Peppers are lighter feeders than tomatoes."},
  {at:30,amend:"fishemulsion",label:"4 weeks",note:"Gentle liquid feed as they establish."},
  {at:55,amend:"tomatofeed",label:"Flowering & fruiting",note:"Switch to lower-N veg fertilizer. A little Epsom salt if leaves yellow between veins."},
 ]},
{type:"leafy",match:["lettuce","kale","chard","spinach","arugula","greens","collard"],e:"\u{1F96C}",n:"Leafy Greens",
 phases:[
  {at:0,amend:"compost",label:"At planting",note:"Work compost in. Greens want steady nitrogen for tender leaves."},
  {at:21,amend:"fishemulsion",label:"3 weeks",note:"Nitrogen-rich liquid feed - this is what greens love."},
  {at:42,amend:"fishemulsion",label:"6 weeks (cut-and-come-again)",note:"Feed again after each big harvest to keep new leaves coming."},
 ]},
{type:"root",match:["carrot","beet","radish","turnip","parsnip"],e:"\u{1F955}",n:"Root Crops",
 phases:[
  {at:0,amend:"bonemeal",label:"At sowing",note:"Mix bone meal (phosphorus) into the bed - it drives roots. AVOID high nitrogen, which makes leafy tops and forked roots."},
  {at:30,amend:"allpurpose",label:"4 weeks",note:"A light balanced feed. Don't add more nitrogen."},
 ]},
{type:"brassica",match:["broccoli","cauliflower","cabbage","brussels"],e:"\u{1F966}",n:"Brassicas",
 phases:[
  {at:0,amend:"allpurpose",label:"At transplant",note:"Balanced granular. Brassicas are heavy feeders."},
  {at:21,amend:"fishemulsion",label:"3 weeks",note:"Nitrogen feed for big leafy frames."},
  {at:45,amend:"tomatofeed",label:"Heading up",note:"Shift toward P/K as heads form. Steady feeding = tight heads."},
 ]},
{type:"squash",match:["zucchini","squash","cucumber","melon","pumpkin","gourd"],e:"\u{1F952}",n:"Squash & Cukes",
 phases:[
  {at:0,amend:"compost",label:"At planting",note:"Rich compost - these are hungry, fast growers."},
  {at:25,amend:"allpurpose",label:"Vining",note:"Balanced feed as vines run."},
  {at:45,amend:"tomatofeed",label:"Flowering & fruiting",note:"Lower-N to favor fruit. Hand-pollinate if fruit drops."},
 ]},
{type:"allium",match:["garlic","onion","leek","shallot","scallion"],e:"\u{1F9C4}",n:"Alliums",
 phases:[
  {at:0,amend:"allpurpose",label:"At planting",note:"Balanced granular worked into the bed."},
  {at:30,amend:"bloodmeal",label:"Active growth",note:"Nitrogen push for bulb size - but stop once bulbs start swelling."},
  {at:90,amend:"bonemeal",label:"Bulbing",note:"Ease off nitrogen; let them mature. Stop feeding ~3 weeks before harvest."},
 ]},
{type:"herb",match:["basil","cilantro","parsley","dill","oregano","thyme","sage","rosemary","mint","chive"],e:"\u{1F33F}",n:"Herbs",
 phases:[
  {at:0,amend:"compost",label:"At planting",note:"Light compost. Most herbs prefer lean soil - over-feeding kills flavor."},
  {at:35,amend:"fishemulsion",label:"5 weeks (if needed)",note:"Light feed only if growth slows. Mediterranean herbs barely need it."},
 ]},
{type:"citrus",match:["lemon","orange","lime","citrus","grapefruit","mandarin","tangerine"],e:"\u{1F34A}",n:"Citrus",
 phases:[
  {at:0,amend:"citrusfeed",label:"February feed",note:"First of three. High-N citrus food with iron/zinc/manganese, spread to the drip line."},
  {at:90,amend:"citrusfeed",label:"May feed",note:"Second feeding as fruit sets and weather warms."},
  {at:180,amend:"citrusfeed",label:"August feed",note:"Final feeding. Don't feed in fall/winter - it pushes tender growth before cold."},
 ]},
{type:"stonefruit",match:["peach","plum","apricot","nectarine","cherry"],e:"\u{1F351}",n:"Stone Fruit",
 phases:[
  {at:0,amend:"allpurpose",label:"Early spring (bud break)",note:"Balanced organic feed as buds break. Spread under canopy, not at trunk."},
  {at:60,amend:"compost",label:"After fruit set",note:"Topdress compost. Avoid heavy nitrogen which grows leaves over fruit."},
 ]},
{type:"berry",match:["blueberry","blackberry","raspberry","strawberry"],e:"\u{1FAD0}",n:"Berries",
 phases:[
  {at:0,amend:"compost",label:"At planting",note:"Compost worked in. Blueberries need ACIDIC feed - use an acid-specific fertilizer, not this general plan."},
  {at:40,amend:"fishemulsion",label:"Active growth",note:"Light feeding. For blueberries, only use acidic (azalea/camellia type) fertilizer."},
 ]},
{type:"tree",match:["avocado","pomegranate","persimmon","apple","fig","pear"],e:"\u{1F333}",n:"Fruit Trees",
 phases:[
  {at:0,amend:"allpurpose",label:"Early spring",note:"Balanced organic feed as growth starts. Young trees: lighter doses, more often."},
  {at:90,amend:"compost",label:"Early summer",note:"Topdress compost out to the drip line. Avocados especially love a thick mulch layer."},
 ]},
];
function feedPlanFor(name){
  var n=(name||"").toLowerCase();
  for(var i=0;i<FEEDPLANS.length;i++){var fp=FEEDPLANS[i];for(var j=0;j<fp.match.length;j++){if(n.indexOf(fp.match[j])>=0)return fp}}
  return null;
}

// ─── HOW-TO GUIDES + 9B TIPS (Learn tab) ───
var GUIDES=[
{id:"build",e:"\u{1F528}",cat:"Build",t:"Build a Raised Bed",sub:"Vego or wood, start to soil",
steps:["Pick a spot with 6+ hours of sun. South-facing is ideal in 9b.","Level the ground. Remove grass; lay cardboard to smother weeds (it breaks down).","Assemble the bed. Vego metal beds bolt together in ~30 min; wood beds need rot-resistant cedar or redwood.","For a 17in tall bed, you don't need to fill it all with premium soil. Bottom third: branches, logs, leaves (hugelkultur) - saves money and holds water.","Middle: native soil mixed with compost.","Top 8-10 inches: quality raised-bed mix (the root zone). This is where to spend.","Water deeply to settle, let sit a few days, then plant."]},
{id:"soil",e:"\u{1FAB4}",cat:"Build",t:"The Perfect Soil Mix",sub:"What to fill your bed with",
steps:["The classic recipe: 1/3 compost, 1/3 peat or coco coir, 1/3 aeration (perlite/pumice/vermiculite).","For 9b: lean toward coco coir over peat - it handles our heat and rewets better when dry.","Add a few inches of worm castings for living soil biology.","Mix in a balanced organic granular fertilizer (like 4-4-4) per the bag rate.","For blueberries: separate acidic mix - add elemental sulfur and use a peat-heavy blend (pH 4.5-5.5).","Top with 2-3 inches of mulch (straw, bark) to hold moisture and moderate soil temp."]},
{id:"water",e:"\u{1F4A7}",cat:"Care",t:"Watering in 9b Heat",sub:"Deep, infrequent, early",
steps:["Water deeply and less often - this trains deep roots that survive heat.","Best time: early morning (4-8am). Evening is OK but can invite fungal issues on foliage.","Stick a finger 2 inches down - if dry, water; if moist, wait.","In a heat wave (95F+), full-sun beds may need a second short evening soak.","Mulch is your #1 water-saver: 3 inches cuts evaporation up to 40%.","Drip or soaker hoses beat overhead - less waste, less disease, deeper soak."]},
{id:"shade",e:"\u2600\uFE0F",cat:"Care",t:"Surviving Heat Waves",sub:"Protecting plants at 100F+",
steps:["Deploy 30-40% shade cloth over heat-sensitive crops (tomatoes, peppers, greens) when it hits 95F+.","Tomatoes drop blossoms above ~95F - shade cloth keeps them setting fruit.","Water in the early morning so plants are hydrated BEFORE the heat hits.","Don't fertilize during a heat wave - stressed plants can't use it and it can burn.","Harvest ripe fruit before a heat spike so it doesn't cook on the vine.","Your white Vego beds reflect heat well - a real advantage over dark beds in 9b."]},
{id:"succession",e:"\u{1F501}",cat:"Grow",t:"Succession Planting",sub:"Never have an empty bed",
steps:["Sow fast crops (radish, lettuce, arugula) every 2-3 weeks for continuous harvest.","When a summer crop finishes, immediately replant - 9b has nearly year-round growing.","Follow heavy feeders (tomatoes, corn) with soil-builders (beans, peas) to restore nitrogen.","Keep seedlings started on the side so a replacement is ready the day a bed opens.","Cool season (Oct-Mar): greens, roots, brassicas, peas. Warm season (Apr-Sep): tomatoes, peppers, squash, beans."]},
{id:"rotate",e:"\u{1F310}",cat:"Grow",t:"Crop Rotation Basics",sub:"Stop pests & disease building up",
steps:["Don't plant the same family in the same bed two seasons running.","Nightshades (tomato, pepper, eggplant, potato) are the big one to rotate - they share diseases.","A simple 4-group rotation: Leaf -> Fruit -> Root -> Legume, then back to Leaf.","Legumes (beans, peas) fix nitrogen - put heavy feeders right after them.","Track what's in each bed (Grove's bed planner does this) so you remember next season."]},
{id:"compost",e:"\u267B\uFE0F",cat:"Soil",t:"Composting in SoCal",sub:"Black gold from scraps",
steps:["Balance greens (kitchen scraps, fresh grass) with browns (dry leaves, cardboard, straw) ~1:2.","In our dry climate, keep the pile as moist as a wrung-out sponge - it'll dry out fast.","Turn every 1-2 weeks to add air and speed it up. Heat = it's working.","Skip meat, dairy, oils, and pet waste.","Finished compost is dark, crumbly, and smells like earth - usually 2-3 months in 9b warmth.","No room? A worm bin (vermicompost) fits on a patio and makes premium castings."]},
{id:"pollinate",e:"\u{1F41D}",cat:"Grow",t:"Attract Pollinators",sub:"More bees = more fruit",
steps:["Plant flowers among your veg: marigold, borage, cosmos, sweet alyssum, nasturtium.","Let some herbs flower (basil, cilantro, dill) - bees love them.","Provide a shallow water source with stones for landing.","Avoid spraying anything during bloom, even organic sprays, when bees are active.","Hand-pollinate squash and tomatoes if fruit set is poor - a small brush or shake works."]},
];
var GUIDECATS=["All","Build","Soil","Care","Grow"];

function daysUntil(plantedISO, dth) {
  if (!plantedISO || !dth) return null;
  var planted = new Date(plantedISO).getTime();
  var ready = planted + dth*24*60*60*1000;
  var now = Date.now();
  return Math.ceil((ready - now)/(24*60*60*1000));
}
function fmtDate(iso){var d=new Date(iso);return MO[d.getMonth()]+" "+d.getDate()}
var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var MOFULL=["January","February","March","April","May","June","July","August","September","October","November","December"];
function todayStr(){var d=new Date();return DAYS[d.getDay()]+", "+MOFULL[d.getMonth()]+" "+d.getDate()}
function greeting(){var h=new Date().getHours();if(h<12)return "Good morning";if(h<17)return "Good afternoon";return "Good evening"}
function seasonNow(){var m=new Date().getMonth()+1;if(m>=3&&m<=5)return {n:"Spring",e:"\u{1F331}",t:"Planting season - get warm-season crops in the ground."};if(m>=6&&m<=8)return {n:"Summer",e:"\u2600\uFE0F",t:"Peak growth & heat - water deep, harvest often, watch for mites."};if(m>=9&&m<=11)return {n:"Fall",e:"\u{1F342}",t:"Cool-season planting - greens, roots, brassicas, garlic."};return {n:"Winter",e:"\u2744\uFE0F",t:"Citrus harvest & dormant pruning. Plan next year."}}

// ─── PERSISTENCE (Supabase sync + localStorage cache) ───
// Saves the full garden state to Supabase (cross-device) and localStorage (instant/offline).
var LS_KEY="grove_data_v1";
function loadSaved(){
  if(typeof window==="undefined")return null;
  try{var raw=window.localStorage.getItem(LS_KEY);return raw?JSON.parse(raw):null}catch(e){return null}
}
function saveLocal(obj){
  if(typeof window==="undefined")return;
  try{window.localStorage.setItem(LS_KEY,JSON.stringify(obj))}catch(e){}
}

export default function Grove(){
  var st=function(i){return useState(i)};
  var SAVED=loadSaved()||{};
  var _t=st("home"),tab=_t[0],setTab=_t[1];
  var _tk=st(SAVED.tasks||TASKS),tasks=_tk[0],setTasks=_tk[1];
  var _s=st(null),sel=_s[0],setSel=_s[1];
  var _sub=st("plants"),sub=_sub[0],setSub=_sub[1];
  var _f=st("all"),fil=_f[0],setFil=_f[1];
  var _ca=st(""),compA=_ca[0],setCA=_ca[1];
  var _cb=st(""),compB=_cb[0],setCB=_cb[1];
  var _cq=st(null),cQ=_cq[0],setCQ=_cq[1];
  var _cx=st(""),cTx=_cx[0],setCTx=_cx[1];
  var _ty=st(false),typing=_ty[0],setTyping=_ty[1];
  var _md=st(false),med=_md[0],setMed=_md[1];
  var _cal=st("plants"),calMode=_cal[0],setCalMode=_cal[1]; // 'plants'|'zone'
  var _cm=st(8),calM=_cm[0],setCalM=_cm[1];
  var _sr=st(""),srch=_sr[0],setSrch=_sr[1];
  var _dm=st(null),dM=_dm[0],setDM=_dm[1];
  var _dp=st(""),dP=_dp[0],setDP=_dp[1];
  var _ds=st(""),dS=_ds[0],setDS=_ds[1];
  var _dr=st(null),dR=_dr[0],setDR=_dr[1];
  var _dph=st(null),dPh=_dph[0],setDPh=_dph[1];
  var _pest=st(null),pestSel=_pest[0],setPestSel=_pest[1];
  // Beds (Priority 2) - now full objects with shape, pH per bed
  var _beds=st(SAVED.beds||function(){
    var arr=[];
    for(var i=0;i<14;i++){
      arr.push({id:i,name:"Bed "+(i+1),shape:i===13?"circle":"rect",sun:i<9?"full":"shade",grid:Array(20).fill(null),ph:[]});
    }
    return arr;
  }),beds=_beds[0],setBeds=_beds[1];
  var _eb=st(null),eB=_eb[0],setEB=_eb[1];
  // Orchard - user's actual trees, pre-seeded (or saved)
  var _orchard=st(SAVED.orchard||[
    {id:1,type:"Peach",variety:"Eva's Pride",e:"\u{1F351}"},
    {id:2,type:"Peach",variety:"Eva's Pride",e:"\u{1F351}"},
    {id:3,type:"Peach",variety:"Eva's Donut (Saturn)",e:"\u{1F351}"},
    {id:4,type:"Apricot",variety:"Golden (Gold Kist)",e:"\u{1F7E0}"},
    {id:5,type:"Apricot",variety:"Blenheim (Royal)",e:"\u{1F7E0}"},
    {id:6,type:"Nectarine",variety:"Double Delight",e:"\u{1F351}"},
  ]),orchard=_orchard[0],setOrchard=_orchard[1];
  var _addTree=st(false),addTree=_addTree[0],setAddTree=_addTree[1];
  // ── 2D YARD DESIGNER ──
  // Top-down layout. Each item: {id,kind,label,x,y,w,h,e,color}. Coords in canvas units (0-100 each axis).
  var _yard=st(SAVED.yard||[
    // User's real layout: 8 beds in a back row, trees middle-left, front row of beds
    {id:1,kind:"bed",label:"Bed 1",x:8,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:2,kind:"bed",label:"Bed 2",x:19,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:3,kind:"bed",label:"Bed 3",x:30,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:4,kind:"bed",label:"Bed 4",x:41,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:5,kind:"bed",label:"Bed 5",x:52,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:6,kind:"bed",label:"Bed 6",x:63,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:7,kind:"bed",label:"Bed 7",x:74,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:8,kind:"bed",label:"Bed 8",x:85,y:8,w:9,h:5,e:"\u{1F331}"},
    {id:9,kind:"tree",label:"Peach",x:10,y:42,w:11,h:11,e:"\u{1F351}"},
    {id:10,kind:"tree",label:"Apricot",x:24,y:46,w:11,h:11,e:"\u{1F7E0}"},
    {id:11,kind:"tree",label:"Nectarine",x:12,y:60,w:11,h:11,e:"\u{1F351}"},
    {id:12,kind:"bed",label:"Bed 9",x:30,y:84,w:9,h:5,e:"\u{1F331}"},
    {id:13,kind:"bed",label:"Bed 10",x:41,y:84,w:9,h:5,e:"\u{1F331}"},
    {id:14,kind:"bed",label:"Bed 11",x:52,y:84,w:9,h:5,e:"\u{1F331}"},
    {id:15,kind:"bed",label:"Bed 12",x:63,y:84,w:9,h:5,e:"\u{1F331}"},
  ]),yard=_yard[0],setYard=_yard[1];
  var _yardSel=st(null),yardSel=_yardSel[0],setYardSel=_yardSel[1]; // selected item id
  var _yardMode=st(false),yardMode=_yardMode[0],setYardMode=_yardMode[1]; // yard designer open
  var _yardDrag=st(null),yardDrag=_yardDrag[0],setYardDrag=_yardDrag[1]; // {id,offX,offY}
  var _yard3D=st(false),yard3D=_yard3D[0],setYard3D=_yard3D[1]; // 3D view toggle
  var _y3time=st(13),y3time=_y3time[0],setY3time=_y3time[1]; // hour 0-24 for 3D lighting
  var _y3season=st(seasonNow().n),y3season=_y3season[0],setY3season=_y3season[1]; // 3D season
  // Task management
  var _taskView=st("today"),taskView=_taskView[0],setTaskView=_taskView[1]; // today|week|month
  var _addTask=st(false),addTaskOpen=_addTask[0],setAddTaskOpen=_addTask[1];
  var _ntText=st(""),ntText=_ntText[0],setNtText=_ntText[1];
  var _ntWhen=st("today"),ntWhen=_ntWhen[0],setNtWhen=_ntWhen[1];
  var _ntPrio=st("medium"),ntPrio=_ntPrio[0],setNtPrio=_ntPrio[1];
  var _ntEmoji=st("\u{1F331}"),ntEmoji=_ntEmoji[0],setNtEmoji=_ntEmoji[1];
  var addNewTask=function(){
    if(!ntText.trim())return;
    var nid=tasks.length?Math.max.apply(null,tasks.map(function(t){return t.id||0}))+1:1;
    setTasks(tasks.concat([{id:nid,c:ntEmoji,t:ntText.trim(),p:ntPrio,d:false,when:ntWhen}]));
    setNtText("");setAddTaskOpen(false);setTaskView(ntWhen);
  };
  var TASK_EMOJIS=["\u{1F331}","\u{1F4A7}","\u{1F33F}","\u{1F9EA}","\u{1F345}","\u2702\uFE0F","\u{1FAB4}","\u{1F41B}","\u{1F33E}","\u{1F4CB}"];
  var _addGarden=st(false),addGarden=_addGarden[0],setAddGarden=_addGarden[1]; // plant->bed picker open
  var _addGardenMsg=st(""),addGardenMsg=_addGardenMsg[0],setAddGardenMsg=_addGardenMsg[1];
  var _treeType=st(null),treeType=_treeType[0],setTreeType=_treeType[1]; // selected type when adding
  // ── SYNC: Supabase (cross-device) + localStorage (instant/offline) ──
  var _synced=st(false),synced=_synced[0],setSynced=_synced[1]; // has cloud load finished
  var _syncState=st("idle"),syncState=_syncState[0],setSyncState=_syncState[1]; // 'idle'|'saving'|'saved'|'offline'
  var _hydrated=st(false),hydrated=_hydrated[0],setHydrated=_hydrated[1]; // applied cloud data yet
  // Load from Supabase on mount; fall back to whatever localStorage already gave us
  useEffect(function(){
    var sb;try{sb=createClient()}catch(e){setSynced(true);setHydrated(true);return}
    sb.auth.getUser().then(function(res){
      var user=res&&res.data&&res.data.user;
      if(!user){setSynced(true);setHydrated(true);return}
      sb.from("garden_state").select("data").eq("user_id",user.id).maybeSingle().then(function(r){
        if(r&&r.data&&r.data.data){
          var d=r.data.data;
          // Apply cloud data (cloud is source of truth across devices)
          if(d.beds)setBeds(d.beds);
          if(d.orchard)setOrchard(d.orchard);
          if(d.myPlants)setMyPlants(d.myPlants);
          if(d.photos)setPhotos(d.photos);
          if(d.zMap)setZMap(d.zMap);
          if(d.tasks)setTasks(d.tasks);
          if(d.zcfg)setZcfg(d.zcfg);
          if(d.rmode)setRMode(d.rmode);
          if(d.rhist)setRHist(d.rhist);
          if(d.yard)setYard(d.yard);
          saveLocal(d);
        }
        setSynced(true);setHydrated(true);
      }).catch(function(){setSynced(true);setHydrated(true);setSyncState("offline")});
    }).catch(function(){setSynced(true);setHydrated(true)});
  },[]);
  // Auto-save: localStorage immediately, Supabase debounced. Only after initial hydration.
  useEffect(function(){
    if(!hydrated)return;
    var payload={beds:beds,orchard:orchard,myPlants:myPlants,photos:photos,zMap:zMap,tasks:tasks,zcfg:zcfg,rmode:rMode,rhist:rHist,yard:yard};
    saveLocal(payload);
    setSyncState("saving");
    var t=setTimeout(function(){
      var sb;try{sb=createClient()}catch(e){setSyncState("offline");return}
      sb.auth.getUser().then(function(res){
        var user=res&&res.data&&res.data.user;
        if(!user){setSyncState("idle");return}
        sb.from("garden_state").upsert({user_id:user.id,data:payload},{onConflict:"user_id"}).then(function(r){
          setSyncState(r&&r.error?"offline":"saved");
        }).catch(function(){setSyncState("offline")});
      }).catch(function(){setSyncState("offline")});
    },1200);
    return function(){clearTimeout(t)};
  },[beds,orchard,myPlants,photos,zMap,tasks,zcfg,rMode,rHist,yard,hydrated]);
  var _pal=st(null),pal=_pal[0],setPal=_pal[1];
  var _palGroup=st(null),palGroup=_palGroup[0],setPalGroup=_palGroup[1]; // which type is expanded
  var _palSrch=st(""),palSrch=_palSrch[0],setPalSrch=_palSrch[1]; // search within planner
  var _bsub=st("plants"),bSub=_bsub[0],setBSub=_bsub[1]; // bed detail: 'plants'|'ph'
  var _addBed=st(false),addBed=_addBed[0],setAddBed=_addBed[1];
  var _newShape=st("rect"),newShape=_newShape[0],setNewShape=_newShape[1];
  // My plants / calendar (Priority 1)
  var _myp=st(SAVED.myPlants||[]),myPlants=_myp[0],setMyPlants=_myp[1];
  var _ap=st(false),addPlant=_ap[0],setAddPlant=_ap[1];
  var _apn=st(""),apName=_apn[0],setApName=_apn[1];
  var _apb=st("Bed 1"),apBed=_apb[0],setApBed=_apb[1];
  var _apd=st(60),apDth=_apd[0],setApDth=_apd[1];
  // Irrigation (Priority 3)
  var _ctrl=st(null),controller=_ctrl[0],setController=_ctrl[1];
  // Universal irrigation integration (Rachio, Netro, OpenSprinkler)
  var _rprov=st(null),rProv=_rprov[0],setRProv=_rprov[1]; // 'rachio'|'netro'|'opensprinkler' being set up
  var _rtok=st(""),rTok=_rtok[0],setRTok=_rtok[1];
  var _rhost=st(""),rHost=_rhost[0],setRHost=_rhost[1]; // OpenSprinkler IP
  var _rdev=st(null),rDev=_rdev[0],setRDev=_rdev[1]; // connected device {id,name,zones}
  var _rconn=st(null),rConn=_rconn[0],setRConn=_rconn[1]; // which provider is connected
  var _rbusy=st(false),rBusy=_rbusy[0],setRBusy=_rbusy[1];
  var _rerr=st(""),rErr=_rerr[0],setRErr=_rerr[1];
  var _rmsg=st(""),rMsg=_rmsg[0],setRMsg=_rmsg[1];
  var _rdur=st(10),rDur=_rdur[0],setRDur=_rdur[1];
  // Deeper irrigation customization
  var _zcfg=st(SAVED.zcfg||{}),zcfg=_zcfg[0],setZcfg=_zcfg[1]; // {zoneId:{dur,days:[0-6],time,enabled}}
  var _rmode=st(SAVED.rmode||"normal"),rMode=_rmode[0],setRMode=_rmode[1]; // normal|heatwave|seedling|established|eco
  var _rhist=st(SAVED.rhist||[]),rHist=_rhist[0],setRHist=_rhist[1]; // [{zone,date,min}]
  var _editZcfg=st(null),editZcfg=_editZcfg[0],setEditZcfg=_editZcfg[1]; // zone being configured
  var _runningAll=st(false),runningAll=_runningAll[0],setRunningAll=_runningAll[1];
  // Mode multipliers for runtime
  var RMODES={normal:{n:"Normal",e:"\u{1F4A7}",mult:1,desc:"Standard runtimes"},heatwave:{n:"Heat Wave",e:"\u{1F525}",mult:1.5,desc:"+50% for extreme heat"},seedling:{n:"Seedling",e:"\u{1F331}",mult:0.6,desc:"Light & frequent for new plants"},established:{n:"Established",e:"\u{1F333}",mult:1.25,desc:"Deep soak for mature roots"},eco:{n:"Eco",e:"\u267B\uFE0F",mult:0.8,desc:"Water-saving, -20%"}};
  var zoneDur=function(zoneId){var base=(zcfg[zoneId]&&zcfg[zoneId].dur)||rDur;return Math.round(base*RMODES[rMode].mult)};
  var logRun=function(zoneName,min){setRHist(function(h){return [{zone:zoneName,date:new Date().toISOString(),min:min}].concat(h).slice(0,30)})};
  var DOW=["S","M","T","W","T","F","S"];
  var irrCall=function(body){return fetch("/api/irrigation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json()})};
  var rConnect=function(prov){
    var payload={provider:prov,action:"connect",token:rTok,host:rHost};
    if(prov==="opensprinkler"&&!rHost){setRErr("Enter your controller's IP address");return}
    if(!rTok){setRErr(prov==="netro"?"Enter your Netro serial number":prov==="opensprinkler"?"Enter your device password":"Paste your API key");return}
    setRBusy(true);setRErr("");setRMsg("");
    irrCall(payload).then(function(res){
      setRBusy(false);
      if(res.error||!res.ok){setRErr(res.error||"Connection failed");return}
      if(!res.devices||!res.devices.length){setRErr("No controllers found");return}
      setRDev(res.devices[0]);setRConn(prov);setRProv(null);
    }).catch(function(){setRBusy(false);setRErr("Network error")});
  };
  var rStart=function(zoneId,zoneName){
    var dur=zoneDur(zoneId);
    setRBusy(true);setRMsg("");setRErr("");
    irrCall({provider:rConn,action:"start",token:rTok,host:rHost,zoneId:zoneId,duration:dur*60}).then(function(res){
      setRBusy(false);
      if(res.ok){setRMsg(zoneName+" running for "+dur+" min");logRun(zoneName,dur)}
      else setRErr("Couldn't start "+zoneName);
    }).catch(function(){setRBusy(false);setRErr("Network error")});
  };
  var rStop=function(){
    setRBusy(true);setRMsg("");setRErr("");setRunningAll(false);
    irrCall({provider:rConn,action:"stop",token:rTok,host:rHost,deviceId:rDev.id}).then(function(res){
      setRBusy(false);
      if(res.ok)setRMsg("All watering stopped");
      else setRErr("Couldn't stop");
    }).catch(function(){setRBusy(false);setRErr("Network error")});
  };
  // Run all enabled zones in sequence
  var rRunAll=function(){
    if(!rDev)return;
    var zones=rDev.zones.filter(function(z){return!(zcfg[z.id]&&zcfg[z.id].enabled===false)});
    if(!zones.length){setRErr("No zones enabled");return}
    setRunningAll(true);setRMsg("Running all "+zones.length+" zones in sequence...");
    var i=0;
    var runNext=function(){
      if(i>=zones.length){setRunningAll(false);setRMsg("Finished watering all zones");return}
      var z=zones[i];var dur=zoneDur(z.id);
      irrCall({provider:rConn,action:"start",token:rTok,host:rHost,zoneId:z.id,duration:dur*60}).then(function(){logRun(z.name,dur);i++;setTimeout(runNext,800)}).catch(function(){i++;setTimeout(runNext,800)});
    };
    runNext();
  };

  var score=tasks.length?Math.round((tasks.filter(function(t){return t.d}).length/tasks.length)*20+71):78;
  var ask=function(q){setDM(null);setCQ(q);setTyping(true);setCTx("");var a=COACH[q]||"Tell me more.";var i=0;var iv=setInterval(function(){i+=3;if(i>=a.length){setCTx(a);setTyping(false);clearInterval(iv)}else setCTx(a.slice(0,i))},12)};
  var diag=function(){setDM("load");setTimeout(function(){var k=Object.keys(DDB).find(function(k){return dS.toLowerCase().indexOf(k)>=0})||"yellow";setDR(DDB[k]);setDM("result")},1800)};
  var place=function(bi,ci){if(!pal)return;setBeds(function(bs){return bs.map(function(b){if(b.id!==bi)return b;var a=b.grid.slice();if(a[ci]&&a[ci].n===pal.n)a[ci]=null;else for(var j=ci;j<Math.min(ci+pal.s,20);j++)a[j]=Object.assign({},pal);return Object.assign({},b,{grid:a})})})};
  var bWarn=function(b){var ns=[];b.grid.forEach(function(c){if(c&&ns.indexOf(c.n)<0)ns.push(c.n)});var bad=[];for(var i=0;i<ns.length;i++)for(var j=i+1;j<ns.length;j++)if(ckp(ns[i],ns[j])==="bad")bad.push(ns[i]+" + "+ns[j]);return bad};
  // Weather (zip-code based) - Priority feature
  var _zip=st(""),zip=_zip[0],setZip=_zip[1];
  var _wx=st(null),wx=_wx[0],setWx=_wx[1]; // {city, current:{t,i}, days:[{d,h,i}]}
  var _wxLoad=st(false),wxLoad=_wxLoad[0],setWxLoad=_wxLoad[1];
  var _wxErr=st(""),wxErr=_wxErr[0],setWxErr=_wxErr[1];
  var iconFor=function(main){var m=(main||"").toLowerCase();if(m.indexOf("rain")>=0||m.indexOf("drizzle")>=0)return "\u{1F327}\uFE0F";if(m.indexOf("cloud")>=0)return "\u26C5";if(m.indexOf("clear")>=0)return "\u2600\uFE0F";if(m.indexOf("storm")>=0||m.indexOf("thunder")>=0)return "\u26C8\uFE0F";if(m.indexOf("snow")>=0)return "\u2744\uFE0F";return "\u{1F324}\uFE0F"};
  var fetchWx=function(z){
    if(!/^\d{5}$/.test(z)){setWxErr("Enter a 5-digit zip");return}
    setWxLoad(true);setWxErr("");
    // OpenWeather API - key comes from env. Geocode zip -> coords -> forecast.
    var KEY=(typeof process!=="undefined"&&process.env&&process.env.NEXT_PUBLIC_OPENWEATHER_KEY)||"";
    if(!KEY){
      // Graceful fallback: store the zip, show a friendly note. Live data wires up once the key is set.
      setWx({city:"Zip "+z,current:{t:null,i:"\u{1F324}\uFE0F"},days:[],noKey:true});
      setWxLoad(false);return;
    }
    fetch("https://api.openweathermap.org/geo/1.0/zip?zip="+z+",US&appid="+KEY)
      .then(function(r){if(!r.ok)throw new Error("zip");return r.json()})
      .then(function(geo){
        return fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+geo.lat+"&lon="+geo.lon+"&units=imperial&appid="+KEY)
          .then(function(r){return r.json()})
          .then(function(f){
            var byDay={};
            f.list.forEach(function(e){var d=e.dt_txt.slice(0,10);if(!byDay[d])byDay[d]={hi:-99,ic:e.weather[0].main};byDay[d].hi=Math.max(byDay[d].hi,e.main.temp_max)});
            var days=Object.keys(byDay).slice(0,6).map(function(d,i){var dt=new Date(d+"T12:00:00");return {d:i===0?"Today":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt.getDay()],h:Math.round(byDay[d].hi),i:iconFor(byDay[d].ic)}});
            setWx({city:geo.name,current:{t:Math.round(f.list[0].main.temp),i:iconFor(f.list[0].weather[0].main)},days:days});
            setWxLoad(false);
          });
      })
      .catch(function(){setWxErr("Couldn't find that zip. Check it and try again.");setWxLoad(false)});
  };
  var filt=useMemo(function(){if(srch){var q=srch.toLowerCase();return ALLPLANTS.filter(function(p){return p.n.toLowerCase().indexOf(q)>=0||(p.h&&p.h.some(function(x){return x.toLowerCase().indexOf(q)>=0}))})}return fil==="all"?ALLPLANTS:ALLPLANTS.filter(function(p){return p.cat===fil})},[fil,srch]);
  var inp={background:G.bg0,color:G.t1,border:"1px solid "+G.ln,borderRadius:10,padding:"8px 12px",fontSize:12,width:"100%",boxSizing:"border-box"};

  var getShape=function(sid){return SHAPES.find(function(s){return s.id===sid})||SHAPES[0]};
  // Feeding calculator state
  var _fdAmend=st(AMENDMENTS[0].id),fdAmend=_fdAmend[0],setFdAmend=_fdAmend[1];
  var _fdMode=st("calc"),fdMode=_fdMode[0],setFdMode=_fdMode[1]; // 'calc' | 'schedule'
  var _fdW=st(2),fdW=_fdW[0],setFdW=_fdW[1]; // bed width ft
  var _fdL=st(8),fdL=_fdL[0],setFdL=_fdL[1]; // bed length ft
  // Learn tab
  var _gsel=st(null),gSel=_gsel[0],setGSel=_gsel[1];
  var _gcat=st("All"),gCat=_gcat[0],setGCat=_gcat[1];
  // Zone <-> bed mapping (auto by default, manual override)
  var _zmap=st(SAVED.zMap||{}),zMap=_zmap[0],setZMap=_zmap[1]; // {zoneId: [bedId,...]}
  var _editZone=st(null),editZone=_editZone[0],setEditZone=_editZone[1];
  // Helper: human-readable contents of a bed from its grid
  var bedContents=function(b){
    var counts={};
    b.grid.forEach(function(c){if(c)counts[c.n]=(counts[c.n]||0)+1});
    var parts=Object.keys(counts).map(function(n){return counts[n]>1?n+" x"+counts[n]:n});
    return parts.length?parts.join(", "):null;
  };
  // Auto-map: split beds across connected zones evenly if no manual map exists
  var autoZoneBeds=function(zoneIdx,totalZones){
    var per=Math.ceil(beds.length/totalZones);
    return beds.slice(zoneIdx*per,(zoneIdx+1)*per);
  };
  var zoneBeds=function(zoneId,zoneIdx,totalZones){
    if(zMap[zoneId])return beds.filter(function(b){return zMap[zoneId].indexOf(b.id)>=0});
    return autoZoneBeds(zoneIdx,totalZones);
  };
  // Photo journal: {plantId: [{url, date, note}]}
  var _photos=st(SAVED.photos||{}),photos=_photos[0],setPhotos=_photos[1];
  var _photoPlant=st(null),photoPlant=_photoPlant[0],setPhotoPlant=_photoPlant[1];
  var addPhoto=function(plantId,file){
    // Read as base64 so it persists in localStorage (blob URLs die on refresh).
    var reader=new FileReader();
    reader.onload=function(){
      var dataUrl=reader.result;
      setPhotos(function(ps){var np=Object.assign({},ps);var arr=(np[plantId]||[]).slice();arr.unshift({url:dataUrl,date:new Date().toISOString().slice(0,10)});if(arr.length>12)arr=arr.slice(0,12);np[plantId]=arr;return np});
    };
    reader.readAsDataURL(file);
  };
  // Notifications/reminders
  var _notif=st(false),notif=_notif[0],setNotif=_notif[1]; // permission granted
  var _notifAsk=st(false),notifAsk=_notifAsk[0],setNotifAsk=_notifAsk[1];
  useEffect(function(){if(typeof Notification!=="undefined"&&Notification.permission==="granted")setNotif(true)},[]);
  var fireNotify=function(title,body,tag){
    if(typeof navigator!=="undefined"&&navigator.serviceWorker&&navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage({type:"notify",title:title,body:body,tag:tag});
    } else if(typeof Notification!=="undefined"&&Notification.permission==="granted"){
      new Notification(title,{body:body});
    }
  };
  var enableNotif=function(){
    if(typeof Notification==="undefined"){setNotifAsk(true);return}
    Notification.requestPermission().then(function(p){
      var ok=p==="granted";setNotif(ok);setNotifAsk(true);
      if(ok)setTimeout(function(){fireNotify("\u{1F33F} Reminders on","Grove will nudge you for watering, feeding & harvest.","welcome")},400);
    });
  };
  // Current month for "sow now"
  var curMonth=new Date().getMonth()+1; // 1-12
  // Responsive: wide layout on desktop
  var _wide=st(false),wide=_wide[0],setWide=_wide[1];
  useEffect(function(){
    var check=function(){setWide(typeof window!=="undefined"&&window.innerWidth>=900)};
    check();
    if(typeof window!=="undefined"){window.addEventListener("resize",check);return function(){window.removeEventListener("resize",check)}}
  },[]);
  var sowsThisMonth=function(){
    var mAbbr=MO[curMonth-1];
    return ALLPLANTS.filter(function(p){return (p.sow&&p.sow.indexOf(mAbbr)>=0)||(p.tp&&p.tp.indexOf(mAbbr)>=0)});
  };

  return <div style={{background:G.bg0,color:G.t1,fontFamily:"-apple-system,Inter,system-ui,sans-serif",minHeight:"100vh",maxWidth:wide?"none":430,margin:"0 auto",paddingLeft:wide?210:0}}>
    <div style={{padding:wide?"16px 32px 14px":"11px 16px 9px",display:"flex",justifyContent:wide?"flex-end":"space-between",alignItems:"center",borderBottom:"1px solid "+G.ln,maxWidth:wide?1200:"none",margin:wide?"0 auto":0}}>
      {!wide&&<div style={{display:"flex",alignItems:"center",gap:7}}><Leaf size={24}/><span style={{fontSize:16,fontWeight:700}}>grove</span></div>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>{(syncState==="saved"||syncState==="saving"||syncState==="offline")&&<span title={syncState==="offline"?"Saved on this device":"Synced to cloud"} style={{fontSize:10,color:syncState==="offline"?G.t4:G.s2}}>{syncState==="saving"?"\u27F3":syncState==="offline"?"\u25CB":"\u2601"}</span>}<span style={{fontSize:9,color:G.s2,fontWeight:600,border:"1px solid "+G.s2+"44",borderRadius:99,padding:"2px 8px"}}>9B</span>{wx&&wx.current.t!==null&&<><span style={{fontSize:13}}>{wx.current.i}</span><span style={{fontSize:12,fontWeight:600}}>{wx.current.t+"\u00B0"}</span></>}</div>
    </div>

    <div style={{padding:wide?"24px 32px 40px":"12px 14px 92px",overflow:"auto",maxWidth:wide?1200:"none",margin:wide?"0 auto":0}}>

    {tab==="home"&&<div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:wide?620:"none",margin:wide?"0 auto":0,width:"100%"}}>
      {/* Date + greeting banner */}
      <div style={{paddingTop:2}}>
        <div style={{color:G.s2,fontSize:11,fontWeight:600,letterSpacing:".4px",textTransform:"uppercase"}}>{todayStr()}</div>
        <div style={{color:G.t1,fontSize:22,fontWeight:700,marginTop:2,letterSpacing:"-.5px"}}>{greeting()+"."}</div>
      </div>
      {/* Season strip */}
      {(function(){var s=seasonNow();return <Card style={{background:"linear-gradient(135deg,"+G.f2+"1A,"+G.bg1+")",borderColor:G.f2+"33",padding:"11px 13px",display:"flex",alignItems:"center",gap:11}}><span style={{fontSize:26}}>{s.e}</span><div><div style={{color:G.s3,fontSize:12,fontWeight:700}}>{s.n+" in Zone 9b"}</div><div style={{color:G.t2,fontSize:10,lineHeight:1.4,marginTop:1}}>{s.t}</div></div></Card>})()}
      {/* Command center: ring + stats */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <Ring score={score}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{color:G.c2,fontSize:20,fontWeight:700}}>{myPlants.length}</div><div style={{color:G.t4,fontSize:9}}>TRACKED</div></div>
              <div><div style={{color:G.s3,fontSize:20,fontWeight:700}}>{beds.length}</div><div style={{color:G.t4,fontSize:9}}>BEDS</div></div>
              <div><div style={{color:G.s2,fontSize:20,fontWeight:700}}>{tasks.filter(function(t){return!t.d}).length}</div><div style={{color:G.t4,fontSize:9}}>TO DO</div></div>
            </div>
            <div style={{color:G.t3,fontSize:10,lineHeight:1.4}}>{score>=80?"Your garden is thriving. Keep it up.":myPlants.length===0?"Add what you're growing to start tracking.":"Steady progress - check today's tasks below."}</div>
          </div>
        </div>
      </Card>
      <div style={{display:"flex",gap:6}}>{[{l:"Water",i:"\u{1F4A7}"},{l:"Feed",i:"\u{1F33F}"},{l:"pH",i:"\u{1F9EA}"},{l:"Harvest",i:"\u{1F345}"}].map(function(b,i){return <Card key={i} style={{flex:1,textAlign:"center",padding:"8px 4px",borderColor:G.f2+"33"}}><div style={{fontSize:16}}>{b.i}</div><div style={{color:G.t3,fontSize:9,marginTop:2}}>{b.l}</div></Card>})}</div>
      {/* Harvest reminders on home (Priority 1) */}
      {(function(){var ready=myPlants.map(function(p){return Object.assign({},p,{du:daysUntil(p.planted,p.dth)})}).filter(function(p){return p.du!==null&&p.du<=14}).sort(function(a,b){return a.du-b.du});if(!ready.length)return null;return <Card style={{borderColor:G.s3+"33",background:G.s3+"08",padding:11}}><div style={{color:G.s3,fontSize:11,fontWeight:600,marginBottom:6}}>{"\u{1F33E} Harvest Soon"}</div>{ready.slice(0,3).map(function(p,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:i<Math.min(2,ready.length-1)?5:0}}><span style={{fontSize:11,color:G.t2}}>{p.e+" "+p.name}</span><span style={{fontSize:10,fontWeight:600,color:p.du<=0?G.c2:G.s3}}>{p.du<=0?"READY NOW":"in "+p.du+"d"}</span></div>})}</Card>})()}
      {!notif&&!notifAsk&&<Card onClick={enableNotif} style={{borderColor:G.blue+"33",background:G.blue+"08",padding:11,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{"\u{1F514}"}</span><div style={{flex:1}}><div style={{color:G.blue,fontSize:12,fontWeight:600}}>Turn on reminders</div><div style={{color:G.t3,fontSize:10}}>Get notified for watering, feeding & harvest</div></div><span style={{color:G.blue,fontSize:11,fontWeight:600}}>Enable</span></Card>}
      {notif&&<Card style={{borderColor:G.s3+"22",background:G.s3+"06",padding:9,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{"\u2705"}</span><div style={{color:G.s3,fontSize:11,fontWeight:600}}>Reminders on</div><button onClick={function(){fireNotify("\u{1F4A7} Test reminder","This is how Grove will nudge you.","test")}} style={{marginLeft:"auto",background:G.s3+"18",border:"1px solid "+G.s3+"33",borderRadius:8,color:G.s3,fontSize:9,fontWeight:600,padding:"3px 9px",cursor:"pointer"}}>Test</button></Card>}
      {notifAsk&&!notif&&<Card style={{borderColor:G.warn+"33",background:G.warn+"06",padding:10}}><div style={{color:G.warn,fontSize:11,fontWeight:600}}>{"\u{1F514} Finish setup for reminders"}</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5,marginTop:3}}>Notifications are blocked or need install. On iPhone: tap Share \u2192 Add to Home Screen, open Grove from there, then enable. On desktop/Android: allow notifications when prompted.</div></Card>}
      {/* Weather - zip code based */}
      {!wx?<Card style={{padding:12}}>
        <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>{"\u{1F324}\uFE0F Local Weather"}</div>
        <div style={{display:"flex",gap:6}}>
          <input value={zip} onChange={function(e){setZip(e.target.value.replace(/[^0-9]/g,"").slice(0,5))}} placeholder="Enter zip code" inputMode="numeric" style={Object.assign({},inp,{flex:1})}/>
          <button onClick={function(){fetchWx(zip)}} disabled={wxLoad} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"0 16px",fontSize:12,fontWeight:600,cursor:"pointer",opacity:wxLoad?0.6:1}}>{wxLoad?"...":"Set"}</button>
        </div>
        {wxErr&&<div style={{color:G.red,fontSize:10,marginTop:6}}>{wxErr}</div>}
        <div style={{color:G.t4,fontSize:9,marginTop:6}}>Grove uses your local forecast to time watering and tasks.</div>
      </Card>:<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,color:G.t3}}>{"\u{1F4CD} "+wx.city}</span>
          <button onClick={function(){setWx(null);setZip("")}} style={{background:"none",border:"none",color:G.s2,fontSize:10,cursor:"pointer"}}>change</button>
        </div>
        {wx.noKey?<Card style={{padding:10,borderColor:G.warn+"33",background:G.warn+"06"}}><div style={{color:G.warn,fontSize:10,fontWeight:600}}>Weather key not set</div><div style={{color:G.t2,fontSize:10,marginTop:2}}>Add NEXT_PUBLIC_OPENWEATHER_KEY in Vercel to pull the live forecast for this zip.</div></Card>
        :wx.days.length>0&&<div style={{display:"flex",gap:4,overflow:"auto"}}>{wx.days.map(function(d,i){return <div key={i} style={{textAlign:"center",padding:"5px 7px",borderRadius:10,minWidth:44,background:i===0?G.f2+"22":"transparent",border:"1px solid "+(i===0?G.f2+"55":G.ln)}}><div style={{fontSize:9,color:G.t4}}>{d.d}</div><div style={{fontSize:15,margin:"2px 0"}}>{d.i}</div><div style={{fontSize:12,color:d.h>=95?G.c2:G.t1,fontWeight:600}}>{d.h+"\u00B0"}</div></div>})}</div>}
        {wx.days.some(function(d){return d.h>=95})&&<Card style={{borderColor:G.warn+"33",background:G.warn+"06",padding:11}}><div style={{color:G.warn,fontSize:11,fontWeight:600}}>{"\u{1F525} Heat ahead"}</div><div style={{color:G.t2,fontSize:10}}>95\u00B0+ in your forecast. Extra evening water for full-sun beds.</div></Card>}
      </>}
      {/* ── TASK CENTER ── */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <span style={{fontSize:14,fontWeight:600}}>Tasks</span>
          <button onClick={function(){setAddTaskOpen(!addTaskOpen)}} style={{background:addTaskOpen?G.bg2:G.s3,color:addTaskOpen?G.t3:G.bg0,border:addTaskOpen?"1px solid "+G.ln:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{addTaskOpen?"Cancel":"+ Add Task"}</button>
        </div>
        {/* Add task form */}
        {addTaskOpen&&<Card style={{borderColor:G.s3+"33",marginBottom:8,padding:12}}>
          <input value={ntText} onChange={function(e){setNtText(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")addNewTask()}} placeholder="What needs doing? (e.g. Prune the peach tree)" autoFocus style={Object.assign({},inp,{marginBottom:9,fontSize:12,padding:"9px 11px"})}/>
          <div style={{color:G.t4,fontSize:9,fontWeight:600,marginBottom:4}}>WHEN</div>
          <div style={{display:"flex",gap:5,marginBottom:9}}>{[{k:"today",l:"Today"},{k:"week",l:"This Week"},{k:"month",l:"This Month"}].map(function(o){var on=ntWhen===o.k;return <button key={o.k} onClick={function(){setNtWhen(o.k)}} style={{flex:1,background:on?G.f2+"22":"transparent",border:"1px solid "+(on?G.s3+"66":G.ln),borderRadius:8,padding:"6px 0",fontSize:10,fontWeight:600,color:on?G.s3:G.t3,cursor:"pointer"}}>{o.l}</button>})}</div>
          <div style={{color:G.t4,fontSize:9,fontWeight:600,marginBottom:4}}>PRIORITY</div>
          <div style={{display:"flex",gap:5,marginBottom:9}}>{[{k:"urgent",l:"Urgent"},{k:"high",l:"High"},{k:"medium",l:"Medium"},{k:"low",l:"Low"}].map(function(o){var on=ntPrio===o.k;return <button key={o.k} onClick={function(){setNtPrio(o.k)}} style={{flex:1,background:on?PC[o.k]+"22":"transparent",border:"1px solid "+(on?PC[o.k]+"88":G.ln),borderRadius:8,padding:"5px 0",fontSize:9,fontWeight:600,color:on?PC[o.k]:G.t3,cursor:"pointer"}}>{o.l}</button>})}</div>
          <div style={{color:G.t4,fontSize:9,fontWeight:600,marginBottom:4}}>ICON</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:11}}>{TASK_EMOJIS.map(function(em){var on=ntEmoji===em;return <button key={em} onClick={function(){setNtEmoji(em)}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+(on?G.s3+"66":G.ln),background:on?G.s3+"18":"transparent",fontSize:15,cursor:"pointer"}}>{em}</button>})}</div>
          <button onClick={addNewTask} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"10px 0",width:"100%",fontSize:13,fontWeight:700,cursor:"pointer"}}>Add Task</button>
        </Card>}
        {/* View tabs */}
        <div style={{display:"flex",gap:5,marginBottom:8}}>{[{k:"today",l:"Today"},{k:"week",l:"This Week"},{k:"month",l:"This Month"}].map(function(o){var on=taskView===o.k;var cnt=tasks.filter(function(t){return (t.when||"today")===o.k}).length;return <button key={o.k} onClick={function(){setTaskView(o.k)}} style={{flex:1,background:on?G.f2:G.bg2,border:"1px solid "+(on?G.f3:G.ln),borderRadius:9,padding:"7px 0",fontSize:11,fontWeight:600,color:on?G.s4:G.t3,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>{o.l}{cnt>0&&<span style={{fontSize:8,color:on?G.s3:G.t4}}>{tasks.filter(function(t){return (t.when||"today")===o.k&&t.d}).length+"/"+cnt}</span>}</button>})}</div>
        {/* Filtered task list */}
        {(function(){var list=tasks.filter(function(t){return (t.when||"today")===taskView});
          if(list.length===0)return <Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11,lineHeight:1.5}}>{taskView==="today"?"Nothing due today. Tap + Add Task to plan your day.":taskView==="week"?"No tasks this week yet. Add weekly goals like feeding or pruning.":"No monthly tasks. Plan seasonal jobs like soil amending or planting."}</div></Card>;
          // sort: incomplete first, then by priority
          var prioRank={urgent:0,high:1,medium:2,low:3};
          var sorted=list.slice().sort(function(a,b){if(a.d!==b.d)return a.d?1:-1;return (prioRank[a.p]||2)-(prioRank[b.p]||2)});
          return sorted.map(function(t){return <Card key={t.id} style={{opacity:t.d?0.4:1,borderColor:t.d?G.ln:PC[t.p]+"33",display:"flex",alignItems:"center",gap:8,padding:"9px 11px",marginBottom:4}}>
            <div onClick={function(){setTasks(function(ts){return ts.map(function(x){return x.id===t.id?Object.assign({},x,{d:!x.d}):x})})}} style={{width:20,height:20,borderRadius:99,border:"2px solid "+(t.d?G.s3:PC[t.p]),background:t.d?G.s3:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>{t.d&&<span style={{color:G.bg0,fontSize:11,fontWeight:700}}>{"\u2713"}</span>}</div>
            <span style={{fontSize:15}}>{t.c}</span>
            <div style={{flex:1,minWidth:0}}><div style={{color:t.d?G.t4:G.t1,fontSize:12,textDecoration:t.d?"line-through":"none"}}>{t.t}</div>{!t.d&&t.p&&(t.p==="urgent"||t.p==="high")&&<div style={{color:PC[t.p],fontSize:8,fontWeight:600,textTransform:"uppercase",marginTop:1}}>{t.p}</div>}</div>
            <button onClick={function(){setTasks(tasks.filter(function(x){return x.id!==t.id}))}} style={{background:"none",border:"none",color:G.t4,fontSize:15,cursor:"pointer",lineHeight:1,flexShrink:0}}>{"\u00D7"}</button>
          </Card>})})()}
      </div>
    </div>}

    {tab==="garden"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {eB!==null?(function(){var b=beds.find(function(x){return x.id===eB});if(!b)return null;var sh=getShape(b.shape);var cells=sh.w*sh.h;return <div>
        <button onClick={function(){setEB(null);setPal(null);setPalGroup(null);setPalSrch("");setBSub("plants")}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:6}}>{"\u2190 All beds"}</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:600}}>{b.name} <span style={{color:G.t3,fontSize:11,fontWeight:400}}>{sh.n+" \u00B7 "+(b.sun==="full"?"\u2600 full":"\u26C5 shade")}</span></div>
          <button onClick={function(){if(beds.length>1){setBeds(beds.filter(function(x){return x.id!==b.id}));setEB(null)}}} style={{background:"none",border:"1px solid "+G.red+"44",borderRadius:8,color:G.red,fontSize:10,padding:"3px 8px",cursor:"pointer"}}>Delete</button>
        </div>
        {/* Bed sub-tabs: plants | pH (Priority 2 - pH per bed) */}
        <div style={{display:"flex",gap:5,margin:"8px 0"}}><Chip on={bSub==="plants"} color={G.s3} onClick={function(){setBSub("plants")}} sm>{"\u{1F331} Plants"}</Chip><Chip on={bSub==="ph"} color={G.warn} onClick={function(){setBSub("ph")}} sm>{"\u{1F9EA} pH/EC"}</Chip><Chip on={bSub==="shape"} color={G.f3} onClick={function(){setBSub("shape")}} sm>{"\u{1F4D0} Shape"}</Chip></div>

        {bSub==="shape"&&<div><div style={{fontSize:11,color:G.t3,marginBottom:6}}>Choose bed shape:</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{SHAPES.map(function(s){return <Chip key={s.id} on={b.shape===s.id} color={G.f3} onClick={function(){setBeds(beds.map(function(x){return x.id===b.id?Object.assign({},x,{shape:s.id}):x}))}} sm>{(s.round?"\u2B55 ":"")+s.n}</Chip>})}</div></div>}

        {bSub==="plants"&&<>
          {sh.round?
            <div style={{display:"flex",justifyContent:"center",margin:"8px 0"}}><div style={{width:200,height:200,borderRadius:"50%",border:"2px solid "+G.ln,background:G.bg2,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,padding:20}}>{b.grid.slice(0,cells).map(function(c,ci){var inCircle=true;return <div key={ci} onClick={function(){place(b.id,ci)}} style={{width:32,height:32,borderRadius:"50%",border:"1.5px solid "+(c?G.s3+"44":pal?G.c2+"33":G.ln),background:c?G.f2+"15":pal?G.c2+"06":G.bg1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:c?15:9,cursor:"pointer"}}>{c?c.e:""}</div>})}</div></div></div>
            :
            <div style={{display:"grid",gridTemplateColumns:"repeat("+sh.w+",1fr)",gap:3,margin:"8px 0"}}>{b.grid.slice(0,cells).map(function(c,ci){return <div key={ci} onClick={function(){place(b.id,ci)}} style={{aspectRatio:"1",borderRadius:7,border:"1.5px solid "+(c?G.s3+"44":pal?G.c2+"33":G.ln),background:c?G.f2+"15":pal?G.c2+"06":G.bg2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:c?16:10,cursor:"pointer"}}>{c?c.e:""}</div>})}</div>
          }
          {bWarn(b).length>0&&<Card style={{borderColor:G.red+"33",background:G.red+"06",padding:7,marginBottom:6}}><div style={{color:G.red,fontSize:10,fontWeight:600}}>{"\u26A0 Conflicts"}</div>{bWarn(b).map(function(w,i){return <div key={i} style={{color:G.t2,fontSize:10}}>{"\u274C "+w}</div>})}</Card>}
          <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{pal?"Tap cells for "+pal.e+" "+pal.n:palGroup?"Pick a variety, or place generic:":"Select a plant:"}</div>
          {/* Search box */}
          <input value={palSrch} onChange={function(e){setPalSrch(e.target.value);setPalGroup(null)}} placeholder="Search 380+ varieties..." style={Object.assign({},inp,{marginBottom:7,fontSize:11,padding:"7px 11px"})}/>
          {palSrch?(function(){
            // Search across all varieties + group names
            var q=palSrch.toLowerCase();var hits=[];
            PG.forEach(function(g){
              if(g.n.toLowerCase().indexOf(q)>=0)hits.push({e:g.e,n:g.n,s:g.s,grp:g.n});
              g.v.forEach(function(vn){if(vn.toLowerCase().indexOf(q)>=0)hits.push({e:g.e,n:vn+" "+g.n,s:g.s,grp:g.n})});
            });
            if(!hits.length)return <div style={{color:G.t4,fontSize:10,padding:"4px 0"}}>No match. Try "tomato", "sage", "purple"...</div>;
            return <div style={{display:"flex",gap:3,flexWrap:"wrap",maxHeight:200,overflow:"auto"}}>{hits.slice(0,60).map(function(p,i){var on=pal&&pal.n===p.n;return <button key={i} onClick={function(){setPal(on?null:{e:p.e,n:p.n,s:p.s})}} style={{background:on?G.c2+"18":"transparent",border:"1px solid "+(on?G.c2+"55":G.ln),borderRadius:8,padding:"3px 7px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{p.e}</span>{p.n}</button>})}</div>;
          })():palGroup?(function(){
            var g=PG.find(function(x){return x.n===palGroup});if(!g)return null;
            return <div>
              <button onClick={function(){setPalGroup(null)}} style={{color:G.s3,fontSize:10,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:6}}>{"\u2190 All plants"}</button>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",maxHeight:220,overflow:"auto"}}>
                {/* generic option */}
                <button onClick={function(){var on=pal&&pal.n===g.n;setPal(on?null:{e:g.e,n:g.n,s:g.s})}} style={{background:pal&&pal.n===g.n?G.c2+"18":G.f2+"12",border:"1px dashed "+(pal&&pal.n===g.n?G.c2+"55":G.s2+"44"),borderRadius:8,padding:"3px 8px",fontSize:10,color:G.s2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{g.e}</span>{"Any "+g.n}</button>
                {g.v.map(function(vn,i){var nm=vn+" "+g.n;var on=pal&&pal.n===nm;return <button key={i} onClick={function(){setPal(on?null:{e:g.e,n:nm,s:g.s})}} style={{background:on?G.c2+"18":"transparent",border:"1px solid "+(on?G.c2+"55":G.ln),borderRadius:8,padding:"3px 7px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{g.e}</span>{vn}</button>})}
              </div>
            </div>;
          })():<div style={{display:"flex",gap:3,flexWrap:"wrap",maxHeight:220,overflow:"auto"}}>{PG.map(function(g,i){return <button key={i} onClick={function(){setPalGroup(g.n);setPal(null)}} style={{background:"transparent",border:"1px solid "+G.ln,borderRadius:8,padding:"3px 8px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{g.e}</span>{g.n}<span style={{fontSize:8,color:G.t4,marginLeft:2}}>{g.v.length}</span></button>})}</div>}
        </>}

        {bSub==="ph"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{b.name} pH Log</span><button onClick={function(){var ip=(6+Math.random()).toFixed(1);var rp=(5.7+Math.random()).toFixed(1);setBeds(beds.map(function(x){return x.id===b.id?Object.assign({},x,{ph:[{d:MO[new Date().getMonth()]+" "+new Date().getDate(),inp:parseFloat(ip),run:parseFloat(rp)}].concat(x.ph)}):x}))}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Reading</button></div>
          {b.ph.length===0?<Card style={{padding:14,textAlign:"center"}}><div style={{color:G.t3,fontSize:11}}>No readings yet. Tap "Add Reading" after you test this bed's runoff.</div></Card>:
          <Card>{b.ph.map(function(l,i){var ok=l.run>=5.8&&l.run<=6.8;return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:6,borderBottom:i<b.ph.length-1?"1px solid "+G.ln+"44":"none"}}><span style={{color:G.t3,fontSize:10}}>{l.d}</span><div style={{display:"flex",gap:12}}><span style={{fontSize:10,color:G.t2}}>{"In: "+l.inp}</span><span style={{fontSize:10,color:ok?G.s3:G.warn,fontWeight:600}}>{"Run: "+l.run}</span></div><span style={{fontSize:10}}>{ok?"\u2705":"\u26A0"}</span></div>})}</Card>}
          <Card style={{background:G.f2+"0A",padding:10}}><div style={{color:G.s2,fontSize:10,fontWeight:600}}>Target for this bed</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>Most veg 6.0-7.0. If you grow blueberries here, 4.5-5.5. SoCal tap is alkaline - acidify with 1 tsp vinegar/gal for acid-lovers.</div></Card>
        </div>}
      </div>})():yardMode?(function(){
        // ── 2D TOP-DOWN YARD DESIGNER ──
        var palette=[{kind:"bed",label:"Bed",e:"\u{1F331}",w:9,h:5},{kind:"tree",label:"Tree",e:"\u{1F333}",w:11,h:11},{kind:"citrus",label:"Citrus",e:"\u{1F34A}",w:10,h:10},{kind:"container",label:"Pot",e:"\u{1FAB4}",w:6,h:6},{kind:"structure",label:"Shed",e:"\u{1F3DA}\uFE0F",w:14,h:10},{kind:"compost",label:"Compost",e:"\u267B\uFE0F",w:7,h:7},{kind:"water",label:"Water",e:"\u{1F6B0}",w:6,h:6},{kind:"path",label:"Path",e:"\u{1F7EB}",w:30,h:6}];
        var kindColor=function(k){return k==="bed"?G.f2:k==="tree"?"#6B4423":k==="citrus"?G.c2:k==="container"?G.s1:k==="structure"?G.t4:k==="compost"?"#5C4033":k==="water"?G.blue:k==="path"?"#8B7355":G.f2};
        var sel=yard.find(function(i){return i.id===yardSel});
        return <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:14,fontWeight:600}}>{"\u{1F5FA}\uFE0F Your Yard"}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",background:G.bg2,borderRadius:9,padding:2,border:"1px solid "+G.ln}}>
                <button onClick={function(){setYard3D(false)}} style={{background:!yard3D?G.f2:"transparent",color:!yard3D?G.s4:G.t3,border:"none",borderRadius:7,fontSize:11,fontWeight:600,padding:"4px 11px",cursor:"pointer"}}>2D</button>
                <button onClick={function(){setYard3D(true);setYardSel(null)}} style={{background:yard3D?G.f2:"transparent",color:yard3D?G.s4:G.t3,border:"none",borderRadius:7,fontSize:11,fontWeight:600,padding:"4px 11px",cursor:"pointer"}}>{"3D \u2728"}</button>
              </div>
              <button onClick={function(){setYardMode(false);setYardSel(null);setYard3D(false)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:8,color:G.t3,fontSize:11,padding:"5px 12px",cursor:"pointer"}}>Done</button>
            </div>
          </div>
          {yard3D?<>
            <div style={{color:G.t3,fontSize:10,lineHeight:1.5}}>Drag to orbit \u00B7 scroll or pinch to zoom. Watch your garden at any time of day or season.</div>
            <Yard3D yard={yard} timeOfDay={y3time} season={y3season}/>
            {/* Time of day slider */}
            <Card style={{padding:11}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <span style={{fontSize:11,fontWeight:600,color:G.s2}}>{(function(){var h=Math.floor(y3time);var m=Math.round((y3time-h)*60);var ap=h<12?"AM":"PM";var h12=h%12===0?12:h%12;return "\u{1F551} "+h12+":"+(m<10?"0":"")+m+" "+ap})()}</span>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={function(){setY3time(7)}} style={{background:y3time===7?G.f2:G.bg2,border:"1px solid "+G.ln,borderRadius:7,color:y3time===7?G.s4:G.t3,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Sunrise</button>
                  <button onClick={function(){setY3time(13)}} style={{background:y3time===13?G.f2:G.bg2,border:"1px solid "+G.ln,borderRadius:7,color:y3time===13?G.s4:G.t3,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Noon</button>
                  <button onClick={function(){setY3time(18.5)}} style={{background:y3time===18.5?G.f2:G.bg2,border:"1px solid "+G.ln,borderRadius:7,color:y3time===18.5?G.s4:G.t3,fontSize:9,padding:"3px 8px",cursor:"pointer"}}>Golden</button>
                </div>
              </div>
              <input type="range" min="0" max="24" step="0.5" value={y3time} onChange={function(e){setY3time(parseFloat(e.target.value))}} style={{width:"100%",accentColor:G.c2}}/>
              <div style={{display:"flex",justifyContent:"space-between",color:G.t4,fontSize:8,marginTop:2}}><span>12AM</span><span>6AM</span><span>Noon</span><span>6PM</span><span>12AM</span></div>
            </Card>
            {/* Season selector */}
            <Card style={{padding:11}}>
              <div style={{fontSize:11,fontWeight:600,color:G.s2,marginBottom:7}}>{"\u{1F33F} Season"}</div>
              <div style={{display:"flex",gap:5}}>{[{n:"Spring",e:"\u{1F331}"},{n:"Summer",e:"\u2600\uFE0F"},{n:"Fall",e:"\u{1F342}"},{n:"Winter",e:"\u2744\uFE0F"}].map(function(s){var on=y3season===s.n;return <button key={s.n} onClick={function(){setY3season(s.n)}} style={{flex:1,background:on?G.f2+"22":"transparent",border:"1px solid "+(on?G.s3+"66":G.ln),borderRadius:9,padding:"7px 0",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:16}}>{s.e}</span><span style={{fontSize:9,fontWeight:600,color:on?G.s3:G.t3}}>{s.n}</span></button>})}</div>
              <div style={{color:G.t4,fontSize:9,marginTop:7,lineHeight:1.4}}>{y3season==="Spring"?"Fresh growth & blossoms.":y3season==="Summer"?"Peak lush canopy.":y3season==="Fall"?"Autumn color & fallen leaves.":"Sparse, dormant winter."}</div>
            </Card>
            <Card style={{padding:11,background:G.f2+"0C",borderColor:G.f2+"22"}}><div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:22}}>{"\u{1F3DE}\uFE0F"}</span><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>Your real layout in 3D - {yard.filter(function(i){return i.kind==="bed"}).length} beds, {yard.filter(function(i){return i.kind==="tree"||i.kind==="citrus"}).length} trees. Switch to 2D to rearrange.</div></div></Card>
          </>:<>
          {/* The canvas */}
          <div style={{position:"relative",width:"100%",aspectRatio:"1",background:"linear-gradient(135deg,#0d1410,#0a120d)",borderRadius:16,border:"1px solid "+G.ln,overflow:"hidden",touchAction:"none"}}
            onMouseMove={function(e){if(!yardDrag)return;var r=e.currentTarget.getBoundingClientRect();var px=((e.clientX-r.left)/r.width)*100;var py=((e.clientY-r.top)/r.height)*100;setYard(function(ys){return ys.map(function(it){return it.id===yardDrag.id?Object.assign({},it,{x:Math.max(0,Math.min(100-it.w,px-yardDrag.offX)),y:Math.max(0,Math.min(100-it.h,py-yardDrag.offY))}):it})})}}
            onMouseUp={function(){setYardDrag(null)}} onMouseLeave={function(){setYardDrag(null)}}
            onTouchMove={function(e){if(!yardDrag)return;var t=e.touches[0];var r=e.currentTarget.getBoundingClientRect();var px=((t.clientX-r.left)/r.width)*100;var py=((t.clientY-r.top)/r.height)*100;setYard(function(ys){return ys.map(function(it){return it.id===yardDrag.id?Object.assign({},it,{x:Math.max(0,Math.min(100-it.w,px-yardDrag.offX)),y:Math.max(0,Math.min(100-it.h,py-yardDrag.offY))}):it})})}}
            onTouchEnd={function(){setYardDrag(null)}}>
            {/* grid lines */}
            <svg width="100%" height="100%" style={{position:"absolute",inset:0,opacity:0.4}}>{[20,40,60,80].map(function(p){return <g key={p}><line x1={p+"%"} y1="0" x2={p+"%"} y2="100%" stroke={G.ln} strokeWidth="0.5"/><line x1="0" y1={p+"%"} x2="100%" y2={p+"%"} stroke={G.ln} strokeWidth="0.5"/></g>})}</svg>
            {/* compass / back label */}
            <div style={{position:"absolute",top:6,left:0,width:"100%",textAlign:"center",color:G.t4,fontSize:8,fontWeight:600,letterSpacing:2}}>BACK FENCE</div>
            <div style={{position:"absolute",bottom:4,left:0,width:"100%",textAlign:"center",color:G.t4,fontSize:8,fontWeight:600,letterSpacing:2}}>HOUSE</div>
            {/* items */}
            {yard.map(function(it){var on=yardSel===it.id;var round=it.kind==="tree"||it.kind==="citrus"||it.kind==="water"||it.kind==="compost";return <div key={it.id}
              onMouseDown={function(e){var r=e.currentTarget.parentNode.getBoundingClientRect();var px=((e.clientX-r.left)/r.width)*100;var py=((e.clientY-r.top)/r.height)*100;setYardSel(it.id);setYardDrag({id:it.id,offX:px-it.x,offY:py-it.y})}}
              onTouchStart={function(e){var t=e.touches[0];var r=e.currentTarget.parentNode.getBoundingClientRect();var px=((t.clientX-r.left)/r.width)*100;var py=((t.clientY-r.top)/r.height)*100;setYardSel(it.id);setYardDrag({id:it.id,offX:px-it.x,offY:py-it.y})}}
              style={{position:"absolute",left:it.x+"%",top:it.y+"%",width:it.w+"%",height:it.h+"%",background:kindColor(it.kind)+(on?"":"cc"),border:"1.5px solid "+(on?G.s3:kindColor(it.kind)),borderRadius:round?"50%":6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"move",boxShadow:on?"0 0 0 2px "+G.s3+"55":"none",transform:it.rot?"rotate("+it.rot+"deg)":"none",overflow:"hidden"}}>
              <span style={{fontSize:it.w>8?15:11,lineHeight:1}}>{it.e}</span>
              {it.w>=8&&<span style={{fontSize:7,color:G.t1,fontWeight:600,marginTop:1,whiteSpace:"nowrap",maxWidth:"95%",overflow:"hidden",textOverflow:"ellipsis"}}>{it.label}</span>}
            </div>})}
          </div>
          {/* selected item controls */}
          {sel?<Card style={{borderColor:G.s3+"33",padding:11}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <input value={sel.label} onChange={function(e){var v=e.target.value;setYard(function(ys){return ys.map(function(it){return it.id===sel.id?Object.assign({},it,{label:v}):it})})}} style={{background:G.bg0,color:G.t1,border:"1px solid "+G.ln,borderRadius:8,padding:"5px 9px",fontSize:12,fontWeight:600,flex:1,marginRight:8}}/>
              <button onClick={function(){setYard(yard.filter(function(it){return it.id!==sel.id}));setYardSel(null)}} style={{background:G.red+"18",border:"1px solid "+G.red+"44",borderRadius:8,color:G.red,fontSize:10,padding:"5px 10px",cursor:"pointer"}}>Delete</button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:G.t4,fontSize:9}}>Size</span><button onClick={function(){setYard(yard.map(function(it){return it.id===sel.id?Object.assign({},it,{w:Math.max(4,it.w-1),h:Math.max(4,it.h-1)}):it}))}} style={{background:G.ln,border:"none",borderRadius:6,color:G.t1,width:24,height:24,fontSize:13,cursor:"pointer"}}>-</button><button onClick={function(){setYard(yard.map(function(it){return it.id===sel.id?Object.assign({},it,{w:Math.min(40,it.w+1),h:Math.min(40,it.h+1)}):it}))}} style={{background:G.ln,border:"none",borderRadius:6,color:G.t1,width:24,height:24,fontSize:13,cursor:"pointer"}}>+</button></div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:G.t4,fontSize:9}}>Wide</span><button onClick={function(){setYard(yard.map(function(it){return it.id===sel.id?Object.assign({},it,{w:Math.min(60,it.w+2)}):it}))}} style={{background:G.ln,border:"none",borderRadius:6,color:G.t1,width:24,height:24,fontSize:11,cursor:"pointer"}}>{"\u2194"}</button></div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:G.t4,fontSize:9}}>Tall</span><button onClick={function(){setYard(yard.map(function(it){return it.id===sel.id?Object.assign({},it,{h:Math.min(60,it.h+2)}):it}))}} style={{background:G.ln,border:"none",borderRadius:6,color:G.t1,width:24,height:24,fontSize:11,cursor:"pointer"}}>{"\u2195"}</button></div>
              <button onClick={function(){setYard(yard.map(function(it){return it.id===sel.id?Object.assign({},it,{rot:((it.rot||0)+45)%360}):it}))}} style={{background:G.ln,border:"none",borderRadius:6,color:G.t1,fontSize:10,padding:"0 10px",height:24,cursor:"pointer"}}>{"\u21BB rotate"}</button>
            </div>
          </Card>:<Card style={{padding:10,textAlign:"center"}}><div style={{color:G.t4,fontSize:10}}>Tap a piece on the map to edit it.</div></Card>}
          {/* palette - add new pieces */}
          <div style={{fontSize:11,fontWeight:600}}>Add to yard</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{palette.map(function(p,i){return <button key={i} onClick={function(){var nid=yard.length?Math.max.apply(null,yard.map(function(it){return it.id}))+1:1;setYard(yard.concat([{id:nid,kind:p.kind,label:p.label,x:45,y:45,w:p.w,h:p.h,e:p.e}]));setYardSel(nid)}} style={{background:"transparent",border:"1px solid "+G.ln,borderRadius:9,padding:"6px 10px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>{p.e}</span>{p.label}</button>})}</div>
          <div style={{color:G.t4,fontSize:9,lineHeight:1.4,marginTop:2}}>This map is your visual yard plan - drag everything to where it really is. It saves automatically.</div>
          </>}
        </div>;
      })():<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:600}}>{beds.length+" Beds \u00B7 Pearl White"}</div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={function(){setYardMode(true)}} style={{background:G.f2,color:G.s4,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{"\u{1F5FA}\uFE0F Yard Map"}</button>
            <button onClick={function(){setAddBed(true)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Bed</button>
          </div>
        </div>
        {addBed&&<Card style={{borderColor:G.s3+"33"}}><div style={{fontSize:12,fontWeight:600,marginBottom:6}}>New Bed Shape</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{SHAPES.map(function(s){return <Chip key={s.id} on={newShape===s.id} color={G.s3} onClick={function(){setNewShape(s.id)}} sm>{(s.round?"\u2B55 ":"")+s.n}</Chip>})}</div><div style={{display:"flex",gap:6}}><button onClick={function(){var nid=Math.max.apply(null,beds.map(function(b){return b.id}))+1;setBeds(beds.concat([{id:nid,name:"Bed "+(beds.length+1),shape:newShape,sun:"full",grid:Array(20).fill(null),ph:[]}]));setAddBed(false)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"8px 0",flex:1,fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button><button onClick={function(){setAddBed(false)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,padding:"8px 0",flex:1,fontSize:12,color:G.t3,cursor:"pointer"}}>Cancel</button></div></Card>}
        <div style={{display:"grid",gridTemplateColumns:wide?"repeat(4,1fr)":"1fr 1fr",gap:wide?10:5}}>{beds.map(function(b){var f=b.grid.filter(Boolean).length;var sh=getShape(b.shape);var planted=[];b.grid.forEach(function(c){if(c&&planted.indexOf(c.e)<0)planted.push(c.e)});return <Card key={b.id} onClick={function(){setEB(b.id)}} style={{padding:"7px 9px"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{(sh.round?"\u2B55 ":"")+b.name}</span><span style={{fontSize:8,color:G.t4}}>{f?f+"/"+(sh.w*sh.h):"empty"}</span></div><div style={{fontSize:9,color:G.t3,marginTop:1}}>{sh.n.split(" ")[0]+" \u00B7 "+(b.sun==="full"?"\u2600":"\u26C5")}</div><div style={{marginTop:3,display:"flex",gap:2}}>{planted.map(function(e,j){return <span key={j} style={{fontSize:13}}>{e}</span>})}{b.ph.length>0&&<span style={{fontSize:9,color:G.warn,marginLeft:"auto"}}>{"\u{1F9EA}"}</span>}{!f&&!b.ph.length&&<span style={{fontSize:9,color:G.s2}}>+ tap to plan</span>}</div></Card>})}</div>
        {/* ── BUILD YOUR ORCHARD ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
          <div style={{fontSize:13,fontWeight:600}}>{"\u{1F333} Your Orchard"}<span style={{color:G.t4,fontSize:10,fontWeight:400}}>{" \u00B7 "+orchard.length+" trees"}</span></div>
          <button onClick={function(){setAddTree(true);setTreeType(null)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Tree</button>
        </div>

        {addTree&&<Card style={{borderColor:G.s3+"33"}}>
          {!treeType?<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:600}}>Pick a tree type</span><button onClick={function(){setAddTree(false)}} style={{background:"none",border:"none",color:G.t3,fontSize:11,cursor:"pointer"}}>cancel</button></div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{TREECAT.map(function(t){return <button key={t.type} onClick={function(){setTreeType(t.type)}} style={{background:"transparent",border:"1px solid "+G.ln,borderRadius:9,padding:"5px 10px",fontSize:11,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>{t.e}</span>{t.type}<span style={{fontSize:8,color:G.t4}}>{t.v.length}</span></button>})}</div>
          </>:(function(){
            var t=TREECAT.find(function(x){return x.type===treeType});
            return <>
              <button onClick={function(){setTreeType(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:8}}>{"\u2190 All types"}</button>
              <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>{t.e+" Choose your "+t.type+" variety"}</div>
              <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:300,overflow:"auto"}}>{t.v.map(function(v,i){return <button key={i} onClick={function(){var nid=orchard.length?Math.max.apply(null,orchard.map(function(o){return o.id}))+1:1;setOrchard(orchard.concat([{id:nid,type:t.type,variety:v.n,e:t.e}]));setAddTree(false);setTreeType(null)}} style={{background:G.bg0,border:"1px solid "+G.ln,borderRadius:10,padding:"9px 11px",textAlign:"left",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:G.t1}}>{v.n}</span><span style={{fontSize:9,color:G.s2,fontWeight:600,whiteSpace:"nowrap",marginLeft:8}}>{v.chill+" chill hrs"}</span></div>
                <div style={{color:G.t3,fontSize:10,lineHeight:1.4,marginTop:3}}>{v.note}</div>
              </button>})}</div>
            </>;
          })()}
        </Card>}

        {orchard.length>0&&<div style={{display:"grid",gridTemplateColumns:wide?"repeat(3,1fr)":"1fr 1fr",gap:6}}>{orchard.map(function(tr){var info=findTreeVariety(tr.type,tr.variety);return <Card key={tr.id} style={{padding:"9px 11px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{fontSize:22}}>{tr.e}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,lineHeight:1.2}}>{tr.variety}</div>
              <div style={{color:G.t4,fontSize:9}}>{tr.type+(info?" \u00B7 "+info.chill+" chill":"")}</div>
            </div>
            <button onClick={function(){setOrchard(orchard.filter(function(x){return x.id!==tr.id}))}} style={{background:"none",border:"none",color:G.t4,fontSize:13,cursor:"pointer",lineHeight:1,padding:0}}>{"\u00D7"}</button>
          </div>
          {info&&<div style={{color:G.t3,fontSize:9,lineHeight:1.4,marginTop:5,paddingTop:5,borderTop:"1px solid "+G.ln+"44"}}>{info.note}</div>}
        </Card>})}</div>}
        {orchard.length===0&&!addTree&&<Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11,lineHeight:1.5}}>No trees yet. Tap "+ Add Tree" to build your orchard from 89 varieties - peaches, citrus, avocado, figs & more.</div></Card>}
      </>}
    </div>}

    {tab==="library"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {sel?<div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={function(){setSel(null);setAddGarden(false);setAddGardenMsg("")}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 Back"}</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:34}}>{sel.e}</span><div><div style={{fontSize:15,fontWeight:700}}>{sel.n}</div><div style={{color:G.t3,fontSize:11}}>{(sel.bed||sel.cat)+(sel.stg?" \u00B7 "+sel.stg:"")}</div></div></div>
        {/* ── ADD TO GARDEN ── */}
        {sel.cat!=="tree"&&sel.cat!=="citrus"&&sel.cat!=="stone"&&sel.cat!=="berry"?<Card style={{borderColor:G.s3+"33",background:G.s3+"06",padding:11}}>
          {addGardenMsg?<div style={{textAlign:"center"}}><div style={{color:G.s3,fontSize:12,fontWeight:600}}>{"\u2705 "+addGardenMsg}</div><button onClick={function(){setAddGardenMsg("");setAddGarden(false)}} style={{background:"none",border:"none",color:G.t3,fontSize:10,cursor:"pointer",marginTop:4}}>add to another bed</button></div>
          :!addGarden?<button onClick={function(){setAddGarden(true)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"10px 0",width:"100%",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{"\u{1F331} Add "+sel.n+" to Garden"}</button>
          :<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:600}}>{"Which bed for "+sel.e+" "+sel.n+"?"}</span><button onClick={function(){setAddGarden(false)}} style={{background:"none",border:"none",color:G.t3,fontSize:11,cursor:"pointer"}}>cancel</button></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>{beds.map(function(b){var sh=getShape(b.shape);var cap=sh.w*sh.h;var filled=b.grid.filter(Boolean).length;var full=filled>=cap;return <button key={b.id} disabled={full} onClick={function(){
              // place into first empty cell(s)
              var size=1;var ge=PG.find(function(g){return sel.n.toLowerCase().indexOf(g.n.toLowerCase())>=0||g.v.some(function(v){return sel.n.toLowerCase().indexOf(v.toLowerCase())>=0})});if(ge)size=ge.s;
              setBeds(function(bs){return bs.map(function(bd){if(bd.id!==b.id)return bd;var a=bd.grid.slice();var placed=false;for(var ci=0;ci<cap&&!placed;ci++){if(!a[ci]){for(var j=ci;j<Math.min(ci+size,cap);j++)a[j]={e:sel.e,n:sel.n,s:size};placed=true}}return Object.assign({},bd,{grid:a})})});
              setAddGardenMsg(sel.n+" added to "+b.name);
            }} style={{background:full?G.bg2:G.bg0,border:"1px solid "+(full?G.ln:G.s3+"44"),borderRadius:9,padding:"8px 4px",cursor:full?"default":"pointer",opacity:full?0.4:1}}>
              <div style={{fontSize:11,fontWeight:600,color:full?G.t4:G.t1}}>{(sh.round?"\u2B55":"")+(b.id+1)}</div>
              <div style={{fontSize:8,color:G.t4}}>{full?"full":filled+"/"+cap}</div>
            </button>})}</div>
            <div style={{color:G.t4,fontSize:9,marginTop:7}}>Tap a bed number to plant it there. You can rearrange in the Garden tab.</div>
          </>}
        </Card>:<Card style={{borderColor:G.f3+"33",background:G.f3+"06",padding:11}}><button onClick={function(){
          // Trees go to the orchard
          var tCat=TREECAT.find(function(t){return sel.n.toLowerCase().indexOf(t.type.toLowerCase())>=0})||TREECAT.find(function(t){return t.v.some(function(v){return sel.n.toLowerCase().indexOf(v.n.toLowerCase())>=0})});
          var nid=orchard.length?Math.max.apply(null,orchard.map(function(o){return o.id}))+1:1;
          setOrchard(orchard.concat([{id:nid,type:tCat?tCat.type:sel.cat,variety:sel.n,e:sel.e}]));
          setAddGardenMsg(sel.n+" added to your orchard");
        }} disabled={!!addGardenMsg} style={{background:addGardenMsg?G.f3+"22":G.f3,color:addGardenMsg?G.s3:G.bg0,border:"none",borderRadius:10,padding:"10px 0",width:"100%",fontSize:13,fontWeight:700,cursor:addGardenMsg?"default":"pointer"}}>{addGardenMsg?"\u2705 "+addGardenMsg:"\u{1F333} Add "+sel.n+" to Orchard"}</button></Card>}
        {sel.chill!==undefined&&<Card style={{padding:10}}><div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}><div><div style={{color:G.s2,fontSize:9}}>CHILL HRS</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{sel.chill}</div></div><div><div style={{color:G.s2,fontSize:9}}>POLLINATION</div><div style={{color:G.t1,fontSize:11,fontWeight:600}}>{sel.pol}</div></div><div><div style={{color:G.s2,fontSize:9}}>SPACING</div><div style={{color:G.t1,fontSize:11,fontWeight:600}}>{sel.space}</div></div></div>{sel.harv&&<div style={{textAlign:"center",marginTop:8,paddingTop:8,borderTop:"1px solid "+G.ln+"44"}}><span style={{color:G.s3,fontSize:11,fontWeight:600}}>{"\u{1F33E} Harvest: "+sel.harv}</span></div>}</Card>}
        {(sel.sow||sel.tp)&&<Card style={{padding:11,borderColor:G.s2+"22"}}><div style={{color:G.s2,fontSize:10,fontWeight:600,marginBottom:6}}>{"\u{1F331} SEED-STARTING (Zone 9b)"}</div><div style={{display:"flex",gap:8}}>{sel.sow&&<div style={{flex:1,background:G.bg0,borderRadius:9,padding:"7px 9px"}}><div style={{color:G.t4,fontSize:8,fontWeight:600}}>START INDOORS</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{sel.sow}</div></div>}<div style={{flex:1,background:G.bg0,borderRadius:9,padding:"7px 9px"}}><div style={{color:G.t4,fontSize:8,fontWeight:600}}>{sel.sow?"TRANSPLANT/SOW OUT":"DIRECT SOW"}</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{sel.tp||"\u2014"}</div></div></div>{!sel.sow&&sel.tp&&<div style={{color:G.t3,fontSize:9,marginTop:5}}>Direct-sow outdoors - no indoor start needed.</div>}</Card>}
        <Card style={{background:G.f2+"10",borderColor:G.f2+"22",padding:10}}><div style={{color:G.s3,fontSize:10,fontWeight:600,marginBottom:3}}>9B TIP</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{sel.tip}</div></Card>
        <div style={{display:"flex",gap:5}}><Chip on={!med} color={G.s3} onClick={function(){setMed(false)}}>Health</Chip><Chip on={med} color={G.c2} onClick={function(){setMed(true)}}>Medicinal</Chip></div>
        <Card>{(med?sel.m:sel.h).map(function(x,i,a){return <div key={i} style={{display:"flex",gap:5,marginBottom:i<a.length-1?6:0}}><span style={{color:med?G.c2:G.s3,fontSize:11}}>{med?"\u2695":"+"}</span><span style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{x}</span></div>})}</Card>
        <Card><div style={{fontSize:11,fontWeight:600,marginBottom:3}}>Culinary</div><div style={{color:G.t2,fontSize:11}}>{sel.cul}</div><div style={{color:G.t3,fontSize:10,marginTop:3}}>{sel.flav}</div></Card>
        {sel.comp&&sel.comp.length>0&&<><div style={{fontSize:12,fontWeight:600}}>Companions</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{sel.comp.map(function(c,i){return <Chip key={i} color={G.s3} on sm>{"\u2705 "+c}</Chip>})}{sel.avoid.map(function(c,i){return <Chip key={i} color={G.red} on sm>{"\u274C "+c}</Chip>})}</div></>}
      </div>:<>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Chip on={sub==="plants"} color={G.s3} onClick={function(){setSub("plants")}}>{"Plants ("+ALLPLANTS.length+")"}</Chip><Chip on={sub==="pests"} color={G.c2} onClick={function(){setSub("pests")}}>Pests</Chip><Chip on={sub==="good"} color={G.s2} onClick={function(){setSub("good")}}>Beneficials</Chip><Chip on={sub==="comp"} color={G.f3} onClick={function(){setSub("comp")}}>Match</Chip></div>
        {sub==="plants"&&<>
          <input value={srch} onChange={function(e){setSrch(e.target.value)}} placeholder="Search plants, benefits..." style={inp}/>
          <div style={{display:"flex",gap:3,overflow:"auto"}}>{Object.keys(CATS).map(function(c){return <Chip key={c} on={fil===c&&!srch} color={G.s3} onClick={function(){setFil(c);setSrch("")}} sm>{CATS[c]}</Chip>})}</div>
          <div style={{display:wide?"grid":"block",gridTemplateColumns:wide?"repeat(3,1fr)":"none",gap:wide?8:0}}>{filt.map(function(p){return <Card key={p.id} onClick={function(){setSel(p);setMed(false);setAddGarden(false);setAddGardenMsg("")}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:wide?0:3}}><span style={{fontSize:20}}>{p.e}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600}}>{p.n}</div><div style={{color:G.t4,fontSize:9}}>{p.bed||p.cat}</div><div style={{color:G.s1,fontSize:9,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.h[0]}</div></div><span style={{color:G.t4}}>{"\u203A"}</span></Card>})}</div>
        </>}
        {sub==="pests"&&(pestSel?<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={function(){setPestSel(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 All pests"}</button>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:34}}>{pestSel.e}</span><div><div style={{fontSize:15,fontWeight:700}}>{pestSel.n}</div><div style={{color:G.t3,fontSize:11}}>{pestSel.type+" \u00B7 "+pestSel.sev+" \u00B7 "+pestSel.pk}</div></div></div>
          <Card><div style={{color:G.s2,fontSize:10,fontWeight:600,marginBottom:3}}>WHAT TO LOOK FOR</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{pestSel.look}</div></Card>
          <Card style={{borderColor:G.warn+"33"}}><div style={{color:G.warn,fontSize:10,fontWeight:600,marginBottom:3}}>{"\u26A0 WHEN IS IT TOO MUCH?"}</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{pestSel.threshold}</div></Card>
          <Card style={{borderColor:G.s3+"33"}}><div style={{color:G.s3,fontSize:10,fontWeight:600,marginBottom:3}}>{"\u{1F41E} ATTRACT THESE ALLIES"}</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{pestSel.attract}</div></Card>
          <Card><div style={{color:G.t1,fontSize:10,fontWeight:600,marginBottom:3}}>{"\u2705 SAFE REMOVAL"}</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{pestSel.remove}</div></Card>
          <Card style={{borderColor:G.red+"22"}}><div style={{color:G.red,fontSize:10,fontWeight:600,marginBottom:3}}>{"\u274C AVOID"}</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5}}>{pestSel.avoid}</div></Card>
          <Card style={{background:G.f2+"0C",padding:10}}><div style={{color:G.s2,fontSize:9,fontWeight:600}}>9B NOTE</div><div style={{color:G.t2,fontSize:11,lineHeight:1.4}}>{pestSel.note}</div></Card>
        </div>:PESTS.map(function(p,i){return <Card key={i} onClick={function(){setPestSel(p)}} style={{marginBottom:4,padding:11,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{p.e}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.n}</div><div style={{color:G.t4,fontSize:9}}>{p.type+" \u00B7 "+p.sev+" \u00B7 "+p.pk}</div><div style={{color:G.s1,fontSize:9,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{"Affects: "+p.pl}</div></div><span style={{color:G.t4}}>{"\u203A"}</span></Card>}))}
        {sub==="good"&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
          <Card style={{background:G.s3+"08",borderColor:G.s3+"22",padding:10}}><div style={{color:G.s3,fontSize:11,fontWeight:600}}>{"\u{1F41E} Your Garden's Free Workforce"}</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5,marginTop:3}}>Attract these and they'll handle most pests for you. Plant the listed flowers and herbs, avoid broad-spectrum sprays.</div></Card>
          {BENEFICIALS.map(function(b,i){return <Card key={i} style={{padding:11}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><span style={{fontSize:20}}>{b.e}</span><div><div style={{fontSize:13,fontWeight:600}}>{b.n}</div><div style={{color:G.s2,fontSize:9}}>{"Eats: "+b.eats}</div></div></div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}><b style={{color:G.s3}}>Attract:</b> {b.attract}</div><div style={{color:G.t3,fontSize:10,lineHeight:1.4,marginTop:4,fontStyle:"italic"}}>{b.note}</div></Card>})}
        </div>}
        {sub==="comp"&&<Card><div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Companion Checker</div><div style={{display:"flex",gap:5,alignItems:"center"}}><select value={compA} onChange={function(e){setCA(e.target.value)}} style={Object.assign({},inp,{flex:1,width:"auto"})}><option value="">Plant A</option>{CL.map(function(p){return <option key={p}>{p}</option>})}</select><span style={{color:G.t4}}>+</span><select value={compB} onChange={function(e){setCB(e.target.value)}} style={Object.assign({},inp,{flex:1,width:"auto"})}><option value="">Plant B</option>{CL.map(function(p){return <option key={p}>{p}</option>})}</select></div>{compA&&compB&&(function(){var r=ckp(compA,compB);var cl=r==="great"?G.s3:r==="bad"?G.red:G.t4;return <div style={{marginTop:8,padding:"8px 10px",borderRadius:9,background:cl+"12",border:"1px solid "+cl+"33",color:cl,fontSize:12,fontWeight:600}}>{r==="great"?"Great together!":r==="bad"?"Avoid this combo":"Likely neutral"}</div>})()}</Card>}
      </>}
    </div>}

    {tab==="calendar"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:5}}><Chip on={calMode==="plants"} color={G.s3} onClick={function(){setCalMode("plants")}}>{"\u{1F331} My Plants"}</Chip><Chip on={calMode==="zone"} color={G.f3} onClick={function(){setCalMode("zone")}}>{"\u{1F4C5} Zone Guide"}</Chip></div>

      {calMode==="plants"?<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:14,fontWeight:600}}>Harvest Timeline</span><button onClick={function(){setAddPlant(true)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Plant</button></div>
        {addPlant&&<Card style={{borderColor:G.s3+"33"}}><div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Track a New Planting</div><input value={apName} onChange={function(e){setApName(e.target.value)}} placeholder="What did you plant?" style={Object.assign({},inp,{marginBottom:6})}/><div style={{display:"flex",gap:6,marginBottom:6}}><select value={apBed} onChange={function(e){setApBed(e.target.value)}} style={Object.assign({},inp,{flex:1,width:"auto"})}>{beds.map(function(b){return <option key={b.id}>{b.name}</option>}).concat([<option key="tree">Tree Row</option>,<option key="cont">Container</option>])}</select><input type="number" value={apDth} onChange={function(e){setApDth(parseInt(e.target.value)||60)}} placeholder="Days" style={Object.assign({},inp,{width:70,flex:"none"})}/></div><div style={{color:G.t4,fontSize:9,marginBottom:8}}>Days to harvest (check the plant's library page)</div><div style={{display:"flex",gap:6}}><button onClick={function(){if(apName){var nid=myPlants.length?Math.max.apply(null,myPlants.map(function(p){return p.id}))+1:1;var match=ALLPLANTS.find(function(p){return p.n.toLowerCase().indexOf(apName.toLowerCase())>=0});setMyPlants(myPlants.concat([{id:nid,name:apName,e:match?match.e:"\u{1F331}",bed:apBed,planted:new Date().toISOString().slice(0,10),dth:apDth}]));setApName("");setAddPlant(false)}}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"8px 0",flex:1,fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button><button onClick={function(){setAddPlant(false)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,padding:"8px 0",flex:1,fontSize:12,color:G.t3,cursor:"pointer"}}>Cancel</button></div></Card>}
        <div style={{display:wide?"grid":"block",gridTemplateColumns:wide?"1fr 1fr":"none",gap:wide?10:0}}>{myPlants.map(function(p){return Object.assign({},p,{du:daysUntil(p.planted,p.dth)})}).sort(function(a,b){return (a.du===null?9999:a.du)-(b.du===null?9999:b.du)}).map(function(p){
          var pct=p.du===null?100:Math.max(0,Math.min(100,((p.dth-p.du)/p.dth)*100));
          var ready=p.du!==null&&p.du<=0;var soon=p.du!==null&&p.du<=14&&p.du>0;
          return <Card key={p.id} style={{padding:11,borderColor:ready?G.c2+"44":soon?G.s3+"33":G.ln,marginBottom:wide?0:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{p.e}</span><div><div style={{fontSize:12,fontWeight:600}}>{p.name}</div><div style={{color:G.t4,fontSize:9}}>{p.bed+" \u00B7 planted "+fmtDate(p.planted)}</div></div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:ready?G.c2:soon?G.s3:G.t2}}>{p.du===null?"\u221E":ready?"READY":p.du+"d"}</div><div style={{color:G.t4,fontSize:8}}>{ready?"harvest now":p.du===null?"perennial":"to harvest"}</div></div>
            </div>
            <div style={{height:6,borderRadius:99,background:G.ln,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",borderRadius:99,background:ready?G.c2:G.s3,transition:"width .8s"}}/></div>
            {(photos[p.id]&&photos[p.id].length>0)&&<div style={{display:"flex",gap:5,overflow:"auto",marginTop:8,paddingBottom:2}}>{photos[p.id].map(function(ph,pi){return <div key={pi} style={{flexShrink:0,textAlign:"center"}}><img src={ph.url} alt="" style={{width:54,height:54,objectFit:"cover",borderRadius:9,border:"1px solid "+G.ln}}/><div style={{color:G.t4,fontSize:7,marginTop:1}}>{fmtDate(ph.date)}</div></div>})}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}>
              <label style={{display:"flex",alignItems:"center",gap:4,background:G.f2+"18",border:"1px solid "+G.f2+"33",borderRadius:8,padding:"4px 10px",fontSize:10,color:G.s3,fontWeight:600,cursor:"pointer"}}>{"\u{1F4F7} Add photo"}<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0])addPhoto(p.id,e.target.files[0])}}/></label>
              <button onClick={function(){setMyPlants(myPlants.filter(function(x){return x.id!==p.id}))}} style={{background:"none",border:"none",color:G.t4,fontSize:9,cursor:"pointer"}}>remove</button>
            </div>
          </Card>
        })}</div>
        {myPlants.length===0&&<Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11}}>No plants tracked yet. Tap "+ Plant" to start your harvest timeline and get reminders.</div></Card>}
      </>:<>
        <div style={{fontSize:14,fontWeight:600}}>Zone 9b Calendar</div>
        <div style={{display:"flex",gap:3,overflow:"auto"}}>{MO.map(function(m,i){return <Chip key={i} on={calM===i+1} color={G.s3} onClick={function(){setCalM(i+1)}} sm>{m}</Chip>})}</div>
        <div style={{color:G.s3,fontSize:16,fontWeight:700,marginTop:2}}>{MO[calM-1]}</div>
        <div style={{color:G.t3,fontSize:10}}>{(calM>=3&&calM<=5?"Spring":calM>=6&&calM<=8?"Summer":calM>=9&&calM<=11?"Fall":"Winter")+" \u00B7 Zone 9b"}</div>
        <Card>{CAL[calM-1].i.map(function(x,i,a){return <div key={i} style={{color:G.t2,fontSize:12,lineHeight:1.8,borderBottom:i<a.length-1?"1px solid "+G.ln+"33":"none",paddingBottom:4,marginBottom:4}}>{x}</div>})}</Card>
        {(function(){var mAbbr=MO[calM-1];var sowable=ALLPLANTS.filter(function(p){return (p.sow&&p.sow.indexOf(mAbbr)>=0)||(p.tp&&p.tp.indexOf(mAbbr)>=0)});if(!sowable.length)return null;return <Card style={{borderColor:G.s2+"22"}}><div style={{color:G.s2,fontSize:11,fontWeight:600,marginBottom:6}}>{"\u{1F331} Start in "+MO[calM-1]+" ("+sowable.length+")"}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{sowable.slice(0,24).map(function(p){var indoor=p.sow&&p.sow.indexOf(mAbbr)>=0;return <button key={p.id} onClick={function(){setSel(p);setMed(false);setTab("library")}} style={{background:"transparent",border:"1px solid "+(indoor?G.warn+"44":G.s3+"44"),borderRadius:8,padding:"3px 8px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span>{p.e}</span>{p.n.split(" ")[0]}<span style={{fontSize:8,color:indoor?G.warn:G.s3}}>{indoor?"in":"out"}</span></button>})}</div><div style={{color:G.t4,fontSize:8,marginTop:6}}>{"\u{1F7E1} in = start indoors  \u00B7  \u{1F7E2} out = direct sow/transplant"}</div></Card>})()}
      </>}
    </div>}

    {tab==="water"&&<div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:wide?720:"none",margin:wide?"0 auto":0,width:"100%"}}>
      <div style={{fontSize:14,fontWeight:600}}>Irrigation</div>
      {rDev?(function(){var pname=rConn==="rachio"?"Rachio":rConn==="netro"?"Netro":"OpenSprinkler";return <>
        <Card style={{borderColor:G.s3+"33",background:G.s3+"08",padding:11}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:G.s3,fontSize:12,fontWeight:600}}>{"\u{1F4A7} "+rDev.name}</div><div style={{color:G.t3,fontSize:10}}>{pname+" \u00B7 "+rDev.zones.length+" zones \u00B7 live"}</div></div><div style={{background:G.s3+"22",borderRadius:99,padding:"3px 10px"}}><span style={{color:G.s3,fontSize:10,fontWeight:600}}>{"\u2022 Connected"}</span></div></div></Card>
        {rMsg&&<Card style={{borderColor:G.s3+"33",background:G.s3+"0C",padding:9}}><div style={{color:G.s3,fontSize:11,fontWeight:600}}>{"\u2713 "+rMsg}</div></Card>}
        {rErr&&<Card style={{borderColor:G.red+"33",background:G.red+"08",padding:9}}><div style={{color:G.red,fontSize:11}}>{rErr}</div></Card>}
        {/* Watering mode selector */}
        <Card style={{padding:11}}>
          <div style={{fontSize:11,fontWeight:600,color:G.s2,marginBottom:7}}>{"\u{1F39B}\uFE0F Watering Mode"}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{Object.keys(RMODES).map(function(k){var m=RMODES[k];var on=rMode===k;return <button key={k} onClick={function(){setRMode(k)}} style={{background:on?G.f2+"22":"transparent",border:"1px solid "+(on?G.s3+"66":G.ln),borderRadius:9,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:13}}>{m.e}</span><span style={{fontSize:10,fontWeight:600,color:on?G.s3:G.t3}}>{m.n}</span></button>})}</div>
          <div style={{color:G.t4,fontSize:9,marginTop:6}}>{RMODES[rMode].e+" "+RMODES[rMode].desc+" \u00B7 runtimes \u00D7"+RMODES[rMode].mult}</div>
        </Card>
        {/* Default duration + Run All */}
        <Card style={{padding:11}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><div style={{fontSize:11,fontWeight:600,color:G.s2}}>{"\u23F1\uFE0F Default runtime"}</div><div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={function(){setRDur(Math.max(1,rDur-1))}} style={{background:G.ln,border:"none",borderRadius:8,color:G.t1,width:28,height:28,fontSize:16,cursor:"pointer"}}>-</button><span style={{fontSize:14,fontWeight:700,minWidth:48,textAlign:"center"}}>{rDur+" min"}</span><button onClick={function(){setRDur(Math.min(180,rDur+1))}} style={{background:G.ln,border:"none",borderRadius:8,color:G.t1,width:28,height:28,fontSize:16,cursor:"pointer"}}>+</button></div></div>
          <button onClick={rRunAll} disabled={rBusy||runningAll} style={{background:runningAll?G.f2+"22":G.f3,color:runningAll?G.s3:G.bg0,border:"none",borderRadius:9,padding:"9px 0",width:"100%",fontSize:12,fontWeight:700,cursor:"pointer",opacity:(rBusy&&!runningAll)?0.5:1}}>{runningAll?"\u27F3 Cycling zones...":"\u25B6 Run All Zones in Sequence"}</button>
        </Card>
        <div style={{fontSize:12,fontWeight:600,marginTop:2}}>Your Zones</div>
        {rDev.zones.map(function(z,zi){var zb=zoneBeds(z.id,zi,rDev.zones.length);var cfg=zcfg[z.id]||{};var disabled=cfg.enabled===false;var thisDur=zoneDur(z.id);return <Card key={z.id} style={{padding:11,opacity:disabled?0.55:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:zb.length||editZcfg===z.id?7:0}}>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{z.name}</div><div style={{color:G.t4,fontSize:9}}>{"Zone "+z.num+" \u00B7 "+thisDur+" min"+(cfg.days&&cfg.days.length?" \u00B7 "+cfg.days.map(function(d){return DOW[d]}).join(""):"")+(cfg.time?" @ "+cfg.time:"")}</div></div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <button onClick={function(){setEditZcfg(editZcfg===z.id?null:z.id)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:8,color:G.t3,fontSize:10,padding:"5px 9px",cursor:"pointer"}}>{editZcfg===z.id?"done":"\u2699"}</button>
              <button onClick={function(){rStart(z.id,z.name)}} disabled={rBusy||disabled} style={{background:G.f2,border:"none",borderRadius:9,color:G.s4,fontSize:11,fontWeight:600,padding:"8px 14px",cursor:"pointer",opacity:(rBusy||disabled)?0.5:1}}>{rBusy?"...":"\u{1F4A7} "+thisDur+"m"}</button>
            </div>
          </div>
          {/* Per-zone config panel */}
          {editZcfg===z.id&&<div style={{borderTop:"1px solid "+G.ln+"55",paddingTop:9,marginBottom:zb.length?7:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{color:G.s2,fontSize:10,fontWeight:600}}>This zone's runtime</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}><button onClick={function(){var nm=Object.assign({},zcfg);nm[z.id]=Object.assign({},cfg,{dur:Math.max(1,(cfg.dur||rDur)-1)});setZcfg(nm)}} style={{background:G.ln,border:"none",borderRadius:7,color:G.t1,width:24,height:24,fontSize:14,cursor:"pointer"}}>-</button><span style={{fontSize:12,fontWeight:700,minWidth:42,textAlign:"center"}}>{(cfg.dur||rDur)+" min"}</span><button onClick={function(){var nm=Object.assign({},zcfg);nm[z.id]=Object.assign({},cfg,{dur:Math.min(180,(cfg.dur||rDur)+1)});setZcfg(nm)}} style={{background:G.ln,border:"none",borderRadius:7,color:G.t1,width:24,height:24,fontSize:14,cursor:"pointer"}}>+</button></div>
            </div>
            <div style={{color:G.s2,fontSize:10,fontWeight:600,marginBottom:5}}>Schedule days</div>
            <div style={{display:"flex",gap:4,marginBottom:8}}>{DOW.map(function(d,di){var on=cfg.days&&cfg.days.indexOf(di)>=0;return <button key={di} onClick={function(){var days=(cfg.days||[]).slice();var ix=days.indexOf(di);if(ix>=0)days.splice(ix,1);else days.push(di);var nm=Object.assign({},zcfg);nm[z.id]=Object.assign({},cfg,{days:days});setZcfg(nm)}} style={{width:30,height:30,borderRadius:8,border:"1px solid "+(on?G.s3+"66":G.ln),background:on?G.s3+"18":"transparent",color:on?G.s3:G.t4,fontSize:11,fontWeight:600,cursor:"pointer"}}>{d}</button>})}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{color:G.s2,fontSize:10,fontWeight:600}}>Start time</span>
              <input type="time" value={cfg.time||"06:00"} onChange={function(e){var nm=Object.assign({},zcfg);nm[z.id]=Object.assign({},cfg,{time:e.target.value});setZcfg(nm)}} style={{background:G.bg0,color:G.t1,border:"1px solid "+G.ln,borderRadius:8,padding:"5px 9px",fontSize:11}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:G.s2,fontSize:10,fontWeight:600}}>Zone enabled</span>
              <button onClick={function(){var nm=Object.assign({},zcfg);nm[z.id]=Object.assign({},cfg,{enabled:disabled});setZcfg(nm)}} style={{background:disabled?G.ln:G.s3+"22",border:"none",borderRadius:99,padding:"4px 12px",fontSize:10,fontWeight:600,color:disabled?G.t3:G.s3,cursor:"pointer"}}>{disabled?"OFF":"ON"}</button>
            </div>
            <div style={{color:G.t4,fontSize:9,marginTop:8,lineHeight:1.4}}>Schedule shows your intended watering plan. Tap a zone's 💧 to run it now. (Automatic scheduled runs require the controller's own app or a push server.)</div>
          </div>}
          {zb.length>0&&<div style={{borderTop:"1px solid "+G.ln+"55",paddingTop:7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{color:G.s2,fontSize:9,fontWeight:600}}>{"\u{1F331} WATERS THESE BEDS"}</span><button onClick={function(){setEditZone(editZone===z.id?null:z.id)}} style={{background:"none",border:"none",color:G.s3,fontSize:9,cursor:"pointer"}}>{editZone===z.id?"done":"edit"}</button></div>
            {editZone===z.id?
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{beds.map(function(b){var on=(zMap[z.id]||zb.map(function(x){return x.id})).indexOf(b.id)>=0;return <button key={b.id} onClick={function(){var cur=zMap[z.id]||zb.map(function(x){return x.id});var nx=on?cur.filter(function(id){return id!==b.id}):cur.concat([b.id]);var nm=Object.assign({},zMap);nm[z.id]=nx;setZMap(nm)}} style={{background:on?G.s3+"18":"transparent",border:"1px solid "+(on?G.s3+"66":G.ln),color:on?G.s3:G.t3,borderRadius:8,padding:"3px 8px",fontSize:9,fontWeight:600,cursor:"pointer"}}>{b.name}</button>})}</div>
              :
              <div style={{display:"flex",flexDirection:"column",gap:3}}>{zb.map(function(b){var contents=bedContents(b);return <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:G.t2,fontSize:10,fontWeight:600}}>{b.name}</span><span style={{color:G.t4,fontSize:9,textAlign:"right",maxWidth:"60%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{contents||"empty"}</span></div>})}</div>
            }
          </div>}
        </Card>})}
        {/* Watering history */}
        {rHist.length>0&&<Card style={{padding:11}}><div style={{fontSize:11,fontWeight:600,color:G.s2,marginBottom:7}}>{"\u{1F4DC} Recent Watering"}</div>{rHist.slice(0,6).map(function(h,i){var d=new Date(h.date);var when=d.toLocaleDateString(undefined,{month:"short",day:"numeric"})+" "+d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:5,marginBottom:5,borderBottom:i<Math.min(5,rHist.length-1)?"1px solid "+G.ln+"33":"none"}}><span style={{color:G.t2,fontSize:10,fontWeight:600}}>{h.zone}</span><span style={{color:G.t4,fontSize:9}}>{when+" \u00B7 "+h.min+"m"}</span></div>})}<button onClick={function(){setRHist([])}} style={{background:"none",border:"none",color:G.t4,fontSize:9,cursor:"pointer",marginTop:2}}>clear history</button></Card>}
        <button onClick={rStop} disabled={rBusy} style={{background:G.red+"18",border:"1px solid "+G.red+"44",borderRadius:10,color:G.red,padding:"10px 0",fontSize:12,fontWeight:600,cursor:"pointer",marginTop:2}}>{"\u23F9 Stop All Watering"}</button>
        <button onClick={function(){setRDev(null);setRConn(null);setRTok("");setRHost("");setRMsg("");setRErr("")}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.t3,padding:"8px 0",fontSize:11,cursor:"pointer"}}>Disconnect</button>
      </>})():rProv?(function(){
        // Connect form for the chosen provider
        var meta={rachio:{n:"Rachio",e:"\u{1F4A7}",ph:"Paste your Rachio API key",hint:"app.rach.io \u2192 Account Settings \u2192 Get API Key. Long code like 8e600a4c-..."},
          netro:{n:"Netro",e:"\u{1F33F}",ph:"Enter your Netro serial number",hint:"Netro app \u2192 Settings \u2192 Controller \u2192 Serial Number."},
          opensprinkler:{n:"OpenSprinkler",e:"\u{1F6B0}",ph:"Device password",hint:"Your OpenSprinkler password (default is 'opendoor', hashed automatically by newer firmware). Must be on the same WiFi network."}}[rProv];
        return <>
        <button onClick={function(){setRProv(null);setRErr("")}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 Back"}</button>
        <Card style={{borderColor:G.s3+"22"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:22}}>{meta.e}</span><div><div style={{fontSize:14,fontWeight:600}}>{"Connect "+meta.n}</div><div style={{color:G.s3,fontSize:9,fontWeight:600}}>{"\u2713 LIVE INTEGRATION"}</div></div></div>
          {rProv==="opensprinkler"&&<input value={rHost} onChange={function(e){setRHost(e.target.value.trim())}} placeholder="Controller IP (e.g. 192.168.1.50)" style={Object.assign({},inp,{marginBottom:6})}/>}
          <input type={rProv==="opensprinkler"?"password":"text"} value={rTok} onChange={function(e){setRTok(e.target.value.trim())}} placeholder={meta.ph} style={Object.assign({},inp,{marginBottom:6})}/>
          <div style={{color:G.t4,fontSize:9,lineHeight:1.5,marginBottom:8}}>{meta.hint}</div>
          {rErr&&<div style={{color:G.red,fontSize:10,marginBottom:8}}>{rErr}</div>}
          <button onClick={function(){rConnect(rProv)}} disabled={rBusy} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"11px 0",width:"100%",fontSize:12,fontWeight:600,cursor:"pointer",opacity:rBusy?0.6:1}}>{rBusy?"Connecting...":"Connect "+meta.n}</button>
        </Card>
      </>})():<>
        <Card style={{background:G.f2+"08",borderColor:G.f2+"22",padding:12,textAlign:"center"}}><div style={{fontSize:28}}>{"\u{1F4A7}"}</div><div style={{color:G.t1,fontSize:13,fontWeight:600,marginTop:4}}>Connect Your Controller</div><div style={{color:G.t3,fontSize:11,marginTop:2,lineHeight:1.5}}>Control your real sprinkler zones right from Grove.</div></Card>
        <div style={{fontSize:11,fontWeight:600,color:G.s3,marginTop:2}}>{"\u2713 Live integrations"}</div>
        {[{id:"rachio",n:"Rachio",e:"\u{1F4A7}",d:"Cloud \u00B7 API key"},{id:"netro",n:"Netro",e:"\u{1F33F}",d:"Cloud \u00B7 serial number"},{id:"opensprinkler",n:"OpenSprinkler",e:"\u{1F6B0}",d:"Local network \u00B7 password"}].map(function(c){return <Card key={c.id} onClick={function(){setRProv(c.id);setRErr("");setRTok("");setRHost("")}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderColor:G.s3+"22"}}><span style={{fontSize:22}}>{c.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.n}</div><div style={{color:G.t4,fontSize:9}}>{c.d}</div></div><span style={{color:G.s3,fontSize:11,fontWeight:600}}>Connect</span></Card>})}
        <div style={{fontSize:11,fontWeight:600,color:G.t3,marginTop:2}}>Coming soon</div>
        {[{n:"Orbit B-hyve",e:"\u{1F4A6}"},{n:"RainMachine",e:"\u{1F327}\uFE0F"}].map(function(c){return <Card key={c.n} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",opacity:0.6}}><span style={{fontSize:20}}>{c.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.n}</div></div><span style={{color:G.t4,fontSize:10,fontWeight:600,border:"1px solid "+G.ln,borderRadius:99,padding:"2px 8px"}}>Soon</span></Card>})}
      </>}
    </div>}

    {tab==="coach"&&<div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:wide?620:"none",margin:wide?"0 auto":0,width:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:34,height:34,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center"}}><Leaf size={20}/></div><div><div style={{fontSize:14,fontWeight:600}}>grove coach</div><div style={{color:G.t4,fontSize:10}}>{"Zone 9b \u00B7 "+ALLPLANTS.length+" plants"}</div></div></div>
      {dM==="pick"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>Which plant?</div><select value={dP} onChange={function(e){setDP(e.target.value)}} style={Object.assign({},inp,{marginBottom:6})}><option value="">Select...</option>{ALLPLANTS.map(function(p){return <option key={p.id} value={p.n}>{p.n}</option>})}</select>{dP&&<button onClick={function(){setDM("sym")}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Next</button>}</Card>}
      {dM==="sym"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>{dP}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>{SYM.map(function(s,i){return <Chip key={i} on={dS===s} color={G.c2} onClick={function(){setDS(s)}} sm>{s}</Chip>})}</div><label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,border:"2px dashed "+(dPh?G.s3:G.ln),borderRadius:10,cursor:"pointer",marginBottom:8,background:dPh?G.s3+"08":"transparent"}}>{dPh?<><span>{"\u2705"}</span><span style={{color:G.s3,fontSize:11}}>Photo added</span></>:<><span>{"\u{1F4F7}"}</span><span style={{color:G.t4,fontSize:11}}>Drop photo here</span></>}<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0])setDPh(URL.createObjectURL(e.target.files[0]))}}/></label>{dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:10,maxHeight:120,objectFit:"cover",marginBottom:8}}/>}{dS&&<button onClick={diag} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Analyze</button>}</Card>}
      {dM==="load"&&<Card style={{textAlign:"center",padding:24}}><div style={{fontSize:24}}>{"\u{1F50D}"}</div><div style={{color:G.s3,fontSize:12,fontWeight:600,marginTop:6}}>Analyzing...</div></Card>}
      {dM==="result"&&dR&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:12,maxHeight:110,objectFit:"cover"}}/>}<Card style={{borderColor:G.c2+"33"}}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{dR.p}</div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,borderRadius:99,background:G.ln,overflow:"hidden"}}><div style={{height:"100%",width:dR.c+"%",borderRadius:99,background:G.s3}}/></div><span style={{color:G.t2,fontSize:11,fontWeight:600}}>{dR.c+"%"}</span></div></Card><Card><div style={{color:G.s3,fontSize:11,fontWeight:600,marginBottom:5}}>Actions</div>{dR.a.map(function(a,i){return <div key={i} style={{color:G.t2,fontSize:11,marginBottom:5,paddingLeft:8,borderLeft:"2px solid "+G.s3+"33"}}>{(i+1)+". "+a}</div>})}</Card><button onClick={function(){setDM(null);setDP("");setDS("");setDR(null);setDPh(null)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:7,fontSize:11,cursor:"pointer"}}>New diagnosis</button></div>}
      {!dM&&!cQ&&<div style={{display:"flex",flexDirection:"column",gap:5}}><Card onClick={function(){setDM("pick")}} style={{borderColor:G.c2+"33",background:G.c2+"06",display:"flex",alignItems:"center",gap:9,padding:"12px 13px"}}><span style={{fontSize:22}}>{"\u{1F4F7}"}</span><div><div style={{color:G.c2,fontSize:13,fontWeight:600}}>Diagnose a plant</div><div style={{color:G.t3,fontSize:10}}>Photo \u00B7 symptoms \u00B7 treatment</div></div></Card><div style={{color:G.t3,fontSize:11,marginTop:2}}>Or ask:</div>{Object.keys(COACH).map(function(q,i){return <Card key={i} onClick={function(){ask(q)}} style={{padding:"9px 11px",borderColor:G.f2+"22",display:"flex",alignItems:"center",gap:7}}><span style={{color:G.s3,fontSize:12}}>{"\u2192"}</span><span style={{fontSize:11}}>{q}</span></Card>})}</div>}
      {!dM&&cQ&&<><div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:G.f2,borderRadius:"13px 13px 3px 13px",padding:"7px 11px",fontSize:11,maxWidth:"82%"}}>{cQ}</div></div><div style={{display:"flex",gap:7,alignItems:"flex-start"}}><div style={{width:22,height:22,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Leaf size={14}/></div><div style={{background:G.bg1,border:"1px solid "+G.ln,borderRadius:"3px 13px 13px 13px",padding:"9px 11px",fontSize:11,color:G.t2,lineHeight:1.6,maxWidth:"85%"}}>{cTx}{typing&&<span style={{color:G.s3}}>{"\u2588"}</span>}</div></div>{!typing&&<button onClick={function(){setCQ(null);setCTx("")}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:"5px 12px",fontSize:11,cursor:"pointer",alignSelf:"flex-start"}}>{"\u2190 New question"}</button>}</>}
    </div>}

    {tab==="learn"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {gSel?<div style={{display:"flex",flexDirection:"column",gap:9}}>
        <button onClick={function(){setGSel(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 All guides"}</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:32}}>{gSel.e}</span><div><div style={{fontSize:16,fontWeight:700}}>{gSel.t}</div><div style={{color:G.t3,fontSize:11}}>{gSel.sub}</div></div></div>
        {gSel.steps.map(function(s,i){return <Card key={i} style={{padding:11,display:"flex",gap:10}}><div style={{minWidth:22,height:22,borderRadius:99,background:G.f2,color:G.s4,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div><div style={{color:G.t2,fontSize:11,lineHeight:1.5,paddingTop:2}}>{s}</div></Card>})}
      </div>:<>
        {/* FEEDING - Calculator + Schedule modes */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:600}}>Feeding</div><div style={{display:"flex",gap:4}}><Chip on={fdMode==="calc"} color={G.s3} onClick={function(){setFdMode("calc")}} sm>{"\u{1F9EE} Calculator"}</Chip><Chip on={fdMode==="schedule"} color={G.c2} onClick={function(){setFdMode("schedule")}} sm>{"\u{1F4C5} Schedule"}</Chip></div></div>

        {fdMode==="calc"?<>
        <Card style={{padding:12}}>
          <div style={{color:G.t3,fontSize:10,fontWeight:600,marginBottom:6}}>WHAT ARE YOU FEEDING?</div>
          <select value={fdAmend} onChange={function(e){setFdAmend(e.target.value)}} style={Object.assign({},inp,{marginBottom:10})}>{AMENDMENTS.map(function(a){return <option key={a.id} value={a.id}>{a.n}</option>})}</select>
          <div style={{color:G.t3,fontSize:10,fontWeight:600,marginBottom:6}}>BED SIZE (feet)</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
            <input type="number" value={fdW} onChange={function(e){setFdW(Math.max(1,parseFloat(e.target.value)||1))}} style={Object.assign({},inp,{flex:1})}/>
            <span style={{color:G.t4}}>{"\u00D7"}</span>
            <input type="number" value={fdL} onChange={function(e){setFdL(Math.max(1,parseFloat(e.target.value)||1))}} style={Object.assign({},inp,{flex:1})}/>
            <span style={{color:G.t3,fontSize:11}}>{"= "+(fdW*fdL)+" sqft"}</span>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{[{l:"2\u00D78 Vego",w:2,h:8},{l:"4\u00D74",w:4,h:4},{l:"4\u00D78",w:4,h:8},{l:"3\u00D76",w:3,h:6}].map(function(p){return <Chip key={p.l} on={fdW===p.w&&fdL===p.h} color={G.s2} onClick={function(){setFdW(p.w);setFdL(p.h)}} sm>{p.l}</Chip>})}</div>
        </Card>
        {(function(){
          var a=AMENDMENTS.find(function(x){return x.id===fdAmend});
          var sqft=fdW*fdL;
          var amount,amtLabel;
          if(a.unit==="inches"){amtLabel="1-2 inch layer";amount=Math.round(sqft*0.062*10)/10+" cu ft for 1 inch";}
          else if(a.unit==="tbsp/gal"){amtLabel=a.perSqFt+" - mix per label";amount="~"+Math.ceil(sqft/4)+" gal of diluted solution";}
          else if(a.unit==="cups"){var c=Math.round(sqft*a.perSqFt*10)/10;amount=c+" cups";amtLabel="topdress & scratch in";}
          else if(a.unit==="tbsp"){var tb=Math.round(sqft*a.perSqFt);amount=tb+" tbsp";amtLabel="light application";}
          return <Card style={{borderColor:TIERC[a.tier]+"44",background:TIERC[a.tier]+"08"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:20}}>{a.e}</span><div><div style={{fontSize:13,fontWeight:600}}>{a.n}</div><span style={{fontSize:9,fontWeight:600,color:TIERC[a.tier],border:"1px solid "+TIERC[a.tier]+"55",borderRadius:99,padding:"1px 7px"}}>{a.tier}</span></div></div>
            </div>
            <div style={{background:G.bg0,borderRadius:10,padding:"10px 12px",marginBottom:8,textAlign:"center"}}><div style={{color:TIERC[a.tier],fontSize:18,fontWeight:700}}>{amount}</div><div style={{color:G.t4,fontSize:9}}>{"for your "+fdW+"\u00D7"+fdL+" bed \u00B7 "+amtLabel}</div></div>
            <div style={{color:G.t2,fontSize:11,lineHeight:1.5,marginBottom:6}}>{a.desc}</div>
            <div style={{color:G.s3,fontSize:10,fontWeight:600}}>How to apply</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5,marginBottom:6}}>{a.how}</div>
            <div style={{color:G.s3,fontSize:10,fontWeight:600}}>How often</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>{a.freq}</div>
          </Card>;
        })()}
        <Card style={{background:G.f2+"0A",padding:10}}><div style={{color:G.s2,fontSize:10,fontWeight:600}}>{"\u{1F4A1} Feeding order, gentlest first"}</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5,marginTop:3}}>Worm castings & compost are gentle - use freely. Fish emulsion & balanced granulars are your workhorses. Blood meal & citrus food are strong - measure carefully and water in well to avoid burning roots.</div></Card>
        </>:<>
        {/* PER-CROP SCHEDULE - tied to what you've planted */}
        {(function(){
          var planted=myPlants.map(function(p){var fp=feedPlanFor(p.name);if(!fp)return null;var age=daysUntil(p.planted,p.dth)===null?0:Math.round((Date.now()-new Date(p.planted).getTime())/(24*60*60*1000));
            // find current phase = last phase whose 'at' <= age, and next phase
            var cur=null,next=null;
            for(var i=0;i<fp.phases.length;i++){if(fp.phases[i].at<=age)cur=fp.phases[i];else if(!next)next=fp.phases[i]}
            return {p:p,fp:fp,age:age,cur:cur,next:next};
          }).filter(Boolean);
          if(!myPlants.length)return <Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11,lineHeight:1.6}}>Track what you've planted (in the Calendar tab) and Grove will build a feeding schedule for each crop here - what to feed and exactly when.</div></Card>;
          if(!planted.length)return <Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11,lineHeight:1.6}}>None of your tracked plants matched a feeding plan yet. Plans cover tomatoes, peppers, greens, roots, brassicas, squash, alliums, herbs, citrus, stone fruit, berries, and trees.</div></Card>;
          return <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Card style={{background:G.c2+"08",borderColor:G.c2+"22",padding:10}}><div style={{color:G.c2,fontSize:11,fontWeight:600}}>{"\u{1F4C5} Your Feeding Schedule"}</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5,marginTop:2}}>Based on what you've planted and how long it's been growing. The highlighted phase is where each crop is now.</div></Card>
            {planted.map(function(x){var amA=x.cur&&AMENDMENTS.find(function(a){return a.id===x.cur.amend});var amN=x.next&&AMENDMENTS.find(function(a){return a.id===x.next.amend});return <Card key={x.p.id} style={{padding:11}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:18}}>{x.p.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{x.p.name}</div><div style={{color:G.t4,fontSize:9}}>{x.fp.n+" plan \u00B7 day "+x.age+" \u00B7 "+x.p.bed}</div></div></div>
              {/* timeline of phases */}
              <div style={{display:"flex",flexDirection:"column",gap:5}}>{x.fp.phases.map(function(ph,pi){var done=ph.at<=x.age&&(x.next?ph.at<x.next.at:true);var isCur=x.cur&&ph.at===x.cur.at;var am=AMENDMENTS.find(function(a){return a.id===ph.amend});return <div key={pi} style={{display:"flex",gap:8,alignItems:"flex-start",opacity:ph.at>x.age&&!isCur?0.55:1}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:2}}><div style={{width:14,height:14,borderRadius:99,background:isCur?G.c2:done?G.s3:G.ln,border:"2px solid "+(isCur?G.c2:done?G.s3:G.ln),flexShrink:0}}/>{pi<x.fp.phases.length-1&&<div style={{width:2,flex:1,minHeight:18,background:done?G.s3+"55":G.ln}}/>}</div>
                <div style={{flex:1,paddingBottom:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:600,color:isCur?G.c2:G.t1}}>{ph.label}</span><span style={{fontSize:8,color:G.t4}}>{ph.at===0?"day 0":"day "+ph.at}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5,margin:"2px 0"}}><span style={{fontSize:11}}>{am.e}</span><span style={{fontSize:10,color:G.t2,fontWeight:600}}>{am.n}</span><span style={{fontSize:8,fontWeight:600,color:TIERC[am.tier]}}>{am.tier}</span></div>
                <div style={{color:G.t3,fontSize:9,lineHeight:1.45}}>{ph.note}</div></div>
              </div>})}</div>
              {x.next&&amN&&<div style={{marginTop:6,padding:"7px 9px",borderRadius:9,background:G.c2+"0C",border:"1px solid "+G.c2+"22"}}><span style={{color:G.c2,fontSize:10,fontWeight:600}}>{"\u23ED Next: "+x.next.label+" in "+(x.next.at-x.age)+" days"}</span></div>}
              {!x.next&&<div style={{marginTop:6,padding:"7px 9px",borderRadius:9,background:G.s3+"0C",border:"1px solid "+G.s3+"22"}}><span style={{color:G.s3,fontSize:10,fontWeight:600}}>{"\u2713 Feeding plan complete - maintain as noted"}</span></div>}
            </Card>})}
          </div>;
        })()}
        </>}

        {/* HOW-TO GUIDES */}
        <div style={{fontSize:14,fontWeight:600,marginTop:6}}>How-To & 9b Tips</div>
        <div style={{display:"flex",gap:3,overflow:"auto"}}>{GUIDECATS.map(function(c){return <Chip key={c} on={gCat===c} color={G.s3} onClick={function(){setGCat(c)}} sm>{c}</Chip>})}</div>
        <div style={{display:wide?"grid":"block",gridTemplateColumns:wide?"1fr 1fr":"none",gap:wide?8:0}}>{GUIDES.filter(function(g){return gCat==="All"||g.cat===gCat}).map(function(g){return <Card key={g.id} onClick={function(){setGSel(g)}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",marginBottom:wide?0:4}}><span style={{fontSize:22}}>{g.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{g.t}</div><div style={{color:G.t4,fontSize:9}}>{g.sub}</div></div><span style={{color:G.t4}}>{"\u203A"}</span></Card>})}</div>
      </>}
    </div>}

    </div>

    {wide?
    <div style={{position:"fixed",top:0,left:0,bottom:0,width:210,background:G.bg1,borderRight:"1px solid "+G.ln,display:"flex",flexDirection:"column",padding:"22px 14px",gap:4,boxSizing:"border-box"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,padding:"0 10px 20px"}}><Leaf size={30}/><span style={{fontSize:22,fontWeight:700}}>grove</span></div>
      {[{id:"home",l:"Home",i:"\u{1F3E1}"},{id:"garden",l:"Garden",i:"\u{1F331}"},{id:"library",l:"Library",i:"\u{1F4DA}"},{id:"calendar",l:"Calendar",i:"\u{1F4C5}"},{id:"water",l:"Water",i:"\u{1F4A7}"},{id:"learn",l:"Learn",i:"\u{1F4D6}"},{id:"coach",l:"Coach",i:"\u{1F916}"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id);if(t.id!=="library"){setSel(null);setPestSel(null)}if(t.id!=="learn")setGSel(null)}} style={{background:tab===t.id?G.f2+"22":"none",border:"none",borderRadius:11,cursor:"pointer",display:"flex",alignItems:"center",gap:11,padding:"11px 13px",width:"100%",textAlign:"left"}}><span style={{fontSize:18,filter:tab===t.id?"none":"grayscale(1) opacity(.4)"}}>{t.i}</span><span style={{fontSize:14,fontWeight:600,color:tab===t.id?G.s3:G.t3}}>{t.l}</span></button>})}
    </div>
    :
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:G.bg0+"F2",backdropFilter:"blur(24px)",borderTop:"1px solid "+G.ln,display:"flex",justifyContent:"space-around",padding:"5px 0 16px"}}>
      {[{id:"home",l:"Home",i:"\u{1F3E1}"},{id:"garden",l:"Garden",i:"\u{1F331}"},{id:"library",l:"Library",i:"\u{1F4DA}"},{id:"calendar",l:"Cal",i:"\u{1F4C5}"},{id:"water",l:"Water",i:"\u{1F4A7}"},{id:"learn",l:"Learn",i:"\u{1F4D6}"},{id:"coach",l:"Coach",i:"\u{1F916}"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id);if(t.id!=="library"){setSel(null);setPestSel(null)}if(t.id!=="learn")setGSel(null)}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"3px 4px"}}><span style={{fontSize:15,filter:tab===t.id?"none":"grayscale(1) opacity(.35)"}}>{t.i}</span><span style={{fontSize:7.5,fontWeight:600,color:tab===t.id?G.s3:G.t4}}>{t.l}</span></button>})}
    </div>
    }
  </div>;
}
