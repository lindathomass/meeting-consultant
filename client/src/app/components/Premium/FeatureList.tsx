import { FC, useMemo } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { cx } from "~/utils";
import checkIcon from "~assets/icons/check.svg";

export type FeatureId = "web-access" | "all-in-one-layout";

interface Feature {
  id?: FeatureId;
  title: string;
  desc?: string;
  link?: string;
}

const FeatureItem: FC<Feature & { highlight?: boolean }> = (props) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <img src={checkIcon} className="w-6 h-6" />
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2">
          <span
            className={cx(
              "text-primary-text",
              props.highlight ? "font-bold text-lg" : "font-medium"
            )}
          >
            {props.title}
          </span>
          {!!props.link && (
            <a href={props.link} target="_blank" rel="noreferrer">
              <BsQuestionCircle className="cursor-pointer" size="14" />
            </a>
          )}
        </div>
        {!!props.desc && (
          <span
            className={cx(
              "text-secondary-text",
              props.highlight && "font-medium"
            )}
          >
            {props.desc}
          </span>
        )}
      </div>
    </div>
  );
};

const FeatureList: FC<{ highlightFeature?: FeatureId }> = (props) => {
  const features: Feature[] = useMemo(() => {
    return [
      {
        id: "all-in-one-layout",
        title: "More layouts in All-In-One mode",
        desc: "Chat with more than 2 bots simultaneously",
      },
      {
        id: "web-access",
        title: "Web Access",
        desc: "Improving accuracy by searching up-to-date information from the internet",
        link: "https://github.com/chathub-dev/chathub/wiki/Web-Access",
      },
      {
        title: "Full-text search for chat history",
      },
      {
        title: "Customize theme",
      },
      {
        title: "Quick access in Chrome side bar",
        link: "https://github.com/chathub-dev/chathub/wiki/Access-from-Chrome-side-panel",
      },
      {
        title: "Compare with image input",
      },
      {
        title: "Activate up to 5 devices",
      },
      {
        title: "Support the development of ChatHub",
      },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {features.map((feature) => (
        <FeatureItem
          key={feature.title}
          {...feature}
          highlight={
            props.highlightFeature && props.highlightFeature === feature.id
          }
        />
      ))}
    </div>
  );
};

export default FeatureList;
