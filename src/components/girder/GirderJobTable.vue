<template lang="pug">
v-card
  v-data-table(
    item-key='_id',
    :headers='headers',
    :items='items',
    :total-items='totalItems',
    :pagination='pagination',
    @update:pagination='$emit("update:pagination", $event)'
  )
    template(slot='items', slot-scope='props')
      td {{ props.item.title }}
      td.one-line {{ props.item.type }}
      td.one-line {{ props.item.updateString }}
      td.one-line {{ props.item.statusText }}

    template(slot='pageText', slot-scope='props')
      .v-datatable__actions__pagination {{ pageRange.first }}-{{ pageRange.last }}
</template>

<script>
import moment from 'moment';

import * as status from './jobs/status';

export default {
  props: {
    jobs: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      required: true,
    },
    morePages: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      headers: [{
        text: 'Job Title',
        value: 'title',
      }, {
        text: 'Type',
        value: 'type',
      }, {
        text: 'Last Updated',
        value: 'updated',
      }, {
        text: 'Status',
        value: 'status',
      }],
    };
  },
  computed: {
    items() {
      return this.jobs.map(this.mapJobToRow);
    },
    totalItems() {
      let { last } = this.pageRange;
      if (this.morePages) {
        last += 1;
      }
      return last;
    },
    pageRange() {
      const first = (this.pagination.rowsPerPage * (this.pagination.page - 1)) + 1;
      const last = (first + this.jobs.length) - 1;
      return { first, last };
    },
  },
  methods: {
    mapJobToRow(job) {
      const statusDef = Object.assign({ text: 'Unknown' }, status.getByValue(job.status));
      return Object.assign({
        statusText: statusDef.text,
        updateString: moment(job.updated).format('dddd, MMMM D, YYYY @ h:mm a'),
      }, job);
    },
  },
};
</script>

<style lang="stylus" scoped>
.one-line
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>
