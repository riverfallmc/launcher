import React, { ChangeEvent } from "react";
import { SettingsValueType } from "@/util/settings.util";

interface InputState<T> {
  value: T;
}

interface InputProps<T> extends InputState<T> {
  placeholder?: string,
  tooltip?: string,
  onChange: (value: SettingsValueType) => void;
};

class InputController<
  P extends InputProps<SettingsValueType> = InputProps<SettingsValueType>,
  S extends InputState<SettingsValueType> = InputState<SettingsValueType>,
  SS = any
> extends React.Component<P, S, SS> {
  constructor(props: P) {
    super(props);

    this.state = {
      value: this.props.value
    } as S; // лол че
  }
}

// Checkbox

export class CheckBox<T extends boolean = boolean> extends InputController<
  InputProps<T>,
  InputState<T>
> {
  constructor(props: InputProps<T>) {
    super(props);

    this.onClick = this.onClick.bind(this);

    // шобы лаунчер сам применял настройки автоматически
    this.update(this.state.value);
  }

  private onClick(event: ChangeEvent<HTMLInputElement>) {
    let value = event.target.checked;

    this.update(value as T);
  }

  private update(value: T) {
    this.setState({
      value
    } as InputState<T>);

    this.props.onChange(value);
  }

  render(): React.ReactNode {
    return (
      <input checked={this.state.value} type="checkbox" onChange={this.onClick}/>
    )
  }
}