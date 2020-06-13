# My Simple CRM
A simple Web-based Client Relationship Management application that uses back-end and front-end technologies.  I created this as an ambitious final project for CS50x at Harvard University.


## Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info
This is a simple CRM application that uses a Node server and MongoDB database to display various information to a small business about their client relations.  Features of this application include:
* Three different User Permission Levels
* An emailing system that uses nodemailer to send emails to users for user information and tickets
* Associated databases for easy relationship management
* Datatables and charts.js on the front-end for easy visual views of information
* Mobile-friendly design

## Technologies
This project was created with
* Back-End:
    * Node.js: 12.18.0
    * Body-parser: 1.19.0
    * Connect-Flash: 0.1.1
    * Connect-mongodb-session: 2.3.3
    * Dotenv: 8.2.0
    * ejs: 3.1.3
    * Express: 4.17.1
    * Express-Session: 1.17.1
    * Memorystore: 1.6.2
    * Method_Override: 3.0.0
    * Moment: 2.26.0
    * Mongoose: 5.9.14
    * Nodemailer: 6.4.8
    * Passport: 0.4.1
    * Passport-Local: 1.0.0
    * Passport-Local-Mongoose: 6.0.1

* Front-End:    
    * Bootstrap: 4.3.1
    * Chart.js: 2.8.0
    * Datatables: 1.10.20
    * Font-Awesome: 4.7.0
    * Jquery: 1.12.1
    * Moment: 2.8.4

## Setup
To run this application locally, first you must have node.js and mongoDB installed.  One installed, you must copy the "users" json documents into a mongo Database called "crm_app" in order to be able to login initially as an Admin.    Make sure your application is connected to the database; I did this using Azure in Microsoft Visual Studio Code.  To start, the username is "Admin" and the password is "Password;" these should be changed upon first starting this application.  In the root application folder, create an env file that includes the email address and password for a gmail account to be associated with nodemailer with this specification:

EMAIL= example@gmail.com
PASSWORD= "**********"

```
$ cd ../my_simple_crm
$ npm install
$ node app.js
```