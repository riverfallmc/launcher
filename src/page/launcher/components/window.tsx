import React, { ReactNode, ReactElement } from 'react';
import ReactDOM from 'react-dom';

interface WindowProps {
  title: string;
  children: ReactNode;
}

interface WindowTriggerProps {
  children?: ReactNode;
  onClick?: () => void;
}

interface WindowContentProps {
  children: ReactNode;
  close?: () => void;
}

export class Window extends React.Component<WindowProps, { isOpen: boolean }> {
  constructor(props: WindowProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openWindow = () => this.setState({ isOpen: true });
  closeWindow = () => this.setState({ isOpen: false });

  render(): React.ReactNode {
    const { title, children } = this.props;

    const trigger = React.Children.toArray(children)[0] as ReactElement<WindowTriggerProps>;
    const content = React.Children.toArray(children)[1] as ReactElement<WindowContentProps>;

    return (
      <>
        {React.isValidElement(trigger) &&
          React.cloneElement(trigger, { onClick: this.openWindow })}

        {this.state.isOpen && (
          <WindowContentLayer
            title={title}
            onClose={this.closeWindow}>
              {React.isValidElement(content) &&
              React.cloneElement(content, { close: this.closeWindow })}
          </WindowContentLayer>
        )}
      </>
    );
  }
}

interface WindowContentLayerProps {
  children?: React.ReactNode,
  onClose?: () => void,
  title: string;
}

class WindowContentLayer extends React.Component<WindowContentLayerProps> {
  render(): ReactNode {
    return ReactDOM.createPortal(
      <>
        <div
          onClick={this.props.onClose}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-85">
          <div
            data-tauri-drag-region
            className="w-[52vw] h-auto p-6 rounded-lg bg-white shadow-black-extended"
            onClick={(e) => e.stopPropagation()}>
            <div className="size-full flex flex-col gap-y-1">
              <div data-tauri-drag-region>
                <span className="uppercase font-bold text-xl">{this.props.title}</span>
              </div>
              {this.props.children}
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  }
}

export class WindowTrigger extends React.Component<WindowTriggerProps> {
  render() {
    return <div {...this.props} className="size-auto"/>
  }
}

export class WindowContent extends React.Component<WindowContentProps> {
  render() {
    return <>{this.props.children}</>;
  }
}