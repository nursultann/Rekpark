import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/user_store"
import classNames from "classnames";

function Profilelayout({ children }) {
    const auth = useUserStore()
    const user = auth.user
    const navigate = useNavigate()
    const location = useLocation()

    const activeLink = (path) => {
        if (location.pathname === path) {
            return "rounded-[10px] h-full content-center justify-content-center justify-content-center align-items-center flex flex-row flex-1 bg-primary text-white "
        } else {
            return " rounded-[10px] h-full justify-content-center align-items-center flex flex-row flex-1"
        }
    }

    if (user === null || user === undefined || user === "") {
        return (
            <div>
                <label>Загрузка...</label>
            </div>
        )
    }

    return (
        <div className="col-12 mt-3 px-0">
            <div className="col-12 px-0 ">
                <div className="col-12 px-0 pb-3">
                    <div
                        className="nav d-flex justify-content-around content-center border rounded-[10px] py-1 h-[60px] flex flex-row gap-2 px-1"
                        id="v-pills-tab"
                        role="tablist"
                    >
                        <Link
                            className={classNames(activeLink("/profile"))}
                            id="v-pills-home-tab"
                            to="/profile"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-home"
                            aria-selected={location.pathname === "/profile" ? "true" : "false"}
                        >
                            Профиль
                        </Link>
                        <Link
                            className={classNames(activeLink("/profile/list"))}
                            id="v-pills-profile-tab"
                            to="/profile/list"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-profile"
                            aria-selected={location.pathname === "/profile/list" ? "true" : "false"}
                        >
                            Мои объявления
                        </Link>
                        <Link
                            className={classNames(activeLink("/profile/favorites"))}
                            id="v-pills-messages-tab"
                            to="/profile/favorites"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-messages"
                            aria-selected={location.pathname === "/profile/favorites" ? "true" : "false"}
                        >
                            Избранные
                        </Link>
                        <Link
                            className={classNames(activeLink("/profile/chats"))}
                            id="v-pills-settings-tab"
                            to="/profile/chats"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-settings"
                            aria-selected={location.pathname === "/profile/chats" ? "true" : "false"}
                        >
                            Сообщения
                        </Link>
                        <Link
                            className={classNames(activeLink("/profile/wallets"))}
                            id="v-pills-settings-tab"
                            to="/profile/wallets"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-settings"
                            aria-selected={location.pathname === "/profile/wallets" ? "true" : "false"}
                        >
                            Пополнить баланс
                        </Link>
                    </div>

                    <div className="tab-content mt-3" id="v-pills-tabContent">
                        <div className="tab-panel fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profilelayout