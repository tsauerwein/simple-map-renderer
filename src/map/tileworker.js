/* eslint-env worker */
import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

/**
 * Web-worker to download and parse a vector tile.
 */

const handleOnMessage = (event) => {
  const url = event.data;

  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'arraybuffer';
  request.onload = onTileLoad; // eslint-disable-line no-use-before-define
  request.send(null);
};


const onTileLoad = (event) => {
  const request = event.target;
  if (request.status === 200) {
    const arrayBuffer = request.response;
    // eslint-disable-next-line no-use-before-define
    const tileData = parseData(new Uint8Array(arrayBuffer));
    postMessage(tileData);
  } else {
    postMessage(null);
  }
  close();
};


/**
 * Create a plain-JS-object containing the layers and
 * features of the vector tile to send back to the main thread.
 */
const parseData = (data) => {
  const tile = new VectorTile(new Protobuf(data));

  const layers = {};
  Object.keys(tile.layers).forEach((name) => {
    const layer = tile.layers[name];

    const features = [];
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i);
      features.push({
        type: feature.type,
        geom: feature.loadGeometry(),
        properties: feature.properties
      });
    }

    layers[name] = {
      extent: layer.extent,
      features
    };
  });

  return layers;
};

onmessage = handleOnMessage;
