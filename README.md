# leaflet-divide

A Leaflet control to compare layers in each side. This plugin was modified to work with leaflet version 1.8.0-1.9.x

**This project is a fork of the fork ([leaflet-compare](https://github.com/phloose/leaflet-compare)) of the ([leaflet-splitmap](https://github.com/QuantStack/leaflet-splitmap)) of the [leaflet-side-by-side](https://github.com/digidem/leaflet-side-by-side) plugin**

### L.control.divide(_leftLayer[s]_, _rightLayer[s]_, options)

### Example

[Live Example](https://gimleng.github.io/leaflet-divide/) see [source](index.html)

### Installation

`leaflet-divide` is compatible with Leaflet >=1.8.0 to 1.9.x versions.

To install it you can use npm:

`npm install leaflet-divide`

Then import it in your project:

`import "leaflet-divide"`
`import "leaflet-divide/dist/leaflet-divide.css";`

### Parameters

Look original parameter from [phloose/leaflet-compare](https://github.com/phloose/leaflet-compare)

and this is parameters I added.

| parameter | type | description |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | |
| `options.minLeftPx` | Number | Padding between slider and the left edge of the screen in pixels. Defaults to `0` |
| `options.minRightPx` | Number | Padding between slider and the right edge of the screen in pixels. Defaults to `0` |

Be sure to have included the Leaflet css and js files and the plugin's files `leaflet-divide.css` _before_ you use the plugin. Otherwise the slider will not be shown.
