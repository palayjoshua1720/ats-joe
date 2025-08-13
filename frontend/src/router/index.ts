import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import ApplicantDirectoryLayout from '@/views/ApplicantDirectoryLayout.vue'
import NewApplicantsView from '@/views/NewApplicantsView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import DocumentTextIcon from '@heroicons/vue/24/outline/DocumentTextIcon.js'
import ChartBarIcon from '@heroicons/vue/24/outline/ChartBarIcon.js'
import CalendarDaysIcon from '@heroicons/vue/24/outline/CalendarDaysIcon.js'
import FolderOpenIcon from '@heroicons/vue/24/outline/FolderOpenIcon.js'
import CheckCircleIcon from '@heroicons/vue/24/outline/CheckCircleIcon.js'
import CheckCircleIconSolid from '@heroicons/vue/24/solid/CheckCircleIcon.js'
import PoolingApplicantsView from '@/views/PoolingApplicantsView.vue'
import ShortlistedApplicantsView from '@/views/ShortlistedApplicantsView.vue'
import HandsOnApplicantsView from '@/views/HandsOnApplicantsView.vue'
import FinalInterviewApplicantsView from '@/views/FinalInterviewApplicantsView.vue'
import JobOfferApplicantsView from '@/views/JobOfferApplicantsView.vue'
import HiredApplicantsView from '@/views/HiredApplicantsView.vue'
import NewApplicantDetailsView from '@/views/NewApplicantDetailsView.vue'
import HiringProcessView from '@/views/HiringProcessView.vue'
import PETDatabaseView from '@/views/PETDatabaseView.vue'
import ApplicantDashboardView from '@/views/ApplicantDashboardView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import CalendarView from '@/views/CalendarView.vue'
import JobOfferApplicantDetailsView from '@/views/JobOfferApplicantDetailsView.vue'
import ApplicantsView from '@/views/ApplicantsView.vue'
import PETDatabaseSVView from '@/views/PETDatabaseSVView.vue'
import InProgressView from '@/views/InProgressView.vue'
import TrainingAllowanceView from '@/views/TrainingAllowanceView.vue'
import CompletedView from '@/views/CompletedView.vue'

// Types
interface NavigationItem {
	name: string
	to: string
	icon: any
}

interface RouteMeta {
	requiresAuth?: boolean
	title?: string
	icon?: any
}

