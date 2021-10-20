USE homecooking;


CREATE TABLE Recipes (
    Id int NOT NULL AUTO_INCREMENT,
    UserId int NOT NULL,
    Name text NULL,
    Method text NULL,
    Description text NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE Ingredients (
    Id varbinary(16) NOT NULL,
    Item text NULL,
    Amount double NOT NULL,
    RecipeId int NULL,
    PRIMARY KEY (Id),
    CONSTRAINT `FK_Ingredients_Recipes_RecipeId` FOREIGN KEY (RecipeId) REFERENCES Recipes (Id) ON DELETE RESTRICT
);

