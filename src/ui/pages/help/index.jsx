import React from "react";

const PublicationHelp = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-8 sm:px-12">
                    {/* Header */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Как правильно подать объявление
                    </h1>

                    {/* Introduction */}
                    <div className="bg-blue-50 p-6 rounded-xl mb-8">
                        <p className="text-blue-800">
                            Правильно составленное объявление поможет вам быстрее найти покупателя или клиента. 
                            Следуйте нашим рекомендациям для достижения лучшего результата.
                        </p>
                    </div>

                    {/* Main content */}
                    <div className="space-y-8 text-gray-600">
                        {/* Step 1 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                1. Выбор категории
                            </h2>
                            <p>
                                Правильно выбранная категория поможет вашему объявлению найти свою целевую аудиторию:
                            </p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Внимательно изучите список категорий</li>
                                <li>Выберите наиболее подходящую для вашего товара или услуги</li>
                                <li>Не размещайте объявление в несколько категорий одновременно</li>
                            </ul>
                        </section>

                        {/* Step 2 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                2. Составление заголовка
                            </h2>
                            <p>
                                Заголовок – это первое, что видят пользователи. Он должен быть:
                            </p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Информативным и отражать суть объявления</li>
                                <li>Содержать ключевые характеристики товара</li>
                                <li>Не использовать ЗАГЛАВНЫЕ буквы без необходимости</li>
                                <li>Длиной не более 70 символов</li>
                            </ul>
                        </section>

                        {/* Step 3 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                3. Описание объявления
                            </h2>
                            <p>
                                Подробное описание повышает шансы на успешную продажу:
                            </p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Укажите все важные характеристики товара или услуги</li>
                                <li>Опишите состояние товара, если он б/у</li>
                                <li>Укажите реальную цену</li>
                                <li>Избегайте орфографических ошибок</li>
                                <li>Не используйте повторяющийся текст</li>
                            </ul>
                        </section>

                        {/* Step 4 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                4. Добавление фотографий
                            </h2>
                            <p>
                                Качественные фотографии увеличивают просмотры в 3-5 раз:
                            </p>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Загружайте четкие, качественные фотографии</li>
                                <li>Фотографируйте товар с разных ракурсов</li>
                                <li>Используйте хорошее освещение</li>
                                <li>Размер фото должен быть не менее 800х600 пикселей</li>
                            </ul>
                        </section>

                        {/* Step 5 */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                5. Контактная информация
                            </h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Указывайте актуальный номер телефона</li>
                                <li>Проверяйте правильность введенного email</li>
                                <li>Укажите удобное время для связи</li>
                                <li>По возможности, добавьте альтернативный способ связи</li>
                            </ul>
                        </section>

                        {/* Tips */}
                        <div className="bg-green-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-green-900 mb-4">
                                Полезные советы
                            </h2>
                            <ul className="list-disc ml-6 space-y-2 text-green-800">
                                <li>Регулярно обновляйте объявление для поддержания его в топе</li>
                                <li>Своевременно отвечайте на сообщения и звонки</li>
                                <li>Удаляйте объявление после продажи товара</li>
                                <li>Следите за актуальностью указанной цены</li>
                            </ul>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-50 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                                Важно!
                            </h2>
                            <p className="text-yellow-800">
                                Запрещается размещать объявления о продаже запрещенных товаров и услуг. 
                                Администрация сайта оставляет за собой право удалять объявления, 
                                нарушающие правила площадки.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationHelp;