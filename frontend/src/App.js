import React, { useCallback, useEffect, useState } from "react";
import {
  Flex,
  Table as _Table,
  TextInput,
  withTableActions,
  Button,
  Dialog,
  Text,
  Select,
  ToasterProvider,
} from "@gravity-ui/uikit";
import { ThemeProvider } from "@gravity-ui/uikit";
import { BehaviorSubject } from "rxjs";
import { useRx } from "hooks/useRx";
import { toaster } from "@gravity-ui/uikit/toaster-singleton";

const Table = withTableActions(_Table);
const ACTION_SIZE = "l";

const $editedAd = new BehaviorSubject(undefined);
const $selectedId = new BehaviorSubject(undefined);

const map = {
  DealType: {
    0: "Купли-продажа",
    1: "Аренда",
  },
  Accommodation: {
    0: "Квартира",
    1: "Частный дом",
    2: "Таун-хаус",
    3: "Аппартаменты",
    4: "Комната",
  },
};

const COLUMNS = [
  {
    id: "Accommodation",
    name: "Тип недвижимости",
    template: (val) => map["Accommodation"][val.Accommodation],
  },
  {
    name: "Номер квартиры",
    id: "ApartmentNumber",
  },
  {
    name: "Тип сделки",
    id: "DealType",
    template: (val) => {
      return map["DealType"][val.DealType];
    },
  },
  {
    name: "Район",
    id: "District",
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
    name: "Номер дома",
    id: "HouseNumber",
  },
  {
    name: "Станция метро",
    id: "Metro",
  },
  {
    name: "Цена",
    id: "Price",
  },
  {
    name: "Дата публикации",
    id: "PublicationDate",
  },
  {
    name: "Число комнат",
    id: "RoomsCount",
  },
  {
    name: "Улица",
    id: "Street",
  },
  {
    name: "Площадь",
    id: "TotalMeters",
  },
];

const CREATE_COLUMNS = [
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
];

