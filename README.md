# Driven-pass

Backend application developed in NestJs for web credentials management. Here, you can organize your social media accounts, credit cards, and secure notes.

Try it out now on the API deploy: https://nest-pass.onrender.com <br/> <br/>
You can also access the documentation, built using Swagger, by navigating to the `'/api'` route on the link above, clicking [here](https://nest-pass.onrender.com/api), or locally by following the steps to run the application on your machine, described below.

## About

- [ ] I used PrismaORM to manage the database, migrations, and execute necessary queries.
- [ ] I implemented a repository layer - outside the Nest service pattern to structure the application in layers - to handle database access.
- [ ] I divided the code into modules (`@Modules`) and created one for each of the entities: Notes, Cards, Credentials, Users, Auth, separately.
- [ ] For the login session on the `'users/sign-in'` route, I used JWT Token verification.
- [ ] All routes, except for login and registration, are authenticated using unique user tokens.
- [ ] I encrypted all sensitive data for registration and credentials stored in the database.
- [ ] I have Automated Integration Tests with code coverage of over 80%, using design patterns with factories.


## API link Deploy: https://nest-pass.onrender.com

## API link Documentation using Swagger: https://nest-pass.onrender.com/api
