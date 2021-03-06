const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

// Neo4J Details
var neo4j = require('neo4j-driver').v1;
var neodriver = neo4j.driver("bolt://hobby-empfodcaihehgbkedmflgjbl.dbs.graphenedb.com:24786", neo4j.auth.basic("caie", "b.SWqtnbkloAf4.aHJafi0gGhTJ9eSd"));

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    host: 'stampy.db.elephantsql.com',
    user: 'dbekqqqu',
    password: '7HgZ_EsDThMRjRf7BJrM4YKder1ixQVj',
    database: 'dbekqqqu',
    port: 5432,
    ssl: true
};

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile('index.html');
});

//CREATION ROUTES

// Create Album
router.post('/api/v1/album', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, produtora: req.body.prod, tipo: req.body.tipo, duracao: req.body.dur, foto_capa: req.body.foto, ano: req.body.ano, id_artista: req.body.id_artista};
  // Get a Postgres client from the connection pool
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO USPotify.Album(id, nome, produtora, tipo, duracao, foto_capa, ano) values($1, $2, $3, $4, $5, $6, $7)',
    [data.id, data.nome, data.produtora, data.tipo, data.duracao, data.foto_capa, data.ano]);

    client.query('INSERT INTO USPotify.Gravou(id_artista, id_album) values($1, $2)',
    [data.id_artista, data.id]);

    res.redirect('/albuns.html');
    
  });
});


// Create Artist
router.post('/api/v1/artista', (req, res, next) => {
  const results = [];
  // Grab data from http request

  // Inserir no BD em Grafos

  const neodata = {id: req.body.id, nome: req.body.nome};
  var params = {"nome": neodata.nome, "id": neodata.id};
  var neoquery = "CREATE (a:Artista {nome: $nome, id: $id}) RETURN a";
  var neosession = neodriver.session();

  neosession.run(neoquery, params)
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

  // const data = {id: req.body.id, nome: req.body.nome, bio: req.body.bio, foto: req.body.foto, verificado: req.body.verif, p: req.body.p};

  const values = [
      req.body.id,
      req.body.nome,
      req.body.bio,
      req.body.foto,
      req.body.verif,
      req.body.p
  ];

  // Get a Postgres client from the connection pool
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO USPotify.Artista(id, nome, bio, foto_perfil, verificado, pais) values($1, $2, $3, $4, $5, $6)',
    values);

    res.redirect('/artistas.html');

  });


});


// Create Music
router.post('/api/v1/music', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, titulo: req.body.titulo, arquivo: req.body.arquivo, expli: req.body.expli, id_album: req.body.album, faixa: req.body.faixa, duracao: req.body.dur, genero: req.body.genero, relevancia: req.body.relevancia};
  // Get a Postgres client from the connection pool
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO USPotify.Musica(id, titulo, arquivo_audio, explicita, id_album, faixa, duracao) values($1, $2, $3, $4, $5, $6, $7)',
    [data.id, data.titulo, data.arquivo, data.expli, data.id_album, data.faixa, data.duracao]);

    // Aqui seria legal verificar se o gênero que a pessoa estipulou para a música já existe na relação Genero.
    // Caso ele exista, OK! Do contrário, inserí-lo na relação Genero antes de fazer a inserção na Tem_Genero.

    client.query('INSERT INTO USPotify.Tem_Genero(id_musica, nome_genero, relevancia) values($1, $2, $3)',
    [data.id, data.genero, data.relevancia]);

    res.redirect('/musicas.html');
  });
});

//Create a new user
router.post('/api/v1/user', (req, res, next) => {
  const results = [];


  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, datan: req.body.datan, pais: req.body.pais, foto: req.body.foto};

  // Inserir no BD em Grafos

  const neodata = {id: req.body.id, nome: req.body.nome};
  var params = {"nome": neodata.nome, "id": neodata.id};
  var neoquery = "CREATE (a:Usuario {nome: $nome, id: $id}) RETURN a";
  var neosession = neodriver.session();

  neosession.run(neoquery, params)
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

  // Get a Postgres client from the connection pool

  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO USPotify.Usuario(id, nome, data_nasc, pais, foto_perfil) values($1, $2, $3, $4, $5)',
    [data.id, data.nome, data.datan, data.pais, data.foto]);

    res.redirect('/usuarios.html');
  });
});

