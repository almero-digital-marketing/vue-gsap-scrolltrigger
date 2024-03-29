import debounce from 'debounce'

class ScrollingObserver {
    constructor() {
        if (!ScrollingObserver.instance) {
            ScrollingObserver.instance = this

            this.resizeMap = new Map()
            this.animationCounter = 1

            if(typeof window !== 'undefined') {
                this.resizeObserver = new ResizeObserver(debounce(this.refresh, 100))
            }
        }

        return ScrollingObserver.instance
    }
    observe(animationRef) {
        if (!this.resizeMap.has(animationRef.scrollingElement)) {
            this.resizeMap.set(animationRef.scrollingElement, [])
            this.resizeObserver.observe(animationRef.scrollingElement)
        }
         
        const animationRefs = this.resizeMap.get(animationRef.scrollingElement)
        animationRefs.push(animationRef)
    }
    unobserve(animationRef) {
        const animationRefs = this.resizeMap.get(animationRef.scrollingElement)
        if (animationRefs) {
            const index = animationRefs.indexOf(animationRef)
            animationRefs.splice(index, 1)
            if (animationRefs.length == 0) {
                this.resizeMap.delete(animationRef.scrollingElement)
                this.resizeObserver.unobserve(animationRef.scrollingElement)
            }
        }
    }
    refresh(entries) {
        for (let entry of entries) {
            const animationRefs = ScrollingObserver.instance.resizeMap.get(entry.target)
            if (animationRefs) {
                for (let animationRef of animationRefs) {
                    console.log('Animation resize:', animationRef.id)
                    this.animationCounter++
                    animationRef.animation.scrollTrigger?.refresh(true)
                }
            }
        }
    }
}

export default ScrollingObserver