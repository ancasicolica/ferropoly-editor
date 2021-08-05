/**
 * Editor (Base Info) module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 03.08.21
 **/

const editor = {
  state    : () => ({
    formValid: {
      basicData: false,
      pricelist: false
    },
    api      : {
      error         : {
        active  : false,
        infoText: '',
        message : ''
      },
      requestPending: false
    },
    panel    : {
      current: 'panel-pricelist'
    }
  }),
  getters  : {
    basicFormIsValid    : state => {
      return state.formValid.basicData;
    },
    pricelistFormIsValid: state => {
      return state.formValid.pricelist;
    },
    apiError            : state => {
      return state.api.error;
    },
    requestPending      : state => {
      return state.api.requestPending;
    },
    currentPanel        : state => {
      return state.panel.current;
    }
  },
  mutations: {
    /**
     * Sets the validation of the basic form (panel-basic) either on true or false
     * @param state
     * @param n
     */
    setBasicFormValid(state, n) {
      state.formValid.basicData = n;
    },
    /**
     * Sets the validation of the pricelist form
     * @param state
     * @param n
     */
    setPricelistFormValid(state, n) {
      state.formValid.pricelist = n;
    },
    /**
     * Resets the API error from the last call, used when closing the modal dialog
     * @param state
     */
    resetApiError(state) {
      console.log('resetting api error');
      state.api.error.active   = false;
      state.api.error.infoText = '';
      state.api.error.message  = '';
    },
    /**
     * Sets the current panel of the editor view
     * @param state
     * @param p
     */
    setPanel(state, p) {
      state.panel.current = p;
    }
  }
};

export default editor;
