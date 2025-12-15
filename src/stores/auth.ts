import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
    id: string
    email: string
    name: string
    role: 'USER' | 'ADMIN'
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    function login(userData: User, authToken: string) {
        user.value = userData
        token.value = authToken
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', userData.role)
        localStorage.setItem('token', authToken)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userRole')
        localStorage.removeItem('token')
    }

    function loadFromStorage() {
        const storedToken = localStorage.getItem('token')
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

        if (storedToken && isLoggedIn) {
            token.value = storedToken
            // TODO: Fetch user data from API using token
        }
    }

    return {
        user,
        token,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        loadFromStorage
    }
})
