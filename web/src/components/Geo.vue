<template lang="pug">
.map
</template>

<script>
import geo from 'geojs';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'items',
      'selectedIndex',
    ]),
    style() {
      return this.items.map(() => ({ fillColor: 'blue' }));
    },
  },
  watch: {
    selectedIndex() {
      this.recolor();
    },
  },
  mounted() {
    this.map = geo.map({
      node: this.$el,
    });
    this.map.createLayer('osm');
    this.layer = this.map.createLayer('feature', { features: ['point', 'line', 'polygon'] });
    this.features = [];
    const addFeature = async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      const reader = geo.createFileReader('jsonReader', { layer: this.layer });
      const index = this.features.length;
      this.features.push(null);
      reader.read(data, () => {
        const feature = this.layer.children()[this.layer.children().length - 2];
        feature.selectionAPI(true).style('fillColor', index === this.$store.state.selectedIndex ? 'red' : 'orange').geoOn(geo.event.feature.mouseclick, () => this.$store.commit('setSelectedIndex', index));
        this.features[index] = feature;
        this.map.draw();
      });
    };
    addFeature('/static/california.geojson');
    addFeature('/static/arizona.geojson');
  },
  methods: {
    recolor() {
      this.features.forEach((feature, index) => {
        feature.style('fillColor', index === this.$store.state.selectedIndex ? 'red' : 'orange').draw();
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.map
  width 100%
  height 100%
</style>
