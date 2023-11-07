import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { cx } from '~/utils'
import { useAtom } from 'jotai'
import { useState } from 'react'
import collapseIcon from '~/assets/icons/collapse.svg'
import githubIcon from '~/assets/icons/github.svg'
import settingIcon from '~/assets/icons/setting.svg'
import themeIcon from '~/assets/icons/theme.svg'
import uploadMeetingIcon from '~/assets/icons/uploadIcon.svg'
import SummaryIcon from '~/assets/icons/noteIcon.svg'
import saltAILogo from '~/assets/saltailogo.svg'
import saltAILogoText from '~/assets/salttextlogo.svg'
import HomeIcon from '~/assets/icons/homeIcon.svg'
import ChatIcon from '~/assets/icons/chatIcon.svg'

// I can also include a salt-ai logo here
import { useEnabledBots } from '~app/hooks/use-enabled-bots'
import { sidebarCollapsedAtom } from '~app/state'
import CommandBar from '../CommandBar'
import ThemeSettingModal from '../ThemeSettingModal'
import Tooltip from '../Tooltip'
import NavLink from './NavLink'

function IconButton(props: { icon: string; onClick?: () => void }) {
  return (
    <div
      className="p-[6px] rounded-[10px] w-fit cursor-pointer hover:opacity-80 bg-secondary bg-opacity-20"
      onClick={props.onClick}
    >
      <img src={props.icon} className="w-6 h-6" />
    </div>
  )
}

function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)
  const [themeSettingModalOpen, setThemeSettingModalOpen] = useState(false)
  const enabledBots = useEnabledBots()
  return (
    <motion.aside
      className={cx(
        'flex flex-col bg-primary-background bg-opacity-40 overflow-hidden',
        collapsed ? 'items-center px-[15px]' : 'w-[230px] px-4',
      )}
    >
      <motion.img
        src={collapseIcon}
        className={cx('w-6 h-6 cursor-pointer my-5', !collapsed && 'self-end')}
        animate={{
          rotate: collapsed ? 180 : 0,
        }}
        onClick={() => setCollapsed((c) => !c)}
      />
      {collapsed ? <img src={saltAILogo} className="w-[120px]" /> : <img src={saltAILogoText} className="w-[150px]" />}
      <div className="flex flex-col gap-[20px] mt-12 overflow-y-auto scrollbar-none">
        <NavLink to="/" text={'Home'} icon={HomeIcon} iconOnly={collapsed} />
        <NavLink to="/uploadMeeting" text={'Upload Meeting'} icon={uploadMeetingIcon} iconOnly={collapsed} />
        <NavLink to="/uploadNotion" text="Upload Your Markdown" icon={uploadMeetingIcon} iconOnly={collapsed} />
        <NavLink to="/summary" text={'Meeting Summary'} icon={SummaryIcon} iconOnly={collapsed} />
        <NavLink to="/MeetingChat" text={'MeetingGPT'} icon={ChatIcon} iconOnly={collapsed} />
        <NavLink to="/NotionChat" text={'BlendleGPT'} icon={ChatIcon} iconOnly={collapsed} />

        {/* <Link
          className={cx(
            'rounded-[10px] w-full pl-3 flex flex-row gap-3 items-center shrink-0 py-[11px]',
            collapsed && 'justify-center',
          )}
          activeOptions={{ exact: true }}
          activeProps={{
            className: 'bg-white text-primary-text dark:bg-primary-blue',
          }}
          inactiveProps={{
            className: 'bg-secondary bg-opacity-20 text-primary-text opacity-80 hover:opacity-100',
          }}
          title={'SaltAI GPT'}
          key={'chatgpt'}
          to="/chat/$botId"
          params={{ botId: 'chatgpt' }}
        >
          <img src={saltAILogo} className="w-5 h-5" />
          {<span className="font-medium text-sm">{collapsed ? '' : 'SaltAI GPT'}</span>}
        </Link> */}
      </div>
      <div className="mt-auto pt-2">
        {!collapsed && <hr className="border-[#ffffff4d]" />}
        <div className={cx('flex mt-5 gap-[10px] mb-4', collapsed ? 'flex-col' : 'flex-row ')}>
          {!collapsed && (
            <Tooltip content={'GitHub'}>
              <a href="https://github.com/owebb1/meetinggpt?utm_source=extension" target="_blank" rel="noreferrer">
                <IconButton icon={githubIcon} />
              </a>
            </Tooltip>
          )}
          {!collapsed && (
            <Tooltip content={'Display'}>
              <a onClick={() => setThemeSettingModalOpen(true)}>
                <IconButton icon={themeIcon} />
              </a>
            </Tooltip>
          )}
          <Tooltip content={'Settings'}>
            <Link to="/setting">
              <IconButton icon={settingIcon} />
            </Link>
          </Tooltip>
        </div>
      </div>
      <CommandBar />
      {themeSettingModalOpen && <ThemeSettingModal open={true} onClose={() => setThemeSettingModalOpen(false)} />}
    </motion.aside>
  )
}

export default Sidebar
