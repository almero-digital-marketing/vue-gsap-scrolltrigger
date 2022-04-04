<template>
    <div id="smooth-wrapper" ref="component">
        <div id="smooth-content">
            <slot :progress="progress" :velocity="velocity"></slot>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref, toRefs, watch } from 'vue'
import { gsap } from 'gsap'
import ScrollSmoother from 'gsap-external-plugins/ScrollSmootherPlugin'
gsap.registerPlugin(ScrollSmoother)

const emit = defineEmits(['stop', 'update'])
const props = defineProps({
    ease: {
        type: [String, Function],
        default: 'expo'
    },
    effects: {
        type: [String, Boolean, Array],
        default: false
    },
    ignoreMobileResize: {
        type: Boolean,
        default: true
    },
    normalizeScroll: {
        type: Boolean,
        default: false
    },
    smooth: {
        type: Number,
        default: .8
    },
    smoothTouch: {
        type: Boolean,
        default: false
    },
    paused: {
        type: Boolean,
        default: false
    }
}) 

const progress = ref(0)
const velocity = ref(0)
const component = ref(null)
const { paused } = toRefs(props)

watch(paused, () => {
    if (window.smoother) {
        window.smoother.paused(paused)
    }
})

onMounted(() => {
    window.smoother = ScrollSmoother.create({
        content: '#smooth-content',
        wrapper: '#smooth-wrapper',
        ease: props.ease,  
        effects: props.effects,
        ignoreMobileResize: props.ignoreMobileResize,
        normalizeScroll: props.normalizeScroll,
        smooth: props.smooth,
        smoothTouch: props.smoothTouch,
        onUpdate: (e) => {
            if (window.smoother) {
                velocity.value = window.smoother.getVelocity()
                if (component.value) {
                    gsap.to(component.value, {
                        [`--velocity-scroll`]: velocity.value,
                        duration: .2
                    })
                }
            }
            progress.value = e.progress
            emit('update', e)
        },
        onStop: (e) => {
            velocity.value = 0
            progress.value = e.progress
            if (component.value) {
                gsap.to(component.value, {
                    [`--velocity-scroll`]: velocity.value,
                    duration: .2
                })
            }
            emit('stop', e)
        }
    })
})

onBeforeUnmount(() => {
    if (window.smoother) {
        window.smoother.kill()
        delete window.smoother
    }
})

</script>