package com.example.demo.dao;

import java.util.Date;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.model.CartInfo;
import com.example.demo.model.CartLineInfo;
import com.example.demo.model.CustomerInfo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class OrderDAO {

	@PersistenceContext
	private EntityManager entityManager;

	private int getMaxOrderNum() {
		String sql = "Select max(o.orderNum) from " + Order.class.getName() + " o ";
		TypedQuery<Integer> query = entityManager.createQuery(sql, Integer.class);
		Integer value = query.getSingleResult();
		if (value == null) {
			return 0;
		}
		return value;
	}

	@Transactional(rollbackFor = Exception.class)
	public void saveOrder(CartInfo cartInfo) {
		int orderNum = this.getMaxOrderNum() + 1;
		Order order = new Order();

		order.setOrderNum(orderNum);
		order.setOrderDate(new Date());
		order.setAmount(cartInfo.getAmountTotal());

		CustomerInfo customerInfo = cartInfo.getCustomerInfo();
		order.setCustomerName(customerInfo.getName());
		order.setCustomerEmail(customerInfo.getEmail());
		order.setCustomerPhone(customerInfo.getPhone());
		order.setCustomerAddress(customerInfo.getAddress());

		Set<OrderDetail> orderDetails = new HashSet<>();
		List<CartLineInfo> lines = cartInfo.getCartLines();

		for (CartLineInfo line : lines) {
			OrderDetail detail = new OrderDetail();
			detail.setOrder(order);
			detail.setProductCode(line.getProductInfo().getCode());
			detail.setProductName(line.getProductInfo().getName());
			detail.setAmount(line.getAmount());
			detail.setPrice(line.getProductInfo().getPrice());
			detail.setQuanity(line.getQuantity());
			orderDetails.add(detail);
		}
		order.setOrderDetails(orderDetails);

		entityManager.persist(order);
		entityManager.flush();

		// Order Number!
		cartInfo.setOrderNum(orderNum);
	}

	public Order findOrder(Long orderId) {
		return entityManager.find(Order.class, orderId);
	}
}
