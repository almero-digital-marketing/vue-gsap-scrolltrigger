<template>
	<div class="scroll-trigger" ref="component">
		<slot></slot>
	</div>
</template>
<script>
import { ref, toRefs } from 'vue'
import triggerAnimation from '../lib/trigger-animation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default {
    name: 'ScrollTrigger',
    emits: ['enter', 'enterBack', 'leave', 'leaveBack', 'update', 'scrubComplete', 'snapComplete', 'toggle'],
    props: {
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
            type: [Object],
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
			default: 'fixed'
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
            default: 'play none none none'
        },
        toggleClass: {
            type: [String, Object],
            default: 'active'
        },
        trigger: {
            type: Object
        },
        ease: {
            type: String,
            default: 'none'
        },
        timeline: {
            type: [Array, Object],
            default: []
        }
	},
    setup(props, { emit }) {
        const component = ref(null)
        const options = toRefs(props)

        options.trigger = props.trigger ? options.trigger : component
        Object.assign(options, {
            onEnter: e => emit('enter', e), 
            onEnterBack: e => emit('enterBack', e), 
            onLeave: e => emit('leave', e), 
            onLeaveBack: e => emit('leaveBack', e), 
            onUpdate: e => emit('update', e), 
            onScrubComplete: e => emit('scrubComplete', e), 
            onSnapComplete: e => emit('snapComplete', e), 
            onToggle: e => emit('toggle', e), 
        })

        triggerAnimation(options)

        return {
            component,
        }
    }
}
</script>