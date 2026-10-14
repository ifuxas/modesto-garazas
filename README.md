# Modesto Garažas v20 – Engine Rebuild
v20 prideda modulinį core, Event Bus, seeded RNG, centralizuoto state schemą, save v20 su migracija ir import/export, balance duomenis, universalų effect engine, universalų D20, data validation, DEV panelę (Ctrl+Shift+M), automatinių testų puslapį, globalų klaidų rinkimą, performance matavimų pagrindą, accessibility/mobile stilius ir PWA/offline cache.

Esamas patikrintas gameplay branduolys paliktas `js/game.js`, o v20 sluoksniai iškelti į atskirus modulius, kad refaktoringas nesugadintų v18/v19 funkcijų. Paleisti patikimiausia per vietinį HTTP serverį. Baziniai testai: `tests/test-runner.html`.


## Meistro Modesto kryptis
- Meistras Modestas yra vienintelis pagrindinis ir nuolatinis garažo meistras.
- Įdiegta `Modesto pagarba` 0–100 sistema.
- Pagarba rodoma RPG ir finaliniame ekrane.
- 24, 44 ir 74 lygiuose galima problemą perduoti kitam siauram specialistui, tačiau tai kainuoja pinigų ir sumažina Modesto pagarbą.
- Boss pergalės ir teisingos technologinės sekos pagarbą didina.


# v21 – Modesto istorija
- 6 Modesto pagarbos pakopos nuo „Eik jau tu...“ iki „GARAŽO ŠEIMA“.
- Modesto atmintis: kiti specialistai, bossai kartu, klausyti/ignoruoti patarimai, sėkmės ir nesėkmės.
- Dinaminiai Modesto dialogai pagal santykį ir ankstesnius sprendimus.
- Patarimų pasirinkimai 12, 32, 52, 72 ir 92 lygiuose.
- 5 Modesto garažo progresijos stadijos.
- Modesto remonto combo su 5/10/20/30 ribomis.
- Asmeniniai Modesto daiktai už aukštą pagarbą.
- Boss lore iš Modesto perspektyvos.
- Kiti specialistai lieka tik retais pasirinkimais ir nutraukia Modesto combo.
- Finalinis dialogas priklauso nuo Modesto pagarbos.
- Naujas 100/100 pagarbos achievement „Garažo šeima“.


## v21.1 – Modesto biografijos papildymas
Žaidimo istorijoje naudojamos Modesto detalės: 34 metai, žmona Eglė ir dvi dukros, iš kurių viena lanko karate; ankstesnis darbas ugniagesiu Mažeikių Naftoje kartu dirbant savo servise; išėjimas iš ugniagesio darbo prieš metus; tėvo Mercedes, mamos BMW, Eglės Subaru ir jos prisiminimai apie ekonomišką Toyota Prius. Šeimos personažai naudojami tik Modesto istorijai sustiprinti, o pagrindinis žaidimo veikėjas ir meistras lieka Modestas.

## v21.2 – Šeimos detalės
Modestas turi dvi dukras, viena iš jų lanko karate. Dukrų amžius žaidimo duomenyse ir dialoguose nenaudojamas.
