<template lang="pug">
v-card.job-filter(dark color='primary darken-1')
  v-container.py-2(fluid, grid-list-xl)
    v-layout(row)
      v-flex(sm12, d-flex)
        h3.primary--text.text--lighten-2 Filter Jobs
    // for when girder's api supports this sort of filtering
    //
      v-layout(row, justify-space-between)
        v-flex(sm3, d-flex)
          v-text-field(
            label='Keywords',
            :value='keywords.join(" ")'
            color='white',
            clearable,
            @input='$emit("update:keywords", $event.split(" "))'
          )
    v-layout(row, justify-center)
      v-flex(sm3, d-flex)
        v-select(
          label='Job Type',
          :items='jobTypeList',
          :value='jobType',
          clearable,
          color='white',
          dark,
          dense,
          @input='$emit("update:jobType", $event)'
        )
      // for when girder's api supports this sort of filtering
      //
        v-flex(sm6, d-flex)
          v-layout(row)
            v-flex(sm6)
              v-menu(
                ref='fromDateMenu',
                :close-on-content-click='false',
                :nudge-right='40',
                v-model='fromDateMenu',
                lazy,
                transition='scale-transition',
                offset-y,
                full-width
              )
                v-text-field(
                  slot='activator',
                  :value='fromDate',
                  label='Last Update (from)',
                  prepend-icon='event',
                  clearable,
                  color='white',
                  readonly
                )
                v-date-picker(
                  :value='fromDate',
                  no-title,
                  dark,
                  @input='$emit("update:fromDate", $event); fromDateMenu = false'
                )
            v-flex(sm6)
              v-menu(
                ref='toDateMenu',
                :close-on-content-click='false',
                :nudge-right='40',
                v-model='toDateMenu',
                lazy,
                transition='scale-transition',
                offset-y,
                full-width
              )
                v-text-field(
                  slot='activator',
                  :value='toDate',
                  label='Last Update (to)',
                  prepend-icon='arrow_forward',
                  clearable,
                  color='white',
                  readonly
                )
                v-date-picker(
                  :value='toDate',
                  no-title,
                  dark,
                  @input='$emit("update:toDate", $event); toDateMenu = false'
                )
      v-flex(sm3, d-flex)
        v-select(
          label='Status',
          :items='statusItemList',
          :value='status',
          clearable,
          color='white',
          dark,
          dense,
          @input='$emit("update:status", $event)'
        )
</template>

<script>
import sortBy from 'lodash-es/sortBy';

import * as status from './jobs/status';

export default {
  props: {
    /*
    keywords: {
      type: Array,
      default() {
        return [];
      },
    },
    fromDate: {
      type: [String, Object],
      default: null,
    },
    toDate: {
      type: [String, Object],
      default: null,
    },
    */
    jobType: {
      type: [String, Object],
      default: null,
    },
    jobTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    status: {
      type: [Number, Object],
      default: null,
    },
    statusList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fromDateMenu: false,
      toDateMenu: false,
    };
  },
  computed: {
    statusItemList() {
      return sortBy(this.statusList
        .map(status.getByValue)
        .filter(s => s.text), ['text']);
    },
  },
};
</script>
