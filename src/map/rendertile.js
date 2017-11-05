import Worker from 'worker-loader!./tileworker';

const TILE_SIZE = 256;

/**
 * Renders a single vector tile on a canvas.
 *
 * The tile is loaded and parsed in a web-worker and
 * then rendered onto a canvas.
 */
export default class RenderTile {

  constructor(x, y, z, canvasAnchor, layer) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.canvasAnchor = canvasAnchor;
    this.layer = layer;
  }

  render(context) {
    // context.strokeRect(
    //   this.canvasAnchor[0], this.canvasAnchor[1],
    //   TILE_SIZE, TILE_SIZE);
    // context.strokeText(
    //   `${this.x}/${this.y}/${this.z}`,
    //   this.canvasAnchor[0] + TILE_SIZE / 2, this.canvasAnchor[1] + TILE_SIZE / 2);

    const url = this.layer.url
      .replace('{x}', this.x)
      .replace('{y}', this.y)
      .replace('{z}', this.z);

    // FIXME use worker pool
    const worker = new Worker();
    worker.postMessage(url);
    worker.onmessage = this.onTileLoad_.bind(
      this, context, context.currentJobId);
  }

  onTileLoad_(context, renderJobId, evt) {
    if (renderJobId !== context.currentJobId) {
      // the tile is no longer needed, ignore
      return false;
    }

    const tileLayers = evt.data;
    if (tileLayers !== null) {
      this.renderTile_(tileLayers, context.canvasContext);
    }
  }

  /**
   * Renders all features of all layers of the tile.
   */
  renderTile_(tileLayers, context) {
    context.save();

    // clip to tile boundaries
    // FIXME: use tile buffer
    context.beginPath();
    context.rect(
      this.canvasAnchor[0] - 1, this.canvasAnchor[1] - 1,
      TILE_SIZE + 1, TILE_SIZE + 1);
    context.clip();

    Object.keys(tileLayers).forEach((name) => {
      const layer = tileLayers[name];
      const features = layer.features;
      features.forEach((feature) => {
        this.renderFeature_(feature, layer, context);
      });
    });
    context.restore();
  }

  renderFeature_(feature, layer, context) {
    if (feature.type !== 3) {
      // only know how to render polygons
      return;
    }
    const exteriorRing = feature.geom[0];

    context.beginPath();
    exteriorRing.forEach((coord) => {
      const coordCanvas = this.scale_(coord, layer.extent);
      context.lineTo(coordCanvas[0], coordCanvas[1]);
    });
    context.closePath();

    // FIXME ignoring inner rings for now

    const style = this.layer.style(feature);
    context.fillStyle = style.fill;
    context.strokeStyle = style.stroke;
    context.lineWidth = style.strokeWidth;

    context.fill();
    context.stroke();
  }

  scale_(coord, extent) {
    const x = coord.x / extent * TILE_SIZE;
    const y = coord.y / extent * TILE_SIZE;
    return [
      this.canvasAnchor[0] + x,
      this.canvasAnchor[1] + y
    ];
  }
}
