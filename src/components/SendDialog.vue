<template>
  <v-dialog :value="show" persistent width="450">
      <v-card>
        <v-card-title class="headline text-truncate">
          {{ title }}
          <v-btn color="black" icon text @click="cancel" style="position: absolute; top: 12px; right: 8px;"><v-icon small color="black">fa fa-close</v-icon></v-btn>
        </v-card-title>

        <v-card-text>
          <p class="pt-6 mb-2">
            <v-form v-model="valid">
            <v-text-field placeholder="tz1..." outlined dense v-model.trim="destination" :rules="rules" :hide-details="false" clearable></v-text-field>
            </v-form>
          </p>
          <p class="text-caption text--primary"><strong>Important:</strong> Please don't send your {{ type }} to an exchange account as this can result in the loss of your token.</p>
          <p class="text-center mb-0"><v-btn color="white" elevation="2" :disabled="!valid" @click="ok">Send</v-btn></p>
        </v-card-text>

      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    token: Object,
    show: Boolean
  },
  data () {
    return {
      destination: '',
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 35) || 'Address too short'
      ],
      valid: false
    }
  },
  computed: {
    type () {
      return this.token ? this.token.rarity === 'Seed' ? 'Seed' : 'Mandala' : ''
    },
    title () {
      return this.token ? `Send ${this.type === 'Seed' ? 'Seed #' + this.token.id : '' + this.token.name + ''}` : ''
    }
  },
  methods: {
    ok () {
      if (this.valid) this.$emit('input', this.destination)
    },
    cancel () {
      this.$emit('input', false)
    }
  }
}
</script>

<style>
  .headline {
    max-width: calc(100% - 50px)
  }
</style>
