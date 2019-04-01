export const CREATE_QUERY = `
  INSERT INTO topics(id, expiration) 
  VALUES ($1, now() + ($2 || ' second')::interval);
`
export const READ_QUERY = `
  SELECT * FROM topics
  WHERE id=$1
`
export const UPDATE_QUERY = `
  UPDATE topics 
  SET content = $2 
  WHERE id = $1;
`
export const DELETE_QUERY = `
  DELETE FROM topics
  WHERE id = $1;
`