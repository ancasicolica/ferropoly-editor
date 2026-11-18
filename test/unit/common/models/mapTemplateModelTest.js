const assert      = require('node:assert/strict');
const mongoose    = require('mongoose');
const MapTemplate = require('../../../../common/models/mapTemplateModel');

describe('MapTemplate model', () => {
  it('stores the gameplay export as a required, non-selected binary field', () => {
    const mapData = MapTemplate.schema.path('mapData');
    const buffer  = Buffer.from('{"version":1,"data":"dGVzdA=="}');
    const model   = new MapTemplate({
      name:      'Testkarte',
      createdBy: 'user@example.com',
      stats:     {propertyCount: 1},
      mapData:   buffer
    });

    assert.ok(mapData instanceof mongoose.Schema.Types.Buffer);
    assert.equal(mapData.options.select, false);
    assert.equal(model.validateSync(), undefined);
    assert.ok(Buffer.isBuffer(model.mapData));
    assert.deepEqual(Buffer.from(model.mapData), buffer);
    assert.ok(new MapTemplate({name: 'Testkarte', createdBy: 'user@example.com', stats: {propertyCount: 1}})
      .validateSync().errors.mapData);
  });
});