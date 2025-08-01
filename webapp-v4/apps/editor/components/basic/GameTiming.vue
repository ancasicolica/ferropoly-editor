<!---
  Form for timings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div>
    <ferro-card title="Spielzeit">
      <div>
        <div class="mb-2">Das Spiel ist für den {{ gameDateFull }} angesetzt. Hier können die Zeiten für Spielstart und Spielende
          definiert werden. Ein Spiel dauert mindestens zwei Stunden.
        </div>
        <div class="mb-2">
          <label for="inputbox">Spielstart</label>
          <date-picker v-model="gameStart" time-only fluid :invalid="!valid" :max-date="maxGameStart"></date-picker>
          <prime-message v-if="valid"
                         size="small"
                         variant="simple"
                         severity="secondary"> Erste Startgeldausgabe, ab diesem Zeitpunkt können Orte gekauft werden.
          </prime-message>
          <prime-message v-if="!valid"
                         severity="error"
                         size="small"
                         variant="simple">Die Startzeit muss vor dem Spielende liegen!
          </prime-message>
        </div>
        <div class="mb-2">
          <label for="inputbox">Spielende</label>
          <date-picker v-model="gameEnd" time-only fluid :invalid="!valid" :min-date="minGameEnd"></date-picker>
          <prime-message v-if="valid"
                         size="small"
                         variant="simple"
                         severity="secondary">Letzte Ausgabe Zins und Startgeld, ab diesem Zeitpunkt sind keine
            Buchungen mehr möglich.
          </prime-message>
          <prime-message v-if="!valid"
                         severity="error"
                         size="small"
                         variant="simple">Das Spielende muss nach dem Spielstart sein!
          </prime-message>
        </div>
        <prime-message v-if="oddDurationMessage" severity="warn"> {{ oddDurationMessage }}</prime-message>
        <prime-message v-if="tooShortGameMessage" severity="error">{{ tooShortGameMessage }}</prime-message>
        <p>Sämtliche Spieldaten werden automatisch am {{ gameDeleteFull }} gelöscht.</p>
      </div>
    </ferro-card>
  </div>

</template>

<script>
import FerroCard from '../../../../common/components/FerroCard.vue';
import {formatGameDate} from '../../../../common/lib/formatters';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import PrimeMessage from 'primevue/message';
import DatePicker from 'primevue/datepicker';
import {DateTime} from 'luxon';

export default {
  name:       'GameTiming',
  components: {FerroCard, PrimeMessage, DatePicker},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      scheduling:          'scheduling',
      gameTimesValidation: 'gameTimesValidation'
    }),
    gameDateFull() {
      return formatGameDate(this.scheduling?.gameDate);
    },
    gameDeleteFull() {
      return formatGameDate(this.scheduling?.deleteTs);
    },
    valid() {
      return this.gameTimesValidation.success;
    },
    maxGameStart() {
      return DateTime.fromJSDate(this.scheduling.gameEnd).minus({hours: 2}).toJSDate()
    },
    minGameEnd() {
      return DateTime.fromJSDate(this.scheduling.gameStart).plus({hours: 2}).toJSDate()
    },
    gameStart: {
      get() {
        return this.scheduling?.gameStart;
      },
      set(value) {
        this.scheduling.gameStart = value;
      }
    },
    gameEnd:   {
      get() {
        return this.scheduling?.gameEnd;
      },
      set(value) {
        this.scheduling.gameEnd = value;
      }
    },
    oddDurationMessage() {
      if (!(this.scheduling.gameStart instanceof Date)) {
        return undefined;
      }
      const start = DateTime.fromJSDate(this.scheduling.gameStart).get('minute');
      if (![0, 15, 30, 45].includes(start)) {
        return 'Für den Start des Spiels werden volle, viertel und halbe Stunden empfohlen. Andere Zeiten funktionieren auch, können jedoch etwas seltsame Zeiten für die Startgeldausgabe zur Folge haben.'
      }
      return undefined;
    },
    tooShortGameMessage() {
      if (!this.gameTimesValidation?.success) {
        return 'Die Spieldauer muss mindestens zwei Stunden betragen, dies macht aber auch nur für Spiele in der Stadt Sinn. Für grössere Spiele sind mindestens 4 Stunden, für die ganze Schweiz mindestens 12 Stunden empfohlen.'
      }
      return undefined;
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
