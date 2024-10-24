import React from "react";
import { className } from "../util/classname.util";

interface TextEntryProps {
  className?: string,
  placeholder?: string,
  type?: React.HTMLInputTypeAttribute;
}

export class TextEntry extends React.Component<TextEntryProps> {
  render(): React.ReactNode {
    return <input className={className("rounded-lg border px-3 py-5 border-solid bg-white border-neutral-200 h-8", this.props.className)} placeholder={this.props.placeholder} type={this.props.type || "text"}/>
  }
}

interface TextEntryLabeledProps extends TextEntryProps {
  text: string;
  children?: React.ReactNode;
}

export class TextEntryLabeled extends React.Component<TextEntryLabeledProps> {
  render(): React.ReactNode {
    return (
      <div className="flex flex-col">
        <div className="h-auto flex justify-between">
          <span className="text-sm">{this.props.text}</span>
          {this.props.children}
        </div>
        <TextEntry placeholder={this.props.placeholder} className={this.props.className} type={this.props.type}/>
      </div>
    )
  }
}