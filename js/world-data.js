window.WORLD_DATA = {
  difficulties: {
    easy:{name:'🟢 Sklypo meistras',desc:'+25% HP atsarga, +100 € pradžioje',startMoney:100,bossHp:0.85,bossDmg:0.85,shop:0.90,loot:0},
    normal:{name:'🟡 Garažinis',desc:'Subalansuotas klasikinis režimas',startMoney:0,bossHp:1,bossDmg:1,shop:1,loot:0},
    nightmare:{name:'🔴 Perekūpo košmaras',desc:'Boss HP +30%, prekės +15%, geresnis loot',startMoney:0,bossHp:1.30,bossDmg:1.15,shop:1.15,loot:8},
    hardcore:{name:'💀 Mažeikių Hardcore',desc:'0 HP arba 0 Nervų reiškia kampanijos pabaigą',startMoney:-75,bossHp:1.45,bossDmg:1.30,shop:1.20,loot:14,hardcore:true}
  },
  carPassives: {
    audi:{name:'Quattro metodika',desc:'+5% DMG ir +5% diagnostikos',dmg:.05,scan:.05},
    opel:{name:'Biudžetinis darbininkas',desc:'Parduotuvė 6% pigesnė',shop:-.06},
    peugeot508:{name:'Prancūziška elektronika',desc:'+10% diagnostikos, -5 Nervai per elektros eventą',scan:.10,eventNerves:-5},
    bmw5gt:{name:'Gran Turismo svoris',desc:'+8% DMG, boss daro +5% žalos',dmg:.08,bossTaken:.05},
    jeep:{name:'Amerikoniškas metodas',desc:'+15% DMG, detalės 10% brangesnės',dmg:.15,shop:.10},
    bmw7:{name:'Direktoriaus rezervas',desc:'+75 € pradžioje, +5% DMG',startMoney:75,dmg:.05},
    mazda3:{name:'SkyActiv efektyvumas',desc:'+8% TA atlygių',taReward:.08},
    bmw:{name:'Bavarijos inžinerija',desc:'+10% DMG, elektros įvykiai sunkesni',dmg:.10,eventNerves:-4},
    vw:{name:'Liaudies detalės',desc:'Parduotuvė 8% pigesnė',shop:-.08},
    volvo:{name:'Švediškas saugumas',desc:'Gaunama 12% mažiau Tech HP žalos',damageTaken:-.12},
    toyota:{name:'Nesugadinamas',desc:'Gaunama 20% mažiau Tech HP žalos, -5% DMG',damageTaken:-.20,dmg:-.05},
    mb:{name:'Taksisto milijonierius',desc:'Gydymas ir maistas atstato 20% daugiau',heal:.20}
  },
  events: [
    {id:'socket',title:'🔩 Dingo 10 mm galvutė',text:'Modesto išvertė tris įrankių dėžes, bet garsioji galvutė vėl prapuolė.',choices:[
      {label:'Pirkti naują',money:-15,rep:2},{label:'Ieškoti po automobiliu',roll:true,success:{money:10,rep:5},fail:{nerves:-8}},{label:'Skambinti Vitalijui',money:-5,rep:3}]},
    {id:'battery',title:'🔋 Per naktį išsikrovė akumuliatorius',text:'Ryte starteris tik spragteli, o skydelis vos mirksi.',choices:[
      {label:'Pirkti naują akumuliatorių',money:-55,hp:12,rep:5},{label:'Užvesti laidais',roll:true,success:{hp:5,rep:3},fail:{hp:-8,nerves:-5}},{label:'Įkrauti garaže',money:-10,nerves:5}]},
    {id:'cat',title:'🐈 Svečias po kapotu',text:'Po variklio apsauga pasigirdo krebždesys. Remontą reikia trumpam sustabdyti.',choices:[
      {label:'Atsargiai išvilioti',nerves:8,rep:4},{label:'Palikti ramybėje ir gerti kavą',money:-5,nerves:12},{label:'Bandymas su D20',roll:true,success:{rep:8,money:10},fail:{nerves:-6}}]},
    {id:'power',title:'⚡ Garaže dingo elektra',text:'Keltuvas sustojo, diagnostikos ekranas užgeso.',choices:[
      {label:'Nuomoti generatorių',money:-25,hp:8},{label:'Taisyti skydą su D20',roll:true,success:{money:20,rep:10},fail:{hp:-10,nerves:-8}},{label:'Baigti darbą rankomis',nerves:-6,rep:5}]},
    {id:'police',title:'🚔 Test-drive patikra',text:'Bandomojo važiavimo metu reikia pagrįsti, kodėl automobilis dar be galiojančios TA.',choices:[
      {label:'Ramiai paaiškinti remontą',rep:6},{label:'Rodyti diagnostikos ataskaitą',requires:'diagnostic',rep:12},{label:'D20 derybos',roll:true,success:{rep:15},fail:{money:-20,nerves:-5}}]},
    {id:'vitalijus',title:'📞 Vitalijaus pasiūlymas',text:'Vitalijus turi „beveik naują“ detalę, bet sprendimą reikia priimti dabar.',choices:[
      {label:'Pirkti dėžę',money:-30,loot:true},{label:'Derėtis su D20',roll:true,success:{loot:true,rep:8},fail:{money:-15}},{label:'Mandagiai atsisakyti',rep:2}]}
  ]
};
