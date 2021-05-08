-- CREATE DATABASE freedbtech_dashboard;

USE freedbtech_dashboard;
-- DROP TABLE users; 
CREATE TABLE users (
id INT NOT NULL AUTO_INCREMENT,
username varchar(30) NOT NULL,
password varchar(120) NOT NULL,
profile_picture varchar(120),
PRIMARY KEY(id)
);

-- DROP TABLE posts; 

CREATE TABLE posts (
id INT NOT NULL AUTO_INCREMENT,
link varchar(200) NOT NULL,
description varchar(300) NOT NULL,
icon varchar(200),
created_by varchar(120),
PRIMARY KEY(id)
);

-- DROP TABLE comments;

-- DROP TABLE chat_posts;

CREATE TABLE chat_posts(
id INT NOT NULL AUTO_INCREMENT,
message varchar(300),
image varchar(300),
created_by varchar(100),
PRIMARY KEY(id))
;

CREATE TABLE chat_comments (
id INT NOT NULL AUTO_INCREMENT,
message varchar(300),
created_by varchar(100),
post_id INT,
PRIMARY KEY(id)
);

DROP TABLE study_trackers;

CREATE TABLE study_trackers (
id INT NOT NULL AUTO_INCREMENT,
monday INT NOT NULL DEFAULT 0,
tuesday INT NOT NULL DEFAULT 0,
wednesday INT NOT NULL DEFAULT 0,
thursday INT NOT NULL DEFAULT 0 ,
friday INT NOT NULL DEFAULT 0,
saturday INT NOT NULL DEFAULT 0,
sunday INT NOT NULL DEFAULT 0,
user_id varchar(100),
PRIMARY KEY(id)
);

SELECT * FROM study_trackers;

SELECT * FROM chat_comments;

SELECT * FROM users;
SELECT * FROM posts;
-- INSERT INTO users (username,password,profile_picture) VALUES('admin','$argon2i$v=19$m=4096,t=3,p=1$ETQSy1H1Lguv+jk5okYacA$qQ3TooUa5bmxpISdcc9MmzFCnOzvfYFKFJerq8veHvE','https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png');

