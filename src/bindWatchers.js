export default function bindWatchers(vueComponent, geojsObject, props) {
  const unwatch = vueComponent.$unwatch;
  props.forEach((prop) => {
    if (unwatch.has(prop)) {
      unwatch.get(prop)();
    }
    unwatch.set(prop, vueComponent.$watch(prop, (value) => {
      geojsObject[prop].call(geojsObject, value);
      geojsObject.draw();
    }, { deep: true }));
  });
}
