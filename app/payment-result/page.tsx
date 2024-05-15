"use client";

import React, { useEffect, useState } from 'react'
import Header from '../(components)/Header'
import { usePayment } from '@/hooks/usePayment'

const page = () => {

    const { fetchVNPayStatus } = usePayment();
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePaymentStatus = (status: string) => {
        if (status === '00' || (status.data && status.data.return_code === 1)) {
            setPaymentStatus('completed');
        } else {
            setPaymentStatus('failed');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const paymentStatus = await fetchVNPayStatus();
                console.log('Payment Status:', paymentStatus);
                handlePaymentStatus(paymentStatus?.code);

                // const fetchOrderData = async () => {
                //     try {
                //         const orderInfo = await fetchOrderInfo(paymentStatus?.orderId);
                //         console.log('Order Info:', orderInfo);
                //         setOrder(orderInfo);
                //     } catch (error) {
                //         console.error('Error fetching order info:', error);
                //     }
                // };
                // fetchOrderData();
            } catch (error) {
                console.error('Error fetching payment status:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <div className='w-full h-full bg-slate-50'>
            <Header />
            <div className='w-full h-full min-h-screen flex flex-col items-center justify-center'>
                <div className="w-full max-w-screen-md bg-white rounded-md shadow-sm p-8 mb-14">

                    {paymentStatus === 'completed' && <h1 className='text-2xl font-bold'>Thanh toán thành công</h1>}
                    {paymentStatus === 'failed' && <h1 className='text-2xl font-bold'>Thanh toán thất bại</h1>}

                </div>
            </div>
        </div>
    )
}

export default page