import { axiosWithAuth } from "@shared";
import { FC, useCallback, useRef } from "react";

type PropsType = {
  organizationId: string;
  specialityId: number;
};

export const GetTemplateButton: FC<PropsType> = ({
  organizationId,
  specialityId,
}) => {
  const aRef = useRef<HTMLAnchorElement>(null);

  const handleGetTemplate = useCallback(async () => {
    const res = await axiosWithAuth.get(
      `/organization/template/${organizationId}/${specialityId}`,
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
