-- ProjectId
-- Name
-- Description
-- Icon

CREATE TABLE IF NOT EXISTS Projects (
    ProjectId INT NOT NULL AUTO_INCREMENT,
    Name LONGTEXT NOT NULL,
    Description LONGTEXT NOT NULL,
    Icon LONGTEXT NOT NULL DEFAULT 'Square',
    PRIMARY KEY(ProjectId)
);