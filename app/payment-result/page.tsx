"use client";

import React, { useEffect, useState } from "react";
import Header from "../(components)/Header";
import { usePayment } from "@/hooks/usePayment";
import Footer from "../(components)/Footer";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";

const page = () => {
  const { fetchVNPayStatus } = usePayment();
  const [paymentStatus, setPaymentStatus] = useState("");

  const handlePaymentStatus = (status: string) => {
    if (status === "00" || (status.data && status.data.return_code === 1)) {
      setPaymentStatus("completed");
      console.log("completed");
    } else {
      setPaymentStatus("failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentStatus = await fetchVNPayStatus();
        console.log("Payment Status:", paymentStatus);
        handlePaymentStatus(paymentStatus?.code);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full bg-slate-50">
      <Header />
      <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center mb-8">
          <img className="h-auto w-full" src="/welcomebanner2.png" alt="" />
          <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg md:-mt-20 p-4 mb-8">
            <Card className="w-full text-center" radius="sm">
              <div className="p-4">
                <p className="font-semibold text-2xl text-center ">
                  {paymentStatus === "completed"
                    ? "Thanh toán thành công"
                    : "Thanh toán thất bại"}
                </p>
              </div>
              <CardBody className="p-4">
                {paymentStatus === "completed" ? (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <p className="text-center text-emerald-500 font-medium">
                      Bạn đã thanh toán thành công dịch vụ nạp Skycoin
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      Cảm ơn bạn đã chọn Skylark
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-red-500 font-medium">
                    Đã xảy ra lỗi trong quá trình thanh toán.
                  </p>
                )}
              </CardBody>
              <CardFooter className="flex justify-center"></CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
