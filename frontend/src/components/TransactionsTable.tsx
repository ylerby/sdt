import React, { useCallback, useEffect, useState } from "react";
import {
  Flex,
  Table as _Table,
  TextInput,
  Button,
  Dialog,
  Text,
  Select,
} from "@gravity-ui/uikit";
import { toaster } from "@gravity-ui/uikit/toaster-singleton";
import {
  TRANSACTIONS_COLUMNS,
  MAP,
  clients,
  agents,
  TRANSACTION_CREATE_COLUMNS,
  REVERSE_MAP,
} from "../constants";
import { Draft, GetResponseTransaction, Transaction } from "types";

const Table = _Table;
const ACTION_SIZE = "l";

interface TransactionsTableProps {
  selectedAd?: number;
}

const getPersonFullName = ({
  first_name,
  patronymic,
  last_name,
}: {
  first_name: string;
  patronymic: string;
  last_name: string;
}) => {
  return `${first_name} ${patronymic} ${last_name}`;
};

export const TransactionsTable = ({ selectedAd }: TransactionsTableProps) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [draft, setDraft] = useState<Draft[]>(
    new Array(TRANSACTION_CREATE_COLUMNS.length)
      .fill({})
      .map((val, ind) => ({ val: "", id: TRANSACTION_CREATE_COLUMNS[ind].id }))
  );
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  const filterFields = useCallback(
    (fields: Transaction[]) => {
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
    (data: Transaction[]) => {
      const filteredFields = filterFields(data);
      setData(filteredFields);
    },
    [filterFields]
  );

  const getElements = useCallback(
    (callback: (res: GetResponseTransaction) => void) => {
      fetch("/get/transaction", { method: "GET" })
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
    },
    []
  );

  useEffect(() => {
    getElements((res) => setFilteredData(res.Data));
  }, [filters, getElements, setFilteredData]);

  const [editRealStateId, setEditRealStateId] = useState<number>(0);

  const onDialogOpen = useCallback(
    (mode?: string) => {
      if (selectedAd === undefined && mode !== "edit") {
        toaster.add({
          name: Math.random().toString(),
          content: "Выберите объявление для создания транзакции",
          type: "error",
          autoHiding: 2000,
        });
        return;
      }
      setIsDialogOpen(true);
    },
    [selectedAd]
  );

  useEffect(() => {
    getElements((res: GetResponseTransaction) => setFilteredData(res.Data));
  }, [getElements, setFilteredData]);

  const resetDraft = () => {
    setDraft(
      new Array(TRANSACTION_CREATE_COLUMNS.length).fill({}).map((val, ind) => ({
        val: "",
        id: TRANSACTION_CREATE_COLUMNS[ind].id,
      }))
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
    if (selectedAd === undefined && dialogMode === "create") {
      return;
    }
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

    console.log(draft);

    if (draft.some((el) => String(el.val).length === 0)) {
      toaster.add({
        name: Math.random().toString(),
        content: "Все поля должны быть заполнены",
        type: "error",
        autoHiding: 2000,
      });
      return;
    }

    const getAgentId = (agent: string) => {
      return agents.find((el) => getPersonFullName(el) === agent)
        ?.agent_id as number;
    };

    const getClientId = (agent: string) => {
      return clients.find((el) => getPersonFullName(el) === agent)
        ?.client_id as number;
    };

    const preBody: Record<string, string | number> = {};
    draft.forEach((el) => {
      preBody[el.id] = el.val;
    });
    const body = {
      Price: preBody.TransactionPrice,
      DealType: REVERSE_MAP["DealType"][preBody.DealTypeName],
      RealEstates: dialogMode === "create" ? selectedAd : editRealStateId,
      Agent: getAgentId(preBody.AgentFullName as string),
      Client: getClientId(preBody.ClientFullName as string),
    };

    if (dialogMode === "create") {
      fetch("/create/transaction", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then(() => {
          getElements((res) => setFilteredData(res.Data));
          toaster.add({
            name: Math.random().toString(),
            content: "Транзакция создана",
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
      fetch("/update/transaction", {
        method: "PUT",
        body: JSON.stringify({ ...body, ID: editRealStateId }),
      })
        .then(() => {
          getElements((res) => setFilteredData(res.Data));
          toaster.add({
            name: Math.random().toString(),
            content: "Транзакция отредактирована",
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

  const Accommodation_OPTIONS = Object.values(MAP.Accommodation).map(
    (type) => ({ value: type, content: type })
  );

  const CLIENT_OPTIONS = clients
    .map((agent) => getPersonFullName(agent))
    .sort()
    .map((type) => ({ value: type, content: type }));

  const AGENTS_OPTIONS = agents
    .map((agent) => getPersonFullName(agent))
    .sort()
    .map((type) => ({ value: type, content: type }));

  const DealType_OPTIONS = Object.values(MAP.DealType).map((type) => ({
    value: type,
    content: type,
  }));

  const getName = (id: string) => {
    const column = TRANSACTIONS_COLUMNS.find((column) => column.id === id);
    return column?.name ?? "";
  };

  const onDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    resetDraft();
    setDialogMode("create");
  }, []);

  return (
    <>
      <Flex direction="column" gap={2}>
        <Flex gap={2} alignItems="center">
          <Select
            size={ACTION_SIZE}
            placeholder={getName("AccommodationTypeName")}
            options={Accommodation_OPTIONS}
            onUpdate={(values) =>
              setFilters((prev) => ({
                ...prev,
                AccommodationTypeName: values[0],
              }))
            }
            hasClear
          />
          <Select
            size={ACTION_SIZE}
            placeholder={getName("DealTypeName")}
            options={DealType_OPTIONS}
            onUpdate={(values) => {
              setFilters((prev) => ({
                ...prev,
                DealTypeName: values[0],
              }));
            }}
            hasClear
          />
          <Select
            placeholder={getName("AgentFullName")}
            width="max"
            options={AGENTS_OPTIONS}
            onUpdate={(values) =>
              setFilters((prev) => ({
                ...prev,
                AgentFullName: values[0],
              }))
            }
            size={ACTION_SIZE}
            hasClear
          />
          <Select
            placeholder={getName("ClientFullName")}
            width="max"
            options={CLIENT_OPTIONS}
            onUpdate={(values) =>
              setFilters((prev) => ({
                ...prev,
                ClientFullName: values[0],
              }))
            }
            size={ACTION_SIZE}
            hasClear
          />
          <Button
            view="action"
            size={ACTION_SIZE}
            onClick={() => onDialogOpen("create")}
          >
            Создать транзакцию
          </Button>
        </Flex>
        <Table
          className="app__table transaction__table"
          data={data.slice().reverse()}
          columns={TRANSACTIONS_COLUMNS}
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
              <Text variant="header-1">
                {dialogMode === "create" ? "Создание" : "Редактирование"}{" "}
                транзакции
              </Text>
            </Flex>
          </Flex>
          <Select
            label={getName("DealTypeName")}
            value={[getValue("DealTypeName") as string]}
            options={DealType_OPTIONS}
            onUpdate={(values) => onUpdateSelect(values, "DealTypeName")}
          />
          <Select
            label={getName("AgentFullName")}
            value={[getValue("AgentFullName") as string]}
            options={AGENTS_OPTIONS}
            onUpdate={(values) => onUpdateSelect(values, "AgentFullName")}
          />
          <Select
            label={getName("ClientFullName")}
            value={[getValue("ClientFullName") as string]}
            options={CLIENT_OPTIONS}
            onUpdate={(values) => onUpdateSelect(values, "ClientFullName")}
          />
          <TextInput
            label={getName("TransactionPrice")}
            id="TransactionPrice"
            value={String(getValue("TransactionPrice"))}
            onChange={onChangeDraft}
            type="number"
          />
          <Flex justifyContent="flex-end">
            <Button view="action" onClick={onCreate}>
              {dialogMode === "create" ? "Создать" : "Редактировать"}
            </Button>
          </Flex>
        </Flex>
      </Dialog>
    </>
  );
};
