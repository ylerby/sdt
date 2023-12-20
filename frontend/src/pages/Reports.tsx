import React, { useCallback, useState } from "react";
import { Flex, TextInput, Text, Button, Card, Table } from "@gravity-ui/uikit";
import { ADS_COLUMNS, MAP, TRANSACTIONS_COLUMNS } from "./../constants";
import { toaster } from "@gravity-ui/uikit/toaster-singleton";

interface ReportsPageProps {}

const REPORTS = [
  "Наиболее прибыльная сделка по продажам", // date
  "Наименее прибыльная сделка по продажам", // date
  "Наиболее прибыльная сделка по аренде", // date
  "Наименее прибыльная сделка по аренде", // date
  "Отчет по риэлторам", // date
  "Динамика продаж/аренды",
  "Средняя цена за квадратный метр в различных районах",
  "Топ-5 агентов по количеству сделок",
  "Количество продаж/аренды и средняя цена", // date
];

const mapping: Record<string, string> = {
  AveragePrice: "Средняя цена сделки",
  TransactionNumber: "Количество транзакций",
  NumberOfTransaction: "Количество сделок",
  FullName: "Имя",
  TransactionId: "Номер транзакции",
};

export const columns1 = [
  {
    id: "AgentFullName",
    name: "Агент",
  },
  {
    name: "Средняя цена сделки",
    id: "AveragePrice",
  },
  {
    name: "Количество транзакций",
    id: "TransactionNumber",
  },
];

export const columns2 = [
  {
    id: "NumberOfTransaction",
    name: mapping["NumberOfTransaction"],
    width: "50%",
    className: "column",
    maxWidth: "none",
  },
  {
    name: "Дата",
    id: "TransactionDate",
    className: "column",
    width: "50%",
    maxWidth: "none",
    template: (val: any) => val.TransactionDate.slice(0, 10),
  },
];

export const columns3 = [
  {
    id: "AveragePrice",
    name: mapping["AveragePrice"],
    className: "column",
  },
  {
    name: "Район",
    id: "District",
    className: "column",
  },
];

export const columns4 = [
  {
    id: "FullName",
    name: mapping["FullName"],
    className: "column",
  },
  {
    id: "NumberOfTransaction",
    name: mapping["NumberOfTransaction"],
    className: "column",
  },
];

export const columns5 = [
  {
    id: "AveragePrice",
    name: mapping["AveragePrice"],
    className: "column",
  },
  {
    id: "DealTypeName",
    name: "Тип сделки",
    className: "column",
  },
  {
    id: "NumberOfTransaction",
    name: mapping["NumberOfTransaction"],
    className: "column",
  },
];

const REPORTS_WITH_DATES = [0, 1, 2, 3, 4, 8];

