import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menu, Order } from "../lib/models";
import useSWR from "swr";

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: menu } = useSWR<Menu[]>('/menu');

  const orderCreateForm = useForm({
    initialValues: {
      menu_id: "",
      quantity: 1,
      note: "",
    },

    validate: {
      menu_id: (value) => {
        if (!value) return "กรุณาระบุเมนูเครื่องดื่ม";
        return null;
      },
      quantity: (value) => {
        if (!value) return "กรุณาระบุจำนวน";
        if (isNaN(Number(value))) return "จำนวนต้องเป็นตัวเลขเท่านั้น";
        if (Number(value) <= 0) return "จำนวนต้องมากกว่า 0";
        return null;
      },
      note: (value) => {
        if (value && value.length > 500) return "หมายเหตุต้องมีความยาวไม่เกิน 500 ตัวอักษร";
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof orderCreateForm.values) => {
    try {
      setIsProcessing(true);
      await axios.post<Order>(`order`, values);
      notifications.show({
        title: "ทำรายการสำเร็จ",
        message: "รายการสั่งซื้อได้รับการบันทึกเรียบร้อย",
        color: "teal",
      });
      navigate(`/menu`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">สั่งเมนูเครื่องดื่ม</h1>

        <form onSubmit={orderCreateForm.onSubmit(handleSubmit)} className="space-y-8">
          <Select
            label="เลือกเมนู"
            placeholder="เลือกเมนูที่ต้องการ"
            data={menu?.map(menu => ({ value: menu.id.toString(), label: `${menu.name} ${menu.price}฿` })) || []}
            {...orderCreateForm.getInputProps("menu_id")}
          />

          <NumberInput
            label="จำนวน"
            placeholder="จำนวน"
            {...orderCreateForm.getInputProps("quantity")}
            min={1}
          />

          <Textarea
            label="หมายเหตุ"
            placeholder="หมายเหตุ (ถ้ามี)"
            {...orderCreateForm.getInputProps("note")}
          />

          <Divider />

          <Button type="submit" loading={isProcessing}>
            สั่งซื้อ
          </Button>
        </form>
      </Container>
    </Layout>
  );
}