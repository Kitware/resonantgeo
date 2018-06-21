import geo from 'geojs';
import { mount } from '@vue/test-utils';

class ProvideGeojs {
  start() {
    this.element = document.createElement('div');
    this.element.style.width = '300px';
    this.element.style.height = '200px';
    document.body.appendChild(this.element);
    this.geojsMap = geo.map({ node: this.element });
  }

  stop() {
    this.geojsMap.exit();
    this.element.remove();
    this.element = null;
  }

  mountOptions() {
    return {
      provide: {
        $geojs: geo,
        $geojsMap: this.geojsMap,
      },
    };
  }

  mountLayer(component, options = {}) {
    return mount(component, Object.assign(
      this.mountOptions(),
      options,
    ));
  }
}

export default ProvideGeojs;
