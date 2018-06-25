// npm install --save neo4j-driver
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://hobby-empfodcaihehgbkedmflgjbl.dbs.graphenedb.com:24786", neo4j.auth.basic("caie", "b.SWqtnbkloAf4.aHJafi0gGhTJ9eSd"));

var neoquery = "CREATE (a:Artista {nome: 'Beyoncé', id: 001}) RETURN a";

var params = {"limit": 10};

var session = driver.session();

session.run(query, params)
  .then(function(result) {
    result.records.forEach(function(record) {
        console.log(record.get('a'));
         // on application exit:
      driver.close();
    })
  })
  .catch(function(error) {
    console.log(error);
  });