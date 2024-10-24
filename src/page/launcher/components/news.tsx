import React from "react";
import Application from "@/app";
import { Copy } from "lucide-react";

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

export class News extends React.Component<{news: NewsDetails}> {
  render(): React.ReactNode {
    return (
      <div
        className="h-36 w-72 p-4 bg-neutral-100 shadow-black-extended rounded-lg flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${this.props.news.imageUrl})`}}>
        <div className="w-full h-auto flex items-center justify-end">
          {this.props.news.clipboardText && <NewsCopyButton text={this.props.news.clipboardText} />}
        </div>

        <div className="flex flex-col justify-end mt-auto">
          <span className="text-white text-lg font-bold font-montserrat-alternates text-shadow-lg">{this.props.news.title}</span>
          <span className="text-white/70 text-xs font-semibold leading-3 text-shadow-md">{this.props.news.shortDescription}</span>
        </div>
      </div>
    )
  }
}

// NewsList

export class NewsList extends React.Component<{}, {news: NewsDetails[]}> {
  componentDidMount() {
    NewsList.requestNews()
      .then(news => {
        this.setState({news});
      })
      .catch(console.error);
  }

  // todo
  private static async requestNews(): Promise<NewsDetails[]> {
    return new Promise(res => {
      res([
        {
          title: "15% скидка",
          shortDescription: "В честь открытия нашего проекта мы делимся с вами купоном на скидку 15% при покупке доната!",
          url: "https://vk.com/",
          imageUrl: "https://image.winudf.com/v2/image/Y29tLm5hdGFsaWdwLkNob2NhcGljU2hhZGVyc01vZE1DUEVfc2NyZWVuXzFfMTUxMDcyNzcwOF8wOTQ/screen-1.jpg?fakeurl=1&type=.jpg",
          clipboardText: "ебать пенис молочный"
        },
        {
          title: "Заголовок",
          shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis scelerisque eros. Curabitur condimentum quis",
          url: "https://vk.com/",
          imageUrl: "https://avatars.mds.yandex.net/i?id=d9efcccb580f13e6f78614c6ba67fb45d2b9a7de-12919190-images-thumbs&n=13",
        }
      ]);
    });
  }

  /** Конвертирует список новостей из стейта компонента в ReactNode */
  private renderNews(): React.ReactNode {
    return (
      <>
        {this.state && this.state.news && this.state.news.map(news => <News news={news}/>)}
      </>
    );
  }

  render(): React.ReactNode {
    return <div
      className="w-full min-h-36 py-2 space-x-3 flex"
      children={this.renderNews()}/>
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
        className={`bg-purple-700 hover:bg-purple-900 overflow-hidden rounded-lg p-1 text-white transition-all duration-300 ${
          copied ? 'w-40' : 'w-8'
        } h-auto flex items-center justify-center gap-x-2`}
        onClick={this.handleClick}
      >
        {copied && <span className="lowercase font-semibold">скопировано!</span>}
        <Copy className="w-4"/>
      </button>
    );
  }
}