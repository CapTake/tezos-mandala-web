<template>
  <div>
    <section id ="start" class="d-flex flex-column justify-center subpage">
      <v-parallax src="/parallax.png" dark>
      <v-overlay absolute :opacity="0.35">
      <div class="contain">
      <h1 class="text-h4 text-lg-h2 text-md-h3 mb-10 px-3 text-center">Tezos Mandala: a Generative Art Project</h1>
      <p class="text-subtitle-1 text-sm-h5 text-md-h4 text-center font-weight-light px-3">
        Сreate your unique digital mandalas as NFTs. All the mandalas are recorded in the Tezos blockchain forever, so that they are truly decentralized.
      </p>
      <p class="text-center">
        <v-btn small fab color="#fca311" style="margin: 20px auto;" @click="goTo('#get-mandala')" >
          <v-icon small color="white">fa fa-chevron-down</v-icon>
        </v-btn>
      </p>
      </div>
      </v-overlay>
      </v-parallax>
    </section>
    <section class="d-flex flex-column justify-center subpage contain">
      <h2 class="text-h4 text-lg-h2 text-md-h3 mb-10 mx-3 text-center">Create Your Mandala</h2>

      <div style="display: grid; grid-gap: 0px; grid-template-columns: repeat(3, 1fr);">
        <div><img src="/1.svg" alt="mandala picture 1" style="display: block;"></div>
        <div><img src="/2.svg" alt="mandala picture 2" style="display: block;"></div>
        <div><img src="/3.svg" alt="mandala picture 3" style="display: block;"></div>
        <div><img src="/4.svg" alt="mandala picture 4" style="display: block;"></div>
        <div><img src="/5.svg" alt="mandala picture 5" style="display: block;"></div>
        <div><img src="/6.svg" alt="mandala picture 6" style="display: block;"></div>
        <div><img src="/7.svg" alt="mandala picture 7" style="display: block;"></div>
        <div><img src="/8.svg" alt="mandala picture 8" style="display: block;"></div>
        <div><img src="/9.svg" alt="mandala picture 9" style="display: block;"></div>
      </div>
      <div id="get-mandala" class="text-center text-subtitle-1 mt-8 px-4">
        <p> Mandala price starts from 5 tez and increases by 5 tez every 100 mandalas until 600 mandalas are sold.</p>
        <p>After that, the price increases by 5 tez after 70 mandalas are sold. Then the price increases by 5 tez every (N - 5) mandalas, where N is the number of mandalas in the previous iteration.</p>
        <p>The final 5 mandalas will be sold for 100 tez per mandala.</p>
        <p>Only {{ totalMandalas }} mandalas will be generated overall.</p>
      </div>
      <p class="text-h5 text-center">{{ unsold }} Mandalas left</p>
      <p class="d-flex d-sm-none">
        <price-line-mobile :sold="sold" style="width: 96vw; margin: 0 auto" :price="`${currentPrice} tz`" />
      </p>
      <p class="d-none d-sm-flex">
        <price-line :sold="sold" style="width: 1130px; max-width: 90vw; margin: 0 auto" :price="`${currentPrice} tz`" />
      </p>
      <p class="text-center">
        <v-btn color="accent" @click="setBuyStatus(true)">Get Mandala</v-btn>
      </p>
    </section>
    <section id="how-it-works" class="d-flex flex-column justify-center subpage px-4 contain">
      <h2 class="text-h4 text-lg-h2 text-md-h3 mb-10 mx-3 text-center">How it works</h2>
      <img src="/how-it-works-desktop.png" alt="How it works" class="d-none d-sm-flex" style="max-width: 100%;">
      <img src="/how-it-works-mobile.png" alt="How it works" class="d-flex d-sm-none" style="max-width: 100%;">
    </section>
    <section id="why-tezos-mandala" class="d-flex flex-column justify-center subpage px-4 contain">
      <h2 class="text-h4 text-lg-h2 text-md-h3 mb-10 mx-3 text-center">Why Tezos Mandala</h2>
      <p>Tezos Mandala is computer-generated art. It’s an experiment based on Western psychological interpretation of mandala.</p>
      <p>It all started with Carl Jung:</p>
      <blockquote class="blockquote">
        <p>I sketched every morning in a notebook a small circular drawing, ... which seemed to correspond to my inner situation at the time. ... Only gradually did I discover what the mandala really is: ... the Self, the wholeness of the personality, which if all goes well is harmonious.</p>
        <cite>&mdash; Carl Jung, Memories, Dreams, Reflections, pp. 195–196.</cite>
      </blockquote>
      <p>Mandala for Jung was a way of interaction with one’s unconscious meaning, a way of plunging into inner self and rebalancing.</p>
      <p style="text-align: justify;">Jung was talking about physical mandalas which a person was drawing here and now.
       Digital Tezos Mandalas are also being drawn by a person here and now but this time by their unique hash.</p>
      <p style="text-align: justify;">To create your mandala you will need a mandala seed (buy it here or get it from someone).
        You can generate a mandala from your mandala seed at any time you wish.
      To do so you will have to go to <router-link to="/my-collection">My Collection</router-link>, choose a mandala seed and click the Create Mandala button. You send the transaction and the <a :href="contractLink" target="_blank" rel="noopener">smart-contract</a> generates a mandala from the hash of this transaction.</p>
      <p style="text-align: justify;">No one knows how your mandala will look like. We can only tell you that it will be a unique mandala built from elements of a different degree of rarity. The rarest elements are an eye or the Tezos sign in the center of a mandala. The color range of mandala elements is linked to their meanings, and the mandala background color range is linked to the Tezos ecosystem colors. Only a few mandalas will not comply with the rules.</p>
      <p style="text-align: justify;">While generating, Tezos Mandala is given an initial name. The name will consist of some kind words. A month later, when you meet your mandala closer, you can rename it. It will be more difficult to change the name of your mandala after that and only possible after two months of its continuous possession. Then, you can rename your mandala after 4 months, then after 8 months, and so on, a time will double after each renaming. Tezos Mandalas are not stored on the Amazon cloud and not even on IPFS, they are recorded in the Tezos blockchain forever. That is why they are truly decentralized and trustless.</p>
      <p style="text-align: justify;">In total, there will be <strong>{{ totalMandalas }}</strong> mandalas generated. Mandala seeds will be sold at an increasing price to reward early adopters
      of the project. For now, {{ unsold }} mandalas left.</p>
      <p class="text-caption">Disclaimer: Tezos Mandalas are used as an art experiment to showcase the tooling of the Tezos ecosystem like Beacon, Taquito etc.</p>
      <p class="text-center">
       <v-btn color="accent" @click="setBuyStatus(true)">Get Mandala</v-btn>
      </p>
    </section>
    <section id="nft-marketplace" class="d-flex flex-column justify-center px-4 contain">
      <h2 class="text-h4 text-lg-h2 text-md-h3 mt-16 mb-10 mx-3 text-center">NFT Button &mdash; the first general-purpose NFT marketplace on Tezos</h2>
      <p style="text-align: justify;">We are The Buttonists, the awardees of #TezosDeFiHackathon. We created Tezos Mandala because we love digital art
        and NFTs. The main project that we are working on is NFT Button. This is an NFT marketplace where people can trade Tezos Mandalas and any other
        NFTs on the Tezos blockchain. Yes, this is full-fledged secondary market for NFTs on Tezos.
        The main feature of this marketplace is a new type of all-pay auction, which we named Buttonist auction. It will be fun, stay tuned.</p>
    </section>
  </div>
