const mongoose = require('mongoose');
const chai = require('chai');
const chaiHTTP = require('chai-http');

mongoose.connect('mongodb://localhost/test', {}, err => {
  if (err) return console.log(err);
  console.log('TEST DB Connectioned accomplished');
});

const expect = chai.expect;
const server = require('../server');
const Band = require('../Model');

chai.use(chaiHTTP);

describe('Band', () => {
  describe(`[GET] /api/bands`, () => {
    it('should get a list of all the bands in db', done => {
      chai
        .request(server)
        .get('/api/bands')
        .end((err, response) => {
          if (err) {
            console.log(err);
            return done();
          }
          expect(response.status).to.equal(200);
          return done();
        });
    });
  });
});

describe('Bands', () => {
  let bandId;
  beforeEach(done => {
    const newBand = new Band({
      name: 'Radiohead',
      genre: 'Alt-rock',
      numberOfMembers: '2',
      yearFounded: '1990'
    });
    newBand.save((err, savedBand) => {
      if (err) {
        console.log(err);
        done();
      }
      bandId = savedBand._id;
      done();
    });
  });

  afterEach(done => {
    Band.remove({}, err => {
      if (err) console.log(err);
      return done();
    });
  });

  describe(`[POST] /api/bands`, () => {
    it('should post a band in the database', done => {
      const newBand = new Band({
        name: 'Radiohead',
        genre: 'Alt-rock',
        numberOfMembers: '2',
        yearFounded: '1990'
      });
      chai
        .request(server)
        .post('/api/bands')
        .send(newBand)
        .end((err, response) => {
          if (err) {
            console.log(err);
            return done();
          }
          expect(response.status).to.equal(201);
          return done();
        });
    });
  });
});

describe('Band', () => {
  beforeEach(done => {
    Band.remove({}, err => {
      done();
    });
  });

  describe(`[PUT] /api/bands/:id`, () => {
    it('Should update the band given an ID', done => {
      let band = new Band({
        name: 'adfs',
        genre: 'adf',
        numberOfMembers: 1948,
        yearFounded: 778
      });
      band.save((err, band) => {
        chai
          .request(server)
          .put('/api/bands/' + band.id)
          .end((err, response) => {
            if (err) {
              console.log(err);
              done();
            }
            expect(response.status).to.equal(201);
            done();
          });
      });
    });
  });

  describe(`[DELETE] /api/bands/:id`, () => {
    it('Should delete the band given the ID', done => {
      let band = new Band({
        name: 'adfs',
        genre: 'adf',
        numberOfMembers: 1948,
        yearFounded: 778
      });
      band.save((err, band) => {
        chai
          .request(server)
          .delete('/api/bands/' + band.id)
          .end((err, response) => {
            if (err) {
              console.log(err);
              done();
            }
            expect(response.status).to.equal(200);
            done();
          });
      });
    });
  });
});
