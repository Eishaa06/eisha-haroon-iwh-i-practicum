const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage: get all Pets records and display in a table
app.get('/', async (req, res) => {
    const petsUrl = 'https://api.hubapi.com/crm/v3/objects/p_pets?properties=name,species,age';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(petsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Data | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Show the form to add a new Pet
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Handle form submission, create new Pet record
app.post('/update-cobj', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "species": req.body.species,
            "age": req.body.age
        }
    };

    const createUrl = 'https://api.hubapi.com/crm/v3/objects/p_pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createUrl, create, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));