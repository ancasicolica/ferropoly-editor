/**
 * The store for admins
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 11.02.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {useAuthTokenStoreStore} from '../../../common/store/authTokenStore';
import {find, forOwn, get, remove} from 'lodash';

export const useAdminStore = defineStore('AdminStore', {
  state:   () => ({
    gameId: 'none',
    admins: []
  }),
  getters: {
    adminList(state) {
      return state.admins;
    }
  },
  actions: {
    /**
     * Loads the administrators for a specific game and updates the local admins list and gameId.
     *
     * @param {string} gameId The identifier of the game whose administrators need to be loaded.
     * @return {Promise<void>} A promise that resolves once the administrators are successfully loaded and processed.
     */
    async loadAdmins(gameId) {
      try {
        const resp  = await axios.get(`/admins/${gameId}`)
        this.admins = [];
        this.gameId = gameId;
        resp.data.forEach(a => {
          if (a.email.length > 0) {
            this.admins.push(a);
          }
        })
        console.log('Admins loaded', this.admins);
      }
      catch (err) {
        console.error('Cant load admins', err);
      }
    },
    /**
     * Adds a new admin to the list of admins if the conditions allow.
     *
     * @param {string} adminEmail - The email address of the admin to be added.
     * @return {Promise<Object>} Returns a promise that resolves to true if the admin was successfully added,
     * or false if the admin could not be added due to exceeding the limit or already existing in the list.
     */
    async addAdmin(adminEmail) {
      if (this.admins.length > 2) {
        console.warn('We have enough admins');
        return {success: false, message: 'Es ist bereits die maximale Anzahl an Admins registriert.'};
      }
      if (find(this.admins, {'email': adminEmail})) {
        console.log('Admin already in list');
        return {success: false, message:'Diese Person ist bereits als Spielleiter*in registriert.'};
      }
      this.admins.push({email: adminEmail, hasLogin: undefined});
      const res =  await this.saveAdmins();
      if (!res.success) {
        await this.deleteAdmin(adminEmail);
      }
      return res;
    },

    /**
     * Deletes an admin from the list of admins based on the provided email.
     *
     * @param {string} adminEmail - The email of the admin to be deleted.
     * @return {Promise<Object>} A promise that resolves to a boolean indicating whether the operation was successful.
     */
    async deleteAdmin(adminEmail) {
      remove(this.admins, n => {
        return n.email === adminEmail;
      });
      let res = await this.saveAdmins();
      if (!res.success) {
        // Fail, undo operation
        this.admins.push({email:adminEmail});
      }
      return res;
    },
    /**
     * Saves the list of admins for the associated game by sending their login information to the server.
     * Updates each admin entry with a `hasLogin` flag if the save operation is successful.
     *
     * @return {Promise<Object>} Returns a promise that resolves with an object indicating
     * whether the operation was successful. The object includes:
     * - `success` (boolean): True if the admins were saved successfully, false otherwise.
     * - `message` (string, optional): Additional error message if the operation failed.
     */
    async saveAdmins() {
      const self = this;
      try {
        const authToken = await useAuthTokenStoreStore().getAuthToken();
        let resp        = await axios.post(`/admins/${self.gameId}`, {
          authToken,
          logins: self.admins
        })
        const result    = resp.data?.result;
        forOwn(result, ((value, key) => {
          let entry = find(self.admins, {'email': key});
          if (entry) {
            entry.hasLogin = true;
          }
        }));
        return {success: true};
      }
      catch (err) {
        console.error('Error while saving admins', err);
        let additionalInfo = get(err, 'response.data.message', '');
        return {success: false, message: `Fehler beim Speichern der Admin: ${err.message}. ${additionalInfo}`}
      }
    }
  }
})
