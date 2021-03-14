Installation process

1) pull the respository from github
2) run command to install all dependent packages with command:  npm install
3) create .env in root directory
4) create mysql db and put its credentials in .env file
5) create table in newly created mysql db , run following query
   CREATE TABLE users (
	address varchar(100) NULL
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_0900_ai_ci;
3) put all varibales in .env as like .env_example along with local values
4) to run project run command npm start



# API information is available on following postman document
https://documenter.getpostman.com/view/14782014/Tz5qaHTj




