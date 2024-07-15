import { LoginForm } from "@features/auth/";
import { GetTemplateButton } from "@features/template/GetTemplateButton";
import { UploadTemplateForm } from "@features/template/UploadTemplateForm";

export default function Mainpage() {
  return (
    <div>
      <LoginForm />
      <GetTemplateButton />
      <UploadTemplateForm />
    </div>
  );
}
