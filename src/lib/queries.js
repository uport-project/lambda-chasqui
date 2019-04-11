module.exports.CREATE_QUERY = `
  INSERT INTO topics(id, expiration) 
  VALUES ($1, now() + ($2 || ' second')::interval);
`
module.exports.READ_QUERY = `
  SELECT * FROM topics
  WHERE id=$1
`
module.exports.UPDATE_QUERY = `
  UPDATE topics 
  SET content = $2 
  WHERE id = $1;
`
module.exports.DELETE_QUERY = `
  DELETE FROM topics
  WHERE id = $1;
`