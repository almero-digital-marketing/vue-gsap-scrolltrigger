<template>
  <div class="content">
    <div class="toolbar">
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
          :scope="wrapper">
          <p>{{text}}</p>
          <h2>{{ trigger.step }} {{ trigger.isActive }} {{ Math.round(100 * trigger.progress) }}%</h2>
        </scroll-trigger>
      </div>
      <scroll-trigger class="dynamic" name="dynamic" start="top bottom-=30%" end="bottom top+=30%" :scrub="true" :markers="true" :enabled="enabled">
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

</script>
<style>
#app {
  overflow: hidden;
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
  padding-top: 100vh;
  padding-bottom: 100vh;
}
.static, .dynamic {
  border: 2px solid black;
}
.static p {
  transform: translateX(calc(100vw * var(--progress-static)));
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
</style>
