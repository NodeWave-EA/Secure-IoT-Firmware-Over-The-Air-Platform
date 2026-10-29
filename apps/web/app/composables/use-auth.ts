import { computed, ref } from 'vue'

export function useAuth() {
  const isAuthenticated = ref(false)
  const user = ref<{ name: string, email: string } | null>(null)

  const login = () => {
    isAuthenticated.value = true
    user.value = { name: 'IoT Engineer', email: 'dev@nodewave.net' }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
  }

  const primaryAction = computed(() => {
    if (isAuthenticated.value) {
      return {
        label: 'Go to Dashboard',
        to: '/dashboard',
        icon: 'i-heroicons-squares-2x2-20-solid',
      }
    }
    return {
      label: 'Get Started',
      to: '/auth/signup',
      icon: 'i-heroicons-arrow-right-20-solid',
    }
  })

  return {
    isAuthenticated,
    user,
    login,
    logout,
    primaryAction,
  }
}
