import { Button } from "@/components/ui/button";
import { useLogin } from "@/services/user";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const loginQ = useLogin();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-foreground/10">
      <div className="flex flex-col  gap-3 border p-3 bg-background rounded">
        <h1>
          Welcome to <span className="font-bold">mybricks</span>
        </h1>
        <Button
          isLoading={loginQ.isLoading}
          onClick={() => {
            loginQ.mutate(undefined, {
              onSuccess: () => {
                navigate("/app");
              },
            });
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
