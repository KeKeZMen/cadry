import { Button, Dialog, DialogContent } from "@shared";
import { useCallback, useState } from "react";

export const CreateOrganizationButton = () => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = useCallback(() => setIsOpenedModal((prev) => !prev), []);

  return (
    <>
      <Button onClick={handleModal}>Создать</Button>

      <Dialog onOpenChange={handleModal} open={isOpenedModal}>
        <DialogContent></DialogContent>
      </Dialog>
    </>
  );
};
