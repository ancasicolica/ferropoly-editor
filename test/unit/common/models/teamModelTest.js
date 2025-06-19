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

  describe('Create a new Team', function () {
    it('should create one', function (done) {
      teams.createTeam({
          data: {
            name:         'Albatros',
            organization: 'Pfadi Sirius',
            teamLeader:   {name: 'Plato', email: 'plato@sirius.ch', phone: '079 486 66 22'}
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
    it('should create another one', function (done) {
      teams.createTeam({
          data: {
            name:         'Ferropoly Riders',
            organization: 'Pfadi Paprika',
            teamLeader:   {name: 'Celesta', email: 'celesta@sirius.ch', phone: '079 486 66 22'}
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
    it('should get both new teams', async function () {
      const t = await teams.getTeams(gameId);
      expect(t.length).to.be(2);
      expect(t[0].data.name).to.be('Albatros');
      expect(t[1].data.name).to.be('Ferropoly Riders');

    })
    it('should get them also as objects', async function () {
      const t = await teams.getTeamsAsObject(gameId);
      expect(t).to.be.a('object');
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
    it('should get the team', async function () {
      const t = await teams.getTeam(gameId, team1.uuid);
      expect(t.data.teamLeader.name).to.be('Celi');
    });
  });
  describe('Get my teams', function () {
    it('should get my teams', async function () {
      const t = await teams.getMyTeams('celesta@sirius.ch');
      expect(t).to.be.a('array');
    });
    it('should get my team in a gameplay', async function () {
      const t = await teams.getMyTeam(gameId, 'celesta@sirius.ch');
      expect(t).to.be.a('object');
    });
  });

  describe('Count the teams', function () {
    it('should count', function () {
      const t = teams.countTeams(gameId);
      console.log(t);
    });
  });

  describe('Delete a team', function () {
    it('should delete the team', async function () {
      await teams.deleteTeam(team1.uuid)
      const t = await teams.getTeams(gameId);
      expect(t.length).to.be(1);
    });
  });
});
