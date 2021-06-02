const getAllCustomers = (db) => {
  return db.query(`
  SELECT customers.id, users.username AS created_by, customers.first_name, customers.last_name, customers.date_created, customers.profession, customers.uid
  FROM customers
  JOIN users ON users.id = customers.created_by
  ;`, [])
  .then(response => response.rows)
  .catch(err => err);
}

const createCustomer = (db, createdBy, firstName, lastName, profession) => {
  return db.query(`
  INSERT INTO customers (created_by, first_name, last_name, date_created, profession)
  VALUES ($1, $2, $3, current_timestamp, $4)
  RETURNING customers.*
  ;`, [createdBy, firstName, lastName, profession])
  .then(res => res.rows[0])
  .catch(err => err);
}

module.exports = { getAllCustomers, createCustomer };