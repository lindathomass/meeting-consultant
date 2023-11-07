import { FC, ReactNode, useCallback, useRef, useState } from "react";
import Button from "../Button";
import TextInput from "./TextInput";

interface Props {
  mode: "full" | "compact";
  onSubmit: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  actionButton?: ReactNode | null;
  autoFocus?: boolean;
}

const ChatMessageInput: FC<Props> = (props) => {
  // Placeholder text is hardcoded in English
  const { placeholder = "Type your message..." } = props;

  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value.trim()) {
        props.onSubmit(value);
      }
      setValue("");
    },
    [props, value]
  );

  const onValueChange = useCallback((v: string) => {
    setValue(v);
  }, []);

  return (
    <form
      className={`flex flex-row items-center gap-3 ${props.className}`}
      onSubmit={onFormSubmit}
      ref={formRef}
    >
      <div className="w-full flex flex-col justify-center">
        <TextInput
          ref={inputRef}
          formref={formRef}
          name="input"
          disabled={props.disabled}
          placeholder={placeholder}
          value={value}
          onValueChange={onValueChange}
          autoFocus={props.autoFocus}
        />
      </div>
      {props.actionButton || (
        <Button
          text="-"
          className="invisible"
          size={props.mode === "full" ? "normal" : "tiny"}
        />
      )}
    </form>
  );
};

export default ChatMessageInput;
