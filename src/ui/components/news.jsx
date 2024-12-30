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

                <div className="grid gap-4 mt-[25px] xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2">
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

function NewsItem({ item }) {
    return (
        <div className="max-w-md pb-3 rounded-lg border border-neutral-200 flex flex-col">
            <Link to={`/article/${item.id}`}>
                {/* Image Section */}
                <div className="w-full h-[190px] overflow-hidden rounded-t-lg">
                    <img
                        className="w-full h-full object-cover"
                        src={item?.image}
                        alt={item.title || 'News image'}
                    />
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col">
                    {/* Title and Description */}
                    <div className="mb-3">
                        <h3 className="text-neutral-800 text-sm font-medium">
                            {item.title}
                        </h3>
                        <p className="mt-1 text-neutral-400 text-xs font-medium line-clamp-2">
                            {maxSymbolEllipsis(item.text, 70)}
                        </p>
                    </div>

                    {/* Region and Date */}
                    <div className="flex justify-between items-center text-xs text-neutral-800">
                        <div>
                            <span className="text-zinc-500 font-medium">Регион:</span>{' '}
                            <span className="font-normal">г.Бишкек</span>
                        </div>
                        <span>Сегодня 13:01</span>
                    </div>

                    {/* Reactions */}
                    <div className="mt-3 flex justify-between items-center">
                        {/* Comments */}
                        <div className="flex items-center gap-1.5">
                            <img
                                src={chat_bubble_outline}
                                alt="Comments"
                                className="w-4 h-4"
                            />
                            <span className="text-neutral-800 text-sm font-normal">
                                10
                            </span>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-1.5">
                            <img
                                src={heart_outline}
                                alt="Likes"
                                className="w-4 h-4"
                            />
                            <span className="text-neutral-800 text-sm font-normal">
                                50
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
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