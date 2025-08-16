# leaflet-divide

A Leaflet control to compare layers in each side. This plugin was modified to work with leaflet version 1.8.0-1.9.x

**This project is a fork of the fork ([leaflet-compare](https://github.com/phloose/leaflet-compare)) of the ([leaflet-splitmap](https://github.com/QuantStack/leaflet-splitmap)) of the [leaflet-side-by-side](https://github.com/digidem/leaflet-side-by-side) plugin**


### L.control.divide(_leftLayer[s]_, _rightLayer[s]_, options)

### Example

[Live Example](https://gimleng.github.io/leaflet-divide/) see [source](index.html)

### Installation

`leaflet-compare` is compatible with Leaflet >=1.8.0 to 1.9.x versions.

To install it you can use npm:

`npm install leaflet-divide`

Then import it in your project:

`import "leaflet-divide"`

As an alternative you can import the `Divide` class directly:

`import { Divide } from "leaflet-divide"`

Be sure to have included the Leaflet css and js files and the plugin's files `leaflet-divide.css` *before* you use the plugin. Otherwise the slider will not be shown.