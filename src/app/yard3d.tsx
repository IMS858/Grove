"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

type YardItem = { id:number; kind:string; label:string; x:number; y:number; w:number; h:number; e:string; rot?:number }
type Props = { yard: YardItem[]; timeOfDay?: number; season?: string; selectedId?: number|null; onSelect?: (id:number|null)=>void; onMove?: (id:number,x:number,y:number)=>void }

// ── Time-of-day lighting profiles (hour 0-24 interpolated) ──
// Each keyframe: sky top, sky horizon, sun color, sun intensity, ambient color, ambient intensity, sun elevation(0-1)
var SKY_KEYS = [
  { h:0,  top:0x05070d, hor:0x0a1018, sun:0x3a4a6a, si:0.15, amb:0x1a2233, ai:0.35, elev:-0.2 }, // midnight
  { h:5,  top:0x1a1d33, hor:0x4a3a4a, sun:0x6a5a7a, si:0.3,  amb:0x2a2a3a, ai:0.4,  elev:0.02 }, // pre-dawn
  { h:7,  top:0x3a5a8a, hor:0xe8a868, sun:0xffb86a, si:0.9,  amb:0x6a6a5a, ai:0.55, elev:0.18 }, // sunrise
  { h:10, top:0x5a8ac8, hor:0x9ac0e0, sun:0xfff4e0, si:1.25, amb:0xb8c4b0, ai:0.6,  elev:0.55 }, // morning
  { h:13, top:0x4a8ad8, hor:0xaad0ee, sun:0xffffff, si:1.45, amb:0xc4d0c0, ai:0.65, elev:0.85 }, // noon
  { h:16, top:0x5a8ac8, hor:0x9ac0e0, sun:0xfff0d8, si:1.25, amb:0xb8c4b0, ai:0.6,  elev:0.55 }, // afternoon
  { h:18.5,top:0x4a5a9a, hor:0xf08850, sun:0xff9850, si:0.95, amb:0x8a7a6a, ai:0.5,  elev:0.16 }, // sunset
  { h:20, top:0x2a2d4a, hor:0x6a4a5a, sun:0x7a6a8a, si:0.35, amb:0x3a3a4a, ai:0.42, elev:0.03 }, // dusk
  { h:24, top:0x05070d, hor:0x0a1018, sun:0x3a4a6a, si:0.15, amb:0x1a2233, ai:0.35, elev:-0.2 }, // midnight
]

function lerpHex(a:number, b:number, t:number){
  var ar=(a>>16)&255, ag=(a>>8)&255, ab=a&255
  var br=(b>>16)&255, bg=(b>>8)&255, bb=b&255
  return (Math.round(ar+(br-ar)*t)<<16)|(Math.round(ag+(bg-ag)*t)<<8)|Math.round(ab+(bb-ab)*t)
}
function skyAt(hour:number){
  var k=SKY_KEYS
  for(var i=0;i<k.length-1;i++){
    if(hour>=k[i].h && hour<=k[i+1].h){
      var t=(hour-k[i].h)/(k[i+1].h-k[i].h)
      return {
        top:lerpHex(k[i].top,k[i+1].top,t), hor:lerpHex(k[i].hor,k[i+1].hor,t),
        sun:lerpHex(k[i].sun,k[i+1].sun,t), si:k[i].si+(k[i+1].si-k[i].si)*t,
        amb:lerpHex(k[i].amb,k[i+1].amb,t), ai:k[i].ai+(k[i+1].ai-k[i].ai)*t,
        elev:k[i].elev+(k[i+1].elev-k[i].elev)*t,
      }
    }
  }
  return {top:k[0].top,hor:k[0].hor,sun:k[0].sun,si:k[0].si,amb:k[0].amb,ai:k[0].ai,elev:k[0].elev}
}

// ── Seasonal foliage profiles ──
var SEASONS:any = {
  Spring: { canopy:0x6ab06a, canopyAlt:0x84c878, plant:0x6abe7a, plantAlt:0x4a9a5a, density:0.82, bloom:true, bloomColor:0xf5b8d8, ground:0x35543a },
  Summer: { canopy:0x3d6b4a, canopyAlt:0x4a8550, plant:0x52a574, plantAlt:0x2d6a4f, density:0.88, bloom:false, bloomColor:0xffffff, ground:0x2d4a35 },
  Fall:   { canopy:0xc88838, canopyAlt:0xd85838, plant:0xb87838, plantAlt:0x9a6a30, density:0.6,  bloom:false, bloomColor:0xffffff, ground:0x3a3528 },
  Winter: { canopy:0x6a7a5a, canopyAlt:0x5a6a4a, plant:0x6a7a5a, plantAlt:0x4a5a3a, density:0.3,  bloom:false, bloomColor:0xffffff, ground:0x2a3028 },
}

var C = { soilTop:0x4a3525, bedMetal:0xd8e0dc, trunk:0x5c4033, citrus:0xff8c42, water:0x5b9bd9, structure:0x6a6a6a, compost:0x4a3525, path:0x8b7355 }

export default function Yard3D({ yard, timeOfDay, season, selectedId, onSelect, onMove }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const hourRef = useRef<number>(timeOfDay ?? 13)
  const seasonRef = useRef<string>(season ?? "Summer")
  const selectedRef = useRef<number|null>(selectedId ?? null)
  const onSelectRef = useRef(onSelect)
  const onMoveRef = useRef(onMove)
  hourRef.current = timeOfDay ?? 13
  seasonRef.current = season ?? "Summer"
  selectedRef.current = selectedId ?? null
  onSelectRef.current = onSelect
  onMoveRef.current = onMove

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const W = mount.clientWidth
    const H = mount.clientHeight || 380
    const sky0 = skyAt(hourRef.current)
    const sea0 = SEASONS[seasonRef.current] || SEASONS.Summer

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(sky0.hor)
    scene.fog = new THREE.Fog(sky0.hor, 70, 145)

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    // ── Sky dome (gradient via vertex colors on an inverted sphere) ──
    const skyGeo = new THREE.SphereGeometry(250, 32, 16)
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { top: { value: new THREE.Color(sky0.top) }, bottom: { value: new THREE.Color(sky0.hor) } },
      vertexShader: "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float t = clamp((normalize(vP).y*0.5+0.5),0.0,1.0); gl_FragColor = vec4(mix(bottom, top, pow(t,0.8)), 1.0); }",
    })
    const skyDome = new THREE.Mesh(skyGeo, skyMat)
    scene.add(skyDome)

    // ── Environment map from the sky (PBR reflections) ──
    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    function refreshEnv() {
      const envScene = new THREE.Scene()
      const c = skyAt(hourRef.current)
      const g = new THREE.SphereGeometry(50, 16, 8)
      const m = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: { top: { value: new THREE.Color(c.top) }, bottom: { value: new THREE.Color(c.hor) } },
        vertexShader: "varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
        fragmentShader: "uniform vec3 top;uniform vec3 bottom;varying vec3 vP;void main(){float t=clamp(normalize(vP).y*0.5+0.5,0.0,1.0);gl_FragColor=vec4(mix(bottom,top,t),1.0);}",
      })
      envScene.add(new THREE.Mesh(g, m))
      const tex = pmrem.fromScene(envScene).texture
      scene.environment = tex
      g.dispose(); m.dispose()
    }
    refreshEnv()

    // ── Lights ──
    const amb = new THREE.AmbientLight(sky0.amb, sky0.ai)
    scene.add(amb)
    const hemi = new THREE.HemisphereLight(sky0.top, sea0.ground, 0.35)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight(sky0.sun, sky0.si)
    sun.castShadow = true
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 260
    sun.shadow.camera.left = -75; sun.shadow.camera.right = 75
    sun.shadow.camera.top = 75; sun.shadow.camera.bottom = -75
    sun.shadow.bias = -0.0004
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x95d5b2, 0.22)
    fill.position.set(-30, 20, -20)
    scene.add(fill)

    function positionSun(hour:number){
      const c = skyAt(hour)
      // sweep sun east→west across the day; elevation from profile
      const dayT = Math.max(0, Math.min(1, (hour - 5) / 13.5)) // 5am→6:30pm arc
      const az = Math.PI * (1 - dayT) // east(π) → west(0)
      const el = Math.max(0.02, c.elev)
      const R = 90
      sun.position.set(Math.cos(az) * R * 0.9, el * 95 + 4, Math.sin(az - Math.PI/2) * R * 0.5 - 25)
      sun.color.setHex(c.sun); sun.intensity = c.si
      amb.color.setHex(c.amb); amb.intensity = c.ai
      hemi.color.setHex(c.top)
    }

    // ── Coord mapping (yard 0-100 → world -50..50) ──
    const SCALE = 100
    const toWorld = (v:number) => (v/100)*SCALE - SCALE/2
    const toSize  = (v:number) => (v/100)*SCALE

    // ── Ground ──
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(SCALE+30, SCALE+30),
      new THREE.MeshStandardMaterial({ color: sea0.ground, roughness: 0.97, metalness: 0.0 })
    )
    ground.rotation.x = -Math.PI/2
    ground.receiveShadow = true
    scene.add(ground)

    const grid = new THREE.GridHelper(SCALE, 20, 0x243328, 0x1b2820)
    ;(grid.material as any).opacity = 0.3
    ;(grid.material as any).transparent = true
    grid.position.y = 0.05
    scene.add(grid)

    const backFence = new THREE.Mesh(
      new THREE.BoxGeometry(SCALE+12, 6, 1),
      new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: 0.92 })
    )
    backFence.position.set(0, 3, -SCALE/2 - 5)
    backFence.castShadow = true; backFence.receiveShadow = true
    scene.add(backFence)

    // Collect wind-swayable meshes
    const swayers: { mesh: THREE.Object3D; base: number; amp: number; off: number }[] = []

    function makeBed(it: YardItem) {
      const g = new THREE.Group()
      const w = toSize(it.w), d = toSize(it.h), bedH = 3
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, bedH, d),
        new THREE.MeshStandardMaterial({ color: C.bedMetal, roughness: 0.35, metalness: 0.55 }))
      wall.position.y = bedH/2; wall.castShadow = true; wall.receiveShadow = true
      g.add(wall)
      const soil = new THREE.Mesh(new THREE.BoxGeometry(w-0.6, 0.6, d-0.6),
        new THREE.MeshStandardMaterial({ color: C.soilTop, roughness: 1 }))
      soil.position.y = bedH - 0.1; g.add(soil)
      const sea = SEASONS[seasonRef.current] || SEASONS.Summer
      const cols = Math.max(2, Math.floor(w/2.2)), rows = Math.max(1, Math.floor(d/2.2))
      for (let i=0;i<cols;i++) for (let j=0;j<rows;j++){
        if (Math.random() > sea.density) continue
        const pc = Math.random()>0.5 ? sea.plant : sea.plantAlt
        const plant = new THREE.Mesh(
          new THREE.SphereGeometry(0.55 + Math.random()*0.45, 6, 5),
          new THREE.MeshStandardMaterial({ color: pc, roughness: 0.85, metalness: 0, flatShading: true })
        )
        plant.position.set(-w/2+1.3 + i*(w-2.6)/Math.max(1,cols-1), bedH+0.55, -d/2+1.3 + j*(d-2.6)/Math.max(1,rows-1))
        plant.scale.y = 1.35; plant.castShadow = true
        g.add(plant)
        swayers.push({ mesh: plant, base: plant.rotation.z, amp: 0.04+Math.random()*0.05, off: Math.random()*6.28 })
        // spring bloom dots
        if (sea.bloom && Math.random()>0.55){
          const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.22,5,4),
            new THREE.MeshStandardMaterial({ color: sea.bloomColor, roughness:0.5, emissive: sea.bloomColor, emissiveIntensity:0.15 }))
          bloom.position.copy(plant.position); bloom.position.y += 0.7
          g.add(bloom)
        }
      }
      return g
    }

    function makeTree(it: YardItem, citrus: boolean) {
      const g = new THREE.Group()
      const size = toSize(it.w), h = size*0.95 + 4
      const sea = SEASONS[seasonRef.current] || SEASONS.Summer
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(size*0.09, size*0.13, h*0.5, 8),
        new THREE.MeshStandardMaterial({ color: C.trunk, roughness: 0.95, metalness: 0, flatShading: true }))
      trunk.position.y = h*0.25; trunk.castShadow = true
      g.add(trunk)
      const canopyGroup = new THREE.Group()
      const baseCol = citrus ? 0x4a8550 : sea.canopy
      const altCol = citrus ? 0x52a574 : sea.canopyAlt
      const clusters = [[0,h*0.55,0,size*0.55],[size*0.22,h*0.5,size*0.1,size*0.42],[-size*0.2,h*0.52,-size*0.15,size*0.44],[size*0.05,h*0.7,-size*0.05,size*0.4]]
      clusters.forEach((c,ci)=>{
        const ball = new THREE.Mesh(new THREE.SphereGeometry(c[3]*(sea.density<0.4?0.78:1), 8, 7),
          new THREE.MeshStandardMaterial({ color: ci%2?altCol:baseCol, roughness: 0.9, metalness: 0, flatShading: true }))
        ball.position.set(c[0], c[1], c[2]); ball.castShadow = true
        canopyGroup.add(ball)
      })
      g.add(canopyGroup)
      swayers.push({ mesh: canopyGroup, base: 0, amp: 0.018+Math.random()*0.015, off: Math.random()*6.28 })
      if (citrus){
        const fMat = new THREE.MeshStandardMaterial({ color: C.citrus, roughness:0.55, metalness:0, emissive: C.citrus, emissiveIntensity:0.12 })
        for (let i=0;i<8;i++){
          const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.5,6,5), fMat)
          const a=Math.random()*Math.PI*2, rr=size*0.4
          fruit.position.set(Math.cos(a)*rr, h*0.5+(Math.random()-0.5)*size*0.3, Math.sin(a)*rr)
          canopyGroup.add(fruit)
        }
      }
      // fall: a few fallen leaves on the ground
      if (seasonRef.current==="Fall"){
        for(let i=0;i<5;i++){
          const leaf=new THREE.Mesh(new THREE.CircleGeometry(0.4,5),
            new THREE.MeshStandardMaterial({color:i%2?0xc88838:0xd85838,roughness:0.9,side:THREE.DoubleSide}))
          leaf.rotation.x=-Math.PI/2; const a=Math.random()*6.28,rr=size*(0.4+Math.random()*0.4)
          leaf.position.set(Math.cos(a)*rr,0.1,Math.sin(a)*rr); g.add(leaf)
        }
      }
      return g
    }

    function makeBox(it: YardItem, color:number, height:number, rough=0.85, metal=0){
      const w=toSize(it.w), d=toSize(it.h)
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,height,d), new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,flatShading:true}))
      m.position.y=height/2; m.castShadow=true; m.receiveShadow=true; return m
    }
    function makeWater(it: YardItem){
      const g=new THREE.Group(); const r=toSize(it.w)*0.4
      const basin=new THREE.Mesh(new THREE.CylinderGeometry(r,r*0.9,1.5,18), new THREE.MeshStandardMaterial({color:0x4a4a4a,roughness:0.55,metalness:0.2}))
      basin.position.y=0.75; basin.castShadow=true; g.add(basin)
      const water=new THREE.Mesh(new THREE.CylinderGeometry(r*0.85,r*0.85,0.3,18), new THREE.MeshStandardMaterial({color:C.water,roughness:0.05,metalness:0.4,transparent:true,opacity:0.88,envMapIntensity:1.2}))
      water.position.y=1.4; g.add(water); return g
    }
    // Individual insertable plant - small leafy cluster with seasonal color
    function makePlant(it: YardItem){
      const g=new THREE.Group(); const s=toSize(it.w)
      const sea=SEASONS[seasonRef.current]||SEASONS.Summer
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(s*0.05,s*0.07,s*0.45,6), new THREE.MeshStandardMaterial({color:0x3a5a3a,roughness:0.9,flatShading:true}))
      stem.position.y=s*0.22; stem.castShadow=true; g.add(stem)
      const blobs=[[0,s*0.5,0,s*0.32],[s*0.16,s*0.42,s*0.08,s*0.24],[-s*0.14,s*0.44,-s*0.1,s*0.26]]
      blobs.forEach((b,bi)=>{
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(b[3],7,6), new THREE.MeshStandardMaterial({color:bi%2?sea.plant:sea.plantAlt,roughness:0.85,flatShading:true}))
        leaf.position.set(b[0],b[1],b[2]); leaf.scale.y=1.25; leaf.castShadow=true; g.add(leaf)
      })
      if(sea.bloom){
        const bloom=new THREE.Mesh(new THREE.SphereGeometry(s*0.1,5,4), new THREE.MeshStandardMaterial({color:sea.bloomColor,roughness:0.5,emissive:sea.bloomColor,emissiveIntensity:0.15}))
        bloom.position.y=s*0.68; g.add(bloom)
      }
      swayers.push({ mesh: g, base: 0, amp: 0.05, off: Math.random()*6.28 })
      return g
    }

    const objMap: {[id:number]: THREE.Object3D} = {}
    yard.forEach((it) => {
      let obj: THREE.Object3D | null = null
      if (it.kind==="bed") obj=makeBed(it)
      else if (it.kind==="tree") obj=makeTree(it,false)
      else if (it.kind==="citrus") obj=makeTree(it,true)
      else if (it.kind==="plant") obj=makePlant(it)
      else if (it.kind==="container") obj=makeBox(it,0x3d2b1a,4)
      else if (it.kind==="structure") obj=makeBox(it,C.structure,8,0.7,0.1)
      else if (it.kind==="compost") obj=makeBox(it,C.compost,3)
      else if (it.kind==="water") obj=makeWater(it)
      else if (it.kind==="path") obj=makeBox(it,C.path,0.3,0.95)
      else obj=makeBed(it)
      if (obj){
        obj.position.x = toWorld(it.x + it.w/2)
        obj.position.z = toWorld(it.y + it.h/2)
        if (it.rot) obj.rotation.y = -(it.rot*Math.PI)/180
        obj.userData = { yardId: it.id, w: it.w, h: it.h }
        obj.traverse(function(child){ child.userData.yardId = it.id })
        scene.add(obj)
        objMap[it.id] = obj
      }
    })
    // Selection ring (follows the selected object)
    const selRing = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.18, 40),
      new THREE.MeshBasicMaterial({ color: 0x95d5b2, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    )
    selRing.rotation.x = -Math.PI/2
    selRing.position.y = 0.12
    selRing.visible = false
    scene.add(selRing)

    // ── Camera orbit (custom spherical) ──
    let isDown=false, lastX=0, lastY=0
    let theta=0.5, phi=0.9, radius=88
    const target=new THREE.Vector3(0,2,0)
    function updateCam(){
      phi=Math.max(0.2,Math.min(1.45,phi)); radius=Math.max(35,Math.min(140,radius))
      camera.position.set(
        target.x+radius*Math.sin(phi)*Math.sin(theta),
        target.y+radius*Math.cos(phi),
        target.z+radius*Math.sin(phi)*Math.cos(theta))
      camera.lookAt(target)
    }
    updateCam()

    const el=renderer.domElement
    // ── Picking + drag-to-move ──
    const raycaster = new THREE.Raycaster()
    const groundPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0)
    let dragObj: THREE.Object3D | null = null
    let dragOff = new THREE.Vector3()
    const ndc = (x:number,y:number)=>{
      const r = el.getBoundingClientRect()
      return new THREE.Vector2(((x-r.left)/r.width)*2-1, -((y-r.top)/r.height)*2+1)
    }
    const pickAt = (x:number,y:number): THREE.Object3D|null => {
      raycaster.setFromCamera(ndc(x,y), camera)
      const hits = raycaster.intersectObjects(Object.values(objMap), true)
      if (!hits.length) return null
      let o: THREE.Object3D|null = hits[0].object
      while (o && !(o.userData && o.userData.yardId !== undefined && objMap[o.userData.yardId]===o)) o = o.parent
      return o
    }
    const planePoint = (x:number,y:number): THREE.Vector3|null => {
      raycaster.setFromCamera(ndc(x,y), camera)
      const p = new THREE.Vector3()
      return raycaster.ray.intersectPlane(groundPlane, p) ? p : null
    }
    const commitDrag = () => {
      if (!dragObj) return
      const it = dragObj.userData
      const nx = Math.max(0, Math.min(100-it.w, dragObj.position.x + 50 - it.w/2))
      const ny = Math.max(0, Math.min(100-it.h, dragObj.position.z + 50 - it.h/2))
      if (onMoveRef.current) onMoveRef.current(it.yardId, Math.round(nx*10)/10, Math.round(ny*10)/10)
      dragObj = null
    }
    const down=(x:number,y:number)=>{
      const hit = pickAt(x,y)
      if (hit){
        if (onSelectRef.current) onSelectRef.current(hit.userData.yardId)
        dragObj = hit
        const p = planePoint(x,y)
        if (p) dragOff.set(hit.position.x - p.x, 0, hit.position.z - p.z)
        else dragObj = null
      } else {
        if (onSelectRef.current) onSelectRef.current(null)
        isDown=true;lastX=x;lastY=y
      }
    }
    const move=(x:number,y:number)=>{
      if (dragObj){
        const p = planePoint(x,y)
        if (p){
          const it = dragObj.userData
          const minX=-50+it.w/2, maxX=50-it.w/2, minZ=-50+it.h/2, maxZ=50-it.h/2
          dragObj.position.x = Math.max(minX, Math.min(maxX, p.x + dragOff.x))
          dragObj.position.z = Math.max(minZ, Math.min(maxZ, p.z + dragOff.z))
        }
        return
      }
      if(!isDown)return; theta-=(x-lastX)*0.008; phi-=(y-lastY)*0.006; lastX=x;lastY=y; updateCam()
    }
    const up=()=>{ commitDrag(); isDown=false }
    const onMD=(e:MouseEvent)=>down(e.clientX,e.clientY)
    const onMM=(e:MouseEvent)=>move(e.clientX,e.clientY)
    const onMU=()=>up()
    const onWheel=(e:WheelEvent)=>{e.preventDefault();radius+=e.deltaY*0.05;updateCam()}
    const onTS=(e:TouchEvent)=>{ if(e.touches.length===1)down(e.touches[0].clientX,e.touches[0].clientY) }
    const onTM=(e:TouchEvent)=>{
      if(e.touches.length===1){e.preventDefault();move(e.touches[0].clientX,e.touches[0].clientY)}
      else if(e.touches.length===2){
        commitDrag()
        const dx=e.touches[0].clientX-e.touches[1].clientX, dy=e.touches[0].clientY-e.touches[1].clientY
        const dist=Math.sqrt(dx*dx+dy*dy)
        if((el as any)._lp){radius+=((el as any)._lp-dist)*0.15;updateCam()}
        ;(el as any)._lp=dist
      }
    }
    const onTE=()=>{up();(el as any)._lp=null}
    let userInteracted=false
    const mark=()=>{userInteracted=true}
    el.addEventListener("mousedown",onMD); el.addEventListener("mousedown",mark)
    window.addEventListener("mousemove",onMM); window.addEventListener("mouseup",onMU)
    el.addEventListener("wheel",onWheel,{passive:false})
    el.addEventListener("touchstart",onTS,{passive:false}); el.addEventListener("touchstart",mark)
    el.addEventListener("touchmove",onTM,{passive:false}); el.addEventListener("touchend",onTE)

    // ── Animation loop: sun, sky, wind ──
    let raf=0
    const clock=new THREE.Clock()
    let lastHour=-99, lastSeason=""
    function frame(){
      raf=requestAnimationFrame(frame)
      const t=clock.getElapsedTime()
      const hour=hourRef.current
      // update sky/sun only when hour changes meaningfully
      if(Math.abs(hour-lastHour)>0.05){
        const c=skyAt(hour)
        ;(skyMat.uniforms.top.value as THREE.Color).setHex(c.top)
        ;(skyMat.uniforms.bottom.value as THREE.Color).setHex(c.hor)
        ;(scene.background as THREE.Color).setHex(c.hor)
        ;(scene.fog as THREE.Fog).color.setHex(c.hor)
        positionSun(hour)
        refreshEnv()
        lastHour=hour
      }
      if(seasonRef.current!==lastSeason){ lastSeason=seasonRef.current /* meshes rebuilt on remount via key */ }
      // wind sway
      for(let i=0;i<swayers.length;i++){
        const s=swayers[i]
        s.mesh.rotation.z = s.base + Math.sin(t*1.1 + s.off)*s.amp
      }
      if(!userInteracted && !isDown && !dragObj){ theta+=0.0022; updateCam() }
      // selection ring follows selected object
      const sid = selectedRef.current
      if (sid !== null && sid !== undefined && objMap[sid]) {
        const so = objMap[sid]
        selRing.visible = true
        selRing.position.x = so.position.x
        selRing.position.z = so.position.z
        const rr = Math.max(so.userData.w, so.userData.h) * 0.62
        selRing.scale.set(rr, rr, 1)
      } else selRing.visible = false
      renderer.render(scene,camera)
    }
    frame()

    const onResize=()=>{ if(!mount)return; const nw=mount.clientWidth,nh=mount.clientHeight||380; camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh) }
    window.addEventListener("resize",onResize)

    return ()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener("resize",onResize)
      window.removeEventListener("mousemove",onMM); window.removeEventListener("mouseup",onMU)
      el.removeEventListener("mousedown",onMD); el.removeEventListener("wheel",onWheel)
      el.removeEventListener("touchstart",onTS); el.removeEventListener("touchmove",onTM); el.removeEventListener("touchend",onTE)
      pmrem.dispose(); renderer.dispose()
      if(el.parentNode) el.parentNode.removeChild(el)
    }
  }, [yard, season])  // rebuild scene when layout or season changes; time-of-day updates live via ref

  return <div ref={mountRef} style={{ width:"100%", height:380, borderRadius:16, overflow:"hidden", border:"1px solid #243328", touchAction:"none", cursor:"grab" }} />
}
