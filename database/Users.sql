CREATE TABLE IF NOT EXISTS Users (
    Id VARCHAR(255) NOT NULL,
    Firstname TEXT NOT NULL,
    Lastname TEXT NOT NULL,
    Username LONGTEXT NOT NULL,
    Email LONGTEXT NOT NULL,
    Password LONGTEXT NOT NULL,
    Description LONGTEXT, 
    Birthdate date,
    Picture LONGTEXT DEFAULT 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
    PRIMARY KEY(Id)
);
