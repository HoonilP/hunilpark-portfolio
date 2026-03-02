import { getHighlighter } from '@/lib/shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export default async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light',
  });

  return (
    <div
      className="code-block my-4 overflow-x-auto rounded-lg text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
