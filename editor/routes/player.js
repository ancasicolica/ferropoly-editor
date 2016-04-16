/**
 * Route for adding, editing and removing players
 * Created by kc on 24.03.15.
 */



var express        = require('express');
var router         = express.Router();
var teams          = require('../../common/models/teamModel');
var gameplays      = require('../../common/models/gameplayModel');
var users          = require('../../common/models/userModel');
var settings       = require('../settings');
var logger         = require('../../common/lib/logger').getLogger('routes:player');
var _              = require('lodash');
var moniker        = require('moniker');
var moment         = require('moment');
var async          = require('async');
var gravatar       = require('../../common/lib/gravatar');
var mailer         = require('../../common/lib/mailer');
const MAX_NB_TEAMS = 20;

var ngFile = 'playerctrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';


/* GET player page. */
router.get('/edit/:gameId', function (req, res) {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      res.status(404).send('Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung');
      return;
    }
    var gameplay = {
      scheduling: gp.scheduling,
      mobile    : gp.mobile
    };
    res.render('player', {
      title       : 'Spieler',
      ngController: 'playerCtrl',
      ngApp       : 'playerApp',
      ngFile      : ngFile,
      gameId      : req.params.gameId,
      gameplay    : JSON.stringify(gameplay)
    });
  });

});

/**
 * Creates an empty new team and returns its id
 */
router.post('/create', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    return;
  }

  if (req.params.gameId === 'play-a-demo-game') {
    return res.status(403).send('Demo Game Teams können nicht erstellt werden');
  }

  var gameId = req.body.gameId;
  if (!gameId) {
    return res.status(400).send('GameId fehlt');
  }

  // Load the gameplay, this prooves that the user is the owner of the game
  gameplays.getGameplay(gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      res.status(500).send('Fehler bei Gameplay laden: ' + err.message);
      return;
    }
    if (gp.scheduling.gameStartTs) {
      if (moment().isAfter(gp.scheduling.gameStartTs)) {
        // Creating teams is not allowed after game start, send Forbidden status code
        res.status(403).send('Spielbeginn ist bereits vorbei');
        return;
      }
    }

    teams.countTeams(gameId, function (err, c) {
      if (err) {
        res.status(500).send('Fehler beim Zählen der Teams: ' + err.message);
        return;
      }

      if (c >= MAX_NB_TEAMS) {
        // Maximal number of teams reached
        res.status(403).send('Maximale Anzahl Teams erreicht');
        return;
      }

      var team = new teams.Model();
      c++; // Do not start counting with 0, they're not engineers :-)
      team.data.name = 'Team ' + c;
      teams.createTeam(team, gameId, function (err, newTeam) {
        if (err) {
          logger.error('updateTeam Error', err);
          res.status(500).send('Fehler beim Erstellen des Teams: ' + err.message);
          return;
        }
        return res.send({success: true, team: newTeam});
      });
    });

  });
});

/**
 * Get the teams stored for a gameplay
 *
 * Return teams and authToken
 */
router.get('/get/:gameId', function (req, res) {
  teams.getTeams(req.params.gameId, function (err, gameTeams) {
    if (err) {
      logger.error('/get Error', err);
      res.status(500).send('Fehler bei Abfrage: ' + err.message);
      return;
    }

    async.each(gameTeams,
      function (team, cb) {
        if (!team || !team.data || !team.data.teamLeader || !team.data.teamLeader.email) {
          team.login = {};
          return cb();
        }
        users.getUserByMailAddress(team.data.teamLeader.email, function (err, user) {
          if (err) {
            return cb(err);
          }
          if (!user) {
            return cb();
          }
          user = user.toObject();

          if (user.info && !user.personalData.avatar) {
            // Use default avatar
            user.personalData.avatar = gravatar.getUrl(user.personalData.email)
          }
          team.login = {
            personalData: user.personalData,
            info        : user.info
          };
          return cb();
        });
      },
      function (err) {
        if (err) {
          logger.error('/get Error 2:', err);
          res.status(500).send('Fehler bei Abfrage: ' + err.message);
          return;
        }

        return res.send({success: true, teams: gameTeams});
      }
    );

  });
});


/**
 * Store a team
 */
router.post('/store', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    return;
  }

  var team = req.body.team;
  if (!team) {
    return res.status(400).send('Team fehlt');
  }

  if (team.gameId === 'play-a-demo-game') {
    return res.status(403).send('Demo Game Teams können nicht bearbeitet werden');
  }

  gameplays.getGameplay(team.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      res.status(500).send('Fehler bei Gameplay laden: ' + err.message);
      return;
    }
    if (gp.scheduling.gameStartTs) {
      if (moment().isAfter(gp.scheduling.gameStartTs)) {
        // Changing teams is not allowed after game start, send Forbidden status code
        res.status(403).send('Spielbeginn ist bereits vorbei');
        return;
      }
    }
    teams.updateTeam(team, function (err, storedTeam) {
      if (err) {
        logger.error('updateTeam Error', err);
        res.status(500).send('Fehler beim speichern: ' + err.message);
        return;
      }

      // Check if a login is available
      users.getUserByMailAddress(storedTeam.data.teamLeader.email, function (err, user) {
        if (err || !user) {
          return res.send({success: true, team: storedTeam});
        }
        storedTeam = storedTeam.toObject();
        user       = user.toObject();

        if (user.info && !user.personalData.avatar) {
          // Use default avatar
          user.personalData.avatar = gravatar.getUrl(user.personalData.email)
        }
        storedTeam.login = {
          personalData: user.personalData,
          info        : user.info
        };
        return res.send({success: true, team: storedTeam});
      });
    });
  });
});