// Route Configuration
const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: AppLayout,
		meta: { requiresAuth: true },
		redirect: '/applicant-directory', // Redirect root to applicant-directory
		children: [
			// {
			//   path: '',
			//   name: 'home',
			//   component: HomeView,
			//   meta: {
			//     requiresAuth: true,
			//     title: 'Home',
			//     icon: HomeIcon
			//   }
			// },
			// {
			//   path: 'about',
			//   name: 'about',
			//   component: AboutView,
			//   meta: {
			//     requiresAuth: true,
			//     title: 'About',
			//     icon: AboutIcon
			//   }
			// },
			{
				path: 'applicant-directory',
				name: 'applicant-directory',
				component: ApplicantDirectoryLayout,
				meta: {
					requiresAuth: true,
					title: 'Applicant Directory',
					icon: DocumentTextIcon
				},
				children: [
					{
						path: 'new-applicants',
						name: 'applicant-directory-new',
						component: NewApplicantsView,
						meta: { title: 'New' },
						children: [
							{
								path: ':id',
								name: 'applicant-directory-new-details',
								component: NewApplicantDetailsView,
								meta: { title: 'New Applicant Details' }
							}
						]
					},
					{
						path: 'pooling-applicants',
						name: 'applicant-directory-pooling',
						component: PoolingApplicantsView,
						meta: { title: 'Pooling' }
					},
					{
						path: 'shortlisted-applicants',
						name: 'applicant-directory-shortlisted',
						component: ShortlistedApplicantsView,
						meta: { title: 'Shortlisted' },
						children: [
							{
								path: ':id/hiring-process',
								name: 'applicant-directory-shortlisted-hiring-process',
								component: HiringProcessView,
								meta: { title: 'Hiring Process' }
							}
						]
					},
					{
						path: 'hands-on-applicants',
						name: 'applicant-directory-hands-on',
						component: HandsOnApplicantsView,
						meta: { title: 'Hands-on' }
					},
					{
						path: 'final-interview-applicants',
						name: 'applicant-directory-final-interview',
						component: FinalInterviewApplicantsView,
						meta: { title: 'Final Interview' }
					},
					{
						path: 'job-offer-applicants',
						name: 'applicant-directory-job-offer',
						component: JobOfferApplicantsView,
						meta: { title: 'Job Offer' },
						children: [
							{
								path: ':id',
								name: 'applicant-directory-job-offer-details',
								component: JobOfferApplicantDetailsView,
								meta: { title: 'Job Offer Applicant Details' }
							}
						],
					},
					{
						path: 'hired-applicants',
						name: 'applicant-directory-hired',
						component: HiredApplicantsView,
						meta: { title: 'Hired' }
					}
				]
			},
			{
				path: 'pre-employment-training-db',
				name: 'pre-employment-training-db',
				component: PETDatabaseView,
				meta: {
					requiresAuth: true,
					title: 'Pre-Employment Training Database',
					icon: ChartBarIcon
				}
			},
			{
				path: 'applicant-dashboard/:id',
				name: 'applicant-dashboard-details',
				component: ApplicantDashboardView,
				meta: { title: 'Applicant Dashboard Details' }
			},
			{
				path: 'applicants',
				name: 'applicants',
				component: ApplicantsView,
				meta: {
					requiresAuth: true,
					title: 'Applicants', 
					icon: DocumentTextIcon,
				}
			},
			{
				path: 'pet-database-sv',
				name: 'pet-database-sv',
				component: PETDatabaseSVView,
				meta: {
					requiresAuth: true,
					title: 'Pre-Employment Training Database SV',
					icon: ChartBarIcon
				}
			},
			{
				path: 'calendar',
				name: 'calendar',
				component: CalendarView,
				meta: {
					requiresAuth: true,
					title: 'Calendar',
					icon: CalendarDaysIcon
				},
			},
			{
				path: 'resources',
				name: 'resources',
				component: ApplicantDirectoryLayout,
				meta: {
					requiresAuth: true,
					title: 'Resources',
					icon: FolderOpenIcon
				},
			},
			{
				path: 'in-progress',
				name: 'in-progress',
				component: InProgressView,
				meta: {
					requiresAuth: true,
					title: 'In Progress',
					icon: CheckCircleIcon
				},
			},
			{
				path: 'completed',
				name: 'completed',
				component: CompletedView,
				meta: {
					requiresAuth: true,
					title: 'Completed',
					icon: CheckCircleIconSolid
				},
			},
			{
				path: 'in-progress/training-allowance/:id',
				name: 'training-allowance',
				component: TrainingAllowanceView,
				meta: {
					requiresAuth: true,
					title: 'Training Allowance',
					icon: CheckCircleIconSolid,
					hidden: true
				},
			},
			{
				path: 'notifications',
				name: 'notifications',
				component: NotificationsView,
				meta: { title: 'Notifications' }
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: LoginView,
		meta: {
			requiresAuth: false,
			title: 'Login'
		}
	},
	{
		path: '/500',
		name: 'server-error',
		component: () => import('@/views/ServerErrorView.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: NotFoundView,
		meta: {
			requiresAuth: false,
			title: 'Not Found'
		}
	}
]

// Router Instance
const router = createRouter({
	history: createWebHistory(process.env.VUE_APP_BASE_URL),
	routes
})

// Navigation Helper
export const getNavigationItems = (routes: RouteRecordRaw[]): NavigationItem[] => {
	const layoutRoute = routes.find(route => route.path === '/')
	if (!layoutRoute?.children) return []

	return layoutRoute.children
	.filter(route => (route.meta as RouteMeta)?.requiresAuth && route.name !== 'not-found' && route.name !== 'home' && route.name !== 'about')
	.map(route => ({
		name: (route.meta as RouteMeta)?.title || String(route.name),
		to: `/${route.path}`,
		icon: (route.meta as RouteMeta)?.icon
	}))
}

// Navigation Guards
router.beforeEach(async (to, from, next) => {
const authStore = useAuthStore()
const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

// Check if route requires authentication
if (requiresAuth) {
	// Check if user is authenticated
	const isAuthenticated = await authStore.checkAuth()
	
	if (!isAuthenticated) {
		// Redirect to login if not authenticated
		next({ name: 'login', query: { redirect: to.fullPath } })
		return
	}
}

// If user is authenticated and trying to access login page
if (to.name === 'login' && authStore.isAuthenticated) {
	next({ name: 'home' })
	return
}

next()
})

export default router 