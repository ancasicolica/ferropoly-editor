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

  var iconPriceLabels = ['A.png','B.png','C.png','D.png','E.png','F.png'];
  var ICON_TRAIN_LOCATION_USED = '/images/markers/letters/green_Marker';
  var ICON_BUS_LOCATION_USED = '/images/markers/letters/yellow_Marker';
  var ICON_BOAT_LOCATION_USED = '/images/markers/letters/blue_Marker';
  var ICON_CABLECAR_LOCATION_USED = '/images/markers/letters/purple_Marker';
  var ICON_OTHER_LOCATION_USED = '/images/markers/letters/pink_Marker';

  if (!(this instanceof Property)) {
    return new Property();
  }

  // In 'data' all data of the business object is included
  this.data = loadedProperty;

  this.marker = null; // The marker contains the coordinates
  this.dataChanged = false;

  /**
   * Attaches a google maps marker to this object
   * @param marker
   */
  this.attachToMarker = function (marker) {
    this.marker = marker;
  };

  this.dataChanged = function() {
    this.dataChanged = true;
  };


  /**
   * Set the icon for this location in the map
   * @param editMode true if editing the item
   */
  this.setMarkerIcon = function (editMode) {
    if (this.marker) {
      var x = -1;
      if (this.data.pricelist) {
        x = this.data.pricelist.priceRange;
      }
      if (editMode) {
        this.marker.setIcon(ICON_EDIT_LOCATION);
      }
      else {
        switch (this.data.location.accessibility) {
          case 'train':
            if (x === -1) {
              this.marker.setIcon(ICON_TRAIN_LOCATION);
            }
            else {
              this.marker.setIcon(ICON_TRAIN_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'bus':
            if (x === -1) {
              this.marker.setIcon(ICON_BUS_LOCATION);
            }
            else {
              this.marker.setIcon(ICON_BUS_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'boat':
            if (x === -1) {
              this.marker.setIcon(ICON_BOAT_LOCATION);
            }
            else {
              this.marker.setIcon(ICON_BOAT_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          case 'cablecar':
            if (x === -1) {
              this.marker.setIcon(ICON_CABLECAR_LOCATION);
            }
            else {
              this.marker.setIcon(ICON_CABLECAR_LOCATION_USED + iconPriceLabels[x]);
            }
            break;

          default:
            if (x === -1) {
              this.marker.setIcon(ICON_OTHER_LOCATION);
            }
            else {
              this.marker.setIcon(ICON_OTHER_LOCATION_USED + iconPriceLabels[x]);
            }
            break;
        }
      }
    }
  };
};
