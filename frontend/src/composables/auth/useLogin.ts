import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import api from '@/services/api' // Axios instance

export function useLogin() {
	const router = useRouter()
	const route = useRoute()
	const authStore = useAuthStore()
	const uiStore = useUiStore()

	const email = ref('')
	const password = ref('')
	const keycode = ref('')
	const loading = ref(false)
	const error = ref('')
	const loginPending = ref(false) // controls which form to show

	const tempToken = ref('') // store token until keycode validated

	// Step 1: Login
	const handleLogin = async () => {
		loading.value = true
		error.value = ''
		try {
			if (!email.value.trim() || !password.value.trim()) {
				throw new Error('Please enter both email and password.')
			}

			const response = await api.post('/auth/login', {
				email: email.value,
				password: password.value
			})

			// Save token temporarily, don't store in localStorage yet
			tempToken.value = response.data.access_token
			authStore.user = response.data.user

			// Show keycode form
			loginPending.value = true
		} catch (err: any) {
			console.error('Login failed:', err)
			error.value = err.response?.data?.message || err.message || 'Login failed. Please try again.'
		} finally {
			loading.value = false
		}
	}

	// Step 2: Verify Keycode
	const handleKeycode = async () => {
		loading.value = true
		error.value = ''
		try {
			if (!keycode.value.trim()) {
				throw new Error('Please enter the keycode.')
			}

			const response = await api.post('/auth/keycode', {
				keycode: keycode.value
			})

			// Laravel backend returns { verified: true/false, message: "..." }
			if (response.data.verified) {
				// Save token permanently
				localStorage.setItem('token', tempToken.value)
				authStore.token = tempToken.value

				const redirectPath = (route.query.redirect as string) || '/applicant-directory/new-applicants'
				await router.push(redirectPath)
			} else {
				error.value = response.data.message || 'Invalid keycode'
			}
		} catch (err: any) {
			console.error('Keycode verification failed:', err)
			error.value = err.response?.data?.message || err.message || 'Keycode verification failed.'
		} finally {
			loading.value = false
		}
	}

	const handleLogout = async () => {
		uiStore.setLoading(true) // keep consistent with the UI loader
		try {
			await api.post('/auth/logout', {}, {
				headers: {
					Authorization: `Bearer ${authStore.token || localStorage.getItem('token')}`
				}
			})

			localStorage.clear()
			authStore.user = null
			authStore.token = ''
			email.value = ''
			password.value = ''
			keycode.value = ''

			await router.push({ name: 'login' })
		} catch (err) {
			console.error('Logout failed:', err)
		} finally {
			uiStore.setLoading(false)
		}
	}


	return {
		email,
		password,
		keycode,
		loading,
		error,
		loginPending,
		handleLogin,
		handleKeycode,
		handleLogout
	}
}
