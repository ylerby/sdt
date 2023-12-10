import { RealEstate } from "types";

export const MAP: Record<string, Record<number, string>> = {
  DealType: {
    0: "Купли-продажа",
    1: "Аренда",
  },
  Accommodation: {
    0: "Квартира",
    1: "Частный дом",
    2: "Таун-хаус",
    3: "Аппартаменты",
  },
};

export const REVERSE_MAP: Record<string, Record<string, number>> = {
  DealType: {
    "Купли-продажа": 0,
    Аренда: 1,
  },
  Accommodation: {
    Квартира: 0,
    "Частный дом": 1,
    "Таун-хаус": 2,
    Аппартаменты: 3,
  },
};

export const COLUMNS = [
  {
    id: "Accommodation",
    name: "Тип недвижимости",
    template: (val: RealEstate) => MAP["Accommodation"][val.Accommodation],
  },
  {
    name: "Тип сделки",
    id: "DealType",
    template: (val: RealEstate) => MAP["DealType"][val.DealType],
  },
  {
    name: "Улица",
    id: "Street",
  },
  {
    name: "Номер дома",
    id: "HouseNumber",
  },
  {
    name: "Этаж",
    id: "Floor",
  },
  {
    name: "Этажей в доме",
    id: "FloorsCount",
  },
  {
    name: "Номер квартиры",
    id: "ApartmentNumber",
  },
  {
    name: "Число комнат",
    id: "RoomsCount",
  },
  {
    name: "Площадь",
    id: "TotalMeters",
  },
  {
    name: "Район",
    id: "District",
  },
  {
    name: "Станция метро",
    id: "Metro",
  },
  {
    name: "Дата публикации",
    id: "PublicationDate",
  },
  {
    name: "Цена",
    id: "Price",
  },
];

export const CREATE_COLUMNS = [
  {
    id: "ApartmentNumber",
  },
  {
    id: "DealType",
  },
  {
    id: "Accommodation",
  },
  {
    id: "District",
  },
  {
    id: "Floor",
  },
  {
    id: "FloorsCount",
  },
  {
    id: "HouseNumber",
  },
  {
    id: "Metro",
  },
  {
    id: "RoomsCount",
  },
  {
    id: "Street",
  },
  {
    id: "TotalMeters",
  },
  {
    id: "Price",
  },
];
