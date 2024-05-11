import { Button } from '@nextui-org/react'
import React from 'react'

const PurchaseItem = () => {
    return (
        <div className='w-full h-full flex space-between'>
            <p>Gói 100 Sky Coin|</p>
            <p>100.000đ|</p>
            <Button>
                MUA NGAY
            </Button>
        </div>
    )
}

export default PurchaseItem