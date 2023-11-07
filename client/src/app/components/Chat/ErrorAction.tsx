import { FC, useContext } from "react";
import { ConversationContext } from "~app/context";
import { ChatError, ErrorCode } from "~utils/errors";
import Button, { Props as ButtonProps } from "../Button";

const ActionButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      size="small"
      className="drop-shadow-lg"
      color="primary"
    />
  );
};

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext);

  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="https://bing.com" target="_blank" rel="noreferrer">
        <ActionButton text={"Login at bing.com"} />
      </a>
    );
  }
  if (error.code === ErrorCode.POE_UNAUTHORIZED) {
    return (
      <a href="https://poe.com" target="_blank" rel="noreferrer">
        <ActionButton text={"Login at poe.com"} />
      </a>
    );
  }
  if (error.code === ErrorCode.XUNFEI_UNAUTHORIZED) {
    return (
      <a href="https://xinghuo.xfyun.cn" target="_blank" rel="noreferrer">
        <ActionButton text={"Login at xfyun.cn"} />
      </a>
    );
  }
  if (error.code === ErrorCode.GPT4_MODEL_WAITLIST) {
    return (
      <a
        href="https://openai.com/waitlist/gpt-4-api"
        target="_blank"
        rel="noreferrer"
      >
        <ActionButton text={"Join the waitlist"} />
      </a>
    );
  }
  if (error.code === ErrorCode.CHATGPT_AUTH) {
    return (
      <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
        <ActionButton text={"Login to ChatGPT"} />
      </a>
    );
  }
  if (error.code === ErrorCode.CLAUDE_WEB_UNAUTHORIZED) {
    return (
      <a href="https://claude.ai" target="_blank" rel="noreferrer">
        <ActionButton text={"Login to Claude.ai"} />
      </a>
    );
  }
  if (
    error.code === ErrorCode.CONVERSATION_LIMIT ||
    error.code === ErrorCode.LMSYS_SESSION_EXPIRED
  ) {
    return (
      <ActionButton text="Restart" onClick={() => conversation?.reset()} />
    );
  }
  if (error.code === ErrorCode.BARD_EMPTY_RESPONSE) {
    return (
      <a href="https://bard.google.com" target="_blank" rel="noreferrer">
        <ActionButton text="Visit bard.google.com" />
      </a>
    );
  }
  if (error.code === ErrorCode.BING_CAPTCHA) {
    return (
      <a
        href="https://www.bing.com/turing/captcha/challenge"
        target="_blank"
        rel="noreferrer"
      >
        <ActionButton text={"Verify"} />
      </a>
    );
  }
  if (error.code === ErrorCode.CHATGPT_INSUFFICIENT_QUOTA) {
    return (
      <p className="ml-2 text-secondary-text text-sm">
        {
          "This usually mean you need to add a payment method to your OpenAI account, checkout: "
        }
        <a
          href="https://platform.openai.com/account/billing/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          OpenAI billing
        </a>
      </p>
    );
  }
  if (
    error.code === ErrorCode.NETWORK_ERROR ||
    (error.code === ErrorCode.UNKOWN_ERROR &&
      error.message.includes("Failed to fetch"))
  ) {
    return (
      <div>
        <p className="ml-2 text-secondary-text text-sm">
          {"Please check your network connection"}
        </p>
      </div>
    );
  }
  if (error.code === ErrorCode.POE_MESSAGE_LIMIT) {
    return (
      <p className="ml-2 text-secondary-text text-sm">
        {"This is a limitation set by poe.com"}
      </p>
    );
  }

  return null;
};

export default ErrorAction;
