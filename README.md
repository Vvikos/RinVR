# Visualisation de données en réalité virtuelle

<p align="center">
  <img src="img/logo-vrhub.png" width="400"><br>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-14.17.6-green.svg" />
  <img src="https://img.shields.io/badge/three-0.139.0-critical.svg" />
</p>

## Equipe projet

**Baptiste CERDAN - Janos FALKE - Mikhail GAYDAMAKHA - Thomas STEINMETZ - Victor VOGT**

## Vue d'ensemble

Ce projet vise à utiliser la réalité virtuelle pour visualiser des tableaux conséquents issus de fichiers CSV envoyé depuis un serveur distant. 

## Captures d'écran

<img src="img/tableau.png" width="450" height="350"/>
<img src="img/grid.png" width="450" height="350"/>
<img src="img/select.png" width="450" height="350"/>
<img src="img/180.JPG" width="400" height="175"/>
<img src="img/360.JPG" width="400" height="175"/>

## Fonctionnalités

- Visualiser des données extraites d'un fichier CSV à distance => [dépot git côté serveur](https://git.unistra.fr/r-vr/r-in-vr-server-r). 
- Utiliser des commandes pour isoler vos recherches (select, filter,group by et summerize).
- Visualiser les données en 180 ou 360 degrés.

## Installation

Pour exécuter en local :

```sh
$ npm install
and
$ npm start
```

Pour exécuter en ligne :

```html
https://r-vr.pages.unistra.fr/r-in-vr-react-xr
```

## Utilisation
<p align="center">
  <img src="img/controller.jpg" width="600"><br>
</p>

## Documentation 

Pour générer la documentation depuis la racine du projet :

```sh
$ jsdoc src -r -d docs
```
Puis ouvrez le fichier **index.html** dans le dossier **docs**.

## Licences

Université de Strasbourg - Master 2 Sciences et Ingénierie du Logiciel - Projet Master - 2021/2022
