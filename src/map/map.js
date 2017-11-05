import Renderer from './renderer';

/**
 * Interface to embed a map into a web-page.
 *
 * Maintains the list of layers (that is THE single layer for now),
 * and handles events.
 */
export default class Map {

  constructor(options) {
    const {container, center, zoom, layer} = options;
    this.layer = layer;
    this.renderer_ = new Renderer({container, center, zoom});
    this.render_();
  }

  render_() {
    this.renderer_.render(this.layer);
  }

  zoomIn() {
    this.renderer_.zoomIn();
    this.render_();
  }

  zoomOut() {
    this.renderer_.zoomOut();
    this.render_();
  }

}
