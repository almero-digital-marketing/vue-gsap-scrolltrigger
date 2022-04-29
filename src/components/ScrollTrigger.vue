<template>
	<div class="scroll-trigger" ref="component">
		<slot 
        :step="step" 
        :directin="direction" 
        :progress="progress" 
        :isActive="isActive" 
        :distribution="distribution">
        </slot>
	</div>
</template>
<script setup>
import { ref, toRefs, computed } from 'vue'
import triggerAnimation from '../lib/trigger-animation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['enter', 'enterBack', 'leave', 'leaveBack', 'update', 'scrubComplete', 'snapComplete', 'toggle', 'step', 'activate', 'deactivate'])
const props = defineProps({
    name: {
        type: String,
        default: 'TriggerAnimation'
    },
    anticipatePin: {
        type: Number,
        default: 0
    },
    end: {
        type: [String, Number, Function],
        default: 'bottom top'
    },
    endTrigger: {
        type: [String, Object],
    },
    enabled: {
        type: Boolean,
        default: true
    },
    horizontal: {
        type: Boolean,
        default: false
    },
    markers: {
        type: Boolean,
        default: false
    },
    pin: {
        type: [Boolean, Object],
    },
    pinnedContainer: {
        type: Object,
    },
    pinReparent: {
        type: Boolean,
        default: false
    },
    pinSpacing: {
        type: [Boolean, String],
    },
    pinType: {
        type: String,
    },
    scroller: {
        type: Object,
    },
    scrub: {
        type: [Boolean, Number],
        default: false
    },
    snap: {
        type: [Array, Number, Function, Object, String],
    },
    start: {
        type: [String, Number, Function],
        default: 'top bottom'
    },
    toggleActions: {
        type: String,
    },
    toggleClass: {
        type: [String, Object, Boolean],
        default: true
    },
    trigger: {
        type: [String, Object]
    },
    ease: {
        type: String,
        default: 'none'
    },
    timeline: {
        type: [Array, Object],
    },
    steps: {
        type: Number,
        default: 0
    },
    once: {
        type: Boolean,
        default: false
    },
    scope: {
        type: Object
    },
    to: {
        type: [Array, Object],
    },
    from: {
        type: [Array, Object],
    },
    fromTo: {
        type: [Array, Object],
    },
})

const component = ref(null)
const options = toRefs(props)

const step = ref(0)
const isActive = ref(false)
const progress = ref(0)
const direction = ref(0)

const distribution = computed(() => {
    if (!props.steps) return
    let distribution = new Array(props.steps)
    const distributionStep = 1 / props.steps
    for (let index = 0; index < props.steps; index++) {
        distribution[index] = 1 - Math.abs(step.value - index) * distributionStep
    }
    return distribution
})

options.trigger = props.trigger === null ? options.trigger : component
Object.assign(options, {
    onEnter: e => {
        emit('enter', e)
        emit('activate', e)
    }, 
    onEnterBack: e => {
        emit('enterBack', e)
        emit('activate', e)
    }, 
    onLeave: e => {
        emit('leave', e)
        emit('deactivate', e)
    }, 
    onLeaveBack: e => {
        emit('leaveBack', e)
        emit('deactivate', e)
    }, 
    onUpdate: e => {
        progress.value = e.progress
        emit('update', e)
    }, 
    onScrubComplete: e => emit('scrubComplete', e), 
    onSnapComplete: e => emit('snapComplete', e), 
    onToggle: e => {
        isActive.value = e.isActive
        emit('toggle', e)
    }, 
    onStep: e => {
        e.step = step.value = Number(e.step)
        emit('step', e)
    }, 
})

triggerAnimation(options)
</script>