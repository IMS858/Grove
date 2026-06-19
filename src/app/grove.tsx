import { useState, useEffect, useMemo } from "react";

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

var ALLPLANTS = P.concat(TREES);

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
var CATS={all:"All",herb:"Herbs",fruiting:"Fruiting",leafy:"Leafy",brassica:"Brassica",root:"Root",allium:"Allium",citrus:"Citrus",stone:"Stone",tree:"Trees",berry:"Berry",flower:"Flower"};
var SYM=["Yellowing","Curling","Brown spots","Holes","Webbing","Sticky","White powder","Wilting"];
var DDB={"yellow":{p:"Magnesium Deficiency",c:74,a:["Epsom salt 1 tbsp/gal AM","Let top inch dry","Recheck 7 days"]},"curl":{p:"Heat Stress",c:68,a:["Deep water evening","Shade cloth 30%","Mulch 3-4in"]},"hole":{p:"Cabbage Worm",c:82,a:["BT spray","Hand-pick AM","Row cover"]},"web":{p:"Spider Mites",c:85,a:["Blast undersides 2-3d","Soap evening","Predatory mites"]},"stick":{p:"Aphids",c:79,a:["Water blast","Ladybugs dusk","Control ants"]},"powder":{p:"Powdery Mildew",c:88,a:["Potassium bicarb weekly","Remove leaves","Improve airflow"]},"brown":{p:"Bacterial Spot",c:61,a:["Remove leaves","Switch to drip","Copper spray"]},"wilt":{p:"Root Stress",c:65,a:["Deep soak now","Check 4in depth","Add mulch"]}};

// ─── BED SHAPES (Priority 2 - now with circular) ───
var SHAPES=[{id:"rect",n:"2\u00D78 Rectangle",w:8,h:2,round:false},{id:"square",n:"4\u00D74 Square",w:4,h:4,round:false},{id:"circle",n:"Round Vego",w:4,h:4,round:true},{id:"wide",n:"4\u00D72 Wide",w:4,h:2,round:false},{id:"long",n:"1\u00D78 Narrow",w:8,h:1,round:false},{id:"large",n:"3\u00D76 Large",w:6,h:3,round:false},{id:"container",n:"Container",w:3,h:3,round:false},{id:"mega",n:"2\u00D710 Long",w:10,h:2,round:false}];

// ─── PLANT PALETTE for bed planner ───
var PP=[{e:"\u{1F345}",n:"Tomato",s:4},{e:"\u{1F336}",n:"Pepper",s:2},{e:"\u{1F952}",n:"Zucchini",s:4},{e:"\u{1F96C}",n:"Lettuce",s:1},{e:"\u{1F957}",n:"Kale",s:2},{e:"\u{1F955}",n:"Carrot",s:1},{e:"\u{1F33F}",n:"Basil",s:1},{e:"\u{1F353}",n:"Strawberry",s:1},{e:"\u{1F33C}",n:"Marigold",s:1},{e:"\u{1F9E1}",n:"Nasturtium",s:1},{e:"\u{1F7E3}",n:"Beet",s:1},{e:"\u{1F534}",n:"Radish",s:1},{e:"\u{1F346}",n:"Eggplant",s:4},{e:"\u{1F952}",n:"Cucumber",s:2},{e:"\u{1F33F}",n:"Cilantro",s:1},{e:"\u{1F9C5}",n:"Onion",s:1},{e:"\u{1F33F}",n:"Dill",s:1},{e:"\u{1F96C}",n:"Spinach",s:1},{e:"\u{1F33F}",n:"Arugula",s:1},{e:"\u{1F308}",n:"Chard",s:1},{e:"\u{1F33F}",n:"Thyme",s:1},{e:"\u{1F33B}",n:"Sunflower",s:4},{e:"\u{1F9C4}",n:"Garlic",s:1}];

