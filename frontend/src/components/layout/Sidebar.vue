<template>
    <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-[rgb(196,113,245)] to-[rgb(131,96,195)] shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
    >
        <div class="flex flex-col h-full">
            <!-- Logo Section -->
            <div class="flex items-center justify-center h-16 border-b border-gray-200 py-12">
                <div class="flex items-center justify-center space-x-2 px-2 w-full">
                    <div class="h-[100%] w-[100%] flex items-center justify-center flex-shrink-0">
                        <img src="@/assets/sample-logo.png" alt="Logo" class="h-[100%] w-[100%] object-contain" />
                    </div>
                    <!-- <h1 class="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary-text to-primary-text/80 dark:from-primary-dark-text dark:to-primary-dark-text/80 bg-clip-text text-transparent break-words text-center">
                        {{ appTitle }}
                    </h1> -->
                </div>
            </div>

            <!-- Navigation Section -->
            <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
                <div v-for="item in navigation" :key="item.to">
                    <!-- Applicant Directory (with children) -->
                    <template v-if="item.children && item.children.length">
                        <div
                            class="group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden cursor-pointer"
                            :class="[
                                (isParentActive(item) || isParentHovered === item.to) ? 'bg-white text-[#8661c5] border-l-[3px] border-[#8560c4]' : 'text-white',
                                'hover:bg-white hover:text-[#8661c5]'
                            ]"
                            @mouseenter="isParentHovered = item.to"
                            @mouseleave="isParentHovered = null"
                            @click="toggleParent(item.to); onTabClick(item.name)"
                        >
                            <component
                                :is="item.icon"
                                class="w-5 h-5 flex-shrink-0 transition-all duration-200"
                                :class="(isParentActive(item) || isParentHovered === item.to) ? 'text-[#8661c5]' : 'text-white'"
                            />
                            <span
                                class="ml-3 text-sm font-medium whitespace-normal break-words"
                                :class="(isParentActive(item) || isParentHovered === item.to) ? 'text-[#8661c5]' : 'text-white'"
                            >
                                {{ item.name }}
                            </span>
                            <svg
                                :class="['ml-auto h-4 w-4 transition-transform', expandedParent === item.to ? 'rotate-90' : '']"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <!-- Children tabs -->
                        <transition name="sidebar-children" mode="out-in">
                            <div v-if="expandedParent === item.to" class="pl-8 space-y-1">
                                <router-link
                                    v-for="child in item.children"
                                    :key="child.to"
                                    :to="child.to"
                                    class="flex items-center px-3 py-2 rounded-lg transition-all duration-200 mt-2"
                                    :class="
                                        isActive(child.to)
                                        ? 'bg-white text-[#8661c5] border-l-[3px] border-[#8560c4]'
                                        : (activePhase === child.name && !item.children.some(c => isActive(c.to)))
                                            ? 'bg-white text-[#8661c5]'
                                            : 'text-white hover:bg-white/10'
                                    "
                                    @click="onTabClick(child.name)"
                                >
                                    <span class="text-sm font-medium whitespace-normal break-words">{{ child.name }}</span>
                                </router-link>
                            </div>
                        </transition>
                    </template>
                    <!-- Regular nav items -->
                    <template v-else>
                        <router-link
                            :to="item.to"
                            class="group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden"
                            :class="activePhase === item.name ? 'bg-white text-[#8661c5] border-l-[3px] border-[#8560c4]' : 'text-white hover:text-[#8661c5] hover:bg-white'"
                            @click="onTabClick(item.name)"
                        >
                            <component
                                :is="item.icon"
                                class="w-5 h-5 flex-shrink-0 transition-all duration-200"
                                :class="activePhase === item.name ? 'text-[#8661c5]' : 'text-white group-hover:text-[#8661c5]'"
                            />
                            <span
                                class="ml-3 text-sm font-medium whitespace-normal break-words relative inline-block"
                                :class="activePhase === item.name ? 'text-[#8661c5]' : 'text-white group-hover:text-[#8661c5]'"
                            >
                                {{ item.name }}
                                <span
                                    v-if="item.name === 'Applicants' && applicantCount > 0"
                                    class="absolute -top-2 -right-5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                                >
                                    {{ applicantCount }}
                                </span>
                            </span>
                        </router-link>
                    </template>
                </div>
            </nav>

            <!-- Footer Section -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-center space-x-2 text-xs text-white">
                    <span>© {{ new Date().getFullYear() }}</span>
                    <span class="w-1 h-1 rounded-full bg-secondary-bg dark:bg-secondary-dark-bg"></span>
                    <span>Developed by Sir Joe</span>
                </div>
            </div>
        </div>
    </aside>

    <!-- Mobile Overlay -->
    <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    @click="toggleSidebar"
    >
    </div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

interface NavigationChild {
  to: string
  name: string
}
interface NavigationItem {
  to: string
  name: string
  icon?: any
  children?: NavigationChild[]
}

// Props & Emits
const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
}>()

// Composables
const expandedParent = ref<string | null>(null)
const isParentHovered = ref<string | null>(null)
const route = useRoute()
const router = useRouter()

// Computed Properties
const appTitle = computed(() => process.env.VUE_APP_TITLE || 'SP Team Template')
// Build navigation from router.options.routes
const navigation = computed(() => {
  const layoutRoute = router.options.routes.find((r: any) => r.path === '/')
  if (!layoutRoute?.children) return []
  return layoutRoute.children
    // .filter((r: any) => r.meta?.requiresAuth && r.name !== 'not-found' && r.name !== 'home' && r.name !== 'about')
    .filter((r: any) => r.meta?.requiresAuth && !r.meta?.hidden && r.name !== 'not-found' && r.name !== 'home' && r.name !== 'about')
    .map((r: any) => ({
      name: r.meta?.title || r.name,
      to: `/${r.path}`,
      icon: r.meta?.icon,
      children: (r.children || []).map((c: any) => ({
        name: c.meta?.title || c.name,
        to: `/${r.path}/${c.path}`
      }))
    }))
})

// Methods
function toggleSidebar() {
    emit('update:isOpen', !props.isOpen)
}

function toggleParent(parentTo: string) {
    expandedParent.value = expandedParent.value === parentTo ? null : parentTo
}
function isActive(to: string) {
    return route.path === to || route.path.startsWith(to + '/')
}
function isParentActive(item: any) {
    // Active if parent or any child is active
    if (isActive(item.to)) return true
    if (item.children && Array.isArray(item.children)) {
        return item.children.some((child: any) => isActive(child.to))
    }
    return false
}

function expandParentForCurrentRoute() {
    const parent = navigation.value.find((item: any) => {
        if (!item.children) return false
        return item.children.some((child: any) => isActive(child.to))
    })
    if (parent) {
        expandedParent.value = parent.to
    }
}

const appStore = useAppStore()
const { activePhase } = storeToRefs(appStore)
const applicantCount = ref(3);

function onTabClick(phase: string) {
  appStore.setActivePhase(phase)
}

onMounted(() => {
    expandParentForCurrentRoute()
})

watch([() => route.path, activePhase], ([newPath, newPhase]) => {
    // If the expanded parent is open, but the route is not under it, collapse it
    if (expandedParent.value) {
        const parent = navigation.value.find((item: any) => item.to === expandedParent.value)
        if (parent && !(newPath === parent.to || newPath.startsWith(parent.to + '/'))) {
            expandedParent.value = null
        }
    }
    // Expand parent if on a child route
    expandParentForCurrentRoute()
    // --- NEW: Expand parent if activePhase matches a sidebar tab ---
    if (newPhase) {
      const parent = navigation.value.find((item: any) => item.name === newPhase)
      if (parent) {
        expandedParent.value = parent.to
      }
    }
})
</script>

<style scoped>
.sidebar-children-enter-active, .sidebar-children-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}
.sidebar-children-enter-from, .sidebar-children-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
}
.sidebar-children-enter-to, .sidebar-children-leave-from {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
}
</style> 1