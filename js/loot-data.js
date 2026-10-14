window.LOOT_DATA = {
  rarity: {
    used:{label:'⚪ Naudota',weight:42}, aftermarket:{label:'🟢 Aftermarket',weight:28},
    oem:{label:'🔵 OEM',weight:18}, performance:{label:'🟣 Performance',weight:9}, legendary:{label:'🟠 Legendary',weight:3}
  },
  equipmentSlots:['primary','secondary','diagnostic','consumable','gear','lucky'],
  items:[
    {id:'socket10',type:'primary',name:'10 mm galvutė',desc:'Stebuklingai dar nepamesta.',effects:{dmg:2}},
    {id:'impact_pro',type:'secondary',name:'Smūginis veržliaraktis',desc:'Greitesnis darbas su užkepusiais varžtais.',effects:{dmg:4}},
    {id:'torque_pro',type:'primary',name:'Tikslus dinamometrinis raktas',desc:'Padeda sunkiausiose remonto kovose.',effects:{dmg:3}},
    {id:'obd_reader',type:'diagnostic',name:'OBD diagnostikos skaitytuvas',desc:'Papildoma diagnostikos premija.',effects:{scan:0.05}},
    {id:'scope',type:'diagnostic',name:'Automobilinis osciloskopas',desc:'Elektronikos gedimų medžioklei.',effects:{scan:0.08}},
    {id:'wd_crate',type:'consumable',name:'Chemijos dėžė',desc:'WD-40, valikliai ir tepimo priemonės.',effects:{hp:8}},
    {id:'hazet10',type:'lucky',name:'HAZET 10 mm „Nedingstanti“',desc:'Legenda sako, kad ši galvutė visada grįžta į dėžę.',legendary:true,effects:{dmg:10,crit:0.10}},
    {id:'master_scanner',type:'diagnostic',name:'Modesto Master Scanner',desc:'Legendinė diagnostikos stotelė.',legendary:true,effects:{scan:0.15,dmg:4}}
    ,{id:'gloves',type:'gear',name:'Würth mechaniko pirštinės',desc:'Patogesnis ir tikslesnis darbas.',effects:{dmg:2,hp:4}}
  ]
};