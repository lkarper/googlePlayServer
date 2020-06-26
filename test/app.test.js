const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('GET /apps', () => {

    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const appl = res.body[0];
                expect(appl).to.include.all.keys(
                    'App', 
                    'Category', 
                    'Rating', 
                    'Reviews', 
                    'Size', 
                    'Installs', 
                    'Type', 
                    'Price', 
                    'Content Rating', 
                    'Genres', 
                    'Last Updated', 
                    'Current Ver', 
                    'Android Ver'
                );
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'candy' })
            .expect(400, 'Sort must be one of Rating or App');
    });

    it('should be 400 if genres is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'none' })
            .expect(400, `Genres must include one of: "'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'".`);
    });

    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort:'rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.Rating > appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort by app', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'app' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtI.App.toLowerCase() > appAtIPlus1.App.toLowerCase()) {
                        sorted = false;
                        break;
                    } 
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should filter by genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filtered = true;
                for (let app of res.body) {
                    if (app.Genres.toLowerCase().indexOf('action') === -1) {
                        filtered = false;
                        break;
                    }
                }
                expect(filtered).to.be.true;
            });
    })

    it('should sort and filter', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'rating', genres: 'action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let filtered = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtI.Rating < appAtIPlus1.Rating) {
                        sorted = false;
                        break;
                    } 
                    i++;
                }
                for (let app of res.body) {
                    if (app.Genres.toLowerCase().indexOf('action') === -1) {
                        filtered = false;
                        break;
                    }
                }
                expect(sorted).to.be.true;
                expect(filtered).to.be.true;
            });
    });

});