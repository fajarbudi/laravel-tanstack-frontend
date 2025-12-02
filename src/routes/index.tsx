import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/axios";
import BaseLayout from "@/layout/base";
import LoadingScreen from "@/components/loadingScreen";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export const Route = createFileRoute("/")({
  component: App,
});
function App() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState({
    create: false,
    delete: false,
  });

  const navigate = useNavigate();
  // READ: Mengambil
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data, status } = await api.get("/user");
        if (status != 200) throw new Error("Gagal mengambil artikel");
        return data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
  });

  const [formValue, setFormValue] = useState<User>({});
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  //create update
  const saveMutation: UseMutationResult<any, Error, any> = useMutation({
    mutationFn: async (userData) => {
      try {
        const url = userData.id ? `/user/${userData.id}` : "/user";
        const { data, status } = await api.post(url, userData);

        if (status != 200) throw new Error("Gagal membuat artikel");
        return data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setModalOpen((prev) => ({ ...prev, create: false }));
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  //delete data
  const delMutation: UseMutationResult<any, Error, any> = useMutation({
    mutationFn: async () => {
      try {
        const { data, status } = await api.delete(`/user/${formValue.id}`);
        if (status != 200) throw new Error("Gagal menghapus artikel");
        return data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setModalOpen((prev) => ({ ...prev, delete: false }));
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <BaseLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
        <Card className="px-4 lg:px-6">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>
              <Button
                variant="outline"
                onClick={() => {
                  setFormValue({});
                  setModalOpen((prev) => ({ ...prev, create: true }));
                }}
              >
                Tambah Data
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="w-full">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Action</TableHead>
                  {/* <TableHead className="text-right">Amount</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.updated_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setModalOpen((prev) => ({ ...prev, create: true }));
                          setFormValue(user);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setModalOpen((prev) => ({ ...prev, delete: true }));
                          setFormValue(user);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    {/* <TableCell className="text-right">
                    {user.totalAmount}
                  </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
            </Table>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        <Dialog open={modalOpen.create}>
          <form>
            <DialogContent
              className="sm:max-w-1/3 fixed top-[5%] translate-y-0"
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                {/* <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription> */}
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    defaultValue={formValue?.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    defaultValue={formValue.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    defaultValue={formValue.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setModalOpen((prev) => ({ ...prev, create: false }));
                  }}
                >
                  Kembali
                </Button>
                <Button onClick={() => saveMutation.mutate(formValue)}>
                  Simpan
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <Dialog open={modalOpen.delete}>
          <form>
            <DialogContent className="sm:max-w-1/5" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Delete Data</DialogTitle>
              </DialogHeader>
              <div>
                <p className="text-center">Anda akan menghapus data</p>
                <p className="text-center">
                  <strong>{formValue.name}</strong>
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setModalOpen((prev) => ({ ...prev, delete: false }));
                  }}
                >
                  Kembali
                </Button>
                <Button onClick={() => delMutation.mutate(formValue)}>
                  Simpan
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </BaseLayout>
  );
}
