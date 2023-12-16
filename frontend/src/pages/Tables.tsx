import React, { useState } from "react";
import { Flex, Tabs } from "@gravity-ui/uikit";
import { Path } from "types";
import { AdsTable } from "components/AdsTable";
import { TransactionsTable } from "components/TransactionsTable";

interface TablesPageProps {
  path: Path;
}

export const TablesPage = ({ path: mode }: TablesPageProps) => {
  const [activeTab, setActiveTab] = useState("Объявления");

  return (
    <Flex className="app" direction="column" gap={2}>
      {mode === "/admin" && (
        <Tabs
          items={[
            { id: "Объявления", title: "Объявления" },
            { id: "Транзакции", title: "Транзакции" },
          ]}
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
        />
      )}
      {activeTab === "Объявления" && <AdsTable path={mode} />}
      {activeTab === "Транзакции" && <TransactionsTable />}
    </Flex>
  );
};
