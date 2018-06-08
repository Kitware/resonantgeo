<template lang="pug">
// cesium point cloud
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
    featureStyle: {
      type: Object,
      default: null,
    },
    zoomOnAdd: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    featureStyle: {
      deep: true,
      handler() {
        this.setStyle();
      },
    },
    url() {
      this.destroyTileset();
      this.createTileset();
    },
    visible() {
      this.$cesiumTileset.show = this.visible;
    },
  },
  beforeDestroy() {
    this.destroyTileset();
  },
  mounted() {
    // This is in place purely for testing because there is no way
    // in @vue/test-utils to put mocks in place *before* mount is called.
    //   https://github.com/vuejs/vue-test-utils/issues/560
    this.$parent = this.$parent || this.$options.testParent;

    if (!this.$parent || !this.$parent.$cesiumViewer) {
      throw new Error('A point cloud must be a child of a CesiumViewport');
    }

    this.$cesium = this.$parent.$cesium;
    this.$cesiumViewer = this.$parent.$cesiumViewer;
    this.createTileset();
  },
  methods: {
    createTileset() {
      const tileset = new this.$cesium.Cesium3DTileset(Object.assign({
        url: this.url,
      }, this.options));
      this.$cesiumTileset = this.$cesiumViewer.scene.primitives.add(tileset);
      this.$cesiumTileset.show = this.visible;
      this.setStyle();
      if (this.zoomOnAdd) {
        this.zoomToFeature();
      }
    },
    destroyTileset() {
      if (this.$cesiumTileset) {
        this.$cesiumViewer.scene.primitives.remove(this.$cesiumTileset);
        delete this.$cesiumTileset;
      }
    },
    setStyle() {
      this.$cesiumTileset.style = new this.$cesium.Cesium3DTileStyle(this.featureStyle);
    },
    zoomToFeature() {
      this.$cesiumViewer.zoomTo(this.$cesiumTileset);
    },
  },
};
</script>
