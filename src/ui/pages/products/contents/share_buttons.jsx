import { FacebookShareButton, WhatsappShareButton, TelegramShareButton } from "react-share";
import { FacebookIcon, WhatsappIcon, TelegramIcon } from "react-share";

function ShareButtons() {
    return (
        <div className="col-6 col-xl-12 my-[25px]">
            <label className="text-muted">Поделиться</label>
            <br />
            <div className="flex flex-row gap-2">
                <FacebookShareButton
                    url={window.location.href}
                    quote={"フェイスブックはタイトルが付けれるようです"}
                    hashtag={"#hashtag"}
                    description={"aiueo"}
                    className="Demo__some-network__share-button mr-1"
                >
                    <FacebookIcon size={45} round />
                </FacebookShareButton>
                <WhatsappShareButton
                    url={window.location.href}
                    quote={"フェイスブックはタイトルが付けれるようです"}
                    hashtag={"#hashtag"}
                    description={"aiueo"}
                    className="Demo__some-network__share-button mr-1"
                >
                    <WhatsappIcon size={45} round />
                </WhatsappShareButton>
                <TelegramShareButton
                    url={window.location.href}
                    quote={"フェイスブックはタイトルが付けれるようです"}
                    hashtag={"#hashtag"}
                    description={"aiueo"}
                    className="Demo__some-network__share-button"
                >
                    <TelegramIcon size={45} round />
                </TelegramShareButton>
            </div>
        </div>
    )
}

export default ShareButtons