</template>
<script>

import { mapActions, mapGetters, mapState } from 'vuex'
import PriceLine from '../components/PriceLine.vue'
import PriceLineMobile from '../components/PriceLineMobile.vue'

export default {
  name: 'Home',

  components: {
    PriceLineMobile,
    PriceLine
  },
  computed: {
    ...mapState(['init', 'nextId']),
    ...mapGetters(['currentPrice', 'contractLink', 'unsold', 'totalMandalas']),
    progress () {
      return ((this.totalMandalas - this.unsold) / this.totalMandalas) * 100
    },
    sold () {
      return this.nextId - 1
    }
  },
  mounted () {
    if (this.$route.hash) {
      this.goTo(this.$route.hash)
    }
  },
  watch: {
    $route (r, o) {
      if (r.hash !== o.hash) {
        try {
          this.$vuetify.goTo(r.hash || '#start', {})
        } catch (ignore) {
          //
        }
      }
    }
  },
  methods: {
    ...mapActions(['setBuyStatus']),
    buy (confirmed) {
      this.buyDialog = false
      if (confirmed) this.buySeed()
    },
    goTo (id) {
      const el = document.querySelector(id)
      if (!el) return
      this.$vuetify.goTo(id)
    }
  }
}
</script>
<style>
/*! locomotive-scroll v4.1.0 | MIT License | https://github.com/locomotivemtl/locomotive-scroll */
html.has-scroll-smooth {
  overflow: hidden; }

html.has-scroll-dragging {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none; }

.has-scroll-smooth body {
  overflow: hidden; }

.has-scroll-smooth [data-scroll-container] {
  min-height: 100vh; }

[data-scroll-direction="horizontal"] [data-scroll-container] {
  white-space: nowrap;
  height: 100vh;
  display: inline-block;
  white-space: nowrap; }

[data-scroll-direction="horizontal"] [data-scroll-section] {
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  height: 100%; }

.c-scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  width: 11px;
  height: 100%;
  transform-origin: center right;
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0; }
  .c-scrollbar:hover {
    transform: scaleX(1.45); }
  .c-scrollbar:hover, .has-scroll-scrolling .c-scrollbar, .has-scroll-dragging .c-scrollbar {
    opacity: 1; }
  [data-scroll-direction="horizontal"] .c-scrollbar {
    width: 100%;
    height: 10px;
    top: auto;
    bottom: 0;
    transform: scaleY(1); }
    [data-scroll-direction="horizontal"] .c-scrollbar:hover {
      transform: scaleY(1.3); }

.c-scrollbar_thumb {
  position: absolute;
  top: 0;
  right: 0;
  background-color: black;
  opacity: 0.5;
  width: 7px;
  border-radius: 10px;
  margin: 2px;
  cursor: -webkit-grab;
  cursor: grab; }
  .has-scroll-dragging .c-scrollbar_thumb {
    cursor: -webkit-grabbing;
    cursor: grabbing; }
  [data-scroll-direction="horizontal"] .c-scrollbar_thumb {
    right: auto;
    bottom: 0; }
</style>
