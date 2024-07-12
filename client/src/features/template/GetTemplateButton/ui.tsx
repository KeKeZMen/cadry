import { $api } from "@shared";
import { useCallback, useRef } from "react";

export const GetTemplateButton = () => {
  const aRef = useRef<HTMLAnchorElement>(null);

  const handleGetTemplate = useCallback(async () => {
    const res = await $api.get(
      "/organization/template/4eb3b4ea-9728-4d6b-ac75-dcc155c440a3/1",
      { responseType: "blob" }
    );

    if (aRef.current) {
      const href = URL.createObjectURL(res.data);
      aRef.current.href = href;
      aRef.current.download = `Шаблон.xlsx`;
    }
  }, []);

  return (
    <a
      ref={aRef}
      onClick={handleGetTemplate}
      className="bg-no-repeat bg-center h-6 w-6"
    >
      Загрузить
    </a>
  );
};
