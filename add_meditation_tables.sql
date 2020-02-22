CREATE TABLE meditation_project(
id INT AUTO_INCREMENT,
name VARCHAR(256),
updatedAt TIMESTAMP,
editionYear INT,
type VARCHAR(256),
PRIMARY KEY(id)
);

CREATE TABLE meditation_languages(
id INT AUTO_INCREMENT,
languageName VARCHAR(128),
languageCode VARCHAR(128),
title VARCHAR(128),
author VARCHAR(128),
authorBio VARCHAR(128),
meditationProjectId INT,
PRIMARY KEY(id),
FOREIGN KEY (meditationProjectId)
references meditation_project(id)
);

CREATE TABLE meditation_station(
id INT AUTO_INCREMENT,
title VARCHAR(128),
author VARCHAR(128),
authorBio VARCHAR(128),
stationId INT,
placeId VARCHAR(128),
audioFileUrl VARCHAR (256),
`text` text,
meditationId int,
PRIMARY KEY(id),
FOREIGN KEY(meditationId)
references meditation_languages(id)
);
