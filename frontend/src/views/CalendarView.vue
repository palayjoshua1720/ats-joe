<template>
	<div class="bg-white rounded shadow p-2 sm:p-4 relative h-[100dvh] sm:h-[85vh] overflow-auto dark:bg-gray-800">
		<!-- The calendar -->
		<FullCalendar :options="calendarOptions" ref="fullCalendar" />
		<transition name="modal-fade">
			<div v-if="showDayModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeDayModal">
				<div class="relative flex flex-col sm:flex-row w-[99vw] max-w-[100vw] sm:w-full sm:max-w-2xl mx-auto sm:mx-0 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]"
					@click.stop>
					<!-- Modal -->
					<div class="bg-white rounded shadow-lg w-full min-w-0 sm:min-w-[350px] relative max-h-[80vh] sm:max-h-none overflow-y-auto">
						<!-- Modal header with solid purple background -->
						<div class="w-full flex flex-col items-center justify-center px-2 py-1 bg-purple-500 relative">
							<button class="absolute top-2 right-2 text-2xl font-bold text-white" @click="closeDayModal">×</button>
							<div class="text-xl sm:text-2xl font-bold text-white text-center">
								{{ selectedDate ? selectedDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }) : '' }}
							</div>
							<div class="text-base sm:text-lg text-white text-center">
								{{ selectedDate ? selectedDate.toLocaleString('default', { weekday: 'long' }) : '' }}
							</div>
						</div>
						<div class="p-2 sm:p-6 dark:bg-gray-800">
							<div class="mb-4">
								<div v-if="Object.values(eventsByTimeSlot).every(arr => !arr.length)" class="text-center text-gray-400 mb-4 dark:text-white">
									No schedules for this day.
								</div>
								<div v-else>
									<div v-for="slot in timeSlots" :key="slot" class="mb-1">
										<div class="flex items-center flex-wrap gap-1">
											<div class="w-24 sm:w-36 font-mono text-xs sm:text-sm dark:text-white">{{ slot }}</div>
											<div class="flex-1 flex flex-wrap">
												<template v-if="eventsByTimeSlot[slot] && eventsByTimeSlot[slot].length">
													<span
														v-for="event in eventsByTimeSlot[slot]"
														:key="event.title + event.time"
														:style="{ backgroundColor: event.color }"
														class="flex-1 h-6 text-white flex items-center justify-center text-xs sm:text-base min-w-[60px] max-w-full truncate"
													></span>
												</template>
											</div>
										</div>
										<div class="border-b border-gray-200 mt-1"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Recruiter Legend beside/below the modal -->
					<div v-if="Object.values(eventsByTimeSlot).every(arr => !arr.length)" class="text-center text-gray-400 mb-4 dark:text-gray-800">
						<!-- empty -->
					</div>
					<div v-else>
						<div class="mt-2 sm:mt-0 sm:ml-4 bg-white border rounded p-2 shadow-md w-full sm:w-fit h-fit self-start dark:bg-gray-800">
							<div class="font-bold mb-1 whitespace-nowrap dark:text-white">Recruiter Legend</div>
							<div v-for="legend in recruiterLegend" :key="legend.name" class="flex items-center mb-1">
								<span :style="{ backgroundColor: legend.color }" class="inline-block w-4 h-4 rounded mr-2"></span>
								<span class="text-xs sm:text-base dark:text-white">{{ legend.name }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- Custom Centered Title -->
		<div
			id="custom-calendar-title"
			class="pointer-events-auto relative flex items-center justify-center mt-2 mb-2 sm:mt-0 sm:mb-0"
			ref="titleDropdownRef"
		>
			<span class="font-bold text-purple-600 flex items-center gap-1 sm:gap-2 text-base sm:text-[35px]">
				<span class="relative px-1 sm:px-2 py-1">
					<span class="cursor-pointer" @click="openMonthPicker">{{ months[pickedMonth] }}</span>
					<!-- Month Picker Dropdown -->
					<div v-if="showMonthPicker" class="absolute left-0 top-full z-50 mt-2 shadow p-2 flex flex-col bg-white border rounded text-base w-32 sm:w-auto max-h-60 overflow-y-auto">
						<span
							v-for="(month, idx) in months"
							:key="month"
							class="px-2 py-1 hover:bg-purple-100 cursor-pointer rounded"
							:class="{ 'bg-purple-600 text-white': pickedMonth === idx }"
							@click="selectMonth(idx)"
						>{{ month }}</span>
					</div>
				</span>
				<span class="relative px-1 sm:px-2 py-1">
					<span class="cursor-pointer" @click="openYearDropdown">{{ pickedYear }}</span>
					<!-- Year Dropdown -->
					<div v-if="showYearDropdown" class="absolute left-0 top-full z-50 mt-2 shadow p-2 flex flex-col max-h-48 overflow-y-auto w-24 bg-white border rounded text-base" ref="yearDropdownRef">
						<span
							v-for="year in yearRange"
							:key="year"
							class="px-2 py-3 hover:bg-purple-100 cursor-pointer rounded"
							:class="{ 'bg-purple-600 text-white': pickedYear === year }"
							@click="selectYear(year)"
							:ref="el => setYearItemRef(el, year)"
						>{{ year }}</span>
					</div>
				</span>
			</span>
		</div>
	</div>
</template>

<!-- default -->
<!-- <template>
	<FullCalendar :options="calendarOptions" ref="fullCalendar" />
</template> -->

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, ComponentPublicInstance } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

