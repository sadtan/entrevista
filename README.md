1. Configurar la base de datos
	En una base de datos local ejecutar el archivo db.sql
``` sql
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

```

2. Configurar ConnectionString en el archivo **entrevista.api\appsettings.json** a la base de datos local en la que se ejecutó el archivo

```json
{

  "ConnectionStrings": {

    "DefaultConnection": "Server=(LocalDb)\\MSSQLLocalDB;Database=EntrevistaSebastianPalomino;Integrated Security=True;"

  },

  "Logging": {

    "LogLevel": {

      "Default": "Information",

      "Microsoft.AspNetCore": "Warning"

    }

  },

  "AllowedHosts": "*"

}
```

3. Ejecutar el servicio

``` bash
cd entrevista.api  
dotnet build
dotnet run
```
4. Compilar y ejecturar el cliente en otro terminal

``` bash
cd entrevista.client 
npm i
npm start
```

"# entrevista Sebastian Palomino" 
