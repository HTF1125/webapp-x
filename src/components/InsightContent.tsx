// components/InsightContent.tsx

import ReactMarkdown from 'react-markdown';

export default function InsightContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