//Create a new playlist
router.post('/api/v1/playlist', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, desc: req.body.desc, datac: '01-01-2000',  foto: req.body.foto, pub: req.body.pub, criador: req.body.criador, colab: req.body.colab, dur: req.body.dur, segs: '0'};
  // Get a Postgres client from the connection pool
  const segs = 0;
  const datac = 01-01-2012;
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    console.log(data);
    // SQL Query > Insert Data
    client.query('INSERT INTO USPotify.Playlist(id, nome, descricao, data_criacao, foto, publica, id_criador, colaborativa, duracao, num_seguidores) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [data.id, data.nome, data.desc, data.datac, data.foto, data.pub, data.criador, data.colab, data.dur, data.segs]);
    // SQL Query > Select Data
    res.redirect('/playlists.html');
  });
});


//DELEÇÕES

// Delete Artist
router.post('/api/v1/delartista', (req, res) => {
    const results = [];
    const id = req.body.id;

    // Remover do BD em Grafos

    const neodata = {id: req.body.id};
    var params = {"id": neodata.id};
    var neoquery = "MATCH (n:Artista { id: $id }) DETACH DELETE n";
    var neosession = neodriver.session();

    neosession.run(neoquery, params)
      .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record.get('n'));
             // on application exit:
          driver.close();
        })
      })
      .catch(function(error) {
        console.log(error);
      });

    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Artista WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        res.redirect('/artistas.html');
    });
});


// Delete Album
router.post('/api/v1/delAlbum', (req, res) => {
    const results = [];

    const id = req.body.id;

    console.log(req.body);

    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Album WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        res.redirect('/albuns.html');
    });
});

// Delete Music
router.post('/api/v1/delmusica', (req, res) => {
    const results = [];

    const id = req.body.id;

    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Musica WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        res.redirect('/musicas.html');
    });
});

// Delete Playlist
router.post('/api/v1/delPlay', (req, res) => {
    const results = [];

    const id = req.body.id;


    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Playlist WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        res.redirect('/playlists.html');
    });
});

// Delete User
router.post('/api/v1/delUser', (req, res) => {
    const results = [];

    const id = req.body.id;

    // Remover do BD em Grafos

    const neodata = {id: req.body.id};
    var params = {"id": neodata.id};
    var neoquery = "MATCH (n:Usuario { id: $id }) DETACH DELETE n";
    var neosession = neodriver.session();

    neosession.run(neoquery, params)
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


    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Usuario WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        res.redirect('/usuarios.html');
        
    });
});


//UPDATES

// Update Álbum
router.post('/api/v1/updatealbum', (req, res) => {
    const values = [
        req.body.id,
        req.body.nome,
        req.body.produtora,
        req.body.tipo,
        req.body.duracao,
        req.body.foto_capa,
        req.body.ano

    ];

    pg.connect(config, (err, client, done) => {
        const results = [];
        const text = 'UPDATE USPotify.Album'
        + ' SET nome=($2), produtora=($3), tipo=($4), duracao=($5), foto_capa=($6), ano=($7)'
        + ' WHERE id=($1)';

        client.query(text, values, (err, res) => {

            if (err) {
                return console.log(err.message);
            } else {
                console.log(res);
            }
        });
        res.redirect('/albuns.html');

        
    });
});

// Update Artist
router.post('/api/v1/updateartista', (req, res) => {
    const values = [
        req.body.id,
        req.body.nome,
        req.body.bio,
        req.body.foto,
        req.body.verif,
        req.body.p
    ];

    const neodata = {id: req.body.id, nome: req.body.nome};
    var params = {"nome": neodata.nome, "id": neodata.id};
    var neoquery = "MATCH (n:Artista { id: $id }) SET n.nome = $nome RETURN n";
    var neosession = neodriver.session();

    neosession.run(neoquery, params)
      .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record.get('n'));
             // on application exit:
          driver.close();
        })
      })
      .catch(function(error) {
        console.log(error);
      });

    pg.connect(config, (err, client, done) => {
        const results = [];
        const text = 'UPDATE USPotify.Artista'
        + ' SET nome=($2), bio=($3), foto_perfil=($4), verificado=($5), pais=($6)'
        + ' WHERE id=($1)';

        client.query(text, values, (err, res) => {

            if (err) {
                return console.log(err.message);
            } else {
                console.log(res);
            }
        });
        res.redirect('/artistas.html');
        
    });
});

// Update Music
router.post('/api/v1/updatemusic', (req, res) => {
    const values = [
        req.body.id,
        req.body.titulo,
        req.body.arquivo,
        req.body.exp,
        req.body.album,
        req.body.faixa,
        req.body.dur
    ];

    pg.connect(config, (err, client, done) => {
        const results = [];
        const text = 'UPDATE USPotify.Musica'
        + ' SET titulo=($2), arquivo_audio=($3), explicita=($4), id_album=($5), faixa=($6), duracao=($7)'
        + ' WHERE id=($1)';

        client.query(text, values, (err, res) => {

            if (err) {
                return console.log(err.message);
            } else {
                console.log(res);
            }
        });
        res.redirect('/musicas.html');
        
    });
});

