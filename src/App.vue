<template>
  <div class="content">
    <div class="toolbar">
      <button @click="text = text + text">Add text</button>    
      <button @click="enabled = !enabled">Toggle enabled</button>
    </div>

    <scroll-trigger name="test" start="top bottom-=30%" end="bottom top+=30%" :scrub="true" :markers="true">
      <p>{{text}}</p>
    </scroll-trigger>
    <scroll-trigger class="fuxk" name="test" start="top bottom-=30%" end="bottom top+=30%" :scrub="true" :markers="true" :enabled="enabled">
      {{ enabled }}
      <p>{{text}}</p>
    </scroll-trigger>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const enabled = ref(false)
const text = ref(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`)

</script>
<style>
#app {
  overflow: hidden;
}
.toolbar {
  position: fixed;
  top: 60px;
  left: 60px;
}
.content {
  padding-top: 100vh;
  padding-bottom: 100vh;
}
p {
  border: 2px solid black;
  transform: translateX(calc(100vw * var(--progress)));
  opacity: calc(1 - var(--progress));
}
.active p {
  border: 2px solid red;
}
.scroll-trigger {
  margin-top: 200px;
}
</style>
