import Renderer from 'map/renderer';
import RenderTile from 'map/rendertile';

describe('Renderer', () => {
  let renderer;

  beforeEach(() => {
    const div = document.createElement('DIV');
    Object.defineProperty(div, 'clientWidth', {value: 200});
    Object.defineProperty(div, 'clientHeight', {value: 100});

    renderer = new Renderer({
      center: [0, 0],
      zoom: 5,
      container: div
    });
  });

  describe('#getBounds', () => {
    test('bounds are calculated correctly', () => {
      const bounds = renderer.getBounds();
      expect(bounds[0]).toBeCloseTo(-4.39453125);
      expect(bounds[1]).toBeCloseTo(-2.19672724);
      expect(bounds[2]).toBeCloseTo(4.39453125);
      expect(bounds[3]).toBeCloseTo(2.19672724);
    });
  });

  describe('#getTiles', () => {
    test('tiles are calculated correctly', () => {
      const mockLayer = {};
      const tiles = renderer.getTiles_({});
      const expectedTiles = [
        new RenderTile(15, 15, 5, [-156, -206], mockLayer),
        new RenderTile(15, 16, 5, [-156, 50], mockLayer),
        new RenderTile(16, 15, 5, [100, -206], mockLayer),
        new RenderTile(16, 16, 5, [100, 50], mockLayer)
      ];
      expect(tiles).toEqual(expectedTiles);
    });
  });
});
