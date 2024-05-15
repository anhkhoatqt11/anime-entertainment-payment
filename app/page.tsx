"use client";

import React, { useEffect, useState } from 'react';
import { Button, Image, Input } from '@nextui-org/react';
import { useUser } from '@/hooks/useUsers';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from "next/navigation";
import Header from './(components)/Header';
import { RiCheckboxCircleFill } from 'react-icons/ri'; // Importing the blue check icon

const Page = () => {
  const { fetchUsersInfoByPhoneNumber } = useUser();
  const { uploadVNPAYPaymentInfo, uploadZaloPaymentInfo, getSkyCoinPackage, createPaymentHistory } = usePayment();
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null); // Index of the selected package

  const handleButtonClick = async () => {
    try {
      const res = await fetchUsersInfoByPhoneNumber(phoneNumber);
      setUserInfo(res); // Assuming the response contains user information
      console.log(res); // You can remove this line if you don't need to log the information
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const onPaymentVNPay = async () => {
    const selectedPackage = packages[selectedPackageIndex];
    const createOrder = {
      userId: userInfo.id,
      orderDate: currentDateTime,
      paymentMethod: "VNPay",
      status: 'pending',
      price: selectedPackage.price,
      packageId: selectedPackage._id,
    }

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
  }

  const onPaymentZaloPay = async () => {

    const selectedPackage = packages[selectedPackageIndex];
    const createOrder = {
      userId: userInfo.id,
      orderDate: currentDateTime,
      paymentMethod: "VNPay",
      status: 'pending',
      price: selectedPackage.price,
      packageId: selectedPackage._id,
    }

    const createOrderSuccess = await createPaymentHistory(createOrder);
    console.log(createOrderSuccess);

    const ZaloPay = {
      amount: createOrderSuccess.price,
      orderId: createOrderSuccess._id,
    };

    const uploadPaymentSuccess = await uploadZaloPaymentInfo(ZaloPay);
    router.push(uploadPaymentSuccess.data.response.order_url);
  }

  const onPurchase = async (index) => {
    // Logic for purchasing the packageItem goes here
    setSelectedPackageIndex(index);
    console.log('Purchased:', packages[index]);
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
    setPhoneNumber('');
    setUserInfo(null);
    setSelectedPackageIndex(null);
  }

  return (
    <div className='w-full h-full bg-slate-50'>
      <Header />
      <div className='w-full h-full min-h-screen flex flex-col items-center justify-center'>
        <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-14 mb-8">
          {userInfo ? (
            <>
              <div className='flex flex-row justify-between'>
                <h1 className="font-bold mb-2">1. Nhập số điện thoại của bạn</h1>
                <a onClick={() => clearUserData()} className='cursor-pointer'>Lựa chọn tài khoản khác</a>
              </div>
              <div className='border-dashed border-2 border-pink-400 bg-pink-100 p-4'>
                <p className='text-pink-400'>Họ và tên:  <span className='text-black'>{userInfo.username!}</span></p>
                {/* <p>ID: {userInfo.id!}</p> */}
              </div>
            </>
          ) : (
            <>
              <h1 className="font-bold mb-2">1. Nhập số điện thoại của bạn</h1>
              <Input
                type="number"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button className='w-full mt-4' onClick={handleButtonClick}>Xác nhận</Button>
            </>
          )}
        </div>

        {userInfo ? (
          <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-14 mb-8">
            <h1 className="font-bold mb-2">2. Chọn gói cần nạp</h1>
            <div className='flex flex-wrap justify-between'>
              {packages.map((packageItem, index) => (
                <div key={index} onClick={() => onPurchase(index)} style={{ cursor: 'pointer', position: 'relative' }}>
                  <Image src={'./skycoin.png'} width={100} height={100} />
                  <p>{packageItem.packageName}</p>
                  <p>Số lượng: {packageItem.quantity}</p>
                  <p>Giá tiền: {packageItem.price}đ</p>
                  {selectedPackageIndex === index && (
                    <RiCheckboxCircleFill className="text-blue-500 absolute top-0 right-0 mt-1 mr-1" size={24} />
                  )} {/* Display blue check icon if the item is chosen */}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {selectedPackageIndex ? (
          <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-14">
            <h1 className="font-bold mb-2">3. Chọn phương thức thanh toán</h1>
            <Button onClick={onPaymentVNPay}>
              VNPay
            </Button>
            <Button onClick={onPaymentZaloPay}>
              ZaloPay
            </Button>
          </div>
        ) : null}

      </div>
    </div >
  );
};

export default Page;