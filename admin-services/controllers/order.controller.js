const OrderModel = require("../../user-services/models/Order.model");

module.exports.getAllOrders = async(req,res)=>{
    try {
        const orders = await OrderModel.find();
        res.status(200).json({message:"All Order Fetched successfully !",orders});
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
}

module.exports.updateOrderStatus = async(req,res)=>{
    const { orderId, status } = req.body;
    try {
        const order = await OrderModel.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
        res.status(200).json({ message: "Order status updated successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status" });
    }
}

module.exports.cancelOrder = async(req,res)=>{
    const { orderId } = req.body;
    try {
        const order = await OrderModel.findByIdAndUpdate(orderId, { orderStatus: "cancelled" }, { new: true });
        res.status(200).json({ message: "Order cancelled successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order" });
    }
}