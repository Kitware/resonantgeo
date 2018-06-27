import forEach from 'lodash-es/forEach';
import isArray from 'lodash-es/isArray';
import mapKeys from 'lodash-es/mapKeys';

/**
 * If the argument is an array, transform it into an object
 * with keys equal to the value of the element in the array.
 *
 * [ 'a', 'b' ] -> { a: 'a', b: 'b' }
 */
function arrayToObject(arg) {
  if (!isArray(arg)) {
    return arg;
  }
  return mapKeys(arg);
}

/**
 * Bind a watcher to a vue component that automatically calls a method
 * on a geojs object when the prop changes.  The props argument can
 * either be an array or an object with string values.
 *
 * For an object, it is a mapping from the component prop name to the geojs
 * function to call, e.g. for `props = {'myPosition', 'position'}` will
 * call the geojs method `position` whenever the component prop `myPosition`
 * changes.
 *
 * For an array, the property name and geojs method name are assumed to
 * be the same.
 */
export default function bindWatchers(vueComponent, geojsObject, props) {
  const unwatch = vueComponent.$unwatch;
  forEach(arrayToObject(props), (geojsMethod, prop) => {
    if (unwatch.has(prop)) {
      unwatch.get(prop)();
    }
    unwatch.set(prop, vueComponent.$watch(prop, (value) => {
      geojsObject[geojsMethod].call(geojsObject, value);
      geojsObject.draw();
    }, { deep: true }));
  });
}
