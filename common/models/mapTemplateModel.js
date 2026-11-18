/**
 * Templates for new games
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 18.11.2026
 **/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mapTemplateSchema = new Schema(
  {
    gameId: {
      // gameId is not unique here!
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Ein Name für das Template ist erforderlich.'],
      trim: true,
      maxlength: [100, 'Der Name darf maximal 100 Zeichen lang sein.']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Die Beschreibung darf maximal 500 Zeichen lang sein.'],
      default: ''
    },
    // Reference to the creator (adapt to your User model)
    createdBy: {
      type: String,
      trim: true,
      required: true
    },
    // Date when the game was played
    gameDate: {
      type: Date,
      default: Date.now
    },
    // Visibility: Private templates versus templates shared with all players
    isPublic: {
      type: Boolean,
      default: true
    },
    // Denormalised metadata for the overview map (avoids parsing mapData!)
    stats: {
      propertyCount: { type: Number, required: true, min: 1 },
      map: { type: String, trim: true, default: 'sbb' }
    },
    // Map data schema version for future migrations in the editor
    dataVersion: {
      type: Number,
      default: 1
    },
    // Exported map data as a buffer (40-100 kB)
    mapData: {
      type: Buffer,
      required: true,
      select: false // IMPORTANT: Excluded from standard queries (.find()) by default!
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

// --- Indexes ---

// 1. For the public template gallery (sorted by most recent update)
mapTemplateSchema.index({ isPublic: 1, createdAt: -1 });

// 2. For a signed-in user's "My Templates" view
mapTemplateSchema.index({ createdBy: 1, createdAt: -1 });

// 3. Optional: For searching by name or description
mapTemplateSchema.index({ name: 'text', description: 'text' });

const MapTemplate = mongoose.model('MapTemplate', mapTemplateSchema);

module.exports = {
  MapTemplate,
  mapTemplateSchema
}
