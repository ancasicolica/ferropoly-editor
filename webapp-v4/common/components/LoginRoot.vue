<!---
  The login form
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 04.05.2024
-->
<template lang="pug">
  #login
    menubar.title-bar(:model="menuItems")
      template(#start)
        .flex.align-content-center
          .flex
             img.logo(src="/favicon/apple-touch-icon-180x180.png")
          .flex.m-0
            p.title Ferropoly
      template(#end)
        p.impressum(@click="goToImpressum") Impressum / Kontakt
    div.centered
      h1 {{appName}} Login
      .flex.flex-wrap.align-content-start.justify-content-center
          .flex.p-4.justify-content-center.w-19rem
            form(action='login' method='post')
              .field.mb-1
                input-text.input-width(type='text' name='username' id='inputUserName' class='form-control' placeholder='Benutzername' required autofocus)
              .field.mb-2
                input-text.input-width(type='password' name='password' id='inputPassword' class='form-control' placeholder='Passwort' required)
              Button.button-login.btn.btn-primary.btn-block(type='submit' label="Login mit Passwort")
          .flex.flex-column.p-4.justify-content-center.align-content-start.w-19rem
            .field
              Button(label="Login mit Google" icon="pi pi-google" class="p-button-google" @click="goToGoogleAuth")
            .field
              Button.mt-3(label="Login mit Microsoft" icon="pi pi-microsoft" class="p-button-microsoft" @click="goToMicrosoftAuth")
      .flex.align-content-start.justify-content-center
        .inline-block(v-if="!preview")
          p Loge Dich mit einem bestehenden Social Media Account ein oder&nbsp;
            a(href="https://auth.ferropoly.ch" target="_blank") erstelle Dein kostenloses Login
            | .
        .inline-block(v-if="preview")
          p Dies ist eine Preview-Version, Login ist nur mit Social Media Accounts und den Demo-User Logins möglich.&nbsp;
            | Mehr Infos dazu auf der &nbsp;
            a(href="https://www.ferropoly.ch/server/" target="_blank") Ferropoly Webseite
            |.

</template>
<script>

import axios from 'axios';
import {get} from 'lodash';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';

export default {
  name      : 'LoginRoot',
  components: {Button, InputText, Menubar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    appName: {
      type   : String,
      default: function () {
        return 'Ferropoly Editor';
      }
    }
  },
  data      : function () {
    return {
      preview: false,
      menuItems: []
    }
  },
  computed  : {},
  created   : function () {
    let self = this;

    axios.get('/appinfo/login')
        .then(resp => {
          self.preview = get(resp, 'data.settings.preview', false);
          self.debug   = get(resp, 'data.settings.preview', false);
          console.log('Welcome to Ferropoly!', resp.data);
        })
        .catch(ex => {
          console.error(ex);
        })
  },
  methods   : {
    goToGoogleAuth() {
      window.location.href = '/auth/google';
    },
    goToMicrosoftAuth() {
      window.location.href = '/auth/microsoft';
    },
    goToImpressum() {
      window.location.href = 'https://www.ferropoly.ch';
    }
  }
}

</script>


<style scoped lang="scss">
#login {
  min-height: 100%;
  height: auto;
}

.centered {
  position: fixed;
  top: 40%;
  margin-top: -50px;
  margin-left: -10px;
  margin-right: -20px;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 30px;
  text-align: center;
  background: rgba(255, 255, 255, 0.7)

}
@media screen and (max-width: 768px) { /* for screens smaller than 768px */
  .centered {
    top: 15%; /* adjust as necessary */
  }
}

.input-width {
  width: 18rem;
}
.button-login {
  width: 18rem;
}
.p-button-google {
  background-color: #d62d20;
  border-color: #d62d20;
  color: #ffffff;
  width: 14rem;
}

.p-button-google:hover {
  background-color: #962016; // darker shade for hover
  border-color: #962016; // darker shade for hover

}

.p-button-microsoft {
  background-color: #7eb900;
  border-color: #7eb900;
  color: #ffffff;
  width: 14rem;
}

.p-button-microsoft:hover {
  background-color: #446400; // darker shade for hover
  border-color: #446400; // darker shade for hover
}

.impressum {
  cursor: pointer;
}

.title {
  font-weight: bold;
  padding-top: 5px;
  margin-left: 5px;
  margin-top: 0;
  margin-bottom: 0;
}

.logo {
  height: 2rem;
  width: 2rem;
}

.title-bar{
  padding-top: 3px;
  padding-bottom: 3px;
  color: white;
  background-color: black;

}
</style>


