<template>
	<div class="min-h-screen flex">
		<!-- Left: Forms -->
		<div class="flex flex-col justify-center w-full md:w-1/2 px-8 py-12" style="background: linear-gradient(135deg, #c471f5 0%, #8360c3 100%);">
			<div class="max-w-md w-full mx-auto">

				<!-- Step 1: Login Form -->
				<form v-if="!loginPending" @submit.prevent="handleLogin" class="space-y-6">
					<div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
						<p class="font-bold">Error</p>
						<p>{{ error }}</p>
					</div>

					<div class="text-center mb-6">
						<h2 class="text-3xl font-bold text-white">Please login to proceed</h2>
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="block text-white mb-2">Email</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<UserIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input id="email" v-model="email" required type="text"
								class="block w-full pl-10 pr-3 py-2 rounded bg-white border border-white border-opacity-30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-gray-50 transition"
								placeholder="Enter your email" autocomplete="email" />
						</div>
					</div>

					<!-- Password -->
					<div>
						<label for="password" class="block text-white mb-2">Password</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<LockClosedIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input id="password" v-model="password" required type="password"
								class="block w-full pl-10 pr-3 py-2 rounded bg-white border border-white border-opacity-30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-gray-50 transition"
								placeholder="Enter your password" autocomplete="current-password" />
						</div>
					</div>

					<!-- Remember Me -->
					<div class="flex items-center mb-2">
						<input id="remember-me" v-model="rememberMe" type="checkbox"
							class="h-4 w-4 text-white bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-white" />
						<label for="remember-me" class="ml-2 text-white text-sm">Keep me logged in</label>
					</div>

					<!-- Sign In Button -->
					<button type="submit" :disabled="loading"
						class="w-full py-2 rounded bg-white bg-opacity-40 text-white font-semibold text-lg transition hover:bg-opacity-60 disabled:opacity-50">
						{{ loading ? 'Signing in...' : 'Sign In' }}
					</button>
				</form>

				<!-- Step 2: Keycode Form -->
				<form v-else @submit.prevent="handleKeycode" class="space-y-6">
					<div v-if="!error" class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
						<svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
						<p>Please enter keycode</p>
					</div>
					<div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
						<p class="font-bold">Error</p>
						<p>{{ error }}</p>
					</div>

					<div>
						<label for="Keycode" class="block text-white mb-2">Keycode</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<KeyIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input id="keycode" v-model="keycode" required type="text"
								class="block w-full pl-10 pr-3 py-2 rounded bg-white border border-white border-opacity-30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-gray-50 transition"
								placeholder="Enter keycode" autocomplete="off" />
						</div>
					</div>

					<button type="submit" :disabled="loading"
						class="w-full py-2 rounded bg-white bg-opacity-40 text-white font-semibold text-lg transition hover:bg-opacity-60 disabled:opacity-50">
						{{ loading ? 'Verifying...' : 'Submit' }}
					</button>
				</form>

			</div>
		</div>

		<!-- Right: Logo Area -->
		<div class="hidden md:flex flex-col justify-center items-center w-1/2 bg-white dark:bg-gray-800">
			<div class="flex flex-col items-center">
				<div class="h-[100%] w-[100%] flex items-center justify-center flex-shrink-0">
					<img src="@/assets/sample-logo.png" alt="Logo" class="h-[100%] w-[100%] object-contain" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTitle } from '@/composables/ui/useTitle'
import { useLogin } from '@/composables/auth/useLogin'
import { UserIcon, LockClosedIcon, KeyIcon } from '@heroicons/vue/24/solid'

const appTitle = computed(() => process.env.VUE_APP_TITLE || 'SP Team Template')
useTitle(`${appTitle.value} - Login`)

const { email, password, keycode, loading, error, loginPending, handleLogin, handleKeycode } = useLogin()
const rememberMe = ref(false)
</script>
