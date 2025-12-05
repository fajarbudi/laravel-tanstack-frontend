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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/referensi/kabupaten")({
  component: RouteComponent,
});

export interface kabupaten {
  kabupaten_id?: number;
  kabupaten_nama?: string;
  created_at?: string;
  updated_at?: string;
}

function RouteComponent() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState({
    create: false,
    delete: false,
  });

  const navigate = useNavigate();
  // READ: Mengambil
  const { data: kabupatens, isLoading } = useQuery<kabupaten[]>({
    queryKey: ["kabupaten"],
    queryFn: async () => {
      try {
        const { data, status } = await api.get("referensi/kabupaten");
        if (status != 200) throw new Error("Gagal mengambil artikel");
        return data.data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
  });

  const [formValue, setFormValue] = useState<kabupaten>({});
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };
  //create update
  const saveMutation: UseMutationResult<any, Error, any> = useMutation({
    mutationFn: async (kabupatenData) => {
      try {
        const url = kabupatenData.kabupaten_id
          ? `referensi/kabupaten/${kabupatenData.kabupaten_id}`
          : "referensi/kabupaten";
        const { data, status } = await api.post(url, kabupatenData);

        if (status != 200) throw new Error("Gagal membuat artikel");
        return data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kabupaten"] });
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
        const { data, status } = await api.delete(
          `referensi/kabupaten/${formValue.kabupaten_id}`
        );
        if (status != 200) throw new Error("Gagal menghapus artikel");
        return data;
      } catch (error) {
        navigate({ to: "/auth/login" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kabupaten"] });
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
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Action</TableHead>
                  {/* <TableHead className="text-right">Amount</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {kabupatens?.map((value, i) => (
                  <TableRow key={value.kabupaten_id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      {value.kabupaten_nama}
                    </TableCell>
                    <TableCell>{value.updated_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setModalOpen((prev) => ({ ...prev, create: true }));
                          setFormValue(value);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setModalOpen((prev) => ({ ...prev, delete: true }));
                          setFormValue(value);
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
                  <Label htmlFor="kabupaten_nama">Nama</Label>
                  <Input
                    id="kabupaten_nama"
                    name="kabupaten_nama"
                    defaultValue={formValue?.kabupaten_nama}
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
                  <strong>{formValue.kabupaten_nama}</strong>
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
