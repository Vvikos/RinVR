# Visualisation de données en réalité virtuelle

<p align="center">
  <img src="img/logo-vrhub.png" width="400"><br>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-14.17.6-green.svg" />
  <img src="https://img.shields.io/badge/three-0.139.0-critical.svg" />
</p>

## Contributors

**Baptiste CERDAN - Janos FALKE - Mikhail GAYDAMAKHA - Thomas STEINMETZ - Victor VOGT**

## General

This project is dedicated to CSV data visualization in virtual reality. 

## Screenshots

<img src="img/all.png" width="400" height="350"/>
<img src="img/query_builder.png" width="500" height="250"/>
<img src="img/tableau.png" width="400" height="350"/>
<img src="img/grid.png" width="250" height="350"/>
<img src="img/180.JPG" width="400" height="175"/>
<img src="img/360.JPG" width="400" height="175"/>

## Features

- Remote CSV data visualization => [remote git back-end](https://git.unistra.fr/r-vr/r-in-vr-server-r). 
- Use commands to isolate data (select, filter,group by et summerize).
- 180 or 360 degrees display.

## Installation

To run locally :

Make sure the back-end server is running and accessible.

```sh
$ npm install
and
$ npm start
```

## Use
<p align="center">
  <img src="img/controller.jpg" width="600"><br>
</p>

## Documentation 

Generate documentation :

```sh
$ jsdoc src -r -d docs
```
Then open **index.html** in the **docs** folder.

## Licences

Université de Strasbourg - Master 2 Sciences et Ingénierie du Logiciel - Projet Master - 2021/2022
