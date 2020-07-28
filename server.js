'use strict';

//useful express codes

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');

const superagent = require('superagent');
const overrider = require('method-override')

const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
const port = process.env.PORT || 3040;

app.use(express.static('./public'));
app.use(overrider('_method'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






app.get('/', (req, res) => {
    // res.send('hi');

    const url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
        .then((result) => {
            // res.send(result.body);
            res.render('index', { array: result.body });
        });

});


app.get('/jokes-page', (req, res) => {
    let sql = `SELECT * FROM jokes`;
    client.query(sql)
        .then((result) => {
            res.render('favorit-joke', { array: result.rows });
        });
});

app.post('/view-details/:id', (req, res) => {
    let id = req.params.id;
    // console.log('id iss ' + id);
    let sql = `SELECT * FROM jokes where id=$1;`;
    let values = [id];

    client.query(sql, values)
        .then((result) => {
            res.render('joke-details', { array: result.rows });
        })

});


app.delete('/delete/:id', (req, res) => {
    let sql = `DELETE FROM jokes WHERE id=$1`;
    let id = [req.params.id];
    client.query(sql, id)
        .then(() => {
            res.redirect('/jokes-page');
        })
});


app.put('/update/:id', (req, res) => {
    let sql = `UPDATE jokes set type=$1,setup=$2,punchline=$3 WHERE id=$4;`;
    let id = req.params.id;
    let values = [req.body.type, req.body.setup, req.body.punchline, id];
    // console.log('update' + values);


    client.query(sql, values)
        .then(() => {
            res.redirect(`/view-details/${id}`);
        });

});


app.get('/random-joke', (req, res) => {
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url)
        .then((result) => {
            res.render('random-joke', { array: result.body });
        });
});


app.post('/add', (req, res) => {
    let sql = 'INSERT INTO jokes(type,setup,punchline)values($1,$2,$3);';
    let values = [req.body.type, req.body.setup, req.body.punchline];
    client.query(sql, values)
        .then(() => {
            res.redirect('/jokes-page');
        });
});



client.connect()
    .then(() => {
        app.listen(port, () => {
            console.log('i am listening on port ', port);
        })
    });

// app.listen(port, () => {
//         console.log('i am listening on port ', port);
//     })