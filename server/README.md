# Backend u Dockeru

Potreban je Docker sa Docker Compose-om. Ako koristis WSL, ukljuci integraciju
za svoju distribuciju u Docker Desktop > Settings > Resources > WSL Integration.

Komande pokreni iz server foldera:

```bash
cd server
```

Ako .env ne postoji:

```bash
cp .env.example .env
```

Pokretanje API-ja i MySQL baze:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api seed db
```

Nije potrebna lokalna instalacija Node.js ili MySQL-a. Prvo pokretanje kreira
bazu products_filtering i tabele categories i products. Servis seed ceka
da baza i tabele budu spremne, pa dodaje pocetne podatke. API se pokrece
tek nakon uspesnog zavrsetka seed servisa. Seed zatim ostaje Exited (0),
sto je ocekivano. Docker healthcheck se ne koristi.
Prvo preuzimanje image-a i inicijalizacija mogu potrajati nekoliko minuta.

API adrese:
- http://localhost:5000/api/products
- http://localhost:5000/api/categories

MySQL je dostupan API-ju na db:3306; port baze nije izlozen hostu.
Lozinke iz .env.example namenjene su lokalnom razvoju.
DB_NAME/DB_USER/DB_PASSWORD moraju odgovarati MYSQL_DATABASE/MYSQL_USER/MYSQL_PASSWORD.

## Primer podataka (seeder)

Seeder se automatski izvrsava kroz docker compose up -d --build.
Za rucno ponovno pokretanje dok API radi:

```bash
docker compose exec api npm run seed
```

Seeder dodaje 4 kategorije i 12 proizvoda. Moze se ponovo pokrenuti:
preskace kategorije sa istim nazivom i proizvode sa istim nazivom u istoj
kategoriji. Ne brise postojece podatke niti menja njihove cene.
Svi unosi su u jednoj transakciji, pa se pri gresci ponistavaju.
Seeder ponavlja proveru dostupnosti baze do 60 puta, na svake 2 sekunde.
Ako ne uspe, API se ne pokrece; proveri docker compose logs seed db,
ispravi uzrok i ponovo pokreni docker compose up -d.
Primeri podataka nalaze se u src/seed.ts.

Primer rucnog dodavanja kategorije:

```bash
curl -f -X POST http://localhost:5000/api/categories -H 'Content-Type: application/json' -d '{"name":"Elektronika"}'
```

Koristi vraceni id kao category_id u sledecem zahtevu (primer koristi 1):

```bash
curl -f -X POST http://localhost:5000/api/products -H 'Content-Type: application/json' -d '{"name":"Tastatura","price":49.99,"category_id":1}'
curl -f http://localhost:5000/api/products
```

Izmene u src automatski restartuju API. Posle promene zavisnosti
ponovo pokreni docker compose up -d --build.

MySQL konzola (unesi MYSQL_PASSWORD iz .env):

```bash
docker compose exec db mysql -u products -p products_filtering
```

Zaustavljanje uz cuvanje podataka:

```bash
docker compose down
```

Podaci ostaju u mysql_data volume-u. Init SQL i MYSQL_* podesavanja vaze samo
pri inicijalizaciji prazne baze; promena .env ne menja postojece MySQL lozinke.
Komanda docker compose down -v brise i bazu; koristi je samo za nameran reset.
