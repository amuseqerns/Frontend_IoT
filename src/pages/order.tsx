import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/coffee-1.jpg";
import useSWR from "swr";
import { Order } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function OrderPage() {
  const { data: order, error } = useSWR<Order[]>("/order");

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">รายการสั่งซื้อ</h1>
          <h2>รายการสั่งซื้อเครื่องดื่มทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการ</h1>
          </div>

          {!order && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {order?.map((order) => (
              <div className="border border-solid border-neutral-200" key={order.id}>
                <img
                  src="https://placehold.co/150x200"
                  alt={order.status}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">#{order.id} {order.menu_name}</h2>
                  <p className="text-base ">จำนวน: {order.quantity}</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/order/${order.id}/edit`} size="xs" variant="default">
                    ดูรายละเอียด
                  </Button>
                  
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}