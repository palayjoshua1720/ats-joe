<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <!-- Loader -->
        <AppLoader v-if="uiStore.isLoading" />
        <!-- Sidebar -->
        <Sidebar v-model:isOpen="isSidebarOpen" />

        <div class="lg:pl-64">
            <!-- Header -->
            <header class="sticky top-0 z-10 flex h-16 flex-shrink-0 dark:bg-gray-800">
                <!-- Mobile Menu Button -->
                <button
                    type="button"
                    class="px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                    @click="toggleSidebar"
                >
                    <span class="sr-only">Open sidebar</span>
                    <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <!-- Header Content -->
                <div class="flex flex-1 justify-between px-4">
                    <div class="flex flex-1">
                    <!-- Add your header content here -->
                    </div>

                    <!-- User Profile Section -->
                    <div class="ml-auto flex items-center md:ml-6">
                        <!-- Notification Bell -->
                        <div class="relative mr-4 flex-shrink-0 hidden md:block">
                            <button
                                type="button"
                                class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative"
                                @click="toggleNotifications"
                            >
                                <span class="sr-only">View notifications</span>
                                <BellAlertIcon class="w-6 h-6 align-middle" />
                                <!-- Notification Badge -->
                                <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{{ unreadCount }}</span>
                            </button>

                            <!-- Notification Dropdown -->
                            <div
                                v-if="isNotificationsOpen"
                                class="absolute right-0 z-20 mt-2 w-65 origin-top-right rounded bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-80"
                            >
                                <div class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <div class="text-xs font-semibold text-gray-700 dark:text-gray-200">Notifications</div>
                                    <button @click="isNotificationsOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-base font-bold focus:outline-none">&times;</button>
                                </div>
                                <div v-for="(notif, i) in bellNotifications" :key="i" class="px-3 py-1.5 border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                                    <div class="flex items-center gap-2 min-h-0">
                                        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block flex-shrink-0"></span>
                                        <!-- <a href="#" class="font-semibold text-purple-600 hover:underline text-xs leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[7rem]">{{ notif.name }}</a> -->
                                        <span class="text-gray-700 dark:text-gray-200 text-xs overflow-hidden text-ellipsis flex-shrink"><a class="font-semibold text-purple-600 hover:underline">{{ notif.name }}</a> is scheduled for Final Interview</span>
                                    </div>
                                    <div class="text-end text-xs text-gray-400 mt-0.5">{{ notif.time }}</div>
                                </div>
                                <div v-if="bellNotifications.length === 0" class="text-right px-3 py-2 text-xs text-gray-500 dark:text-gray-400">No new notifications</div>
                            </div>
                        </div>
                        <!-- User Info beside button -->
                        <div v-if="currentUser" class="flex flex-col items-end mr-2 text-right">
                            <span class="text-xs text-gray-500 dark:text-gray-400 truncate" :title="currentUser?.email">{{ currentUser?.email }}</span>
                            <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" :title="currentUser?.name">{{ currentUser?.name }}</span>
                        </div>
                        <!-- Profile Dropdown -->
                        <div class="relative ml-3">
                            <div>
                                <button
                                    type="button"
                                    class="flex max-w-xs items-center rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    @click="toggleProfile"
                                >
                                    <span class="sr-only">Open user menu</span>
                                    <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                    {{ userInitials }}
                                    </div>
                                </button>
                            </div>
                            
                            <!-- Profile Dropdown Menu -->
                            <div
                            v-if="isProfileOpen"
                            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            >
                                <!-- Mobile Only: Notifications -->
                                <button
                                    type="button"
                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 md:hidden"
                                    @click="goToNotifications"
                                >
                                    <div class="flex items-center">
                                        <BellAlertIcon class="mr-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                                        <span class="truncate">Notifications</span>
                                        <span v-if="unreadCount > 0" class="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{{ unreadCount }}</span>
                                    </div>
                                </button>
                                <!-- Theme Toggle -->
                                <!-- <button
                                    type="button"
                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                                    @click="toggleTheme"
                                >
                                    <div class="flex items-center">
                                        <span class="mr-3 text-lg flex-shrink-0">{{ isDarkMode ? '🌞' : '🌙' }}</span>
                                        <span class="truncate">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
                                    </div>
                                </button> -->

                                <!-- Logout Button -->
                                <button
                                    type="button"
                                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    @click="handleLogout"
                                    :disabled="isLoading"
                                >
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-3 h-5 w-5 flex-shrink-0">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                        </svg>
                                        <span class="truncate">{{ isLoading ? 'Logging out...' : 'Sign out' }}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="py-6">
                <div class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                    <router-view></router-view>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'
import { useClickOutside } from '@/composables/ui/useClickOutside'
import { useUser } from '@/composables/auth/useUser'
import { useLogin } from '@/composables/auth/useLogin'
import Sidebar from './Sidebar.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import { BellAlertIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

// Store Instances
const authStore = useAuthStore()
const themeStore = useThemeStore()
const uiStore = useUiStore()
const { userInitials } = useUser()
const { handleLogout } = useLogin()
const router = useRouter()

// State
const isProfileOpen = ref(false)
const isSidebarOpen = ref(false)
const isNotificationsOpen = ref(false)
const notifications = ref([
  { title: 'New applicant submitted a form', time: '2 minutes ago' },
  { title: 'Interview scheduled for John Doe', time: '1 hour ago' },
  { title: 'System update completed', time: 'Yesterday' }
])
const unreadCount = computed(() => notifications.value.length)
const bellNotifications = ref([
  { name: 'John Michael Smith', time: 'A few seconds ago' },
  { name: 'Mary Elizabeth Johnson', time: '45 Minutes Ago' },
  { name: 'Patricia Anne Thompson', time: '45 Minutes Ago' }
])

// Computed Properties
const currentUser = computed(() => authStore.currentUser)
const isLoading = computed(() => authStore.isLoading)
const isDarkMode = computed(() => themeStore.isDarkMode)

// Methods
const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value
}

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const toggleTheme = () => {
    themeStore.toggleTheme()
}

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) isProfileOpen.value = false
}

function goToNotifications() {
  isProfileOpen.value = false
  router.push('/notifications')
}

// Lifecycle Hooks
const { handleClickOutside } = useClickOutside(isProfileOpen)

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script> 