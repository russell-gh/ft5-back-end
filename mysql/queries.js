const addUser = (email, password) => {
  return `INSERT INTO users (email, password)
                   VALUES
                    ("${email}", "${password}");`;
};

const getId = (email, password) => {
  return `SELECT id FROM users 
                    WHERE email LIKE "${email}" AND password LIKE "${password}";`;
};

const addToken = (user_id, token) => {
  return `INSERT INTO tokens (user_id, token)
                        VALUE
                             (${user_id}, "${token}");`;
};

const getIdFromToken = (token) => {
  return `SELECT user_id 
                FROM tokens
                    WHERE token LIKE "${token}";`;
};

const setSecret = (id, secret) => {
  return `UPDATE users
                SET secret = "${secret}"
                    WHERE id = ${id};`;
};

module.exports = { addUser, getId, addToken, getIdFromToken, setSecret };
