/**
 * Extends the Ferropoly Porperty object for the editor
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 30.10.21
 **/

import Property from '../../common/lib/property';



class EditorProperty extends Property {

  /**
   * Constructor
   * @param p is the property as in the Property Model, is merged with the object
   */
  constructor(p) {
    super(p);
    this.positionInPriceRangeChanged = false; // flag for "save list"
  }

  /**
   * Sets the position in the price range. Always use this function to set it, as only this triggers
   * the save process!
   * @param pos
   */
  setPositionInPriceRange(pos) {
    this.positionInPriceRangeChanged = (this.pricelist.positionInPriceRange !== pos);
    this.pricelist.positionInPriceRange = pos;
  }

  /**
   * Returns the set of the position for the priceslist, null if it didn't change
   * @returns {*}
   */
  getPricelistPositionSaveSet() {
    if (!this.positionInPriceRangeChanged) {
      return null;
    }

    return {
      uuid: this.uuid,
      positionInPriceRange: this.pricelist.positionInPriceRange
    };
  };

  getPriceIconIndex(priceRange) {
    switch(priceRange) {
      case 0:
        return this.iconPriceLabels[0];
      case 1:
        return this.iconPriceLabels[2];
      case 2:
        return this.iconPriceLabels[4];
      case 3:
        return this.iconPriceLabels[6];
      case 4:
        return this.iconPriceLabels[7];
      default:
        return this.iconPriceLabels[9];
    }
  }

  /**
   * Set the icon for this location in the map, this is editor specific
   * @param editMode true if editing the item
   */
  setMarkerIcon(editMode) {
    if (this.marker) {
      let x = -1;
      if (this.pricelist) {
        x = this.pricelist.priceRange;
      }
      if (editMode) {
        this.marker.setIcon(this.ICON_EDIT_LOCATION);
      } else {
        switch (this.location.accessibility) {
          case 'train':
            if (x === -1) {
              this.marker.setIcon(this.ICON_TRAIN_LOCATION);
            } else {
              this.marker.setIcon(this.ICON_TRAIN_LOCATION_USED + this.getPriceIconIndex(x));
            }
            break;

          case 'bus':
            if (x === -1) {
              this.marker.setIcon(this.ICON_BUS_LOCATION);
            } else {
              this.marker.setIcon(this.ICON_BUS_LOCATION_USED + this.getPriceIconIndex(x));
            }
            break;

          case 'boat':
            if (x === -1) {
              this.marker.setIcon(this.ICON_BOAT_LOCATION);
            } else {
              this.marker.setIcon(this.ICON_BOAT_LOCATION_USED + this.getPriceIconIndex(x));
            }
            break;

          case 'cablecar':
            if (x === -1) {
              this.marker.setIcon(this.ICON_CABLECAR_LOCATION);
            } else {
              this.marker.setIcon(this.ICON_CABLECAR_LOCATION_USED + this.getPriceIconIndex(x));
            }
            break;

          default:
            if (x === -1) {
              this.marker.setIcon(this.ICON_OTHER_LOCATION);
            } else {
              this.marker.setIcon(this.ICON_OTHER_LOCATION_USED + this.getPriceIconIndex(x));
            }
            break;
        }
      }
    }
  };
}

export default EditorProperty;