// ─── IRRIGATION CONTROLLERS (Priority 3) ───
var CONTROLLERS=[
{id:"rachio",n:"Rachio",e:"\u{1F4A7}",desc:"Smart Sprinkler Controller",zones:8,wifi:true},
{id:"bhyve",n:"Orbit B-hyve",e:"\u{1F4A6}",desc:"WiFi Timer & Controller",zones:8,wifi:true},
{id:"rainmachine",n:"RainMachine",e:"\u{1F327}\uFE0F",desc:"Forecast Sprinkler Controller",zones:12,wifi:true},
{id:"opensprinkler",n:"OpenSprinkler",e:"\u{1F6B0}",desc:"Open-Source Controller",zones:16,wifi:true},
{id:"netro",n:"Netro",e:"\u{1F33F}",desc:"Smart Whisperer",zones:6,wifi:true},
];

function daysUntil(plantedISO, dth) {
  if (!plantedISO || !dth) return null;
  var planted = new Date(plantedISO).getTime();
  var ready = planted + dth*24*60*60*1000;
  var now = Date.now();
  return Math.ceil((ready - now)/(24*60*60*1000));
}
function fmtDate(iso){var d=new Date(iso);return MO[d.getMonth()]+" "+d.getDate()}

export default function Grove(){
  var st=function(i){return useState(i)};
  var _t=st("home"),tab=_t[0],setTab=_t[1];
  var _tk=st(TASKS),tasks=_tk[0],setTasks=_tk[1];
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
  var _beds=st(function(){
    var arr=[];
    for(var i=0;i<14;i++){
      arr.push({id:i,name:"Bed "+(i+1),shape:i===13?"circle":"rect",sun:i<9?"full":"shade",grid:Array(20).fill(null),ph:[]});
    }
    return arr;
  }),beds=_beds[0],setBeds=_beds[1];
  var _eb=st(null),eB=_eb[0],setEB=_eb[1];
  var _pal=st(null),pal=_pal[0],setPal=_pal[1];
  var _bsub=st("plants"),bSub=_bsub[0],setBSub=_bsub[1]; // bed detail: 'plants'|'ph'
  var _addBed=st(false),addBed=_addBed[0],setAddBed=_addBed[1];
  var _newShape=st("rect"),newShape=_newShape[0],setNewShape=_newShape[1];
  // My plants / calendar (Priority 1)
  var _myp=st([]),myPlants=_myp[0],setMyPlants=_myp[1];
  var _ap=st(false),addPlant=_ap[0],setAddPlant=_ap[1];
  var _apn=st(""),apName=_apn[0],setApName=_apn[1];
  var _apb=st("Bed 1"),apBed=_apb[0],setApBed=_apb[1];
  var _apd=st(60),apDth=_apd[0],setApDth=_apd[1];
  // Irrigation (Priority 3)
  var _ctrl=st(null),controller=_ctrl[0],setController=_ctrl[1]; // null or {id,zones:[]}
  var _icon=st(false),iConnect=_icon[0],setIConnect=_icon[1];

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

  return <div style={{background:G.bg0,color:G.t1,fontFamily:"-apple-system,Inter,system-ui,sans-serif",minHeight:"100vh",maxWidth:430,margin:"0 auto"}}>
    <div style={{padding:"11px 16px 9px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+G.ln}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}><Leaf size={24}/><span style={{fontSize:16,fontWeight:700}}>grove</span></div>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:9,color:G.s2,fontWeight:600,border:"1px solid "+G.s2+"44",borderRadius:99,padding:"2px 8px"}}>9B</span>{wx&&wx.current.t!==null&&<><span style={{fontSize:13}}>{wx.current.i}</span><span style={{fontSize:12,fontWeight:600}}>{wx.current.t+"\u00B0"}</span></>}</div>
    </div>

    <div style={{padding:"12px 14px 92px",overflow:"auto"}}>

    {tab==="home"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,paddingTop:4}}>
        <Ring score={score}/>
        <div><div style={{color:G.c2,fontSize:22,fontWeight:700}}>0</div><div style={{color:G.t4,fontSize:9}}>DAY STREAK</div><div style={{color:G.s3,fontSize:12,fontWeight:600,marginTop:4}}>{score>=80?"Thriving":"Good"}</div></div>
      </div>
      <div style={{display:"flex",gap:6}}>{[{l:"Water",i:"\u{1F4A7}"},{l:"Feed",i:"\u{1F33F}"},{l:"pH",i:"\u{1F9EA}"},{l:"Harvest",i:"\u{1F345}"}].map(function(b,i){return <Card key={i} style={{flex:1,textAlign:"center",padding:"8px 4px",borderColor:G.f2+"33"}}><div style={{fontSize:16}}>{b.i}</div><div style={{color:G.t3,fontSize:9,marginTop:2}}>{b.l}</div></Card>})}</div>
      {/* Harvest reminders on home (Priority 1) */}
      {(function(){var ready=myPlants.map(function(p){return Object.assign({},p,{du:daysUntil(p.planted,p.dth)})}).filter(function(p){return p.du!==null&&p.du<=14}).sort(function(a,b){return a.du-b.du});if(!ready.length)return null;return <Card style={{borderColor:G.s3+"33",background:G.s3+"08",padding:11}}><div style={{color:G.s3,fontSize:11,fontWeight:600,marginBottom:6}}>{"\u{1F33E} Harvest Soon"}</div>{ready.slice(0,3).map(function(p,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:i<Math.min(2,ready.length-1)?5:0}}><span style={{fontSize:11,color:G.t2}}>{p.e+" "+p.name}</span><span style={{fontSize:10,fontWeight:600,color:p.du<=0?G.c2:G.s3}}>{p.du<=0?"READY NOW":"in "+p.du+"d"}</span></div>})}</Card>})()}
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
      <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>Today</span><span style={{color:G.t4,fontSize:10}}>{tasks.filter(function(t){return t.d}).length}/{tasks.length}</span></div>
      {tasks.length===0?<Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11}}>No tasks yet. As you plant and log, Grove will build your daily to-do list here.</div></Card>:tasks.map(function(t){return <Card key={t.id} onClick={function(){setTasks(function(ts){return ts.map(function(x){return x.id===t.id?Object.assign({},x,{d:!x.d}):x})})}} style={{opacity:t.d?0.35:1,borderColor:t.d?G.ln:PC[t.p]+"33",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:4}}><div style={{width:18,height:18,borderRadius:99,border:"2px solid "+(t.d?G.s3:PC[t.p]),background:t.d?G.s3:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.d&&<span style={{color:G.bg0,fontSize:10,fontWeight:700}}>{"\u2713"}</span>}</div><div><div style={{color:t.d?G.t4:G.t1,fontSize:11,textDecoration:t.d?"line-through":"none"}}>{t.c+" "+t.t}</div></div></Card>})}</div>
    </div>}

    {tab==="garden"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {eB!==null?(function(){var b=beds.find(function(x){return x.id===eB});if(!b)return null;var sh=getShape(b.shape);var cells=sh.w*sh.h;return <div>
        <button onClick={function(){setEB(null);setPal(null);setBSub("plants")}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:6}}>{"\u2190 All beds"}</button>
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
          <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{pal?"Tap cells for "+pal.e+" "+pal.n:"Select plant:"}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{PP.map(function(p,i){return <button key={i} onClick={function(){setPal(pal&&pal.n===p.n?null:p)}} style={{background:pal&&pal.n===p.n?G.c2+"18":"transparent",border:"1px solid "+(pal&&pal.n===p.n?G.c2+"55":G.ln),borderRadius:8,padding:"3px 7px",fontSize:10,color:G.t2,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:12}}>{p.e}</span>{p.n}</button>})}</div>
        </>}

        {bSub==="ph"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600}}>{b.name} pH Log</span><button onClick={function(){var ip=(6+Math.random()).toFixed(1);var rp=(5.7+Math.random()).toFixed(1);setBeds(beds.map(function(x){return x.id===b.id?Object.assign({},x,{ph:[{d:MO[new Date().getMonth()]+" "+new Date().getDate(),inp:parseFloat(ip),run:parseFloat(rp)}].concat(x.ph)}):x}))}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Reading</button></div>
          {b.ph.length===0?<Card style={{padding:14,textAlign:"center"}}><div style={{color:G.t3,fontSize:11}}>No readings yet. Tap "Add Reading" after you test this bed's runoff.</div></Card>:
          <Card>{b.ph.map(function(l,i){var ok=l.run>=5.8&&l.run<=6.8;return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:6,borderBottom:i<b.ph.length-1?"1px solid "+G.ln+"44":"none"}}><span style={{color:G.t3,fontSize:10}}>{l.d}</span><div style={{display:"flex",gap:12}}><span style={{fontSize:10,color:G.t2}}>{"In: "+l.inp}</span><span style={{fontSize:10,color:ok?G.s3:G.warn,fontWeight:600}}>{"Run: "+l.run}</span></div><span style={{fontSize:10}}>{ok?"\u2705":"\u26A0"}</span></div>})}</Card>}
          <Card style={{background:G.f2+"0A",padding:10}}><div style={{color:G.s2,fontSize:10,fontWeight:600}}>Target for this bed</div><div style={{color:G.t2,fontSize:10,lineHeight:1.5}}>Most veg 6.0-7.0. If you grow blueberries here, 4.5-5.5. SoCal tap is alkaline - acidify with 1 tsp vinegar/gal for acid-lovers.</div></Card>
        </div>}
      </div>})():<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:600}}>{beds.length+" Beds \u00B7 Pearl White"}</div>
          <button onClick={function(){setAddBed(true)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Add Bed</button>
        </div>
        {addBed&&<Card style={{borderColor:G.s3+"33"}}><div style={{fontSize:12,fontWeight:600,marginBottom:6}}>New Bed Shape</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{SHAPES.map(function(s){return <Chip key={s.id} on={newShape===s.id} color={G.s3} onClick={function(){setNewShape(s.id)}} sm>{(s.round?"\u2B55 ":"")+s.n}</Chip>})}</div><div style={{display:"flex",gap:6}}><button onClick={function(){var nid=Math.max.apply(null,beds.map(function(b){return b.id}))+1;setBeds(beds.concat([{id:nid,name:"Bed "+(beds.length+1),shape:newShape,sun:"full",grid:Array(20).fill(null),ph:[]}]));setAddBed(false)}} style={{background:G.s3,color:G.bg0,border:"none",borderRadius:10,padding:"8px 0",flex:1,fontSize:12,fontWeight:600,cursor:"pointer"}}>Add</button><button onClick={function(){setAddBed(false)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,padding:"8px 0",flex:1,fontSize:12,color:G.t3,cursor:"pointer"}}>Cancel</button></div></Card>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{beds.map(function(b){var f=b.grid.filter(Boolean).length;var sh=getShape(b.shape);var planted=[];b.grid.forEach(function(c){if(c&&planted.indexOf(c.e)<0)planted.push(c.e)});return <Card key={b.id} onClick={function(){setEB(b.id)}} style={{padding:"7px 9px"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600}}>{(sh.round?"\u2B55 ":"")+b.name}</span><span style={{fontSize:8,color:G.t4}}>{f?f+"/"+(sh.w*sh.h):"empty"}</span></div><div style={{fontSize:9,color:G.t3,marginTop:1}}>{sh.n.split(" ")[0]+" \u00B7 "+(b.sun==="full"?"\u2600":"\u26C5")}</div><div style={{marginTop:3,display:"flex",gap:2}}>{planted.map(function(e,j){return <span key={j} style={{fontSize:13}}>{e}</span>})}{b.ph.length>0&&<span style={{fontSize:9,color:G.warn,marginLeft:"auto"}}>{"\u{1F9EA}"}</span>}{!f&&!b.ph.length&&<span style={{fontSize:9,color:G.s2}}>+ tap to plan</span>}</div></Card>})}</div>
        <div style={{fontSize:12,fontWeight:600,marginTop:4}}>Trees & Containers</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{TREES.map(function(p){return <Card key={p.id} onClick={function(){setSel(p);setTab("library")}} style={{padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{p.e}</span><div><div style={{fontSize:10,fontWeight:500}}>{p.n.split(" ").slice(-1)[0]}</div><div style={{color:G.t4,fontSize:8}}>{p.cat}</div></div></Card>})}</div>
      </>}
    </div>}

    {tab==="library"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {sel?<div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={function(){setSel(null)}} style={{color:G.s3,fontSize:11,background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>{"\u2190 Back"}</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:34}}>{sel.e}</span><div><div style={{fontSize:15,fontWeight:700}}>{sel.n}</div><div style={{color:G.t3,fontSize:11}}>{(sel.bed||sel.cat)+(sel.stg?" \u00B7 "+sel.stg:"")}</div></div></div>
        {sel.chill!==undefined&&<Card style={{padding:10}}><div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}><div><div style={{color:G.s2,fontSize:9}}>CHILL HRS</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{sel.chill}</div></div><div><div style={{color:G.s2,fontSize:9}}>POLLINATION</div><div style={{color:G.t1,fontSize:11,fontWeight:600}}>{sel.pol}</div></div><div><div style={{color:G.s2,fontSize:9}}>SPACING</div><div style={{color:G.t1,fontSize:11,fontWeight:600}}>{sel.space}</div></div></div>{sel.harv&&<div style={{textAlign:"center",marginTop:8,paddingTop:8,borderTop:"1px solid "+G.ln+"44"}}><span style={{color:G.s3,fontSize:11,fontWeight:600}}>{"\u{1F33E} Harvest: "+sel.harv}</span></div>}</Card>}
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
          {filt.map(function(p){return <Card key={p.id} onClick={function(){setSel(p);setMed(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:3}}><span style={{fontSize:20}}>{p.e}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600}}>{p.n}</div><div style={{color:G.t4,fontSize:9}}>{p.bed||p.cat}</div><div style={{color:G.s1,fontSize:9,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.h[0]}</div></div><span style={{color:G.t4}}>{"\u203A"}</span></Card>})}
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
        {myPlants.map(function(p){return Object.assign({},p,{du:daysUntil(p.planted,p.dth)})}).sort(function(a,b){return (a.du===null?9999:a.du)-(b.du===null?9999:b.du)}).map(function(p){
          var pct=p.du===null?100:Math.max(0,Math.min(100,((p.dth-p.du)/p.dth)*100));
          var ready=p.du!==null&&p.du<=0;var soon=p.du!==null&&p.du<=14&&p.du>0;
          return <Card key={p.id} style={{padding:11,borderColor:ready?G.c2+"44":soon?G.s3+"33":G.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{p.e}</span><div><div style={{fontSize:12,fontWeight:600}}>{p.name}</div><div style={{color:G.t4,fontSize:9}}>{p.bed+" \u00B7 planted "+fmtDate(p.planted)}</div></div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:ready?G.c2:soon?G.s3:G.t2}}>{p.du===null?"\u221E":ready?"READY":p.du+"d"}</div><div style={{color:G.t4,fontSize:8}}>{ready?"harvest now":p.du===null?"perennial":"to harvest"}</div></div>
            </div>
            <div style={{height:6,borderRadius:99,background:G.ln,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",borderRadius:99,background:ready?G.c2:G.s3,transition:"width .8s"}}/></div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}><button onClick={function(){setMyPlants(myPlants.filter(function(x){return x.id!==p.id}))}} style={{background:"none",border:"none",color:G.t4,fontSize:9,cursor:"pointer"}}>remove</button></div>
          </Card>
        })}
        {myPlants.length===0&&<Card style={{padding:16,textAlign:"center"}}><div style={{color:G.t3,fontSize:11}}>No plants tracked yet. Tap "+ Plant" to start your harvest timeline and get reminders.</div></Card>}
      </>:<>
        <div style={{fontSize:14,fontWeight:600}}>Zone 9b Calendar</div>
        <div style={{display:"flex",gap:3,overflow:"auto"}}>{MO.map(function(m,i){return <Chip key={i} on={calM===i+1} color={G.s3} onClick={function(){setCalM(i+1)}} sm>{m}</Chip>})}</div>
        <div style={{color:G.s3,fontSize:16,fontWeight:700,marginTop:2}}>{MO[calM-1]}</div>
        <div style={{color:G.t3,fontSize:10}}>{(calM>=3&&calM<=5?"Spring":calM>=6&&calM<=8?"Summer":calM>=9&&calM<=11?"Fall":"Winter")+" \u00B7 Zone 9b"}</div>
        <Card>{CAL[calM-1].i.map(function(x,i,a){return <div key={i} style={{color:G.t2,fontSize:12,lineHeight:1.8,borderBottom:i<a.length-1?"1px solid "+G.ln+"33":"none",paddingBottom:4,marginBottom:4}}>{x}</div>})}</Card>
      </>}
    </div>}

    {tab==="water"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{fontSize:14,fontWeight:600}}>Irrigation</div>
      {!controller?<>
        <Card style={{background:G.f2+"08",borderColor:G.f2+"22",padding:12,textAlign:"center"}}><div style={{fontSize:28}}>{"\u{1F4A7}"}</div><div style={{color:G.t1,fontSize:13,fontWeight:600,marginTop:4}}>Connect a Controller</div><div style={{color:G.t3,fontSize:11,marginTop:2,lineHeight:1.5}}>Grove waters by the weather - ET-based runtimes that skip the rain and adjust for heat.</div></Card>
        <div style={{fontSize:12,fontWeight:600,marginTop:2}}>Supported Controllers</div>
        {CONTROLLERS.map(function(c){return <Card key={c.id} onClick={function(){setController({id:c.id,name:c.n,zones:[{n:"Zone 1 (Beds 1-7)",time:"19:00",dur:22,on:true},{n:"Zone 2 (Beds 8-14)",time:"19:25",dur:18,on:true}]})}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px"}}><span style={{fontSize:22}}>{c.e}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{c.n}</div><div style={{color:G.t4,fontSize:9}}>{c.desc+" \u00B7 up to "+c.zones+" zones"}</div></div><span style={{color:G.s3,fontSize:11,fontWeight:600}}>Connect</span></Card>})}
      </>:<>
        <Card style={{borderColor:G.s3+"33",background:G.s3+"08",padding:11}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:G.s3,fontSize:12,fontWeight:600}}>{controller.name}</div><div style={{color:G.t3,fontSize:10}}>{controller.zones.length+" zones \u00B7 connected"}</div></div><div style={{background:G.s3+"22",borderRadius:99,padding:"3px 10px"}}><span style={{color:G.s3,fontSize:10,fontWeight:600}}>{"\u2022 Online"}</span></div></div></Card>
        <Card style={{padding:11}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:11,fontWeight:600,color:G.s2}}>{"\u{1F326}\uFE0F Weather-Smart"}</div><div style={{color:G.t2,fontSize:10,marginTop:2}}>Adjusts runtime to your local forecast.</div></div><div style={{textAlign:"right"}}><div style={{color:G.c2,fontSize:11,fontWeight:600}}>+15% runtime</div><div style={{color:G.t4,fontSize:9}}>heat adjust</div></div></div></Card>
        <div style={{fontSize:12,fontWeight:600,marginTop:2}}>Zones & Schedule</div>
        {controller.zones.map(function(z,i){return <Card key={i} style={{padding:11}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:12,fontWeight:600}}>{z.n}</div><button onClick={function(){setController(Object.assign({},controller,{zones:controller.zones.map(function(x,j){return j===i?Object.assign({},x,{on:!x.on}):x})}))}} style={{background:z.on?G.s3+"22":G.ln,border:"none",borderRadius:99,padding:"3px 10px",fontSize:9,fontWeight:600,color:z.on?G.s3:G.t3,cursor:"pointer"}}>{z.on?"ON":"OFF"}</button></div><div style={{display:"flex",gap:8}}><div style={{flex:1,background:G.bg0,borderRadius:8,padding:"6px 8px"}}><div style={{color:G.t3,fontSize:9}}>Start</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{z.time}</div></div><div style={{flex:1,background:G.bg0,borderRadius:8,padding:"6px 8px"}}><div style={{color:G.t3,fontSize:9}}>Runtime (ET-adj)</div><div style={{color:G.t1,fontSize:12,fontWeight:600}}>{Math.round(z.dur*1.15)+" min"}</div></div></div><button style={{background:G.f2+"22",border:"none",borderRadius:8,color:G.s3,fontSize:11,fontWeight:600,padding:"7px 0",width:"100%",marginTop:8,cursor:"pointer"}}>{"\u{1F4A7} Run Now"}</button></Card>})}
        <button onClick={function(){setController(null)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.t3,padding:"8px 0",fontSize:11,cursor:"pointer"}}>Disconnect Controller</button>
      </>}
    </div>}

    {tab==="coach"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:34,height:34,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center"}}><Leaf size={20}/></div><div><div style={{fontSize:14,fontWeight:600}}>grove coach</div><div style={{color:G.t4,fontSize:10}}>{"Zone 9b \u00B7 "+ALLPLANTS.length+" plants"}</div></div></div>
      {dM==="pick"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>Which plant?</div><select value={dP} onChange={function(e){setDP(e.target.value)}} style={Object.assign({},inp,{marginBottom:6})}><option value="">Select...</option>{ALLPLANTS.map(function(p){return <option key={p.id} value={p.n}>{p.n}</option>})}</select>{dP&&<button onClick={function(){setDM("sym")}} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Next</button>}</Card>}
      {dM==="sym"&&<Card style={{borderColor:G.c2+"33"}}><div style={{color:G.c2,fontSize:12,fontWeight:600,marginBottom:6}}>{dP}</div><div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:8}}>{SYM.map(function(s,i){return <Chip key={i} on={dS===s} color={G.c2} onClick={function(){setDS(s)}} sm>{s}</Chip>})}</div><label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,border:"2px dashed "+(dPh?G.s3:G.ln),borderRadius:10,cursor:"pointer",marginBottom:8,background:dPh?G.s3+"08":"transparent"}}>{dPh?<><span>{"\u2705"}</span><span style={{color:G.s3,fontSize:11}}>Photo added</span></>:<><span>{"\u{1F4F7}"}</span><span style={{color:G.t4,fontSize:11}}>Drop photo here</span></>}<input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0])setDPh(URL.createObjectURL(e.target.files[0]))}}/></label>{dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:10,maxHeight:120,objectFit:"cover",marginBottom:8}}/>}{dS&&<button onClick={diag} style={{background:G.c2,color:G.t1,border:"none",borderRadius:10,padding:8,width:"100%",fontSize:12,fontWeight:600,cursor:"pointer"}}>Analyze</button>}</Card>}
      {dM==="load"&&<Card style={{textAlign:"center",padding:24}}><div style={{fontSize:24}}>{"\u{1F50D}"}</div><div style={{color:G.s3,fontSize:12,fontWeight:600,marginTop:6}}>Analyzing...</div></Card>}
      {dM==="result"&&dR&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{dPh&&<img src={dPh} alt="" style={{width:"100%",borderRadius:12,maxHeight:110,objectFit:"cover"}}/>}<Card style={{borderColor:G.c2+"33"}}><div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{dR.p}</div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,borderRadius:99,background:G.ln,overflow:"hidden"}}><div style={{height:"100%",width:dR.c+"%",borderRadius:99,background:G.s3}}/></div><span style={{color:G.t2,fontSize:11,fontWeight:600}}>{dR.c+"%"}</span></div></Card><Card><div style={{color:G.s3,fontSize:11,fontWeight:600,marginBottom:5}}>Actions</div>{dR.a.map(function(a,i){return <div key={i} style={{color:G.t2,fontSize:11,marginBottom:5,paddingLeft:8,borderLeft:"2px solid "+G.s3+"33"}}>{(i+1)+". "+a}</div>})}</Card><button onClick={function(){setDM(null);setDP("");setDS("");setDR(null);setDPh(null)}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:7,fontSize:11,cursor:"pointer"}}>New diagnosis</button></div>}
      {!dM&&!cQ&&<div style={{display:"flex",flexDirection:"column",gap:5}}><Card onClick={function(){setDM("pick")}} style={{borderColor:G.c2+"33",background:G.c2+"06",display:"flex",alignItems:"center",gap:9,padding:"12px 13px"}}><span style={{fontSize:22}}>{"\u{1F4F7}"}</span><div><div style={{color:G.c2,fontSize:13,fontWeight:600}}>Diagnose a plant</div><div style={{color:G.t3,fontSize:10}}>Photo \u00B7 symptoms \u00B7 treatment</div></div></Card><div style={{color:G.t3,fontSize:11,marginTop:2}}>Or ask:</div>{Object.keys(COACH).map(function(q,i){return <Card key={i} onClick={function(){ask(q)}} style={{padding:"9px 11px",borderColor:G.f2+"22",display:"flex",alignItems:"center",gap:7}}><span style={{color:G.s3,fontSize:12}}>{"\u2192"}</span><span style={{fontSize:11}}>{q}</span></Card>})}</div>}
      {!dM&&cQ&&<><div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:G.f2,borderRadius:"13px 13px 3px 13px",padding:"7px 11px",fontSize:11,maxWidth:"82%"}}>{cQ}</div></div><div style={{display:"flex",gap:7,alignItems:"flex-start"}}><div style={{width:22,height:22,borderRadius:99,background:G.f2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Leaf size={14}/></div><div style={{background:G.bg1,border:"1px solid "+G.ln,borderRadius:"3px 13px 13px 13px",padding:"9px 11px",fontSize:11,color:G.t2,lineHeight:1.6,maxWidth:"85%"}}>{cTx}{typing&&<span style={{color:G.s3}}>{"\u2588"}</span>}</div></div>{!typing&&<button onClick={function(){setCQ(null);setCTx("")}} style={{background:"none",border:"1px solid "+G.ln,borderRadius:10,color:G.s3,padding:"5px 12px",fontSize:11,cursor:"pointer",alignSelf:"flex-start"}}>{"\u2190 New question"}</button>}</>}
    </div>}

    </div>

    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:G.bg0+"F2",backdropFilter:"blur(24px)",borderTop:"1px solid "+G.ln,display:"flex",justifyContent:"space-around",padding:"5px 0 16px"}}>
      {[{id:"home",l:"Home",i:"\u{1F3E1}"},{id:"garden",l:"Garden",i:"\u{1F331}"},{id:"library",l:"Library",i:"\u{1F4DA}"},{id:"calendar",l:"Cal",i:"\u{1F4C5}"},{id:"water",l:"Water",i:"\u{1F4A7}"},{id:"coach",l:"Coach",i:"\u{1F916}"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id);if(t.id!=="library"){setSel(null);setPestSel(null)}}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"3px 6px"}}><span style={{fontSize:16,filter:tab===t.id?"none":"grayscale(1) opacity(.35)"}}>{t.i}</span><span style={{fontSize:8,fontWeight:600,color:tab===t.id?G.s3:G.t4}}>{t.l}</span></button>})}
    </div>
  </div>;
}
