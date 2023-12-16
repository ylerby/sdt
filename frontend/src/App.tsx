import {
  Button,
  Flex,
  ThemeProvider,
  ToasterProvider,
} from "@gravity-ui/uikit";
import { TablesPage } from "pages/Tables";
import { ReportsPage } from "pages/Reports";
import React, { useEffect, useState } from "react";
import { Path } from "types";

export const App = () => {
  const [path, setPath] = useState<Path>(window.location.pathname as Path);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      setPath(window.location.pathname as Path);
    });
  }, []);

  return (
    <ThemeProvider>
      <ToasterProvider>
        {(path === "/client" || path === "/admin") && (
          <TablesPage path={path} />
        )}
        {path === "/reports" && <ReportsPage />}
        {path === "/" && (
          <Flex
            alignItems="center"
            justifyContent="center"
            className="bg"
            gap={2}
          >
            <Button
              onClick={() => {
                setPath("/admin");
                window.history.pushState({}, "", "/admin");
              }}
              size="xl"
              view="action"
            >
              Админ
            </Button>
            <Button
              onClick={() => {
                setPath("/client");
                window.history.pushState({}, "", "/client");
              }}
              size="xl"
              view="action"
            >
              Клиент
            </Button>
            <Button
              onClick={() => {
                setPath("/reports");
                window.history.pushState({}, "", "/reports");
              }}
              size="xl"
              view="action"
            >
              Отчеты
            </Button>
          </Flex>
        )}
      </ToasterProvider>
    </ThemeProvider>
  );
};
