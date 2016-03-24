--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = projet, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: images; Type: TABLE; Schema: projet; Owner: {{owner}}; Tablespace: 
--

CREATE TABLE images (
    url character varying(2000) NOT NULL,
    thumbnail character varying(2000),
    title character varying(128),
    keywords character varying(128),
    licence character varying(8),
    author character varying(128),
    id integer NOT NULL,
    size character varying(128),
    mime_type character varying(32),
    category character varying(128),
    page character varying(2000)
);


ALTER TABLE projet.images OWNER TO {{owner}};

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: projet; Owner: {{owner}}
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE projet.images_id_seq OWNER TO {{owner}};

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: projet; Owner: {{owner}}
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: id; Type: DEFAULT; Schema: projet; Owner: {{owner}}
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: projet; Owner: {{owner}}; Tablespace: 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: images_url_key; Type: CONSTRAINT; Schema: projet; Owner: {{owner}}; Tablespace: 
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_url_key UNIQUE (url);


--
-- PostgreSQL database dump complete
--