/**
 * Confirm a team
 */
router.post('/confirm', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    return;
  }

  var teamId = req.body.teamId;
  var gameId = req.body.gameId;
  if (!teamId || !gameId) {
    logger.info('no teamId supplied')
    return res.status(400).send('Team oder GameId fehlt');
  }

  if (gameId === 'play-a-demo-game') {
    return res.status(403).send('Demo Game Teams können nicht bestätigt werden');
  }

  teams.getTeam(gameId, teamId, (err, team) => {
    if (err) {
      logger.error('getTeam Error', err);
      res.status(500).send('Fehler beim laden des Teams: ' + err.message);
      return;
    }

    gameplays.getGameplay(team.gameId, req.session.passport.user, function (err, gp) {
      if (err) {
        res.status(500).send('Fehler bei Gameplay laden: ' + err.message);
        return;
      }

      team.data.confirmed        = true;
      team.data.confirmationDate = new Date();

      teams.updateTeam(team, function (err) {
        if (err) {
          logger.error('updateTeam Error', err);
          res.status(500).send('Fehler beim speichern: ' + err.message);
          return;
        }
        logger.info(`Confirmed team ${team.data.name} for ${team.data.gameId}`);
        sendConfirmationMail(gp, team, err => {
          var mailSent = true;
          if (err) {
            logger.error('Email send error', err);
            mailSent = false;
          }
          return res.send({success: true, mailSent: mailSent});
        });
      });
    });
  });
});


/**
 * Delete a team
 */
router.post('/delete', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(404).send('Kein Zugriff möglich, bitte einloggen');
  }
  if (!req.body.gameId) {
    return res.status(400).send('Keine GameId gefunden');
  }
  if (req.body.gameId === 'play-a-demo-game') {
    return res.status(403).send('Teams im Demospiel können nicht gelöscht werden');
  }

  gameplays.getGameplay(req.body.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      logger.error('getGameplay Error', err);
      res.status(500).send('Fehler bei Gameplay laden: ' + err.message);
      return;
    }
    if (gp.scheduling.gameStartTs) {
      if (moment().isAfter(gp.scheduling.gameStartTs)) {
        // Deleting is not allowed after game start
        res.status(403).send('Spielbeginn ist bereits vorbei');
        return;
      }
    }
    teams.deleteTeam(req.body.teamId, function (err) {
      if (err) {
        logger.error('deleteTeam Error', err);
        res.status(500).send('Fehler bei Team löschen: ' + err.message);
        return;
      }
      return res.send({success: true});
    });
  });

});


/**
 * Delete all teams of a gameplay
 */
router.post('/deleteAll', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(404).send('Kein Zugriff möglich, bitte einloggen');
  }
  teams.deleteAllTeams(req.body.gameId, function (err) {
    if (err) {
      logger.error('deleteAllTeams Error', err);
      res.status(500).send('Fehler bei löschen aller Teams: ' + err.message);
      return;
    }
    return res.send({success: true});
  });
});


/**
 * Sends the signup mail
 * @param user
 * @param callback
 */
function sendConfirmationMail(gameplay, team, callback) {

  var html    = '';
  var text    = '';
  var subject = 'Bestätigung Ferropoly Anmeldung';

  html += '<h1>Bestätigung Ferropoly Anmeldung</h1>';
  html += `<p>Hallo ${team.data.teamLeader.name}</p><p>Deine Anmeldung des Teams "${team.data.name}" für das Ferropoly "${gameplay.gamename}" wurde bestätigt.</p>`;
  html += `<p>Weitere Informationen dürften demnächst folgen, wir vom Ferropoly wünschen schon jetzt viel Spass!</p>`;

  text += 'Bestätigung Ferropoly Anmeldung\n';
  text += `Hallo ${team.data.teamLeader.name}\n>Deine Anmeldung des Teams "${team.data.name}" für das Ferropoly "${gameplay.gamename}" wurde bestätigt.\n`;
  text += `Weitere Informationen dürften demnächst folgen, wir vom Ferropoly wünschen schon jetzt viel Spass!\n`;

  html += '<p></p>';
  html += '<p>Bitte auf dieses Mail nicht antworten, Mails an diese Adresse werden nicht gelesen. Infos und Kontakt zum Ferropoly:<a href="http://www.ferropoly.ch">www.ferropoly.ch</a></p>';
  text += 'Bitte auf dieses Mail nicht antworten, Mails an diese Adresse werden nicht gelesen. Infos und Kontakt zum Ferropoly: www.ferropoly.ch\n';

  logger.info('Mailtext created', text);
  mailer.send({
    to     : team.data.teamLeader.email,
    cc     : gameplay.owner.organisatorEmail,
    subject: subject,
    html   : html,
    text   : text
  }, callback);
}

module.exports = router;
