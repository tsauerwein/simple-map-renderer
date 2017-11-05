import './theme/theme.scss';

import Map from './map/map';
import Layer from './map/layer';


function main() {
  const colors = [
    '#FFFFFF', '#c7e9b4', '#7fcdbb', '#49b6c3',
    '#3292c0', '#235ea8', '#0f2f84'];

  const layer = new Layer({
    // url: 'https://cartocdn-ashbu.global.ssl.fastly.net/rambo-test/api/v1/map/7907eaaa0f079ba9c52186052a8e4d6e:1453368021952/0/{z}/{x}/{y}.mvt',
    url: 'tiles/{z}/{x}/{y}.pbf',
    style: (feature) => {
      // assign a random color
      const val = feature.properties.cartodb_id;
      const fill = colors[val % colors.length];

      return {
        fill,
        stroke: '#000000',
        strokeWidth: 1
      };
    }
  });

  const map = new Map({
    container: document.getElementById('map'),
    center: [-73.9780962104222, 40.76777747218667], // [-8235204, 4978149],
    zoom: 16,
    layer
  });

  const zoomInBtn = document.getElementById('zoomIn');
  zoomInBtn.addEventListener('click', () => map.zoomIn());
  const zoomOutBtn = document.getElementById('zoomOut');
  zoomOutBtn.addEventListener('click', () => map.zoomOut());
}

document.addEventListener('DOMContentLoaded', main);
