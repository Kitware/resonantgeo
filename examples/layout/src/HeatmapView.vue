<template lang="pug">
full-screen-viewport
  geojs-map-viewport(
    :viewport.sync='viewport',
    @click='clicked = $event'
  )
    geojs-tile-layer(
      :url='url',
      :attribution='attribution',
      :zIndex='0'
    )
    geojs-heatmap-layer(
      :data='data',
      :binned='binned',
      :maxIntensity='maxIntensity',
      :minIntensity='minIntensity',
      :updateDelay='updateDelay',
      :zIndex='1'
    )

  side-panel(
    :floating='false',
    :top='64',
    :toolbar='panel.toolbar'
  )
    v-card.pt-2(flat)
      v-card-text.py-0
        v-select(
          :items='binOptions',
          v-model='binned',
          label='Bin size',
        )
    v-card(flat)
      v-card-text.py-0
        v-text-field(
          type='number',
          v-model.number='maxIntensity',
          label='Maximum intensity',
          :min='1',
          :step='0.1'
        )
    v-card(flat)
      v-card-text.py-0
        v-text-field(
          type='number',
          v-model.number='minIntensity',
          label='Minimum intensity',
          :min='0',
          :max='1',
          :step='0.1'
        )
    v-card(flat)
      v-card-text.py-0
        v-text-field(
          type='number',
          v-model.number='updateDelay',
          label='Update delay (ms)',
          :step='10',
          :min='0'
        )
</template>

<script>
export default {
  name: 'HeatmapView',
  data() {
    return {
      url: 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, Data by <a href="https://openstreetmap.org">OpenStreetMap</a>',
      viewport: {
        center: [-100, 30],
        zoom: 4,
      },
      panel: {
        items: 2,
        toolbar: {
          title: 'Heatmap controls',
        },
        expanded: true,
      },
      data: [],
      binOptions: [{
        text: 'auto',
        value: 'auto',
      }, {
        text: '5 pixels',
        value: 5,
      }, {
        text: '10 pixels',
        value: 10,
      }, {
        text: '15 pixles',
        value: 15,
      }],
      binned: 10,
      maxIntensity: 5,
      minIntensity: 0,
      updateDelay: 100,
    };
  },
  mounted() {
    fetch('http://opengeoscience.github.io/geojs/data/AdderallCities2015.csv')
      .then(resp => resp.text())
      .then((text) => {
        const rows = text.split(/\r\n|\n|\r/);
        rows.splice(0, 1);
        this.data = rows.map((r) => {
          const fields = r.split(',');
          return [fields[25], fields[24]].map(parseFloat);
        });
      });
  },
};
</script>
