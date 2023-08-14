/**
 * Testing the team model
 * Created by kc on 22.03.15.
 */
'use strict';

const expect   = require('expect.js');
const teams    = require('./../../../../common/models/teamModel');
const settings = require('./../../../../editor/settings');
const db       = require('./../../../../common/lib/ferropolyDb');

let team1;
let team2;
const gameId = 'test-game';
describe('TeamModel Tests', function () {
  before(function (done) {
    db.init(settings, async function () {
      await teams.deleteAllTeams(gameId);
      done();
    });
  });

  // Close DB afterwards and delete all teams
  after(function (done) {
    teams.deleteAllTeams(gameId)
         .then(() => {
           db.close(done);
         });
  });

  describe('Create a new Team',  function () {
    it('should create one',  function (done) {
      teams.createTeam({
          data: {
            name        : 'Albatros',
            organization: 'Pfadi Sirius',
            teamLeader  : {name: 'Plato', email: 'plato@sirius.ch', phone: '079 486 66 22'}
          }
        },
        gameId).then(team => {
        expect(team.data.name).to.be('Albatros');
        expect(team.data.organization).to.be('Pfadi Sirius');
        expect(team.data.teamLeader.name).to.be('Plato');
        expect(team.data.teamLeader.email).to.be('plato@sirius.ch');
        expect(team.data.teamLeader.phone).to.be('079 486 66 22');
        team1 = team;
        done();
      });
    });
    it('should create another one',  function (done) {
      teams.createTeam({
          data: {
            name        : 'Ferropoly Riders',
            organization: 'Pfadi Paprika',
            teamLeader  : {name: 'Celesta', email: 'celesta@sirius.ch', phone: '079 486 66 22'}
          }
        },
        gameId).then(team => {
        expect(team.data.name).to.be('Ferropoly Riders');
        expect(team.data.organization).to.be('Pfadi Paprika');
        expect(team.data.teamLeader.name).to.be('Celesta');
        expect(team.data.teamLeader.email).to.be('celesta@sirius.ch');
        expect(team.data.teamLeader.phone).to.be('079 486 66 22');
        team2 = team;
        done();
      }).catch(done);
    });
  });

  describe('Getting all teams', function () {
    it('should get both new teams', function (done) {
      teams.getTeams(gameId, function (err, teams) {
        expect(teams.length).to.be(2);
        expect(teams[0].data.name).to.be('Albatros');
        expect(teams[1].data.name).to.be('Ferropoly Riders');
        done(err);
      });
    })
    it('should get them also as objects', function (done) {
      teams.getTeamsAsObject(gameId, function (err, teams) {
        expect(teams).to.be.a('object');
        done(err);
      });
    })
  });

  describe('Update one team', function () {
    it('should update the team with a promise', function (done) {
      team1.data.teamLeader.name = 'Celi';
      teams.updateTeam(team1).then(t => {
        expect(t.data.teamLeader.name).to.be('Celi');
        done();
      }).catch(err => {
        done(err);
      });
    });
  });

  describe('Get one team', function () {
    it('should get the team', function (done) {
      teams.getTeam(gameId, team1.uuid, function (err, t) {
        expect(t.data.teamLeader.name).to.be('Celi');
        done(err);
      })
    });
  });
  describe('Get my teams', function () {
    it('should get my teams', function (done) {
      teams.getMyTeams('celesta@sirius.ch', function (err, teams) {
        expect(teams).to.be.a('array');
        done(err);
      })
    });
    it('should get my team in a gameplay', function (done) {
      teams.getMyTeam(gameId, 'celesta@sirius.ch', function (err, teams) {
        expect(teams).to.be.a('object');
        done(err);
      })
    });
  });

  describe('Count the teams', function () {
    it('should count', function (done) {
      teams.countTeams(gameId, function (err, t) {
        console.log(t);
        done(err);
      })
    });
  });

  describe('Delete a team', function () {
    it('should delete the team', function (done) {
      teams.deleteTeam(team1.uuid).then(r => {
        console.log(r);
        teams.getTeams(gameId, function (err, teams) {
          expect(teams.length).to.be(1);
          done(err);
        })
      }).catch(done);
    })
  });
});
