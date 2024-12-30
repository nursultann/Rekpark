import React from "react";
import logo from "../../../dist/img/logo.png";

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Logo Section */}
                <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-12 pb-8">
                    <div className="max-w-[200px] mx-auto">
                        <img 
                            src={logo} 
                            alt="Рек-ПАРК логотип" 
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 py-8 sm:px-12">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        О нас
                    </h1>

                    <div className="space-y-6 text-gray-600 leading-relaxed">
                        <p>
                            «Рек-ПАРК» — это современная электронная версия популярной рекламно-информационной газеты «Ош-ПАРК». Мы создали универсальную онлайн-платформу, где каждый может найти или продать товары, предложить услуги и развивать свой бизнес.
                        </p>

                        <p>
                            Наша миссия — сделать процесс покупки, продажи и обмена максимально удобным для каждого пользователя. Мы постоянно развиваемся и улучшаем платформу, учитывая ваши пожелания и отзывы.
                        </p>

                        <div className="bg-blue-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-blue-900 mb-4">
                                Для бизнеса
                            </h2>
                            <p className="text-blue-800">
                                Владельцам компаний мы предлагаем особые возможности: создание онлайн-магазина, персональный бизнес-профиль и расширенные инструменты для продвижения. Развивайте свой бизнес вместе с нами!
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Что вы найдете на нашем сайте:
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Актуальные объявления о товарах и услугах</li>
                                <li>Интересные статьи о нашей Родине</li>
                                <li>Афишу городских событий</li>
                                <li>Фотогалерею</li>
                                <li>Полезную информацию для жизни и бизнеса</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl text-center">
                            <p className="font-medium text-gray-900">
                                Мы ценим каждое ваше мнение и всегда открыты к диалогу. Ваши отзывы помогают нам становиться лучше для вас!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;