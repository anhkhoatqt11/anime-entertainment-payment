"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input } from '@nextui-org/react';
import { useUser } from '@/hooks/useUsers';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from "next/navigation";
import Header from './(components)/Header';
import { RiCheckboxCircleFill } from 'react-icons/ri'; // Importing the blue check icon


const CURRENCY_FORMAT = new Intl.NumberFormat(undefined, {
  currency: "VND",
  style: "currency",
});


export function formatCurrency(value: number) {
  return CURRENCY_FORMAT.format(value);
}

const Page = () => {
  const { fetchUsersInfoByPhoneNumber } = useUser();
  const { uploadVNPAYPaymentInfo, uploadZaloPaymentInfo, getSkyCoinPackage, createPaymentHistory } = usePayment();
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const onPurchase = async (index: number | React.SetStateAction<null>) => {
    // Logic for purchasing the packageItem goes here
    setSelectedPackageIndex(index);
    console.log('Purchased:', packages[index]);
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
              <div className='border-dashed border-2 border-blue-400 bg-blue-100 p-4'>
                <p className='text-blue-400'>Họ và tên:  <span className='text-black'>{userInfo.username!}</span></p>
                {/* <p>ID: {userInfo.id!}</p> */}
              </div>
            </>
          ) : (
            <>
              <h1 className="font-bold mb-2">1. Nhập số điện thoại của bạn</h1>
              <div className='flex flex-row'>
                <Input
                  className='w-full'
                  type="number"
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại của bạn"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button className='w-full mt-4 bg-blue-400 text-white font-bold' onClick={handleButtonClick}>Xác nhận</Button>
            </>
          )}
        </div>

        {userInfo ? (
          <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-6 md:p-14 mb-8">
            <h1 className="text-xl font-bold mb-4">2. Chọn gói cần nạp</h1>
            <div className='flex flex-wrap -mx-4'>
              {packages.map((packageItem, index) => (
                <div
                  key={index}
                  className={`w-full sm:w-1/2 md:w-1/3 px-4 mb-4 cursor-pointer ${selectedPackageIndex === index ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}`}
                  onClick={() => onPurchase(index)}
                >
                  <div className="relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold">{packageItem.packageName}</h2>
                      {selectedPackageIndex === index && (
                        <RiCheckboxCircleFill className="text-blue-500" size={24} />
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={'/skycoin.png'} width={100} height={100} alt="Skycoin" />
                      <p className="mt-2">Số lượng: {packageItem.quantity}</p>
                      <p>Giá tiền: {formatCurrency(packageItem.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {isPackageSelected ? (
          <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-14">
            <h1 className="font-bold mb-2">3. Chọn phương thức thanh toán</h1>
            <p className='font-medium mb-2'>Bạn sẽ được điều hướng đến trang thanh toán của đối tác cung cấp dịch vụ.</p>
            <div className='flex flex-row row-span-2 gap-3'>
              <Button onClick={onPaymentVNPay} className='bg-blue-400 text-white'>
                VNPay
              </Button>
              <Button onClick={onPaymentZaloPay} className='bg-orange-400 text-white'>
                ZaloPay
              </Button>
            </div>

          </div>
        ) : null}

      </div>
    </div >
  );
};

export default Page;