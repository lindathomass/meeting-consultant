import { Switch } from "@headlessui/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";

import { BotId } from "~app/bots";
import { updateUserConfig } from "~services/user-config";
import Toggle from "../Toggle";

interface Props {
  botId: BotId;
}

const WebAccessCheckbox: FC<Props> = (props) => {
  const [checked, setChecked] = useState<boolean | null>(null);

  const configKey = useMemo(() => {
    if (props.botId === "chatgpt") {
      return "chatgptWebAccess";
    }
    if (props.botId === "claude") {
      return "claudeWebAccess";
    }
  }, [props.botId]);

  useEffect(() => {
    if (!configKey) {
      return;
    }

    setChecked(false);
    updateUserConfig({ [configKey]: false });
  }, [configKey]);

  const onToggle = useCallback(
    async (newValue: boolean) => {
      if (newValue) {
        return;
      }
    },
    [configKey, props.botId]
  );

  if (checked === null) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-2 shrink-0 cursor-pointer group">
      <Switch.Group>
        <div className="flex flex-row items-center gap-2">
          <Toggle enabled={checked} onChange={onToggle} />
          <Switch.Label className="text-[13px] whitespace-nowrap text-light-text font-medium select-none">
            {"Web Access"}
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  );
};

export default memo(WebAccessCheckbox);
