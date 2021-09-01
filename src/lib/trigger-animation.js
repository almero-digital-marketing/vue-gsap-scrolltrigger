import { onBeforeUnmount, onMounted, nextTick, watch, unref, isRef } from 'vue'
import ScrollingObserver from './scrolling-observer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

function triggerAnimation(options, currentInstance) {
    const scrollingObserver = new ScrollingObserver()

    let disposed = false
    let animationRef

    function removeMarkers() {
        if (animationRef && unref(options.markers)) {
            document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(el => {
                if (new RegExp(animationRef.id + '$').test(el.innerHTML)) {
                    el.remove()
                }
            })
        }
    }

    function isReady() {
        if (disposed) return false

        for(let key in options) {
            const option = unref(options[key])
            if (option === null) return false
            
            if (typeof option == 'object' && !(option instanceof Element)) {
                if (Array.isArray(option)) {
                    for(let item of option) {
                        if (!isReady(item)) return false
                    }
                } else {
                    if (!isReady(option)) return false
                }
            }
        }
        return true
    }

    function registerAnimation() {
        if (!isReady()) return
        
        const id = unref(options.name) + '-' + scrollingObserver.animationCounter++
        animationRef = {
            id,
            animation: gsap.timeline({
                id,
                scrollTrigger: {
                    anticipatePin: unref(options.anticipatePin),
                    end: unref(options.end),
                    endTrigger: unref(options.endTrigger),
                    horizontal: unref(options.horizontal),
                    markers: unref(options.markers),
                    pin: unref(options.pin),
                    pinnedContainer: unref(options.pinnedContainer),
                    pinReparent: unref(options.pinReparent),
                    pinSpacing: unref(options.pinSpacing),
                    pinType: unref(options.pinType),
                    refreshPriority: unref(options.refreshPriority),
                    scroller: unref(options.scroller),
                    scrub: unref(options.scrub),
                    snap: unref(options.snap),
                    start: unref(options.start),
                    toggleActions: unref(options.toggleActions),
                    trigger: unref(options.trigger),
                    toggleClass: unref(options.toggleClass),
                    onEnter: unref(options.onEnter), 
                    onEnterBack: unref(options.onEnterBack), 
                    onLeave: unref(options.onEnterBack), 
                    onLeaveBack: unref(options.onLeaveBack), 
                    onUpdate: unref(options.onUpdate), 
                    onScrubComplete: unref(options.onScrubComplete), 
                    onSnapComplete: unref(options.onSnapComplete), 
                    onToggle: unref(options.onToggle), 
                }
            })
        }
        const timeline = unref(options.timeline)
        if (timeline) {
            animationRef.animation.to(unref(options.trigger), { '--progress': 1, ease: unref(options.ease) }, 0)
            if (Array.isArray(timeline)) {
                for(let { target, vars } of timeline) {
                    animationRef.animation.to(unref(target), vars, 0)
                }
            } else {
                let { target, vars } = timeline
                animationRef.animation.to(unref(target), vars, 0)
            }
        }

        if (animationRef.animation.scrollTrigger.scroller != window) {
            animationRef.scrollingElement = animationRef.animation.scrollTrigger.scroller
        } else {
            animationRef.scrollingElement = window.document.scrollingElement
        }
        
        scrollingObserver.observe(animationRef)
    }

    function destroyAnimation() {
        if (animationRef) {
            scrollingObserver.unobserve(animationRef)
            animationRef.animation.scrollTrigger.kill(false)
            animationRef.animation.kill()

            removeMarkers()
        }
        animationRef = null
    }

    async function initAnimation() {
        await nextTick()
        destroyAnimation()
        if (unref(options.enabled)) {
            await registerAnimation()
        }
    }

    if(typeof window !== 'undefined') {
        onBeforeUnmount(() => {
            destroyAnimation()
            disposed = true
        }, currentInstance)

        if(!currentInstance) {
            onMounted(() => {
                initAnimation()
                for(let option in options) {
                    if (isRef(options[option])) {
                        watch(options[option], () => {
                            initAnimation() 
                        })
                    }
                }
            })
        }
    }

    return {
        initAnimation,
        destroyAnimation
    }

}

export default triggerAnimation