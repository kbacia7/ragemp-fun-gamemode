
# Project San Andreas

Project San Andreas to projekt utworzenia serwera DM/4Fun na platformę [RAGE:MP](https://rage.mp/) 
## Co zawiera to repozytorium?

Repozytorium zawiera skrypt do gry pisany w TypeScript, issues'y to rozpisane zmiany które należy nanieść. README który czytasz opisuje sposób konfiguracji, uruchomienia i w jaki sposób wykonywać issues'y

## Instalacja
### Windows
####  Wymagania
* NodeJS w wersji [LTS](https://nodejs.org/en/download/)
* [Git Bash](https://git-scm.com/downloads)

#### Kompilacja
1. W Git Bash wchodzimy do jakiegoś katalogu gdzie sklonujemy repozytorium (np.)
`cd C:\`
2. Klonujemy repozytorium
`git clone git@github.com:round-lonely-pixel/4fun-project.git`
3. Wchodzimy do sklonowanego katalogu i wpisujemy
`npm install`
(to chwilę potrwa)
4. Na końcu kompilujemy przy pomocy 
`npm run-script build`
5. W katalogu `dist\` pojawią się foldery:
* client_packages 
* packages
* migrations
* seeds

(o dwóch pierwszych [tutaj](https://wiki.rage.mp/index.php?title=Getting_Started_with_Development#Starting_the_server))

6. Przy każdej kolejnej kompilacji wystarczy wpisać `npm run-script build` będąc w katalogu ze skryptem

### Konfiguracja
#### Baza danych
1. Potrzebujemy zainstalowanego globalnie Knex'a
`npm install -g knex`
2. Konfigurację do bazy danych wstawiamy do [knexfile](https://github.com/round-lonely-pixel/4fun-project/blob/68c159b0ccbd9c8942f58fd2172fe49fa5554f98/src/server/knexfile.ts)
3. Ponownie kompilujemy skrypt
4. Przechodzimy do katalogu dist gdzie są migracje i seedy
5. Najpierw odpalamy migracje
` knex migrate:up`
(Niestety nie ma komendy na odpalenie wszystkich, trzeba ją wpisać kilka razy aż Knex nas poinformuje że wszystkie zostały wykonane)
6. Odpalamy seedy
`knex seed:run`
Po tym w bazie danych powinny być dane i tabele

#### Serwer
1. Zawsze ręcznie po kompilacji kopiujemy `client_packages/` i `packages/` z `dist/`
2. [A potem już klasycznie](https://wiki.rage.mp/index.php?title=Getting_Started_with_Server)

## Programowanie
### Podstawy
Programujemy przy użyciu [TypeScripta](https://en.wikipedia.org/wiki/TypeScript), kompilacja do JavaScriptu odbywa się przy pomocy [Webpack'a](https://webpack.js.org/).
Korzystamy z [Gita](https://en.wikipedia.org/wiki/Git), programujemy trzymając się zasad [DI](https://en.wikipedia.org/wiki/Dependency_injection) (wstrzykujemy przez konstruktor, ew. property), [Factory Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
Nad kodem dba [TSLint](https://palantir.github.io/tslint/), nie wrzucamy na master nic co ma wyłączoną którąś z zasad.
Front end jest pisany przy użyciu [Bootstrapa 4](https://getbootstrap.com/) i theme [Cyborg](https://bootswatch.com/cyborg/), CSS kompilowany z [LESS](http://lesscss.org/) i [jQuery](https://jquery.com/).
Operacje na bazie danych przy pomocy biblioteki [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) [Objection.JS](https://vincit.github.io/objection.js/)
Rage MP wymaga jakiejś znajomości o architekturze [Klient-serwer](https://en.wikipedia.org/wiki/Client%E2%80%93server_model) i wiedzę o [CEF](https://en.wikipedia.org/wiki/Chromium_Embedded_Framework)
### Katalogi
* src/ - Kod źródłowy skryptu
  * server/ - Kod z którego korzysta tylko serwer 
    *  modules/ - Moduły serwera. Czyli klasy które podłączają się podczas tworzenia do [eventów](https://wiki.rage.mp/index.php?title=Getting_Started_with_Events)
       *  Commands/ - Miejsce dla wszystkich komend tekstowych 
    * core/ - Wszystkie pomocnicze klasy używane przez moduły serwera
    * entity/ - Modele reprezentujące bazę danych
    * migrations/ - [Migracje](http://knexjs.org/#Migrations) dla modeli
    * seeds/ - [Seedy](http://knexjs.org/#Seeds-CLI)
  * core/ - Wspólne klasy pomocnicze które mogą być używanie zarówno przez klienta jak i serwer
  * client/ - Kod z którego korzysta tylko klient
    * core/ - Klasy pomocnicze z których korzysta tylko klient
    * modules/ - Moduły to klasy które komunikują się z UI które widzi gracz i reagują na event'y wyslane przez UI jak i serwer
    * ui/ - Czyli wszystkie dialogi, całe UI które widzi gracz wraz z tłumaczeniami
### Budowa UI
Każdy element UI posiada taką samą budowę, [przykład](https://github.com/round-lonely-pixel/4fun-project/tree/68c159b0ccbd9c8942f58fd2172fe49fa5554f98/src/client/ui/active-players)
* index.html - Czyli całe UI w HTMLu które widzi gracz
* main.ts - Czyli TypeScript odpowiedzialny za odpowiednie reagowanie na event'y od swojego modułu i zmienianie UI przy interakcji. **To jedyne miejsce gdzie zasady DI i Factory Pattern nie obowiązują**
* style.less - LESS CSS z którego powstanie CSS. **Trzymamy się aby nasz LESS używał tylko klas z prefiksem UI jak w przykładzie**
* translations/ - Katalog z labelami. **Staramy się zawsze używać labeli tak jak w przykładzie, nigdy nie używamy w UI zapisanych polskich słów w kodzie**

### Issues'y i Git
* Robiąc zadanie z issues'a tworzymy branch'a w formacie `issues<numer>`, np `issues5`
* Wrzucamy na niego cały kod związany z issue'sem, każdy commit zaczynamy od numeru issues'a, np:
`#5, Nowy typ powiadomienia`
* Nie wrzucamy nigdy jednego dużego commita ze zbiorczym opisem, czyli nie robimy nigdy nic w stylu:
`#5, Wykonanie zadania`
* Commity nazwamy po polsku
* Po wykonaniu zadania i wrzuceniu kodu na repozytorium tworzymy [Pull requesta](https://github.com/round-lonely-pixel/4fun-project/pulls)
  * Póki co zostawcie mergowanie pull requestów i zamykanie issues'ów mi ;)

### Tworzenie nowych issues'ów
* Dodajemy je [tutaj](https://github.com/round-lonely-pixel/4fun-project/issues)
* Uzupełniamy ładnie formularz
* Ustawiamy odpowiednie labele
* Milestone zawsze na razie dajemy na **First playable version**

### Inne uwagi
* Każda zmiana modelu powinna mieć swoją migrację i zaktualizowanego seeda
* **Nigdy nie wrzucamy zmienionego knexfile**
