import React from "react";

export default class ErrorView extends React.Component<{}, {error?: string}> {
  static instance: ErrorView;

  state = {};

  static setError(error?: string) {
    this.instance?.setState({ error });
  }

  componentDidMount() {
    ErrorView.instance = this;
  }

  render(): React.ReactNode {
    //@ts-ignore лень фиксить
    if (!this.state.error)
      return <></>;

    return (
      <div
        onClick={() => ErrorView.setError()}
        className="overflow-hidden size-full fixed flex justify-center items-center z-50 bg-neutral-950/70 back-blur"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          data-tauri-drag-region
          className="relative rounded-lg px-10 py-12 flex justify-center items-center space-x-2 object-cover"
        >

          <div
            className="absolute inset-0 rounded-lg bg-cover bg-center filter saturate-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(/assets/background/error.jpg)",
            }}
          ></div>

          <div className="relative z-10 flex flex-col leading-4 space-y-2 max-w-64">
            <span className="text-2xl font-semibold">Ошибка</span>
            {/* @ts-ignore */}
            <span className="text-neutral-400 font-normal">{this.state.error}</span>
          </div>

          <img className="relative z-10 h-24" src="/assets/scene/cat.png" />
        </div>
      </div>
    );
  }
}