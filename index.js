const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/v1", (req, res) => {
  res.json("");
});

app.post("/api/v1/cadastro", (req, res) => {
  let connection = mysql.createConnection({
    host: "jovemti.com",
    user: "jovemti1_webservice",
    password: "Guardiao91",
    database: "jovemti1_api",
    port: 3306
  });

  connection.connect(error => {
    if (error) {
      connection.end()
      return res.json("Error")
    }

    let controle = req.body;
    controle.data = new Date();
    
    connection.query(`INSERT INTO serial(data) Values('${new Date()}')`, (error, results, fields) => {                
        if(error){
            connection.end()
            return res.status(400).json(error)
        }
        controle.senha = results.insertId;    
        connection.query(`INSERT INTO controle(placa, portao, nota, data, senha) Values('${controle.placa}', ${controle.portao}, ${controle.nota}, '${controle.data}', ${controle.senha})`, (error, results, fields) => {                
            if(error){
                connection.end()
                return res.status(400).json(error)
            }    
            controle.id = results.insertId
            connection.end()
            return res.json(controle)
        })
    })
  })
})

app.get("/api/v1/consulta", (req, res) => {
    let connection = mysql.createConnection({
        host: "jovemti.com",
        user: "jovemti1_webservice",
        password: "Guardiao91",
        database: "jovemti1_api",
        port: 3306
      })
    
      connection.connect(error => {
        if (error) {
          connection.end()
          return res.json("Error")
        }
    
        connection.query("select * from serial", (error, results, fields) => {                    
            connection.end()
            return res.json(results)
        })
      })
})

app.listen(port, () => console.log(`listening on port ${port}!`));
