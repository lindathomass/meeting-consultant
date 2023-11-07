import ReactMarkdown from "react-markdown";
import "../summary.scss";

function HomePage() {
  // localStorage.clear();

  return (
    <div className="flex flex-col bg-primary-background dark:text-primary-text rounded-[20px] h-full p-[50px] overflow-y-auto">
      <h1 className="font-bold text-[40px] leading-none text-primary-text">
        {"ConsultantGPT"}
      </h1>
      <br />
      <div className="markdown-content">
        <ReactMarkdown>
          {`
## Welcome to the future of strategic meeting analysis!

Upload your meeting recording and let our advanced Generative AI act as your personal management consultant.

With deep expertise in both business and technology consulting, our platform offers:

- **Actionable Items:** Get clear directives for moving forward.
- **Detailed Analysis:** Dive deep into the content, leaving no stone unturned.
- **Main Takeaways:** Understand the core essence of your discussions.
- **Strategic Insights:** Discover opportunities and transformative strategies.
- **Gap Identification:** Spot challenges and areas of improvement.
- **Meeting Decisions:** Recap decisions to ensure alignment and clarity.
- **Open Queries:** Address any unanswered questions or points of clarification.
- **Future Directions:** Chart out next steps in line with your organization's capabilities.

Experience the power of having a seasoned management consultant, right at your fingertips!
        `}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default HomePage;
