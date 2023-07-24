const { Order } = require("./../modal/OrderModal");

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  // filter:{"category":["smartphone", "leptops]"}
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}

  let query = Order.find({ deleted: { $ne: true } });
  //aevi product ke je detete thaei na hoy mongodb ni query
  let totalOrdersQuery = Order.find({});

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  // fronend ma pagination mate total doc ni query hati te mate X-total count
  //   exec atle execute
  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  try {
    // uppar ni query ne exec karvani
    const docs = await query.exec();
    // frontend na X-Total-Count mate 6e
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
    // console.log(response);
  } catch (err) {
    res.status(400).json(err);
  }
};
