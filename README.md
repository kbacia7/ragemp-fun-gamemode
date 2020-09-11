# ragemp-fun-gamemode
Unfinished gamemode DM/4fun for [rage.mp](https://rage.mp/)

# What is this?
I archivised my unfinished gamemode for [rage.mp](https://rage.mp/) - modification for the multiplayer in Grand Theft Auto V where peoples can build custom gamemodes.

Techstack in nutshell:
* TypeScript, webpack
   * Depedency Injection via constructor or property
   * Factory Pattern
   * KISS, DRY
   * TSLint and some mocha tests of rest-api
* Bootstrap with [Cyborg theme](https://bootswatch.com/cyborg/)
   * [LESS](http://lesscss.org/) for styles
* Client-side modules distributed as single-scripts (compiled from TS)
   * Translations for client-side modules in JSON files
* Docker and `docker-compose` (but I'm not sure that actually it's work)
* Database back-end was written in Python [Django REST](https://www.django-rest-framework.org/tutorial/quickstart/)
   * Communication beetwen script and database is using this REST API
   * Distributed on Git as [submodule](https://github.com/kbacia7/ragemp-fun-gamemode-rest-api/tree/74756f61410bf1c1948fb563e5b14e164c8ba052)
      * Unfortunely, Python rest-api wasn't written in any standards and doesn't contains tests, but in mocha is few tests of REST Api :(
For all ready to use functions I suggest look at commits history
