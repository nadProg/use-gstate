import { Highlight, themes } from "prism-react-renderer";

type CodeBlockProps = {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
};

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <div className="rounded-lg overflow-hidden mb-6">
      {filename && (
        <div className="bg-gray-800 text-gray-200 text-xs px-4 py-2 flex justify-between">
          <span>{filename}</span>
          <span>{language}</span>
        </div>
      )}
      <Highlight
        theme={themes.nightOwl}
        code={code.trim()}
        language={language as any}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 overflow-auto`}
            style={{
              ...style,
              margin: 0,
              fontSize: "0.9rem",
              fontFamily: "monospace",
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
