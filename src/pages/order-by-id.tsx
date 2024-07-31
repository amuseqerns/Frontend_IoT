import { Alert, Container, Divider } from "@mantine/core";
import Layout from "../components/layout";
import {useParams } from "react-router-dom";
import { Order } from "../lib/models";
import useSWR from "swr";
import Loading from "../components/loading";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function OrderByIdPage() {
  const { orderId } = useParams();
  const { data: order, isLoading, error } = useSWR<Order>(`/order/${orderId}`);

  return (
    <Layout>
      <Container className="mt-4">
        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {order && (
          <>
            <Divider className="my-6" />
          </>
        )}
      </Container>
    </Layout>
  );
}