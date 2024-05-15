import React, { useEffect } from 'react';

const PurchaseItem = ({ packages, onPurchase }: { packages: any, onPurchase: any }) => {
    return (
        <div className='w-full h-full flex space-between'>
            {packages && packages.map((packageItem: { packageName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                <div key={index} className="flex flex-wrap justify-between items-center mb-4">
                    <div>
                        <p>{packageItem.packageName}</p>
                        <p>{packageItem.quantity} SkyCoins</p>
                        <p>{packageItem.price} VND</p>
                    </div>
                    <button onClick={() => onPurchase(packageItem)}>Mua Ngay</button>
                </div>
            ))}
        </div>
    );
};

export default PurchaseItem;
