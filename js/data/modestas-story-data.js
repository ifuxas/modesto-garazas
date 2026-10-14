window.MODESTAS_STORY={
 respectTiers:[
  {min:100,name:'👑 GARAŽO ŠEIMA'},{min:90,name:'🏆 Dešinioji Modesto ranka'},{min:70,name:'🤝 Modesto žmogus'},
  {min:45,name:'🔧 Garažo pažįstamas'},{min:20,name:'😐 Klientas'},{min:0,name:'💢 Eik jau tu...'}],
 garageStages:[
  {min:81,name:'🏆 MODESTO GARAŽAS',bonus:'Legendary loot +3%'},{min:61,name:'💻 Diagnostikos centras',bonus:'Diagnostika +2'},
  {min:41,name:'⚙️ Rimtos dirbtuvės',bonus:'Remonto DMG +2'},{min:21,name:'🔧 Sutvarkytas garažas',bonus:'Parduotuvė -3%'},{min:1,name:'🏚️ Senas garažas',bonus:'Čia prasideda istorija'}],
 advice:[
  {level:12,text:'Pirmiausia pamatuok. Tik tada keisk detalę.',trust:{hp:6,rep:3,respect:3},ignore:{nerves:-5,respect:-2}},
  {level:32,text:'Neskubėk lupti purkštukų. Pažiūrėk kuro slėgį ir korekcijas.',trust:{hp:8,rep:4,respect:4},ignore:{hp:-5,respect:-3}},
  {level:52,text:'Elektrikoje spėjimai brangūs. Imk schemą ir multimetrą.',trust:{nerves:6,rep:5,respect:4},ignore:{nerves:-7,respect:-3}},
  {level:72,text:'Jei varžtas nejuda, jėga ne visada yra atsakymas. Pirmiausia šiluma.',trust:{hp:7,rep:5,respect:5},ignore:{hp:-7,respect:-4}},
  {level:92,text:'Iki Tuvlitos liko nedaug. Dabar jokių trumpinių.',trust:{ta:2,rep:7,respect:6},ignore:{nerves:-8,respect:-5}}
 ],
 personalItems:[
  {id:'modestas_torque',type:'primary',name:'Modesto dinamometrinis',desc:'„Nelaužyk. Aš su juo dar Passatą 2008-aisiais dariau.“',rarity:'legendary',condition:100,effects:{dmg:12,crit:.15},respect:90},
  {id:'modestas_10mm',type:'lucky',name:'Modesto 10 mm galvutė',desc:'MYTHIC. Šita 10 mm galvutė niekada nedingsta.',rarity:'mythic',condition:100,effects:{dmg:20,crit:.10},respect:100}
 ],
 biography:{age:34,wife:'Eglė',children:2,daughters:2,oneDaughterKarate:true,formerJob:'ugniagesys Mažeikių Naftoje',leftFormerJob:'prieš metus',familyCars:{father:'Mercedes',mother:'BMW',wife:'Subaru',wifeDream:'Toyota Prius'}},
 lifeStories:[
  {level:6,text:'„Kai dar dirbau ugniagesiu Mažeikių Naftoje, po pamainos vis tiek lįsdavau į servisą. Matyt, nuo technikos nepabėgsi.“'},
  {level:18,text:'„Prieš metus galutinai išėjau iš ugniagesių. Dabar visas dėmesys čia, garaže.“'},
  {level:27,text:'„Eglės Subaru vėl kada nors užvažiuos. Nors ji vis dar prisimena Prius, sako, su tuo pigiai važinėjo.“'},
  {level:39,text:'„Tėvo Mercedes garsas pasikeitė? Reikės kada užvaryti ant keltuvo. Šeimos mašinos eilės neturi, bet problemų turi kaip visos.“'},
  {level:58,text:'„Mama su BMW atvažiuoja ir visada sako, kad tik trumpam. Žinai, ką reiškia tas „trumpam“ garaže.“'},
  {level:68,text:'„Dvi dukros namie jau žino, kad 10 mm galvutės nuo tėčio geriau neskolinti. O kai viena grįžta iš karate, Modestas juokauja, kad smūgio technika garaže varžtams netaikoma.“'},
  {level:84,text:'„Eglė sako: Subaru gerai, bet Prius buvo pigus važiuot. Aš sakau: svarbu, kad į garažą savo eiga grįžtų.“'},
  {level:96,text:'„34-eri, dvi dukros, Eglė, garažas... Kai pagalvoji, ugniagesio darbas išmokė vieno: kai dega, pirmiausia nepanikuoji.“'}
 ],
 familyEvents:[
  {level:27,title:'🚙 Eglės Subaru',text:'Eglės Subaru trumpam užsuka į Modesto garažą. Modestas primena, kad Eglė vis dar mintyse lygina eksploatacijos kainą su anksčiau turėtu Toyota Prius.',respect:2,nerves:4},
  {level:39,title:'⭐ Tėčio Mercedes',text:'Modesto tėvo Mercedes užsuka šeimyninei diagnostikai. Modestas pats imasi patikros.',respect:2,hp:3},
  {level:58,title:'🔵 Mamos BMW',text:'Modesto mamos BMW pasirodo garaže. Trumpa patikra virsta dar viena pažįstama šeimos istorija.',respect:2,nerves:3},
  {level:68,title:'🏠 Šeimos vakaras',text:'Po darbo Modestas skuba namo pas Eglę ir dvi dukras. Vienai dar reikia spėti į karate, todėl šįkart garažas užsidaro laiku.',respect:3,nerves:7}
 ],
  bossLore:{25:'„Šitą triuką jau mačiau. Neskubėk. Gedimas pats pasakys, kur slepiasi.“',50:'„Dabar prasideda darbas, kurio nepataisysi vien stipriau užverždamas.“',75:'„Čia jau nebe kliento smulkmena. Laikomės plano ir nepanikuojam.“',100:'„Iki galo atėjom kartu. Dabar parodom, ko vertas Modesto garažas.“'}
};
