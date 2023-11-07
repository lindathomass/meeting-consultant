import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiExport, BiImport } from "react-icons/bi";
import Button from "~app/components/Button";
import RadioGroup from "~app/components/RadioGroup";
import Select from "~app/components/Select";
import ChatGPTAPISettings from "~app/components/Settings/ChatGPTAPISettings";
import ChatGPTAzureSettings from "~app/components/Settings/ChatGPTAzureSettings";
import ChatGPTOpenRouterSettings from "~app/components/Settings/ChatGPTOpenRouterSettings";
import ChatGPTPoeSettings from "~app/components/Settings/ChatGPTPoeSettings";
import ChatGPWebSettings from "~app/components/Settings/ChatGPTWebSettings";
import ClaudeAPISettings from "~app/components/Settings/ClaudeAPISettings";
import ClaudeOpenRouterSettings from "~app/components/Settings/ClaudeOpenRouterSettings";
import ClaudePoeSettings from "~app/components/Settings/ClaudePoeSettings";
import ClaudeWebappSettings from "~app/components/Settings/ClaudeWebappSettings";
import EnabledBotsSettings from "~app/components/Settings/EnabledBotsSettings";
import { ALL_IN_ONE_PAGE_ID, CHATBOTS } from "~app/consts";
import { exportData, importData } from "~app/utils/export";
import {
  BingConversationStyle,
  ChatGPTMode,
  ClaudeMode,
  UserConfig,
  updateUserConfig,
} from "~services/user-config";
import { getVersion } from "~utils";
import PagePanel from "../components/Page";

const BING_STYLE_OPTIONS = [
  { name: "Precise", value: BingConversationStyle.Precise },
  { name: "Balanced", value: BingConversationStyle.Balanced },
  { name: "Creative", value: BingConversationStyle.Creative },
];

function SettingPage() {
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(
    undefined
  );
  const [dirty, setDirty] = useState(false);

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update });
      setDirty(true);
    },
    [userConfig]
  );

  const save = useCallback(async () => {
    let apiHost = userConfig?.openaiApiHost;
    if (apiHost) {
      window.alert("Shortcut customization is not available in the web app.");
    } else {
      apiHost = undefined;
    }
    await updateUserConfig({ ...userConfig!, openaiApiHost: apiHost });
    toast.success("Saved");
    setTimeout(() => location.reload(), 500);
  }, [userConfig]);

  if (!userConfig) {
    return null;
  }

  return (
    <PagePanel title={`${"Settings"} (v${getVersion()})`}>
      <div className="flex flex-col gap-5 mt-3">
        <div>
          <p className="font-bold mb-1 text-lg">{"Export/Import All Data"}</p>
          <p className="mb-3 opacity-80">
            {
              "Data includes all your settings, chat histories, and local prompts"
            }
          </p>
          <div className="flex flex-row gap-3">
            <Button
              size="small"
              text={"Export"}
              icon={<BiExport />}
              onClick={exportData}
            />
            <Button
              size="small"
              text={"Import"}
              icon={<BiImport />}
              onClick={importData}
            />
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-lg">{"Startup page"}</p>
          <div className="w-[200px]">
            <Select
              options={[
                { name: "All-In-One", value: ALL_IN_ONE_PAGE_ID },
                ...Object.entries(CHATBOTS).map(([botId, bot]) => ({
                  name: bot.name,
                  value: botId,
                })),
              ]}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: v })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">{"Chatbots"}</p>
          <EnabledBotsSettings
            userConfig={userConfig}
            updateConfigValue={updateConfigValue}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg">ChatGPT</p>
          <RadioGroup
            options={Object.entries(ChatGPTMode).map(([k, v]) => ({
              label: `${k} ${"Mode"}`,
              value: v,
            }))}
            value={userConfig.chatgptMode}
            onChange={(v) =>
              updateConfigValue({ chatgptMode: v as ChatGPTMode })
            }
          />
          {userConfig.chatgptMode === ChatGPTMode.API ? (
            <ChatGPTAPISettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : userConfig.chatgptMode === ChatGPTMode.Azure ? (
            <ChatGPTAzureSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : userConfig.chatgptMode === ChatGPTMode.Poe ? (
            <ChatGPTPoeSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : userConfig.chatgptMode === ChatGPTMode.OpenRouter ? (
            <ChatGPTOpenRouterSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : (
            <ChatGPWebSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg">Claude</p>
          <RadioGroup
            options={Object.entries(ClaudeMode).map(([k, v]) => ({
              label: `${k} ${"Mode"}`,
              value: v,
            }))}
            value={userConfig.claudeMode}
            onChange={(v) => updateConfigValue({ claudeMode: v as ClaudeMode })}
          />
          {userConfig.claudeMode === ClaudeMode.API ? (
            <ClaudeAPISettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : userConfig.claudeMode === ClaudeMode.Webapp ? (
            <ClaudeWebappSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : userConfig.claudeMode === ClaudeMode.OpenRouter ? (
            <ClaudeOpenRouterSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          ) : (
            <ClaudePoeSettings
              userConfig={userConfig}
              updateConfigValue={updateConfigValue}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg">Bing</p>
          <div className="flex flex-row gap-3 items-center justify-between w-[250px]">
            <p className="font-medium text-base">{"Chat style"}</p>
            <div className="w-[150px]">
              <Select
                options={BING_STYLE_OPTIONS}
                value={userConfig.bingConversationStyle}
                onChange={(v) =>
                  updateConfigValue({ bingConversationStyle: v })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        color={dirty ? "primary" : "flat"}
        text={"Save"}
        className="w-fit my-8"
        onClick={save}
      />
      <Toaster position="top-right" />
    </PagePanel>
  );
}

export default SettingPage;
