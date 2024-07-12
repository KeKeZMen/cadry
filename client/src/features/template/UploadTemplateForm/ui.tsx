import { $api } from "@shared";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const importTemplate = z.object({
  file: z.instanceof(FileList),
});

export const UploadTemplateForm = () => {
  const { handleSubmit, register } = useForm<z.infer<typeof importTemplate>>();

  const onSubmit: SubmitHandler<z.infer<typeof importTemplate>> = async (
    data
  ) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    await $api.post("/import", formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register("file")} />
      <button type="submit">Отправить</button>
    </form>
  );
};
