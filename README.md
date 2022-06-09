# "Мой бюджет"

Уже залито в Яндекс.Облако, но пока еще весь функционал из MVP не реализован

## Реализованные возможности

### Безопасность

Авторизация по логину и паролю

### Главная страница

Выводить список активных счетов и остатков по ним
Выводить несколько последних транзакций

### Общее по интерфейсу

Переключение на тёмную тему

### Счета и Категории

Управление счетами
Управление категориями
Редактирование названия счета
Отдельная страница счета
Отображение текущего остатка по счету
По умолчанию скрывать удалённые счета
Удаление счета приравнено к деактивации
Родительские категории
Отображать иерархию в селекте категорий
Отображать иерархию в списке категорий
Удаление категорий
Типизация запросов категорий (бэк)
Категории разделить на 2 таба - расходы и доходы

### Транзакции

Управление транзакциями
Отображение времени и категории транзакции
Переводы между своими счетами
Многостраничность
Указание даты транзакции
Опционально не показывать возвраты расхода и переводы между своими в селекте типов
Не давать создавать транзакции на неактивные счета

## Планы (MVP)

### Дизайн

Выбрать хороший DatePicker

### Счета и Категории

Выбор иконки счета/категории
Типизация запросов категорий (фронт)
Типизация запросов счетов (бэк и фронт)

### Транзакции

Типизация запросов (бэк и фронт)
Фильтр по счетам
Считать сумму по категории (отдельно дочерние)
Фильтр по категориям
Отображение остатка после каждой транзакции (до и после)

### Бюджетирование

Создание и просмотр бюджета на выбранный период
Отображение исполнения бюджета в % по категориям

### Аналитика

График доходов/расходов за последний год
Возможность выбора периода на графиках
Выбор категорий на графике

### Безопасность

Добавить проверки по принадлежности счета

## Планы (Следующий этап)

### Общее

Оффлайн-работа

### Дизайн

Дизайн для мобильных устройств

### Счета и Категории

Добавление транзакции со списка счетов с подстановкой счета
Получение и подстановка последнего использованного счета
Доработка алгоритма расчета остатков по счетам (добавление кэширования)

### Транзакции

Функционал тегов
Подгрузка новых транзакций по кнопке "Еще" (Infinite Queries?)
Optimistic update
Разные валюты

### Бюджетирование

Календарь платежей, напоминания о платежах

### Аналитика

Графики в различной динамике и разрезах

### Безопасность

Другие каналы авторизации (Google, VK и тд)
