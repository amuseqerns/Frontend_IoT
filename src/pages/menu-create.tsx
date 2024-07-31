import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Menu } from "../lib/models";

export default function MenuCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const menuCreateForm = useForm({
    initialValues: {
      name: "",
      price: "",
      description: "",
    },

    validate: {
      name: (value) => {
        if (typeof value !== 'string') return "ชื่อต้องเป็นข้อความ";
        if (!value.trim()) return "กรุณาระบุชื่อเครื่องดื่ม";
        if (value.length < 2) return "ชื่อเครื่องดื่มต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
        return null;

      },
      price: (value) => {
        if (!value) return "กรุณาระบุราคา";
        if (isNaN(Number(value))) return "ราคาต้องเป็นตัวเลขเท่านั้น";
        if (Number(value) <= 0) return "ราคาต้องมากกว่า 0";
        return null;
      },
      description: (value) => {
        if (value && value.length > 500) return "รายละเอียดต้องมีความยาวไม่เกิน 500 ตัวอักษร";
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof menuCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<Menu>(`menu`, values);
      notifications.show({
        title: "เพิ่มข้อมูลสำเร็จ",
        message: "ข้อมูลถูกเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menu/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
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
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มเมนูเครื่องดื่มในระบบ</h1>

          <form onSubmit={menuCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อเครื่องดื่ม"
              placeholder="ชื่อเครื่องดื่ม"
              {...menuCreateForm.getInputProps("name")}

            />

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              {...menuCreateForm.getInputProps("price")}
              min={0}
            />

            {/* TODO: new */}
            <TextInput
              label="รายละเอียด"
              placeholder="รายละเอียด"
              {...menuCreateForm.getInputProps("description")}
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึก
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}