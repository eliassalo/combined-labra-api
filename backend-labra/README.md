To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

To create migrations: 
```sh
gel migration create
```

To migrate: 
```sh
gel migrate
```

To generate edgeql-js: 
```sh
bunx @gel/generate edgeql-js
```


open http://localhost:3000
REST-rajapinta (API), joka tarjoaa CRUD-toiminnallisuuden projektien ja niihin liittyvien tehtävien hallintaan. 

Tietomalli perustuu kahteen tauluun: 

Project (projekti), jolla on nimi ja kuvaus 

Task (tehtävä), jolla on otsikko, valmis/ei valmis -tieto ja viittaus projektiin 

Tietokantarakenne (1:N) 

Yksi Project voi sisältää useita Task-olioita. 

Kieli: TypeScript 

Projects-endpointit: 

GET /projects – listaa kaikki projektit 

POST /projects – luo uusi projekti 

GET /projects/:id – hae yksittäinen projekti ja siihen liittyvät tehtävät 

PUT /projects/:id – muokkaa projektia 

DELETE /projects/:id – poista projekti ja siihen liittyvät tehtävät 

Tasks-endpointit: 

POST /projects/:projectId/tasks – lisää tehtävä tiettyyn projektiin 

PUT /tasks/:id – päivitä tehtävän tiedot (esim. valmis/ei valmis) 

DELETE /tasks/:id – poista tehtävä 
