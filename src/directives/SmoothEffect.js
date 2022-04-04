import ScrollSmoother from 'gsap-external-plugins/ScrollSmootherPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import debounce from 'debounce'

window.refreshEffects = debounce(() => {
    console.log('Refresh Effects')
    ScrollTrigger.refresh()
}, 300)

export default {
    mounted(el) {
        // console.log('Mounted', el)
        let effect = {
            speed: el.dataset.speed || 1,
            lag: el.dataset.lag || 0
        }
        el.dataset.effect = JSON.stringify(effect)
        ScrollSmoother.get().effects(el, effect)
        window.refreshEffects()
    },
    updated(el) {
        // console.log('Updated')
        let newEffect = {
            speed: el.dataset.speed || 1,
            lag: el.dataset.lag || 0
        }
        let oldEffect = JSON.parse(el.dataset.effect)
        if (newEffect.speed != oldEffect.speed || newEffect.lag != oldEffect.lag) {
            ScrollSmoother.get().effects(el, newEffect)
            window.refreshEffects()
        }
    }
}