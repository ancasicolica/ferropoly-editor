/**
 * Editor (Base Info) module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 03.08.21
 **/


const editor = {
  state    : () => ({
    formValid: {
      basicData: false
    }
  }),
  getters  : {
    basicFormIsValid: state => {
      return state.formValid.basicData;
    }
  },
  mutations: {
    setBasicFormValid (state, n) {
      state.formValid.basicData = n;
    },
  }

};

export default editor;
