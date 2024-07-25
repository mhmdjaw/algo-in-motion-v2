import type { Variants } from 'framer-motion'

export const svgContainer: Variants = {
  hidden: {
    rotate: -180,
    y: '50%'
  },
  visible: {
    rotate: 0,
    x: ['-50%', '-50%', '-50%', '5%'],
    y: '50%',
    transition: { duration: 2, ease: 'easeInOut' }
  }
}

export const svgContainerMobile: Variants = {
  hidden: {
    rotate: -180
  },
  visible: {
    rotate: 0,
    x: ['-50%', '-50%', '-50%', '-50%'],
    y: ['50%', '50%', '50%', '-5%'],
    transition: { duration: 2, ease: 'easeInOut' }
  }
}

export const logoPath: Variants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fillOpacity: 0
  },
  visible: {
    opacity: 1,
    pathLength: 1.01,
    fillOpacity: 1,
    transition: {
      default: { duration: 2, ease: 'easeInOut' },
      fillOpacity: { duration: 2, ease: [1, 0, 0.8, 1] }
    }
  }
}

export const title: Variants = {
  hidden: {
    y: '100%',
    skewY: 7
  },
  visible: (i: number) => ({
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.5 + i * 0.2,
      delay: 1.5 + i * 0.1
    }
  })
}

export const button: Variants = {
  hidden: {
    scale: 0
  },
  visible: {
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 2.2
    }
  }
}
