'use client'
import { useParams } from 'next/navigation'
import { order } from '../../utils/order'
const OrderId = () => {
  const params = useParams()
  const orderId = params.id

  // Find the order based on the ID
  const selectedOrder = order.find((item) => item.id === Number(orderId))
  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">
            Order #{selectedOrder?.id}
          </h1>
        </div>
        <div className="h-[35px] border-t border-b mt-4 border-gray-300 flex items-center pl-3">
          <h1 className="text-gray-600">
            {selectedOrder?.date} / Total
            {selectedOrder?.amount.toLocaleString()}
          </h1>
        </div>
        <div className="flex lg:flex-row flex-col lg:justify-between gap-6">
          <div className="flex flex-col overflow-x-auto">
            <div className="lg:w-[700px] w-[160%] flex items-center mt-8 justify-between sm:gap-0">
              <img
                className="h-[80px] w-[100px] rounded-[6px]"
                src={selectedOrder?.image}
                alt="image"
              />
              <div className="flex flex-col">
                <h1 className="text-gray-500 text-[14px] font-medium whitespace-nowrap">
                  Product Name
                </h1>
                <h1 className="text-[15px] whitespace-nowrap">
                  {selectedOrder?.name}
                </h1>
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-500 text-[14px] font-medium">
                  Quantity
                </h1>
                <h1 className="text-[15px]">{selectedOrder?.quantity}</h1>
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-500 text-[14px] font-medium">Price</h1>
                <h1 className="text-[15px]">₦{selectedOrder?.amount}</h1>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-300 sm:w-full w-[160%]"></div>
            <div className="flex items-center justify-between sm:w-full w-[160%] mt-4">
              <h1>Subtotal:</h1>
              <h1>₦{selectedOrder?.amount.toLocaleString()}</h1>
            </div>
            <div className="flex items-center justify-between sm:w-full w-[160%] mt-4">
              <h1>Shipping:</h1>
              <h1>₦{selectedOrder?.shipping.toLocaleString()}</h1>
            </div>
            <div className="flex items-center justify-between sm:w-full w-[160%] mt-4">
              <h1>Tax:</h1>
              <h1>₦{selectedOrder?.tax.toLocaleString()}</h1>
            </div>
            <div className="mt-4 border-t border-gray-300 sm:w-full w-[160%]"></div>
            <div className="flex items-center justify-between sm:w-full w-[160%] mt-4">
              <h1 className="font-bold text-[#fab702] text-[18px]">
                Total Price:
              </h1>
              <h1>
                ₦
                {selectedOrder
                  ? (
                      selectedOrder.amount +
                      selectedOrder.shipping +
                      selectedOrder.tax
                    ).toLocaleString()
                  : 0}
              </h1>
            </div>
            <div className="mt-4 border-t border-gray-300 sm:w-full w-[160%]"></div>
          </div>
          <div className="w-full lg:w-[270px] bg-white mx-auto lg:mt-8 flex flex-col px-4 pb-4">
            <h1 className="font-bold mt-4">Summary</h1>
            <h1 className="text-gray-500 text-[14px]">
              Order ID: {selectedOrder?.orderId}
            </h1>
            <h1 className="text-gray-500 text-[14px]">
              Order Date: {selectedOrder?.date}
            </h1>
            <h1 className="text-gray-500 text-[14px]">
              Order Total: ₦
              {selectedOrder
                ? (
                    selectedOrder.amount +
                    selectedOrder.shipping +
                    selectedOrder.tax
                  ).toLocaleString()
                : 0}
            </h1>
            <h1 className="font-bold mt-7">Shipping Address</h1>
            <h1 className="text-gray-500 text-[14px]">
              {selectedOrder?.shipping_address}
            </h1>
            <h1 className="font-bold mt-7">Payment Method</h1>
            <h1 className="text-gray-500 text-[13px]">
              Pay on Delivery (Cash/Card). Cash on delivery (COD) available.
              Card/Net banking acceptance subject to device availability.
            </h1>
            <h1 className="text-[18px] mt-7 font-semibold">
              Expected Date Of Delivery:
            </h1>
            <h1 className="font-bold">20th October 2025</h1>
            <h1 className="text-[#fab702] font-semibold text-[17px]">Track Order</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderId
