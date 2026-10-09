import { BoxGeometry, CatmullRomCurve3, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry, TubeGeometry, Vector3, type BufferGeometry } from "three";
import { baseHouseType, HOUSE_PROPORTIONS, type HouseType } from "./woning-types";

// A short, schematic explanation, built from local geometry rather than a downloaded asset.
/** `truckAfstand`: hoe ver de bus voor de gevel staat (de homepage-maquette heeft maar 2,6 m grond voor de woning). */
export function makeInsulationCrew(type:HouseType, truckAfstand=2.7) {
  const proportions=HOUSE_PROPORTIONS[type];
  type=baseHouseType(type);
  const crew=new Group(),truck=new Group(),worker=new Group();crew.name="Spouwploeg";
  const front=type==="vrijstaand"?4.75:3.95,ground=type==="vrijstaand"?-2.7:-2.6;
  const workX=type==="vrijstaand"?-1.98:-.87;
  const add=(parent:Group,geometry:BufferGeometry,color:string,x:number,y:number,z:number)=>{
    geometry.userData.owned=true;const mesh=new Mesh(geometry,new MeshStandardMaterial({color,roughness:.7}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  };
  truck.position.set(-2,ground,front+truckAfstand);
  add(truck,new BoxGeometry(1.7,.8,.85),"#e4ecde",0,.75,0);
  add(truck,new BoxGeometry(.55,.66,.85),"#237051",1.12,.68,0);
  add(truck,new BoxGeometry(.3,.28,.87),"#94c3cb",1.15,.92,0);
  add(truck,new BoxGeometry(.72,.3,.87),"#2d8b67",-.1,.8,0);
  for(const x of [-.55,1.05])for(const z of [-.44,.44]){
    const wheel=add(truck,new CylinderGeometry(.22,.22,.12,14),"#29352e",x,.25,z);wheel.rotation.x=Math.PI/2;
  }
  worker.position.set(workX-.16,ground,front+.85);
  add(worker,new BoxGeometry(.3,.5,.2),"#efba38",0,.98,0);
  add(worker,new SphereGeometry(.14,12,8),"#d7a87c",0,1.4,0);
  add(worker,new SphereGeometry(.16,12,8,0,Math.PI*2,0,Math.PI/2),"#f5ce53",0,1.48,0);
  for(const x of [-.095,.095])add(worker,new BoxGeometry(.105,.55,.12),"#234a3a",x,.45,0);
  const arm=add(worker,new BoxGeometry(.09,.4,.09),"#efba38",.14,1.05,-.18);arm.rotation.x=Math.PI/3;
  const hose=new CatmullRomCurve3([new Vector3(-2,ground+.4,front+truckAfstand),new Vector3(-1.1,ground+.12,front+truckAfstand-1),new Vector3(workX,ground+1.1,front+.65),new Vector3(workX,ground+1.18,front+.12)]);
  const pipe=add(crew,new TubeGeometry(hose,24,.035,6,false),"#343c35",0,0,0);
  const particles=new Group();particles.position.set(workX,ground+1.18,front);
  for(let i=0;i<14;i++)add(particles,new SphereGeometry(.035,6,4),"#f6d66b",(i%3-.8)*.055,Math.floor(i/3)*.045,.1+(i%4)*.08);
  crew.add(truck,worker,particles);crew.visible=false;crew.scale.set(...proportions);
  return { crew,truck,worker,pipe,particles,truckX:truck.position.x,workerZ:worker.position.z };
}
