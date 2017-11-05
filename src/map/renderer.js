import SphericalMercator from 'sphericalmercator';
import RenderTile from './rendertile';

class RenderContext {
  constructor(canvasContext) {
    this.canvasContext = canvasContext;
    this.currentJobId = null;
  }
}


/**
 * Responsible for rendering the current view to a
 * canvas element.
 */
export default class Renderer {

  constructor(options) {
    this.center_ = options.center;
    this.zoom_ = options.zoom;

    this.container_ = options.container;
    this.context_ = this.createCanvasContext_();
    this.canvas_ = this.addCanvas_(this.context_);
    this.renderContext_ = new RenderContext(this.context_);

    this.tileCalculator_ = new SphericalMercator({
      size: 256
    });
  }

  render(layer) {
    this.context_.clearRect(
      0, 0, this.canvas_.width, this.canvas_.height);

    const tiles = this.getTiles_(layer);

    this.renderContext_.currentJobId = this.getJobId_();
    tiles.map(tile => tile.render(this.renderContext_));
  }

  zoomIn() {
    // FIXME: zoom-level limits
    if (this.zoom_ < 18) {
      this.zoom_++;
    }
  }

  zoomOut() {
    // FIXME: zoom-level limits
    if (this.zoom_ > 8) {
      this.zoom_--;
    }
  }

  /*
   * Calculate which tiles are required to render the current view.
   */
  getTiles_(layer) {
    const bounds = this.getBounds();
    const tilesMinMax = this.tileCalculator_.xyz(bounds, this.zoom_);

    const tiles = [];
    for (let x = tilesMinMax.minX; x <= tilesMinMax.maxX; x++) {
      for (let y = tilesMinMax.minY; y <= tilesMinMax.maxY; y++) {
        const tileAnchor = this.getTileAnchor_(x, y, this.zoom_);
        tiles.push(new RenderTile(x, y, this.zoom_, tileAnchor, layer));
      }
    }

    return tiles;
  }

  /**
   * Return the bounds in WGS84 for the current view.
   */
  getBounds() {
    const centerScreenPx = this.tileCalculator_.px(this.center_, this.zoom_);

    const {width, height} = this.canvas_;
    const lowerLeftScreenPx = [
      centerScreenPx[0] - width / 2,
      centerScreenPx[1] - height / 2
    ];
    const upperRightScreenPx = [
      centerScreenPx[0] + width / 2,
      centerScreenPx[1] + height / 2
    ];

    const lowerLeftLonLat = this.tileCalculator_.ll(lowerLeftScreenPx, this.zoom_);
    const upperRightLonLat = this.tileCalculator_.ll(upperRightScreenPx, this.zoom_);

    return [
      lowerLeftLonLat[0], upperRightLonLat[1],
      upperRightLonLat[0], lowerLeftLonLat[1]
    ];
  }

  getTileAnchor_(x, y, zoom) {
    const tileBbox = this.tileCalculator_.bbox(x, y, zoom);
    const tileScreenPx = this.tileCalculator_.px([tileBbox[0], tileBbox[3]], zoom);
    const centerScreenPx = this.tileCalculator_.px(this.center_, this.zoom_);

    const {width, height} = this.canvas_;
    const anchorX = width / 2 - (centerScreenPx[0] - tileScreenPx[0]);
    const anchorY = height / 2 - (centerScreenPx[1] - tileScreenPx[1]);

    return [anchorX, anchorY];
  }

  createCanvasContext_() {
    const canvas = document.createElement('CANVAS');
    return canvas.getContext('2d');
  }

  addCanvas_(context) {
    const canvas = context.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.width = this.container_.clientWidth;
    canvas.height = this.container_.clientHeight;
    this.container_.appendChild(canvas);
    return canvas;
  }

  getJobId_() {
    return `${new Date().getTime()}-${Math.random() * 16}`;
  }
}
