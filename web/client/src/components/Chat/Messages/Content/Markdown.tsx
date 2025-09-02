import React, { memo, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { ArtifactProvider, CodeBlockProvider } from '~/Providers';
import MarkdownErrorBoundary from './MarkdownErrorBoundary';
import { preprocessLaTeX } from '~/utils';
import store from '~/store';

type TContentProps = {
  content: string;
  isLatestMessage: boolean;
};

const Markdown = memo(({ content = '', isLatestMessage }: TContentProps) => {
  const LaTeXParsing = useRecoilValue<boolean>(store.LaTeXParsing);
  const isInitializing = content === '';

  const currentContent = useMemo(() => {
    if (isInitializing) {
      return '';
    }
    return LaTeXParsing ? preprocessLaTeX(content) : content;
  }, [content, LaTeXParsing, isInitializing]);

  if (isInitializing) {
    return (
      <div className="absolute">
        <p className="relative">
          <span className={isLatestMessage ? 'result-thinking' : ''} />
        </p>
      </div>
    );
  }

  return (
    <MarkdownErrorBoundary content={content} codeExecution={true}>
      <ArtifactProvider>
        <CodeBlockProvider>
          <MarkdownPreview
            source={currentContent}
          />
        </CodeBlockProvider>
      </ArtifactProvider>
    </MarkdownErrorBoundary>
  );
});

export default Markdown;
