import React from 'react';
import FallbackExample from './components/Example/FallbackExample';
import FallbackRenderExample from './components/Example/FallbackRenderExample';
import FallbackComponentExample from './components/Example/FallbackComponentExample';
import ResetKeysExample from './components/Example/ResetKeysExample';
import WithErrorBoundaryExample from './components/Example/WithErrorBoundaryExample';
import UseErrorHandlerExample from './components/Example/UseErrorHandlerExample';

function App() {
  return (
    <div className='App'>
      <h2>React-Error-Boundary example</h2>
      <h3>FallbackExample</h3>
      <FallbackExample />

      <h3>FallbackRenderExample</h3>
      <FallbackRenderExample />

      <h3>FallbackComponentExample</h3>
      <FallbackComponentExample />

      <h3>ResetKeysExample</h3>
      <ResetKeysExample />

      <h3>WithErrorBoundaryExample</h3>
      <WithErrorBoundaryExample />

      <h3>UseErrorHandlerExample</h3>
      <UseErrorHandlerExample />
    </div>
  );
}

export default App;
