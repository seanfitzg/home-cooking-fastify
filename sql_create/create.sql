-- USE homecooking;

CREATE TABLE Recipes (
    Id SERIAL NOT NULL UNIQUE,
    UserId varchar NOT NULL,
    Name varchar NULL,
    Method varchar NULL,
    Description varchar NULL
);

CREATE TABLE Ingredients (
    Id bit(16) PRIMARY KEY NOT NULL,
    Item varchar NULL,
    Amount DOUBLE PRECISION NOT NULL,
    RecipeId int NOT NULL references Recipes(Id)
);

-- host all all 0.0.0.0/0 trust