// Update User
router.post('/api/v1/updateuser', (req, res) => {
    const values = [
        req.body.id,
        req.body.nome,
        req.body.datan,
        req.body.pais,
        req.body.foto,
    ];

    const neodata = {id: req.body.id, nome: req.body.nome};
    var params = {"id": neodata.id, "nome": neodata.nome};
    var neoquery = "MATCH (n:Usuario { id: $id }) SET n.nome = $nome RETURN n";
    var neosession = neodriver.session();

    neosession.run(neoquery, params)
      .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record.get('n'));
             // on application exit:
          driver.close();
        })
      })
      .catch(function(error) {
        console.log(error);
      });

    pg.connect(config, (err, client, done) => {
        const results = [];
        const text = 'UPDATE USPotify.Usuario'
        + ' SET nome=($2), data_nasc=($3), pais=($4), foto_perfil=($5)'
        + ' WHERE id=($1)';

        client.query(text, values, (err, res) => {

            if (err) {
                return console.log(err.message);
            } else {
                console.log(res);
            }
        });
        res.redirect('/usuarios.html');
        
    });
});

// Update Playlist
router.post('/api/v1/updateplaylist', (req, res) => {
    const values = [
        req.body.id,
        req.body.nome,
        req.body.desc,
        req.body.foto,
        req.body.pub,
        req.body.colab,
        req.body.dur
    ];

    console.log(values);
    pg.connect(config, (err, client, done) => {
        const results = [];
        const text = 'UPDATE USPotify.Playlist'
                + ' SET nome=($2), descricao=($3),'
                + ' foto=($4), publica=($5), colaborativa=($6),'
                + ' duracao=($7)'
                + ' WHERE id=($1);';
        client.query(text, values, (err, res) => {
            if (err) {
                return console.log(err.message);
            } else {
                console.log(res);
            }
        });
        // const query = client.query('SELECT * FROM USPotify.Playlist;');
        res.redirect('/playlists.html');
        // query.on('end', () => {
        //     done();
        //     res.redirect('/');
        // });
    });
});

// BUSCAS

/*
router.post('/api/v1/searchalbum', (req, res) => {
    const searchString = ['%' + req.body.searchString + '%'];

    pg.connect(config, (err, client, done) => {
        const text = 'SELECT nome, produtora, tipo, foto_capa'
            + ' FROM USPotify.Album'
            + ' WHERE nome LIKE ($1);';
        const query = client.query({
            text: text,
            values: searchString,
            rowMode: 'array'
        });
        query.on('end', () => {
          done();
          return res.render('results', {table: "Album", rows: query._result.rows});
        });
    });
});

router.post('/api/v1/searchartist', (req, res) => {
    const searchString = ['%' + req.body.searchString + '%'];

    pg.connect(config, (err, client, done) => {
        const text = 'SELECT nome, foto_perfil, verificado'
            + ' FROM USPotify.Artista'
            + ' WHERE nome LIKE ($1);';
        const query = client.query({
            text: text,
            values: searchString,
            rowMode: 'array'
        });
        query.on('end', () => {
            done();
            return res.render('results', {table: "Artista", rows: query._result.rows});
        });
    });
});
*/
router.post('/api/v1/searchmusic', (req, res) => {
    const searchString = ['%' + req.body.searchString + '%'];

    pg.connect(config, (err, client, done) => {
        const text = 'SELECT musica.titulo, explicita, musica.duracao, foto_capa, arquivo_audio, artista.nome'
            + ' FROM USPotify.Musica, USPotify.Album, USPotify.Artista, USPotify.Gravou'
            + ' WHERE musica.id_album = album.id AND musica.titulo LIKE ($1) AND gravou.id_artista = artista.id AND gravou.id_album = album.id;';
        const query = client.query({
            text: text,
            values: searchString,
            rowMode: 'array'
        });
        query.on('end', () => {
            done();
            return res.render('musica', {table: "Musica", rows: query._result.rows});
        });
    });
});


// ESTABELECER RELACIONAMENTOS ENTRE ARTISTAS
router.post('/api/v1/relacionarartista', (req, res) => {
    // Inserir no BD em Grafos

  const neodata = {id1: req.body.id1, id2: req.body.id2, relevancia: req.body.relevancia};
  var params = {"id1": neodata.id1, "id2": neodata.id2, "relevancia": neodata.relevancia};
  var neoquery = "MATCH (a:Artista),(b:Artista) WHERE a.id = $id1 AND b.id = $id2 CREATE (a)-[r:RELACIONADO { relevancia: $relevancia }]->(b) RETURN type(r), r.relevancia";
  var neosession = neodriver.session();


  neosession.run(neoquery, params)
    .then(function(result) {
      result.records.forEach(function(record) {
          console.log(record.get('r.relevancia'));
           // on application exit:
        neodriver.close();
        res.redirect('/artistas.html');
      })
    })
    .catch(function(error) {
      console.log(error);
    });
});

