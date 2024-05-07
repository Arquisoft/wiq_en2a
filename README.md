# Conocer y Vencer

[![Deploy on release](https://github.com/Arquisoft/wiq_en2a/actions/workflows/release.yml/badge.svg)](https://github.com/Arquisoft/wiq_en2a/actions/workflows/release.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_en2a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_en2a)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_en2a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_en2a)
[![CodeScene Code Health](https://codescene.io/projects/53428/status-badges/code-health)](https://codescene.io/projects/53428)

This is the repo for the WIQ_EN2A team in the [Software Architecture course](http://arquisoft.github.io/) for the [2023/2024 edition](https://arquisoft.github.io/course2324.html). 

The application is deployed at: http://conoceryvencer.xyz

The API is at http://conoceryvencer.xyz:8000 , and you can see the API documentation at http://conoceryvencer.xyz:8000/api-doc

This repo is a basic application composed of several components:

- **Game service**. Express service that creates, delivers the logic and stores information about the last game played by the user.
- **Group service**. Express service responsible for the management of user groups.
- **Question generation service**. Express service that generates the question for the new game by retrieving data from Wikidata.
- **Gateway service**. Express service that is exposed to the public and serves as a proxy to the two previous ones. It is also in charge of the application's monitoring process.
- **User service**. Express service handling the insertion of new users in the system.
- **Auth service**. Express service that deals with the authentication of users.
- **Webapp**. React web application using the gateway service to allow basic login and new user features.
- **Multiplayer service**. A web socket server to communicate with the multiplayer mode in the application

Both the user and auth service share a Mongo database that is accessed with mongoose.

## Collaborators

- Álvaro Ibáñez Coedo
- Carlos Garcia Pelazas
- Carolina Barrios González
- Jaime Loredo Teijeiro
- Miguel Estapé Fernández
- Pablo Lobeto Arenas

## Quick start guide

### Using Docker

The fastest way for launching this sample project is using docker. Just clone the project:

```sh
git clone https://github.com/Arquisoft/wiq_en2a.git
```

and launch it with docker compose:

```sh
docker compose --profile dev up --build
```
