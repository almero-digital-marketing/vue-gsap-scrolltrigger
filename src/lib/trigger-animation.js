import { onBeforeUnmount, onMounted, nextTick, watch, unref, isRef } from 'vue'
import ScrollingObserver from './scrolling-observer'
import { gsap, SteppedEase } from 'gsap'
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

    function registerAnimation() {
        if (disposed || unref(options.enabled) === false) return

        const name = unref(options.name) || 'animation'
        const id = name + '-' + scrollingObserver.animationCounter++

        let toggleClass = unref(options.toggleClass)
        if (toggleClass) {
            if (toggleClass.targets) {
                let className = unref(toggleClass.className)
                let targets = unref(toggleClass.targets)
                if (Array.isArray(targets)) {
                    targets = targets.map(unref)
                }
                toggleClass = {
                    className,
                    targets
                }
            } else if (typeof toggleClass == 'boolean') {
                toggleClass = `active-${ name }`
            }
        }

        animationRef = {
            id,
            animation: gsap.timeline({
                id,
                scrollTrigger: {
                    anticipatePin: unref(options.anticipatePin),
                    end: unref(options.end),
                    endTrigger: unref(options.endTrigger),
                    horizontal: unref(options.horizontal) || false,
                    markers: unref(options.markers),
                    pin: unref(options.pin),
                    pinnedContainer: unref(options.pinnedContainer),
                    pinReparent: unref(options.pinReparent),
                    pinSpacing: unref(options.pinSpacing),
                    pinType: unref(options.pinType) || 'fixed',
                    refreshPriority: unref(options.refreshPriority),
                    scroller: unref(options.scroller),
                    scrub: unref(options.scrub) || unref(options.steps > 0),
                    snap: unref(options.snap),
                    start: unref(options.start),
                    toggleActions: unref(options.toggleActions) || 'play none none none',
                    trigger: unref(options.trigger),
                    toggleClass,
                    once: unref(options.once),
                    onEnter: unref(options.onEnter), 
                    onEnterBack: unref(options.onEnterBack), 
                    onLeave: unref(options.onLeave), 
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
            if (Array.isArray(timeline)) {
                for(let { target, vars, position } of timeline) {
                    animationRef.animation.to(unref(target) || unref(options.trigger), vars, position)
                }
            } else {
                let { target, vars, position } = timeline
                animationRef.animation.to(unref(target) || unref(options.trigger), vars, position)
            }
        }
        if (unref(options.scrub)) {
            unref(options.trigger).style.setProperty(`--progress-${ name }`, 0)
            animationRef.animation.to(unref(options.trigger), { 
                [`--progress-${ name }`]: 1, 
                ease: unref(options.ease) 
            }, 0)
        }
        if (unref(options.steps)) {
            let lastStep = 0
            unref(options.trigger).style.setProperty(`--step-${ name }`, 0)
            animationRef.animation.to(unref(options.trigger), { 
                [`--step-${ name }`]: unref(options.steps) - 1, 
                ease: SteppedEase.config(unref(options.steps) - 1), 
                onUpdate: () => {
                    if (unref(options.onStep)) {
                        const step = unref(options.trigger).style.getPropertyValue(`--step-${ name }`)
                        if (step != lastStep) {
                            unref(options.onStep)({ step })
                            lastStep = step
                        }
                    }
                }, 
            }, 0)
        }
        
        if (animationRef.animation.scrollTrigger.scroller != window) {
            animationRef.scrollingElement = animationRef.animation.scrollTrigger.scroller
        } else {
            animationRef.scrollingElement = window.document.scrollingElement
        }
        
        scrollingObserver.observe(animationRef)

        if (unref(options.onAnimation)) unref(options.onAnimation)(animationRef)
    }

    function destroyAnimation() {
        if (animationRef) {
            scrollingObserver.unobserve(animationRef)
            animationRef.animation.scrollTrigger.kill()
            animationRef.animation.kill()
            animationRef.animation = null
            removeMarkers()
        }
        animationRef = null
    }

    async function initAnimation() {
        // console.log('Init Animation', options.trigger)
        destroyAnimation()
        await nextTick()
        await registerAnimation()
    }

    if(typeof window !== 'undefined') {
        onBeforeUnmount(() => {
            destroyAnimation()
            disposed = true
        }, currentInstance)

        if(!currentInstance) {
            onMounted(async () => {
                await initAnimation()
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