<!---
  A single card with infos about a game
-->
<template lang="pug">
  div
    b-card(no-body).game-card
      b-card-header.title {{getGpProperty('gamename')}}
      b-card-body
        b-card-text
          b-container(fluid="true")
            b-row
              b-col Spieldatum
              b-col {{getGpProperty('scheduling.gameDate') | formatDate}}
            b-row
              b-col Start
              b-col {{getGpProperty('scheduling.gameStart')}}
            b-row
              b-col Ende
              b-col {{getGpProperty('scheduling.gameEnd')}}
            b-row
              b-col Karte
              b-col {{getMapName()}}
            b-row
              b-col Spielbereit
              b-col(v-if="getGpProperty('internal.finalized')") Ja
              b-col(v-if="!getGpProperty('internal.finalized')" :href="url.viewPricelist") Nein (noch nicht finalisiert)
            b-row
              b-col Löschdatum
              b-col {{getGpProperty('scheduling.deleteTs') | formatDate}}
            b-row
              b-col.id Id: {{getGpProperty('internal.gameId')}}
            b-row
              b-col
                b-button.btn-gameplay(size="sm" v-if="!getGpProperty('internal.finalized') && getGpProperty('isOwner')" :href="url.edit") Bearbeiten &nbsp;
                  b-icon-pencil

                b-button.btn-gameplay(size="sm" v-if="getGpProperty('log.priceListVersion') > 0" :href="url.viewPricelist") Preisliste &nbsp;
                  b-icon-eye

                b-button.btn-gameplay(size="sm" v-if="getGpProperty('internal.finalized')") Spielregeln &nbsp;
                  b-icon-pencil

                b-button.btn-gameplay(size="sm" v-if="(getGpProperty('log.priceListVersion') > 0) && getGpProperty('isOwner')" :href="url.editPlayer") Spieler &nbsp;
                  b-icon-people

                b-button.btn-gameplay(size="sm" v-if="(getGpProperty('log.priceListVersion') > 0) && getGpProperty('isOwner')" :href="url.editAdmins") Spielleiter
                  b-icon-person

                b-button.btn-gameplay(size="sm" v-if="getGpProperty('isOwner') && !getGpProperty('internal.isDemo')" v-on:click="deleteGameplay") Löschen
                  b-icon-trash


</template>

<script>
import {BIconTrash, BIconPerson, BIconPeople, BIconEye, BIconPencil} from 'bootstrap-vue';
import {get} from "lodash";
import {getMapName} from '../../common/lib/mapTypes'

export default {
  name      : "game-card",
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    }

  },
  data      : function () {
    return {
      url: {
        edit         : `/gameplay/edit/${this.gameplay.internal.gameId}`,
        viewPricelist: `/pricelist/view/${this.gameplay.internal.gameId}`,
        rules        : `/rules/${this.gameplay.internal.gameId}`,
        editPlayer   : `/player/edit/${this.gameplay.internal.gameId}`,
        editAdmins   : `/admin/edit/${this.gameplay.internal.gameId}`
      }
    };
  },
  model     : {},
  methods   : {
    /**
     * Gameplay shall be deleted: raise an event
     */
    deleteGameplay: function () {
      console.log('deleting');
      this.$emit('delete-gameplay', this.gameId);
    },
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getGpProperty(id) {
      return get(this.gameplay, id, '');
    },
    /**
     * Returns the name of the map
     * @returns {string|string}
     */
    getMapName() {
      console.log('getMapName', this.getGpProperty('internal.map'), getMapName(this.getGpProperty('internal.map')));
      return getMapName(this.getGpProperty('internal.map'));
    }
  },
  components: {BIconTrash, BIconPerson, BIconPeople, BIconEye, BIconPencil}
}
</script>

<style scoped>

.title {
  font-weight: bold;
}

.btn-gameplay {
  margin-top: 8px;
  margin-right: 8px;
}

.id {
  color: rgba(115, 115, 115, 0.73);
  font-size: x-small;
}

.game-card {
  margin-bottom: 10px;
}
</style>
