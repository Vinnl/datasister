import React, { Suspense } from 'react';
import { IndexedFormula, NamedNode } from 'rdflib';
import { Loading } from './Loading';
import { DataBrowserContext } from '../context';

export interface Props {
  pane: string;
  resource: NamedNode;
};

export const PaneLoader: React.FC<Props> = (props) => {
  const { store, loadResource } = React.useContext(DataBrowserContext);
  const PaneComponent = React.lazy(() => loadPane(props.pane));
  return (
    <Suspense fallback={<Loading/>}>
      <PaneComponent
        store={store}
        resource={props.resource}
        loadResource={loadResource}
      />
    </Suspense>
  );
};

async function loadPane(pane: string): Promise<{ default: PaneContainer }> {
  const paneExports = await import(`../panes/${pane}/container`);

  if (hasReactCompoment(paneExports)) {
    return { default: paneExports.Container };
  }

  if (hasRenderer(paneExports)) {
    const NonReactPane: React.FC<PaneContainerProps> = (props) => {
      const domElementRef = React.useRef<HTMLDivElement>(null);
      React.useLayoutEffect(() => {
        if (domElementRef.current) {
          paneExports.render({ ...props, container: domElementRef.current });
        }
      });
  
      return (
        <div ref={domElementRef} className="paneContainer"/>
      );
    };

    return { default: NonReactPane };
  }

  const LoadError: React.FC<PaneContainerProps> = () => <div>There was a problem loading </div>;
  return { default: LoadError };
}

export interface PaneContainerProps {
  store: IndexedFormula;
  resource: NamedNode;
  loadResource: (resourcePath: string) => void;
};
export type PaneContainer = React.ComponentType<PaneContainerProps>;
export type DomRenderer = (params: { container: HTMLElement } & PaneContainerProps) => void;

function hasReactCompoment(paneExport: any): paneExport is { Container: PaneContainer } {
  return (typeof paneExport.Container !== 'undefined');
}
function hasRenderer(paneExport: any): paneExport is { render: DomRenderer } {
  return (typeof paneExport.render !== 'undefined');
}
