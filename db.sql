CREATE DATABASE EntrevistaSebastianPalomino
GO

USE EntrevistaSebastianPalomino;
CREATE TABLE Usuario
(	Id INT NOT NULL IDENTITY(1, 1),
    Nombre VARCHAR(500) NOT NULL,
    Apellido VARCHAR(500) NOT NULL,
    Correo VARCHAR(500) NOT NULL,
    Cedula INT NOT NULL,
    Contrasena VARCHAR(500) NOT NULL,
	Clasificacion VARCHAR(100) NULL,
    Puntaje INT NULL,
	UltimoIngreso DATETIME NOT NULL,
	PRIMARY KEY (Id)
)

INSERT INTO
    Usuario (
        Nombre,
        Apellido,
        Correo,
        Cedula,
        Contrasena,
        UltimoIngreso
    )
    VALUES
    (
        'Usuario 1',
        'Apellido 1',
        'correo@example.com',
        1233,
        'pass1',
        (DATEADD(HOUR, -12, GETDATE()))
    ),
    (
        'Usuario 2',
        'Apellido 2',
        'correo@gmail.com',
        2233,
        'pass2',
        (DATEADD(DAY, -2, GETDATE()))
    ),
    (
        'Usuario 3',
        'Apellido 3',
        'correo@hotmail.com',
        3233,
        'pass3',
        (DATEADD(DAY, -7, GETDATE()))
    )

SELECT * FROM Usuario