export const ReportsPage = (props: ReportsPageProps) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | undefined>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>[]>([]);

  const onGetReport = useCallback(() => {
    if (
      (!startDate || !endDate) &&
      REPORTS_WITH_DATES.includes(activeItemIndex as number)
    ) {
      toaster.add({
        name: Math.random().toString(),
        content: "Выберите даты",
        type: "error",
        autoHiding: 2000,
      });
      return;
    }
    if (
      startDate > endDate &&
      REPORTS_WITH_DATES.includes(activeItemIndex as number)
    ) {
      toaster.add({
        name: Math.random().toString(),
        content: "Начало интервала должно быть больше конца",
        type: "error",
        autoHiding: 2000,
      });
      return;
    }
    switch (activeItemIndex) {
      case 0: {
        fetch("/record/profitable", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][0],
            SortField: "DESC",
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 1: {
        fetch("/record/profitable", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][0],
            SortField: "ASC",
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 2: {
        fetch("/record/profitable", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][1],
            SortField: "DESC",
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 3: {
        fetch("/record/profitable", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][1],
            SortField: "ASC",
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 4: {
        fetch("/record/agent_record", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][1],
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 5: {
        fetch("/record/dynamics", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 6: {
        fetch("/record/average", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 7: {
        fetch("/record/top_agents", {
          method: "POST",
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
      case 8: {
        fetch("/record/sales_count", {
          method: "POST",
          body: JSON.stringify({
            FirstDate: startDate,
            SecondDate: endDate,
            DealTypeName: MAP["DealType"][1],
          }),
        })
          .then((res) => res.json())
          .then((res) => setFields(res.Data));
        break;
      }
    }
  }, [activeItemIndex, endDate, startDate]);

  const getTranslation = (key: string) => {
    const ad = ADS_COLUMNS.find((column) => column.id === key);
    const transaction = TRANSACTIONS_COLUMNS.find(
      (column) => column.id === key
    );
    if (ad) {
      return ad.name;
    }
    if (transaction) {
      return transaction.name;
    }
    if (mapping[key]) {
      return mapping[key];
    }
    return key;
  };

  return (
    <Flex className="app" gap={3}>
      <Card style={{ height: "min-content" }}>
        <Flex
          direction="column"
          gap={3}
          alignItems="center"
          style={{ padding: "20px" }}
        >
          <Text variant="header-1"> Выберите тип отчета</Text>
          <Flex direction="column" gap={2}>
            {REPORTS.map((report) => (
              <Button key={report} className={`ReportsPage__listItem`}>
                <div
                  style={{ width: "100%" }}
                  data-report={report}
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    const target = event.target as HTMLDivElement;
                    const report = target.dataset.report;
                    const index = REPORTS.findIndex((item) => item === report);

                    if (index !== -1) {
                      setFields([]);
                      setActiveItemIndex(index);
                    }
                  }}
                >
                  {report}
                </div>
              </Button>
            ))}
          </Flex>
        </Flex>
      </Card>
      {activeItemIndex !== undefined && (
        <Flex
          direction="column"
          gap={3}
          alignItems="center"
          style={{ padding: "0 150px", flex: 1, width: "800px" }}
        >
          <Text variant="header-1">{REPORTS[activeItemIndex]}</Text>
          <Flex gap={1} justifyContent="flex-end" style={{ width: "100%" }}>
            {REPORTS_WITH_DATES.includes(activeItemIndex) && (
              <>
                <TextInput
                  type="date"
                  value={startDate}
                  onUpdate={(startDate) => setStartDate(startDate)}
                />
                <TextInput
                  type="date"
                  value={endDate}
                  onUpdate={(endDate) => setEndDate(endDate)}
                />
              </>
            )}
            <Button
              view="action"
              style={{ alignSelf: "flex-end" }}
              onClick={onGetReport}
            >
              Выгрузить
            </Button>
          </Flex>
          {Boolean(fields.length) && activeItemIndex === 4 && (
            <Table className="test" columns={columns1} data={fields} />
          )}
          {Boolean(fields.length) && activeItemIndex === 5 && (
            <Table
              className="test"
              columns={columns2}
              data={fields}
              getRowClassNames={() => ["row"]}
            />
          )}
          {Boolean(fields.length) && activeItemIndex === 6 && (
            <Table
              className="test"
              columns={columns3}
              data={fields}
              getRowClassNames={() => ["row"]}
            />
          )}
          {Boolean(fields.length) && activeItemIndex === 7 && (
            <Table
              className="test"
              columns={columns4}
              data={fields}
              getRowClassNames={() => ["row"]}
            />
          )}
          {Boolean(fields.length) && activeItemIndex === 8 && (
            <Table
              className="test"
              columns={columns5}
              data={fields}
              getRowClassNames={() => ["row"]}
            />
          )}
          {![4, 5, 6, 7, 8].includes(activeItemIndex) &&
            fields.map((item) => (
              <>
                {Object.entries(item).map(([key, value]) => (
                  <>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      key={key}
                      style={{ alignSelf: "flex-start", width: "100%" }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text variant="subheader-3">{getTranslation(key)}</Text>
                      </div>
                      <Text style={{ flex: 1, textAlign: "end" }}>
                        {key === "TransactionDate" ? value.slice(0, 10) : value}
                      </Text>
                    </Flex>
                  </>
                ))}
              </>
            ))}
        </Flex>
      )}
    </Flex>
  );
};
