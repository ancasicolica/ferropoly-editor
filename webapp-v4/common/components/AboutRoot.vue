<!---
  The root element of the about app
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.06.2024
-->
<template>
  <div>
    <menu-bar :elements="menuBarElements" show-user-box></menu-bar>
    <div class="ferropoly-container md:grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div class="ml-1 mr-1">
        <ferro-card title="Hilfe & Infos">
          <div>Hilfe zur Software, Spielregeln und weitere Infos zum Spiel sind auf der Ferropoly Webseite zu finden:
            <a href="https://www.ferropoly.ch" target="_blank">www.ferropoly.ch</a></div>
        </ferro-card>

        <ferro-card title="Sponsoring" class="mt-2">
          <div>Diese Software darf gratis für die Durchführung von Spielen verwendet werden. Hinter dieser Software
            steckt viel
            Arbeit und für den Betrieb der Server wende ich einen Teil meines Sackgeldes wie auch meiner Freizeit auf.
            <p>Deshalb würde ich mich darüber sehr freuen, wenn Dir ein ausgetragenes Spiel einen Beitrag wert wäre!</p>
          </div>
          <prime-button label="Beitrag bezahlen" @click="ezActive=true" class="mt-4"></prime-button>
        </ferro-card>
      </div>
      <div  class="ml-1 mr-1">
        <ferro-card title="Datenschutz">
          <div> Es werden nur für das Spiel notwendige Daten erfasst. Mit dem Login über Google und Microsoft sind die
            öffentlich
            zugänglichen Daten:
            <ul>
              <li>Name</li>
              <li>Email-Adresse</li>
              <li>Avatar Bild</li>
            </ul>
            <p>Während dem Spiel werden zudem die Positionsdaten der teilnehmenden Personen aufgenommen. Sämtliche
              während
              dem Spiel erfassten
              Daten werden 30 Tage nach dem Spiel automatisch gelöscht.</p>
            <p>Die vollständigen Datenschutz-Infos sind auf der Seite &nbsp;
              <a href="https://www.ferropoly.ch/datenschutz-cookies/"
                 target="_blank">www.ferropoly.ch/datenschutz-cookies</a>
              zu finden.</p>
          </div>
        </ferro-card>
      </div>
      <div  class="ml-1 mr-1">
        <ferro-card title="Nutzungsbedingungen">
          <div>Die Nutzung dieser Software unterliegt den AGB, welche bei der Anmeldung zu diesem Dienst akzeptiert
            wurden
            und auf
            der Ferropoly Webseite publiziert sind.
          </div>
          <p class="info">Die wichtigsten Punkte:</p>
          <ul>
            <li>Die Durchführung des Spiels erfolgt für Teilnehmer wie Organisator auf eigene Gefahr. Der Betreiber der
              Webseite
              kann u.a. für Datenverlust und Serverausfälle nicht haftbar gemacht werden.
            </li>
            <li>Eine gewerbliche Benutzung der Software (Organisation von Spielen gegen Vergütung über den effektiven
              Spesen) ist
              ohne ausdrückliche Genehmigung des Autors explizit untersagt.
            </li>
            <li>Benutzer ohne gültige Email-Adresse (z.B. bei Verwendung von Wegwerf-Adressen) können jederzeit gelöscht
              werden.
            </li>
          </ul>
        </ferro-card>

        <ferro-card title="Über diese Software" class="mt-2">
          <div class="info">{{ title }} V{{ version }}</div>
          <div>© 2015-{{ currentYear }} Christian Kuster, CH-8342 Wernetshausen
            <a :href="emailUrl">{{ email }}</a>
          </div>
          <div>Source-Code und Bugtracking auf Github: <a :href="gitRepo" target="_blank">{{ gitRepo }}</a></div>
        </ferro-card>
      </div>
    </div>
    <prime-dialog v-model:visible="ezActive" header="Einzahlungsschein">
      <img class="full-width" src="/images/ferropoly_ez.svg" alt="Ein Einzahlungsschein für das Sponsoring des Ferropoly"/>
    </prime-dialog>
  </div>


</template>
<script>
import MenuBar from './MenuBar.vue'
import FerroCard from './FerroCard.vue'
import {DateTime} from 'luxon';
import packageInfo from '../../../package.json';
import PrimeButton from 'primevue/button';
import PrimeDialog from 'primevue/dialog';

export default {
  name:       'AboutRoot',
  components: {MenuBar, FerroCard, PrimeButton, PrimeDialog},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      menuBarElements: [],
      ezActive:        false
    }
  },
  computed:   {
    currentYear() {
      return DateTime.now().toFormat('yyyy')
    },
    title() {
      return packageInfo.title;
    },
    version() {
      return packageInfo.version;
    },
    gitRepo() {
      return packageInfo.repository.url;
    },
    email() {
      return packageInfo.author.email;
    },
    emailUrl() {
      return 'mailto:' + packageInfo.author.email;
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">
.info {
  font-weight: bold;
}
</style>
