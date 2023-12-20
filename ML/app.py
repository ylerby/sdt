import streamlit as st
import pandas as pd
import seaborn as sns
import json
from catboost import CatBoostRegressor
import time
import random


st.set_page_config(
    page_title="Moscow Real Estate App",
    page_icon="🏙️",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.header("Оценка стоимости вашей квартиры", divider="orange")

st.caption(
    "Для точной оценки нам нужны данные про дом, квартиру, ее параметры и ближайшее метро."
)

PATH_DATA = "data/moscow.csv"
PATH_DATA_VIEW = "data/dataset_to_deploy.csv"
PATH_UNIQUE_JSON = "data/unique.json"
PATH_METRO_DIST ="data/moscow_stations_distances.json"
PATH_MODEL = "models/catboost_model.cbm"
PATH_METRO_LIST = "data/metro.json"


@st.cache_data
def load_data(path):
    data = pd.read_csv(path)
    data = data.sample(20000)
    return data


@st.cache_data
def load_data_view(path):
    data = pd.read_csv(path)
    data = data.head(30000)
    return data


@st.cache_data
def load_model(path):
    model = CatBoostRegressor()
    model.load_model(PATH_MODEL)
    return model


@st.cache_data
def transform(data):
    colors = sns.color_palette("coolwarm").as_hex()
    n_colors = len(colors)
    data = data.reset_index(drop=True)
    data["metric"] = data["price"] / data["area"]
    data["label_colors"] = pd.qcut(data["metric"], n_colors, labels=colors).astype(
        "str"
    )
    return data


df = load_data(PATH_DATA)
df = transform(df)

df_view = load_data_view(PATH_DATA_VIEW )
df_view = df_view.drop(
    [
        "Unnamed: 0",
        "date",
        "time",
        "geo_lat",
        "geo_lon",
        "level_to_levels",
        "area_to_rooms",
    ],
    axis=1,
)

df_view.rename(
    columns={
        "building_type": "Тип дома",
        "level": "Этаж",
        "levels": "Количество этажей",
        "rooms": "Количество комнат",
        "area": "Площадь",
        "kitchen_area": "Площадь кухни",
        "object_type": "Новизна квартиры",
        "kremlin_dist": "Расстояние до центра",
        "apartment_type": "Тип квартиры",
        "nearest_metro_station": "Ближайшая станция метро",
        "metro_dist": "Расстояние до метро",
        "walk_time_to_metro": "Среднее время до метро",
        "price": "Цена",
    },
    inplace=True,
)

st.subheader("Квартиры на карте")
st.map(data=df, latitude="geo_lat", longitude="geo_lon", color="label_colors")


st.subheader("Пример параметров различных квартир", divider="orange")
df_view = df_view.head(5)
st.dataframe(df_view)


with open(PATH_UNIQUE_JSON) as file:
    dict_unique = json.load(file)

with open(PATH_METRO_LIST) as file:
    dict_metro = json.load(file)

with open(PATH_METRO_DIST, "r", encoding="utf-8") as file:
    metro_data = json.load(file)

# Создаем словарь для удобного доступа к расстояниям по названию станции
dist_metro = {
    station["Станция"]: station["Расстояние от Кремля (км)"] for station in metro_data
}


st.sidebar.subheader("Введите параметры вашей квартиры", divider="orange")

building_type_mapping = {
    "Монолитный": "Monolithic",
    "Панельный": "Panel",
    "Кирпичный": "Brick",
    "Блочный": "Blocky",
    "Другой": "Other",
    "Деревянный": "Wooden"
}

object_type_mapping = {
    "Новая": "New Building",
    "Вторичная": "Secondary Real Estate"
}

apartment_type_mapping = {
    "Квартира": "Flat",
    "Студия": "Studio"
}


building_type = st.sidebar.selectbox("Тип дома", ["Монолитный", "Панельный", "Кирпичный", "Блочный", "Другой", "Деревянный"])
object_type = st.sidebar.selectbox("Новизна квартиры", ["Новая", "Вторичная"])
apartment_type = st.sidebar.selectbox("Тип квартиры", ["Квартира", "Студия"])

building_type = building_type_mapping[building_type]
object_type = object_type_mapping[object_type]
apartment_type = apartment_type_mapping[apartment_type]


sorted_metro = sorted(dict_metro["Станция"])
nearest_metro_station = st.sidebar.selectbox(
    "Ближайшая станция метро", sorted_metro, key="Станция"
)

sorted_rooms = sorted(dict_unique["rooms"])
rooms = st.sidebar.select_slider("Количество комнат", options=sorted_rooms)

area = st.sidebar.slider(
    "Площадь квартиры (кв. м)",
    min_value=min(dict_unique["area"]),
    max_value=max(dict_unique["area"]),
)

kitchen_area = st.sidebar.slider(
    "Площадь кухни (кв. м)",
    min_value=min(dict_unique["kitchen_area"]),
    max_value=max(dict_unique["kitchen_area"]),
)

level = st.sidebar.slider(
    "На каком этаже расположена квартира?",
    min_value=min(dict_unique["level"]),
    max_value=max(dict_unique["level"]),
)

levels = st.sidebar.slider(
    "Сколько этажей в доме?",
    min_value=min(dict_unique["levels"]),
    max_value=max(dict_unique["levels"]),
)


kremlin_dist = st.sidebar.slider(
    "Расстояние от центра (км)",
    min_value=min(dict_unique["kremlin_dist"]),
    max_value=max(dict_unique["kremlin_dist"]),
    step=0.1,
)

if nearest_metro_station in dist_metro:
    distance_to_kremlin = dist_metro[nearest_metro_station]
    rounded_distance = round(distance_to_kremlin, 2)
    st.sidebar.info(
        f"Подсказка. Расстояние от вашей выбранной станции {nearest_metro_station} до центра Москвы: {rounded_distance} км"
    )


metro_dist = st.sidebar.slider(
    "Расстояние до метро (км)",
    min_value=min(dict_unique["metro_dist"]),
    max_value=max(dict_unique["metro_dist"]),
    step=0.1,
)

walk_time_to_metro = st.sidebar.slider(
    "Сколько времени занимает путь пешком до метро?",
    min_value=min(dict_unique["walk_time_to_metro"]),
    max_value=max(dict_unique["walk_time_to_metro"]),
    step=0.1,
)

level_to_levels = level / levels


if rooms == 0:
    area_to_rooms = area
else:
    area_to_rooms = abs(area / rooms)

st.sidebar.subheader("Дополнительные параметры", divider="orange")
st.sidebar.caption("Пропустите вопросы, если затрудняетесь ответить")


ceiling = st.sidebar.number_input(
    "Укажите высоту потолков (м)", max_value=4.0, min_value=2.0, step=0.5
)

windows = st.sidebar.selectbox(
    "Куда выходят окна?",
    ("Во двор", "На улицу", "Во двоц и на улицу", "Не знаю"),
    index=None,
    placeholder="Куда падает ваш взгляд по утрам?",
)

year = st.sidebar.number_input(
    "Год постройки дома", value=None, max_value=2023, step=1, placeholder=1980
)

repair = st.sidebar.selectbox(
    "Выберите текущий тип ремонта",
    ("Квартира без ремонта", "Евро", "Косметический", "Дизайнерский"),
    index=None,
    placeholder="Тип ремонта",
)


repair_home = st.sidebar.selectbox(
    "Сколько лет ремонту?",
    ("Менее года", "От года до 5 лет", "От 5 до 10 лет", "Более 10 лет"),
    index=None,
    placeholder="Давно был ремонт?",
)

options = st.sidebar.multiselect(
    "Продаете вместе с техникой и мебелью?",
    ["С техникой", "С мебелью"],
    placeholder="Что-то оставите в квартире?",
)

infrastructure = st.sidebar.multiselect(
    "Укажите инфраструктуру рядом с домом",
    ["Школа", "Детский сад", "Поликлиника", "Магазин"],
    placeholder="Комфортное местоположение?",
)

balcony = st.sidebar.toggle("Есть лоджия или балкон?")

flag = False
if area < kitchen_area:
    st.sidebar.error("Площадь кухни не может быть больше общей площади!")
    flag = True


if year != None and year < 1800:
    st.sidebar.warning("Год постройки кажется некорректным. Вы уверены?")


if levels < level:
    st.sidebar.error("Этажей в здании меньше, чем выбранный этаж!")
    flag = True

if building_type == "Wooden" and levels > 6:
    st.sidebar.warning(
        f"Нам кажется, что деревянного {levels}-этажного дома не существует. Вы уверены в своем запросе?"
    )

if building_type = "Кирпичный":
    

dict_data = {
    "building_type": building_type,
    "level": level,
    "levels": levels,
    "rooms": rooms,
    "area": area,
    "kitchen_area": kitchen_area,
    "object_type": object_type,
    "kremlin_dist": kremlin_dist,
    "apartment_type": apartment_type,
    "nearest_metro_station": nearest_metro_station,
    "metro_dist": metro_dist,
    "walk_time_to_metro": walk_time_to_metro,
    "level_to_levels": level_to_levels,
    "area_to_rooms": area_to_rooms,
}

cat_features = [
    "building_type",
    "object_type",
    "apartment_type",
    "nearest_metro_station",
]


data_predict = pd.DataFrame([dict_data])

for c in cat_features:
    data_predict[c] = data_predict[c].astype(str)

model = load_model(PATH_MODEL)

st.subheader("Оценка стоимости", divider="orange")
st.info(
    "После всех выбранных параметров вашей недвижимости, здесь появится спрогнозированная цена. Предупреждаем, что оценка не будет являться максимально точной, поскольку цена зависит от многих факторов, в том числе и от состояния рынка недвижимости. Для получения наиболее точной оценки стоимости вашей квартиры необходимо обратиться к специалисту."
)

if flag == False:
    button = st.sidebar.button("Оценить стоимость вашей квартиры", type="primary")

    if button:
        with st.spinner("Пожалуйста, подождите, идет прогнозирование цены!"):
            time.sleep(2)

        prediction = model.predict(data_predict)

        prediction = int(prediction[0])

        if balcony and ceiling >= 3:
            prediction += random.randrange(500000, 600000)

        if repair == "Евро" or repair == "Дизайнерский":
            prediction += random.randrange(2500000, 2700000)
        elif repair == "Квартира без ремонта":
            prediction -= random.randrange(2200000, 2300000)

        for i in options:
            if i == any(options):
                prediction += random.randrange(1100000, 1300000)
            else:
                prediction += random.randrange(1900000, 2000000)

        for i in infrastructure:
            if i == any(infrastructure):
                prediction += random.randrange(1100000, 1300000)
            else:
                prediction += random.randrange(1900000, 2000000)

        if repair_home == "Менее года":
            prediction += random.randrange(1500000, 2000000)
        elif repair_home == "От года до 5 лет":
            prediction += random.randrange(800000, 900000)
        elif repair_home == "Более 10 лет":
            prediction -= random.randrange(800000, 900000)

        if year == None:
            pass
        elif year > 2005:
            prediction += random.randrange(3000000, 4000000)

        if windows == "Во двоц и на улицу":
            prediction += random.randrange(800000, 900000)

        metro_stations_top = [
            "Охотный ряд",
            "Китай-город",
            "Маяковская",
            "Пушкинская",
            "Кузнецкий мост",
            "Арбатская",
            "Чеховская",
            "Тверская",
            "Парк культуры",
            "Смоленская",
            "Площадь Революции",
            "Лубянка",
        ]
        metro_stations_top_2 = [
            "Библиотека им.Ленина",
            "Александровский сад",
            "Деловой центр",
            "Кропоткинская",
            "Тургеневская",
            "Третьяковская",
            "Театральная",
            "Чистые пруды",
            "Боровицкая",
            "Новокузнецкая",
        ]
        metro_stations_top_3 = [
            "Таганская",
            "Сухаревская",
            "Цветной бульвар",
            "Динамо",
            "Баррикадная",
            "Киевская",
            "ЦСКА",
            "Проспект Мира",
            "Белорусская",
            "Деловой центр",
        ]

        if nearest_metro_station in metro_stations_top:
            prediction += random.randrange(32000000, 35000000)
        elif nearest_metro_station in metro_stations_top_2:
            prediction += random.randrange(25000000, 29000000)
        elif nearest_metro_station in metro_stations_top_3:
            prediction += random.randrange(18000000, 22000000)

        formatted_predict = "{:,} рублей".format(prediction)

        area_info = int(area)
        area_info = "{:,}".format(area_info)

        info = (
            f"{rooms}-комн. квартира · {area_info} м² · Метро {nearest_metro_station}"
        )

        st.metric(label="Квартира", value=info, delta_color="off")

        st.metric(
            label="Примерная стоимость",
            value=formatted_predict,
            delta=0.5,
            delta_color="inverse",
        )

        st.success("Готово!")


