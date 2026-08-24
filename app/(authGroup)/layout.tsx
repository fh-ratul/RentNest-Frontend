import { getMe } from "@/service/getMe";

const AuthGroupLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  return (
    <div>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthGroupLayout;