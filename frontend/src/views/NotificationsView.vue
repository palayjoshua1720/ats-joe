<template>
    <div class="bg-gray-50 min-h-screen rounded py-6 px-2 sm:px-0">
        <!-- Header -->
        <div class="max-w-5xl mx-auto mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 class="text-2xl font-bold">Notifications</h1>
                    <div class="text-gray-500 text-sm flex items-center gap-2">
                        Stay updated with system alerts and important events
                        <span class="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">{{ unreadCount }} unread</span>
                    </div>
                </div>
                <button class="mt-2 sm:mt-0 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded font-semibold text-sm shadow" @click="markAllAsRead" :disabled="unreadCount === 0">Mark All as Read</button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div class="bg-white rounded shadow flex items-center p-4 gap-4">
                    <div class="bg-blue-100 text-blue-500 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="w-6 h-6 text-blue-600 dark:text-blue-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0">

                            </path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500">Total Notifications</div>
                        <div class="font-bold text-lg">{{ filteredNotifications.length }}</div>
                    </div>
                </div>
                <div class="bg-white rounded shadow flex items-center p-4 gap-4">
                    <div class="bg-red-100 text-red-500 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="w-6 h-6 text-red-600 dark:text-red-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500">Unread</div>
                        <div class="font-bold text-lg">{{ unreadCount }}</div>
                    </div>
                </div>
                <div class="bg-white rounded shadow flex items-center p-4 gap-4">
                    <div class="bg-green-100 text-green-500 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="w-6 h-6 text-green-600 dark:text-green-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500">Today</div>
                        <div class="font-bold text-lg">{{ todayCount }}</div>
                    </div>
                </div>
                <div class="bg-white rounded shadow flex items-center p-4 gap-4">
                    <div class="bg-purple-100 text-purple-500 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="w-6 h-6 text-purple-600 dark:text-purple-400"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                        </svg>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500">This Week</div>
                        <div class="font-bold text-lg">{{ weekCount }}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Search and Filters -->
        <div class="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 mb-4">
            <input v-model="search" type="text" placeholder="Search notifications..." class="flex-1 px-4 py-2 rounded border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white shadow-sm text-sm" />
            <select v-model="typeFilter" class="w-full sm:w-40 px-3 py-2 rounded border border-gray-200 bg-white text-sm shadow-sm">
                <option value="">All Types</option>
                <option v-for="type in typeOptions" :key="type" :value="type">{{ type }}</option>
            </select>
            <select v-model="statusFilter" class="w-full sm:w-40 px-3 py-2 rounded border border-gray-200 bg-white text-sm shadow-sm">
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
            </select>
        </div>

        <!-- Notifications List -->
        <div class="max-w-5xl mx-auto space-y-4">
            <div v-for="(notif, i) in filteredNotifications" :key="i" :class="[
            'rounded shadow flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4',
            notif.read ? 'bg-white border-l-4 border-gray-200' :
            i === 0 ? 'bg-blue-50 border-l-4 border-blue-400' :
            i === 1 ? 'bg-green-50 border-l-4 border-green-400' :
            i === 2 ? 'bg-yellow-50 border-l-4 border-yellow-400' :
            i === 3 ? 'bg-purple-50 border-l-4 border-purple-400' :
            i === 4 ? 'bg-orange-50 border-l-4 border-orange-400' :
            'bg-white border-l-4 border-gray-200'
            ]">
            <div class="flex-shrink-0">
                <div :class="[
                'rounded-full p-2',
                i === 0 ? 'bg-blue-100 text-blue-500' :
                i === 1 ? 'bg-green-100 text-green-500' :
                i === 2 ? 'bg-yellow-100 text-yellow-500' :
                i === 3 ? 'bg-purple-100 text-purple-500' :
                i === 4 ? 'bg-orange-100 text-orange-500' :
                'bg-gray-100 text-gray-400'
                ]">
                    <!-- SVG icons as before -->
                    <svg v-if="i === 0" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
                    <svg v-else-if="i === 1" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else-if="i === 2" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
                    <svg v-else-if="i === 3" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    <svg v-else-if="i === 4" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4V7a4 4 0 10-8 0v6a4 4 0 008 0z"/></svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                </div>
            </div>
            <div class="flex-1">
                <div class="font-semibold text-base">{{ notif.title }}</div>
                <div class="text-gray-600 text-sm mb-2">{{ notif.description || notif.time }}</div>
                <div class="flex flex-wrap gap-4 text-xs font-medium">
                    <a href="#" class="text-indigo-600 hover:underline">View Details</a>
                    <a v-if="!notif.read" href="#" class="text-green-600 hover:underline" @click.prevent="markAsRead(i)">Mark as Read</a>
                    <a v-else href="#" class="text-yellow-600 hover:underline" @click.prevent="markAsUnread(i)">Mark as Unread</a>
                    <a href="#" class="text-blue-600 hover:underline">More Info</a>
                </div>
            </div>
            <div class="text-xs text-gray-400 mt-2 sm:mt-0 sm:ml-auto whitespace-nowrap">{{ notif.time }}</div>
            </div>
            <div v-if="filteredNotifications.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">No notifications.</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const notifications = ref([
    { title: 'New applicant submitted a form', description: 'Order ORD-001 has been submitted by St. Mary\'s Hospital', time: '2025-01-27T18:30:00', type: 'Order', read: false },
    { title: 'Invoice Payment Received', description: 'Payment received for invoice INV-2025-001 from St. Mary\'s Hospital', time: '2025-01-27T17:15:00', type: 'Payment', read: false },
    { title: 'Low Inventory Alert', description: 'Graft Matrix Pro - Size M is running low (5 units remaining)', time: '2025-01-27T00:45:00', type: 'Alert', read: false },
    { title: 'IVR Request Approved', description: 'IVR request for John Doe has been approved for MedTech products', time: '2025-01-26T22:20:00', type: 'Approval', read: true },
    { title: 'Usage Log Reminder', description: 'Serial GM002 delivered 3 days ago - usage log pending', time: '2025-01-25T19:00:00', type: 'Reminder', read: true }
])
const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const typeOptions = computed(() => Array.from(new Set(notifications.value.map(n => n.type))))
const filteredNotifications = computed(() => {
    return notifications.value.filter(n => {
        const matchesSearch =
            n.title.toLowerCase().includes(search.value.toLowerCase()) ||
            (n.description && n.description.toLowerCase().includes(search.value.toLowerCase()))
        const matchesType = !typeFilter.value || n.type === typeFilter.value
        const matchesStatus = !statusFilter.value || (statusFilter.value === 'unread' ? !n.read : n.read)
        return matchesSearch && matchesType && matchesStatus
    })
})
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const todayCount = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return notifications.value.filter(n => n.time.slice(0, 10) === today).length
})
const weekCount = computed(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0,0,0,0)
    return notifications.value.filter(n => {
        const d = new Date(n.time)
        return d >= startOfWeek && d <= now
    }).length
})
function markAsRead(i: number) {
    filteredNotifications.value[i].read = true
}
function markAsUnread(i: number) {
    filteredNotifications.value[i].read = false
}
function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
}
</script> 