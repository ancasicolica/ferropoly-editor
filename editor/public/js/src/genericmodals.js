/**
 * Generic Modals functions
 */

var genericModals = {
  showError: function (title, body) {
    $('#mod-error-title').text(title);
    $('#mod-error-body').text(body);
    $('#modal-error').modal('show');
  }
}

