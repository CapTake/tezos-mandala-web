<template>
  <svg width="1125" height="60" viewBox="0 0 1125 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="100" height="15" class="rect-svg" />
    <rect x="100" y="0" width="100" height="15" class="rect-svg" />
    <rect x="200" y="0" width="100" height="15" class="rect-svg" />
    <rect x="300" y="0" width="100" height="15" class="rect-svg" />
    <rect x="400" y="0" width="100" height="15" class="rect-svg" />
    <rect x="500" y="0" width="100" height="15" class="rect-svg" />
    <rect x="600" y="0" width="70" height="15" class="rect-svg" />
    <rect x="670" y="0" width="65" height="15" class="rect-svg" />
    <rect x="735" y="0" width="60" height="15" class="rect-svg" />
    <rect x="795" y="0" width="55" height="15" class="rect-svg" />
    <rect x="850" y="0" width="50" height="15" class="rect-svg" />
    <rect x="900" y="0" width="45" height="15" class="rect-svg" />
    <rect x="945" y="0" width="40" height="15" class="rect-svg" />
    <rect x="985" y="0" width="35" height="15" class="rect-svg" />
    <rect x="1020" y="0" width="30" height="15" class="rect-svg" />
    <rect x="1050" y="0" width="25" height="15" class="rect-svg" />
    <rect x="1075" y="0" width="20" height="15" class="rect-svg" />
    <rect x="1095" y="0" width="15" height="15" class="rect-svg" />
    <rect x="1110" y="0" width="10" height="15" class="rect-svg" />
    <rect x="1120" y="0" width="5" height="15" class="rect-svg" />
    <text x="0" y="30" class="txt-svg" text-anchor="start">5 tz</text>
    <text x="1125" y="30" class="txt-svg" text-anchor="end">100 tz</text>
    <circle :cx="sold" cy="7.5" r="7" class="circle-svg" />
    <text :x="sold" y="30" class="txt-svg" text-anchor="middle">{{ price }}</text>
  </svg>
</template>

<script>
export default {
  props: {
    price: String,
    sold: Number
  }
}
</script>

<style>
    .rect-svg {
      fill:  #fca311;
      stroke: #fff;
      stroke-width: 2px;
      transition: all 0.5s;
    }
    .rect-svg:hover {
      fill: #da631e
    }
    .txt-svg {
      color: #000;
      font-family: sans-serif;
      font-size: 16px;
    }
    .circle-svg {
      stroke: #FFF;
      stroke-width: 1px;
      fill: rgb(0, 94, 201);
      transition: all 0.5s cubic-bezier(0.0, 0.0, 1.0, 1.0);
    }
    .circle-svg:hover {
      stroke-width: 3px;
    }
</style>
