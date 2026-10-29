import { computed, nextTick } from 'vue'

export type ThemeState = 'system' | 'light' | 'dark'

export function useTheme() {
  const colorMode = useColorMode()

  // Smooth theme transition using browser View Transitions API
  const triggerTransition = (updateThemeFn: () => void) => {
    if (!import.meta.client || !document.startViewTransition) {
      updateThemeFn()
      return
    }

    const transitions = ['circle-clip', 'fade-scale', 'wipe-right']
    const chosen = transitions[Math.floor(Math.random() * transitions.length)]

    document.documentElement.dataset.themeTransition = chosen

    // Await Vue DOM flush so class updates (.dark / .light) are rendered into the snapshot
    const transition = document.startViewTransition(async () => {
      updateThemeFn()
      await nextTick()
    })

    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeTransition
    })
  }

  const currentTheme = computed<ThemeState>({
    get: () => (colorMode.preference as ThemeState) || 'system',
    set: (val: ThemeState) => {
      if (colorMode.preference === val)
        return
      triggerTransition(() => {
        colorMode.preference = val
      })
    },
  })

  const cycleTheme = () => {
    const states: ThemeState[] = ['system', 'light', 'dark']
    const nextIndex = (states.indexOf(currentTheme.value) + 1) % states.length
    currentTheme.value = states[nextIndex]
  }

  // Keyboard shortcut listener: Ctrl+Shift+T or Cmd+Shift+T
  onKeyStroke(['t', 'T'], (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      cycleTheme()
    }
  })

  const themeIcon = computed(() => {
    switch (currentTheme.value) {
      case 'light':
        return 'i-line-md-sun-rising-filled-loop'
      case 'dark':
        return 'i-line-md-moon-rising-filled-loop'
      default:
        return 'i-line-md-monitor-twotone'
    }
  })

  const themeLabel = computed(() => {
    switch (currentTheme.value) {
      case 'light':
        return 'Light Mode'
      case 'dark':
        return 'Dark Mode'
      default:
        return 'System Theme'
    }
  })

  return {
    currentTheme,
    cycleTheme,
    themeIcon,
    themeLabel,
  }
}
