(function(){
  /* v19: RPG progression, reputation, achievements, inventory/rarity/condition, random events, car passives, difficulty, New Game+, save migration */
  /* ==========================================================================
     1. AUTOMOBILIŲ MODELIAI (12 VARIANTŲ), SPALVOS IR 5 VARIKLIŲ MODIFIKACIJOS
     ========================================================================== */
  var SAVE_KEY = 'modesto_garazas_save_v19';
  var LEGACY_SAVE_KEYS = ['modesto_garazas_save_v18','modesto_garazas_save_v17','modesto_garazas_save_v16','modesto_garazas_save_v15'];
  function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  var COLORS = [
    { name: 'Sidabrinė', hex: '#cbd5e1' },
    { name: 'Juoda', hex: '#1e293b' },
    { name: 'Tamsiai Mėlyna', hex: '#2563eb' },
    { name: 'Vyšninė', hex: '#dc2626' },
    { name: 'Oranžinė / Smėlio', hex: '#d97706' },
    { name: 'Smagražolės Žalia', hex: '#059669' },
    { name: 'Balta Perlamutrinė', hex: '#f8fafc' }
  ];

  var CARS = {
    audi: {
      name: 'Audi Q5', icon: '⭕', cls: '8R Quattro SUV', str: 15,
      ill: ['💨 EGR aušintuvas', '🛢️ Tepalo ašelė', '⚠️ S-Tronic blokas'],
      dtc: [
        { code: 'P0401', sys: 'Išmetimas / EGR', name: 'EGR aušintuvo sklendės užsikirtimas', desc: 'Suodžiais užkištas recirkuliacijos kanalas ir krentanti trauka.', lvl: 25 },
        { code: 'P164D', sys: 'Tepimo sistema', name: 'Tepalo siurblio šešiakampės ašelės dilimas', desc: 'Kritinis tepalo spaudimo nuokrypis sukilus sūkiams.', lvl: 60 },
        { code: 'P17D8', sys: 'S-Tronic / Elektronika', name: 'DL501 mechatronikos plokštės perkaitimas', desc: 'Smūgiai perjungiant iš 2 į 1 pavarą ir avarinis dėžės režimas.', lvl: 95 }
      ],
      mods: [
        { code: '2.0 TDI Common-Rail (105 kW)', desc: '2.0 l dyzelis • Ekonomiškas bazinis Quattro variantas', bonusTxt: '+55 € Biudžeto', dmg: 0, money: 55, ta: 0 },
        { code: '2.0 TDI Clean Diesel (130 kW)', desc: '2.0 l dyzelis • Optimalus galios ir remonto balansas', bonusTxt: '+2 DMG / +25 €', dmg: 2, money: 25, ta: 1 },
        { code: '2.0 TFSI Benzas (155 kW)', desc: '2.0 l benzinas • Švarus CO2 testas Tuvlitos stende', bonusTxt: '+3% TA Šanso', dmg: 1, money: 0, ta: 3 },
        { code: '3.0 TDI V6 Dyzelis (176 kW)', desc: '3.0 l dyzelis • 500 Nm sukimo momentas ant keltuvo', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.0 BiTDI SQ5 Dyzelis (230 kW)', desc: '3.0 l dyzelis • Dviguba turbina lupti surūdijusioms šakėms', bonusTxt: '+6 DMG / -20 €', dmg: 6, money: -20, ta: 1 }
      ]
    },
    opel: {
      name: 'Opel Astra', icon: '⚡', cls: 'J/K Hečbekas', str: 14,
      ill: ['💨 DPF slėgis', '🛢️ Siurblio žiedas', '⚠️ M32 guoliai'],
      dtc: [
        { code: 'P2452', sys: 'Išmetimas / DPF', name: 'DPF diferencinio slėgio daviklio gedimas', desc: 'Užsinešęs suodžių filtras ir sutrūkinėjusios slėgio žarnelės po dugnu.', lvl: 25 },
        { code: 'P0524', sys: 'Tepimo sistema', name: 'Sukietėjęs tepalo siurblio įsiurbimo žiedelis', desc: 'Šaltą rytą dega raudona tepalo lemputė — karteryje traukia orą.', lvl: 60 },
        { code: 'P0700', sys: 'Transmisija / ECU', name: 'M32 dėžės 6-os pavaros guolių ir CIM klaida', desc: 'Judanti pavarų svirtis atleidus gazą ir dingstantis pultelio ryšys.', lvl: 95 }
      ],
      mods: [
        { code: '1.4 Turbo Benzas (103 kW)', desc: '1.4 l benzinas • Greitai įšyla prieš dūmingumo patikrą', bonusTxt: '+3% TA Šanso', dmg: 1, money: 15, ta: 3 },
        { code: '1.6 CDTI Dyzelis (100 kW)', desc: '1.6 l dyzelis • Taupus variklis, lieka eurų detalėms', bonusTxt: '+55 € Biudžeto', dmg: 1, money: 55, ta: 0 },
        { code: '1.7 CDTI Isuzu Dyzelis (96 kW)', desc: '1.7 l dyzelis • Kantrus japoniškas blokas ir gera ištvermė', bonusTxt: '+2 DMG / +25 €', dmg: 2, money: 25, ta: 1 },
        { code: '2.0 CDTI BiTurbo Dyzelis (143 kW)', desc: '2.0 l dyzelis • 400 Nm trauka bet kokiam užrūdijusiam varžtui', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '2.0 Turbo OPC Benzas (206 kW)', desc: '2.0 l benzinas • Maksimali jėga kovoje su garažo bosais', bonusTxt: '+6 DMG / -20 €', dmg: 6, money: -20, ta: 1 }
      ]
    },
    peugeot508: {
      name: 'Peugeot 508', icon: '🦁', cls: 'W2 Verslo Sedanas', str: 14,
      ill: ['💨 AdBlue bakas', '🛢️ THP grandinė', '⚠️ BSI modulis'],
      dtc: [
        { code: 'P20E8', sys: 'SCR / Išmetimas', name: 'AdBlue karbamido siurblio žemas slėgis', desc: 'Deformuotas bakelis ir skydelyje skaičiuojami kilometrai iki užblokavimo.', lvl: 25 },
        { code: 'P0016', sys: 'Variklio fazės', name: 'Paskirstymo grandinės įtempiklio išsitampymas', desc: 'Šalto variklio metalinis barškėjimas ir fazių nesutapimas.', lvl: 60 },
        { code: 'U0140', sys: 'BSI / CAN-BUS', name: 'BSI komforto bloko ir valytuvų ryšio klaida', desc: 'Drėgmė po saugiklių bloku ir savaime įsijungiantys žibintai.', lvl: 95 }
      ],
      mods: [
        { code: '1.6 e-HDi Dyzelis (84 kW)', desc: '1.6 l dyzelis • Ypač mažos sąnaudos, papildomas biudžetas', bonusTxt: '+60 € Biudžeto', dmg: 0, money: 60, ta: 0 },
        { code: '1.6 THP Benzas (115 kW)', desc: '1.6 l benzinas • Jokių DPF suodžių per apžiūrą', bonusTxt: '+3% TA Šanso', dmg: 1, money: 10, ta: 3 },
        { code: '2.0 HDi Dyzelis (103 kW)', desc: '2.0 l dyzelis • Patikimas prancūziškas darbininkas', bonusTxt: '+2 DMG / +30 €', dmg: 2, money: 30, ta: 0 },
        { code: '2.0 BlueHDi Dyzelis (133 kW)', desc: '2.0 l dyzelis • Stiprus vidutinės klasės sukimo momentas', bonusTxt: '+3 DMG / +1% TA', dmg: 3, money: 0, ta: 1 },
        { code: '2.2 HDi GT Bi-Turbo Dyzelis (150 kW)', desc: '2.2 l dyzelis • 450 Nm GT flagmanas su dviguba išmetimo sistema', bonusTxt: '+5 DMG', dmg: 5, money: 0, ta: 0 }
      ]
    },
    bmw5gt: {
      name: 'BMW 5 GT', icon: '🐋', cls: 'F07 Gran Turismo', str: 16,
      ill: ['💨 Pniaumo pagalvės', '🛢️ N57 indėklai', '⚠️ FRM3 blokas'],
      dtc: [
        { code: 'C1A04', sys: 'Pniaumatika / DPF', name: 'Galinės pniaumo pagalvės ir kompresoriaus nuotėkis', desc: 'Po nakties nusėdęs galas ir užsikišęs DPF regeneracijos ciklas.', lvl: 25 },
        { code: 'P052B', sys: 'Tepimas / Indėklai', name: 'N57 alkūninio veleno indėklių ir grandinės dilimas', desc: 'Tepalo filtro korpuse matomos smulkios bronzinės drožlės.', lvl: 60 },
        { code: 'E584', sys: 'FRM3 / Elektronika', name: 'FRM3 šviesų ir berėmių langų bloko atminties klaida', desc: 'Atjungus akumuliatorių nustojo veikti posūkiai ir stiklų pakėlėjai.', lvl: 95 }
      ],
      mods: [
        { code: '2.0d 520d Dyzelis (135 kW)', desc: '2.0 l dyzelis • Ekonomiškas keturių cilindrų GT', bonusTxt: '+55 € Biudžeto', dmg: 0, money: 55, ta: 0 },
        { code: '3.0d 530d R6 Dyzelis (180 kW)', desc: '3.0 l dyzelis • Klasikinis 6 cilindrų sukimo momentas', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.0d 535d Bi-Turbo Dyzelis (220 kW)', desc: '3.0 l dyzelis • Dvi turbinos prieš bet kokią rūdį', bonusTxt: '+5 DMG', dmg: 5, money: -10, ta: 0 },
        { code: '3.0i 535i N55 Benzas (225 kW)', desc: '3.0 l benzinas • Švarus benzininis išmetimas Tuvlitoje', bonusTxt: '+3% TA Šanso', dmg: 2, money: 0, ta: 3 },
        { code: '4.4i 550i V8 Benzas (300 kW)', desc: '4.4 l benzinas • Žvėriška galia, bet brangus aptarnavimas', bonusTxt: '+7 DMG / -35 €', dmg: 7, money: -35, ta: 0 }
      ]
    },
    jeep: {
      name: 'Jeep Grand Cherokee', icon: '🦅', cls: 'WK2 Visureigis', str: 17,
      ill: ['💨 Quadra-Lift', '🛢️ Šilumokaitis', '⚠️ TIPM relė'],
      dtc: [
        { code: 'C2210', sys: 'Quadra-Lift / DPF', name: 'Azoto pniaumatikos vožtuvų bloko užšalimas', desc: 'Pakaba įstrigusi „Aero“ režime, o išmetime dega DPF klaida.', lvl: 25 },
        { code: 'P0520', sys: 'Tepimo aušinimas', name: 'V-duobės tepalo aušintuvo korpuso įtrūkimas', desc: 'Tepalas bėga per variklio galą tiesiai ant pavarų dėžės varpo.', lvl: 60 },
        { code: 'B210D', sys: 'TIPM / Elektronika', name: 'TIPM saugiklių bloko kuro siurblio relės degimas', desc: 'Starteris suka, bet siurblys nepaduoda kuro be išorinės perjungos.', lvl: 95 }
      ],
      mods: [
        { code: '3.0 CRD V6 Laredo Dyzelis (140 kW)', desc: '3.0 l dyzelis • Paprastesnė bazinė komplektacija', bonusTxt: '+55 € Biudžeto', dmg: 0, money: 55, ta: 0 },
        { code: '3.0 CRD V6 Overland Dyzelis (184 kW)', desc: '3.0 l dyzelis • Populiariausias 550 Nm dyzelis Lietuvoje', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.6 Pentastar V6 Benzas (210 kW)', desc: '3.6 l benzinas • Atmosferinis V6 be jokių suodžių filtrų', bonusTxt: '+3% TA Šanso', dmg: 2, money: 0, ta: 3 },
        { code: '5.7 HEMI V8 Benzas (259 kW)', desc: '5.7 l benzinas • Amerikietiškas V8 plaktukas sunkiam remontui', bonusTxt: '+5 DMG', dmg: 5, money: 0, ta: 0 },
        { code: '6.4 HEMI V8 SRT8 Benzas (344 kW)', desc: '6.4 l benzinas • Kosminė jėga kovoje su užkepusiais mazgais', bonusTxt: '+7 DMG / -30 €', dmg: 7, money: -30, ta: 1 }
      ]
    },
    bmw7: {
      name: 'BMW 730d (F01)', icon: '👑', cls: 'F01 Limuzinas', str: 17,
      ill: ['💨 Dynamic Drive', '🛢️ V8/R6 riebokšliai', '⚠️ KAFAS / CAS'],
      dtc: [
        { code: 'D354', sys: 'Dynamic Drive / DPF', name: 'Aktyvaus stabilizatoriaus vamzdelio ir DPF klaida', desc: 'Prarūdijęs aukšto slėgio kontūras ir viršytas suodžių kiekis.', lvl: 25 },
        { code: 'P0087', sys: 'Variklio tepimas', name: 'Tepalo filtro stovo tarpinių ir grandinės įtempimas', desc: 'Apsitepalavęs variklio priekis ir žemas slėgis laisva eiga.', lvl: 60 },
        { code: 'A0B4', sys: 'CAS / Komfortas', name: 'Soft-Close pritraukėjų ir komforto rankenėlių trumpinimas', desc: 'Viena rankenėlė „užmigdo“ visą CAN liniją ir iškrauna akumuliatorių.', lvl: 95 }
      ],
      mods: [
        { code: '3.0d 730d N57 Dyzelis (180 kW)', desc: '3.0 l dyzelis • Pats protingiausias „Semioro“ pasirinkimas', bonusTxt: '+50 € Biudžeto', dmg: 1, money: 50, ta: 0 },
        { code: '3.0d 740d TwinPower Dyzelis (225 kW)', desc: '3.0 l dyzelis • 600 Nm dviejų turbinų trauka', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.0d 750d Tri-Turbo Dyzelis (280 kW)', desc: '3.0 l dyzelis • Trys turbinos ir maksimalus sukimo momentas', bonusTxt: '+6 DMG / -20 €', dmg: 6, money: -20, ta: 0 },
        { code: '3.0i 740i R6 Benzas (240 kW)', desc: '3.0 l benzinas • Tylus darbas ir lengvas CO2 testas', bonusTxt: '+3% TA Šanso', dmg: 2, money: 0, ta: 3 },
        { code: '4.4i 750i V8 Benzas (300 kW)', desc: '4.4 l benzinas • Direktoriška V8 jėga garažo kovose', bonusTxt: '+5 DMG / +1% TA', dmg: 5, money: -10, ta: 1 }
      ]
    },
    mazda3: {
      name: 'Mazda 3', icon: '🐉', cls: 'BM/BN SkyActiv', str: 14,
      ill: ['💨 DPF praskiedimas', '🛢️ Purkštukų šaibos', '⚠️ i-ELOOP modulis'],
      dtc: [
        { code: 'P2463', sys: 'Išmetimas / DPF', name: 'SkyActiv-D DPF suodžių ir karterio tepalo lygio kilimas', desc: 'Dažnos regeneracijos praskiedė tepalą dyzelinu virš X žymos.', lvl: 25 },
        { code: 'P0524', sys: 'Tepimo sistema', name: 'Pradegusios purkštukų šaibos ir užsikimšęs tepalo sietelis', desc: 'Suodžiai karteryje užkimšo tepalo paėmimo grybuką.', lvl: 60 },
        { code: 'U0100', sys: 'i-ELOOP / Elektronika', name: 'i-ELOOP kondensatoriaus ir BSM radaro klaida', desc: 'Mirksi i-Stop lemputė, o aklosios zonos daviklis po bamperiu oksidavosi.', lvl: 95 }
      ],
      mods: [
        { code: '1.5 SkyActiv-G Benzas (74 kW)', desc: '1.5 l benzinas • Itin paprastas atmosferinis variklis, mažiausios išlaidos', bonusTxt: '+60 € Biudžeto', dmg: 0, money: 60, ta: 0 },
        { code: '2.0 SkyActiv-G Benzas (88 kW)', desc: '2.0 l benzinas • Švarus išmetimas ir patikima grandinė Tuvlitai', bonusTxt: '+3% TA Šanso', dmg: 1, money: 15, ta: 3 },
        { code: '2.0 SkyActiv-G High-Power (121 kW)', desc: '2.0 l benzinas • Aukšto suspaudimo 14:1 dinamiškas variklis', bonusTxt: '+2 DMG / +2% TA', dmg: 2, money: 0, ta: 2 },
        { code: '1.5 SkyActiv-D Dyzelis (77 kW)', desc: '1.5 l dyzelis • Ekonomiškas miesto dyzelis su greita trauka', bonusTxt: '+2 DMG / +35 €', dmg: 2, money: 35, ta: 0 },
        { code: '2.2 SkyActiv-D Bi-Turbo Dyzelis (110 kW)', desc: '2.2 l dyzelis • 380 Nm dviejų pakopų turbina užrūdijusiems varžtams', bonusTxt: '+4 DMG / +1% TA', dmg: 4, money: 0, ta: 1 }
      ]
    },
    bmw: {
      name: 'BMW E60', icon: '🔵', cls: '5 Serija („Slyva“)', str: 15,
      ill: ['💨 Įsiurbimo sklendės', '🛢️ N47/M57 grandinė', '⚠️ IBS / CCC blokas'],
      dtc: [
        { code: 'P14A7', sys: 'Išmetimas / DPF', name: 'Įsiurbimo kolektoriaus sūkurinių sklendžių ir DPF klaida', desc: 'Apsitepalavusios sklendžių ašelės ir užsikimšęs katalizatorius.', lvl: 25 },
        { code: 'P0011', sys: 'Tepimas / Grandinė', name: 'Vakuumo pompos ir grandinės įtempiklio nuotėkis', desc: 'Tepalas laša ant išmetimo kolektoriaus, girdimas grandinės šnaresys.', lvl: 60 },
        { code: 'E18F', sys: 'CCC / IBS linija', name: 'IBS minusinio klemo ir CCC multimedijos perkrovimas', desc: 'Ekranas mirksi su BMW logotipu, o generatorius krauna netolygiai.', lvl: 95 }
      ],
      mods: [
        { code: '2.0d 520d N47 Dyzelis (130 kW)', desc: '2.0 l dyzelis • Mažos kuro sąnaudos, lieka eurų šrotui', bonusTxt: '+55 € Biudžeto', dmg: 0, money: 55, ta: 0 },
        { code: '2.5d 525d M57 Dyzelis (145 kW)', desc: '2.5 l dyzelis • Šešių cilindrų klasika su gera atsarga', bonusTxt: '+2 DMG / +25 €', dmg: 2, money: 25, ta: 1 },
        { code: '2.5i 525i N52 Benzas (160 kW)', desc: '2.5 l benzinas • Atmosferinis R6 be dyzelinių suodžių', bonusTxt: '+3% TA Šanso', dmg: 1, money: 0, ta: 3 },
        { code: '3.0d 530d M57 Dyzelis (173 kW)', desc: '3.0 l dyzelis • Legendinis ketaus/aliuminio blokas (500 Nm)', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.0d 535d Bi-Turbo Dyzelis (210 kW)', desc: '3.0 l dyzelis • Dviguba turbina lupti bet kokiam varžtui', bonusTxt: '+6 DMG / -15 €', dmg: 6, money: -15, ta: 0 }
      ]
    },
    vw: {
      name: 'VW Passat B6', icon: '🛞', cls: '3C Universalas', str: 14,
      ill: ['💨 Įsiurbimo sklendė', '🛢️ Šešiakampis', '⚠️ El. rankinis'],
      dtc: [
        { code: 'P2015', sys: 'Įsiurbimas / DPF', name: 'Įsiurbimo kolektoriaus sklendės padėties klaida', desc: 'Išdilęs plastikinės kojelės ribotuvas ir užsidegusi spiralė.', lvl: 25 },
        { code: 'P1588', sys: 'Tepimo modulis', name: 'Balansyrinio veleno šešiakampio pieštuko prasisukimas', desc: 'Nusidėvėjusios briaunos — dar 100 km ir turbina liks be tepalo.', lvl: 60 },
        { code: '02432', sys: 'EPB / Elektronika', name: 'Elektrinio rankinio stabdžio suporto varikliuko trūkis', desc: 'Suskilinėjęs suporto korpusas ir mirksinti P raidė prietaisų skydelyje.', lvl: 95 }
      ],
      mods: [
        { code: '1.9 TDI BXE Dyzelis (77 kW)', desc: '1.9 l dyzelis • Paprastas ir pigiai remontuojamas variklis', bonusTxt: '+60 € Biudžeto', dmg: 0, money: 60, ta: 0 },
        { code: '1.4 TSI EcoFuel Benzas (110 kW)', desc: '1.4 l benzinas • Švarus išmetimas per techninę apžiūrą', bonusTxt: '+3% TA Šanso', dmg: 1, money: 10, ta: 3 },
        { code: '2.0 TDI CBAB Dyzelis (103 kW)', desc: '2.0 l dyzelis • Tylus darbas ir patikimi pjezo purkštukai', bonusTxt: '+2 DMG / +30 €', dmg: 2, money: 30, ta: 0 },
        { code: '2.0 TDI BMR Dyzelis (125 kW)', desc: '2.0 l dyzelis • 350 Nm sukimo momentas greitam remontui', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.2 V6 FSI 4Motion Benzas (184 kW)', desc: '3.2 l benzinas • VR6 garsas ir galingas veržliarakčio smūgis', bonusTxt: '+5 DMG / +1% TA', dmg: 5, money: -10, ta: 1 }
      ]
    },
    volvo: {
      name: 'Volvo XC60', icon: '🛡️', cls: 'Y20 AWD Krosas', str: 16,
      ill: ['💨 Sūkurinės sklendės', '🛢️ Haldex / Diržas', '⚠️ CEM modulis'],
      dtc: [
        { code: 'P2009', sys: 'Išmetimas / Swirl', name: 'Sūkurinių sklendžių traukutės ir DPF suodžių klaida', desc: 'Nukritusi plastikinė traukutė ir tepaluotas vožtuvų dangtelis.', lvl: 25 },
        { code: 'P0089', sys: 'Mechanika / Tepimas', name: 'Generatoriaus dirželio įtempiklio ir Haldex siurblio klaida', desc: 'Pavojus, kad nutrūkęs generatoriaus dirželis palįs po pagrindiniu diržu.', lvl: 60 },
        { code: 'U0001', sys: 'CEM / Elektronika', name: 'CEM centrinio modulio drėgmės ir CAN linijos klaida', desc: 'Vanduo per priekinio stiklo klijus laša ant CEM jungčių.', lvl: 95 }
      ],
      mods: [
        { code: '2.0 D3 R5 Dyzelis (100 kW)', desc: '2.0 l dyzelis • Penkių cilindrų ekonomija ir biudžeto atsarga', bonusTxt: '+55 € Biudžeto', dmg: 0, money: 55, ta: 0 },
        { code: '2.0 D4 Twin-Engine Dyzelis (133 kW)', desc: '2.0 l dyzelis • Modernus ir taupus švediškas agregatas', bonusTxt: '+2 DMG / +25 €', dmg: 2, money: 25, ta: 1 },
        { code: '2.4 D5 AWD Dyzelis (151 kW)', desc: '2.4 l dyzelis • Legendinis 5 cilindrų D5 su 420 Nm', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '2.4 D5 Polestar Dyzelis (169 kW)', desc: '2.4 l dyzelis • Polestar programa sunkiausiems mazgams', bonusTxt: '+5 DMG', dmg: 5, money: -10, ta: 0 },
        { code: '3.0 T6 AWD Benzas (224 kW)', desc: '3.0 l benzinas • Švarus benzininis CO2 ir žvėriška trauka', bonusTxt: '+3% TA / +3 DMG', dmg: 3, money: -15, ta: 3 }
      ]
    },
    toyota: {
      name: 'Toyota Avensis', icon: '🇯🇵', cls: 'T27 Universalas', str: 14,
      ill: ['💨 5-asis purkštukas', '🛢️ Galvos tarpinė', '⚠️ SCV / Rankinis'],
      dtc: [
        { code: 'P2002', sys: 'DPNR / Išmetimas', name: '5-ojo DPNR regeneracijos purkštuko užsikimšimas', desc: 'Suodžių filtras nebesivalo, iš duslintuvo veržiasi balti dūmai.', lvl: 25 },
        { code: 'P0300', sys: 'Blokas / Tarpinė', name: 'Aliuminio bloko galvos tarpinės prapūtimas', desc: 'Išsiplėtimo bakelyje kyla burbulai, spaudimas pučia antifrizą.', lvl: 60 },
        { code: 'P062D', sys: 'SCV / Elektronika', name: 'SCV kuro slėgio vožtuvo ir EPB bloko gedimas', desc: 'Šaltas variklis gęsta sankryžose, o galinis rankinis užsikerta.', lvl: 95 }
      ],
      mods: [
        { code: '1.6 Valvematic Benzas (97 kW)', desc: '1.6 l benzinas • Paprastas atmosferinis variklis, pigios dalys', bonusTxt: '+60 € Biudžeto', dmg: 0, money: 60, ta: 0 },
        { code: '1.8 Valvematic Benzas (108 kW)', desc: '1.8 l benzinas • Tuvlitos inspektorių mėgstamiausias benzinas', bonusTxt: '+3% TA Šanso', dmg: 1, money: 10, ta: 3 },
        { code: '2.0 D-4D Dyzelis (93 kW)', desc: '2.0 l dyzelis • Kantrus grandininis dyzelis kasdienai', bonusTxt: '+2 DMG / +30 €', dmg: 2, money: 30, ta: 0 },
        { code: '2.2 D-4D Dyzelis (110 kW)', desc: '2.2 l dyzelis • Stiprus 340 Nm sukimo momentas ant keltuvo', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '2.2 D-CAT Dyzelis (130 kW)', desc: '2.2 l dyzelis • 400 Nm pjezo purkštukų galia bosų kovoms', bonusTxt: '+5 DMG', dmg: 5, money: 0, ta: 0 }
      ]
    },
    mb: {
      name: 'Mercedes-Benz W211', icon: '⭐', cls: 'E-Klasės Sedanas', str: 16,
      ill: ['💨 M55 servo', '🛢️ V-duobės tepalas', '⚠️ SBC / Airmatic'],
      dtc: [
        { code: 'P2013', sys: 'Įsiurbimas / DPF', name: 'M55 įsiurbimo sklendžių servo varikliuko užtrumpinimas', desc: 'Iš turbos lašantis tepalas užliejo M55 varikliuką — mašina „Limp“ režime.', lvl: 25 },
        { code: 'P0521', sys: 'Tepimo kontūras', name: 'OM642 V-duobės šilumokaičio violetinių tarpinių nuotėkis', desc: 'Tepalas kaupiasi variklio V-duobėje ir bėga per drenažo skylutę.', lvl: 60 },
        { code: 'C249F', sys: 'SBC / Airmatic', name: 'SBC stabdžių bloko paspaudimų limito ir Airmatic klaida', desc: 'Raudonas ekranas „Service Brake Visit Workshop“ ir šnypščianti pagalvė.', lvl: 95 }
      ],
      mods: [
        { code: '2.2 CDI E200 Dyzelis (100 kW)', desc: '2.2 l dyzelis • Taksistų patikrintas milijonierius, pigus išlaikymas', bonusTxt: '+60 € Biudžeto', dmg: 0, money: 60, ta: 0 },
        { code: '2.2 CDI E220 Dyzelis (125 kW)', desc: '2.2 l dyzelis • Dviejų turbinų 400 Nm trauka ir tvirtas blokas', bonusTxt: '+2 DMG / +25 €', dmg: 2, money: 25, ta: 1 },
        { code: '2.7 CDI E270 R5 Dyzelis (130 kW)', desc: '2.7 l dyzelis • Penkių cilindrų klasika su puikiu balansu', bonusTxt: '+3 DMG / +15 €', dmg: 3, money: 15, ta: 1 },
        { code: '3.0 CDI E320 V6 Dyzelis (165 kW)', desc: '3.0 l dyzelis • 540 Nm sukimo momentas bet kokiam varžtui', bonusTxt: '+4 DMG', dmg: 4, money: 0, ta: 0 },
        { code: '3.5 V6 E350 Benzas (200 kW)', desc: '3.5 l benzinas • Švarus išmetimas ir aukšta galia', bonusTxt: '+3% TA / +3 DMG', dmg: 3, money: -10, ta: 3 }
      ]
    }
  };

  /* ==========================================================================
     2. VITALIJAUS ŠROTO PREKĖS (BE KLAIDŲ ŠALINIMO MAZGŲ)
     ========================================================================== */
  var SHOP_ITEMS = [
    { id: 'box_gamble', cat: 'aferos', name: '📦 Vitalijaus „Katė Maiše“ (Aklina Dėžė)', price: 35, repeat: true, desc: 'Loterija: 40% reta detalė (+3% TA / +3 DMG), 40% smulkmena (+60 €), 20% rūdys (-8 Nervų)!' },
    { id: 'sell_cat', cat: 'aferos', name: '♻️ Parduoti Seną Katalizatorių ir Laužą', price: 0, repeat: true, desc: 'Gauni +85 € į biudžetą, bet -2% TA (galima 1 k. kas 15 lygių)!' },
    { id: 'haggle_disc', cat: 'aferos', name: '🤝 Pavaišinti Vitalijų Gira ir Pasiderėti', price: 20, repeat: false, desc: 'Visam laikui suteikia -20% nuolaidą visoms Šroto prekėms!' },
    { id: 'coffee', cat: 'chem', name: '☕ Degalinės Kava + Bandelė Meistrui Modestui', price: 15, repeat: true, desc: 'Greita atgaiva: +28 Meistro Modesto Nervų ir +18 Tech. HP' },
    { id: 'kebab', cat: 'chem', name: '🌯 Naktinis Kebabas su Česnakiniu Meistrui', price: 25, repeat: true, desc: 'Atstato +45 Meistro Modesto Nervų ir +15 Tech. HP' },
    { id: 'shashlik', cat: 'chem', name: '🥩 Karštas Šašlykų Komplektas Modesto', price: 35, repeat: true, desc: 'Meistras dainuoja iš laimės: +60 Nervų, +25 Tech. HP ir +1% TA!' },
    { id: 'wd40', cat: 'chem', name: '🧴 WD-40 + Stabdžių Valiklis', price: 20, repeat: true, desc: 'Atstato +25 Tech. HP' },
    { id: 'doctor', cat: 'chem', name: '🍯 „Daktaras“ Variklio Priedas', price: 45, repeat: true, desc: 'Atstato +45 Tech. HP ir prideda +2% TA' },
    { id: 'gaskets', cat: 'chem', name: '🧰 Pilnas Tarpinių ir Chamutų Rinkinys', price: 60, repeat: true, desc: 'Atstato +65 Tech. HP ir +25 Nervų' },
    { id: 'impact', cat: 'tools', name: '🔩 „Parkside“ Smūginis Veržliaraktis', price: 75, repeat: false, desc: 'Visam laikui +5 bazinės žalos (DMG) kovoje su varžtais' },
    { id: 'induct', cat: 'tools', name: '🔥 Indukcinis Varžtų Kaitintuvas', price: 120, repeat: false, desc: 'Visam laikui +9 DMG prieš užrūdijusius mazgus' },
    { id: 'press', cat: 'tools', name: '🏗️ 20T Hidraulinis Presas', price: 170, repeat: false, desc: 'Visam laikui +14 DMG ir +5% TA' },
    { id: 'vcds', cat: 'tools', name: '💻 Pro Kabelis VCDS / ISTA / OP-COM', price: 110, repeat: false, desc: 'OBD2 skenavimas tampa NEMOKAMAS (0 €) ir duoda +35% DMG!' }
  ];

  /* ==========================================================================
     3. 10 SAGŲ IR 100 UNIKALIŲ LYGIŲ PAVADINIMŲ BEI ISTORIJŲ
     ========================================================================== */
  var SAGAS = [
    '1 Saga: Pirminė Apžiūra ir Perekūpo Paslaptys',
    '2 Saga: Važiuoklės Katakombos ir Suvirinimas',
    '3 Saga: Išmetimas, DPF Pelenai ir Turbina',
    '4 Saga: Aušinimo Kontūras ir Pečiuko Ankštuma',
    '5 Saga: Kuro Sistema ir Purkštukų Stendas',
    '6 Saga: Variklio Širdis, Grandinė ir Galvos Tarpinė',
    '7 Saga: Pavarų Dėžė, Smagratis ir Pusašiai',
    '8 Saga: Elektros Vaiduokliai ir CAN-BUS',
    '9 Saga: Kėbulo Rūdys, Slenksčiai ir Dažymas',
    '10 Saga: Suvedimas, OBD2 Paskutinis Mazgas ir Tuvlita'
  ];

  var EPISODE_TITLES = [
    ['Perekūpo Makrofleksas Slenksčiuose','Senas Tepalas Kaip Degutas','Atsuktos Ridos Detektyvas','Šrote Pas Vitalijų: Priekinis Bamperis','Pirmas Užvedimas Šaltą Rytą','Užkepęs Karterio Varžtas','Įtrūkęs Stabdžių Šlangelis','Klibantis Akumuliatoriaus Klemas','Bandomasis Ratas Aplink Garažus','10 Lygio Bosas: Perekūpo Špakliaus Demonas'],
    ['Bildantis Priekinis Šarnyras','Nulūžusi Galinė Spyruoklė','Traškanti Granata Posūkyje','Derybos Dėl Naudotų Amortizatorių','ABS Daviklio Laidų Painiava','Priekinio Guolio Ūžesys','Užrūdiję Suporto Kreipiančiosios','Traverso Įvorių Presavimas','Važiuoklės Testas Per Žvyrkelio Duobes','20 Lygio Bosas: Užkepęs Ekscentrinis Varžtas'],
    ['Pilnas DPF Suodžių Filtras','Užstrigęs EGR Vožtuvas','Švilpianti Turbinos Geometrija','Šrote: Katalizatoriaus Derybos','25 Lygio Bosas: Užsikimšęs DPF ir EGR Monstras','3-iojo Cilindro Žvakės Grandinė','Įsiurbimo Kolektoriaus Sklendės','Prakiurusi Interkulerio Šlanga','Dūmingumo Patikra Prieš Vėją','30 Lygio Bosas: Užstrigusi Turbinos Kriauklė'],
    ['Šaltas Pečiukas Žiemą','Kliuksintis Antifrizas Bakelyje','Užstrigęs Didysis Termostatas','Vitalijaus Šrotas: Naudotas Radiatorius','Ventiliatoriaus Relės Trumpinimas','Vandens Pompos Ašelės Laisvumas','Prakiuręs Šildytuvo Trišakis','Suskilinėjęs Generatoriaus Dirželis','Temperatūros Testas Kamštyje','40 Lygio Bosas: Verdančio Antifrizo Geizeris'],
    ['Kalantis 2-asis Purkštukas','Varinės Šaibos Prapūtimas','Metalas Kuro Filtro Dugne','Derybos su Dyzelistais Dėl Stendo','Kuro Slėgio Reguliatoriaus Fyškė','Aukšto Slėgio Siurblio Plunžeriai','Oras Kuro Magistralėje','Bako Siurbliuko Zyzimas','Dinaminis Testas Autostradoje','50 Lygio Bosas: Užkepęs Purkštukas Galvoje'],
    ['Barškanti Paskirstymo Grandinė','Raudona Tepalo Spaudimo Lemputė','Emulsija Ant Tepalo Kamščio','Šrote: Naudota Variklio Galva','Alkūninio Veleno Daviklio Laidas','Vožtuvų Dangtelio Tarpinės Nuotėkis','Hidraulinių Kompensatorių Caksėjimas','Karterio Ventiliacijos Membrana','Kompresijos Matavimas Cilindruose','60 Lygio Bosas: Tepalo Siurblio ir Grandinės Siaubas'],
    ['Barškantis Dvimasis Smagratis','Buksuojanti Sankaba 5 Pavara','Smūgiuojantis Automato Hidroblokas','Vitalijaus Pasiūlymas: Dėžė Iš Anglų','Atbulinės Eigos Varlytės Trumpinimas','Išbėgęs Reduktoriaus Riebokšlis','Kulysos Trosų Reguliavimas','Kardano Pakabinamas Guolis','Pavarų Perjungimo Testas Įkalnėje','70 Lygio Bosas: Subyrėjęs Smagračio Guolis'],
    ['Iškrautas Akumuliatorius Per Naktį','Žaliuojanti Komforto Bloko Plokštė','Užstrigęs Valytuvų Trapecijos Varikliukas','Šrote: Naudotas Generatorius','CAN-BUS Pynės Litavimas Po Kilimu','Imobilaizerio Rakto Pririšimas','Nedegantis Kairys Žibintas','Masės Laido Korozija Ant Kėbulo','Naktinis Šviesų ir Krovimo Testas','80 Lygio Bosas: Komforto Bloko Trumpasis Jungimas'],
    ['Kiauras Kairys Slenkstis','Rūdys Ant Galinių Arkų','Užstrigusi Kapoto Spyna','Derybos Su Dažytoju Dėl Grunto','Bagažinės Dangčio Laidų Guma','Kempo Suvirinimo Siūlė Ant Dugno','Priekinio Stiklo Įskilimas','Žibintų Poliravimas Lakavimu','Vandens Sandarumo Testas Plovykloje','90 Lygio Bosas: Kėbulo Korozijos Galiūnas'],
    ['Kreivas Vairas Po Remonto','3D Ratų Suvedimo Stendas','Rankinio Stabdžio Lynų Įtempimas','Paskutinis Vizitas Pas Vitalijų: Gesintuvas','95 Lygio Bosas: Paskutinis ECU ir Transmisijos Demonas','CO2 Ir Dūmingumo Reguliavimas','Žibintų Aukščio Korektorius','Vaistinėlė, Liemenė Ir Avarinis Ženklas','Generalinė Repeticija Prieš Tuvlitą','100 Lygio Bosas: Tuvlitos Inspektorius Vytautas']
  ];

  var UNIQUE_STORIES = [
    'Meistras Modestas bakstelėjo atsuktuvu į slenkstį ir iš ten pasipylė geltonos statybinės putos bei senas „Lietuvos ryto“ laikraštis: „Perekūpas čia visą architektūrą pastatė! Jei Tuvlitoje inspektorius stuktelės plaktuku — liks skylė iki kilimėlio.“',
    'Išsukus matuoklę, ant jos galo kabojo juodas, tirštas kaip šaltas gudronas lašas: „Šitas tepalas paskutinį kartą keistas, kai dar litai galiojo. Variklis dūsta, reikia skubiai plauti karterį.“',
    'Prietaisų skydelyje dega kuklūs 184 000 km, bet vairas nutrintas iki porolono, o pedalų gumos kiauros: „Pažiūrim per blokus, kiek kartų šitam gražuoliui suko spidometrą Tauragės aikštelėje.“',
    'Vitalijus šrote rūko sukdamas raktų ryšulį: „Turiu bamperį, bet nuo angliško varianto — viena auselė lituota lituokliu, užtat originalas! Imi ar ieškai kiniško popierinio?“',
    'Rytinis šaltukas garaže spaudžia -6 °C. Pasukus raktelį starteris sunkiai pasuka alkūninį veleną, o iš duslintuvo išvirsta melsvas debesis, kvepiantis nesudegusiu kuru. Sudėliok paleidimo veiksmus iš eilės!',
    'Bandant išleisti seną alyvą paaiškėjo, kad karterio išleidimo varžto briaunos visiškai apvalios, o aplink sriegį pripilta raudono „Abro“ silikono. Teko kelti mašiną ir griebtis sunkiosios artilerijos!',
    'Susukus vairą iki galo į kairę, Meistras Modestas su prožektoriumi pastebėjo pūslę ant priekinio stabdžių šlangelio: „Ant Tuvlitos stabdžių būgnų inspektorius paspaus iš visos jėgos — šita guma sprogs vietoje.“',
    'Kiekvieną kartą įjungus šildomą galinį langą, prietaisų skydelis sumirksi kaip Kalėdų eglutė. Atidarius kapotą matosi pažaliavęs ir laisvai klibantis minusinis akumuliatoriaus gnybtas.',
    'Išriedame iš garažo kooperatyvo siauru keliuku tarp metalinių boksų. Trečia pavara spustelėjus gazą reikia patikrinti, ar niekas nekaukia ir ar mašina netraukia į griovį.',
    'Po storu glaisto sluoksniu ant galinio sparno atsidengė visa perekūpo meistrystė — tinklelis nuo uodų, epoksidinė derva ir 8 milimetrai špakliaus! Šitas monstras pats nenukris.',
    'Pervažiavus per gulintį policininką priekyje pasigirsta skardus „klank!“. Meistras Modestas užkiša montiruotę už apatinės šakės: „Šarnyras turi tokį laisvumą, kad netrukus ratas pats pasirinks posūkio kryptį.“',
    'Automobilio kairys galas stovi dviem pirštais žemiau nei dešinys. Pašvietus į spyruoklės lėkštutę matosi šviežiai nulūžusi apatinė apvija, įstrigusi tiesiai prie padangos.',
    'Susukus vairą aikštelėje ir davus gazo pasigirsta sausas „trak-trak-trak“. Plyšusi išorinės granatos guma jau seniai ištaškė visą molibdeno tepalą ant ratlankio vidinės pusės.',
    'Vitalijus ištraukia du tepaluotus amortizatorius iš po brezento: „Štokas blizga, nerasoja! Nu gerai, viena atraminė guma truputį sutrūkinėjus, bet už tokią kainą net dviratis minkščiau nevažiuos.“',
    'Skydelyje šviečia ABS ir ESP girlianda. Prie dešiniojo rato daviklio laidas nutrūkęs ir ankstesnio savininko susuktas tiesiog pirštais bei apvyniotas mėlyna izoliacija. Atlik remonto veiksmus teisinga eilės tvarka!',
    'Nuo 60 km/h salone prasideda lėktuvo kilimo garsas — priekinis rato guolis ūžia taip, kad nebesigirdi net radijo. Reikia spręsti, kaip jį išpresuoti nesulaužius stebulės.',
    'Dešinys stabdžių diskas įkaitęs iki raudonumo ir rūksta. Suporto kreipiančiųjų pirštai užrūdiję aklinai, nes kažkas pamiršo uždėti apsaugines gumeles.',
    'Galinis traversas vaikšto į šonus. Keturi didieji sailentblokai išplyšę iš savo lizdų — čia paprasto plaktuko neužteks, reikės rimto išvedžiojimo po dugnu.',
    'Išsukame į seną žvyrkelį už aplinkkelio, kur duobės primena mėnulio kraterius. Dabar paaiškės, ar po mūsų remonto pakaba dirba tyliai, ar dar kažkas barška.',
    'Galinio suvedimo ekscentrinis varžtas suaugęs su įvore į vientisą plieno ir rūdžių monolitą! Sukant raktu sukasi visa guma, o varžtas nė iš vietos — metas dvikovai ant keltuvo!',
    'Išmetimo vamzdis sausas, bet variklis netraukia virš 2500 sūkių. Diagnostika rodo 48 gramus suodžių DPF filtre ir visiškai užblokuotą regeneraciją.',
    'Atleidus gazą automobilis trūkčioja, o atidarius EGR vožtuvą matosi centimetro storio suodžių ir tepalo košė, visiškai užklijavusi vožtuvo lėkštutę.',
    'Spustelėjus akseleratorių po kapotu pasigirsta greitosios pagalbos sireną primenantis švilpimas — turbinos kintamos geometrijos mentelės stringa nuo apnašų.',
    'Vitalijus šrote pasitinka su šypsena ir metalo pjovimo diskeliu rankoje: „Jei nori gero išmetimo bakelio, galim susitarti — atiduodi seną katalizatorių arba deramės dėl kainos.“',
    '25-ojo lygio pagrindinis išmetimo sistemos bosas! DPF ir EGR korpusas įkaitęs, priešslėgis siekia kritinę ribą — įveik šį bosą ir išgydyk 1-ąją modelio ligą!',
    'Trečiojo cilindro pakaitinimo žvakės arba uždegimo ritės grandinė rodo atvirą kontūrą. Prie variklio galvos laidų pynė perkaitusi ir sutrūkinėjusi nuo karščio.',
    'Nuėmus įsiurbimo kolektorių Meistras Modestas susiima už galvos: sūkurinės sklendės kliba ant ašelių, viena plastikinė traukutė jau nukritusi ant variklio bloko.',
    'Duodant gazo pasigirsta garsus šnypštimas, o per galinio vaizdo veidrodėlį matosi juodas dūmų šleifas — apatinė interkulerio šlanga praplyšo ties chamutu.',
    'Išvažiuojame į užmiesčio atkarpą patikrinti traukos ir išmetimo švarumo. Laikant trečią pavarą ant aukštų sūkių stebime, ar iš duslintuvo nebeeina juodi debesys.',
    'Turbinos karštoji kriauklė ir aktuatoriaus kojelė užkepė mirtinai! Rūdys ir karštis suvirino sriegius taip, kad be ugnies ir tikslaus smūgio čia nieko nebus.',
    'Lauke speigas, variklis rodo 90 laipsnių, o iš salono ortakių pučia ledinis vėjas. Pečiuko radiatorius po prietaisų panele užsikimšęs rudomis nuosėdomis.',
    'Užgesinus variklį išsiplėtimo bakelyje girdisi įtartinas burbuliavimas, o dangtelio vožtuvas šnypščia. Sistemoje susidaręs oro kamštis neleidžia cirkuliuoti antifrizui.',
    'Važiuojant užmiestyje temperatūros rodyklė nukrenta iki 60 laipsnių. Didysis termostatas užstrigo atviroje padėtyje ir variklis niekaip nepasiekia darbinio režimo.',
    'Vitalijus rodo į krūvą aliumininių radiatorių: „Šitas beveik naujas, tik vienam kampe korys truputį palenktas nuo akmenuko. Užtat originalas Behr-Hella!“',
    'Aušinimo ventiliatorius sukasi maksimaliu greičiu net ištraukus raktelį iš spynelės. Valdymo bloke po lonžeronu pažaliavę kontaktai trumpina tiesiai į pliusą. Sudėliok darbus iš eilės!',
    'Nuėmus generatoriaus dirželį ir pajudinus vandens pompos skriemulį jaučiamas aiškus klibėjimas, o per drenažinę skylutę jau sunkiasi rožinis antifrizo lašelis.',
    'Plastikinis aušinimo šlangų trišakis prie variklio galvos nuo laiko tapo trapus kaip sausainis — vos prisilietus pirštu, atšaka liko Meistro Modesto saujoje.',
    'Užvedus šaltą variklį visas garažas skamba nuo aižaus cypimo. Generatoriaus dirželis suskilinėjęs skersai griovelių, o įtempiklio guolis barška sausai.',
    'Sustojame piko metu miesto spūstyje ir stebime temperatūros parodymus. Tai geriausias testas patikrinti, ar ventiliatoriai ir termostatas suveikia laiku.',
    'Išsiplėtimo bakelyje sukilo toks spaudimas, kad antifrizo geizeris veržiasi per viršų! Užsikirtęs aušinimo kontūras grasina perkaitinti variklio galvą — kovok!',
    'Šaltas variklis kala kaip senas traktorius ir purtosi. Antrojo cilindro purkštuko korekcija per kompiuterį šokinėja virš +2.8 mg/str — adata nebeužsidaro.',
    'Atidarius kapotą girdisi ritmiškas „čuk-čuk-čuk“ ir jaučiamas aitrus išmetamųjų dujų kvapas. Po purkštuku pradegė varinė šaiba ir lizdas apaugo juoda anglimi.',
    'Perpjovus seną kuro filtrą pusiau, jo dugne sužibo smulkios metalo dulkės. Meistras Modestas suraukia antakius: „Čia rimtas signalas iš aukšto slėgio kuro siurblio.“',
    'Dyzelistų dirbtuvėse meistras valo akinius: „Galim prasukti purkštukus ant stendo su ataskaita arba tiesiog perrinkti antgalius iš to, ką turim lentynoje.“',
    'Variklis netikėtai užgęsta paspaudus gazą. Kuro rampoje slėgio reguliatoriaus (DRV) trijų laidų fyškė išlūžusi, o laidai laikosi ant paskutinių vario gijų.',
    'Aukšto slėgio siurblys nebesukelia reikiamo 300 bar slėgio starto metu. Plunžerinė pora nusidėvėjusi, reikia spręsti — restauruoti ar ieškoti kito agregato.',
    'Per skaidrią kuro žarnelę prie filtro bėga ištisa oro burbuliukų virtinė. Po nakties kuras susėda atgal į baką ir ryte tenka sukti starterį po pusę minutės.',
    'Įjungus degimą iš po galinės sėdynės sklinda gailus zyzimas — bako ettekančiojo kuro siurbliuko tinklelis užsikišęs dumblu ir parafinu.',
    'Išvažiuojame į greitkelį patikrinti kuro slėgio prie pilnos apkrovos. Spaudžiame pedalą iki dugno ketvirta pavara ir žiūrime, ar neįšoka „Limp Mode“.',
    'Purkštukas įaugęs į aliumininę galvą taip, kad net atbulinis plaktukas skamba kaip varpas! Anglies derva suklijavo korpusą — reikės visos jėgos jį išlupti nesulaužius dangtelio!',
    'Užvedus variklį pirmas tris sekundes pasigirsta baisus metalinis žvangėjimas. Paskirstymo grandinė išsitampiusi ir jau brūžina į aliumininį dangtelį.',
    'Sukilus tepalo temperatūrai, ant laisvų sūkių sumirksi raudonas aliejinės lempelės simbolis! Manometras rodo vos 0.6 bar — tepimo sistema prašosi skubios intervencijos.',
    'Atsukus tepalo užpylimo kamštį, jo vidinėje pusėje matosi gelsva, majonezą primenanti emulsija. Ar tai tik trumpų atstumų kondensatas, ar jau tarpinės pradžia?',
    'Vitalijus šrote rodo nuimtą variklio galvą: „Nuimta nuo važiuojančio! Tik reiktų nušlifuoti plokštumą ir pakeisti vožtuvų gumeles, kad nedūmintų mėlynai.“',
    'Automobilis užgęsta tiesiog riedant šiltam ir nebesikuria, kol neatvėsta. Alkūninio veleno padėties daviklio (CKP) laidas prasitrynė į karštą bloko briauną.',
    'Iš po vožtuvų dangtelio sunkiasi tepalas ir laša tiesiai ant karšto kolektoriaus — sustojus prie šviesoforo į saloną traukia svylančios alyvos dūmus.',
    'Viršutinėje variklio dalyje girdisi įkyrus „cik-cik-cik“, kuris nepraeina net sušilus. Du hidrauliniai vožtuvų kompensatoriai nebeužsipildo tepalu.',
    'Ištraukus tepalo matuoklę dirbančiam varikliui, pasigirsta garsus švilpimas, o variklis pradeda purtytis — plyšo karterio dujų ventiliacijos (PCV) membrana.',
    'Išsukame žvakes ir su Meistru Modesto matuojame kompresiją visuose cilindruose. Manometro rodyklė parodys visą tiesą apie stūmoklių žiedų ir vožtuvų būklę.',
    '60-ojo lygio košmaras! Tepalo siurblio mazgas ir paskirstymo grandinė pasiekė kritinę ribą — įveik šį bosą ant keltuvo ir išgydyk 2-ąją modelio ligą!',
    'Pusiau nuspaudus sankabos pedalą iš po dugno sklinda chaotiškas metalinis bildesys. Dvimasis smagratis išklibo taip, kad spyruoklės jau daužosi į korpusą.',
    'Važiuojant penkta pavara į įkalnę ir paspaudus gazą, apsukos šoka į viršų, o greitis nekyla — salone pakvimpa svylančiu sankabos ferodo disku.',
    'Automatinė dėžė perjungdama iš antros į trečią pavarą suduoda tokį smūgį per nugarą, lyg kas būtų įvažiavęs į galinį bamperį. Hidrobloko solenoidai užsiteršę.',
    'Vitalijus glosto tepaluotą pavarų dėžę ant paletės: „Šita iš Anglijos, bėgiai jungiasi dviem pirštais! Na, tik veleno riebokšlį pasikeisi, kad nelašėtų.“',
    'Įjungus atbulinę pavarą neužsidega balti žibintai ir neveikia parktronikai. Ant pavarų dėžės korpuso užtrumpino atbulinės eigos varlytės dviejų kontaktų jungtis.',
    'Po reduktoriumi ant garažo grindų telkšo tiršto transmisinio tepalo balutė. Dešiniojo pusašio riebokšlis sukietėjo ir leidžia alyvą ant išmetimo vamzdžio.',
    'Pavarų svirtis makaluojasi kaip šaukštas kibire — norint įjungti pirmą pavarą, tenka ieškoti jos kažkur prie keleivio kelio. Kulysos trosų įvorės visiškai sudilo.',
    'Greitėjant per visą kėbulą pereina stipri vibracija. Pakėlus automobilį matosi išplyšusi kardano pakabinamojo guolio guma.',
    'Kylame į stačią kalvą su pilna apkrova, junginėjame visas pavaras aukštyn ir žemyn, tikrindami, ar sankaba ir reduktorius dirba be jokių pašalinių garsų.',
    'Išcentrinis išminamasis guolis ir smagračio vainikas užstrigo skersai! Pavaros nebesijungia, keltuvas kyla į viršų — laukia sunki transmisijos kova!',
    'Ryte paspaudus pultelį net centrinis užraktas nesuveikia — akumuliatoriuje liko vos 8.4 volto. Kažkuris blokas naktį neužmiega ir siurbia po 2 amperus.',
    'Pakėlus vairuotojo kilimėlį atsiveria pelkė: drenažai po valytuvais buvo užsikimšę lapais, tad vanduo pribėgo į komforto bloko dėžutę ir pažaliavo visa plokštė.',
    'Prasidėjus liūčiai valytuvai sustojo tiesiai per vidurį priekinio stiklo. Trapecijos šarnyrai užkipo nuo aliuminio oksidacijos, o varikliukas kaito iki dūmo.',
    'Vitalijus sukinėja generatoriaus skriemulį: „Krauna 14.4 volto kaip šveicariškas laikrodis! Tik sankabėlė šiek tiek čirškia, bet dovanotam arkliui į dantis nežiūri.“',
    'Po slenksčio apdaila CAN-BUS vytos poros laidai pažaliavę nuo drėgmės ir žiemos druskų. Blokai nebemato vienas kito, reikia kruopštaus litavimo teisinga eilės tvarka.',
    'Įkišus raktelį skydelyje mirksi geltona spynelė — imobilaizerio antena prie spynelės pametė ryšį su raktu ir blokuoja starterio paleidimą.',
    'Kairysis artimųjų šviesų žibintas šviečia violetine spalva ir po akimirkos užgęsta. Blokelis po žibintu gavo drėgmės, o reflektorius jau apdegęs.',
    'Starteris suka vangiai, nors akumuliatorius pilnai pakrautas. Variklio masės pynė, jungianti lonžeroną su pavarų dėže, sutrūnijusi ir įkaitusi.',
    'Išvažiuojame naktiniam testui su įjungtomis tolimosiomis šviesomis, pečiuku ir langų šildymu — tikriname, ar generatoriaus krovimas nekrenta žemiau 13.8 V.',
    'Elektronikos pragaras! Centrinis valdymo blokas ir sudegusi relė sukėlė trumpąjį jungimą — skydelis mirksi visomis spalvomis, metas nugalėti elektros bosą!',
    'Pakišus domkratą po kairiuoju slenksčiu pasigirsta traškesys ir domkratas sulenda į slenksčio vidų, o ant žemės pabiro rudų rūdžių dribsniai.',
    'Ant galinių ratų arkų po dažais išsipūtė pūslės. Nušveitus švitriniu popieriumi paaiškėja, kad metalas ten plonas kaip folija — Tuvlitoje už aštrias briaunas nepraleis.',
    'Patraukus kapoto atidarymo rankenėlę salone, trosas laisvai nuslysta — spyna po grotelėmis užrūdijo ir nebeatšoka, tenka lįsti iš apačios su ilgu atsuktuvu.',
    'Vietinis garažų dažytojas Raimis apžiūri sparną: „Galim nupūsti tiesiai iš flakonėlio pagal kodą arba normaliai nugruntuoti epoksidiniu gruntu su perėjimu.“',
    'Atidarius bagažinės dangtį dingsta numerio apšvietimas ir galinis valytuvas. Guminėje gofroje tarp kėbulo ir dangčio nulūžo visi penki laidai.',
    'Dugno lonžerono vietoje prie galinio tilto tvirtinimo matosi plyšys. Meistras Modestas uždeda suvirinimo kaukę ir įjungia „Kempą“ — čia reikės tvirtos 2 mm plieno lopo siūlės.',
    'Tiesiai vairuotojo akių lygyje ant priekinio stiklo nuo akmenuko bėga ilgas įskilimas. Tuvlitos taisyklės griežtos — valytuvų zonoje jokių trūkių būti negali.',
    'Priekiniai plastikiniai žibintai pageltę ir matiniai kaip pieno buteliai — šviesos srauto aparatas rodys išsklaidytą spindulį. Metas švitriniam popieriui ir poliroliui.',
    'Nuvažiuojame į savitarnos plovyklą ir aukšto slėgio srove nupurškiame visas arkas, slenksčius bei langų gumas, tikrindami, ar salonas lieka sausas.',
    '90-ojo lygio kėbulo korozijos galiūnas! Užrūdiję galinio pusrėmio tvirtinimai ir slenksčių konstrukcija reikalauja sunkiosios kovos ant keltuvo!',
    'Po visų važiuoklės darbų automobilis važiuoja tiesiai, bet vairas stovi pasuktas 20 laipsnių kampu į kairę, o ESP daviklis meta vairo kampo klaidą.',
    'Užvažiuojame ant lazerinio 3D ratų suvedimo stendo. Ekranas šviečia raudonai — tiek priekinio, tiek galinio tilto suvedimo kampai išsibėgioję į visas puses.',
    'Užtraukus rankinį stabdį iki pat lubų, kairys ratas čiuožia, o dešinys laiko. Trosai išsitampė netolygiai — Tuvlitos stende skirtumas negali viršyti 50 procentų.',
    'Paskutinis vizitas pas Vitalijų prieš pat apžiūrą: „Gesintuvas su galiojančiu lipduku iki kitų metų, tik manometras truputį prie raudonos ribos. Imi?“',
    '95-ojo lygio kritinis elektronikos ir transmisijos bosas! Paskutinė (3-ioji) modelio liga blokuoja OBD2 „Readiness“ patikrą — nugalėk šį bosą ir išvalyk klaidų atmintį!',
    'Išmetimo dujų analizatorius garaže rodo ribinį dūmingumą. Reikia idealiai sureguliuoti kuro normą ir oro srauto matuoklės parodymus prieš įvažiuojant į liniją.',
    'Priremiame automobilį prie garažo vartų su kreida pažymėta linija: dešinys žibintas šviečia į medžių viršūnes, o elektrinis aukščio korektorius stringa.',
    'Meistras Modestas atidaro bagažinę ir skaičiuoja ant pirštų: naujos sudėties vaistinėlė su turniketais, šviesą atspindinti liemenė, avarinis trikampis ir tvarkingas gesintuvas.',
    'Paskutinis bandomasis ratas aplink techninės apžiūros centrą. Variklis dirba švelniai, pakaba tyli, skydelyje nedega nė viena lemputė — sustojame prie vartų.',
    'Vartai pakyla! Prie duobės stovi legendinis Tuvlitos inspektorius Vytautas su montiruote, prožektoriumi ir dūmingumo zondu! Tai 100-ojo lygio finalinė kova dėl žalio TA lipduko!'
  ];

  // 6 lygių tipai kas dešimtuką + specialūs bosai 25, 60, 95 ir 100 lygiuose
  var MODES = ['STORY','DETECTIVE','HAGGLE','SEQUENCE','TESTDRIVE','COMBAT','STORY','DETECTIVE','TESTDRIVE','COMBAT'];

  var MOODS = [
    'Šluosto tepaluotas rankas',
    'Geria kavą iš termoso',
    'Ieško 10 mm galvutės',
    'Šviečia su LED prožektoriumi',
    'Klauso variklio darbo',
    'Tikrina saugiklių schemą',
    'Reguliuoja dinamometrinį raktą',
    'Rūko prie garažo vartų'
  ];

  var LIFT_REASONS = [
    'Sugalvojai pasižiūrėti, ar dar neišpuvęs dugnas ir slenksčiai!',
    'Pasišvietei pažiūrėti, ar katalizatorius dar vietoj, ar jau išpjautas!',
    'Modesto pametė 10 mm galvutę — pakėlei pažiūrėti, ar neįkrito į dugno apsaugą!',
    'Pakėlei patikrinti, ar perekūpas neužtepė rėmo bitumu tiesiai ant rūdžių!',
    'Nusprendei pažiūrėti, iš kur ten laša — iš karterio ar iš vairo kolonėlės!',
    'Pakėlei pasigrožėti, kaip duslintuvas laikosi ant alaus skardinės ir vielos!',
    'Meistrui Modestui susuko nugarą lankstytis — pakėlei mašiną iki akių lygio!',
    'Sugalvojai patikrinti, ar galinis tiltas dar nepabėgo į šoną!',
    'Pakėlei pažiūrėti, ar po nakties katinas neįlindo pasišildyti prie kolektoriaus!',
    'Reikėjo prieiti su dviejų metrų vamzdžiu prie užkepusio varžto iš apačios!'
  ];

  /* ==========================================================================
     4. VEIKSMŲ SEKOS (EILIŠKUMO) UŽDUOTYS („SEQUENCE“ LYGIŲ TIPUI)
     ========================================================================== */
  var SEQUENCE_TASKS = [
    {
      name: 'Elektros ir CAN-BUS Grandinės Atstatymas',
      steps: [
        { order: 1, title: 'Atjungti minusinį akumuliatoriaus klemą ir nuvalyti korpuso masę (31 - Rudas laidas)', tag: '1 žingsnis' },
        { order: 2, title: 'Sulituoti +12V maitinimo giją ir CAN-BUS vytą porą su termo-kembriku', tag: '2 žingsnis' },
        { order: 3, title: 'Prijungti diagnostikos testerį, patikrinti įtampą ir ištrinti klaidas', tag: '3 žingsnis' }
      ]
    },
    {
      name: 'Važiuoklės Mazgo ir Guolio Perpresavimas',
      steps: [
        { order: 1, title: 'Atlaisvinti pusašio veržlę, pakelti automobilį ir nuimti stabdžių suportą', tag: '1 žingsnis' },
        { order: 2, title: 'Išpresuoti seną guolį 20T hidrauliniu presu ir įstatyti naują fiksavimo žiedą', tag: '2 žingsnis' },
        { order: 3, title: 'Užveržti stebulę dinamometriniu raktu pagal Nm specifikaciją', tag: '3 žingsnis' }
      ]
    },
    {
      name: 'Kuro ir Aušinimo Magistralės Nuorinimas',
      steps: [
        { order: 1, title: 'Pakeisti sutrūkinėjusią tarpinę ir užspausti naujus plieninius chamutus', tag: '1 žingsnis' },
        { order: 2, title: 'Užpildyti sistemą ir aktyvuoti nuorinimo procedūrą per OBD2 programą', tag: '2 žingsnis' },
        { order: 3, title: 'Pašildyti variklį iki 90 °C ir patikrinti, ar nėra slėgio nuotėkio', tag: '3 žingsnis' }
      ]
    }
  ];

  function getLevelData(lvl, carKey) {
    var sIdx = Math.min(9, Math.floor((lvl - 1) / 10));
    var eIdx = (lvl - 1) % 10;
    var title = EPISODE_TITLES[sIdx][eIdx];
    var mode = MODES[eIdx];

    // Užtikriname, kad 25, 60, 95 ir 100 lygiai būtų epinės Boso kovos, o 96 lygis (kur pasislinko iš 95) būtų SEQUENCE/DETECTIVE
    if (lvl === 25 || lvl === 60 || lvl === 95 || lvl === 100) {
      mode = 'COMBAT';
    } else if (lvl === 26 || lvl === 96) {
      mode = 'SEQUENCE';
    }

    var isBoss = (mode === 'COMBAT');
    var hpBase = Math.round(45 + lvl * 3.2 + (lvl % 10 === 0 || lvl === 25 || lvl === 60 || lvl === 95 ? 38 : 0));
    var dmgBase = Math.round(8 + lvl * 0.35);
    var df=difficultyCfg(); hpBase=Math.round(hpBase*df.bossHp*(1+G.newGamePlus*.18)); dmgBase=Math.round(dmgBase*df.bossDmg*(1+G.newGamePlus*.10));

    return {
      lvl: lvl,
      saga: SAGAS[sIdx],
      epTitle: title,
      title: lvl + ' Lygis: ' + title,
      mode: mode,
      isBoss: isBoss,
      bossName: isBoss ? ('👹 ' + title) : '',
      bossHp: hpBase,
      bossDmg: dmgBase,
      speech: UNIQUE_STORIES[lvl - 1] || UNIQUE_STORIES[0]
    };
  }

  var PAMPER_CHOICES = [
    {
      opt: 'pamper_kebab',
      title: '🌯 Palepinti Modesto: Didelis kebabas su česnakiniu ir kola',
      cost: '20 €',
      sub: '😋 Meistras Modestas švyti: +30 Nervų, +15 Tech. HP ir +2% TA'
    },
    {
      opt: 'pamper_coffee',
      title: '☕ Palepinti Modesto: Karšta kapučino kava ir šviežios spurgos',
      cost: '15 €',
      sub: '🍩 Puiki nuotaika garaže: +25 Nervų, +12 Tech. HP ir +2% TA'
    },
    {
      opt: 'pamper_lunch',
      title: '🥩 Palepinti Modesto: Dienos pietūs (šonkauliukai ir cepelinai)',
      cost: '25 €',
      sub: '🔥 Maksimalus Meistro įkvėpimas: +35 Nervų, +18 Tech. HP ir +3% TA'
    },
    {
      opt: 'pamper_gloves',
      title: '🧤 Palepinti Modesto: Naujos „Würth“ pirštinės ir arbatpinigiai',
      cost: '20 €',
      sub: '💪 Meistras įvertina pagarbą: +28 Nervų, +14 Tech. HP, +2% TA ir +1 DMG!'
    }
  ];

  function getContextualChoices(ld) {
    var p1 = PAMPER_CHOICES[(ld.lvl - 1) % PAMPER_CHOICES.length];
    var base = [];

    if (ld.mode === 'STORY') {
      base = [
        { opt: '1', title: '🔩 Tvarkyti pagal technologiją', cost: '15 €', sub: '🎲 Kruopštus darbas su Meistru Modesto: +2% TA ir +10 Tech. HP' },
        { opt: '2', title: '⚡ Greitas sprendimas (chamutai)', cost: '0 €', sub: '🎲 Sutaupai +15 € biudžeto ir +1% TA, bet -6 Nervų' },
        { opt: '3', title: '🏅 Užsakyti naują detalę šiam mazgui', cost: '35 €', sub: '✓ Maksimalus patikimumas: +2% TA, +15 Tech. HP ir +10 Nervų' }
      ];
    } else if (ld.mode === 'DETECTIVE') {
      base = [
        { opt: '1', title: '🎧 Tikrinti su mechaniko stetoskopu', cost: '0 €', sub: '✓ Tiksli mechaninė diagnozė: +2% TA ir +20 € sutaupytų detalių' },
        { opt: '2', title: '💻 Tikrinti bloko gyvus parametrus', cost: '10 €', sub: '✓ Inžinerinis sprendimas: +2% TA ir +12 Tech. HP' },
        { opt: '3', title: '🔨 Keisti įtariamą mazgą nauju', cost: '25 €', sub: '🎲 +2% TA, +15 Tech. HP ir +10 Nervų' }
      ];
    } else if (ld.mode === 'HAGGLE') {
      base = [
        { opt: '1', title: '🗣️ Derėtis su Vitalijumi dėl nuolaidos', cost: '15 €', sub: '🎲 Griebi detalę pusvelčiui: +2% TA ir +10 Tech. HP' },
        { opt: '2', title: '♻️ Išsukti pačiam iš šroto donoro', cost: '0 €', sub: '🎲 Lieka +15 € kišenėje ir +1% TA, bet -6 Nervų' },
        { opt: '3', title: '💶 Paimti geriausią variantą su garantija', cost: '35 €', sub: '✓ Švari detalė be rūdžių: +2% TA, +15 Tech. HP ir +10 Nervų' }
      ];
    } else if (ld.mode === 'TESTDRIVE') {
      base = [
        { opt: '1', title: '🚀 Dinaminis testas autostradoje (3000 RPM)', cost: '15 €', sub: '✓ Prapučia sistemą: +2% TA ir +10 Tech. HP' },
        { opt: '2', title: '🪨 Pakabos testas per žvyrkelio duobes', cost: '0 €', sub: '🎧 Patikrini be išlaidų: +15 € sutaupyta ir +1% TA' },
        { opt: '3', title: '📊 Pilnas telemetrijos įrašymas kelyje', cost: '35 €', sub: '✓ Ideali patikra: +2% TA, +15 Tech. HP ir +10 Nervų' }
      ];
    }
    base.push(p1);
    return base;
  }

  /* ==========================================================================
     5. GARSO EFEKTAI (WEB AUDIO API) IR VIZUALINĖS ANIMACIJOS
     ========================================================================== */
  var audioCtx = null;
  function unlockAudio() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch(e) {}
  }

  function SFX(type) {
    if (!G.sound) return;
    unlockAudio();
    if (!audioCtx) return;
    try {
      var now = audioCtx.currentTime;
      if (type === 'click') {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(540, now);
        g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        o.connect(g); g.connect(audioCtx.destination); o.start(now); o.stop(now + 0.06);
      } else if (type === 'engine') {
        [110, 145, 95, 185].forEach(function(f, i) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sawtooth'; o.frequency.setValueAtTime(f, now + i * 0.09);
          g.gain.setValueAtTime(0.11, now + i * 0.09);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.12);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(now + i * 0.09); o.stop(now + i * 0.09 + 0.12);
        });
      } else if (type === 'lift') {
        var o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
        o2.type = 'sawtooth';
        o2.frequency.setValueAtTime(G.liftUp ? 130 : 280, now);
        o2.frequency.linearRampToValueAtTime(G.liftUp ? 290 : 130, now + 0.52);
        g2.gain.setValueAtTime(0.09, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        o2.connect(g2); g2.connect(audioCtx.destination);
        o2.start(now); o2.stop(now + 0.55);
      } else if (type === 'dice') {
        [380, 520, 680, 880].forEach(function(f, i) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'square'; o.frequency.setValueAtTime(f, now + i * 0.05);
          g.gain.setValueAtTime(0.07, now + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.05);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(now + i * 0.05); o.stop(now + i * 0.05 + 0.05);
        });
      } else if (type === 'wrench' || type === 'torque_ok') {
        var freqs = type === 'torque_ok' ? [700, 1050] : [260, 180];
        freqs.forEach(function(f, i) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, now + i * 0.07);
          g.gain.setValueAtTime(0.14, now + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.09);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.09);
        });
      } else if (type === 'win' || type === 'cash') {
        [523, 659, 784, 1046].forEach(function(f, i) {
          var o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(f, now + i * 0.07);
          g.gain.setValueAtTime(0.1, now + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.14);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.14);
        });
      } else if (type === 'fail') {
        var o3 = audioCtx.createOscillator(), g3 = audioCtx.createGain();
        o3.type = 'sawtooth'; o3.frequency.setValueAtTime(150, now);
        o3.frequency.linearRampToValueAtTime(95, now + 0.25);
        g3.gain.setValueAtTime(0.12, now); g3.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        o3.connect(g3); g3.connect(audioCtx.destination); o3.start(now); o3.stop(now + 0.28);
      }
    } catch(e) {}
  }

  function triggerGarageAnimation(icons) {
    var carWrap = document.getElementById('stageCarSvg');
    var sparkEl = document.getElementById('sparkFx');
    var modAva = document.getElementById('modAvatar');
    if (carWrap) {
      carWrap.style.setProperty('--car-y', G.liftUp ? '-16px' : '12px');
      carWrap.classList.remove('shake-anim');
      void carWrap.offsetWidth;
      carWrap.classList.add('shake-anim');
    }
    if (sparkEl) {
      sparkEl.textContent = icons || '⚡🔧✨';
      sparkEl.classList.remove('pop');
      void sparkEl.offsetWidth;
      sparkEl.classList.add('pop');
    }
    if (modAva) {
      modAva.style.transform = 'scale(1.16) rotate(-6deg)';
      setTimeout(function() { modAva.style.transform = ''; }, 260);
    }
  }

  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(function() { el.style.display = 'none'; }, 2700);
  }

  /* ==========================================================================
     6. ŽAIDIMO BŪSENA IR CACHE (LOCALSTORAGE)
     ========================================================================== */
  var G = {
    started: false,
    car: 'audi',
    modIdx: 0,
    color: '#1e293b',
    plate: 'NMP 569',
    lvl: 1,
    hp: 100,
    nerves: 100,
    money: 450,
    ta: 15,
    bonusDmg: 0,
    illCured: [false, false, false],
    items: {},
    discount: false,
    lastCatSellLvl: -20,
    obdScannedLvl: 0,
    faultClearLvl: -10,
    fortuneRolledLvl: 0,
    fortuneMult: 1,
    fortuneTxt: '',
    liftUp: false,
    liftReasonTxt: '',
    sound: true,
    shopCat: 'all',
    seqStep: 1,
    seqOrder: [2, 0, 1],
    customMood: '',
    pamperBuff: false,
    combat: null,
    tqActive: false,
    tqPos: 10,
    tqDir: 1,
    rpg: {
      xp: 0,
      level: 1,
      skillPoints: 0,
      reputation: 0,
      skills: {},
      unlockedAchievements: {},
      stats: { levelsCompleted:0, bossesDefeated:0, rolledTwenty:0, discountUnlocked:0, obdScans:0, diseasesCured:0, moneyPeak:450 },
      rewardedLevels: {}
    },
    inventory: [],
    equipped: { tool:null, diagnostic:null, utility:null },
    lootStats: { drops:0, legendary:0 },
    difficulty: 'normal',
    eventCounter: 0,
    pendingEvent: null,
    completed: false,
    newGamePlus: 0,
    totalStats: { d20Rolls:0, natural20:0, events:0 },
    modestasRespect: 70,
    modestasMemory: {outsideRepairs:0,bossesTogether:0,ignoredAdvice:0,trustedAdvice:0,successfulRepairs:0,failures:0},
    modestasCombo: 0,
    modestasGifts: {},
    adviceResolved: {},
    modestasLifeSeen: {},
    modestasFamilySeen: {}
  };

  function ensureRpgState() {
    if (!G.rpg) G.rpg = {};
    var r = G.rpg;
    if (typeof r.xp !== 'number') r.xp = 0;
    if (typeof r.level !== 'number') r.level = 1;
    if (typeof r.skillPoints !== 'number') r.skillPoints = 0;
    if (typeof r.reputation !== 'number') r.reputation = 0;
    r.skills = r.skills || {};
    r.unlockedAchievements = r.unlockedAchievements || {};
    r.rewardedLevels = r.rewardedLevels || {};
    r.stats = Object.assign({levelsCompleted:0,bossesDefeated:0,rolledTwenty:0,discountUnlocked:0,obdScans:0,diseasesCured:0,moneyPeak:0}, r.stats || {});
  }
  function xpNeeded(level) { return Math.round(RPG_DATA.xp.levelBase * Math.pow(RPG_DATA.xp.levelGrowth, level - 1)); }
  function addXp(amount) {
    ensureRpgState(); G.rpg.xp += Math.max(0, Math.round(amount));
    while (G.rpg.xp >= xpNeeded(G.rpg.level)) { G.rpg.xp -= xpNeeded(G.rpg.level); G.rpg.level++; G.rpg.skillPoints++; }
  }
  function skillLevel(id) { ensureRpgState(); return G.rpg.skills[id] || 0; }
  function findSkill(id) { for(var b=0;b<RPG_DATA.skillBranches.length;b++) for(var i=0;i<RPG_DATA.skillBranches[b].skills.length;i++) if(RPG_DATA.skillBranches[b].skills[i].id===id) return RPG_DATA.skillBranches[b].skills[i]; return null; }
  function hasRequirements(sk) { if(!sk.requires) return true; for(var k in sk.requires) if(skillLevel(k)<sk.requires[k]) return false; return true; }
  function getReputationRank() { ensureRpgState(); var rank=RPG_DATA.reputationRanks[0]; RPG_DATA.reputationRanks.forEach(function(x){if(G.rpg.reputation>=x.min)rank=x;}); return rank; }
  function checkAchievements() {
    ensureRpgState(); G.rpg.stats.moneyPeak=Math.max(G.rpg.stats.moneyPeak,G.money); G.rpg.stats.diseasesCured=G.illCured.filter(Boolean).length;
    RPG_DATA.achievements.forEach(function(a){ var current=a.test==='modestasRespect'?G.modestasRespect:(G.rpg.stats[a.test]||0); if(!G.rpg.unlockedAchievements[a.id] && current>=a.target){ G.rpg.unlockedAchievements[a.id]=true; addXp(a.rewardXp); }});
  }
  function awardLevelCompletion(doneLvl) {
    ensureRpgState(); if(doneLvl<1 || G.rpg.rewardedLevels[doneLvl]) return; G.rpg.rewardedLevels[doneLvl]=true; G.rpg.stats.levelsCompleted++;
    var ld=getLevelData(doneLvl,G.car); if(ld.mode==='COMBAT') G.rpg.stats.bossesDefeated++;
    addXp(RPG_DATA.xp.basePerLevel + doneLvl*RPG_DATA.xp.perLevel + (ld.mode==='COMBAT'?RPG_DATA.xp.bossBonus:0) + (ld.mode==='SEQUENCE'?RPG_DATA.xp.sequenceBonus:0));
    G.rpg.reputation += Math.round(8 + doneLvl/5 + (ld.mode==='COMBAT'?20:0)); if(ld.mode!=='COMBAT' && Math.random()<0.22) awardLoot('level',false); checkAchievements();
  }
  function unlockSkill(id) {
    ensureRpgState(); var sk=findSkill(id); if(!sk) return; var cur=skillLevel(id);
    if(cur>=sk.max || !hasRequirements(sk) || G.rpg.skillPoints<sk.cost) return;
    G.rpg.skillPoints-=sk.cost; G.rpg.skills[id]=cur+1; if(id==='garage_magnate' && cur===0) G.money+=100; saveGame(); renderAll();
  }
  function renderRpgTab() {
    ensureRpgState(); var el=document.getElementById('tabRpg'); if(!el) return; var need=xpNeeded(G.rpg.level), pct=Math.min(100,Math.round(G.rpg.xp/need*100)), rank=getReputationRank();
    var branches=''; RPG_DATA.skillBranches.forEach(function(br){ var nodes=''; br.skills.forEach(function(sk){ var cur=skillLevel(sk.id), ok=hasRequirements(sk), available=ok&&cur<sk.max&&G.rpg.skillPoints>=sk.cost; nodes+='<button type="button" class="skill-node '+(cur?'unlocked ':'')+(available?'available':'')+'" data-action="unlock-skill" data-skill="'+sk.id+'" '+(available?'':'disabled')+'><b>'+sk.name+' '+cur+'/'+sk.max+'</b><br><span style="font-size:10px;color:var(--muted)">'+sk.desc+' • '+sk.cost+' SP</span></button>'; }); branches+='<div class="skill-branch"><b>'+br.name+'</b>'+nodes+'</div>'; });
    var ach=''; RPG_DATA.achievements.forEach(function(a){ var ok=!!G.rpg.unlockedAchievements[a.id], cur=Math.min(a.target,a.test==='modestasRespect'?G.modestasRespect:(G.rpg.stats[a.test]||0)); ach+='<div class="ach-card '+(ok?'unlocked':'')+'"><b>'+a.icon+' '+a.name+'</b><div>'+a.desc+'</div><small>'+(ok?'✓ Atrakinta':cur+' / '+a.target)+' • '+a.rewardXp+' XP</small></div>'; });
    el.innerHTML='<div class="card"><div class="sec-lbl"><span>⭐ MEISTRO MODESTO PROGRESAS</span><span>'+rank.name+'</span></div><div class="rpg-summary"><div class="rpg-stat">Meistro lygis<b>'+G.rpg.level+'</b></div><div class="rpg-stat">Skill Points<b>'+G.rpg.skillPoints+'</b></div><div class="rpg-stat">Reputacija<b>'+G.rpg.reputation+'</b></div><div class="rpg-stat">Modesto pagarba<b>'+G.modestasRespect+'/100</b><small>'+modestasRespectRank()+'</small></div></div><div style="font-size:11px">XP '+G.rpg.xp+' / '+need+'</div><div class="xp-track"><div class="xp-fill" style="width:'+pct+'%"></div></div><div class="sec-lbl gold-lbl"><span>SKILL TREE</span></div><div class="skill-tree">'+branches+'</div></div><div class="card"><div class="sec-lbl"><span>🏆 PASIEKIMAI</span><span>'+Object.keys(G.rpg.unlockedAchievements).length+' / '+RPG_DATA.achievements.length+'</span></div><div class="ach-grid">'+ach+'</div></div>';
  }

  function ensureInventoryState() {
    G.inventory = Array.isArray(G.inventory) ? G.inventory : [];
    G.equipped = Object.assign({tool:null,diagnostic:null,utility:null}, G.equipped || {});
    G.lootStats = Object.assign({drops:0,legendary:0}, G.lootStats || {});
  }
  function rarityLabel(r) { return (LOOT_DATA.rarity[r] || LOOT_DATA.rarity.used).label; }
  function findLootBase(id) { for(var i=0;i<LOOT_DATA.items.length;i++) if(LOOT_DATA.items[i].id===id) return LOOT_DATA.items[i]; return null; }
  function rollRarity(isBoss) {
    var roll=Math.random()*100, bonus=(isBoss?8:0)+(difficultyCfg().loot||0)+(G.newGamePlus*3);
    if(roll < 3+bonus) return 'legendary'; if(roll < 12+bonus) return 'performance'; if(roll < 30+bonus) return 'oem'; if(roll < 58+bonus) return 'aftermarket'; return 'used';
  }
  function rarityMult(r){ return {used:.75,aftermarket:1,oem:1.25,performance:1.55,legendary:2}[r]||1; }
  function awardLoot(source,isBoss){
    ensureInventoryState(); var pool=LOOT_DATA.items.filter(function(x){return isBoss || !x.legendary;});
    var base=pool[Math.floor(Math.random()*pool.length)], rarity=base.legendary?'legendary':rollRarity(isBoss);
    if(rarity==='legendary' && !base.legendary && Math.random()<.55){var leg=LOOT_DATA.items.filter(function(x){return x.legendary;});base=leg[Math.floor(Math.random()*leg.length)];}
    var item={uid:'loot_'+Date.now()+'_'+Math.floor(Math.random()*99999),baseId:base.id,type:base.type,name:base.name,desc:base.desc,rarity:rarity,condition:Math.floor(55+Math.random()*46),effects:{}};
    var m=rarityMult(rarity); for(var k in base.effects)item.effects[k]=typeof base.effects[k]==='number'?base.effects[k]*m:base.effects[k];
    G.inventory.push(item); G.lootStats.drops++; if(rarity==='legendary')G.lootStats.legendary++;
    showToast('📦 Radinys: '+rarityLabel(rarity)+' '+item.name); return item;
  }
  function equippedBonus(key){ ensureInventoryState(); var total=0; Object.keys(G.equipped).forEach(function(slot){var uid=G.equipped[slot];var it=G.inventory.find(function(x){return x.uid===uid;}); if(it&&it.effects&&typeof it.effects[key]==='number') total+=it.effects[key]*(it.condition/100);}); return total; }
  function equipItem(uid){ ensureInventoryState(); var it=G.inventory.find(function(x){return x.uid===uid;}); if(!it)return; G.equipped[it.type]=G.equipped[it.type]===uid?null:uid; saveGame(); renderAll(); }
  function renderInventoryTab(){
    ensureInventoryState(); var el=document.getElementById('tabInventory'); if(!el)return; var equippedCount=Object.values(G.equipped).filter(Boolean).length, html='';
    if(!G.inventory.length) html='<div class="speech-bubble">🎒 Inventorius tuščias. Daiktų gali gauti už bosus ir atsitiktinius loot drop.</div>';
    G.inventory.slice().reverse().forEach(function(it){var eq=G.equipped[it.type]===it.uid, eff=[];for(var k in it.effects){var v=it.effects[k];eff.push(k==='dmg'?('+'+Math.round(v)+' DMG'):k==='scan'?('+'+Math.round(v*100)+'% diagnostika'):k==='crit'?('+'+Math.round(v*100)+'% kritinis'):('+'+Math.round(v)+' '+k));}html+='<div class="inv-card" data-rarity="'+it.rarity+'"><div class="inv-top"><div class="inv-name">'+rarityLabel(it.rarity)+' '+it.name+'</div><b>'+it.condition+'%</b></div><div class="inv-meta">'+it.type.toUpperCase()+' • '+eff.join(' • ')+'</div><div class="condition-track"><div class="condition-fill" style="width:'+it.condition+'%"></div></div><div class="inv-meta">'+it.desc+'</div><button type="button" class="equip-btn '+(eq?'equipped':'')+'" data-action="equip-item" data-uid="'+it.uid+'">'+(eq?'✓ Įrengta':'Įrengti į '+it.type+' slotą')+'</button></div>';});
    el.innerHTML='<div class="card"><div class="sec-lbl"><span>🎒 GARAŽO INVENTORIUS</span><span>'+G.inventory.length+' daikt.</span></div><div class="inv-summary"><div class="inv-chip">Įrengta<b>'+equippedCount+' / 6</b></div><div class="inv-chip">Loot drop<b>'+G.lootStats.drops+'</b></div><div class="inv-chip">Legendary<b>'+G.lootStats.legendary+'</b></div></div>'+html+'</div>';
  }

  function ensureWorldState(){
    if(!WORLD_DATA.difficulties[G.difficulty])G.difficulty='normal';
    if(typeof G.eventCounter!=='number')G.eventCounter=0; if(typeof G.completed!=='boolean')G.completed=false;
    if(typeof G.newGamePlus!=='number')G.newGamePlus=0;if(typeof G.modestasRespect!=='number')G.modestasRespect=70;G.modestasMemory=Object.assign({outsideRepairs:0,bossesTogether:0,ignoredAdvice:0,trustedAdvice:0,successfulRepairs:0,failures:0},G.modestasMemory||{});if(typeof G.modestasCombo!=='number')G.modestasCombo=0;G.modestasGifts=G.modestasGifts||{};G.adviceResolved=G.adviceResolved||{};G.modestasLifeSeen=G.modestasLifeSeen||{};G.modestasFamilySeen=G.modestasFamilySeen||{}; G.totalStats=Object.assign({d20Rolls:0,natural20:0,events:0},G.totalStats||{});
    var slots={primary:null,secondary:null,diagnostic:null,consumable:null,gear:null,lucky:null};
    var old=G.equipped||{}; if(old.tool&&!old.primary)old.primary=old.tool;if(old.utility&&!old.consumable)old.consumable=old.utility; G.equipped=Object.assign(slots,old);
  }
  function difficultyCfg(){ensureWorldState();return WORLD_DATA.difficulties[G.difficulty];}
  function passiveCfg(){return WORLD_DATA.carPassives[G.car]||{};}
  function d20Tier(r){if(r===1)return{label:'💀 Kritinė nesėkmė',mult:.5};if(r<=5)return{label:'🔴 Nesėkmė',mult:.75};if(r<=10)return{label:'🟠 Dalinis pasisekimas',mult:.95};if(r<=15)return{label:'🟢 Pasisekimas',mult:1.1};if(r<=19)return{label:'🔵 Puikus pasisekimas',mult:1.25};return{label:'🟠 NATURAL 20',mult:1.5};}
  function rollD20(){var r=Math.floor(Math.random()*20)+1;ensureWorldState();G.totalStats.d20Rolls++;if(r===20){G.totalStats.natural20++;ensureRpgState();G.rpg.stats.rolledTwenty=1;}return r;}
  function maybeTriggerEvent(){ensureWorldState();if(G.pendingEvent||G.completed||G.lvl<3)return false;G.eventCounter++;if(G.eventCounter<3&&Math.random()>.28)return false;G.eventCounter=0;G.pendingEvent=WORLD_DATA.events[Math.floor(Math.random()*WORLD_DATA.events.length)];G.totalStats.events++;renderEventModal();return true;}
  function renderEventModal(){var ev=G.pendingEvent;if(!ev)return;var modal=document.getElementById('battleResultModal'),content=document.getElementById('battleModalContent'),choices='';ev.choices.forEach(function(ch,i){if(ch.requires==='diagnostic'&&!G.equipped.diagnostic)return;choices+='<button type="button" class="event-choice" data-action="event-choice" data-index="'+i+'">'+ch.label+'</button>';});content.innerHTML='<div class="event-card"><div class="mode-tag">🚨 RANDOM GARAGE EVENT</div><h3>'+ev.title+'</h3><div class="speech-bubble">'+ev.text+'</div>'+choices+'</div>';modal.classList.add('show');}
  function applyEventEffect(eff){if(!eff)return;if(eff.money)G.money=Math.max(0,G.money+eff.money);if(eff.hp)G.hp=Math.max(0,Math.min(125,G.hp+eff.hp));if(eff.nerves)G.nerves=Math.max(0,Math.min(100,G.nerves+eff.nerves+(passiveCfg().eventNerves||0)));if(eff.rep){ensureRpgState();G.rpg.reputation+=eff.rep;}if(eff.loot)awardLoot('event',false);}
  function resolveEventChoice(i){var ev=G.pendingEvent,ch=ev&&ev.choices[i];if(!ch)return;if(ch.roll){var r=rollD20(),tier=d20Tier(r);applyEventEffect(r>=11?ch.success:ch.fail);showToast('🎲 '+r+' • '+tier.label);}else applyEventEffect(ch);G.pendingEvent=null;document.getElementById('battleResultModal').classList.remove('show');if(difficultyCfg().hardcore&&(G.hp<=0||G.nerves<=0)){showHardcoreGameOver(G.hp<=0?'Automobilio techninė būklė nukrito iki 0% per garažo įvykį.':'Meistro Modesto nervai nukrito iki 0% per garažo įvykį.');return;}saveGame();renderAll();}
  function finalGrade(){var score=G.ta+G.hp*.25+G.nerves*.15+Math.min(25,G.money/40)+G.rpg.level+(G.lootStats.legendary*3);return score>=150?'S':score>=125?'A':score>=100?'B':'C';}
  function showHardcoreGameOver(reason){
    ensureWorldState(); G.hp=Math.max(0,G.hp); G.nerves=Math.max(0,G.nerves); G.combat=null;
    var modal=document.getElementById('battleResultModal'),content=document.getElementById('battleModalContent');
    content.innerHTML='<div style="text-align:center;margin-bottom:12px"><div style="font-size:42px">💀</div><div style="font-size:18px;font-weight:900;color:var(--red-lt)">HARDCORE KAMPANIJA BAIGTA</div><div style="font-size:12px;color:var(--muted);margin-top:5px">'+reason+'</div></div><div class="stat-row"><span>Pasiektas lygis</span><b>'+G.lvl+' / 100</b></div><div class="stat-row"><span>Tech. HP</span><b>'+G.hp+'%</b></div><div class="stat-row"><span>Modesto nervai</span><b>'+G.nerves+'%</b></div><div class="stat-row"><span>Reputacija</span><b>'+G.rpg.reputation+'</b></div><div class="ngplus-card">Hardcore režime 0 Tech. HP arba 0 Nervų užbaigia kampaniją. Tęsti to paties bandymo negalima.</div><button type="button" class="btn-start" data-action="hardcore-restart"><span class="btn-start-main">🔄 NAUJAS HARDCORE BANDYMAS</span></button><button type="button" class="shop-buy-btn" data-action="hardcore-config" style="margin-top:8px">🚗 GRĮŽTI Į AUTOMOBILIO PASIRINKIMĄ</button>';
    modal.classList.add('show'); saveGame();
  }

  function showFinalScreen(){ensureWorldState();G.completed=true;var c=CARS[G.car],rank=getReputationRank(),grade=finalGrade(),modal=document.getElementById('battleResultModal'),content=document.getElementById('battleModalContent');var ending=G.modestasRespect>=100?'„Kai pirmą kartą atvarei, galvojau, kad iš šitos geldos nieko nebus. Pasirodo, ne tik mašiną sutvarkėm. Eglė ir dukros sakys, kad pagaliau galiu užrakinti garažą.“ 👑 GARAŽO ŠEIMA':G.modestasRespect>=70?'„Nu ką. Neblogai mudu čia tą geldą prikėlėm.“':'„TA praėjom. Bet kitą kartą apsispręsk, pas ką remontuojiesi.“';
    content.innerHTML='<div style="text-align:center"><div class="mode-tag">🏆 TECHNINĖ APŽIŪRA PRAEITA</div><h2>'+c.name+' • '+G.plate+'</h2><div class="final-grade">'+grade+'</div><b>GARAŽO ĮVERTINIMAS</b></div><div class="stat-row"><span>TA</span><b>'+G.ta+'%</b></div><div class="stat-row"><span>Tech HP / Nervai</span><b>'+G.hp+' / '+G.nerves+'</b></div><div class="stat-row"><span>Meistro lygis</span><b>'+G.rpg.level+'</b></div><div class="stat-row"><span>Reputacija</span><b>'+G.rpg.reputation+' • '+rank.name+'</b></div><div class="stat-row"><span>Modesto pagarba</span><b>'+G.modestasRespect+'/100 • '+modestasRespectRank()+'</b></div><div class="stat-row"><span>Legendary</span><b>'+G.lootStats.legendary+'</b></div><div class="stat-row"><span>D20 metimai / Natural 20</span><b>'+G.totalStats.d20Rolls+' / '+G.totalStats.natural20+'</b></div><div class="advice-box"><b>💬 MODESTAS</b><div>'+ending+'</div></div><div class="ngplus-card">NEW GAME+ išsaugo Skill Tree, pasiekimus, reputaciją ir Legendary inventorių. Bossai tampa stipresni.</div><button class="btn-start" data-action="start-ngplus"><span class="btn-start-main">♻️ PRADĖTI NEW GAME+</span></button>';modal.classList.add('show');saveGame();}
  function startNewGamePlus(){var keep=G.inventory.filter(function(x){return x.rarity==='legendary';}),rpg=G.rpg,respect=G.modestasRespect,n=G.newGamePlus+1,sound=G.sound,car=G.car,mod=G.modIdx,color=G.color,plate=G.plate,diff=G.difficulty;try{localStorage.removeItem(SAVE_KEY);}catch(e){}G.started=true;G.car=car;G.modIdx=mod;G.color=color;G.plate=plate;G.sound=sound;G.difficulty=diff;G.lvl=1;G.hp=100;G.nerves=100;G.money=350;G.ta=15;G.illCured=[false,false,false];G.items={};G.bonusDmg=n*2;G.inventory=keep;G.equipped={primary:null,secondary:null,diagnostic:null,consumable:null,gear:null,lucky:null};G.lootStats={drops:keep.length,legendary:keep.length};G.rpg=rpg;G.modestasRespect=respect;G.rpg.rewardedLevels={};G.completed=false;G.newGamePlus=n;G.combat=null;document.getElementById('battleResultModal').classList.remove('show');enterLevel(1);}

  var CAMPAIGN_SEED=localStorage.getItem('modesto_garazas_seed_v20')||MG20.createSeed();localStorage.setItem('modesto_garazas_seed_v20',CAMPAIGN_SEED);var RNG20=new MG20.RNG(CAMPAIGN_SEED);
  function randomInt(min,max){return RNG20.int(min,max)}
  function updateHUDOnly(){var x={valHp:G.hp+'%',valNerves:G.nerves+'%',valMoney:G.money+' €'};Object.keys(x).forEach(function(k){var e=document.getElementById(k);if(e)e.textContent=x[k]});}
  function exportLegacySave(){MG20.Storage.export(G)}
  function importLegacySave(file){MG20.Storage.import(file,function(err,p){if(err)return showToast('❌ Save import klaida');localStorage.setItem(SAVE_KEY,JSON.stringify(p.game));location.reload()})}
  function renderSaveTools(){var e=document.getElementById('tabPass');if(!e||document.getElementById('saveTools'))return;var d=document.createElement('div');d.id='saveTools';d.className='save-tools';d.innerHTML='<button data-action="export-save">💾 Export save</button><label>📥 Import save<input id="importSaveInput" type="file" accept="application/json"></label><button data-action="open-dev">🛠 DEV panel</button>';e.appendChild(d);d.querySelector('#importSaveInput').onchange=function(){if(this.files[0])importLegacySave(this.files[0])}}

  function changeModestasRespect(delta, reason){
    ensureWorldState();
    G.modestasRespect=Math.max(0,Math.min(100,G.modestasRespect+delta));
    var sign=delta>0?'+':'';
    showToast('🔧 Modesto pagarba '+sign+delta+(reason?' • '+reason:''));
    if(typeof checkAchievements==='function')checkAchievements();
  }
  function modestasRespectRank(){var x=MODESTAS_STORY.respectTiers.find(function(t){return G.modestasRespect>=t.min;});return x?x.name:'💢 Eik jau tu...';}
  function garageStage(){var x=MODESTAS_STORY.garageStages.find(function(t){return G.lvl>=t.min;});return x||MODESTAS_STORY.garageStages[MODESTAS_STORY.garageStages.length-1];}
  function modestasDialogue(){
    var m=G.modestasMemory;
    if(m.outsideRepairs>=2)return '„Vėl pas mane? Anie specialistai jau numerį užblokavo?“';
    if(G.modestasRespect>=100)return '„Dabar jau nebesi klientas. Čia ir tavo garažo istorija.“';
    if(G.modestasRespect>=90)return '„Gerai. Imk mano dinamometrinį. Tik padėk ten, kur radai.“';
    if(G.modestasRespect<20)return '„Aš sakau kaip daryčiau. Tu vis tiek paskui darai savaip.“';
    if(m.trustedAdvice>=3)return '„Matau, pradėjai klausyti ne tik variklio, bet ir Modesto.“';
    return '„Neskubam. Geras remontas prasideda nuo geros diagnostikos.“';
  }
  function addPersonalItem(tpl){
    if(G.modestasGifts[tpl.id])return false;
    G.inventory.push({uid:'modestas_'+tpl.id,baseId:tpl.id,type:tpl.type,name:tpl.name,desc:tpl.desc,rarity:tpl.rarity,condition:tpl.condition,effects:tpl.effects});G.modestasGifts[tpl.id]=true;showToast('🎁 Modestas patikėjo tau: '+tpl.name);return true;
  }
  function checkModestasGifts(){MODESTAS_STORY.personalItems.forEach(function(x){if(G.modestasRespect>=x.respect)addPersonalItem(x);});}
  function comboReward(){if(G.modestasCombo===5){addXp(50);showToast('🔧 Modesto serija 5: +50 XP');}if(G.modestasCombo===10){addXp(100);showToast('🔧 Modesto serija 10: +100 XP');}if(G.modestasCombo===20){showToast('🔧 Modesto serija 20: geresnio loot šansas');}if(G.modestasCombo===30){var x=MODESTAS_STORY.personalItems[0];addPersonalItem(x);}}
  function markRepairSuccess(){G.modestasMemory.successfulRepairs++;G.modestasCombo++;comboReward();checkModestasGifts();}
  function getAdviceForLevel(lvl){return MODESTAS_STORY.advice.find(function(x){return x.level===lvl;});}
  function applyStoryValues(e){if(!e)return;if(e.hp)G.hp=Math.max(0,Math.min(125,G.hp+e.hp));if(e.nerves)G.nerves=Math.max(0,Math.min(100,G.nerves+e.nerves));if(e.ta)G.ta=Math.min(getTaCap(G.lvl+1),G.ta+e.ta);if(e.rep){ensureRpgState();G.rpg.reputation+=e.rep;}if(e.respect)changeModestasRespect(e.respect,'Modesto patarimas');}
  function getLifeStory(lvl){return MODESTAS_STORY.lifeStories.find(function(x){return x.level===lvl;});}
  function getFamilyEvent(lvl){return MODESTAS_STORY.familyEvents.find(function(x){return x.level===lvl;});}
  function resolveFamilyEvent(ev){
    if(!ev||G.modestasFamilySeen[ev.level])return;
    G.modestasFamilySeen[ev.level]=true;
    if(ev.respect)changeModestasRespect(ev.respect,'šeimos automobilis Modesto garaže');
    if(ev.nerves)G.nerves=Math.min(100,G.nerves+ev.nerves);
    if(ev.hp)G.hp=Math.min(125,G.hp+ev.hp);
    saveGame();
  }
  function renderModestasBiography(){
    var b=MODESTAS_STORY.biography;
    return '<div class="modestas-story"><b>📖 MODESTO ISTORIJA</b><div class="modestas-memory"><div class="memory-chip">Amžius<b>'+b.age+'</b></div><div class="memory-chip">Šeima<b>Eglė + '+b.daughters+' dukros</b></div><div class="memory-chip">Anksčiau<b>Ugniagesys</b></div></div><div class="garage-stage">Anksčiau dirbo ugniagesiu Mažeikių Naftoje ir tuo pačiu savo servise automechaniku. Prieš metus išėjo iš ugniagesio darbo ir liko prie savo garažo.</div></div>';
  }

  function renderModestasStory(){
    var adv=getAdviceForLevel(G.lvl),st=garageStage(),m=G.modestasMemory;
    var html='<div class="modestas-story"><b>🔧 MODESTAS • '+modestasRespectRank()+'</b><div class="respect-track"><div class="respect-fill" style="width:'+G.modestasRespect+'%"></div></div><div>'+modestasDialogue()+'</div><div class="garage-stage">'+st.name+' • '+st.bonus+'</div><div class="modestas-combo">Serija: '+G.modestasCombo+' remontų su Modestu</div><div class="modestas-memory"><div class="memory-chip">Kartu bossai<b>'+m.bossesTogether+'</b></div><div class="memory-chip">Klausyta patarimų<b>'+m.trustedAdvice+'</b></div><div class="memory-chip">Kiti specialistai<b>'+m.outsideRepairs+'</b></div></div></div>';
    if(adv&&!G.adviceResolved[G.lvl])html+='<div class="advice-box"><b>💬 MODESTAS</b><div>„'+adv.text+'“</div><button class="event-choice" data-action="modestas-advice" data-choice="trust">🔧 Klausyti Modesto</button><button class="event-choice" data-action="modestas-advice" data-choice="ignore">🎲 Daryti savaip</button></div>';
    var life=getLifeStory(G.lvl); if(life)html+='<div class="advice-box"><b>📖 IŠ MODESTO GYVENIMO</b><div>'+life.text+'</div></div>';
    var family=getFamilyEvent(G.lvl); if(family){resolveFamilyEvent(family);html+='<div class="advice-box"><b>'+family.title+'</b><div>'+family.text+'</div></div>';}
    if([1,25,50,75,100].indexOf(G.lvl)>=0)html+=renderModestasBiography();
    return html;
  }

  function isOutsideSpecialistLevel(lvl){return [24,44,74].indexOf(lvl)>=0;}

  function getTaCap(lvl) {
    if (lvl === 1) return 15;
    return Math.min(100, Math.floor(15 + lvl * 0.85));
  }

  function saveGame() { ensureRpgState();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch(e) {}
  }

  function loadGame() {
    try {
      var raw = localStorage.getItem(SAVE_KEY); if(!raw){ for(var lk=0;lk<LEGACY_SAVE_KEYS.length&&!raw;lk++){ raw=localStorage.getItem(LEGACY_SAVE_KEYS[lk]); } }
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s || !s.started || !CARS[s.car] || typeof s.lvl !== 'number') return false;
      for (var k in s) {
        if (Object.prototype.hasOwnProperty.call(s, k)) G[k] = s[k];
      }
      if (!CARS[G.car].mods[G.modIdx]) G.modIdx = 0;
      return true;
    } catch(e) { return false; }
  }

  /* ==========================================================================
     7. STILIZUOTAS AUTOMOBILIO IR KELTUVO SVG GENERATORIUS (PILNAS KONTAKTAS)
     ========================================================================== */
  function buildCarSvg(carKey, colorHex, plateTxt, lifted, showLiftArms) {
    var p = (plateTxt || 'NMP 569').toUpperCase();
    var grille = '<rect x="72" y="56" width="56" height="22" rx="4" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
    if (carKey === 'bmw' || carKey === 'bmw5gt' || carKey === 'bmw7') {
      var h = carKey === 'bmw7' ? 23 : 20;
      grille = '<rect x="71" y="54" width="27" height="' + h + '" rx="5" fill="#0f172a" stroke="#cbd5e1" stroke-width="2.4"/>' +
               '<rect x="102" y="54" width="27" height="' + h + '" rx="5" fill="#0f172a" stroke="#cbd5e1" stroke-width="2.4"/>';
    } else if (carKey === 'jeep') {
      var slots = '';
      for (var i = 0; i < 7; i++) {
        slots += '<rect x="' + (69 + i * 9) + '" y="55" width="6.5" height="20" rx="2" fill="#0f172a" stroke="#e2e8f0" stroke-width="1.4"/>';
      }
      grille = slots;
    } else if (carKey === 'mazda3') {
      grille = '<polygon points="68,55 132,55 122,75 78,75" fill="#0f172a" stroke="#cbd5e1" stroke-width="2.2"/>' +
               '<path d="M92 61 L100 66 L108 61" fill="none" stroke="#38bdf8" stroke-width="2"/>';
    } else if (carKey === 'peugeot508') {
      grille = '<rect x="72" y="56" width="56" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>' +
               '<line x1="38" y1="66" x2="38" y2="82" stroke="#38bdf8" stroke-width="2.5"/>' +
               '<line x1="162" y1="66" x2="162" y2="82" stroke="#38bdf8" stroke-width="2.5"/>';
    } else if (carKey === 'opel') {
      grille = '<rect x="70" y="57" width="60" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.8"/>' +
               '<line x1="72" y1="64" x2="128" y2="64" stroke="#e2e8f0" stroke-width="2.5"/>' +
               '<circle cx="100" cy="64" r="5" fill="#0f172a" stroke="#facc15" stroke-width="2"/>';
    } else if (carKey === 'mb') {
      grille = '<rect x="70" y="55" width="60" height="21" rx="5" fill="#0f172a" stroke="#e2e8f0" stroke-width="2"/>' +
               '<circle cx="100" cy="48" r="4" fill="none" stroke="#f8fafc" stroke-width="1.5"/>';
    } else if (carKey === 'volvo') {
      grille = '<rect x="72" y="56" width="56" height="20" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>' +
               '<line x1="76" y1="74" x2="124" y2="58" stroke="#cbd5e1" stroke-width="2.5"/>';
    }

    var under = lifted ? (
      '<g>' +
        '<rect x="78" y="90" width="44" height="12" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        '<circle cx="92" cy="96" r="2.8" fill="#f59e0b"/>' +
        '<line x1="38" y1="92" x2="78" y2="95" stroke="#94a3b8" stroke-width="3"/>' +
        '<line x1="122" y1="95" x2="162" y2="92" stroke="#94a3b8" stroke-width="3"/>' +
      '</g>'
    ) : '';

    /* Keltuvo gembės, teleskopinės letenos ir guminės atramos, kurios tiesiogiai remiasi į automobilio slenksčius */
    var liftMechanism = '';
    if (showLiftArms === true) {
      var armStroke = lifted ? '#fbbf24' : '#d97706';
      liftMechanism =
        '<g>' +
          /* Kairė ir dešinė keltuvo gembės (slankikliai ant kolonų x=0..10 ir x=190..200) */
          '<rect x="0" y="76" width="11" height="24" rx="2" fill="#475569" stroke="' + armStroke + '" stroke-width="1.5"/>' +
          '<rect x="189" y="76" width="11" height="24" rx="2" fill="#475569" stroke="' + armStroke + '" stroke-width="1.5"/>' +
          /* Kairė teleskopinė letena iki pat automobilio kairiojo slenksčio (x=8 iki x=62) */
          '<rect x="8" y="91" width="54" height="6" rx="2" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>' +
          '<rect x="24" y="92" width="36" height="4" rx="1" fill="#fbbf24"/>' +
          /* Dešinė teleskopinė letena iki pat automobilio dešiniojo slenksčio (x=138 iki x=192) */
          '<rect x="138" y="91" width="54" height="6" rx="2" fill="#f59e0b" stroke="#78350f" stroke-width="1.2"/>' +
          '<rect x="140" y="92" width="36" height="4" rx="1" fill="#fbbf24"/>' +
          /* Guminės atraminės pagalvėlės (domkrato padas), besiremiančios tiesiai į kėbulo dugną y=87..91 */
          '<rect x="45" y="87" width="15" height="5" rx="1.5" fill="#0f172a" stroke="#facc15" stroke-width="1.3"/>' +
          '<rect x="140" y="87" width="15" height="5" rx="1.5" fill="#0f172a" stroke="#facc15" stroke-width="1.3"/>' +
        '</g>';
    }

    return '<svg viewBox="0 0 200 112" width="100%" height="98">' +
      under +
      /* Padangos */
      '<rect x="20" y="72" width="22" height="32" rx="5" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
      '<rect x="158" y="72" width="22" height="32" rx="5" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
      /* Keltuvo letenos ir atramos, laikančios automobilį */
      liftMechanism +
      /* Stogas ir langas */
      '<path d="M46 42 L64 16 L136 16 L154 42 Z" fill="' + colorHex + '" stroke="#e2e8f0" stroke-width="2"/>' +
      '<path d="M53 40 L67 21 L133 21 L147 40 Z" fill="#0f172a"/>' +
      /* Pagrindinis kėbulas (apatinė briauna y=90 remiasi tiesiai į keltuvo pagalvėles y=87..91) */
      '<rect x="28" y="42" width="144" height="48" rx="11" fill="' + colorHex + '" stroke="#e2e8f0" stroke-width="2"/>' +
      '<polygon points="34,54 64,56 62,68 34,66" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>' +
      '<polygon points="166,54 136,56 138,68 166,66" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>' +
      grille +
      '<rect x="64" y="76" width="72" height="15" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>' +
      '<rect x="65" y="77" width="12" height="13" fill="#1d4ed8"/>' +
      '<text x="71" y="86" fill="#fff" font-size="6.5" font-weight="900" text-anchor="middle">LT</text>' +
      '<text x="106" y="87" fill="#0f172a" font-size="9.5" font-weight="900" text-anchor="middle" letter-spacing="1">' + p + '</text>' +
    '</svg>';
  }

  /* ==========================================================================
     8. KONFIGŪRATORIAUS ATVAIZDAVIMAS
     ========================================================================== */
  function renderConfigurator() {
    var bGrid = document.getElementById('brandGrid');
    var keys = Object.keys(CARS);
    var bHtml = '';
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var c = CARS[k];
      bHtml += '<button type="button" class="brand-btn ' + (G.car === k ? 'active' : '') + '" data-action="pick-brand" data-brand="' + k + '">' +
        '<span class="b-ico">' + c.icon + '</span>' +
        '<span class="b-name">' + c.name + '</span>' +
        '<span class="b-cls">' + c.cls + '</span>' +
      '</button>';
    }
    bGrid.innerHTML = bHtml;

    var curCar = CARS[G.car] || CARS.audi;
    var mList = document.getElementById('modList');
    var mHtml = '';
    for (var j = 0; j < curCar.mods.length; j++) {
      var m = curCar.mods[j];
      mHtml += '<div class="mod-card ' + (G.modIdx === j ? 'active' : '') + '" data-action="pick-mod" data-mod="' + j + '">' +
        '<div class="mod-left">' +
          '<div class="mod-chk">✓</div>' +
          '<div>' +
            '<div class="mod-name"><span>' + m.code + '</span></div>' +
            '<div class="mod-desc">' + m.desc + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="mod-badge">' + m.bonusTxt + '</div>' +
      '</div>';
    }
    mList.innerHTML = mHtml;

    var cRow = document.getElementById('colorRow');
    var cHtml = '';
    for (var n = 0; n < COLORS.length; n++) {
      var col = COLORS[n];
      cHtml += '<div class="c-swatch ' + (G.color === col.hex ? 'active' : '') + '" style="background:' + col.hex + ';" data-action="pick-color" data-color="' + col.hex + '" title="' + col.name + '"></div>';
    }
    cRow.innerHTML = cHtml;

    var dGrid=document.getElementById('difficultyGrid'); if(dGrid){var dh='';Object.keys(WORLD_DATA.difficulties).forEach(function(k){var d=WORLD_DATA.difficulties[k];dh+='<button type="button" class="difficulty-btn '+(G.difficulty===k?'active':'')+'" data-action="pick-difficulty" data-difficulty="'+k+'"><b>'+d.name+'</b><small>'+d.desc+'</small></button>';});dGrid.innerHTML=dh;}
    var difficultyLabel=document.getElementById('difficultyLabel'); if(difficultyLabel) difficultyLabel.textContent=WORLD_DATA.difficulties[G.difficulty].name;
    var passive=passiveCfg();
    var prev = document.getElementById('cfgPreview');
    prev.innerHTML =
      '<div style="max-width:185px;margin:0 auto;">' + buildCarSvg(G.car, G.color, G.plate, false, false) + '</div>' +
      '<div style="font-size:13px;font-weight:900;color:var(--gold-lt);margin-top:6px;">' +
        curCar.name + ' • ' + curCar.mods[G.modIdx].code +
      '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:5px;">' +
        '<div class="passive-card"><b>🚗 '+passive.name+':</b> '+passive.desc+'</div>Modelio ligos: <b style="color:#e2e8f0;">' + curCar.ill[0] + '</b> (25 lyg.) | <b style="color:#e2e8f0;">' + curCar.ill[1] + '</b> (60 lyg.) | <b style="color:#e2e8f0;">' + curCar.ill[2] + '</b> (95 lyg.)' +
      '</div>';
  }

  /* ==========================================================================
     9. ŽALOS IR LYGIŲ LOGIKA
     ========================================================================== */
  function getAttackRanges() {
    var c = CARS[G.car] || CARS.audi;
    var mod = c.mods[G.modIdx] || c.mods[0];
    var liftBonus = G.liftUp ? 3 : 0; // Pakėlus ant keltuvo patogiau pasiekti varžtus (+3 DMG)
    var mechBonus = 1 + skillLevel('steady_hand') * 0.04;
      var base = (c.str + (mod.dmg || 0) + G.bonusDmg + liftBonus) * mechBonus;
    var pamperMult = G.pamperBuff ? 1.2 : 1;
    var mult = (G.obdScannedLvl === G.lvl ? (G.items.vcds ? 1.35 : 1.25) : 1) * (G.fortuneRolledLvl === G.lvl ? G.fortuneMult : 1) * pamperMult;
    return {
      basicMin: Math.round((base + 2) * mult),
      basicMax: Math.round((base + 14) * mult),
      heatMin: Math.round((base + 13) * mult * (1 + skillLevel('rust_specialist') * 0.06)),
      heatMax: Math.round((base + 25) * mult * (1 + skillLevel('rust_specialist') * 0.06)),
      tqNormMax: Math.round((base + 18) * mult),
      tqCritMin: Math.round((base + 28) * mult),
      tqCritMax: Math.round((base + 48) * mult)
    };
  }

  function shuffleThree() {
    var arr = [0, 1, 2];
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    if (arr[0] === 0 && arr[1] === 1 && arr[2] === 2) {
      arr = [1, 2, 0];
    }
    return arr;
  }

  function enterLevel(lvl) {
    ensureRpgState();
    if (G.started && lvl > G.lvl) awardLevelCompletion(G.lvl);
    G.lvl = Math.max(1, Math.min(100, lvl));
    var ld = getLevelData(G.lvl, G.car);
    G.seqStep = 1;
    G.seqOrder = shuffleThree();
    G.tqActive = false;
    G.customMood = '';
    G.pamperBuff = false;

    // Pradedant lygį keltuvas nuleistas, kad žaidėjas galėtų pats nuspręsti, kada pakelti už -10 €
    G.liftUp = false;
    G.liftReasonTxt = '';

    if (ld.mode === 'COMBAT') {
      G.combat = {
        name: ld.bossName,
        hp: ld.bossHp,
        maxHp: ld.bossHp,
        dmg: ld.bossDmg,
        turns: 0,
        dealt: 0,
        startHp: G.hp,
        startNerves: G.nerves,
        log: '🚨 <b>RIMTAS REMONTO BOSAS:</b> ' + ld.speech + ' (💡 Patarimas: pakelk automobilį keltuvu už 10 €, kad gautum +3 DMG!)'
      };
      showToast('⚔️ Boso etapas! Gali pakelti automobilį keltuvu (-10 €) arba palepinti Modesto.');
    } else {
      G.combat = null;
    }
    saveGame();
    renderAll();
  }

  function renderAll() {
    ensureInventoryState();
    ensureWorldState();
    if (!G.started) {
      document.getElementById('configScreen').style.display = 'block';
      document.getElementById('gameScreen').style.display = 'none';
      document.getElementById('bottomNav').style.display = 'none';
      renderConfigurator();
      return;
    }

    document.getElementById('configScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('bottomNav').style.display = 'grid';

    var c = CARS[G.car] || CARS.audi;
    var mod = c.mods[G.modIdx] || c.mods[0];
    var ld = getLevelData(G.lvl, G.car);
    var cap = getTaCap(G.lvl);
    G.ta = Math.min(G.ta, cap);

    document.getElementById('soundBtn').textContent = G.sound ? '🔊 Garsas' : '🔇 Tyla';
    document.getElementById('hudPlate').textContent = G.plate;
    document.getElementById('hudCarName').textContent = c.name.toUpperCase() + ' • ' + mod.code;
    document.getElementById('hudLvl').textContent = 'LYGIS ' + G.lvl + ' / 100';
    document.getElementById('modMood').textContent = G.customMood || MOODS[(G.lvl - 1) % MOODS.length];

    var illMilestones = [25, 60, 95];
    var illClasses = ['ill-dpf', 'ill-oil', 'ill-chk'];
    var illHtml = '';
    for (var i = 0; i < c.ill.length; i++) {
      var cured = G.illCured[i];
      var dtcObj = c.dtc[i];
      illHtml += '<div class="ill-pill ' + illClasses[i] + ' ' + (cured ? 'ill-cured' : '') + '">' +
        '<div class="ill-top-line">' +
          '<span class="ill-code-tag">' + (dtcObj ? dtcObj.code : 'DTC') + '</span>' +
          '<span class="ill-lvl-badge">' + (cured ? '✓ IŠGYDYTA' : ('🎯 ' + illMilestones[i] + ' lyg.')) + '</span>' +
        '</div>' +
        '<div class="ill-name-txt" title="' + c.ill[i] + '">' + c.ill[i] + '</div>' +
      '</div>';
    }
    document.getElementById('hudIllRow').innerHTML = illHtml;

    document.getElementById('valHp').textContent = G.hp + '%';
    document.getElementById('barHp').style.width = G.hp + '%';
    document.getElementById('valNerves').textContent = G.nerves + '%';
    document.getElementById('barNerves').style.width = G.nerves + '%';
    document.getElementById('valMoney').textContent = G.money + ' €';
    document.getElementById('valTa').textContent = G.ta + ' iš ' + cap + '%';
    document.getElementById('barTa').style.width = Math.min(100, Math.round((G.ta / cap) * 100)) + '%';

    document.getElementById('sagaNameLbl').textContent = ld.saga;
    document.getElementById('barCamp').style.width = G.lvl + '%';
    document.getElementById('campPctLbl').textContent = G.lvl + '%';

    var lb = document.getElementById('liftBanner');
    var bay = document.getElementById('liftBay');
    var liftBtn = document.getElementById('liftToggleBtn');
    if (G.liftUp) {
      lb.classList.add('up');
      bay.classList.add('up');
      document.getElementById('liftStatusTxt').textContent = '⬆️ ' + (G.liftReasonTxt || 'KELTUVAS PAKELTAS') + ' (+3 DMG)';
      if (liftBtn) liftBtn.textContent = '⬇️ Nuleisti (0 €)';
    } else {
      lb.classList.remove('up');
      bay.classList.remove('up');
      document.getElementById('liftStatusTxt').textContent = '⬇️ KELTUVAS NULEISTAS (ATRAMA PO SLENKSČIAIS)';
      if (liftBtn) liftBtn.textContent = '🏗️ Pakelti (-10 €)';
    }
    document.getElementById('stageCarSvg').innerHTML = buildCarSvg(G.car, G.color, G.plate, G.liftUp, true);

    var dieEl = document.getElementById('d20Die');
    var dieLbl = document.getElementById('d20Lbl');
    if (G.fortuneRolledLvl === G.lvl) {
      dieEl.classList.add('locked');
      dieLbl.textContent = G.fortuneTxt || '✓ Fortūna išnaudota';
    } else {
      dieEl.classList.remove('locked');
      dieLbl.textContent = '🎲 Fortūna (1x/lyg.)';
    }

    renderEncounter(ld);
    renderObdTab();
    renderShopTab();
    renderPassTab();
    renderRpgTab();
    renderInventoryTab();
    renderSaveTools();
      renderRpgTab();
  }

  /* ==========================================================================
     10. LYGIŲ TIPŲ IR UŽDUOČIŲ RENDERINIMAS
     ========================================================================== */
  function renderEncounter(ld) {
    var box = document.getElementById('encounterCard');

    // 1 TIPAS: BOSO KOVA SU NEATSUKAMAIS VARŽTAIS IR LIGOMIS
    if (ld.mode === 'COMBAT' && G.combat) {
      var cb = G.combat;
      var pct = Math.max(0, Math.round((cb.hp / cb.maxHp) * 100));
      var dmg = getAttackRanges();

      var tqHtml = G.tqActive ? (
        '<div class="torque-box">' +
          '<div style="font-size:12px;font-weight:900;color:var(--gold-lt);">🎯 DINAMOMETRINIS RAKTAS: SUSTABDYK ŽALIOJE ZONOJE (120 Nm)!</div>' +
          '<div class="tq-track">' +
            '<div class="tq-zone"></div>' +
            '<div id="tqNeedle" class="tq-needle" style="left:' + G.tqPos + '%;"></div>' +
          '</div>' +
          '<button type="button" class="btn-start" data-action="stop-torque" style="padding:8px;">' +
            '<span class="btn-start-main" style="font-size:13px;">⚡ FIKSUOTI SUKIMO MOMENTĄ!</span>' +
          '</button>' +
        '</div>'
      ) : '';

      var cureBanner = '';
      if (G.lvl === 25) cureBanner = '<div style="font-size:11px;color:var(--cyan-lt);font-weight:800;margin-bottom:6px;">🎯 25 LYGIO MODELIO LIGA: Nugalėjęs šį bosą išgydysi 1-ąją DTC klaidą!</div>';
      if (G.lvl === 60) cureBanner = '<div style="font-size:11px;color:var(--red-lt);font-weight:800;margin-bottom:6px;">🎯 60 LYGIO MODELIO LIGA: Nugalėjęs šį bosą išgydysi 2-ąją DTC klaidą!</div>';
      if (G.lvl === 95) cureBanner = '<div style="font-size:11px;color:var(--gold-lt);font-weight:800;margin-bottom:6px;">🎯 95 LYGIO MODELIO LIGA: Nugalėjęs šį bosą išgydysi 3-iąją DTC klaidą!</div>';

      box.innerHTML =
        '<div class="mode-tag">⚔️ KOVA SU NEATSUKAMAIS VARŽTAIS (BOSO ETAPAS)</div>' +
        '<div style="font-size:15px;font-weight:900;margin-bottom:6px;">' + ld.title + '</div>' +
        cureBanner +
        '<div class="speech-bubble">' + cb.log + '</div>' +

        '<div class="boss-card">' +
          (MODESTAS_STORY.bossLore[G.lvl] ? '<div class="advice-box"><b>💬 MODESTAS</b><div>'+MODESTAS_STORY.bossLore[G.lvl]+'</div></div>' : '') +
          '<div class="boss-top">' +
            '<span>' + cb.name + '</span>' +
            '<span>❤️ ' + cb.hp + ' / ' + cb.maxHp + ' HP (' + pct + '%)</span>' +
          '</div>' +
          '<div class="boss-hp-track">' +
            '<div class="boss-hp-fill" style="width:' + pct + '%;"></div>' +
            '<div class="boss-hp-txt">' + cb.hp + ' / ' + cb.maxHp + ' HP (' + pct + '%)</div>' +
          '</div>' +

          '<div class="combat-player-hud">' +
            '<div class="cp-item">' +
              '<div style="color:var(--green);">🔧 Tech. HP: ' + G.hp + '/100</div>' +
              '<div class="mini-bar"><div class="mini-fill" style="width:' + G.hp + '%;background:var(--green);"></div></div>' +
            '</div>' +
            '<div class="cp-item">' +
              '<div style="color:var(--purple-lt);">🧠 Nervai: ' + G.nerves + '/100</div>' +
              '<div class="mini-bar"><div class="mini-fill" style="width:' + G.nerves + '%;background:var(--purple);"></div></div>' +
            '</div>' +
            '<div class="cp-item" style="color:var(--gold);font-size:12px;padding-left:4px;">💶 ' + G.money + ' €</div>' +
          '</div>' +
        '</div>' +

        tqHtml +

        '<div class="choice-list">' +
          '<button type="button" class="choice-btn" data-action="combat-atk" data-type="basic">' +
            '<div class="choice-title"><span>🔧 Veržliarakčio Smūgis</span><span>0 €</span></div>' +
            '<div class="choice-sub">💥 Žala: ' + dmg.basicMin + '–' + dmg.basicMax + ' DMG | D20 + Variklio jėga' + (G.pamperBuff ? ' (+20% Modesto įkvėpimas!)' : '') + '</div>' +
          '</button>' +
          '<button type="button" class="choice-btn" data-action="combat-atk" data-type="heat">' +
            '<div class="choice-title"><span>🔥 Kaitinimas Dujiniu Degikliu + WD-40</span><span>10 €</span></div>' +
            '<div class="choice-sub">💥 Žala: ' + dmg.heatMin + '–' + dmg.heatMax + ' DMG | Atleidžia užkepusį sriegį</div>' +
          '</button>' +
          '<button type="button" class="choice-btn" data-action="combat-atk" data-type="torque">' +
            '<div class="choice-title"><span>🎯 Dinamometrinis Raktas (Tikslumo Mini-Žaidimas)</span><span>Nm</span></div>' +
            '<div class="choice-sub">💥 Žalia zona: ' + dmg.tqCritMin + '–' + dmg.tqCritMax + ' DMG! (Nepataikius: iki ' + dmg.tqNormMax + ' DMG)</div>' +
          '</button>' +
          (G.lvl % 2 === 1 ? (
            '<button type="button" class="choice-btn" data-action="combat-atk" data-type="coffee">' +
              '<div class="choice-title"><span>☕ Palepinti Modesto: Degalinės Kava ir Šokoladukas</span><span>15 €</span></div>' +
              '<div class="choice-sub">💚 Atstato +25 Meistro Modesto Nervų ir +18 Tech. HP</div>' +
            '</button>'
          ) : (
            '<button type="button" class="choice-btn" data-action="combat-atk" data-type="kebab_pamper">' +
              '<div class="choice-title"><span>🌯 Palepinti Modesto: Šiltas Kebabas ir Arbatpinigiai</span><span>25 €</span></div>' +
              '<div class="choice-sub">🔥 Atstato +40 Nervų, +25 Tech. HP ir suteikia +20% DMG kitam smūgiui!</div>' +
            '</button>'
          )) +
        '</div>';
      return;
    }

    // 2 TIPAS: VEIKSMŲ EILIŠKUMO DĖLIONĖ (SEQUENCE)
    if (ld.mode === 'SEQUENCE') {
      var taskObj = SEQUENCE_TASKS[G.lvl % SEQUENCE_TASKS.length];
      var seqHtml = '<div style="font-size:11.5px;color:var(--gold-lt);font-weight:800;margin-bottom:8px;">📋 Sudėliok reikalingus remonto veiksmus teisinga eilės tvarka (Dabar reikia: ' + G.seqStep + ' iš 3):</div>';

      for (var s = 0; s < G.seqOrder.length; s++) {
        var idx = G.seqOrder[s];
        var st = taskObj.steps[idx];
        var isDone = st.order < G.seqStep;
        seqHtml +=
          '<button type="button" class="choice-btn ' + (isDone ? 'done-step' : '') + '" data-action="seq-pick" data-order="' + st.order + '" ' + (isDone ? 'disabled' : '') + '>' +
            '<div class="choice-title">' +
              '<span>' + (isDone ? '✅ ' : '🔧 ') + st.title + '</span>' +
              '<span>' + (isDone ? 'Atlikta' : 'Pasirinkti') + '</span>' +
            '</div>' +
            '<div class="choice-sub">' + (isDone ? '✓ Šis žingsnis sėkmingai įvykdytas' : 'Paspausk, jei manai, kad tai sekantis technologinis veiksmas') + '</div>' +
          '</button>';
      }

      seqHtml +=
        '<button type="button" class="choice-btn" data-action="resolve-noncombat" data-opt="pamper_kebab" style="border-color:rgba(245,158,11,0.45);">' +
          '<div class="choice-title"><span>🌯 Palepinti Meistrą Modestą kebabu ir kava (Atliks visą seką!)</span><span>20 €</span></div>' +
          '<div class="choice-sub">😋 Modesto pats sujungia visus mazgus be klaidų: +30 Nervų, +15 Tech. HP ir +2% TA</div>' +
        '</button>';

      box.innerHTML =
        '<div class="mode-tag">⚡ TECHNOLOGINĖ VEIKSMŲ SEKA (SUDĖK EILĖS TVARKA)</div>' +
        '<div style="font-size:15px;font-weight:900;margin-bottom:6px;">' + ld.title + '</div>' +
        '<div class="speech-bubble">' + ld.speech + '</div>' +
        '<div class="choice-list">' + seqHtml + '</div>';
      return;
    }

    // 3, 4, 5, 6 TIPAI: DILEMA (STORY), DETEKTYVAS (DETECTIVE), DERYBOS (HAGGLE), BANDOMASIS VAŽIAVIMAS (TESTDRIVE)
    var modeTitle = '📖 GARAŽO DILEMA (D20 PATIKRA)';
    if (ld.mode === 'DETECTIVE') modeTitle = '🔍 DIAGNOSTIKOS DETEKTYVAS';
    if (ld.mode === 'HAGGLE') modeTitle = '🤝 DERYBOS PAS VITALIJŲ ŠROTE';
    if (ld.mode === 'TESTDRIVE') modeTitle = '🛣️ BANDOMASIS VAŽIAVIMAS';

    var choicesHtml = '';
    var opts = getContextualChoices(ld);
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      choicesHtml +=
        '<button type="button" class="choice-btn" data-action="resolve-noncombat" data-opt="' + o.opt + '">' +
          '<div class="choice-title"><span>' + o.title + '</span><span>' + o.cost + '</span></div>' +
          '<div class="choice-sub">' + o.sub + '</div>' +
        '</button>';
    }

    box.innerHTML =
      '<div class="mode-tag">' + modeTitle + '</div>' +
      '<div style="font-size:15px;font-weight:900;margin-bottom:6px;">' + ld.title + '</div>' +
      '<div class="speech-bubble">' + ld.speech + '</div>' +
      '<div class="choice-list">' + choicesHtml + '</div>';
  }

  /* ==========================================================================
     11. OBD2 DIAGNOSTIKOS, ŠROTO IR PASO SKIRTUKAI
     ========================================================================== */
  function renderObdTab() {
    var el = document.getElementById('tabObd');
    var c = CARS[G.car] || CARS.audi;
    var ld = getLevelData(G.lvl, G.car);
    var scanCost = G.items.vcds ? 0 : 15;
    var scanBonus = G.items.vcds ? 35 : 25;
    var scanned = G.obdScannedLvl === G.lvl;
    var canClear = (G.lvl - G.faultClearLvl) >= 3;

    var sootG = G.illCured[0] ? '4.2 g' : '42.8 g';
    var oilBar = G.illCured[1] ? '2.4 bar' : '0.9 bar';
    var battV = G.illCured[2] ? '14.3 V' : '11.8 V';
    var tempC = (86 + (G.lvl % 7)) + ' °C';

    var dtcHtml = '';
    for (var i = 0; i < c.dtc.length; i++) {
      var d = c.dtc[i];
      var cured = G.illCured[i];
      dtcHtml +=
        '<div class="dtc-card ' + (cured ? 'resolved' : '') + '">' +
          '<div class="dtc-header">' +
            '<span class="dtc-code">' + d.code + ' • ' + d.sys + '</span>' +
            '<span class="dtc-solve-badge">' +
              (cured ? '✓ IŠSPRĘSTA VISAM LAIKUI' : ('🎯 Išsprendžiama: ' + d.lvl + ' lygyje')) +
            '</span>' +
          '</div>' +
          '<div class="dtc-title">' + d.name + '</div>' +
          '<div class="dtc-desc">' + d.desc + '</div>' +
        '</div>';
    }

    var stageCode = 'P0' + (100 + G.lvl * 7);
    dtcHtml +=
      '<div class="dtc-card current-stage">' +
        '<div class="dtc-header">' +
          '<span class="dtc-code" style="background:rgba(245,158,11,0.22);border-color:var(--gold);color:var(--gold-lt);">' + stageCode + ' • Einamasis Etapas</span>' +
          '<span class="dtc-solve-badge">🔧 Išsprendžiama: šiame (' + G.lvl + ') lygyje</span>' +
        '</div>' +
        '<div class="dtc-title">' + ld.epTitle + '</div>' +
        '<div class="dtc-desc">Aktyvus šio remonto etapo mazgas. Nuskenavęs gyvus parametrus gausi +' + scanBonus + '% žalos premiją!</div>' +
      '</div>';

    el.innerHTML =
      '<div class="card">' +
        '<div class="sec-lbl"><span>💻 OBD2 DIAGNOSTIKA IR KLAIDŲ KODŲ SĄRAŠAS</span><span>TA LUBOS: ' + getTaCap(G.lvl) + '%</span></div>' +

        '<div class="obd-telemetry-grid">' +
          '<div class="obd-sensor"><div class="obd-s-lbl">DPF SUODŽIAI</div><div class="obd-s-val">' + sootG + '</div></div>' +
          '<div class="obd-sensor"><div class="obd-s-lbl">TEPALO SLĖGIS</div><div class="obd-s-val">' + oilBar + '</div></div>' +
          '<div class="obd-sensor"><div class="obd-s-lbl">ĮTAMPA (ECU)</div><div class="obd-s-val">' + battV + '</div></div>' +
          '<div class="obd-sensor"><div class="obd-s-lbl">AUŠINIMAS</div><div class="obd-s-val">' + tempC + '</div></div>' +
        '</div>' +

        '<div class="sec-lbl gold-lbl" style="margin-bottom:8px;"><span>📋 AKTYVŪS IR IŠSPRĘSTI DTC KLAIDŲ KODAI (' + c.name.toUpperCase() + ')</span></div>' +
        '<div class="dtc-list">' + dtcHtml + '</div>' +

        '<div class="choice-list">' +
          '<button type="button" class="choice-btn" data-action="obd-scan" ' + (scanned ? 'disabled style="opacity:0.55;"' : '') + '>' +
            '<div class="choice-title"><span>📊 Gyvų Parametrų Skenavimas (1x per lygį)</span><span>' + scanCost + ' €</span></div>' +
            '<div class="choice-sub">' + (scanned ? ('✓ Šiame lygyje jau nuskenuota (+' + scanBonus + '% DMG aktyvuota!)') : ('💥 Suteikia +' + scanBonus + '% žalos šio lygio kovai ir +1% TA')) + '</div>' +
          '</button>' +
          '<button type="button" class="choice-btn" data-action="obd-clear" ' + (!canClear ? 'disabled style="opacity:0.55;"' : '') + '>' +
            '<div class="choice-title"><span>🧹 Laikinas Klaidų Trynimas (kas 3 lyg.)</span><span>30 €</span></div>' +
            '<div class="choice-sub">' + (canClear ? '🛡️ Sumažina boso daromą žalą -3 DMG ir atstato +15 Nervų' : '⏳ Galėsi naudoti po kelių lygių') + '</div>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  function renderShopTab() {
    var el = document.getElementById('tabShop');
    var cats = [
      { id: 'all', lbl: 'Visos (13)' },
      { id: 'aferos', lbl: '🎲 Vitalijaus Aferos' },
      { id: 'chem', lbl: '🌯 Maistas Modesto / Chemija' },
      { id: 'tools', lbl: '🔩 Įrankiai' }
    ];
    var catHtml = '';
    for (var i = 0; i < cats.length; i++) {
      var c = cats[i];
      catHtml += '<button type="button" class="cat-pill ' + (G.shopCat === c.id ? 'active' : '') + '" data-action="shop-cat" data-cat="' + c.id + '">' + c.lbl + '</button>';
    }

    var itemsHtml = '';
    for (var j = 0; j < SHOP_ITEMS.length; j++) {
      var it = SHOP_ITEMS[j];
      if (G.shopCat !== 'all' && it.cat !== G.shopCat) continue;
      var owned = !it.repeat && G.items[it.id];
      var discountRate = (G.discount ? 0.20 : 0) + skillLevel('bargainer') * 0.04;
        var finalPrice = it.price > 0 ? Math.round(it.price * (1 - Math.min(0.45, discountRate)) * difficultyCfg().shop * (1 + (passiveCfg().shop||0))) : it.price;
      var priceLbl = it.id === 'sell_cat' ? 'Gausi +85 €' : (finalPrice + ' €');

      itemsHtml +=
        '<div class="shop-card">' +
          '<div class="shop-top">' +
            '<div class="shop-title">' + it.name + '</div>' +
            '<div class="shop-price">' + (owned ? '✓ Nupirkta' : priceLbl) + '</div>' +
          '</div>' +
          '<div class="shop-desc">' + it.desc + '</div>' +
          '<button type="button" class="shop-buy-btn" data-action="buy-item" data-id="' + it.id + '" ' + (owned ? 'disabled' : '') + '>' +
            (owned ? '✓ Jau Tavo Garaže' : 'Pirkti / Naudoti') +
          '</button>' +
        '</div>';
    }

    el.innerHTML =
      '<div class="card">' +
        '<div class="sec-lbl">' +
          '<span>🛒 VITALIJAUS „ŠROTAS“ IR BONUS DALYS</span>' +
          '<span>💶 ' + G.money + ' €</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--green-lt);margin-bottom:8px;font-weight:700;">' +
          (G.discount ? '✓ Aktyvi Vitalijaus -20% nuolaida visoms prekėms!' : '💡 Pavaišink Vitalijų gira ir gauk -20% nuolaidą visoms detalėms!') +
        '</div>' +
        '<div class="cat-row">' + catHtml + '</div>' +
        '<div>' + itemsHtml + '</div>' +
      '</div>';
  }

  function renderPassTab() {
    var el = document.getElementById('tabPass');
    var c = CARS[G.car] || CARS.audi;
    var mod = c.mods[G.modIdx] || c.mods[0];
    var dmg = getAttackRanges();
    var curedCount = (G.illCured[0] ? 1 : 0) + (G.illCured[1] ? 1 : 0) + (G.illCured[2] ? 1 : 0);

    el.innerHTML =
      '<div class="card">' +
        '<div class="sec-lbl"><span>📋 AUTOMOBILIO TECHNINIS PASAS</span><span>Lygis ' + G.lvl + ' / 100</span></div>' +
        '<div style="max-width:165px;margin:0 auto 10px;">' + buildCarSvg(G.car, G.color, G.plate, false, false) + '</div>' +
        '<div class="stat-row"><span>Automobilio modelis:</span><strong>' + c.name + ' (' + c.cls + ')</strong></div>' +
        '<div class="stat-row"><span>Variklio modifikacija:</span><strong>' + mod.code + '</strong></div>' +
        '<div class="stat-row"><span>Variklio bonusas:</span><strong style="color:var(--gold-lt);">' + mod.bonusTxt + '</strong></div>' +
        '<div class="stat-row"><span>Valstybinis numeris:</span><strong>' + G.plate + '</strong></div>' +
        '<div class="stat-row"><span>Techninės apžiūros (TA) šansas:</span><strong style="color:var(--cyan-lt);">' + G.ta + '% (Lubos: ' + getTaCap(G.lvl) + '%)</strong></div>' +
        '<div class="stat-row"><span>Veržliarakčio bazinė žala:</span><strong>' + dmg.basicMin + '–' + dmg.basicMax + ' DMG</strong></div>' +
        '<div class="stat-row"><span>Dinamometrinio rakto kritinis:</span><strong style="color:var(--green-lt);">' + dmg.tqCritMin + '–' + dmg.tqCritMax + ' DMG</strong></div>' +
        '<div class="stat-row"><span>Išgydytos modelio ligos:</span><strong>' + curedCount + ' iš 3 (25 / 60 / 95 lyg.)</strong></div>' +
        '<div style="margin-top:14px;">' +
          '<button type="button" class="shop-buy-btn" data-action="reset-game" style="border-color:var(--red);color:#fca5a5;">' +
            '🗑️ Pradėti Žaidimą Iš Naujo (Keisti Automobilį)' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  /* ==========================================================================
     12. KOVOS REZULTATŲ IR PERKROVIMO MODALINIAI LANGAI
     ========================================================================== */
  function showBattleModal(victory) {
    var cb = G.combat;
    if (!cb) return;
    var c = CARS[G.car] || CARS.audi;
    var modal = document.getElementById('battleResultModal');
    var content = document.getElementById('battleModalContent');

    var rewardMoney = victory ? (30 + (G.lvl % 10 === 0 ? 35 : 0)) : -20;
    var rewardTa = victory ? 3 : 1;
    var curedNotice = '';

    if (victory) { awardLoot('boss', true); changeModestasRespect(3, 'kartu įveiktas remonto bosas'); G.modestasMemory.bossesTogether++; markRepairSuccess(); } else { G.modestasMemory.failures++; }
    if (victory && G.lvl === 25 && !G.illCured[0]) {
      G.illCured[0] = true;
      curedNotice = '🎉 IŠGYDYTA 1-OJI MODELIO LIGA (25 lyg.): ' + c.ill[0] + ' (' + c.dtc[0].code + ')!';
    }
    if (victory && G.lvl === 60 && !G.illCured[1]) {
      G.illCured[1] = true;
      curedNotice = '🎉 IŠGYDYTA 2-OJI MODELIO LIGA (60 lyg.): ' + c.ill[1] + ' (' + c.dtc[1].code + ')!';
    }
    if (victory && G.lvl === 95 && !G.illCured[2]) {
      G.illCured[2] = true;
      curedNotice = '🎉 IŠGYDYTA 3-IOJI MODELIO LIGA (95 lyg.): ' + c.ill[2] + ' (' + c.dtc[2].code + ')!';
    }

    G.money = Math.max(0, G.money + rewardMoney);
    G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + rewardTa);
    if (!victory) {
      G.hp = Math.max(35, G.hp);
      G.nerves = Math.max(35, G.nerves);
    }

    var hpDiff = G.hp - cb.startHp;
    var nrvDiff = G.nerves - cb.startNerves;

    content.innerHTML =
      '<div style="text-align:center;margin-bottom:10px;">' +
        '<div style="font-size:34px;">' + (victory ? '🏆' : '💥') + '</div>' +
        '<div style="font-size:16px;font-weight:900;color:' + (victory ? 'var(--gold-lt)' : '#fca5a5') + ';">' +
          (victory ? 'PERGALĖ REMONTO KOVOJE!' : 'AVARINIS REMONTAS (PRALAIMĖJIMAS)') +
        '</div>' +
        '<div style="font-size:12px;color:var(--muted);margin-top:2px;">' + cb.name + '</div>' +
      '</div>' +

      '<div style="background:#080d1a;border:1px solid #1e293b;border-radius:10px;padding:10px;margin-bottom:10px;">' +
        '<div class="stat-row"><span>⚔️ Bendra padaryta žala:</span><strong style="color:var(--gold-lt);">' + cb.dealt + ' DMG (' + cb.turns + ' ėjimai)</strong></div>' +
        '<div class="stat-row"><span>🔧 Tech. HP pokytis:</span><strong style="color:' + (hpDiff >= 0 ? 'var(--green)' : 'var(--red)') + ';">' + (hpDiff >= 0 ? '+' + hpDiff : hpDiff) + ' HP (Liko: ' + G.hp + '%)</strong></div>' +
        '<div class="stat-row"><span>🧠 Meistro Modesto Nervų pokytis:</span><strong style="color:' + (nrvDiff >= 0 ? 'var(--purple-lt)' : 'var(--red)') + ';">' + (nrvDiff >= 0 ? '+' + nrvDiff : nrvDiff) + ' (Liko: ' + G.nerves + '%)</strong></div>' +
        '<div class="stat-row"><span>💶 Biudžeto premija:</span><strong style="color:var(--gold);">' + (rewardMoney >= 0 ? '+' + rewardMoney : rewardMoney) + ' €</strong></div>' +
        '<div class="stat-row" style="border:none;"><span>📈 TA Šanso pokytis:</span><strong style="color:var(--cyan-lt);">+' + rewardTa + '% TA</strong></div>' +
      '</div>' +

      (curedNotice ? '<div style="background:rgba(16,185,129,0.18);border:1px solid var(--green);color:#6ee7b7;padding:8px;border-radius:8px;font-size:11px;font-weight:800;text-align:center;margin-bottom:10px;">' + curedNotice + '</div>' : '') +

      '<button type="button" class="btn-start" data-action="close-battle-modal" style="padding:10px;">' +
        '<span class="btn-start-main" style="font-size:13px;">' + (G.lvl >= 100 ? '🏁 ATSIIMTI TUVLITOS TECHNINĖS APŽIŪROS LAPĄ!' : 'TĘSTI Į KITĄ LYGĮ ➔') + '</span>' +
      '</button>';

    modal.classList.add('show');
    saveGame();
  }

  function showResetConfirmModal() {
    var modal = document.getElementById('battleResultModal');
    var content = document.getElementById('battleModalContent');
    content.innerHTML =
      '<div style="text-align:center;margin-bottom:12px;">' +
        '<div style="font-size:32px;">🔄</div>' +
        '<div style="font-size:16px;font-weight:900;color:var(--gold-lt);">PRADĖTI ŽAIDIMĄ IŠ NAUJO?</div>' +
        '<div style="font-size:12px;color:var(--muted);margin-top:6px;">Dabartinis progresas bus ištrintas iš atminties (cache) ir galėsi pasirinkti naują automobilio modelį bei variklį.</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<button type="button" class="shop-buy-btn" data-action="cancel-modal">Atšaukti</button>' +
        '<button type="button" class="shop-buy-btn" data-action="confirm-reset" style="background:rgba(239,68,68,0.2);border-color:var(--red);color:#fca5a5;">Taip, iš naujo</button>' +
      '</div>';
    modal.classList.add('show');
  }

  setInterval(function() {
    if (!G.tqActive) return;
    G.tqPos += G.tqDir * 4.5;
    if (G.tqPos >= 94) { G.tqPos = 94; G.tqDir = -1; }
    if (G.tqPos <= 4) { G.tqPos = 4; G.tqDir = 1; }
    var needle = document.getElementById('tqNeedle');
    if (needle) needle.style.left = G.tqPos + '%';
  }, 40);

  function doCombatTurn(dealtDmg, descTxt, isHealAction) {
    var cb = G.combat;
    if (!cb) return;
    cb.turns++;
    cb.dealt += dealtDmg;
    cb.hp = Math.max(0, cb.hp - dealtDmg);

    triggerGarageAnimation(isHealAction ? '☕🌯💚' : '💥🔧⚡');

    var dieEl = document.getElementById('d20Die');
    var roll = rollD20();
    if (dieEl) {
      dieEl.textContent = roll;
      dieEl.classList.remove('rolling');
      void dieEl.offsetWidth;
      dieEl.classList.add('rolling');
    }

    if (cb.hp <= 0) {
      SFX('win');
      showBattleModal(true);
      return;
    }

    if (isHealAction) {
      cb.log = descTxt + ' (Kavos pertraukėlės metu boso smūgis praleistas!)';
      saveGame();
      renderAll();
      return;
    }

    var reduction = (G.lvl - G.faultClearLvl) <= 2 ? 3 : 0;
    var eDmg = Math.max(3, Math.round((cb.dmg - reduction + Math.floor(Math.random() * 5) - 2) * (1 + (passiveCfg().damageTaken||0) + (passiveCfg().bossTaken||0))));
    var nLoss = Math.max(2, Math.round(eDmg * 0.65));
    G.hp = Math.max(0, G.hp - eDmg);
    G.nerves = Math.max(0, G.nerves - nLoss);

    cb.log = descTxt + ' Mazgas priešinasi: <b>-' + eDmg + ' Tech. HP</b> ir <b>-' + nLoss + ' Nervų</b>!';

    if (G.hp <= 0 || G.nerves <= 0) {
      SFX('fail');
      if (difficultyCfg().hardcore) showHardcoreGameOver(G.hp <= 0 ? 'Automobilio techninė būklė nukrito iki 0%.' : 'Meistro Modesto nervai nukrito iki 0%.');
      else showBattleModal(false);
      return;
    }
    saveGame();
    renderAll();
  }

  /* ==========================================================================
     13. MYGTUKŲ IR ĮVYKIŲ VALDIKLIS
     ========================================================================== */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action], [data-tab]');
    if (!btn) return;

    if (btn.dataset.tab) {
      SFX('click');
      var t = btn.dataset.tab;
      var navs = document.querySelectorAll('.nav-btn');
      for (var i = 0; i < navs.length; i++) {
        navs[i].classList.toggle('active', navs[i].dataset.tab === t);
      }
      document.getElementById('tabGarage').style.display = t === 'garage' ? 'block' : 'none';
      document.getElementById('tabObd').style.display = t === 'obd' ? 'block' : 'none';
      document.getElementById('tabShop').style.display = t === 'shop' ? 'block' : 'none';
      document.getElementById('tabPass').style.display = t === 'pass' ? 'block' : 'none';
        document.getElementById('tabRpg').style.display = t === 'rpg' ? 'block' : 'none';
        document.getElementById('tabInventory').style.display = t === 'inventory' ? 'block' : 'none';
      return;
    }

    var act = btn.dataset.action;
    if (act === 'modestas-advice') {
        var adv=getAdviceForLevel(G.lvl); if(!adv||G.adviceResolved[G.lvl])return;
        G.adviceResolved[G.lvl]=btn.dataset.choice; if(btn.dataset.choice==='trust'){G.modestasMemory.trustedAdvice++;applyStoryValues(adv.trust);showToast('🤝 Paklausei Modesto');}else{G.modestasMemory.ignoredAdvice++;applyStoryValues(adv.ignore);showToast('🎲 Nusprendei daryti savaip');}checkModestasGifts();saveGame();renderAll();
      } else if (act === 'export-save') { exportLegacySave();
      } else if (act === 'open-dev') { MG20.openDevPanel();
      } else if (act === 'hardcore-restart') {
        var keepDifficulty=G.difficulty, keepSound=G.sound, keepCar=G.car, keepMod=G.modIdx, keepColor=G.color, keepPlate=G.plate;
        try { localStorage.removeItem(SAVE_KEY); } catch(err) {}
        G.started=false; G.difficulty=keepDifficulty; G.sound=keepSound; G.car=keepCar; G.modIdx=keepMod; G.color=keepColor; G.plate=keepPlate; G.combat=null; G.completed=false;
        document.getElementById('battleResultModal').classList.remove('show'); renderAll(); showToast('💀 Hardcore bandymas paruoštas iš naujo.');
      } else if (act === 'hardcore-config') {
        try { localStorage.removeItem(SAVE_KEY); } catch(err) {}
        G.started=false; G.combat=null; G.completed=false; G.pendingEvent=null;
        document.getElementById('battleResultModal').classList.remove('show'); renderAll();
      } else if (act === 'pick-difficulty') { G.difficulty=btn.dataset.difficulty; renderConfigurator();
      } else if (act === 'event-choice') { resolveEventChoice(parseInt(btn.dataset.index,10));
      } else if (act === 'start-ngplus') { startNewGamePlus();
      } else if (act === 'equip-item') {
        equipItem(btn.dataset.uid);
      } else if (act === 'unlock-skill') {
        unlockSkill(btn.dataset.skill);
      } else if (act === 'pick-brand') {
      SFX('click');
      G.car = btn.dataset.brand;
      G.modIdx = 0;
      renderConfigurator();
    } else if (act === 'pick-mod') {
      SFX('click');
      G.modIdx = parseInt(btn.dataset.mod, 10) || 0;
      renderConfigurator();
    } else if (act === 'pick-color') {
      SFX('click');
      G.color = btn.dataset.color;
      renderConfigurator();
    } else if (act === 'start-game') {
      var inp = document.getElementById('plateInput');
      G.plate = (inp && inp.value.trim()) ? inp.value.trim().toUpperCase() : 'NMP 569';
      var mod = CARS[G.car].mods[G.modIdx];
      G.started = true;
      G.lvl = 1;
      G.hp = 100;
      G.nerves = 100;
      var dif=difficultyCfg(),pas=passiveCfg();
        G.money = 450 + (mod.money || 0) + (dif.startMoney||0) + (pas.startMoney||0);
      G.ta = 15 + (mod.ta || 0);
      G.illCured = [false, false, false];
      G.items = {};
      G.bonusDmg = 0;
      G.discount = false;
      SFX('engine');
      enterLevel(1);
    } else if (act === 'toggle-sound') {
      G.sound = !G.sound;
      if (G.sound) { SFX('win'); showToast('🔊 Garažo garsai įjungti!'); }
      else showToast('🔇 Garsai išjungti');
      saveGame();
      renderAll();
    } else if (act === 'reset-game') {
      SFX('click');
      showResetConfirmModal();
    } else if (act === 'cancel-modal') {
      SFX('click');
      document.getElementById('battleResultModal').classList.remove('show');
    } else if (act === 'confirm-reset') {
      document.getElementById('battleResultModal').classList.remove('show');
      try { localStorage.removeItem(SAVE_KEY); } catch(err) {}
      G.started = false;
      G.items = {};
      G.bonusDmg = 0;
      G.discount = false;
      showToast('🔄 Pasirink naują automobilį ir variklį!');
      renderAll();
    } else if (act === 'toggle-lift') {
      if (!G.liftUp) {
        if (G.money < 10) {
          SFX('fail');
          showToast('❌ Nepakanka 10 € keltuvo hidraulikai ir elektrai!');
          return;
        }
        G.money -= 10;
        G.liftUp = true;
        G.liftReasonTxt = LIFT_REASONS[Math.floor(Math.random() * LIFT_REASONS.length)];
        SFX('lift');
        triggerGarageAnimation('🏗️⬆️✨');
        showToast('🏗️ (-10 €) ' + G.liftReasonTxt + ' (+3 DMG)');
      } else {
        G.liftUp = false;
        G.liftReasonTxt = '';
        SFX('lift');
        triggerGarageAnimation('🏗️⬇️🔧');
        showToast('⬇️ Keltuvas nuleistas ant žemės.');
      }
      saveGame();
      renderAll();
    } else if (act === 'roll-fortune') {
      if (G.fortuneRolledLvl === G.lvl) {
        showToast('⏳ Fortūnos kauliuką šiame lygyje jau metei!');
        return;
      }
      SFX('dice');
      var r = Math.floor(Math.random() * 20) + 1;
      G.fortuneRolledLvl = G.lvl;
      var dieEl = document.getElementById('d20Die');
      if (dieEl) {
        dieEl.textContent = r;
        dieEl.classList.remove('rolling');
        void dieEl.offsetWidth;
        dieEl.classList.add('rolling');
      }
      if (r >= 15) {
        G.fortuneMult = 1.25;
        G.nerves = Math.min(100, G.nerves + 10);
        G.fortuneTxt = '✓ ' + r + ': +25% DMG!';
        showToast('🎲 Išridenta ' + r + '! Kritinė Fortūna: +25% DMG ir +10 Nervų!');
      } else if (r >= 8) {
        G.fortuneMult = 1.15;
        G.fortuneTxt = '✓ ' + r + ': +15% DMG';
        showToast('🎲 Išridenta ' + r + '! Geras Raktas: +15% DMG šiam lygiui!');
      } else {
        G.fortuneMult = 1.0;
        G.money += 5;
        G.nerves = Math.max(10, G.nerves - 5);
        G.fortuneTxt = '✓ ' + r + ': +5 €';
        showToast('🎲 Išridenta ' + r + ': Pabiro varžtai (-5 Nervų), bet radai +5 € po sėdyne!');
      }
      saveGame();
      renderAll();
    } else if (act === 'combat-atk') {
      var type = btn.dataset.type;
      var dmg = getAttackRanges();
      if (type === 'basic') {
        SFX('wrench');
        G.pamperBuff = false;
        var d = Math.floor(Math.random() * (dmg.basicMax - dmg.basicMin + 1)) + dmg.basicMin;
        doCombatTurn(d, '🔧 Smūgiavai veržliarakčiu ir padarei <b>' + d + ' DMG</b>!', false);
      } else if (type === 'heat') {
        if (G.money < 10) { showToast('❌ Trūksta 10 € dujiniam degikliui!'); return; }
        G.money -= 10;
        G.pamperBuff = false;
        SFX('wrench');
        var d2 = Math.floor(Math.random() * (dmg.heatMax - dmg.heatMin + 1)) + dmg.heatMin;
        doCombatTurn(d2, '🔥 Pakaitinai varžtą su WD-40 ir padarei <b>' + d2 + ' DMG</b>!', false);
      } else if (type === 'torque') {
        SFX('click');
        G.tqActive = true;
        renderAll();
      } else if (type === 'coffee') {
        if (G.money < 15) { showToast('❌ Trūksta 15 € kavai!'); return; }
        G.money -= 15;
        G.nerves = Math.min(100, G.nerves + 25);
        G.hp = Math.min(100, G.hp + 18);
        G.customMood = '☕ Mėgaujasi karšta kava';
        SFX('cash');
        doCombatTurn(0, '☕ Palepinai Meistrą Modestą kava ir šokoladuku (+25 Nervų, +18 Tech. HP).', true);
      } else if (type === 'kebab_pamper') {
        if (G.money < 25) { showToast('❌ Trūksta 25 € kebabui ir arbatpinigiams!'); return; }
        G.money -= 25;
        G.nerves = Math.min(100, G.nerves + 40);
        G.hp = Math.min(100, G.hp + 25);
        G.pamperBuff = true;
        G.customMood = '🌯 Valgo kebabą (Įkvėptas +20% DMG!)';
        SFX('win');
        doCombatTurn(0, '🌯 Palepinai Meistrą Modestą šiltu kebabu (+40 Nervų, +25 Tech. HP ir +20% DMG kitam smūgiui!).', true);
      }
    } else if (act === 'stop-torque') {
      G.tqActive = false;
      G.pamperBuff = false;
      var dmgR = getAttackRanges();
      var inZone = G.tqPos >= 38 && G.tqPos <= 62;
      if (inZone) {
        SFX('torque_ok');
        var dCrit = Math.floor(Math.random() * (dmgR.tqCritMax - dmgR.tqCritMin + 1)) + dmgR.tqCritMin;
        doCombatTurn(dCrit, '🎯 KLIK-KLIK! Pataikei tiesiai į žalią Nm zoną — KRITINIS <b>' + dCrit + ' DMG</b>!', false);
      } else {
        SFX('wrench');
        var dNorm = Math.max(8, Math.round(dmgR.tqNormMax * 0.65));
        doCombatTurn(dNorm, '⚠️ Nepataikei į žalią Nm zoną — padarei tik <b>' + dNorm + ' DMG</b>.', false);
      }
    } else if (act === 'close-battle-modal') {
      document.getElementById('battleResultModal').classList.remove('show');
      if (G.lvl >= 100) {
        G.ta = 100; showFinalScreen(); return;
      } else {
        enterLevel(G.lvl + 1);
      }
    } else if (act === 'seq-pick') {
      var pickedOrder = parseInt(btn.dataset.order, 10);
      if (pickedOrder === G.seqStep) {
        SFX('torque_ok');
        triggerGarageAnimation('⚡🔌✓');
        G.seqStep++;
        if (G.seqStep > 3) {
          G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
          G.money += 20;
          changeModestasRespect(2, 'teisingai atlikta darbų seka');
          markRepairSuccess();
          showToast('⚡ Visi žingsniai atlikti teisinga tvarka! +2% TA ir +20 €');
          enterLevel(G.lvl + 1);
        } else {
          showToast('✓ Teisingas žingsnis! Dabar pasirink sekantį veiksmą.');
          renderAll();
        }
      } else {
        SFX('fail');
        G.nerves = Math.max(10, G.nerves - 5);
        triggerGarageAnimation('💥⚠️');
        showToast('❌ Neteisinga darbų seka! Pirmiausia reikia ' + G.seqStep + '-ojo žingsnio (-5 Nervų).');
        saveGame();
        renderAll();
      }
    } else if (act === 'resolve-noncombat') {
      var opt = btn.dataset.opt;
      if (opt === 'outside_specialist') {
        if (G.money < 90) { showToast('❌ Nepakanka 90 € kitam specialistui!'); return; }
        G.money -= 90;
        G.hp = Math.min(100, G.hp + 20);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        changeModestasRespect(-15, 'remontas perduotas kitam specialistui');
        G.modestasMemory.outsideRepairs++; G.modestasCombo=0; showToast('💥 Modesto serija nutraukta');
        G.customMood = '🔧 Modestas tyliai tvarko savo įrankius';
        saveGame();
        enterLevel(G.lvl + 1); maybeTriggerEvent();
        return;
      }
      if (opt === 'pamper_kebab') {
        if (G.money < 20) { showToast('❌ Nepakanka 20 € Meistro Modesto kebabui!'); return; }
        G.money -= 20;
        G.nerves = Math.min(100, G.nerves + 30);
        G.hp = Math.min(100, G.hp + 15);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        SFX('win');
        triggerGarageAnimation('🌯😋💚');
        showToast('🌯 Modesto pamalonintas kebabu! +30 Nervų, +15 HP ir +2% TA');
        enterLevel(G.lvl + 1);
        return;
      } else if (opt === 'pamper_coffee') {
        if (G.money < 15) { showToast('❌ Nepakanka 15 € kavai ir spurgoms!'); return; }
        G.money -= 15;
        G.nerves = Math.min(100, G.nerves + 25);
        G.hp = Math.min(100, G.hp + 12);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        SFX('win');
        triggerGarageAnimation('☕🍩💚');
        showToast('☕ Modesto suvalgė spurgų! +25 Nervų, +12 HP ir +2% TA');
        enterLevel(G.lvl + 1);
        return;
      } else if (opt === 'pamper_lunch') {
        if (G.money < 25) { showToast('❌ Nepakanka 25 € dienos pietums!'); return; }
        G.money -= 25;
        G.nerves = Math.min(100, G.nerves + 35);
        G.hp = Math.min(100, G.hp + 18);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 3);
        SFX('win');
        triggerGarageAnimation('🥩🔥🏆');
        showToast('🥩 Modesto pasisotino cepelinais! +35 Nervų, +18 HP ir +3% TA');
        enterLevel(G.lvl + 1);
        return;
      } else if (opt === 'pamper_gloves') {
        if (G.money < 20) { showToast('❌ Nepakanka 20 € pirštinėms ir arbatpinigiams!'); return; }
        G.money -= 20;
        G.nerves = Math.min(100, G.nerves + 28);
        G.hp = Math.min(100, G.hp + 14);
        G.bonusDmg += 1;
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        SFX('win');
        triggerGarageAnimation('🧤💪✨');
        showToast('🧤 Modesto užsidėjo naujas pirštines! +28 Nervų, +2% TA ir +1 DMG visam laikui!');
        enterLevel(G.lvl + 1);
        return;
      }

      SFX('dice');
      triggerGarageAnimation('🔧🔩✨');
      if (opt === '1') {
        if (G.money < 15) { showToast('❌ Nepakanka 15 €!'); return; }
        G.money = Math.max(0, G.money - 15);
        G.hp = Math.min(100, G.hp + 10);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        showToast('🔧 Kruopštus darbas! +2% TA ir +10 Tech. HP');
      } else if (opt === '2') {
        G.money += 15;
        G.nerves = Math.max(15, G.nerves - 6);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 1);
        showToast('⚡ Sutaupyta! +15 € ir +1% TA');
      } else {
        if (G.money < 35) { showToast('❌ Nepakanka 35 €!'); return; }
        G.money = Math.max(0, G.money - 35);
        G.hp = Math.min(100, G.hp + 15);
        G.nerves = Math.min(100, G.nerves + 10);
        G.ta = Math.min(getTaCap(G.lvl + 1), G.ta + 2);
        showToast('🏅 Aukščiausia kokybė! +2% TA, +15 HP, +10 Nervų');
      }
      enterLevel(G.lvl + 1);
    } else if (act === 'obd-scan') {
      var cost = G.items.vcds ? 0 : 15;
      if (G.money < cost) { showToast('❌ Nepakanka eurų skenavimui!'); return; }
      G.money -= cost;
      G.obdScannedLvl = G.lvl;
        ensureRpgState(); G.rpg.stats.obdScans++;
      G.ta = Math.min(getTaCap(G.lvl), G.ta + 1);
      SFX('torque_ok');
      showToast('💻 Gyvi parametrai nuskaityti! Kovos žala padidinta!');
      saveGame();
      renderAll();
    } else if (act === 'obd-clear') {
      if (G.money < 30) { showToast('❌ Nepakanka 30 €!'); return; }
      G.money -= 30;
      G.faultClearLvl = G.lvl;
      G.nerves = Math.min(100, G.nerves + 15);
      SFX('cash');
      showToast('🧹 Klaidos laikinai ištrintos! +15 Nervų ir -3 boso DMG');
      saveGame();
      renderAll();
    } else if (act === 'shop-cat') {
      SFX('click');
      G.shopCat = btn.dataset.cat;
      renderShopTab();
    } else if (act === 'buy-item') {
      var id = btn.dataset.id;
      var it = null;
      for (var m = 0; m < SHOP_ITEMS.length; m++) {
        if (SHOP_ITEMS[m].id === id) { it = SHOP_ITEMS[m]; break; }
      }
      if (!it) return;

      if (it.minLvl && G.lvl < it.minLvl) {
        showToast('❌ Ši OEM detalė atsirakina tik nuo ' + it.minLvl + ' lygio!');
        return;
      }

      if (id === 'sell_cat') {
        if (G.lvl - G.lastCatSellLvl < 15) { showToast('⏳ Katalizatorių galėsi parduoti tik po 15 lygių!'); return; }
        G.lastCatSellLvl = G.lvl;
        G.money += 85;
        G.ta = Math.max(5, G.ta - 2);
        SFX('cash');
        showToast('♻️ Pardavei seną katalizatorių: +85 € (-2% TA)');
        saveGame();
        renderAll();
        return;
      }
      var discountRate2 = (G.discount ? 0.20 : 0) + skillLevel('bargainer') * 0.04;
        var price = Math.round(it.price * (1 - Math.min(0.45, discountRate2)) * difficultyCfg().shop * (1 + (passiveCfg().shop||0)));
      if (G.money < price) { showToast('❌ Nepakanka eurų šiai prekei!'); return; }
      G.money -= price;
      SFX('cash');

      if (id === 'box_gamble') {
        var rG = Math.random();
        if (rG < 0.4) { awardLoot('box', false); G.ta = Math.min(getTaCap(G.lvl), G.ta + 1); }
        else if (rG < 0.8) { G.money += 60; showToast('🎁 Dėžėje radai sveiką daviklį — pardavei už +60 €!'); }
        else { G.nerves = Math.max(10, G.nerves - 8); showToast('💥 Dėžėje tik surūdiję varžtai (-8 Nervų)!'); }
      } else if (id === 'haggle_disc') {
        G.discount = true; G.items[id] = true; ensureRpgState(); G.rpg.stats.discountUnlocked = 1; showToast('🤝 Vitalijus suteikė -20% nuolaidą viskam!');
      } else if (id === 'coffee') {
        G.nerves = Math.min(100, G.nerves + 28); G.hp = Math.min(100, G.hp + 18); G.customMood = '☕ Geria karštą kavą'; showToast('☕ +28 Nervų ir +18 Tech. HP!');
      } else if (id === 'kebab') {
        G.nerves = Math.min(100, G.nerves + 45); G.hp = Math.min(100, G.hp + 15); G.customMood = '🌯 Kerta naktinį kebabą'; showToast('🌯 +45 Nervų ir +15 Tech. HP!');
      } else if (id === 'shashlik') {
        G.nerves = Math.min(100, G.nerves + 60); G.hp = Math.min(100, G.hp + 25); G.ta = Math.min(getTaCap(G.lvl), G.ta + 1); G.customMood = '🥩 Valgo šašlykus'; showToast('🥩 +60 Nervų, +25 Tech. HP ir +1% TA!');
      } else if (id === 'wd40') {
        G.hp = Math.min(100, G.hp + 25); showToast('🧴 +25 Tech. HP!');
      } else if (id === 'doctor') {
        G.hp = Math.min(100, G.hp + 45); G.ta = Math.min(getTaCap(G.lvl), G.ta + 2); showToast('🍯 +45 Tech. HP ir +2% TA!');
      } else if (id === 'gaskets') {
        G.hp = Math.min(100, G.hp + 65); G.nerves = Math.min(100, G.nerves + 25); showToast('🧰 +65 Tech. HP ir +25 Nervų!');
      } else if (id === 'impact') {
        G.bonusDmg += 5; G.items[id] = true; showToast('🔩 Smūginis veržliaraktis: +5 bazinės žalos!');
      } else if (id === 'induct') {
        G.bonusDmg += 9; G.items[id] = true; showToast('🔥 Indukcinis kaitintuvas: +9 bazinės žalos!');
      } else if (id === 'press') {
        G.bonusDmg += 14; G.ta = Math.min(getTaCap(G.lvl), G.ta + 5); G.items[id] = true; showToast('🏗️ 20T Presas: +14 DMG ir +5% TA!');
      } else if (id === 'vcds') {
        G.items[id] = true; showToast('💻 Pro kabelis nupirktas: OBD2 skenavimas nemokamas (+35% DMG)!');
      }
      saveGame();
      renderAll();
    }
  });

  var plateInp = document.getElementById('plateInput');
  if (plateInp) {
    plateInp.addEventListener('input', function(e) {
      G.plate = e.target.value.toUpperCase() || 'NMP 569';
      renderConfigurator();
    });
  }

  window.onload = function() {
    var validationErrors=MG20.validateGameData(); if(validationErrors.length)console.warn(validationErrors);
    if (loadGame()) {
      ensureRpgState(); ensureInventoryState(); ensureWorldState(); checkAchievements();
        ensureRpgState(); checkAchievements();
      renderAll();
      showToast('💾 Progresas užkrautas iš cache (Lygis ' + G.lvl + '/100)');
    } else {
      renderConfigurator();
    }
  };
})();