import React, { useState } from 'react';
import { ErrorBoundary } from '../../lib/ErrorBoundary';
import MakeError from '../Error/MakeError';
import { ErrorFallback } from '../../utils'

const FallbackComponentExample = () => {
  const [hasError, setHasError] = useState(false);

  const onError = (error: Error) => {
    // 日志上報
    console.log(error);
    setHasError(true);
  };

  const onReset = () => {
    console.log('尝试恢复错误');
    setHasError(false);
  };

  return (
    <ErrorBoundary
      fallbackRender={ErrorFallback}
      onError={onError}
      onReset={onReset}
    >
      {/* 123 */}
      {!hasError ? <MakeError /> : null}
    </ErrorBoundary>
  );
};

export default FallbackComponentExample;
