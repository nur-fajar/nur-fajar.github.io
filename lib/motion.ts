export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const stagger = (staggerChildren = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren } },
})
