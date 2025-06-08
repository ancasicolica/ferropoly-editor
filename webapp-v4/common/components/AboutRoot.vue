<!---
  The root element of the about app
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 09.06.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" show-user-box)
  .grid.m-1
    div(class="lg:col-4 md:col-6 sm:col-12")
      FerroCard(title="Hilfe & Infos")
        div Hilfe zur Software, Spielregeln und weitere Infos zum Spiel sind auf der Ferropoly Webseite zu finden:&nbsp;
          a(href="https://www.ferropoly.ch" target="_blank") www.ferropoly.ch

      FerroCard.mt-1(title="Sponsoring")
        div Diese Software darf gratis für die Durchführung von Spielen verwendet werden. Hinter dieser Software steckt viel Arbeit und für den Betrieb der Server wende ich einen Teil meines Sackgeldes wie auch meiner Freizeit auf.
        div Deshalb würde ich mich darüber sehr freuen, wenn Dir ein ausgetragenes Spiel einen Beitrag wert wäre!
        prime-button.mt-2(label="Beitrag bezahlen" @click="ezActive=true")

    div(class="lg:col-4 md:col-6 sm:col-12")
      FerroCard(title="Datenschutz")
        div Es werden nur für das Spiel notwendige Daten erfasst. Mit dem Login über Google und Microsoft sind die öffentlich zugänglichen Daten:
        ul
          li Name
          li Email-Adresse
          li Avatar Bild
        p Während dem Spiel werden zudem die Positionsdaten der Spieler aufgenommen. Sämtliche während dem Spiel erfassten Daten werden 30 Tage nach dem Spiel automatisch gelöscht.
        p Die vollständigen Datenschutz-Infos sind auf der Seite &nbsp;
          a(href="https://www.ferropoly.ch/datenschutz-cookies/" target="_blank") www.ferropoly.ch/datenschutz-cookies
          | &nbsp;zu finden.
    div(class="lg:col-4 md:col-6 sm:col-12")
      FerroCard(title="Nutzungsbedingungen")
        div
          | Die Nutzung dieser Software unterliegt den AGB, welche bei der Anmeldung zu diesem Dienst akzeptiert wurden und auf der Ferropoly Webseite publiziert sind.
        p.info Die wichtigsten Punkte:
        ul
          li Die Durchführung des Spiels erfolgt für Teilnehmer wie Organisator auf eigene Gefahr. Der Betreiber der Webseite kann u.a. für Datenverlust und Serverausfälle nicht haftbar gemacht werden.
          li Eine gewerbliche Benutzung der Software (Organisation von Spielen gegen Vergütung über den effektiven Spesen) ist ohne ausdrückliche Genehmigung des Autors explizit untersagt.
          li Benutzer ohne gültige Email-Adresse (z.B. bei Verwendung von Wegwerf-Adressen) können jederzeit gelöscht werden.
      FerroCard.mt-1(title="Über diese Software")
        div.info {{title}} V{{version}}
        div
          | © 2015-{{currentYear}} Christian Kuster, CH-8342 Wernetshausen,&nbsp;
          a(:href="emailUrl") {{email}}
        div Source-Code und Bugtracking auf Github:
        div
          a(:href="gitRepo" target="_blank") {{gitRepo}}

    prime-dialog(v-model:visible="ezActive" header="Einzahlungsschein")
      img.full-width(src="/images/ferropoly_ez.svg")


</template>
<script>
import MenuBar from './MenuBar.vue'
import FerroCard from './FerroCard.vue'
import {DateTime} from 'luxon';
import packageInfo from '../../../package.json';
import PrimeButton from 'primevue/button';
import PrimeDialog from 'primevue/dialog';

export default {
  name      : 'AboutRoot',
  components: {MenuBar, FerroCard, PrimeButton, PrimeDialog},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      menuBarElements: [],
      ezActive    : false
    }
  },
  computed  : {
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
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">
.info {
  font-weight: bold;
}
</style>
