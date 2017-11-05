# simple-map-renderer

A very basic rendering library prototype. Vector tiles are downloaded and
parsed in web-workers and then drawn in a canvas element.

This dataset [mnmappluto](https://rambo-test.carto.com/tables/mnmappluto/public/map)
was downloaded and then cut into vector tiles using tippecanoe
using the following parameters:

    tippecanoe -e /data/tiles -z 18 -y cartodb_id -y ct2010 -pC /data/mnmappluto.geojson

Demo: https://tsauerwein.github.io/simple-map-renderer/

## Development

Install the dependencies:

    npm init

And then run the development server:

    npm start

## Credits

Project setup based on [es6-webpack2-starter](https://github.com/micooz/es6-webpack2-starter).

## License

MIT
