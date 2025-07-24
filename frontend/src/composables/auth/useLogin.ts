/**
 * useLogin Composable
 * 
 * A composable that handles user authentication functionality including login and logout.
 * It manages the login form state, handles form submission, and provides error handling.
 * 
 * Features:
 * - Form state management (email, password)
 * - Login form submission with validation
 * - Error handling and loading states
 * - Logout functionality
 * - Automatic redirection after successful login
 * 
 * @returns {Object} An object containing form state, loading state, error state, and auth methods
 */

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

export function useLogin() {
	const router = useRouter()
	const route = useRoute()
	const authStore = useAuthStore()
	const uiStore = useUiStore()

	const email = ref('')
	const password = ref('')
	const keycode = ref('')
	const loginPending = ref(false)
	const loading = ref(false)
	const error = ref('')

	const handleLogin = async () => {
		try {
			loading.value = true
			error.value = ''

			// Validate input
			if (!email.value || !password.value) {
				throw new Error('Please enter both email and password')
			}

			// TODO: Replace mock login with actual authentication when ready
			// Original authentication code (commented out for future reference):
			/*
			await authStore.login({
				email: email.value,
				password: password.value
			})
			*/

			await new Promise(resolve => setTimeout(resolve, 1000));

			loginPending.value = true;

		} catch (err) {
			error.value = err instanceof Error ? err.message : 'An error occurred during login'
		} finally {
			loading.value = false
		}
	}

	const handleKeycode = async () => {
		// Validate keycode input
		try {
			loading.value = true
			error.value = ''
			
			if (!keycode.value) {
				throw new Error('Please enter keycode')
			}

			const mockKeycode = '12345678'

			if (keycode.value == mockKeycode) {

				// Mock successful login
				const mockUser = {
					id: 1,
					email: email.value,
					name: email.value.split('@')[0]
				}

				// Set mock user in store
				authStore.user = mockUser
				authStore.token = 'mock-token'
				localStorage.setItem('token', 'mock-token')
				localStorage.setItem('mock-email', email.value)
				localStorage.setItem('user_type', 'admin')

				await new Promise(resolve => setTimeout(resolve, 2500));

				const redirectPath = route.query.redirect as string || '/applicant-directory/new-applicants'
				await router.push(redirectPath)
			} else {
				throw new Error('Invalid keycode')
			}

		} catch (err) {
			error.value = err instanceof Error ? err.message : 'An error occurred during login'
		} finally {
			loading.value = false
		}
	}


	async function handleLogout() {
		uiStore.setLoading(true)
		try {
			await authStore.logout()
			// Simulate network delay
			await new Promise(resolve => setTimeout(resolve, 1000))
			router.push({ name: 'login' })
		} catch (error) {
			console.error('Logout failed:', error)
		} finally {
			uiStore.setLoading(false)
		}
	}

	return {
		email,
		password,
		keycode,
		loginPending,
		loading,
		error,
		handleLogin,
		handleLogout,
		handleKeycode
	}
} 