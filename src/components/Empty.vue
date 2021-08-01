<template>
  <v-responsive :aspect-ratio="20/8" class="empty-space justify-center">
      <v-progress-circular v-if="loading" indeterminate color="orange" />
      <div v-else>
        <div class="text-center text-h5 text--disabled" style="margin-top: 50px">{{ title }}</div>
        <div v-if="showBuyButton" class="text-center mt-15"><v-btn color="accent" @click="$emit('buy')">Get Mandala</v-btn></div>
      </div>
  </v-responsive>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    title: String,
    showBuyButton: Boolean
  }
}
</script>

<style>
.empty-space {
    width: 100%;
}
</style>
