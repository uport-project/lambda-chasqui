export const CREATE_QUERY = `
  INSERT INTO topics(id, expiration) 
  VALUES ($1, now() + interval '$2' second);
`
export const READ_QUERY = `
  SELECT * FROM topics
  WHERE id=$1
  AND expiration > now();
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