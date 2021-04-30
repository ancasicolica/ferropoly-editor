<!---
  Login control
-->
<template lang="pug">
  #login
    #wrap
      menu-bar(show-user-box=false :elements-right="menuElementsRight")
      .login-box.ls-box-shape
        h3 Ferropoly Editor Login
        #login-with-password(v-if='passwordLogin')
          form(action='login' method='post')
            label(for='inputUserName' class='sr-only') Benutzername
            input(type='text' name='username' id='inputUserName' class='form-control' placeholder='Benutzername' required autofocus)
            label(for='inputPassword' class='sr-only') Passwort
            input(type='password' name='password' id='inputPassword' class='form-control' placeholder='Passwort' required)
            br
            button#button-login.btn.btn-lg.btn-primary.btn-block(type='submit') Login
          br
          button.btn.btn-xs.btn-default.btn-block(@click='enableSocialMediaLogin')
            | Login mit Social Networks
        #login-with-social-networks(v-if='!passwordLogin')
          a#button-google.btn.btn-lg.btn-danger.btn-block(href='/auth/google')
            i.fa.fa-google-plus
            | &nbsp;Login mit Google
          //a#button-dropbox.btn.btn-lg.btn-primary.btn-block(href='/auth/dropbox')
            i.fa.fa-dropbox
            | &nbsp;Login mit Dropbox
          a#button-facebook.btn.btn-lg.btn-primary.btn-block(href='/auth/facebook')
            i.fa.fa-facebook-official
            | &nbsp;Login mit Facebook
          //a#button-twitter.btn.btn-lg.btn-primary.btn-block(href='/auth/twitter')
            i.fa.fa-twitter
            | &nbsp;Login mit Twitter
          button.btn.btn-sm.btn-default.btn-block(@click="enablePasswordLogin")
            | Login mit Passwort

</template>

<script>
import $ from 'jquery'
import MenuBar from '../menu-bar/menu-bar.vue'

export default {
  name      : "login",
  props     : {},
  data      : function () {
    return {
      menuElementsRight: [
        {title: 'Impressum / Kontakt', href: 'https://www.ferropoly.ch', hide: false}
      ],
      passwordLogin    : false
    };
  },
  model     : {},
  created   : function () {
    // Set background randomly
    let i = (new Date().getSeconds() % 8) + 1;
    $('body').addClass('bg' + i);
  },
  methods   : {
    enablePasswordLogin   : function () {
      this.passwordLogin = true;
    },
    enableSocialMediaLogin: function () {
      this.passwordLogin = false;
    }
  },
  components: {MenuBar},
  filters   : {}
}
</script>

<style scoped>


</style>
