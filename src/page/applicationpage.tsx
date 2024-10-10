import React from "react";

export abstract class ApplicationPage<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  abstract render(): React.ReactNode;
  componentDidMount() {
    this.onPageSelected();
  }
  /** Метод, вызываемый при смене страницы на текущую (this) */
  onPageSelected() {};
}