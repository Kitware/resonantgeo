<script>
import layerMixin from '../../mixins/geojsLayer';

export default {
  mixins: [layerMixin],
  props: {
    categories: {
      type: Array,
      required: true,
    },
    position: {
      type: Object,
      default() {
        return {
          right: 10,
          top: 10,
        };
      },
    },
  },
  watch: {
    categories: {
      handler(newValue, oldValue) {
        this.colorLegend.removeCategories(oldValue);
        this.colorLegend.addCategories(newValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.createLayer('ui', {
      opacity: this.opacity,
    });
    this.colorLegend = this.$geojsLayer.createWidget('colorLegend', {
      position: this.position,
    });
    this.colorLegend.addCategories(this.categories);
  },
  render() {
    return null;
  },
};
</script>
