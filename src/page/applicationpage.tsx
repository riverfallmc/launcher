import React from "react";

export abstract class ApplicationPage<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  abstract render(): React.ReactNode;
  onPageSelected() {};
}