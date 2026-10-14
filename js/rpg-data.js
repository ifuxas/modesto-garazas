window.RPG_DATA = {
  version: 1,
  xp: { basePerLevel: 30, perLevel: 4, bossBonus: 90, sequenceBonus: 25, levelBase: 100, levelGrowth: 1.28 },
  reputationRanks: [
    { min: 0, name: 'Garažinis naujokas' }, { min: 100, name: 'Rajono meistras' },
    { min: 300, name: 'Mažeikių legenda' }, { min: 650, name: 'Dyzelistų siaubas' },
    { min: 1100, name: 'Perekūpų košmaras' }, { min: 1700, name: 'Meistras Modestas' }
  ],
  skillBranches: [
    { id:'mechanic', name:'🔧 Mechanika', skills:[
      {id:'steady_hand',name:'Tvirtesnė ranka',max:3,cost:1,desc:'+4% bazinės žalos už lygį'},
      {id:'rust_specialist',name:'Rūdžių specialistas',max:3,cost:1,requires:{steady_hand:1},desc:'+6% kaitinimo žalos už lygį'},
      {id:'torque_master',name:'Nm meistras',max:2,cost:2,requires:{rust_specialist:2},desc:'Žalia zona platesnė +5% už lygį'}]},
    { id:'diagnostics', name:'💻 Diagnostika', skills:[
      {id:'obd_student',name:'OBD mokinys',max:3,cost:1,desc:'Skenavimas +5% DMG už lygį'},
      {id:'can_shaman',name:'CAN-BUS šamanas',max:2,cost:2,requires:{obd_student:2},desc:'Klaidų trynimas kainuoja mažiau'},
      {id:'ecu_wizard',name:'ECU burtininkas',max:1,cost:3,requires:{can_shaman:2},desc:'+1 TA už kiekvieną skenavimą'}]},
    { id:'economy', name:'💶 Ekonomika', skills:[
      {id:'bargainer',name:'Derybininkas',max:3,cost:1,desc:'-4% parduotuvės kainoms už lygį'},
      {id:'scrapyard_network',name:'Šroto pažintys',max:2,cost:2,requires:{bargainer:2},desc:'+10% piniginių atlygių už lygį'},
      {id:'garage_magnate',name:'Garažo magnatas',max:1,cost:3,requires:{scrapyard_network:2},desc:'+100 € vienkartinė premija'}]}
  ],
  achievements: [
    {id:'first_repair',icon:'🔧',name:'Pirmas remontas',desc:'Užbaik pirmą lygį',test:'levelsCompleted',target:1,rewardXp:50},
    {id:'boss_hunter',icon:'👹',name:'Bosų medžiotojas',desc:'Įveik 5 bosus',test:'bossesDefeated',target:5,rewardXp:150},
    {id:'fortune_favorite',icon:'🎲',name:'Fortūnos favoritas',desc:'Išmesk D20 = 20',test:'rolledTwenty',target:1,rewardXp:100},
    {id:'vitalijus_vip',icon:'🤝',name:'Vitalijaus VIP',desc:'Atrakink nuolatinę nuolaidą',test:'discountUnlocked',target:1,rewardXp:80},
    {id:'diagnostician',icon:'💻',name:'Check Engine Whisperer',desc:'Atlik 25 OBD skenavimus',test:'obdScans',target:25,rewardXp:200},
    {id:'disease_cure',icon:'🩺',name:'Trys ligos',desc:'Išgydyk visas 3 modelio ligas',test:'diseasesCured',target:3,rewardXp:300},
    {id:'rich_mechanic',icon:'💶',name:'Garažo kasa',desc:'Sukaupk 1000 €',test:'moneyPeak',target:1000,rewardXp:150},
    {id:'campaign',icon:'🏆',name:'Žalias lipdukas',desc:'Užbaik 100 lygį',test:'levelsCompleted',target:100,rewardXp:1000}
,
    {id:'garage_family',name:'Garažo šeima',icon:'👑',desc:'Pasiek 100/100 Modesto pagarbą',test:'modestasRespect',target:100,rewardXp:300}
  ]
};