import bind from 'lodash-es/bind';

export default function bindWatchers(vueComponent, geojsObject, props) {
  props.forEach((prop) => {
    vueComponent.$watch(prop, bind(geojsObject[prop], geojsObject));
    vueComponent.$watch(prop, (value) => {
      geojsObject[prop].call(geojsObject, value);
      geojsObject.draw();
    });
  });
}
