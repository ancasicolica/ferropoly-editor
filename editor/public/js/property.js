/**
 * Property object for the editor
 * Created by kc on 14.02.15.
 */
'use strict';

var Property = function(loadedProperty) {
  var ICON_EDIT_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png';
  var ICON_TRAIN_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png';
  var ICON_BUS_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow.png';
  var ICON_BOAT_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/blue.png';
  var ICON_CABLECAR_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/purple.png';
  var ICON_OTHER_LOCATION = 'https://maps.gstatic.com/mapfiles/ms2/micons/pink.png';

  if (!(this instanceof Property)) {
    return new Property();
  }

  // In 'data' all data of the business object is included
  this.data = loadedProperty;

  this.marker = null; // The marker contains the coordinates

  /**
   * Attaches a google maps marker to this object
   * @param marker
   */
  this.attachToMarker = function (marker) {
    this.marker = marker;
  };


  /**
   * Set the icon for this location in the map
   * @param editMode true if editing the item
   */
  this.setMarkerIcon = function (editMode) {
    if (this.marker) {
      if (editMode) {
        this.marker.setIcon(ICON_EDIT_LOCATION);
      }
      else {
        switch (this.data.location.accessibility) {
          case 'train':
            this.marker.setIcon(ICON_TRAIN_LOCATION);
            break;

          case 'bus':
            this.marker.setIcon(ICON_BUS_LOCATION);
            break;

          case 'boat':
            this.marker.setIcon(ICON_BOAT_LOCATION);
            break;

          case 'cablecar':
            this.marker.setIcon(ICON_CABLECAR_LOCATION);
            break;

          default:
            this.marker.setIcon(ICON_OTHER_LOCATION);
            break;
        }
      }
    }
  };
};
