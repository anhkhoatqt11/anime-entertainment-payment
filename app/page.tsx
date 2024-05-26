"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
} from "@nextui-org/react";
import { useUser } from "@/hooks/useUsers";
import { usePayment } from "@/hooks/usePayment";
import { useRouter } from "next/navigation";
import Header from "./(components)/Header";
import Footer from "./(components)/Footer";

const CURRENCY_FORMAT = new Intl.NumberFormat(undefined, {
  currency: "VND",
  style: "currency",
});

export function formatCurrency(value: number) {
  return CURRENCY_FORMAT.format(value);
}

const Page = () => {
  const { fetchUsersInfoByPhoneNumber } = useUser();
  const {
    uploadVNPAYPaymentInfo,
    uploadZaloPaymentInfo,
    getSkyCoinPackage,
    createPaymentHistory,
  } = usePayment();
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isPackageSelected, setIsPackageSelected] = useState(false); // Boolean to check if a package is selected
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null); // Index of the selected package

  const handleButtonClick = async () => {
    try {
      const res = await fetchUsersInfoByPhoneNumber(phoneNumber);
      setUserInfo(res); // Assuming the response contains user information
      console.log(res); // You can remove this line if you don't need to log the information
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const onPaymentVNPay = async () => {
    const selectedPackage = packages[selectedPackageIndex];
    const createOrder = {
      userId: userInfo.id,
      orderDate: currentDateTime,
      paymentMethod: "VNPay",
      status: "pending",
      price: selectedPackage.price,
      packageId: selectedPackage._id,
    };

    const createOrderSuccess = await createPaymentHistory(createOrder);
    console.log(createOrderSuccess);

    const VNPAY = {
      amount: createOrderSuccess.price,
      bankCode: "",
      language: "vn",
      orderId: createOrderSuccess._id,
    };

    const uploadPaymentSuccess = await uploadVNPAYPaymentInfo(VNPAY);
    router.push(uploadPaymentSuccess.data);
  };

  const onPaymentZaloPay = async () => {
    const selectedPackage = packages[selectedPackageIndex];
    const createOrder = {
      userId: userInfo.id,
      orderDate: currentDateTime,
      paymentMethod: "VNPay",
      status: "pending",
      price: selectedPackage.price,
      packageId: selectedPackage._id,
    };

    const createOrderSuccess = await createPaymentHistory(createOrder);
    console.log(createOrderSuccess);

    const ZaloPay = {
      amount: createOrderSuccess.price,
      orderId: createOrderSuccess._id,
    };

    const uploadPaymentSuccess = await uploadZaloPaymentInfo(ZaloPay);
    router.push(uploadPaymentSuccess.data.response.order_url);
  };

  const onPurchase = async (index: number | React.SetStateAction<null>) => {
    // Logic for purchasing the packageItem goes here
    setSelectedPackageIndex(index);
    console.log("Purchased:", packages[index]);
    setIsPackageSelected(true); // Set the boolean to true when a package is selected
  };

  useEffect(() => {
    fetch("https://worldtimeapi.org/api/timezone/Asia/Bangkok")
      .then((response) => response.json())
      .then((data) => {
        setCurrentDateTime(data.utc_datetime);
      });
  }, []);

  useEffect(() => {
    const getData = async () => {
      const res = await getSkyCoinPackage();
      console.log(res);
      setPackages(res); // Setting the package data
      setisLoading(false);
    };
    getData();
  }, []);

  function clearUserData() {
    setPhoneNumber("");
    setUserInfo(null);
    setSelectedPackageIndex(null);
    setIsPackageSelected(false);
  }

  return (
    <div className="w-full h-full bg-slate-50">
      <Header />
      <div className="w-full h-full flex flex-col items-center justify-center mb-8">
        <img className="h-auto w-full" src="./welcomebanner2.png" alt="" />
        <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg md:-mt-10 p-14 mb-8">
          {userInfo ? (
            <>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-1 mb-3">
                  <h1 className="font-semibold text-fuchsia-500">1.</h1>
                  <h1 className="font-semibold">Nhập số điện thoại của bạn</h1>
                </div>
                <a
                  onClick={() => clearUserData()}
                  className="cursor-pointer font-semibold text-violet-500 text-[14px]"
                >
                  Đổi tài khoản
                </a>
              </div>
              <div className="border-dashed border-2 rounded-sm border-blue-400 bg-blue-50 p-4">
                <p className="text-blue-400 text-[14px] font-semibold mb-2">
                  Họ và tên:{" "}
                  <span className="text-black text-[13px] font-normal">
                    {userInfo.username!}
                  </span>
                </p>
                <p className="text-emerald-500 font-semibold text-[14px]">
                  UserId:{" "}
                  <span className="text-gray-500 font-normal text-[12px]">
                    {userInfo.id!}
                  </span>
                </p>
                {/* <p>ID: {userInfo.id!}</p> */}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-row gap-1 mb-3">
                <h1 className="font-semibold text-fuchsia-500">1.</h1>
                <h1 className="font-semibold">Nhập số điện thoại của bạn</h1>
              </div>
              <div className="flex flex-col">
                <Input
                  className="w-full h-[50px] text-sm"
                  type="number"
                  radius="sm"
                  size="md"
                  variant="bordered"
                  placeholder="Số điện thoại đăng ký"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <div className="flex flex-row gap-1">
                  <p className="text-[12px] font-semibold text-gray-800">
                    Lưu ý:
                  </p>
                  <p className="text-[12px] text-gray-600">
                    Nhập số điện thoại đã đăng ký tài khoản skylark
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Button
                  className="w-1/2 h-[40px] rounded-md mt-4 bg-blue-400 text-white font-bold"
                  onClick={handleButtonClick}
                >
                  Xác nhận
                </Button>
              </div>
            </>
          )}
        </div>

        {userInfo ? (
          <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg p-6 md:p-14 mb-8">
            <div className="flex flex-row gap-1 mb-3">
              <h1 className="font-semibold text-fuchsia-500">2.</h1>
              <h1 className="font-semibold">Chọn gói nạp skycoin</h1>
            </div>
            <div className="flex flex-wrap -mx-4">
              {packages.map((packageItem, index) => (
                <div
                  key={index}
                  className={`w-1/2 sm:w-1/3 md:w-1/4 p-2 cursor-pointer rounded-md ${
                    selectedPackageIndex === index
                      ? "ring-2 ring-emerald-400"
                      : "hover:ring-1 hover:ring-blue-500"
                  }`}
                  onClick={() => onPurchase(index)}
                >
                  <div className="relative bg-slate-50 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex flex-col items-center">
                      <Image
                        src={"/coinpackage.png"}
                        width={100}
                        height={100}
                        alt="Skycoin"
                      />
                      <p className="mt-2 font-medium text-gray-600 text-[12px] sm:text-[13px] md:text-[10px]">
                        {packageItem.packageName}
                      </p>
                      <p className="font-semibold text-black text-[16px] sm:text-[16px] md:text-[14px]">
                        {formatCurrency(packageItem.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {isPackageSelected ? (
          <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg p-14">
            <div className="flex flex-row gap-1 mb-1">
              <h1 className="font-semibold text-fuchsia-500">3.</h1>
              <h1 className="font-semibold">Chọn hình thức thanh toán</h1>
            </div>
            <div className="flex flex-row gap-1 mb-4">
              <p className="text-[12px] text-gray-600">
                <span className="text-[12px] font-semibold text-gray-800">
                  Lưu ý:{" "}
                </span>
                Bạn sẽ được điều hướng đến trang thanh toán sau khi chọn.
              </p>
            </div>
            <div className="flex flex-row row-span-2 gap-6">
              <Button
                onClick={onPaymentVNPay}
                className="bg-blue-400 h-20 w-20 p-0 shadow-md hover:scale-105 transition ease-in-out duration-300 text-white"
              >
                <img className="h-20 w-20" src="./vnpay.jpg" alt="" />
              </Button>
              <Button
                onClick={onPaymentZaloPay}
                className="bg-orange-400 h-20 w-20 p-0 shadow-md hover:scale-105 transition ease-in-out duration-300 text-white"
              >
                <img className="h-20 w-20" src="./zalopay.png" alt="" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
