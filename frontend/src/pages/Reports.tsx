import React, { useCallback, useState } from "react";
import { Flex, TextInput, Text, Button } from "@gravity-ui/uikit";

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

const REPORTS_WITH_DATES = [0, 1, 2, 3, 4, 8];

export const ReportsPage = (props: ReportsPageProps) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>>({
    Улица: "Беломорская",
    "Номер дома": "7к3",
  });

  const onGetReport = useCallback(() => {}, []);

  return (
    <Flex direction="column" className="app" gap={3}>
      <Text variant="header-1">Выберите тип отчета</Text>
      <Flex direction="column" gap={2}>
        {REPORTS.map((report) => (
          <Text key={report} className={`ReportsPage__listItem`}>
            <div
              data-report={report}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                const target = event.target as HTMLDivElement;
                const report = target.dataset.report;
                const index = REPORTS.findIndex((item) => item === report);

                if (index !== -1) {
                  setActiveItemIndex(index);
                }
              }}
            >
              {report}
            </div>
          </Text>
        ))}
      </Flex>
      <div style={{ height: "1px", backgroundColor: "grey" }}></div>
      {activeItemIndex !== undefined && (
        <Flex
          direction="column"
          gap={3}
          alignItems="center"
          width={700}
          style={{ alignSelf: "center" }}
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
            <Button style={{ alignSelf: "flex-end" }} onClick={onGetReport}>
              Выгрузить
            </Button>
          </Flex>
          {Object.entries(fields).map(([key, value]) => (
            <Flex
              justifyContent="center"
              alignItems="center"
              key={key}
              style={{ alignSelf: "flex-start", width: "100%" }}
            >
              <div style={{ flex: 1 }}>
                <Text variant="subheader-3">{key}</Text>
              </div>
              <Text style={{ flex: 1, textAlign: "end" }}>{value}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
