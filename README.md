# PizzeriaWebProject - Backend
[Front-end repository](https://github.com/smpKlaa/PizzeriaWebProject-Front)

# Projektin esittely ja dokumentaatio (To Be Announced)

## 1. Ryhmän jäsenet
- Riikka Kautonen [RiikkaKoo](https://github.com/RiikkaKoo)
- Elias Rinne [MustBeViable](https://github.com/MustBeViable) 
- Sampo Klaavo [smpkl](https://github.com/smpkl)
- Jere Pyörökivi [Jere-4](https://github.com/Jere-4)

---

## 2. Sovelluksen idea ja kohderyhmä
- **Sovelluksen tarkoitus:**
    - Tarjota pizzeriaketjulle responsiivinen ja helppokäyttöinen pizzerian tilaus- ja hallinta-alusta
- **Kohderyhmä:** 
    - Pizzeriat/pizzeria ketjut
    - sen asiakkaan
- **Mitä ongelmaa ratkaisee / miksi on hyödyllinen:**
    - Antaa laajan ja valmiin paketin pizzerioille (tietokanta <-> ... <-> käyttäjän näkymä). Mahdollistaa tilausten, tuotteiden, tiedotteiden, palautteiden ja aterioiden hallinnan yhdellä alustalla. Antaa käyttäjäystävällisen tilausalustan.

---

## 3. Sovelluksen toiminnallisuudet
### Keskeiset toiminnot
Käyttäjät:
- voi rekisteröidä
- voi kirjautua sisään
- Voi selailla:
    - Pizzerian tuotteita ja aterioita (menua)
        - voi hakea ja rajata esimerkiksi ruokavalio tagien mukaan
    - Pizzerioita kartalta (about us osio)
    - ilmotuksia
    - päivän aterioita
    - Kirjautuneena:
        - omia tilauksia
        - omia tietoja
    - ostoskoria
        - myös muokata, poistaa ja perua kokonaan
- voi tilata ruokaa kirjautuneena tai kirjautumatta
    - kotiin
    - noutona ravintolalta
    - valmiiksi ravintolaan
- voi tilata ennakkoon tai "heti"
- voi käyttää kuponkeja
- voi hallinnoida omia tietoja

Omistajat/admin:
- voi kirjautua sisään
- voi rekisteröidä uusia admin käyttäjiä
- voi hallinnoida:
    - tilauksia
        - voi perua, hyväksyä ja merkata valmiiksi
    - tuotteita
        - lisätä, poistaa ja muokata
    - aterioita
        - lisätä, poistaa ja muokata
        - myös päivittäisiä aterioita
    - kuponkeja
        - lisätä, poistaa ja muokata
    - ilmoituksia
        - lisätä, poistaa ja muokata
- Voi hallinnoida omia tietoja

### Mahdolliset lisäominaisuudet
-  
-  

---

## 4. Asennus

- tee 2 eri kansiota frontend ja backend
  
```Bash
mkdir frontend && mkdir backend
```

- mene backend kansioon terminalissa tai IDE:ssä
  
```Bash
cd ./backend
```

- git clone https://github.com/smpkl/PizzeriaWebProject-Backend
- cd ./project-api

```Bash
cd ./project-api
```

- npm install

```Bash
cd npm install
```

- avaa mysql
- aja alustus scriptit /backend/project-backend/sql-scripts

```sql
SOURCE ./backend/project-backend/sql-scripts/pizzeria_database_v2_3.sql;
```
```sql
SOURCE ./backend/project-backend/sql-scripts/data-tag-category-admin.sql;
```

- luo .env file

```Bash
touch .env
nano ./.env
```

- lisää .env.samplen mukaan omat ympäristömuuttujat
- aja dev moodissa apia
```Bash
cd npm run dev
```

- aja ohjelmaa tuotanto moodissa

```Bash
npm start
```

- mene frontend kansioon terminalissa tai IDE:ssä

```Bash
cd ./frontend/
```

- kloonaa repositorio
  
```Bash
git clone https://github.com/smpkl/PizzeriaWebProject-Front
```

- cd ./project-frontend

```Bash
cd ./frontend/project-fronend
```

- asenna vite
  
```Bash
npm install vite
```

- asenna dependecyt
  
```Bash
npm install
```

- luo .env file

```Bash
touch .env
nano ./.env
```

- lisää .env.samplen mukaan omat ympäristömuuttujat
- aja dev moodissa fronttia

```Bash
npm run dev
```

---

# 5. Ohjeistus sovelluksen testaamiseen

### Testien ajaminen

1. Varmista, että projektin riippuvuudet on asennettu:

```Bash
npm install
```
2. Aja kaikki testit komennolla:
```Bash
npm test
```
3. Testit suoritetaan Node-ympäristössä käyttäen jest- ja supertest-kirjastoja.
npm test käyttää seuraavaa skriptiä:
```Bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand
```
### Käytetyt testityökalut

- **Jest** - test runner ja assertointikirjasto (yksikkö- ja integraatiotestit).
    - (Asennettu mutta ei käytössä)

- **Supertest** - HTTP-endpointtien testaamiseen (REST API -kutsut).
    - valmiit testipaketit tulee mukana

### Mitä kannattaa testata. Mitä tulee mukana.

- Jokaiselle REST-endpointille on tehty **CRUD-malliset testit** (Create, Read, Update, Delete) aina kun toiminnallisuus sen mahdollistaa.

- Jokaisessa endpointtikohtaisessa testipaketissa on testattu:

    - **Onnistunut pyyntö**
        - Esim. oikea data, oikea token/rooli → odotettu statuskoodi (200, 201, 204).

    - **Epäonnistunut pyyntö**
        - Esim. puuttuva tai virheellinen data
        - väärä tai puuttuva autentikointi/valtuus (token/rooli)
        - olematon resurssi (väärä id)
        → odotettu virhestatus (400, 401, 403, 404 tms.)

    - **Testit käyttävät Supertestiä API-kutsujen tekoon ja validoivat:**

        - HTTP-statuskoodit
        - Vastauksen rakenteen (response body)
        - Mahdolliset virheilmoitukset tai validointiviestit

---

## 6. Demo/esitys diat ja muut linkit
- [wireframe / mockup](https://www.figma.com/design/6friFu5guACEfN9zNmMO1j/Untitled?node-id=0-1&m=dev&t=XIEMncLJKdyQ6v4o-1

---

## 7. Ongelmat ja ongelmatilanteet
- sähköpostiin: eioikea@sahkoposti.fi

---

## 8. Ylläpito
- **Ylläpitäjät:**
    - Riikka Kautonen [RiikkaKoo](https://github.com/RiikkaKoo)
    - Elias Rinne [MustBeViable](https://github.com/MustBeViable) 
    - Sampo Klaavo [smpkl](https://github.com/smpkl)
    - Jere Pyörökivi [Jere-4](https://github.com/Jere-4)
