<template lang="pug">
v-container(fluid)
  v-slide-y-transition(mode="out-in")
    v-layout(column, align-center)
      img.mb-5(src="@/assets/logo.png"
          alt="Vuetify.js")
      blockquote.hello
        | "First, solve the problem. Then, write the code."
        footer
          small
            em —John Johnson
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2
  font-weight normal
ul
  list-style-type none
  padding 0
li
  display inline-block
  margin 0 10px
a
  color #42b983
</style>