// Refs
const fullCalendar = ref()
const showMonthPicker = ref(false)
const showYearDropdown = ref(false)
const titleDropdownRef = ref<HTMLElement | null>(null)
const yearDropdownRef = ref<HTMLElement | null>(null)
const yearItemRefs = ref<Record<string, HTMLElement | null>>({})

// Modal state for day popup
const showDayModal = ref(false)
const selectedDate = ref<Date | null>(null)

function handleGlobalClick(event: MouseEvent) {
	if (!showMonthPicker.value && !showYearDropdown.value) return;
	const target = event.target as Node;
	if (titleDropdownRef.value && !titleDropdownRef.value.contains(target)) {
		showMonthPicker.value = false;
		showYearDropdown.value = false;
	}
}
onMounted(() => {
	window.addEventListener('click', handleGlobalClick);
	nextTick(() => {
		const calendarEl = document.querySelector('.fc-header-toolbar');
		const customTitle = document.getElementById('custom-calendar-title');
		if (calendarEl && customTitle) {
			const leftGroup = calendarEl.querySelector('.fc-toolbar-chunk:nth-child(1)');
			const rightGroup = calendarEl.querySelector('.fc-toolbar-chunk:nth-child(3)');
			if (leftGroup && rightGroup) {
				calendarEl.insertBefore(customTitle, rightGroup);
				customTitle.style.position = 'static';
				customTitle.style.transform = 'none';
				if (window.innerWidth >= 640) {
					customTitle.style.margin = '0 28rem';
				} else {
					customTitle.style.margin = '0';
				}
			}
		}
	});
});
onBeforeUnmount(() => {
	window.removeEventListener('click', handleGlobalClick);
});

function setYearItemRef(el: Element | ComponentPublicInstance | null, year: number) {
	if (el && el instanceof HTMLElement) {
		yearItemRefs.value[year.toString()] = el
	}
}

function handleDateClick(info: any) {
	selectedDate.value = info.date
	showDayModal.value = true
}

function handleEventClick(info: any) {
	selectedDate.value = info.event.start;
	showDayModal.value = true;
}

function closeDayModal() {
	showDayModal.value = false
	selectedDate.value = null
}

// Month and Year State
const months = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
]
const now = new Date()
const initialDate = new Date(now.getFullYear(), now.getMonth(), 1);
const pickedMonth = ref(now.getMonth())
const pickedYear = ref(now.getFullYear())
const yearRange = computed(() => {
	const years = []
	for (let y = pickedYear.value - 5; y <= pickedYear.value + 5; y++) {
		years.push(y)
	}
	return years
})

// Time slots for the modal
const timeSlots = [
	'10:00 - 10:30 AM',
	'10:30 - 11:00 AM',
	'11:00 - 11:30 AM',
	'11:30 - 12:00 AM',
	'1:00 - 1:30 PM',
	'1:30 - 2:00 PM',
	'2:00 - 2:30 PM',
	'2:30 - 3:00 PM',
	'3:00 - 3:30 PM',
	'3:30 - 4:00 PM'
];

// Mock events for July 2025 with time slots
const mockEvents = [
	{ title: 'Pao', description: 'Initial Interview (Pao)', start: '2025-07-04', time: '10:00 - 10:30 AM', color: '#1976d2' },
	{ title: 'Hya', description: 'Hands-on Exam (Hya)', start: '2025-07-04', time: '10:00 - 10:30 AM', color: '#00bcd4' },
	{ title: 'Thea', description: 'Hands-on Exam (Thea)', start: '2025-07-10', time: '10:30 - 11:00 AM', color: '#e91e63' },
	{ title: 'Juls', description: 'Initial Interview (Juls)', start: '2025-07-10', time: '11:00 - 11:30 AM', color: '#ff9800' },
	{ title: 'Juls', description: 'Initial Interview (Juls)', start: '2025-07-12', time: '11:30 - 12:00 AM', color: '#ff9800' },
	{ title: 'Pao', description: 'Hands-on Exam (Pao)', start: '2025-07-12', time: '11:30 - 12:00 AM', color: '#1976d2' },
	{ title: 'Mark', description: 'Initial Interview (Mark)', start: '2025-07-12', time: '1:00 - 1:30 PM', color: '#388e3c' },
	{ title: 'Juls', description: 'Hands-on Exam (Juls)', start: '2025-07-12', time: '1:00 - 1:30 PM', color: '#ff9800' },
	{ title: 'Thea', description: 'Final Interview (Thea)', start: '2025-07-23', time: '2:00 - 2:30 PM', color: '#e91e63' },
	{ title: 'Mark', description: 'Final Interview (Mark)', start: '2025-07-23', time: '3:00 - 3:30 PM', color: '#388e3c' },
	{ title: 'Pao', description: 'Final Interview (Pao)', start: '2025-07-30', time: '3:30 - 4:00 PM', color: '#1976d2' },
	{ title: 'Hya', description: 'Final Interview (Hya)', start: '2025-07-31', time: '3:30 - 4:00 PM', color: '#00bcd4' },
];

