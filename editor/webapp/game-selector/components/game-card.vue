<!---
  A single card with infos about a game
-->
<template lang="pug">
  div
    b-card.game-card
      b-card-header.title {{gameName}}
      b-card-body
        b-card-text
          b-container(fluid="true")
            b-row
              b-col Spieldatum
              b-col {{gameDate | formatDate}}
            b-row
              b-col Start
              b-col {{gameStart}}
            b-row
              b-col Ende
              b-col {{gameEnd}}
            b-row
              b-col Karte
              b-col {{map}}
            b-row
              b-col Löschdatum
              b-col {{deleteDate | formatDate}}
            b-row
              b-col.id Id: {{gameId}}
            b-row
              b-col
                b-button.btn-gameplay(size="sm" v-if="!isFinalized && isOwner" :href="url.edit") Bearbeiten &nbsp;
                  b-icon-pencil

                b-button.btn-gameplay(size="sm" v-if="hasPrizelist" :href="url.viewPricelist") Preisliste &nbsp;
                  b-icon-eye

                b-button.btn-gameplay(size="sm" v-if="isFinalized") Spielregeln &nbsp;
                  b-icon-pencil

                b-button.btn-gameplay(size="sm" v-if="hasPrizelist && isOwner" :href="url.editPlayer") Spieler &nbsp;
                  b-icon-people

                b-button.btn-gameplay(size="sm" v-if="hasPrizelist && isOwner" :href="url.editAdmins") Spielleiter
                  b-icon-person

                b-button.btn-gameplay(size="sm" v-if="isOwner && !isDemo" v-on:click="deleteGameplay") Löschen
                  b-icon-trash


</template>

<script>
import {BIconTrash, BIconPerson, BIconPeople, BIconEye, BIconPencil} from 'bootstrap-vue';

export default {
  name      : "game-card",
  props     : {
    gameName    : String,
    gameId      : String,
    gameDate    : Date,
    gameStart   : String,
    gameEnd     : String,
    deleteDate  : Date,
    map         : String,
    isFinalized : Boolean,
    isOwner     : Boolean,
    hasPrizelist: Boolean,
    isDemo      : Boolean
  },
  data      : function () {
    return {
      url: {
        edit         : `/gameplay/edit/${this.gameId}`,
        viewPricelist: `/pricelist/view/${this.gameId}`,
        rules        : `/rules/${this.gameId}`,
        editPlayer   : `/player/edit/${this.gameId}`,
        editAdmins   : `/admin/edit/${this.gameId}`
      }
    };
  },
  model     : {},
  methods   : {
    /**
     * Gameplay shall be deleted: raise an event
     */
    deleteGameplay: function() {
      console.log('deleting');
      this.$emit('delete-gameplay', this.gameId);
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