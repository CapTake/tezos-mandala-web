<template>
  <svg :width="1125/3.5" height="40" :viewBox="`0 0 ${1125/3.5} 40`" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="100/3.5" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="200/3.5" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="300/3.5" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="400/3.5" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="500/3.5" y="0" :width="100/3.5" height="15" class="rect-svgm" />
    <rect :x="600/3.5" y="0" :width="70/3.5" height="15" class="rect-svgm" />
    <rect :x="670/3.5" y="0" :width="65/3.5" height="15" class="rect-svgm" />
    <rect :x="735/3.5" y="0" :width="60/3.5" height="15" class="rect-svgm" />
    <rect :x="795/3.5" y="0" :width="55/3.5" height="15" class="rect-svgm" />
    <rect :x="850/3.5" y="0" :width="50/3.5" height="15" class="rect-svgm" />
    <rect :x="900/3.5" y="0" :width="45/3.5" height="15" class="rect-svgm" />
    <rect :x="945/3.5" y="0" :width="40/3.5" height="15" class="rect-svgm" />
    <rect :x="985/3.5" y="0" :width="35/3.5" height="15" class="rect-svgm" />
    <rect :x="1020/3.5" y="0" :width="30/3.5" height="15" class="rect-svgm" />
    <rect :x="1050/3.5" y="0" :width="25/3.5" height="15" class="rect-svgm" />
    <rect :x="1075/3.5" y="0" :width="20/3.5" height="15" class="rect-svgm" />
    <rect :x="1095/3.5" y="0" :width="15/3.5" height="15" class="rect-svgm" />
    <rect :x="1110/3.5" y="0" :width="10/3.5" height="15" class="rect-svgm" />
    <rect :x="1120/3.5" y="0" :width="7/3.5" height="15" class="rect-svgm" />
    <text x="0" y="30" class="txt-svgm" text-anchor="start">5 tz</text>
    <text :x="1125/3.5" y="30" class="txt-svgm" text-anchor="end">100 tz</text>
    <circle :cx="sold/3.5" cy="7.5" r="5" class="circle-svgm" />
    <text :x="sold/3.5" y="30" class="txt-svgm" text-anchor="middle">{{ price }}</text>
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
    .rect-svgm {
      fill:  #fca311;
      stroke: #fff;
      stroke-width: 1px;
      transition: all 0.5s;
    }
    .rect-svgm:hover {
      fill: #fa8541
    }
    .txt-svgm {
      color: #000;
      font-family: sans-serif;
      font-size: 13px;
    }
    .circle-svgm {
      stroke: #FFF;
      stroke-width: 1px;
      fill: rgb(0, 94, 201);
      transition: all 0.5s cubic-bezier(0.0, 0.0, 1.0, 1.0);
    }
    .circle-svgm:hover {
      stroke-width: 3px;
    }
</style>
