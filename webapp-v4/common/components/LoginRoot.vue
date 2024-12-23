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
          Form(v-slot="$form" @submit="loginWithPassword"  :initialValues )
            .field.mb-1
              input-text.input-width(type='text' name='username' id='inputUserName' class='form-control' placeholder='Benutzername' required autofocus)
            .field.mb-2
              input-text.input-width(type='password' name='password' id='inputPassword' class='form-control' placeholder='Passwort' required)
            prime-button.button-login.btn.btn-primary.btn-block(type="submit" label="Login mit Passwort")

        .flex.flex-column.p-4.justify-content-center.align-content-start.w-19rem
          .field
            prime-button(label="Login mit Google" icon="pi pi-google" class="p-button-google" @click="goToGoogleAuth")
          .field
            prime-button.mt-3(label="Login mit Microsoft" icon="pi pi-microsoft" class="p-button-microsoft" @click="goToMicrosoftAuth")

      .flex.align-content-start.justify-content-center(v-if="loginError")
        prime-message(severity="error" ) {{loginError}}
      .flex.align-content-start.justify-content-center
        .inline-block(v-if="!preview")
          p Loge Dich mit einem bestehenden Social Media Account ein oder&nbsp;
            a(href="https://auth.ferropoly.ch" target="_blank") erstelle Dein kostenloses Login
            | .
        .inline-block(v-if="preview")
          p Dies ist eine Preview-Version, Login ist nur mit Social Media Accounts und den Demo-User Logins möglich.&nbsp;
            | Mehr Infos dazu auf der &nbsp;
            a(href="https://www.ferropoly.ch/server/" target="_blank") Ferropoly Webseite
            | .

</template>
<script>

import axios from 'axios';
import {get} from 'lodash';
import PrimeButton from 'primevue/button';
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import {Form} from '@primevue/forms';
import PrimeMessage from 'primevue/message';


export default {
  name: 'LoginRoot',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: {PrimeButton, InputText, Menubar, Form, PrimeMessage},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    appName: {
      type:    String,
      default: function () {
        return 'Ferropoly Editor';
      }
    }
  },
  data:       function () {
    return {
      preview:       false,
      loginError:    null,
      menuItems:     [],
      initialValues: {
        username: '',
        password: ''
      },
    }
  },
  computed:   {},
  created:    function () {
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
  methods:    {
    goToGoogleAuth() {
      window.location.href = '/auth/google';
    },
    goToMicrosoftAuth() {
      window.location.href = '/auth/microsoft';
    },
    goToImpressum() {
      window.location.href = 'https://www.ferropoly.ch';
    },

    /**
     * Handles user login process using a username and password.
     *
     * @param {object} params - An object containing the parameter for login.
     * @param {object} params.states - Object holding the state values of username and password.
     * @param {object} params.states.username - State object for the username input.
     * @param {string} params.states.username.value - The username value to be sent to the server.
     * @param {object} params.states.password - State object for the password input.
     * @param {string} params.states.password.value - The password value to be sent to the server.
     * @return {void} The method does not return a value but handles navigation and error processing internally.
     */
    loginWithPassword({states}) {
      axios.post('/login', {username: states.username.value, password: states.password.value})
          .then(response => {
            if (response.status === 200) {
              console.log('Login erfolgreich:', response.data);

              // Getting the URI of the login page, if available
              const urlParams = new URLSearchParams(window.location.search);
              const uri = urlParams.get('uri');

              const redirectUrl = response.headers['location'];
              if (uri) {
                window.location.href = uri;
              } else if (redirectUrl) {
                window.location.href = redirectUrl;
              } else {
                window.location.href = '/'
              }
            }
          })
          .catch(error => {
            if (error.response) {
              // Fehler vom Server (z. B. 401, 403, 500, ... )
              console.error('Serverfehler:', error.response.status, error.response.data);
              this.loginError = `Leider funktioniert diese Kombination aus Benutzername und Passwort nicht (Error Code = ${error.response.status}).`
            } else {
              // Netzwerkfehler oder andere Probleme
              console.error('Netzwerkproblem:', error.message);
              this.loginError = 'Irgendetwas lief grundlegend schief. Vielleicht hilft es, diese Seite neu zu laden?';
            }
          });
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

.title-bar {
  padding-top: 3px;
  padding-bottom: 3px;
  color: white;
  background-color: black;

}
</style>


