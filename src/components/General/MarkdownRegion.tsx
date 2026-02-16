import Markdown from "react-markdown";

export default function MarkdownRegion(props: { markdown: string }) {
  const { markdown } = props;
  return (
    <div className="prose prose-slate max-w-none px-4 py-2 text-xs">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}
