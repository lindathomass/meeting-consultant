import { FC } from "react";
import { PoeGPTModel, UserConfig } from "~services/user-config";
import Select from "../Select";

interface Props {
  userConfig: UserConfig;
  updateConfigValue: (update: Partial<UserConfig>) => void;
}

const ChatGPTPoeSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium text-sm">{"Model"}</p>
      <div className="w-[250px] mb-1">
        <Select
          options={Object.entries(PoeGPTModel).map(([k, v]) => ({
            name: k,
            value: v,
          }))}
          value={userConfig.chatgptPoeModelName}
          onChange={(v) => updateConfigValue({ chatgptPoeModelName: v })}
        />
      </div>
      {userConfig.chatgptPoeModelName === PoeGPTModel["GPT-4"] && (
        <p className="text-sm text-secondary-text">{"Poe subscribers only"}</p>
      )}
    </div>
  );
};

export default ChatGPTPoeSettings;
