import L from "leaflet";

let mapWasDragEnabled;
let mapWasTapEnabled;

// Leaflet v0.7 backwards compatibility
function on(el, types, fn, context) {
  types.split(" ").forEach((type) => {
    L.DomEvent.on(el, type, fn, context);
  });
}

function off(el, types, fn, context) {
  types.split(" ").forEach((type) => {
    L.DomEvent.off(el, type, fn, context);
  });
}

function getRangeEvent(rangeInput) {
  return "oninput" in rangeInput ? "input" : "change";
}

function cancelMapDrag() {
  mapWasDragEnabled = this._map.dragging.enabled();
  mapWasTapEnabled = this._map.tap && this._map.tap.enabled();
  this._map.dragging.disable();
  this._map.tap && this._map.tap.disable();
}

function uncancelMapDrag(e) {
  this._refocusOnMap(e);
  if (mapWasDragEnabled) {
    this._map.dragging.enable();
  }
  if (mapWasTapEnabled) {
    this._map.tap.enable();
  }
}

function asArray(arg) {
  if (typeof arg === "undefined") return [];
  return Array.isArray(arg) ? arg : [arg];
}

L.Control.Divide = L.Control.extend({
  options: {
    thumbSize: 42,
    padding: 0,
    position: 0.5,
    minLeftPx: 0,
    minRightPx: 0,
  },

  initialize(leftLayers, rightLayers, options) {
    this._leftLayers = asArray(leftLayers);
    this._rightLayers = asArray(rightLayers);
    this._updateClip();
    L.setOptions(this, options);
  },

  getPosition() {
    const rangeValue = this._range.value;
    const offset =
      (0.5 - rangeValue) * (2 * this.options.padding + this.options.thumbSize);
    return this._map.getSize().x * rangeValue + offset;
  },

  setPosition(offset) {
    if (!this._map) return this;
    this._range.value = offset;
    this._updateClip();
    return this;
  },

  includes: L.Evented.prototype,

  addTo(map) {
    this.remove();
    this._map = map;

    this._container = L.DomUtil.create(
      "div",
      "leaflet-sbs",
      map._controlContainer
    );
    this._divider = L.DomUtil.create(
      "div",
      "leaflet-sbs-divider",
      this._container
    );
    this._range = L.DomUtil.create(
      "input",
      "leaflet-sbs-range",
      this._container
    );

    this._range.type = "range";
    this._range.min = 0;
    this._range.max = 1;
    this._range.step = "any";
    this._range.value = 0.5;
    this._range.style.paddingLeft =
      this._range.style.paddingRight = `${this.options.padding}px`;

    this._addEvents();
    this._updateClip();

    if (this.options.position !== undefined) {
      this.setPosition(this.options.position);
    }

    return this;
  },

  remove() {
    if (!this._map) return this;

    this._leftLayers.forEach((leftLayer) => {
      const el = leftLayer.getContainer?.() || leftLayer.getPane?.();
      if (el) el.style.clip = "";
    });

    this._rightLayers.forEach((rightLayer) => {
      const el = rightLayer.getContainer?.() || rightLayer.getPane?.();
      if (el) el.style.clip = "";
    });

    this._removeEvents();
    L.DomUtil.remove(this._container);
    this._map = null;

    return this;
  },

  setLeftLayers(leftLayers) {
    this._leftLayers = asArray(leftLayers);
    this._updateLayers();
    return this;
  },

  setRightLayers(rightLayers) {
    this._rightLayers = asArray(rightLayers);
    this._updateLayers();
    return this;
  },

  _updateClip() {
    if (!this._map) return this;

    const map = this._map;
    const mapWidth = map.getSize().x;
    const mapHeight = map.getSize().y;

    // Get divider position in screen pixels
    let dividerX = this.getPosition();

    // Clamp with minLeftPx / minRightPx
    if (this.options.minLeftPx && dividerX < this.options.minLeftPx) {
      dividerX = this.options.minLeftPx;
    }
    if (
      this.options.minRightPx &&
      dividerX > mapWidth - this.options.minRightPx
    ) {
      dividerX = mapWidth - this.options.minRightPx;
    }

    // Update divider DOM position (screen pixels)
    this._divider.style.left = `${dividerX}px`;
    this.fire("dividermove", { x: dividerX });

    // 🔑 Convert dividerX (screen pixels) into layer coordinates
    const nw = map.containerPointToLayerPoint([0, 0]);
    const se = map.containerPointToLayerPoint([mapWidth, mapHeight]);
    const clipPoint = map.containerPointToLayerPoint([dividerX, 0]);

    const clipLeft = `rect(${[nw.y, clipPoint.x, se.y, nw.x].join("px,")}px)`;
    const clipRight = `rect(${[nw.y, se.x, se.y, clipPoint.x].join("px,")}px)`;

    // Apply to layers
    this._leftLayers.forEach((layer) => {
      if (!this._map.hasLayer(layer)) return;
      const el = layer.getContainer?.() || layer.getPane?.();
      if (el) el.style.clip = clipLeft;
    });

    this._rightLayers.forEach((layer) => {
      if (!this._map.hasLayer(layer)) return;
      const el = layer.getContainer?.() || layer.getPane?.();
      if (el) el.style.clip = clipRight;
    });

    return this;
  },
  _updateLayers() {
    if (!this._map) {
      return this;
    }
    var prevLeft = this._leftLayer;
    var prevRight = this._rightLayer;
    this._leftLayer = this._rightLayer = null;
    this._leftLayers.forEach(function (layer) {
      if (this._map.hasLayer(layer)) {
        this._leftLayer = layer;
      }
    }, this);
    this._rightLayers.forEach(function (layer) {
      if (this._map.hasLayer(layer)) {
        this._rightLayer = layer;
      }
    }, this);
    if (prevLeft !== this._leftLayer) {
      prevLeft && this.fire("leftlayerremove", { layer: prevLeft });
      this._leftLayer && this.fire("leftlayeradd", { layer: this._leftLayer });
    }
    if (prevRight !== this._rightLayer) {
      prevRight && this.fire("rightlayerremove", { layer: prevRight });
      this._rightLayer &&
        this.fire("rightlayeradd", { layer: this._rightLayer });
    }
    this._updateClip();
  },

  _addEvents() {
    const range = this._range;
    const map = this._map;

    if (!map || !range) return;

    map.on("move", this._updateClip, this);
    map.on("layeradd layerremove", this._updateLayers, this);
    on(range, getRangeEvent(range), this._updateClip, this);
    on(range, "mousedown touchstart", cancelMapDrag, this);
    on(range, "mouseup touchend", uncancelMapDrag, this);
  },

  _removeEvents() {
    const range = this._range;
    const map = this._map;

    if (range) {
      off(range, getRangeEvent(range), this._updateClip, this);
      off(
        range,
        L.Browser.touch ? "touchstart" : "mousedown",
        cancelMapDrag,
        this
      );
      off(
        range,
        L.Browser.touch ? "touchend" : "mouseup",
        uncancelMapDrag,
        this
      );
    }

    if (map) {
      map.off("layeradd layerremove", this._updateLayers, this);
      map.off("move", this._updateClip, this);
    }
  },
});

L.control.divide = function (leftLayers, rightLayers, options) {
  return new L.Control.Divide(leftLayers, rightLayers, options);
};

export const { Divide } = L.Control;
export default Divide;
