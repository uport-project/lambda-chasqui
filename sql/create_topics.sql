-- Table: public.topics

-- DROP TABLE public.topics;

CREATE TABLE public.topics
(
    id VARCHAR(50) NOT NULL, --Funding account address
    content text, -- Contents of the topic
    CONSTRAINT topics_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.topics
  OWNER TO root;
