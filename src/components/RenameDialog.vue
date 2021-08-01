<template>
  <v-dialog :value="show" persistent width="450">
      <v-card>
        <v-card-title class="headline">
          Rename Your Mandala
          <v-btn color="black" icon text @click="cancel" style="position: absolute; top: 12px; right: 8px;"><v-icon small color="black">fa fa-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <p class="pt-6">
            <v-form v-model="valid">
            <v-text-field placeholder="My Mandala" outlined dense v-model.trim="rename" :hide-details="false" :rules="rules" clearable></v-text-field>
            </v-form>
          </p>
          <p class="text-center mb-0"><v-btn color="white" elevation="2" @click="ok">Rename</v-btn></p>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
const MAX_LENGTH = 30
export default {
  props: {
    name: String,
    show: Boolean
  },
  data () {
    return {
      rename: '',
      rules: [
        value => (value && value.length <= MAX_LENGTH) || 'Name too long (> 30)'
      ],
      valid: false
    }
  },
  watch: {
    name (v) {
      this.rename = v.substr(0, 30)
    }
  },
  methods: {
    ok () {
      if (this.valid) this.$emit('input', this.rename)
    },
    cancel () {
      this.$emit('input', false)
    }
  }
}
</script>

<style>

</style>
