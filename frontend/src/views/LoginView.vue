<template>
	<div class="min-h-screen flex">
		<!-- Left: Login Form -->
		<div class="flex flex-col justify-center w-full md:w-1/2 px-8 py-12" style="background: linear-gradient(135deg, #c471f5 0%, #8360c3 100%);">
			<div class="max-w-md w-full mx-auto">
				<form @submit.prevent="handleLogin" class="space-y-6">
					<!-- Username -->
					<div>
						<label for="username" class="block text-white mb-2">Username</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<UserIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input
							id="username"
							name="username"
							type="text"
							v-model="email"
							required
							class="block w-full pl-10 pr-3 py-2 rounded bg-white border border-white border-opacity-30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-gray-50 transition"
							placeholder="Enter your username"
							autocomplete="username"
							/>
						</div>
					</div>

					<!-- Password -->
					<div>
						<label for="password" class="block text-white mb-2">Password</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<LockClosedIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input
							id="password"
							name="password"
							type="password"
							v-model="password"
							required
							class="block w-full pl-10 pr-3 py-2 rounded bg-white border border-white border-opacity-30 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:bg-gray-50 transition"
							placeholder="Enter your password"
							autocomplete="current-password"
							/>
						</div>
					</div>

					<!-- Remember Me -->
					<div class="flex items-center mb-2">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							v-model="rememberMe"
							class="h-4 w-4 text-white bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-white"
						/>
						<label for="remember-me" class="ml-2 text-white text-sm">Keep me logged in</label>
					</div>

					<!-- Error Message -->
					<div v-if="error" class="rounded bg-white bg-opacity-20 p-3 text-white text-sm">
						{{ error }}
					</div>

					<!-- Sign In Button -->
					<button type="submit" :disabled="loading" class="w-full py-2 rounded bg-white bg-opacity-40 text-white font-semibold text-lg transition hover:bg-opacity-60 disabled:opacity-50">
						{{ loading ? 'Signing in...' : 'Sign In' }}
					</button>
				</form>
			</div>
		</div>
		
		<!-- Right: Logo Area -->
		<div class="hidden md:flex flex-col justify-center items-center w-1/2 bg-white">
			<div class="flex flex-col items-center">
				<!-- Use current logo -->
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
import { UserIcon, LockClosedIcon } from '@heroicons/vue/24/solid'

const appTitle = computed(() => process.env.VUE_APP_TITLE || 'SP Team Template')

useTitle(`${appTitle.value} - Login`)

const { email, password, loading, error, handleLogin } = useLogin()
const rememberMe = ref(false)
</script> 