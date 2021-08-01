<template>
    <v-card class="mandala">
    <v-lazy v-model="active" />
    <v-row v-if="ok" no-gutters class="pa-3">
        <v-col v-if="showId"><span class="text--disabled text--color-grey lighten-4">{{ item.id }}</span></v-col>
        <v-col class="text-right"><span class="text--primary">{{ legend ? 'Legendary,' : ''}} {{ epic ? 'Epic,' : ''}} {{ item.rarity }}</span></v-col>
    </v-row>
    <v-responsive :aspect-ratio="1" ref="outer" :style="style">
    </v-responsive>
    <v-card-text v-if="ok">
        <p class="text-truncate text--primary text-center text-body-1 mb-0">{{ title }}</p>
        <!-- actions -->
        <v-row v-if="buttons" no-gutters class="mt-4" style="flex-wrap: nowrap;">
            <v-col class="text-left">
                <v-btn elevation="1" outlined plain small x-small @click="onSend">Send</v-btn>
            </v-col>
            <v-col v-if="isMandala && mayRename" class="text-right">
                <v-btn elevation="1" outlined plain small x-small @click="onRename">Rename</v-btn>
            </v-col>
            <v-col class="text-right">
                <v-btn v-if="isMandala" elevation="1" outlined plain small x-small @click="savePng(`m${item.id}`)">Download</v-btn>
                <v-btn v-else elevation="1" :loading="item.date > 0" outlined plain small x-small @click="onConvert">Create mandala</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="showOwner && !actions" no-gutters class="mt-4" style="flex-wrap: nowrap;">
            <v-col class="text-truncate" style="display:inline-block; color:#111"><a :href="`https://tzstats.com/${item.owner}`" target="_blank" rel="noopener" class="text-decoration-none">{{ item.owner | shortAddress }}</a></v-col>
        </v-row>
    </v-card-text>
    </v-card>
</template>

<script>
import pako from 'pako'
import { svgAsPngUri, saveSvgAsPng } from 'save-svg-as-png'
import { shortAddress } from '../utils'
import { mapState } from 'vuex'
const SECONDS_IN_MONTH = 30 * 24 * 3600

export default {
  props: {
    item: Object,
    actions: Boolean,
    defaultUri: String,
    showId: Boolean,
    showOwner: Boolean
  },
  filters: {
    shortAddress
  },
  computed: {
    ...mapState(['userAddress']),
    buttons () {
      return this.actions && this.userAddress === this.item?.owner
    },
    title () {
      return this.item?.name || this.item?.rarity || this.item?.id
    },
    style () {
      return {
        background: '#ddd',
        backgroundSize: 'contain',
        backgroundImage: `url('${this.ready ? this.uri : this.defaultUri}')`
        // borderRadius: '4px 4px 0 0'
      }
    },
    mayRename () {
      return Date.now() > ((this.item.nameTime > 0 ? this.item.nameTime : this.item.date + SECONDS_IN_MONTH) * 1000)
    },
    isMandala () {
      return this.item.rarity && this.item.rarity !== 'Seed'
    }
  },
  watch: {
    active (v) {
      if (v) this.renderBg()
    }
  },
  data () {
    return {
      active: false,
      ready: false,
      svg: null,
      uri: null,
      ok: true,
      legend: false,
      epic: false
    }
  },
  methods: {
    renderBg () {
      if (this.ready === true) return
      try {
        if (this.item.data) {
          const bytes = new Uint8Array(this.item.data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
          const dec = new TextDecoder('utf-8')
          const svg = dec.decode(pako.ungzip(bytes))
          this.legend = !!svg.match(/^<svg[^>]*hue-rotate[^>]+?>/)
          this.epic = !!svg.match(/^<svg[^>]*grayscale[^>]+?>/)
          const div = document.createElement('div')
          div.innerHTML = svg.trim()
          this.svg = div.firstChild
          svgAsPngUri(this.svg, { fonts: [], scale: 1 })
            .then(uri => {
              // this.$refs.outer.$el.style.backgroundImage = `url('${uri}')`
              this.uri = uri
            })
            .catch(e => {
              console.log('mandala:', e)
            })
            .finally(
              this.ready = true
            )
        }
      } catch (e) {
        console.log('error:', this.item)
      }
    },
    onSend () {
      this.$emit('send', this.item)
    },
    onRename () {
      this.$emit('rename', this.item)
    },
    onConvert () {
      if (this.item.date > 0) return
      this.$emit('convert', this.item.id)
    },
    savePng () {
      try {
        saveSvgAsPng(this.svg, `${this.item.name || this.item.id}.png`, { scale: 5 })
      } catch (ignore) {
        // console.log(ignore)
      }
    }
  }
}
</script>

<style>
.mandala {
  cursor: pointer;
}
.overlay-title {
  position:absolute;
  bottom: 0;
  left:0;
  right:0;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 0 12px #000, 0 0 10px #000;
}
</style>
