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
  const [selectedAd, setSelectedAd] = useState<number | undefined>();

  useEffect(() => {
    window.addEventListener("popstate", () => {
      setPath(window.location.pathname as Path);
    });
  }, []);

  return (
    <ThemeProvider>
      <ToasterProvider>
        {(path === "/client" || path === "/admin") && (
          <TablesPage
            path={path}
            selectedAd={selectedAd}
            setSelectedAd={setSelectedAd}
          />
        )}
        {path === "/reports" && <ReportsPage />}
        {path === "/price" && (
          <div style={{ height: "100vh", overflow: "hidden" }}>
            <iframe
              title="sfs"
              src="https://real-estate-moscow-catboost.streamlit.app/?embed=true"
              width="100%"
              height="100%"
              // style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
            ></iframe>
          </div>
        )}
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
            <Button
              onClick={() => {
                setPath("/price");
                window.history.pushState({}, "", "/price");
              }}
              size="xl"
              view="action"
            >
              Оценить стоимость квартиры
            </Button>
          </Flex>
        )}
      </ToasterProvider>
    </ThemeProvider>
  );
};
