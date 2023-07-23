-- Id
-- UserId
-- ProjectId

-- One to many relation

-- Links user to different projects so he can view project tasks info exc

CREATE TABLE IF NOT EXISTS UsersProjects (
    Id INT NOT NULL AUTO_INCREMENT,
    UserId VARCHAR(255) NOT NULL,
    ProjectId INT NOT NULL,
    PRIMARY KEY(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId)
);