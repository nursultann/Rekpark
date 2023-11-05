import React from "react"
import { Modal, Comment, Avatar, List, Popconfirm } from 'antd';
import { SendOutlined } from "@ant-design/icons"
import { useUserStore } from "../../../../store/user_store"
import useProductComments from "../../../../hooks/comment"
import Conditional from "../../../components/conditional";

const CommentList = ({ comments, userId, onDelete }) => {

    return (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'Комментариев' : 'Комментариев'}`}
            itemLayout="horizontal"
            className="w-full h-full mt-[20px] overflow-scroll"
            renderItem={item => <Comment
                actions={[
                    <Conditional
                        condition={item.user_id !== userId}
                    >
                        <span key="" onClick={() => { }}>Ответить</span>
                    </Conditional>,
                    <Conditional
                        condition={item.user_id === userId}
                    >
                        <Popconfirm
                            title="Удалить комментарий?"

                            description="Вы уверены, что хотите удалить этот комментарий?"
                            onConfirm={() => {
                                onDelete(item.id)
                            }}
                            onCancel={() => { }}
                            okText="Да"
                            cancelText="Нет"
                            okButtonProps={{ danger: true }}
                        >
                            <span className="text-red-400" onClick={() => { }}>Удалить</span>
                        </Popconfirm>

                    </Conditional>,

                ]}
                avatar={<Avatar src={item.user?.image ? item.user.image : 'https://joeschmoe.io/api/v1/random'} />}
                author={item.user != null ? item.user.name : "Удаленный пользователь"}
                content={item.text}
            />}
        />
    )
}

function CommentsBlock({ product }) {
    const { user, isAuthenticated } = useUserStore()
    const isAuth = isAuthenticated

    const { comments, isLoading, createComment, deleteComment } = useProductComments(product.id)

    const [text, setText] = React.useState('')

    return (
        <div className="mt-[20px] bg-zinc-100 rounded-[10px] border border-neutral-200 flex flex-col items-start justify-center px-[30px]">
            <Conditional
                condition={isAuth}
                orElse={<div className='text-lg font-medium text-center'>Чтобы оставить комментарий, войдите в аккаунт</div>}
            >
                <div className='flex flex-col items-start justify-center h-[500px] w-full'>
                    {isLoading ? <div className='text-lg text-center'>Загрузка...</div> : (
                        comments.length === 0
                            ? <div className='text-lg text-center'>Комментариев пока нет {comments.length}</div>
                            : (
                                <CommentList
                                    comments={comments}
                                    userId={user?.id}
                                    onDelete={(id) => {
                                        deleteComment(id)
                                    }}
                                />
                            )

                    )}

                </div>
                <div className='flex flex-row w-full items-center justify-center mb-[30px] relative'>
                    <input
                        type="text"
                        className='border bg-neutral-200 rounded-[20px] px-[20px] w-full h-[58px]'
                        placeholder='Напишите что-нибудь'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <div className='absolute right-0 top-0 h-full flex flex-col justify-center items-center'>
                        <div
                            className=" bg-blue-600 rounded-[15px] flex-col justify-center items-center flex px-3.5 py-3.5 mr-2 hover:bg-blue-700 cursor-pointer active:bg-blue-800 transition-all duration-300"
                            onClick={() => {
                                createComment(text, product.id, user?.id)
                                setText('')
                            }}
                        >
                            <SendOutlined className='text-white' />
                        </div>
                    </div>

                </div>
            </Conditional>
        </div >
    )
}



export default CommentsBlock