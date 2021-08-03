/**
 * Mixin for the formValidator injection into a component
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.08.21
 **/

import FormValidator from './formValidator';

export default {
  data    : function () {
    this._formValidator = new FormValidator();
  },
  methods : {
    /**
     * This is the event handler for the @state event
     * @param e
     */
    onState(e) {
      this._formValidator.validate(e);
    },
    /**
     * Returns true if the form is valid
     * @returns {boolean}
     */
    isFormValid() {
      return this._formValidator.isValid();
    }
  }
};
