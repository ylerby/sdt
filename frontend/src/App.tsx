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
  TableActionConfig,
} from "@gravity-ui/uikit";
import { ThemeProvider } from "@gravity-ui/uikit";
import { toaster } from "@gravity-ui/uikit/toaster-singleton";
import { COLUMNS, CREATE_COLUMNS, MAP, REVERSE_MAP } from "./constants";
import { GetResponse, RealEstate } from "types";

const Table = withTableActions<RealEstate>(_Table);
const ACTION_SIZE = "l";

interface Draft {
  val: number | string;
  id: string;
}

interface Field {
  val: number | string;
  id: string;
}

const AppInner = () => {
  const [textFilter, setTextFilter] = useState("");
  const [data, setData] = useState<RealEstate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [draft, setDraft] = useState<Draft[]>(
    new Array(CREATE_COLUMNS.length)
      .fill({})
      .map((val, ind) => ({ val: "", id: CREATE_COLUMNS[ind].id }))
  );
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  const filterFields = useCallback(
    (fields: RealEstate[]) => {
      if (
        Object.values(filters).every(
          (filter) => filter === undefined || !String(filter)
        )
      ) {
        return fields;
      }
      const res = fields.filter((field) =>
        Object.entries(field).every(([key, value]) => {
          if (filters[key] !== undefined && String(filters[key])) {
            if (typeof value === "number") {
              return value === filters[key];
            }
            return value.includes(filters[key]);
          }

          return true;
        })
      );

      return res;
    },
    [filters]
  );

  const setFilteredData = useCallback(
    (data: RealEstate[]) => {
      const filteredFields = filterFields(data);
      setData(filteredFields);
    },
    [filterFields]
  );

  const getElements = useCallback((callback: (res: GetResponse) => void) => {
    fetch("/get", { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        callback(res);
      })
      .catch((res) =>
        toaster.add({
          name: Math.random().toString(),
          content: res?.ResponseError,
          type: "error",
          autoHiding: 2000,
        })
      );
  }, []);

  useEffect(() => {
    getElements((res) => setFilteredData(res.Data));
  }, [filters, getElements, setFilteredData]);

  const onTextFilterUpdate = (value: string) => {
    setTextFilter(value);
    getElements((res: GetResponse) =>
      setFilteredData(
        res.Data.filter((el) =>
          Object.values(el).some((val) => String(val).includes(value))
        )
      )
    );
  };

  const [editRealStateId, setEditRealStateId] = useState<number>(0);

  const onDialogOpen = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const getRowActions = (
    item: RealEstate,
    ind: number
  ): TableActionConfig<RealEstate>[] => {
    return [
      {
        text: "Редактировать",
        handler: (ad: RealEstate, ind: number) => {
          setEditRealStateId(ad.RealEstateID);
          setDraft((drafts) =>
            drafts.map((el) => {
              const val =
                el.id === "Accommodation"
                  ? MAP["Accommodation"][ad.Accommodation as number]
                  : el.id === "DealType"
                  ? MAP["DealType"][ad.DealType as number]
                  : ad[el.id as keyof typeof ad];

              return {
                ...el,
                val,
              };
            })
          );
          setDialogMode("edit");
          onDialogOpen();
        },
      },
      {
        text: "Удалить",
        handler: ({ RealEstateID: ID }: RealEstate) => {
          fetch("/delete/estate", {
            method: "DELETE",
            body: JSON.stringify({ ID }),
          })
            .then(() => {
              getElements((res) => setFilteredData(res.Data));
              toaster.add({
                name: Math.random().toString(),
                content: "Объявление удалено",
                type: "success",
                autoHiding: 2000,
              });
            })
            .catch((res) =>
              toaster.add({
                name: Math.random().toString(),
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
    getElements((res: GetResponse) => setFilteredData(res.Data));
  }, [getElements, setFilteredData]);

  const resetDraft = () => {
    setDraft(
      new Array(CREATE_COLUMNS.length)
        .fill({})
        .map((val, ind) => ({ val: "", id: CREATE_COLUMNS[ind].id }))
    );
  };
  const onChangeDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: number | string = event.target.value;
    const id = event.target.id;
    const index = draft.findIndex((el) => el.id === id);

    if (event.target.type === "number") {
      value = parseInt(value);
    }

    if (index !== -1) {
      const updatedDraft: { val: number | string; id: string }[] = [...draft];
      updatedDraft[index].val = value;
      setDraft(updatedDraft);
    }
  };

  const onUpdateSelect = (values: string[], id: string) => {
    const value = values[0];
    const index = draft.findIndex((el) => el.id === id);

    if (index !== -1) {
      const updatedDraft = [...draft];
      updatedDraft[index].val = value;
      setDraft(updatedDraft);
    }
  };

  const getValue = (id: string) => {
    const index = draft.findIndex((el) => el.id === id);
    return draft[index].val;
  };

  const onCreate = () => {
    const negativeFields: string[] = [];
    draft.forEach((el) => {
      if (typeof el.val === "number" && el.val < 0) {
        negativeFields.push(getName(el.id));
      }
    });
    if (negativeFields.length) {
      toaster.add({
        name: Math.random().toString(),
        content: `Поля: ${negativeFields.join(
          ", "
        )} не могут быть отрицательными`,
        type: "error",
        autoHiding: 2000,
      });
      return;
    }

    draft.forEach((el) => {
      if (String(el.val).length === 0) {
        console.log(el);
      }
    });

    if (draft.some((el) => String(el.val).length === 0)) {
      toaster.add({
        name: Math.random().toString(),
        content: "Все поля должны быть заполнены",
        type: "error",
        autoHiding: 2000,
      });
      return;
    }

    const body: Record<string, string | number> = {};
    draft.forEach((el) => {
      body[el.id] = el.val;

      if (el.id === "Accommodation") {
        body[el.id] = REVERSE_MAP["Accommodation"][el.val];
      }

      if (el.id === "DealType") {
        body[el.id] = REVERSE_MAP["DealType"][el.val];
      }
    });
    if (dialogMode === "create") {
      fetch("/create/estate", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then(() => {
          getElements((res) => setFilteredData(res.Data));
          toaster.add({
            name: Math.random().toString(),
            content: "Объявление создано",
            type: "success",
            autoHiding: 2000,
          });
          setIsDialogOpen(false);
        })
        .catch((res) =>
          toaster.add({
            name: Math.random().toString(),
            content: res?.ResponseError,
            type: "error",
            autoHiding: 2000,
          })
        );
    } else {
      fetch("/update/estate", {
        method: "PUT",
        body: JSON.stringify({ ...body, ID: editRealStateId }),
      })
        .then(() => {
          getElements((res) => setFilteredData(res.Data));
          toaster.add({
            name: Math.random().toString(),
            content: "Объявление отредактировано",
            type: "success",
            autoHiding: 2000,
          });
          setIsDialogOpen(false);
        })
        .catch((res) =>
          toaster.add({
            name: Math.random().toString(),
            content: res?.ResponseError,
            type: "error",
            autoHiding: 2000,
          })
        );
    }
  };

  const DealType_OPTIONS = Object.values(MAP.DealType).map((type) => ({
    value: type,
    content: type,
  }));
  const Accommodation_OPTIONS = Object.values(MAP.Accommodation).map(
    (type) => ({ value: type, content: type })
  );

  const getName = (id: string) => {
    const column = COLUMNS.find((column) => column.id === id);
    return column?.name ?? "";
  };

  const onDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    resetDraft();
    setDialogMode("create");
  }, []);

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
              onUpdate={(values) =>
                setFilters((prev) => ({
                  ...prev,
                  Accommodation: REVERSE_MAP["Accommodation"][values[0]],
                }))
              }
              hasClear
            />
            <Select
              size={ACTION_SIZE}
              placeholder={getName("DealType")}
              options={DealType_OPTIONS}
              onUpdate={(values) => {
                setFilters((prev) => ({
                  ...prev,
                  DealType: REVERSE_MAP["DealType"][values[0]],
                }));
              }}
              hasClear
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
                label={getName("Accommodation")}
                value={[getValue("Accommodation") as string]}
                options={Accommodation_OPTIONS}
                onUpdate={(values) => onUpdateSelect(values, "Accommodation")}
              />
              <Select
                label={getName("DealType")}
                value={[getValue("DealType") as string]}
                options={DealType_OPTIONS}
                onUpdate={(values) => onUpdateSelect(values, "DealType")}
              />
              <TextInput
                label={getName("ApartmentNumber")}
                id="ApartmentNumber"
                value={String(getValue("ApartmentNumber"))}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                label={getName("District")}
                id="District"
                value={String(getValue("District"))}
                onChange={onChangeDraft}
              />
              <TextInput
                label={getName("Floor")}
                id="Floor"
                value={String(getValue("Floor"))}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                label={getName("FloorsCount")}
                id="FloorsCount"
                value={String(getValue("FloorsCount"))}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                label={getName("HouseNumber")}
                id="HouseNumber"
                value={String(getValue("HouseNumber"))}
                onChange={onChangeDraft}
              />
              <TextInput
                label={getName("Metro")}
                id="Metro"
                value={String(getValue("Metro"))}
                onChange={onChangeDraft}
              />
              <TextInput
                label={getName("RoomsCount")}
                id="RoomsCount"
                value={String(getValue("RoomsCount"))}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                label={getName("Street")}
                id="Street"
                value={String(getValue("Street"))}
                onChange={onChangeDraft}
              />
              <TextInput
                label={getName("TotalMeters")}
                id="TotalMeters"
                value={String(getValue("TotalMeters"))}
                onChange={onChangeDraft}
                type="number"
              />
              <TextInput
                label={getName("Price")}
                id="Price"
                value={String(getValue("Price"))}
                onChange={onChangeDraft}
                type="number"
              />
            </Flex>
            <Flex justifyContent="flex-end">
              <Button view="action" onClick={onCreate}>
                {dialogMode === "create" ? "Создать" : "Редактировать"}
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