const eventsByTimeSlot = computed(() => {
	if (!selectedDate.value) return {};
	const yyyy = selectedDate.value.getFullYear();
	const mm = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
	const dd = String(selectedDate.value.getDate()).padStart(2, '0');
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const events = mockEvents.filter(ev => ev.start === dateStr);
	const grouped = {} as Record<string, typeof mockEvents>;
	timeSlots.forEach(slot => {
		grouped[slot] = events.filter(ev => ev.time === slot);
	});
	return grouped;
});

const recruiterLegend = [
	{ name: 'Juls', color: '#ff9800' },
	{ name: 'Pao', color: '#1976d2' },
	{ name: 'Mark', color: '#388e3c' },
	{ name: 'Hya', color: '#00bcd4' },
	{ name: 'Thea', color: '#e91e63' }
];

// Calendar Options
const calendarOptions = {
	plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
	initialView: 'dayGridMonth',
	headerToolbar: {
		left: 'prev,next today',
		center: '',
		// center: 'title',
		right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
	},
	initialDate,
	datesSet(arg: any) {
		const current = arg.view.currentStart;
		pickedMonth.value = current.getMonth();
		pickedYear.value = current.getFullYear();
	},
	height: '100%',
	dayMaxEventRows: true,
	eventColor: '#8661c5',
	eventTextColor: '#fff',
	selectable: false,
	editable: false,
	events: mockEvents,
	dateClick: handleDateClick,
	eventClick: handleEventClick,
	dayCellDidMount(info: any) {
		info.el.style.cursor = 'pointer';
		info.el.onclick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('.fc-more-link')) return;
			selectedDate.value = info.date;
			showDayModal.value = true;
		};
	},
	// hide when not needed
	moreLinkClick(info: any) {
		selectedDate.value = info.date;
		showDayModal.value = true;
		return 'none';
	},
	eventContent: function(arg: any) {
		// Render event as colored bar with text, similar to screenshot
		const bg = arg.event.backgroundColor || arg.event.extendedProps.color || '#8661c5';
		const text = arg.event.extendedProps.description || arg.event.title;
		const style = `background:${bg};color:#fff;border-radius:2px;padding:0 2px;font-size:11px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;margin-bottom:1px;`;
		return { html: `<div style='${style}'>${text}</div>` };
	},
}

// Functions
function selectMonth(idx: number) {
	pickedMonth.value = idx
	showMonthPicker.value = false
	updateCalendarDate()
}
function selectYear(year: number) {
	pickedYear.value = year
	showYearDropdown.value = false
	updateCalendarDate()
}
function updateCalendarDate() {
	const date = new Date(pickedYear.value, pickedMonth.value, 1)
	fullCalendar.value.getApi().gotoDate(date)
}
function openMonthPicker() {
	showYearDropdown.value = false;
	showMonthPicker.value = true;
}
function openYearDropdown() {
	showMonthPicker.value = false;
	showYearDropdown.value = true;
	nextTick(() => {
	// Scroll the current year into view and center it
	const container = yearDropdownRef.value
	const currentYearEl = yearItemRefs.value[pickedYear.value.toString()]
		if (container && currentYearEl) {
			const containerHeight = container.offsetHeight
			const itemOffsetTop = currentYearEl.offsetTop
			const itemHeight = currentYearEl.offsetHeight
			container.scrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2)
		}
	})
}
</script>

<style scoped>
/* Responsive FullCalendar header toolbar and buttons */
@media (max-width: 640px) {
	:deep(.fc-header-toolbar) {
		flex-direction: column !important;
		align-items: stretch !important;
		gap: 0.25rem !important;
	}
	:deep(.fc-toolbar-chunk) {
		justify-content: center !important;
		margin-bottom: 0.25rem !important;
	}
	:deep(.fc-button), :deep(.fc-button-group) {
		font-size: 0.9rem !important;
		padding: 0.25rem 0.5rem !important;
	}
	:deep(.fc .fc-toolbar-title) {
		font-size: 1.1rem !important;
		padding: 0.25rem 0 !important;
	}
	/* Prevent calendar grid horizontal overflow */
	:deep(.fc-view-harness) {
		overflow-x: auto !important;
	}
	#custom-calendar-title {
		margin: 0 !important;
		justify-content: center !important;
		width: 100%;
		display: flex;
	}
}
/* Modal scroll and sizing for mobile */
@media (max-width: 640px) {
	/* Modal container */
	.fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-50 > div {
		max-width: 100vw !important;
		width: 99vw !important;
		padding: 0 !important;
	}
	.bg-white.rounded.shadow-lg {
		max-width: 100vw !important;
		width: 98vw !important;
		border-radius: 0.25rem !important;
	}
}
/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
	transform: scale(0.97) translateY(20px);
}
.modal-fade-enter-to, .modal-fade-leave-from {
	opacity: 1;
	transform: scale(1) translateY(0);
}
</style>