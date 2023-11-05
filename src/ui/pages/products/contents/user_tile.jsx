import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import { Link } from "react-router-dom"

function UserAvatar({ user }) {
    if (user.business_account?.logoImage) {
        return (
            <div className='rounded-circle'
                style={{
                    backgroundImage: 'url(' + user.business_account.logoImage + ')',
                    width: "50px",
                    height: "50px",
                    backgroundSize: "cover"
                }}>
                <span className='badge badge-danger'
                    style={{ marginLeft: "27px", marginTop: "35px" }}>PRO</span>
            </div>
        )
    }

    if (user.image) {
        return (
            <img className="mb-3" src={user.image} style={{ borderRadius: "50%", width: "50px", height: "50px" }} />
        )
    }

    return (
        <Avatar size={42} icon={<UserOutlined />} />
    )
}

function UserTile({ user }) {
    return (
        <div className="flex flex-row gap-[28px] items-center">
            <UserAvatar user={user} />
            <div className="flex flex-col gap-1">

                <Link className="text-dark font-weight-bold" to={"/userAds/" + user.id}>
                    {user.business_account != null ?
                        <>
                            {user.business_account.name}
                        </>
                        :
                        <>
                            {user != null ? user.name : <></>}
                        </>
                    }
                </Link>
                <p className="border rounded-xl px-2 py-1 text-muted">{user.active_count} объявлений </p>
            </div>
        </div>
    )
}

export default UserTile