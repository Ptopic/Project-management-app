CREATE TABLE IF NOT EXISTS Favorites (
    Id INT NOT NULL AUTO_INCREMENT,
    UserId VARCHAR(255) NOT NULL,
    ProjectId INT NOT NULL,
    PRIMARY KEY(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId)
);