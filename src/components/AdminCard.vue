<template>
    <v-card class="mandala">
    <v-lazy v-model="active" />
    <v-row v-if="ok" no-gutters class="pa-3">
        <v-col><span class="text--disabled">{{ item.id }}</span></v-col>
        <v-col class="text-right"><span class="text--primary">{{ item.rarity }}</span></v-col>
    </v-row>
    <v-responsive :aspect-ratio="1" ref="outer" :style="style">
    </v-responsive>
    <v-card-text v-if="ok">
        <p class="text-truncate text--primary text-center text-body-1 mb-0">{{ title }}</p>
        <v-row no-gutters class="mt-4" style="flex-wrap: nowrap;">
            <v-col class="text-truncate" style="display:inline-block; color:#111"><a :href="`https://tzstats.com/${item.owner}`" target="_blank" rel="noopener" class="text-decoration-none">{{ item.owner | shortAddress }}</a></v-col>
            <v-col class="text-right">
                <v-btn elevation="1" v-if="mayCreate" outlined plain small x-small @click="onCreate">Migrate V1</v-btn>
            </v-col>
        </v-row>
    </v-card-text>
    </v-card>
</template>

<script>
import pako from 'pako'
import { svgAsPngUri, saveSvgAsPng } from 'save-svg-as-png'
import { shortAddress } from '../utils'
import { mapGetters } from 'vuex'

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
    ...mapGetters(['getV1Mandala']),
    title () {
      return this.item.data ? this.item.name : '#' + this.item.id
    },
    mayCreate () {
      return this.item.version === '31' && !this.item.data
    },
    style () {
      return {
        background: '#ddd',
        backgroundSize: 'contain',
        backgroundImage: `url('${this.ready ? this.uri : this.defaultUri}')`
        // borderRadius: '4px 4px 0 0'
      }
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
      xtra: false,
      legendary: false
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
          this.xtra = !!svg.match(/^<svg[^>]*hue-rotate[^>]+?>/)
          this.legendary = !!svg.match(/^<svg[^>]*grayscale[^>]+?>/)
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
    onCreate () {
      const id = this.item.id
      const bytes = this.getV1Mandala(id)
      console.log(bytes)
      if (!bytes) return
      this.$emit('renderv1', { id, bytes })
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
