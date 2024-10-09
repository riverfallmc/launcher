import React from "react";
import { Copy } from "lucide-react";
import Application from "@/app";

interface NewsDetails {
  /** Заголовок новости */
  title: string,
  /** Небольшое описание новости */
  shortDescription: string,
  /** Ссылка на новость */
  url: string,
  /** Ссылка на изображение-фон */
  imageUrl: string,
  /** Добавляет кнопку, при нажатии на которую в буфер обмена будет добавляться этот текст
   * Например, такое можно использовать для промокодов */
  clipboardText?: string;
}

export class News extends React.Component<NewsDetails> {
  render(): React.ReactNode {
    return (
      <div className="h-36 w-72 p-4 bg-neutral-100 shadow-black-extended rounded-lg flex flex-col justify-between">
        <NewsBackground imageUrl={this.props.imageUrl}/>
        <div className="w-full h-auto flex items-center justify-end">
          {this.props.clipboardText && <NewsCopyButton text={this.props.clipboardText} />}
        </div>

        <div className="flex flex-col justify-end mt-auto">
          <span className="text-lg font-bold font-montserrat-alternates">{this.props.title}</span>
          <span className="text-xs font-medium">{this.props.shortDescription}</span>
        </div>
      </div>
    )
  }
}

// NewsBackground

class NewsBackground extends React.Component<Pick<NewsDetails, "imageUrl">> {

}

// NewsPlaceholder

interface Props {
  children?: React.ReactNode;
}

export class NewsPlaceholder extends React.Component<Props> {
  render(): React.ReactNode {
    return <div className="w-full min-h-36 py-2 space-x-3 flex" children={this.props.children}/>
  }
}

// NewsCopyButton

interface NewsCopyButtonProps {
  /** Текст, который будет сохранён в буфер обмена при нажатии на кнопку */
  text: string;
}

interface NewsCopyButtonState {
  copied: boolean;
}

class NewsCopyButton extends React.Component<NewsCopyButtonProps, NewsCopyButtonState> {
  public state: NewsCopyButtonState = {
    copied: false,
  };

  handleClick = () => {
    Application.updateClipboard(this.props.text);

    this.setState({ copied: true });

    setTimeout(() => {
      this.setState({ copied: false });
    }, 1500);
  };

  render(): React.ReactNode {
    const { copied } = this.state;

    return (
      <button
        className={`bg-purple-700 overflow-hidden rounded-lg p-1 text-white transition-all duration-300 ${
          copied ? 'w-40' : 'w-8'
        } h-auto flex items-center justify-center gap-x-2`}
        onClick={this.handleClick}
      >
        {copied && <span>Скопировано!</span>}
        <Copy className="w-4"/>
      </button>
    );
  }
}