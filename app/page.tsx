"use client";

import React, { useState } from 'react';
import { Button, Image, Input } from '@nextui-org/react';
import { useUser } from '@/hooks/useUsers';
import PurchaseItem from './(components)/PurchaseItem';

const Page = () => {
  const { fetchUsersInfoByPhoneNumber } = useUser();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const handleButtonClick = async () => {
    try {
      const res = await fetchUsersInfoByPhoneNumber(phoneNumber);
      setUserInfo(res); // Assuming the response contains user information
      console.log(res); // You can remove this line if you don't need to log the information
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  return (
    <div className='w-full h-full'>
      <div className="flex flex-row">
        <Image src='./logoImage.png' alt='NextUI' width={50} height={50} />
        <p className='ml-3 mt-3'>Skylark | Portal nạp Sky Coins</p>
      </div>
      <Input
        type="number"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button onClick={handleButtonClick}>Xác nhận</Button>
      {userInfo && (
        <div>
          <p>Username: {userInfo.username!}</p>
          <p>ID: {userInfo.id!}</p>
        </div>
      )}
      <PurchaseItem/>
    </div>
  );
};

export default Page;