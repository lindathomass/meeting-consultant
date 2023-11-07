import { createHashHistory, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import { BotId } from './bots'
import Layout from './components/Layout'
import SettingPage from './pages/SettingPage'
import UploadMeetingPage from './pages/UploadMeetingPage'
import MeetingChat from './pages/MeetingChat'
import NotionChat from './pages/NotionChat'
import SummaryPage from './pages/SummaryPage'
import HomePage from './pages/HomePage'
import UploadNotionPage from './pages/UploadNotion'

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
})

// function ChatRoute() {
//   const { botId } = useParams({ from: chatRoute.id })
//   return <MeetingChat botId={botId as BotId} />
// }
const notionChatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'notionChat',
  component: NotionChat,
})

const meetingChatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'meetingChat',
  component: MeetingChat,
})

const meetingUploadRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'uploadMeeting',
  component: UploadMeetingPage,
})

const uploadNotionRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'uploadNotion',
  component: UploadNotionPage,
})

const summaryRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'summary',
  component: SummaryPage,
})

const settingRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    meetingChatRoute,
    notionChatRoute,
    settingRoute,
    meetingUploadRoute,
    summaryRoute,
    uploadNotionRoute,
  ]),
])

const hashHistory = createHashHistory()
const AppRouter = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    AppRouter: typeof AppRouter
  }
}

export { AppRouter }