// ESTABELECER RELACIONAMENTOS DE AMIZADE
router.post('/api/v1/relacionaramigos', (req, res) => {
    // Inserir no BD em Grafos

  const neodata = {id: req.body.id};
  var params = {"id": neodata.id};
  var neoquery = "MATCH (a:Usuario),(b:Usuario) WHERE a.id = '1' AND b.id = $id CREATE (a)-[r:AMIGO_DE]->(b) RETURN type(r), r.relevancia";
  var neosession = neodriver.session();


  neosession.run(neoquery, params)
    .then(function(result) {
      result.records.forEach(function(record) {
          console.log(record.get('r.relevancia'));
           // on application exit:
        neodriver.close();
        res.redirect('/usuarios.html');
      })
    })
    .catch(function(error) {
      console.log(error);
    });
});


//RECOMENDAÇÕES DA HOME

router.get('/api/v1/gender', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool

  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }


    // SQL Query > Select Data
    const query = client.query("SELECT musica.titulo as titulo, foto_capa, artista.nome as artista, musica.arquivo_audio as link FROM USPotify.Tem_Genero, USPotify.Album, USPotify.Musica, USPotify.Artista, USPotify.Gravou WHERE tem_genero.nome_genero = 'Indie' AND tem_genero.id_musica = musica.id AND musica.id_album = album.id AND gravou.id_album = album.id AND gravou.id_artista = artista.id LIMIT 8;");
    // Stream results back one row at a time

    query.on('row', (row) => {
      results.push(row);
    });


    console.log(results);
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


router.get('/api/v1/sugartists', (req, res, next) => {

  const results = [];
  // Get a Postgres client from the connection pool

  const neosession = neodriver.session();
  const neoresult = neosession.run("MATCH (:Artista { nome: 'Beach House' })-[RELACIONADO]->(artista) RETURN artista.id");
  const collectedArtists = [];

  neoresult.subscribe({

    onNext: record => {

      const id = record.get(0);
      collectedArtists.push(id);
    },
    onCompleted: () => {
      neosession.close();
      console.log('Ids: [' + collectedArtists.join(', ') + ']');

      // querying name and profile photo from these artists
      pg.connect(config, (err, client, done) => {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }


        // SQL Query > Select Data
        const query = client.query("SELECT nome, foto_perfil FROM USPotify.Artista WHERE id IN (" + collectedArtists.join(', ') + ") LIMIT 8;");
        // Stream results back one row at a time

        query.on('row', (row) => {
          results.push(row);
        });


        console.log(results);
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
      });
    },
    onError: error => {
      console.log(error);
    }
  });
});



router.get('/api/v1/sugfriends', (req, res, next) => {

  const results = [];
  // Get a Postgres client from the connection pool

  const neosession = neodriver.session();
  const neoresult = neosession.run("MATCH (:Usuario { id: '1' })-[AMIGO_DE]->(usuario) RETURN usuario.id");
  const collectedFriends = [];

  neoresult.subscribe({

    onNext: record => {

      const id = record.get(0);
      collectedFriends.push(id);
    },
    onCompleted: () => {
      neosession.close();
      console.log('Ids: [' + collectedFriends.join(', ') + ']');

      // querying name and profile photo from these artists
      pg.connect(config, (err, client, done) => {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }


        // SQL Query > Select Data
        const query = client.query("SELECT nome, foto_perfil FROM USPotify.Usuario WHERE id IN (" + collectedFriends.join(', ') + ") LIMIT 8;");
        // Stream results back one row at a time

        query.on('row', (row) => {
          results.push(row);
        });


        console.log(results);
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
      });
    },
    onError: error => {
      console.log(error);
    }
  });
});
/*
router.post('/api/v1/searchplaylist', (req, res) => {
    const searchString = ['%' + req.body.searchString + '%'];

    pg.connect(config, (err, client, done) => {
        const text = 'SELECT nome, descricao, foto, num_seguidores'
            + ' FROM USPotify.Playlist'
            + ' WHERE nome LIKE ($1) AND publica = TRUE;';
        const query = client.query({
            text: text,
            values: searchString,
            rowMode: 'array'
        });
        query.on('end', () => {
            done();
            return res.render('results', {table: "Playlist", rows: query._result.rows});
        });
    });
});
*/
module.exports = router;
