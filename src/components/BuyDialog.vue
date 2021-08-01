<template>
  <v-dialog :value="show" persistent width="450">
      <v-card>
        <v-card-title class="headline">
          Buy Mandala Seed
          <v-btn color="black" icon text @click="cancel" style="position: absolute; top: 12px; right: 8px;"><v-icon small color="black">fa fa-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <p>You are buying mandala seed which might be converted to mandala whenever you want, or traded as well</p>
          <p>For conversion go to My Collection and click Create Mandala button on Seed card</p>
          <p><strong>Important:</strong> Please, do not try to send tez directly from your exchange account, this could cause the loss of your seed.</p>
          <p class="text-center mb-0"><v-btn color="white" elevation="2" @click="ok">Buy Seed</v-btn></p>
        </v-card-text>

      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    show: Boolean
  },
  methods: {
    ok () {
      this.$emit('input', true)
    },
    cancel () {
      this.$emit('input', false)
    }
  }
}
</script>

<style>

</style>