const AppInner = () => {
  const [textFilter, setTextFilter] = useState("");
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useRx($selectedId);
  const [editedAd, setEditedAd] = useRx($editedAd);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getElements = (callback) => {
    fetch("/get", { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        callback(res);
      })
      .catch((res) =>
        toaster.add({
          content: res?.ResponseError,
          type: "error",
          autoHiding: 2000,
        })
      );
  };

  const onTextFilterUpdate = (value) => {
    setTextFilter(value);
    getElements((res) =>
      setData(
        res.Data.filter((el) =>
          Object.values(el).some((val) => String(val).includes(value))
        )
      )
    );
  };

  const getRowActions = (item, ind) => {
    // if (item.RealEstateID === selectedId) {
    //   return [
    //     {
    //       text: "Отменить",
    //       handler: () => {
    //         setSelectedId(undefined);
    //       },
    //     },
    //     {
    //       text: "Сохранить",
    //       handler: (ad, ind) => {},
    //     },
    //   ];
    // }

    return [
      // {
      //   text: "Редактировать",
      //   handler: (ad, ind) => {
      //     setSelectedId(ad.id);
      //     setEditedAd(ad);
      //   },
      // },
      {
        text: "Удалить",
        handler: ({ Street, HouseNumber, ApartmentNumber }) => {
          fetch("/delete/estate", {
            method: "DELETE",
            body: JSON.stringify({ Street, HouseNumber, ApartmentNumber }),
          })
            .then(() => {
              getElements((res) => setData(res.Data));
              toaster.add({
                content: "Объявление удалено",
                type: "success",
                autoHiding: 2000,
              });
            })
            .catch((res) =>
              toaster.add({
                content: res?.ResponseError,
                type: "error",
                autoHiding: 2000,
              })
            );
        },
        theme: "danger",
      },
    ];
  };

  useEffect(() => {
    getElements((res) => setData(res.Data));
  }, []);

  const onDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const onDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const [draft, setDraft] = useState(
    new Array(CREATE_COLUMNS.length)
      .fill({})
      .map((val, ind) => ({ val: "", id: CREATE_COLUMNS[ind].id }))
  );
  const resetDraft = () => {
    setDraft(
      new Array(CREATE_COLUMNS.length)
        .fill({})
        .map((val, ind) => ({ val: "", id: CREATE_COLUMNS[ind].id }))
    );
  };
  const onChangeDraft = (event) => {
    let value = event.target.value;
    const id = event.target.id;
    const index = draft.findIndex((el) => el.id === id);

    if (!Object.is(parseInt(value), NaN)) {
      value = parseInt(value);
    }

    if (index !== -1) {
      const updatedDraft = [...draft];
      updatedDraft[index].val = value;
      setDraft(updatedDraft);
    }
  };

  const onUpdateSelect = (values, id) => {
    const value = values[0];
    const index = draft.findIndex((el) => el.id === id);

    if (index !== -1) {
      const updatedDraft = [...draft];
      updatedDraft[index].val = value;
      setDraft(updatedDraft);
    }
  };

  const getValue = (id) => {
    const index = draft.findIndex((el) => el.id === id);
    if (index !== -1) {
      return draft[index].val;
    }
    return "";
  };

  const onCreate = () => {
    const negativeFields = [];
    draft.forEach((el) => {
      if (typeof el.val === "number") {
        negativeFields.push(getName(el.id));
      }
    });
    if (negativeFields.length) {
      toaster.add({
        content: `Поля: ${negativeFields.join(
          ", "
        )} не могут быть отрицательными`,
        type: "error",
        autoHiding: 2000,
      });
      return;
    }

    console.log(draft, negativeFields);

    if (draft.some((el) => String(el.val).length === 0)) {
      toaster.add({
        content: "Все поля должны быть заполнены",
        type: "error",
        autoHiding: 2000,
      });
      return;
    }

    const body = {};
    draft.forEach((el) => {
      body[el.id] = el.val;
    });

    // fetch("/create/estate", {
    //   method: "POST",
    //   body: JSON.stringify(body),
    // })
    //   .then(() => {
    //     getElements((res) => setData(res.Data));
    //     toaster.add({
    //       content: "Объявление создано",
    //       type: "success",
    //       autoHiding: 2000,
    //     });
    //     setIsDialogOpen(false);
    //     resetDraft();
    //   })
    //   .catch((res) =>
    //     toaster.add({
    //       content: res?.ResponseError,
    //       type: "error",
    //       autoHiding: 2000,
    //     })
    //   );
  };

  const DealType_OPTIONS = Object.values(map.DealType).map((type) => ({
    value: type,
    content: type,
  }));
  const Accommodation_OPTIONS = Object.values(map.Accommodation).map(
    (type) => ({ value: type, content: type })
  );

  const getName = (id) => {
    const column = COLUMNS.find((column) => column.id === id);

    if (!column) {
      console.log(id);
      return "";
    }
    return column.name;
  };

  return (
    <ThemeProvider>
      <Flex justifyContent="center" className="app">
        <Flex direction="column">
          <Flex gap={2} alignItems="center">
            <TextInput
              placeholder="Поиск..."
              size={ACTION_SIZE}
              value={textFilter}
              onUpdate={onTextFilterUpdate}
            />
            <Select
              size={ACTION_SIZE}
              placeholder={getName("Accommodation")}
              options={Accommodation_OPTIONS}
              onUpdate={(values) => onUpdateSelect(values, "Accommodation")}
            />
            <Select
              size={ACTION_SIZE}
              placeholder={getName("DealType")}
              options={DealType_OPTIONS}
              onUpdate={(values) => onUpdateSelect(values, "DealType")}
            />
            <Button view="action" size={ACTION_SIZE} onClick={onDialogOpen}>
              Создать объявление
            </Button>
          </Flex>
          <Table
            className="app__table"
            data={data.slice().reverse()}
            columns={COLUMNS}
            getRowActions={getRowActions}
          />
        </Flex>
        <Dialog
          open={isDialogOpen}
          onClose={onDialogClose}
          hasCloseButton={false}
          className="dialog"
        >
          <Flex gap={4} direction="column">
            <Flex direction="column" gap={2}>
              <Flex alignItems="center" justifyContent="center">
                <Text variant="header-1">Создание объявления</Text>
              </Flex>
              <Select
                placeholder={getName("Accommodation")}
                options={Accommodation_OPTIONS}
                onUpdate={(values) => onUpdateSelect(values, "Accommodation")}
              />
              <Select
                placeholder={getName("DealType")}
                options={DealType_OPTIONS}
                onUpdate={(values) => onUpdateSelect(values, "DealType")}
              />
              <TextInput
                placeholder={getName("ApartmentNumber")}
                id="ApartmentNumber"
                value={getValue("ApartmentNumber")}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                placeholder={getName("District")}
                id="District"
                value={getValue("District")}
                onChange={onChangeDraft}
              />
              <TextInput
                placeholder={getName("Floor")}
                id="Floor"
                value={getValue("Floor")}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                placeholder={getName("FloorsCount")}
                id="FloorsCount"
                value={getValue("FloorsCount")}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                placeholder={getName("HouseNumber")}
                id="HouseNumber"
                value={getValue("HouseNumber")}
                onChange={onChangeDraft}
              />
              <TextInput
                placeholder={getName("Metro")}
                id="Metro"
                value={getValue("Metro")}
                onChange={onChangeDraft}
              />
              <TextInput
                placeholder={getName("RoomsCount")}
                id="RoomsCount"
                value={getValue("RoomsCount")}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                placeholder={getName("Street")}
                id="Street"
                value={getValue("Street")}
                onChange={onChangeDraft}
              />
              <TextInput
                placeholder={getName("TotalMeters")}
                id="TotalMeters"
                value={getValue("TotalMeters")}
                onChange={onChangeDraft}
                type="number"
              />
            </Flex>
            <Flex justifyContent="flex-end">
              <Button view="action" onClick={onCreate}>
                Создать
              </Button>
            </Flex>
          </Flex>
        </Dialog>
      </Flex>
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <ToasterProvider>
      <AppInner />
    </ToasterProvider>
  );
};
