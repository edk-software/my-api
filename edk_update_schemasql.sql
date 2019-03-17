CREATE TABLE cantiga_projects_language (
id int AUTO_INCREMENT,
name VARCHAR(128),
shortcut VARCHAR(16), 
project_id int,
PRIMARY KEY(id),
FOREIGN KEY(project_id)
REFERENCES cantiga_projects(id));



CREATE TABLE cantiga_edk_reflections(
id INT AUTO_INCREMENT,
display_name VARCHAR(128),
content text,
audio_path VARCHAR(500),
project_id int,
PRIMARY KEY(id),
FOREIGN KEY(project_id) 
references cantiga_projects(id));

ALTER TABLE cantiga_edk_reflections CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;

CREATE TABLE cantiga_edk_testimonies(
id INT AUTO_INCREMENT,
content text,
route_id int,
PRIMARY KEY (id),
FOREIGN KEY (route_id)
references cantiga_edk_routes(id));

ALTER TABLE cantiga_edk_testimonies CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;

create table cantiga_edk_categories(
id INT AUTO_INCREMENT,
type VARCHAR(255),
PRIMARY KEY (id));


create table cantiga_edk_prompts(
id INT AUTO_INCREMENT,
title VARCHAR(255),
image_path VARCHAR(255),
short_content VARCHAR(255),
category_id INT(255),
PRIMARY KEY (id),
FOREIGN KEY(category_id)
references cantiga_edk_categories(id));

ALTER TABLE cantiga_edk_prompts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;

create table cantiga_edk_prompts_detail(
  id INT AUTO_INCREMENT,
  full_content text,
  prompt_id INT,
  PRIMARY KEY (id),
  UNIQUE (prompt_id),
  FOREIGN KEY(prompt_id)
  references cantiga_edk_prompts(id));


ALTER TABLE cantiga_edk_prompts_detail CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci;

create table cantiga_edk_user_category(
category_id int,
user_id int,
FOREIGN KEY(category_id) 
references cantiga_edk_categories(id),
FOREIGN KEY(user_id) 
references cantiga_users(id),
UNIQUE(category_id,user_id));


ALTER TABLE edk.cantiga_area_statuses add column isPublish tinyint(4);
ALTER TABLE edk.cantiga_projects add column editionId int;
