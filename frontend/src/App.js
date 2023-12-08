import React, { useCallback, useEffect, useState } from "react";
import {
  Flex,
  Table as _Table,
  TextInput,
  withTableActions,
  Button,
  Dialog,
  Text,
} from "@gravity-ui/uikit";
import { ThemeProvider } from "@gravity-ui/uikit";
import { BehaviorSubject } from "rxjs";
import { useRx } from "hooks/useRx";

const Table = withTableActions(_Table);
const ACTION_SIZE = "l";

const $editedAd = new BehaviorSubject(undefined);
const $selectedId = new BehaviorSubject(undefined);

const COLUMNS = [
  {
    id: "ApartmentNumber",
  },
  {
    id: "DealType",
  },
  {
    id: "DealTypeID",
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
    id: "Price",
  },
  {
    id: "PublicationDate",
  },
  {
    id: "RealEstateID",
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

export const App = () => {
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
      });
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
    if (item.RealEstateID === selectedId) {
      return [
        {
          text: "Отменить",
          handler: () => {
            setSelectedId(undefined);
          },
        },
        {
          text: "Сохранить",
          handler: (ad, ind) => {},
        },
      ];
    }

    return [
      {
        text: "Редактировать",
        handler: (ad, ind) => {
          setSelectedId(ad.id);
          setEditedAd(ad);
        },
      },
      {
        text: "Удалить",
        handler: (ad, ind) => {
          fetch("/delete", { method: "DELETE" });
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
    new Array(COLUMNS.length)
      .fill({})
      .map((val, ind) => ({ val: "", id: COLUMNS[ind].id }))
  );
  const onChangeDraft = (event) => {
    const value = event.target.value;
    const id = event.target.id;
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
            <Button view="action" size={ACTION_SIZE} onClick={onDialogOpen}>
              Создать объявление
            </Button>
          </Flex>
          <Table
            className="app__table"
            data={data}
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
          <Flex direction="column" gap={2}>
            <Flex alignItems="center" justifyContent="center">
              <Text variant="header-1">Создание объявления</Text>
            </Flex>
            <TextInput
              placeholder="ApartmentNumber"
              id="ApartmentNumber"
              value={getValue("ApartmentNumber")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="DealType"
              id="DealType"
              value={getValue("DealType")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="District"
              id="District"
              value={getValue("District")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="Floor"
              id="Floor"
              value={getValue("Floor")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="FloorsCount"
              id="FloorsCount"
              value={getValue("FloorsCount")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="HouseNumber"
              id="HouseNumber"
              value={getValue("HouseNumber")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="Metro"
              id="Metro"
              value={getValue("Metro")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="Price"
              id="Price"
              value={getValue("Price")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="RoomsCount"
              id="RoomsCount"
              value={getValue("RoomsCount")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="Street"
              id="Street"
              value={getValue("Street")}
              onChange={onChangeDraft}
            />
            <TextInput
              placeholder="TotalMeters"
              id="TotalMeters"
              value={getValue("TotalMeters")}
              onChange={onChangeDraft}
            />
          </Flex>
        </Dialog>
      </Flex>
    </ThemeProvider>
  );
};
