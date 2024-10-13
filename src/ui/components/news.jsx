import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import useArticleListQuery from '../../hooks/article';
import { maxSymbolEllipsis } from '../../helpers/functions';

import chat_bubble_outline from '../../dist/icons/chat_bubble.svg';
import heart_outline from '../../dist/icons/heart_outline.svg';

const handleDragStart = (e) => e.preventDefault();

const NewsGrid = () => {
    const { articles, isLoading } = useArticleListQuery();

    return (
        <>
            <div className="my-3">
                <h3 className=' pb-0'>
                    <Link to="/articles" className="text-neutral-800 text-[15px] font-semibold font-['SF UI Display']">
                        Статьи и новости:
                    </Link>
                </h3>

                <div className="grid gap-4 mt-[25px] xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3">
                    {
                        isLoading ? (Array.from(new Array(4))).map((item, index) => {
                            return (
                                <NewsItemSkeleton
                                    key={index}
                                />
                            )
                        }) :
                            articles?.map((item, index) => {
                                return (
                                    <NewsItem
                                        key={index}
                                        item={item}
                                    />
                                )
                            })
                    }
                </div>
                {articles?.length > 0 && (
                    <div className="flex justify-center items-center mt-5">
                        <Link
                            to="/articles"
                            className="text-[15px] font-medium font-['SF UI Display'] btn btn-primary rounded-xl px-5  text-white"
                        >
                            Смотреть все
                        </Link>
                    </div>

                )}
            </div>
        </>

    )
}

function NewsItem({
    item,
}) {
    return (
        <div
            className="max-w-md pb-2.5 rounded-[10px] border border-neutral-200 flex-col justify-start items-center"
        >
            <Link to={'/article/' + item.id}>
                <div
                    className="w-[100%] h-[190px] rounded-tl-[10px] rounded-tr-[10px]"
                    style={{ objectFit: 'cover' }}
                >
                    <img
                        className="rounded-tl-[10px] rounded-tr-[10px] h-full w-full object-cover"
                        src={item?.image}
                    />
                </div>
                <div className="self-stretch flex-col justify-start items-start px-3 mt-2">
                    <div className="flex-col justify-center items-start gap-[4.85px] flex">
                        <div className="text-neutral-800 text-sm font-medium font-['SF UI Display']">{item.title}</div>
                        <div
                            className="h-[40px] text-neutral-400 text-xs font-medium font-['SF UI Display']"
                        >
                            {maxSymbolEllipsis(item.text, 70)}
                        </div>
                    </div>
                    <div className="justify-start items-center gap-[5px] inline-flex mt-3">
                        <div className="text-zinc-500 text-xs font-medium font-['SF UI Display']">Регион:</div>
                        <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">г.Бишкек</div>
                    </div>

                    <div className="flex flex-row items-center justify-content-between">
                        <div className="text-neutral-800 text-xs font-normal font-['SF UI Display']">Сегодня 13:01</div>

                        <div className="flex flex-row items-center justify-content-between gap-[5px]">
                            <div className="flex flex-row items-center justify-content-between gap-[5px]">
                                <img src={chat_bubble_outline} alt="chat_bubble_outline" />
                                <div className="text-neutral-800 text-[15px] font-normal font-['SF UI Display']">10</div>
                            </div>
                            <div className="flex flex-row items-center justify-content-between gap-[5px]">
                                <img src={heart_outline} alt="heart_outline" />
                                <div className="text-neutral-800 text-[15px] font-normal font-['SF UI Display']">50</div>
                            </div>
                        </div>

                    </div>
                </div>
            </Link>
        </div>
    )
}

function NewsItemSkeleton() {
    return (
        <div className="max-w-md pb-2.5 rounded-[10px] border border-neutral-200 flex-col justify-start items-center">
            <div className="w-[100%] h-[190px] rounded-tl-[10px] rounded-tr-[10px]">
                <Skeleton variant="rectangular" width={'100%'} height={190} />
            </div>

            <div className="self-stretch flex-col justify-start items-start px-3 mt-2">
                <div className="flex-col justify-center items-start gap-[4.85px] flex">
                    <Skeleton variant="text" width={'100%'} height={20} />
                    <Skeleton variant="text" width={'100%'} height={20} />
                </div>

                <div className="justify-start items-center gap-[5px] inline-flex mt-3">
                    <Skeleton variant="text" width={'100%'} height={20} />
                </div>

                <div className="flex flex-row items-center justify-content-between">
                    <Skeleton variant="text" width={'100%'} height={20} />
                </div>
            </div>
        </div>
    )
}

export default NewsGrid;