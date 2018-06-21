const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    host: 'linux.ime.usp.br',
    user: 'vinne',
    password: 'tp15gv23',
    database: 'vinne',
    port: 5432,
    ssl: true
};

// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/uspotify';
/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile('index.html');
});

//CREATION ROUTES

// Create Album
router.post('/api/v1/album', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, produtora: req.body.prod, tipo: req.body.tipo, duracao: req.body.dur, foto_capa: req.body.foto, ano: req.body.ano};
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
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM USPotify.Album');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// Create Artist
router.post('/api/v1/artista', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {
    nome: req.body.nome,
    id: req.body.id,
    foto: req.body.foto,
    bio: req.body.bio,
    verificado: req.body.verif,
    p: req.body.p
  };
  // Get a Postgres client from the connection pool
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    const text = 'INSERT INTO USPotify.Artista(id, nome, bio, foto_perfil, verificado, pais) values($1, $2, $3, $4, $5, $6)';
    const values = [data.id, data.nome, data.bio. data.foto, data.verif, data.p];
    client.query(text, values);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM USPotify.Artista');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// Delete Artist
router.post('/api/v1/delartista', (req, res) => {
    const results = [];
    const nome = req.body.nome;

    console.log(req.body);

    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Artista WHERE nome=($1)', [nome]);
        // SQL Query -> Select Artists
        const query = client.query('SELECT * FROM USPotify.Artista');
        // Stream results back one row at a time
        query.on('row', (row) => {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
    });
});

// Create Music
router.post('/api/v1/music', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, titulo: req.body.titulo, arquivo: req.body.arquivo, exp: req.body.exp, id_album: req.body.album, faixa: req.body.faixa, duracao: req.body.dur};
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
    [data.id, data.titulo, data.arquivo, data.exp, data.id_album, data.faixa, data.duracao]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM USPotify.Musica');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Create a new user
router.post('/api/v1/user', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, datan: req.body.datan, pais: req.body.pais, foto: req.body.foto};
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
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM USPotify.Usuario');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
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
    const query = client.query('SELECT * FROM USPotify.Playlist');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


router.get('/api/v1/music', (req, res, next) => {
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
    const query = client.query('SELECT * FROM USPotify.Genero');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
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
        const query = client.query('SELECT * FROM USPotify.Album');
        // Stream results back one row at a time
        query.on('row', (row) => {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
    });
});

// Delete Playlist
router.post('/api/v1/delPlay', (req, res) => {
    const results = [];
    
    const id_criador = req.body.id;
    const nome = req.body.nome;

    console.log(req.body);

    pg.connect(config, (err, client, done) => {
        if (err) {
            done();
            console.log(err.stack);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query -> Delete Artist
        client.query('DELETE FROM USPotify.Playlist WHERE nome=($1) AND id_criador=($2)', [nome, id_criador]);
        // SQL Query -> Select Artists
        const query = client.query('SELECT * FROM USPotify.Playlist');
        // Stream results back one row at a time
        query.on('row', (row) => {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
    });
});

// Delete User
router.post('/api/v1/delUser', (req, res) => {
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
        client.query('DELETE FROM USPotify.Usuario WHERE id=($1)', [id]);
        // SQL Query -> Select Artists
        const query = client.query('SELECT * FROM USPotify.Usuario');
        // Stream results back one row at a time
        query.on('row', (row) => {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
    });
});

//UPDATES

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

    pg.connect(config, (err) => {
        const text = 'UPDATE USPotify.Artista'
        + 'SET id=($1), nome=($2), bio=($3), foto=($4), verificado=($5), p=($6)'
        + 'WHERE id=($1)';

        client.query(text, values);
        const query = client.query('SELECT * FROM USPotify.Artista');
        // Stream results back one row at a time
        query.on('row', (row) => {
          results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
          return res.json(results);
        });
    });
});

router.put('/api/v1/music/:music_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.music_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(config, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
