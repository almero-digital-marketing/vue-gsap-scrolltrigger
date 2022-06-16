<template>
  <input type="range" min="0" max="200" v-model="a" class="range">
  <input type="range" min="0" max="200" v-model="b" class="range">
  <input type="range" min="0" max="200" v-model="c" class="range">
  <!-- <smooth-scroll :smooth="2">

    <div v-if="speed">
      <div class="box a" :data-speed="a / 100" v-smooth-effect></div>
      <div class="box b" :data-speed="b / 100" v-smooth-effect></div>
      <div class="box c" :data-speed="c / 100" v-smooth-effect></div>
    </div>

  </smooth-scroll> -->
  <div class="target content">
    <div class="toolbar">
      <button @click="speed = !speed">Toggle Speed</button>  
      <button @click="text = text + text">Add text</button>    
      <button @click="enabled = !enabled">Toggle enabled</button>
    </div>
    <div class="trigger" ref="trigger">
      <div class="wrapper" ref="wrapper">
        <scroll-trigger 
          v-slot="trigger" 
          class="static" 
          name="static" 
          start="top bottom-=30%" 
          end="bottom top+=30%" 
          :scrub="true" 
          :markers="true" 
          :steps="3" 
          :trigger="trigger"
          :scope="wrapper"
          :fromTo="[{
            targets: 'p',
            fromVars: {
              xPercent: -100,
              scale: .1
            },
            toVars: {
              xPercent: 50,
              scale: 2,
              rotate: '90deg'
            },
            ease: 'expo'
          }]">
          <p>{{text}}</p>
          <h2>{{ trigger }}</h2>
        </scroll-trigger>
      </div>
      <scroll-trigger 
        class="dynamic" 
        name="dynamic" 
        start="top bottom-=30%" 
        end="bottom top+=30%" 
        :scrub="true" 
        :markers="true" 
        :enabled="enabled" 
        :toggleClass="{
          targets: '.target',
          className: 'active-target'
        }">
        {{ enabled }}
        <p>{{text}}</p>
      </scroll-trigger>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const enabled = ref(false)
const text = ref(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`)
const trigger = ref(null)
const wrapper = ref(null)

const a = ref(50)
const b = ref(100)
const c = ref(150)
const speed = ref(false)

</script>
<style>
#app {
  overflow: hidden;
}
.range {
  position: fixed;
  top: 20px;
  z-index: 1000;
}
.range:nth-child(2) {
  left: 200px;
}
.range:nth-child(3) {
  left: 400px;
}
.box {
  position: absolute;
  top: 200px;
  height: 100px;
  width: 100px;
}
.box.a {
  background-color: red;
}
.box.b {
  background-color: green;
}
.box.c {
  background-color: blue;
}
.trigger {
  border: 1px solid green;
}
.toolbar {
  position: fixed;
  top: 60px;
  left: 60px;
}
.content {
  padding-top: 1000px;
  padding-bottom: 1000px;
}
.static, .dynamic {
  border: 2px solid black;
}
.static p {
  /* transform: translateX(calc(100vw * var(--progress-static))); */
  opacity: calc(1 - var(--progress-static));
}
.dynamic p {
  transform: translateX(calc(100vw * var(--progress-dynamic)));
  opacity: calc(1 - var(--progress-dynamic));
}
.active-static .static p,
.active-dynamic.dynamic p {
  background-color: lightblue;
}
.scroll-trigger {
  margin-top: 200px;
}
.active-target {
  background-color: lightgoldenrodyellow;
}
</style>
