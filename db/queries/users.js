const checkUserPassword = (db, username) => {
  return db.query(`
  SELECT *
  FROM users
  WHERE username = $1
  ;`, [username])
  .then(res => res.rows[0])
  .catch(err => err)
}

const checkValidUser = (db, username) => {
  return db.query(`
  SELECT id
  FROM users
  WHERE username = $1
  ;`, [username])
  .then(res => res.rows[0])
  .catch(err => err)
}

module.exports = { checkUserPassword, checkValidUser }