const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const apps = require('./playstore');

app.get('/apps', (req, res) => {
    let { sort = '', genres = '' } = req.query;

    if (sort) {
        if (!['rating', 'app'].includes(sort.toLowerCase())) {
            return res
                .status(400)
                .send('Sort must be one of Rating or App');
        }
    }

    if (genres) {
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres.toLowerCase())) {
            return res 
                .status(400)
                .send(`Genres must include one of: "'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'".`)
        }
    }

    const results = apps
        .filter(app => 
                app
                    .Genres
                    .toLowerCase()
                    .includes(genres.toLowerCase()));

    if (sort) {
        sort.toLowerCase() === 'rating' ? sort = 'Rating' : sort = 'App';
        results
            .sort((a, b) => {
                if (sort === 'App') {
                    const x = a[sort].toLowerCase();
                    const y = b[sort].toLowerCase();
                    return x > y ? 1 : x < y ? -1 : 0;
                }
                const x = a[sort];
                const y = b[sort];
                return x < y ? 1 : x > y ? -1 : 0;
            });
    }

    res.json(results);
});

module.exports = app;