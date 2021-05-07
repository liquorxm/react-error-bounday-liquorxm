import React, { useState } from 'react';

// 出错后显示的元素类型
type FallbackElement = React.ReactElement<unknown, string | React.FC | typeof React.Component> | null;
export declare function FallbackRender(props: FallbackProps): FallbackElement;
// 出错显示组件的 props
export interface FallbackProps {
  error: Error;
  resetErrorBoundary?: () => void; // fallback 组件里将该函数绑定到“重置”按钮
}

interface ErrorBoundaryPropsWithFallback {
  fallback?: FallbackElement;
  resetKeys?: Array<unknown>;
  onResetKeysChange?: (
    prevResetKey: Array<unknown> | undefined,
    resetKeys: Array<unknown> | undefined,
  ) => void;
  onError?: (error: Error, info: string) => void;
  onReset?: (...args: Array<unknown>) => void;
  FallbackComponent?: React.ComponentType<FallbackProps>; // Fallback 组件
  fallbackRender?: typeof FallbackRender; // 渲染 fallback 元素的函数
}

type ErrorBoundaryProps = ErrorBoundaryPropsWithFallback;

type ErrorBoundaryState = {
  error: Error | null;
};

// 检查 resetKeys 是否有变化
const changedArray = (a: Array<unknown> = [], b: Array<unknown> = []) => {
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}

const initState: ErrorBoundaryState = { error: null };

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  updatedWithError: boolean;
  constructor(props: ErrorBoundaryProps | Readonly<ErrorBoundaryProps>) {
    super(props);
    this.state = initState;
    this.updatedWithError = false;
  }

  /**
   * getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。
   * 如遇此类情况，请改用 componentDidCatch()。
   * 某些错误，错误边界组件无法捕获
   * @static
   * @param {Error} error
   * @returns 
   * @memberof ErrorBoundary
   */
  static getDerivedStateFromError(error: Error) {
    console.log(error);

    return { error }
  }

  /**
   * 某些错误，错误边界组件无法捕获
   * 1.组件的自身错误
   * 2.异步错误，比如计时器
   * 3.事件中的错误，比如click事件中发生的错误
   * 4.服务端渲染
   */
  componentDidCatch(error: Error, errorInfo: any) {
    // 你同样可以将错误日志上报给服务器
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: Readonly<React.PropsWithChildren<ErrorBoundaryProps>>) {
    const { error } = this.state;
    const { resetKeys, onResetKeysChange } = this.props;
    if (error !== null && !this.updatedWithError) {
      this.updatedWithError = true;
      return;
    }

    // 已经存在错误，并且是普通的组件 render，则检查 resetKeys 是否有改动，改了就重置
    if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
      onResetKeysChange?.(prevProps.resetKeys, resetKeys);
      this.reset();
    }
  }

  // 重置组件状态
  reset = () => {
    this.updatedWithError = false;
    this.setState(initState);
  }

  // 自定义重置逻辑
  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.reset();
  }

  render() {
    const { fallback, FallbackComponent, fallbackRender } = this.props;
    const { error } = this.state;

    if (error) {
      const fallbackProps: FallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,  // 将 resetErrorBoundary 传入 fallback
      }

      // 判断 fallback 是否为合法的 Element
      if (React.isValidElement(fallback)) {
        return fallback;
      }

      // 判断 render 是否为函数
      if (typeof fallbackRender === 'function') {
        return fallbackRender(fallbackProps);
      }

      // 判断是否存在 FallbackComponent
      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />;
      }

      throw new Error('ErrorBoundary 组件需要传入 fallback, fallbackRender, FallbackComponent 其中一个');
    }

    return this.props.children;
  }
}

/**
 * 封装成高阶组件
 * @template P
 * @param {React.ComponentType<P>} Component
 * @param {ErrorBoundaryProps} errorBoundaryProps
 * @returns {React.ComponentType<P>}
 */
function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: ErrorBoundaryProps
): React.ComponentType<P> {
  const Wrapped: React.ComponentType<P> = props => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  // DevTools 显示的组件名
  const name = Component.displayName || Component.name || 'Unknown';
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}

/**
 * 开发者手动抛出错误
 * @template P
 * @param {(P | null | undefined)} [givenError]
 * @returns {(React.Dispatch<React.SetStateAction<P | null>>)}
 */
function useErrorHandler<P = Error>(
  givenError?: P | null | undefined,
): React.Dispatch<React.SetStateAction<P | null>> {
  const [error, setError] = useState<P | null>(null);
  if (givenError) throw givenError; // 初始有错误时，直接抛出
  if (error) throw error; // 后来再有错误，也直接抛出

  return setError;
}

export { ErrorBoundary, withErrorBoundary, useErrorHandler }
